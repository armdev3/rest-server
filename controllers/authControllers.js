const {response,request} = require('express'); //extra de express
const bcryptjs = require('bcryptjs');

//importamos el modelo de usuario
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');




const login = async (req, res = response) => {

    const {
        correo,
        password
    } = req.body;

    try {

        //Comprobar correo
        const usuario = await Usuario.findOne({
            correo
        }) //pasamos el correo

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / correo no existe -correo'
            })

        }

        //usuario activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / estado no Activo -estado false'
            })

        }




        //comprobar la contraseña
        const validarPassword = bcryptjs.compareSync(password, usuario.password); //devuelve un bool true correcto




        if (!validarPassword) {
            return res.status(400).json({
                msg: `Usuario / Password no es correcto -password ${password}`


            })

        }




        //generar un json webtokem
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el adminstrador'
        })

    }


}

//validacion del token de google  y comprobar en nuestro backend
const googleSinIn = async (req, res = response) => {

    //recibimos el token del frotend
    const { id_token } = await req.body;

    try {

        //obtenemos los datos comprobando el token recibido con google
         const {nombre, img, correo} = await googleVerify(id_token);

         //hacemos la busqueda el usuario en bases de datos por el correo
         let usuario = await Usuario.findOne({correo});

         if(!usuario){
            //sino existe el usuario lo creamos
            const data ={
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google:true
            }

            usuario = new Usuario(data);

            //Guardamos los datos
            await usuario.save();

         }

         //Si el usuario en DB esta eliminado o bloquedo
         if(!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el administrador'
            })
         }


         //Si tos esta correcto generamos un jwt

        //generar un json webtokem
        const token = await generarJWT(usuario.id);

         
        //devolvemos los datos que se recibio correctemente
        res.json({
           usuario,
            token
        })

    } catch (error) {

       res.status(400).json({
        msg:'El token no fue valido'

       })

    }

}




module.exports = {
    login,
    googleSinIn

}
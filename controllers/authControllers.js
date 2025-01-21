const {
    response,
    request
} = require('express'); //extra de express
const bcryptjs = require('bcryptjs');

//importamos el modelo de usuario
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
   



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
        const validarPassword = bcryptjs.compareSync(password,usuario.password); //devuelve un bool true correcto

     
      

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


module.exports = {
    login

}
//extraemos de express
const {
    response,
    request,
    query
} = require('express'); //extra de express

//utilizamos bcrypt para cifrar contraseñas
const bcrypt = require('bcryptjs');

//importamos nuestro modelo
const Usuario = require('../models/usuario');

/********GET**************** */
const usuariosGet = async (req = request, res = response) => {

    //req.query acceder a los parámetros de consulta en la URL, que aparecen después del signo de interrogación (?) ejmplo url?mensaje='hola'
    // const {q, mnombre = 'no name', apikey, page,limit } = req.query;
   
    const {limite =5, desde = 0} = req.query;
   

    // const usuarios = await Usuario.find( { estado:true } )//filtramos la buesqueda del estado
    // .skip(Number(desde))//omite un número específico de documentos al inicio de los resultados
    // .limit(Number(limite));

    // //Contabilizamos los usuarios que existen en la bases de datos
    // const total = await Usuario.countDocuments({ estado:true });


    //Promise.all para ejecutar varias await a l vez
    //obetenemos los dats con la desestructracion de arregloss
    const[total, usuarios]= await Promise.all([
         //Contabilizamos los usuarios que existen en la bases de datos
        Usuario.countDocuments({ estado:true }),
        Usuario.find( { estado:true } )//filtramos la buesqueda del estado
            .skip(Number(desde))//omite un número específico de documentos al inicio de los resultados
            .limit(Number(limite))

    ])

  

    res.json({
       total,
       usuarios
    });


}



/********POST*****Crear************/
const usuariosPost = async (req, res = response) => {



    // req es lo que recibimos del cliente
    const {
        nombre,
        correo,
        password,
        rol
    } = req.body; // Desestructuramos lo que recibimos del req.body

    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    }); //creamos una instancia de usuario pasando los datos del request

    //las comprobaciones de los datos se hacen directamente en la ruta pasados como parametros desde el middleware


    //Encriptar la constraseña
    const salt = bcrypt.genSaltSync(); //salt numero de vueltas de cifrado por defecto son 10 vueltas de cifrado
    usuario.password = bcrypt.hashSync(password, salt); //hasheamos el password y el numero de vueltas de encriptacio

    //Guardar en bases de datos
    await usuario.save();

    //si todo esta correcto devolvemos los datos
    res.status(201).json({
        msg: 'post  API - controlador',
        // nombre, edad  //mostramos las variables recibidas
        usuario
    })
}

/********PUT**Actualizar***************/
const usuariosPut = async (req, res = response) => {


    //recogemos el valor del parametro definido en la ruta ejmplo Ruta definida: /users/:id
    const id = req.params.id;

    //extraemos y excluimos los datos de resto, lo demas se queda en resto
    const { _id, password, google, correo, ...resto } = req.body;

    
    //Todo: validar en bases de datos
    if (password) {
        //Encriptar la constraseña
        const salt = bcrypt.genSaltSync(); //salt numero de vueltas de cifrado por defecto son 10 vueltas de cifrado
        resto.password = bcrypt.hashSync(password, salt); //hasheamos el password y el numero de vueltas enci

    }




    //busca y actualiza y asigna los datos en usuario
    const usuario = await Usuario.findByIdAndUpdate( id,resto );

    //devolvemos los datos
    res.json(usuario);
}

/********PATCH*****************/
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

/********DELETE*****************/
const usuariosDelete = async (req, res = response) => {

    const { id }= req.params;
    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //la mejor forma es no eliminar sino cambiar el estado del usuario

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json(
       usuario
    )
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
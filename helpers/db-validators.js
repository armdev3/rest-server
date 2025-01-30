
//importamos el modelo de rol y de usuario para poder realizar las validaciones
const Role = require('../models/role');
const Usuario = require('../models/usuario')


const essRolvalido = async (rol = '') => { //revisamos el rol con check y se lo pasasmo a custom que es una validacion personalizada, por default lo ponemos en vacio

    //buscamos en la bases de datos si existe el rol
    const existeRol = await Role.findOne({
        rol
    });

    //sino existe devuelve error
    if (!existeRol) {
        //mostramos error
        throw new Error(`El rol ${ rol} no está regitrado en la bases de datos`);


    }

}


/***********Comporacion de los datos del email******************** */
const emailExiste = async (correo = '') => {


    //Comprobar si el correo existe
    const existeEmail = await Usuario.findOne({
        correo
    }); //buscamos en la base de datos de mongoDB

    if (existeEmail) { //si ya existe email
        //devolvemos el error msg:
        throw new Error(`El correo: ${correo} ya esta registrado`);
        

    }

}



/***********Comprobacion del id del usuar******************** */
const existeUsuarioId = async (id = '') => {


    //Comprobar si el correo existe
    const existeUsuario = await Usuario.findById(id); //buscamos en la base de datos de mongoDB

    if ( !existeUsuario ) { //si es null
        //devolvemos el error msg:
        throw new Error(`El usuario con el id: ${id}, No existe`);
        

    }

}



module.exports = {
    essRolvalido,
    emailExiste,
    existeUsuarioId
}
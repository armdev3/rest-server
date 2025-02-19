
//importamos el modelo de rol y de usuario para poder realizar las validaciones
const {Role, Usuario, Categoria, Producto} = require('../models');

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


/**************categorias************ */

//funcion para comprobar el id
let isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const existeCategoriaId = async (id = '') => {
    if (!isValidObjectId(id)) {
        throw new Error(`El id: ${id} no es un id válido`);
    }

    try {
        const existeCategoria = await Categoria.findById(id);
        
        if (!existeCategoria) {
            throw new Error(`La categoría con el id: ${id} no existe`);
        }
        return true;
    } catch (error) {
        console.error('Error al buscar la categoría:', error);
        throw new Error(`Error al buscar la categoría: ${error.message}`);
    }
};


/*********Validar id de producto******************************** */
isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const existeProductoId = async (id ='')=>{

    if (!isValidObjectId(id)) {
        throw new Error(`El id: ${id} no es un id válido`);
    }

    try {
        const existeProducto = await Producto.findById(id);
        
        if (!existeProducto) {
            throw new Error(`El producto con el id: ${id} no existe`);
        }
        return true;
    } catch (error) {
        console.error('Error al buscar El producto:', error);
        throw new Error(`Error al buscar la categoría: ${error.message}`);
    }

}


/********comprobar priducto y categoria************* */
const comprobarProductoCategoria = async (req, producto, categoria)=>{
     //buscamos en bases de datos si existe
     const productoDB = await Producto.findOne({ nombre: producto });
 

     if (productoDB) {
        throw new Error(`El producto ${productoDB.nombre} ya existe`);
    }

 //Comprobamos si existe la categoria
 const resultado = await Categoria.findOne({ nombre: categoria });


    // Si no hay resultado mostramos error
    if (!resultado) {
        throw new Error(`No existe ninguna categoría: ${categoria}`);
    }

  
    //ALmaceno el valor eb la variable del request para luego recuperar el valor
    req.categoriaId = resultado._id;
    

 return true;

}





module.exports = {
    essRolvalido,
    emailExiste,
    existeUsuarioId,
    existeCategoriaId,
    existeProductoId,
    comprobarProductoCategoria
}
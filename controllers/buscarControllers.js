const {
    response
} = require('express');

//de monngoose obtenemos el objectId
const {
    ObjectId
} = require('mongoose').Types

const {
    Usuario,
    Categoria,
    Producto
} = require('../models');
const categoria = require('../models/categoria');



//colocamos todas las colecciones permitidas dentro de un array para despues realizar la buesqueda cib
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    //comprobamos si el termino es un id de mongo valido con la funcion isValid
    const esMongoId = ObjectId.isValid(termino); // devuelve true

    //si es un id mongo valido
    if (esMongoId) {

        //realizamos la busqueda por id en base de datos
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario] : []

        });



    }

    //Expresion regular para realizar busquedas isensitive case
    const regex = new RegExp(termino, 'i');

    //realizamo la busques por nombre o correo
    const usuarios = await Usuario.find({
        //realizamo la busqueda por nombre o correo
        //esto es un or de mongo
        $or: [{nombre: regex,}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: (usuarios) ? [usuarios] : []
    });

}


const buscarCategorias = async (termino = '', res = response) => {

    //comprobamos si el termino es un id de mongo valido con la funcion isValid
    const esMongoId = ObjectId.isValid(termino); // devuelve true

    //si es un id mongo valido
    if (esMongoId) {

        //realizamos la busqueda por id en base de datos
        const categorias = await categoria.findById(termino);
                          
                         

        return res.json({
            results: (categorias) ? [categorias] : []

        });


    }

    //Expresion regular para realizar busquedas isensitive case
    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado:true});

    res.json({
        results: (categorias) ? [categorias] : []
    });

}


const buscarProductos = async (termino = '', res = response) => {

    //comprobamos si el termino es un id de mongo valido con la funcion isValid
    const esMongoId = ObjectId.isValid(termino); // devuelve true

    //si es un id mongo valido
    if (esMongoId) {

        //realizamos la busqueda por id en base de datos
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
                      

        return res.json({
            results: (producto) ? [producto] : []

        });



    }

    //Expresion regular para realizar busquedas isensitive case
    const regex = new RegExp(termino, 'i');
    const producto = await Producto.find({nombre: regex, estado:true})
                    .populate('categoria', 'nombre');

    res.json({
        results: (producto) ? [producto] : []
    });

}



//realizamos la busqueda 
const buscar = (req, res = response) => {

        
 
        //obtenemos los parametros de la url
        const {
            coleccion,
            termino
        } = req.params;


        //comprobamos que el nombre de la busqueda este dentro de la coleccion
        if (!coleccionesPermitidas.includes(coleccion)) {
           return  res.status(400).json({
                msg: `las colecciones permitidas son ${coleccionesPermitidas}`
            })

        }





        //realizamos la busqueda si el nombre de la coleccion es correcto
        switch (coleccion) {
            case 'usuarios':
                buscarUsuarios(termino, res);

                break;
            case 'categorias':
                buscarCategorias(termino, res);
                break;
            case 'productos':
                buscarProductos(termino, res);
                break;

            default:
                //prblema del servidor
                res.status(500).json({
                    msg: 'se me olvido de hacer esta busqueda'

                })

        }



}

module.exports = {
    buscar
}
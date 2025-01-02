//extraemos de express
const {
    response,
    request
} = require('express');

const usuariosGet = (req = request, res = response) => {

    const {q, nombre = 'no name', apikey, page, limit} = req.query;


    res.json({
        msg: 'get API - controlador',
        q, nombre, apikey, page, limit
    })
}


const usuariosPost = (req, res = response) => {

    //con req es lo que recibimos del cliente
    const {
        nombre,
        edad
    } = req.body; //desectructuramos

    res.status(201).json({
        msg: 'post  API - controlador',
        body
    })
}

const usuariosPut = (req, res = response) => {


    //recogemos el valor de la varible enviada en la url
    const id = req.params.id;

    res.status(500).json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete  API - controlador'
    })
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
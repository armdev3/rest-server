const {
    response
} = require("express");
const role = require("../models/role");


const esAdminRole = (req, res = response, next) => {

    //aprovechamos la validacion de l json webtoken que ya tiene los datos del usuario en la request
    if (!req.usuario) {
        res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el tikeb primero'
        });
    }


    const {
        rol,
        nombre
    } = req.usuario;

    if (rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador-No tiene privilegios`
        })
    }


    next();

}


//los parametros los colocamos como rest operator para que pasen como un array
const tieneRol = (...roles) => {
    //devolvemos una funcion 
    return (req, res = response, next) => {

        //comprobamos si el usuario existe
        if (!req.usuario) {
            res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el tikeb primero'
            });
        }

        //si el rol del usuario no coincide con los roles actuales
        if(!roles.includes( req.usuario.rol)){

            return res.status(401).json({
                msg:`el servicio require uno de estos roles ${roles}`
            })

        }



        next();

    }

}



module.exports = {
    esAdminRole,
    tieneRol

}
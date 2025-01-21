const {request, response } = require('express');
const jwt = require('jsonwebtoken');

//Cargamos los datos del usuartio en la validacion de jsoWebtoken
const Usuario = require('../models/usuario');



const validarJWT = async (req= request,res=response, next)=>{

    //leemos los headersm donde recibimos el token
    const token = req.header('x-token');

   if(!token){
    return res.status(401).json({
        msg:'No hay token en la peticion'
    })
   }



   try {

    //hacemos el match dl json webtoken
    //esto es lo que devuel verify si esta todo correcto { uid: '678b7fbf83661cadfa886ada', iat: 1737373983, exp: 1737388383 }
   const {uid} =  jwt.verify(token, process.env.SECRETTOPRIVATEKEY);//y node devolvera los datos de toke

   //leer usuario completo se lo pasamo al reques en una nueva propiedada
   const usuario = await Usuario.findById(uid);

   //si usuario no existe
      //comprbar el estado del usuario sea true
      if(!usuario){
        return res.status(401).json({
          msg:'token no valido - Usuario no existe DB'
        })
    }

   //comprbar el estado del usuario sea true
   if(!usuario.estado){
       return res.status(401).json({
         msg:'token no valido - usuario estado false'
       })
   }

  //creamos una nueva propiedad en el request dende le asignamos el valor del usuario
   req.usuario = usuario;


    next();
    
   } catch (error) {

    console.log(error);

    res.status(401).json({
        msg:'Token no valido'
    })
    
   }

 

}

module.exports = {
    validarJWT

}
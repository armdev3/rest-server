//validar result comprueba los resultados
const { validationResult } = require('express-validator');


//psamos los mismos request y response
const validarCampos = (req, res, next)=>{//next indica sobre los middleware, si ya evaluo el primero pasa al siguiente controlador

      //validamos los datos
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json( errors );
    
        } 

  next();

}

module.exports = {
    validarCampos
}
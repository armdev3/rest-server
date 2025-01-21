const  validarCampos  = require('./validar-campos');
const  validarJWT  = require('./validar-jwt');
const  validaRoles = require('./validar-roles');


//los exportamos como un spred operator
module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}
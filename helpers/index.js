const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleverify = require('./google-verify');
const subirarchivo = require('./subir-archivo');


module.exports ={
    ...dbValidators,
    ...generarJWT,
    ...googleverify,
    ...subirarchivo
}
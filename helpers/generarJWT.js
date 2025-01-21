const jwt = require('jsonwebtoken');


//pasamo el uid
const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        //creamos nuestro object literal donde le pasamo la informacion que queramos, pro por segurida evitar pasar contraseñas
        const payload = {
            uid: uid
        };

        //firmamos token: pasando el id de usuario, nuestra clave secreta que hayamos creado y la fecha de caducidad del token
        jwt.sign( payload, process.env.SECRETTOPRIVATEKEY,{ 
            expiresIn:'4h'
        },(err, token)=>{
                if(err){
                    console.log(err);
                    reject('no se pudo generar el token')
                }else{
                    resolve(token);
                }
        }
    );


    });

}

module.exports = {
    generarJWT
}
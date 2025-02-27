const path = require('path'); //metodo de path de node
const { v4: uuidv4 } = require('uuid');

//vamos a trabajar con promesas para la parte de la funcion de la subida de archivo
const subirarchivo = (files, extensionesValidas = ['png', 'jpg', 'jpge', 'gif'], carpeta = '') => {

    return new Promise ((resolve, reject)=>{

        const { archivo } = files;

        //Identificar la extension del archivo que  subimos
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
    
    
        if (!extensionesValidas.includes(extension)) {
            return  reject(`La extension ${ extension }, no es permitida - ${extensionesValidas}`);
           
        }
    
    
        //Subida de archivos
        const nombreTemporal = uuidv4() + '.' + extension; //generamos un nombre unico con uuid y le concatenamos la extension
    
        //updloads es la ruta relativa  y carpeta es un subdirectorio
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);
    
        archivo.mv(uploadPath, function (err) {
            if (err) {
                return reject(err);
            }
    
            resolve(nombreTemporal);
        });
    

    });

   

}

module.exports = {
    subirarchivo
}


const validarArchivo = (req, res, next)=>{

      //comprobamos que recibamos un archivo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: 'No hay archivos en la peticion - validarArchivo'
    });
    
  }

  next();

}


module.exports = {
    validarArchivo
}
const path = require('path');//esto viene con node
const fs = require('fs');//esto vien con node


//importamos cloudDinary
const cloudinary = require('cloudinary').v2;

//autenticacion a traves de nuesta variable de entorno
cloudinary.config(process.env.CLOUDINARY_URL);


const {response} = require('express');
const {subirarchivo} = require('../helpers');
const { Usuario, Producto }= require('../models');


/********cargar ficheros************ */
const cargarArchivo = async (req, res = response) => {

  try {
     
    //Imagenes
    const nombre = await subirarchivo(req.files,undefined, 'imgs');
    res.json({nombre});

  } catch (msg) {
    res.status(400).json({
      msg
    })

  }




}


/*****Actualizar una imagen* */
const actualizarImagen = async (req, res = response)=>{


const {id, coleccion} = req.params;

let modelo;

switch (coleccion) {
  case 'usuarios': 
        modelo = await  Usuario.findById(id);

        if(!modelo){
          return res.status(400).json({
            msg: `No existe el usuario con ese id ${id}`
          });
        }

    break;

    case 'productos': 
    modelo = await  Producto.findById(id);

    if(!modelo){
      return res.status(400).json({
        msg: `No existe  Producto con ese id ${id}`
      });
    }
    break;

    default:

     return res.status(500).json({msg: 'Se me olvidó validar esto'});

}

//limpiar imagenes previas
//comprobamos si en el modelo ya tiene una imagen
 if(modelo.img){

  //Si existe imagen la Elimanamos del servidor para poder añadir una nueva para no consumir espacio
  // path.join se utiliza para unir segmentos de ruta de manera inteligente, independientemente del sistema operativo
  //buscamos la ruta con el nombre de la imagen
  const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);



  //Si existe la Eliminamos
  if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
  }

 }

//si existe alguana de las colecciones obtenemos el nombre
const nombreArchivo = await subirarchivo(req.files,undefined, coleccion);//pasmo el nombre de la coleccion (usuarios o productos)
modelo.img = nombreArchivo;

await modelo.save();

res.json({ modelo });

}

/******************Actualizar imagenes a un repositorio externo clouddinary****************************************** */

const actualizarImagenClouddinary = async (req, res = response)=>{


  const {id, coleccion} = req.params;
  
  let modelo;
  
  switch (coleccion) {
    case 'usuarios': 
          modelo = await  Usuario.findById(id);
  
          if(!modelo){
            return res.status(400).json({
              msg: `No existe el usuario con ese id ${id}`
            });
          }
  
      break;
  
      case 'productos': 
      modelo = await  Producto.findById(id);
  
      if(!modelo){
        return res.status(400).json({
          msg: `No existe  Producto con ese id ${id}`
        });
      }
      break;
  
      default:
  
       return res.status(500).json({msg: 'Se me olvidó validar esto'});
  
  }
  
   //si ya existe una imagen la eliminamos 
   if(modelo.img){
  
    const nombreArr = modelo.img.split('/');

    const nombre = nombreArr[nombreArr.length -1];//obtenemos la ultima posicion
    const [ public_id] = nombre.split('.'); //desestructuramos 
    // console.log(public_id);
    cloudinary.uploader.destroy(public_id);
   
  
   }



//Actualizamos le imagen en clouddinary
try {

  const { tempFilePath } = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
  
  // Actualizar el modelo con la nueva URL de la imagen
  modelo.img = secure_url;
  await modelo.save();

  res.json({ 
    modelo,
    msg:'La imagen se ha actualizado correctamente'

   });


} catch (error) {
  console.error('Error al subir imagen a Cloudinary:', error);
  res.status(500).json({ msg: 'Error al subir la imagen', error });
}
}






/*********Mostrar Imagen*************** */
const mostrarImagen = async (req, res= response)=>{

  const {id, coleccion} = req.params;

let modelo;

switch (coleccion) {
  case 'usuarios': 
        modelo = await  Usuario.findById(id);

        if(!modelo){//sino existe id mostramos error
          return res.status(400).json({
            msg: `No existe el usuario con ese id ${id}`
          });
        }

    break;

    case 'productos': 
    modelo = await  Producto.findById(id);

    if(!modelo){
      return res.status(400).json({
        msg: `No existe  Producto con ese id ${id}`
      });
    }
    break;

    default:

     return res.status(500).json({msg: 'Se me olvidó validar esto'});

}

  //limpiar imagenes previas
  //comprobamos si en el modelo ya tiene una imagen
  if(modelo.img){

    //Si existe imagen la Elimanamos del servidor para poder añadir una nueva para no consumir espacio
    // path.join se utiliza para unir segmentos de ruta de manera inteligente, independientemente del sistema operativo
    //buscamos la ruta con el nombre de la imagen
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);



    //Si existe la imagen la mostramos
    if(fs.existsSync(pathImagen)){
       return res.sendFile(pathImagen);//devolvemos la imagen
    }

  }


    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    //Si no hay imagen mostramos una imagen generica que diga que no hay imagen
      return res.sendFile(pathImagen);
   
}



module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenClouddinary
}
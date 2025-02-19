const {request, response, body } = require('express');
const { Producto, Categoria} = require('../models');

const {comprobarProductoCategoria } = require('../helpers/db-validators');


/**********listar***************** */
const obtenerProductos = async (req=request, res= response)=>{

   const {limite = 5, desde } = req.query;
  
    
      const [total, productos] = await Promise.all([
          //obtenemos total
          Producto.countDocuments({estado:true}),
          //buscamos por estado
          Producto.find({
              estado: true
          })
          .populate('usuario', 'nombre') //extremos con populate el nombre del usuario que apunta al modelo de usuario
          .populate('categoria', 'nombre') //extremos con populate el nombre del usuario que apunta al modelo de usuario
          .skip(Number(desde)) //omite un número específico de documentos al inicio de los resultados
          .limit(Number(limite)) //cantida de registros a visualizar
         
  
      ])
  
      res.json({
          total,
          productos

      });
  

}


/**********Listar todos los productos**************** */
const obtenerProductoPorId = async (req,res)=>{

try {
    const {id} = req.params;
    const producto = await Producto.findById(id)
                     .populate('usuario', 'nombre')
                     .populate('categoria','nombre');
  

    
    if(producto.estado===false){
        return res.status(400).json({
         msg:'El producto esta deshabilitado o no existe'
        });
    }

    res.json({
        msg:'obtener- categoria por ID',
        producto
    });
    
} catch (error) {

    console.log(error);
    res.status(400).json({
        msg:'el id no es valido'
    })
    
}

 

}



/*******crear producto********************** */
//CrearCategoria
const crearProducto = async (req = request, res= response) => {

   try {
    //Obtenemos el nombre
    const nombre = req.body.nombre.toUpperCase();
    const categoria =req.body.categoria.toUpperCase();
    const {estado, usuario, precio = 0} = req.body;

    await comprobarProductoCategoria(req,nombre, categoria);
    //recuperamos el id de la categoria
     const {_id } = req.categoriaId;
  
         //Si no exsite lo creamos el objeto con los datos
        const data = {
            nombre,
            precio,
            categoria:_id,
            usuario: req.usuario._id
        }

        //creamos en bases de datos el producto
        const producto = new Producto(data);

        //Guardar DB
        await producto.save();
        req.categoriaId ='';
        res.status(201).json({producto});
       


    
        
   } catch (error) {
    
     console.log(error);
     res.json({ msg: error.message});
    
   }


}


/*********Actualizar Producto******************* */
const actualizarProducto = async (req = request, res= response)=>{


     try {
        const { id } = req.params;


       const {...data}= req.body;

       //si viene el usuario lo pasamos a mayusculas
       if(data.nombre){
         data.nombre = data.nombre.toUpperCase();
       }
     
       data.usuario = req.usuario._id;
       
    // Ejecutar la función asíncrona pasamo el producto y la categoria
        await comprobarProductoCategoria(req, data.nombre, data.categoria);


        //obntiene el id de la categoria
       let id_C = req.categoriaId;

       //limpiamos lo que no vamos a guardar
       const{categoria ,...datosActualizados} = data;
       datosActualizados.categoria = id_C;
    
     const productoActualizado = await Producto.findByIdAndUpdate( id, datosActualizados, {new:true});
    
          

        res.json({
            productoActualizado
            
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
           msg: error.message
        });
        

    }

}


/************Eliminar prodc************************************* */

const EliminarProducto = async (req, res)=>{
   
        try {

            const {id}= req.params;
        
            const productoEliminado = await Producto.findByIdAndUpdate(id,{estado:false});
        
            if(productoEliminado){
                res.json({ msg:'Prodcuto Elminado correctamente',
                    productoEliminado
                });
            }
            
        } catch (error) {
        
            console.log(error);
        
            res.status(500).json({
                msg:'Error Al Eliminar el producto'
             });
            
        }

    
}


module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    EliminarProducto
}
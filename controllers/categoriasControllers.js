const {
    response,
    request
} = require('express');
const {
    Categoria
} = require('../models');




const ObtenerCategorias = async (req = request, res = response) => {

    const {
        limite = 5, desde
    } = req.query;

    // const categorias = await Categoria.find({estado:true});
    // const total = await Categoria.countDocuments();

    const [total, categorias] = await Promise.all([
        //obtenemos total
        Categoria.countDocuments(),
        //buscamos por estado
        Categoria.find({
            estado: true
        })
        .populate('usuario', 'nombre') //extremos con populate el nombre del usuario que apunta al modelo de usuario
        .skip(Number(desde)) //omite un número específico de documentos al inicio de los resultados
        .limit(Number(limite)) //cantida de registros a visualizar
       


    ])

    res.json({
        total,
        categorias


    });

}



//Obtener categoria por id
const categoriasID = async (req, res) => {

    const {
        id
    } = req.params;

    if (!id) {
        throw new Error('El no existe o no es valido');
    }


    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')


    res.json({
        msg:'obtener- categoria por ID',
        categoria
    });


}




//CrearCategoria
const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({
        nombre
    });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`

        })

    }

    //Generar la data guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);


}


//Actualizar categoria
const actualizarCategoria = async (req, res) => {


    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id;
   

        const categoriaActualizada = await Categoria.findByIdAndUpdate( id, data, {new:true});
          

        res.json({
            categoriaActualizada
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
           msg:'Error al actualizar la categoria'
        });
        

    }


}








const eliminarCategoria = async (req, res) => {
   
try {

    const {id}= req.params;

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id,{estado:false});

    if(categoriaEliminada){
        res.json({ msg:'Categoria Elminada correctamente',
            categoriaEliminada 
        });
    }
    
} catch (error) {

    console.log(error);

    res.status(500).json({
        msg:'Error Al Eliminar la categoria'
     });
    
}
    

    

   

}





module.exports = {
    ObtenerCategorias,
    categoriasID,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}
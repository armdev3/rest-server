const { Schema, model} = require('mongoose');


//definimos nuestro schema(tabla mongoose)
const CategoriaSchema = Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es Obligatorio'],
        unique:true
    }, 
    estado:{
        type:Boolean,
        default:true,
        required:true

    },
    usuario:{
        //indicamos el tipo de usuario que apunta a la tabla  o schema usuario
        type: Schema.Types.ObjectId,
        ref:'Usuarios',
        required: true
    }

})

//con esto podemos validar o cambiar los datos de nuestro schema
CategoriaSchema.methods.toJSON = function(){
    const {__v, estado, ...categoria} = this.toObject();//extraemos password y __v del esquema y el resto de campos lo almacenamos en categoria y lo 
  
    
    //devolvemos al esquema
    return categoria;
}

//añadimos nuestro eschema al modelo
module.exports = model('Categoria', CategoriaSchema);
const { Schema, model} = require('mongoose');


//definimos nuestro schema(tabla mongoose)
const ProductoSchema = Schema({
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
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref:'Categoria',
        required: true

    },
    descripcion:{type:String},
    disponible:{type:Boolean, default:true}

})

//con esto podemos validar o cambiar los datos de nuestro schema
ProductoSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();//extraemos password y __v del esquema y el resto de campos lo almacenamos en data y lo 
  
    
    //devolvemos al esquema
    return data;
}

//añadimos nuestro eschema al modelo
module.exports = model('Producto', ProductoSchema);
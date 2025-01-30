const { Schema,model} = require('mongoose');//destructuramos de mongoose el  schema y model

//creamo nuestro Modelo o tabla
const UsuarioSchema = Schema({
  
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']

    },
    correo: {
        type: String,
        required: [
            true, 'El correo es Obligatorio'
        ],
        unique: true

    },
    password: {
        type: String,
        required: [
            true, 'La constraseña es Obligatoria'
        ]

    },
    img: {
        type: String

    },
    rol: {
        type: String,
        required: true,
        enum:['ADMIN_ROLE','USER_ROLE','VENTAS_ROLE']//campos que hemos definido
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
    

})

//con esto podemos validar o cambiar los datos de nuestro schema
UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario} = this.toObject();//extraemos password y __v del esquema y el resto de campos lo almacenamos en usuario y lo 
    usuario.uid = _id; //añadimos  y asignamos el nuevo uid y su valor
    
    //devolvemos al esquema
    return usuario;
}

//elegimos un nombre y añadimos el schema que hemos creado en el modelo
module.exports =  model('Usuarios',UsuarioSchema);
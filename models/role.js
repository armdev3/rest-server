const { Schema, model} = require('mongoose');


//definimos nuestro schema(tabla mongoose)
const RoleSchema = Schema({
    rol:{
        type:String,
        required:[true, 'El rol no puede estar vacio']
    }

})

//añadimos nuestro eschema al modelo
module.exports = model('Role', RoleSchema);
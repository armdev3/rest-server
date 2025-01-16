const color = require('colors');
//realizamos la conecion con la base de datos con mongoose
const mongoose = require('mongoose');

//creamos nuestra conexion 
const dbConnection = async () => {

    try {

        //Realizamos la conexion a nuestra bases de datos que es asincrona
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log(color.america('base de datos online'));

    } catch (error) {

        console.log(error);
        throw new Error("Error al  iniciar la bases de datos");


    }

}


module.exports = {
    dbConnection
}
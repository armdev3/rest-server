const express = require('express');
const cors = require('cors');

class Server {

    constructor() {

        this.app = express(); //directamente instanciamos la variable this.app
        this.port = process.env.PORT || 3000; //pasamos el valor nuestra variable port
        this.usuariosRoutePath = '/api/usuarios'; //definimos una constante de nuestras rutas

        //Middelwares
        this.middleware(); //creamos nuestro middleware

        //Rutas de mi aplicacion
        this.routes(); //creamos las rutas
    }

    //metodos de la clase Server
    middleware() {

        //cors
        this.app.use(cors());

        //Lectura y parseo( los datos que recibimos del cliente en formato json)
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'));
    }


    routes() {
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios.js'))

    }

    listen() {


        this.app.listen(this.port, () => {
            console.log('Servidor Corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;

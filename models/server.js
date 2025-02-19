const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');


class Server {

    constructor() {

        this.app = express(); //directamente instanciamos la variable this.app
        this.port = process.env.PORT; //pasamos el valor nuestra variable port



        //version 2
        this.paths = {

            auth:'/api/auth',
            buscar:'/api/buscar',
            usuarios:'/api/usuarios',
            categorias:'/api/categorias',
            productos:'/api/productos'
          

        }
       

        //Conexion a la base de datos
        this.conectarDb();
    

        //Middelwares
        this.middleware(); //creamos nuestro middleware

        //Rutas de mi aplicacion
        this.routes(); //creamos las rutas
    }

    //definimos nuestra conexion a la bases de datos
    async conectarDb(){
        await dbConnection();
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
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
      
      

    }

    listen() {


        this.app.listen(this.port, () => {
            console.log('Servidor Corriendo en el puerto', this.port);
        });
    }

}

module.exports = Server;
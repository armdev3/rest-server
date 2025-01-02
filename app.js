
require('dotenv').config();

//importamos nuestra clase de server
const Server = require('./models/server');

//Creamos la instancia
const server = new Server();


//lanzamos la escucha de nuestro servidor
server.listen();
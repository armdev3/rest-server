//desectructuamos de expres la funcion Router para definir la rutas
const { Router} = require('express')

//llamamos  las funciones de nuestros controladores
const { 
    usuariosGet, 
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuariosControllers');

const router = Router();

//definimos nuestras rutas
//llamamos a nuestra ruta definida  en los controllers
    router.get('/', usuariosGet);
    router.put('/:id', usuariosPut );//definismo una varible en nuestra url para obtener  el valor del parametro
    router.post('/', usuariosPost);
    router.delete('/',usuariosDelete);
    router.patch('/',usuariosPatch);

module.exports = router;
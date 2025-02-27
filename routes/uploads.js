const { Router } = require('express');
const { check, query } = require('express-validator');
const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, actualizarImagenClouddinary,  mostrarImagen } = require('../controllers/uploadsControllers');
const {coleccionesPermitidas} = require('../helpers');


const router = Router();

//ruta para cargar los ficheros
router.post('/', validarArchivo, cargarArchivo);

//Actualizar
router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser id de mongo').isMongoId(),
    check('coleccion').custom( coleccion => coleccionesPermitidas(coleccion, ['usuarios','productos'])),
    validarCampos

], 
//actualizarImagen
actualizarImagenClouddinary
);

//Ver la imagen
router.get('/:coleccion/:id',[
    check('id', 'El id debe ser id de mongo').isMongoId(),
    check('coleccion').custom( coleccion => coleccionesPermitidas(coleccion, ['usuarios','productos'])),
    validarCampos

], mostrarImagen)

module.exports = router;
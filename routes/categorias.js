const { Router } = require('express');
const { check, query } = require('express-validator');
const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const {
    ObtenerCategorias, 
    categoriasID, 
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}= require('../controllers/categoriasControllers');


const { existeCategoriaId } = require('../helpers/db-validators');


const router = Router();

// {{url}}/api/categorias


//Obtener todas las categorias
router.get('/', [
    query('limite')//obtener datos de la url cuando no se define en la ruta
        .optional()//indicamos que es opcional
        .isNumeric().withMessage('El limite debe ser numerico')
        .toInt(),
    query('desde')
    .optional()//indicamos que es opcional
    .isNumeric().withMessage('La desde debe ser numerico')
    .toInt(),
    validarCampos
   
    
],
ObtenerCategorias);

//Obtener categoria por id
router.get('/:id', [
    //comprobamos que el id sea valido o exista 
    check('id').isMongoId().withMessage('El id no es valido')
    .custom((id)=>existeCategoriaId(id)),
    validarCampos
], categoriasID);

//Crear Categoria - privado- Cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos

],crearCategoria);



//Actualizar- privado cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre  de la categoria no puede estar vacio').not().isEmpty(),
    check('id').isMongoId().withMessage('El id no es valido')
    .custom((id)=>existeCategoriaId(id)),
    validarCampos
],actualizarCategoria);


//Borrar un categorias- Solo Admin
router.delete('/:id',[

    validarJWT,
    esAdminRole,
    check('id').isMongoId().withMessage('El id no es valido')
    .custom((id)=>existeCategoriaId(id)),
    validarCampos
],
     eliminarCategoria)

module.exports = router;
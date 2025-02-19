const {Router} = require('express');
const {check, query} = require('express-validator');
const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');
const {existeProductoId}= require('../helpers/db-validators');

const {obtenerProductos,  
    obtenerProductoPorId, 
    crearProducto,
    actualizarProducto,
    EliminarProducto
} = require('../controllers/productosControllers');

//instanciamos nuestro router
const router = new Router();
 
//Rutas de mi aplicacion

/********listar************ */
router.get('/',[
    query('limite')//obtener datos de la url cuando no se define en la ruta
    .optional()//indicamos que es opcional
    .isNumeric().withMessage('El limite debe ser numerico')
    .toInt(),
query('desde')
.optional()//indicamos que es opcional
.isNumeric().withMessage('La desde debe ser numerico')
.toInt(),
validarCampos

], obtenerProductos);

/*********listar por id******************** */
router.get('/:id',[
        //comprobamos que el id sea valido o exista 
        check('id').isMongoId().withMessage('El id no es valido')
        .custom((id)=>existeProductoId(id)),
        validarCampos

],  obtenerProductoPorId);


/**********crear********************* */
router.post('/',[
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('precio','El precio no puede estar vacio').not().isEmpty(),
    check('precio','El precio tiene que ser numerico').isNumeric(),
    check('categoria','El nombre de la categoria no puede estar vacio').not().isEmpty(),
    validarCampos
], crearProducto);



/**********Actualizar********************* */
router.put('/:id', [
    validarJWT,
    check('id').isMongoId().withMessage('El id no es valido')
    .custom((id)=>existeProductoId(id)),
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('precio','El precio no puede estar vacio').not().isEmpty(),
    check('precio','El precio tiene que ser numerico').isNumeric(),
    validarCampos
], actualizarProducto);





/**********Eliminar********************* */
router.delete('/:id', [

    validarJWT,
    esAdminRole,
    check('id').isMongoId().withMessage('El id no es valido')
    .custom((id)=>existeProductoId(id)),
    validarCampos
], 
EliminarProducto );




module.exports = router;



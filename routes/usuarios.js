//desectructuamos de expres la funcion Router para definir la rutas
const { Router } = require('express')

const { check, query } = require('express-validator');
const { validarcCampos } = require('../middllewares/validar-campos');
const { essRolvalido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');


//importamos las funciones de nuestros controladores
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
router.get('/', [
    query('limite')//obtener datos de la url cuando no se define en la ruta
        .optional()//indicamos que es opcional
        .isNumeric().withMessage('El limite debe ser numerico')
        .toInt(),
    query('desde')
    .optional()//indicamos que es opcional
    .isNumeric().withMessage('La desde debe ser numerico')
    .toInt(),
    validarcCampos
   
    
],usuariosGet);


/********PUT******************* */
router.put('/:id',
    [
        //comprobamos que el id sea valido o exista 
        check('id').isMongoId().withMessage('El id no es valido')
        .custom((id)=>existeUsuarioId(id)),
        check('rol').custom((rol) => essRolvalido(rol)),
        validarcCampos
    ],
    usuariosPut
); //definismo una varible en nuestra url para obtener  el valor del parametro





/**********POST*********************** */
router.post('/',
    [
        /*******COMPROBACION DE LOS DATOS************ */
        //con check de validator express validamos los campos recibidos del frontend
        check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
        check('password', 'El password minimo debe de ser de 6 letras').isLength({
            min: 6
        }),
        //revisar el correo con diferentes mensajes
        check('correo')
        .not().isEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El formato del correo no es válido')
        .custom((correo)=>emailExiste(correo)),
        //    check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom((rol) => essRolvalido(rol)), //pasamos rol
        validarcCampos

    ], 
    usuariosPost
);


router.delete('/:id',
        [
        //comprobamos que el id sea valido o exista 
        check('id').isMongoId().withMessage('El id no es valido')
        .custom((id)=>existeUsuarioId(id)),
        validarcCampos


        ], 
        usuariosDelete
    );


router.patch('/', usuariosPatch);

module.exports = router;
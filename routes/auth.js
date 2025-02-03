const { Router } = require('express');
const { check, query } = require('express-validator');

const { login, googleSinIn} = require('../controllers/authControllers');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



router.post('/login',
    [
       check('correo','El correo es obligatorio').isEmail(),
       check('password','la constraseña es obligatoria').not().isEmpty(),
       validarCampos
       

    ],
    login);

router.post('/google',
        [
           check('id_token','Token de google es necesario').not().isEmpty(),
           validarCampos
        ],
        googleSinIn);

module.exports = router;
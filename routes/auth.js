const {
    Router
} = require('express');
const {
    check,
    query
} = require('express-validator');

const {
    login
} = require('../controllers/authControllers');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



router.post('/login',
    [
       check('correo','El correo es obligatorio o tiene que tener formato de correo ejmplo correo@correo.com').isEmail(),
       check('password','la constraseña es obligatoria').not().isEmpty(),
       validarCampos
       

    ],
    login);

module.exports = router;
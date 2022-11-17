const express = require("express");
const router = express.Router();

const controller = require('../controllers/pedidos-controller');

router.get('/',controller.get);
router.get('/:id_pedido', controller.getByID);
router.post('/', controller.insert );
router.patch('', controller.update);
router.delete('/', controller.delete);

module.exports = router;
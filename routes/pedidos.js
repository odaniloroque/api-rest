const express = require("express");
const router = express.Router();

const pedidosController = require('../controllers/pedidos-controller');

router.get('/',pedidosController.getPedidos);
router.get('/:id_pedido', pedidosController.getByID);
router.post('/', pedidosController.postPedidos );
router.patch('', pedidosController.pathPedidos);
router.delete('/', pedidosController.deletePedidos);

module.exports = router;
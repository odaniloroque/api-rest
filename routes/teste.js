const express =  require('express');
const router = express.Router();

router.use('/conexao', (req, res, next) => {
    res.status(200).send({
        mensagem: "Funcionou"
    });
});

module.exports = router;
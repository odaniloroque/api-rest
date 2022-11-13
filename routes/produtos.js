const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Rota de GET'
    })
});

router.get('/:id_produto', (req,res,next) =>{
    res.status(200).send({
        mensagem: 'Rota de GET by ID'
    })
});

router.post('/', (req,res,next) =>{
    res.status(200).send({
        mensagem: 'Rota de POST'
    })
});

router.patch('/', (req,res,next) =>{
    res.status(200).send({
        mensagem: 'Rota de PATCH'
    })
});

router.delete('/', (req,res,next) =>{
    res.status(200).send({
        mensagem: 'Rota de DELETE'
    })
});

module.exports = router;
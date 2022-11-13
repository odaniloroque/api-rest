const express = require("express");
const router = express.Router();

router.get('/', (res,req,next) =>{
    res.status(200).send({
        mensagem: 'Rota de GET'
    })
});

router.get('/:id_produto', (res,req,next) =>{
    res.status(200).send({
        mensagem: 'Rota de GET by ID'
    })
});

router.post('/', (res,req,next) =>{
    res.status(200).send({
        mensagem: 'Rota de POST'
    })
});

router.patch('/', (res,req,next) =>{
    res.status(200).send({
        mensagem: 'Rota de PATCH'
    })
});

router.delete('/', (res,req,next) =>{
    res.status(200).send({
        mensagem: 'Rota de DELETE'
    })
});

module.exports = router;
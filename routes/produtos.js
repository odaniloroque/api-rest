const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;

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

    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(400).send({error: error});}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)'),
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();
                if (error) {
                    return res.status(500).send({
                            error: error, 
                            response:null
                    });
                }
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                })
        }
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
const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos',
            (err, resultado, fields) => {
                if (err) { return res.status(500).send({error: err})}
                return res.status(200).send({response: resultado})
            }
        )
    });
});

router.get('/:id_produto', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos = ?',
            [req.params.id_produto],
            (err, resultado, fields) => {
                if (err) { return res.status(500).send({error: err})}
                return res.status(200).send({response: resultado})
            }
        )
    });
});

router.post('/', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (err, resultado, field) => {
                conn.release();
                if (err) {
                    return res.status(500).send({
                            error: err, 
                            response:null
                    });
                }
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    id_produto: resultado.insertId
                });
            }
        )
    });
});

   

router.patch('', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE produtos 
            SET nome = ?
                preco = ?
            WHERE id_produtos = ?`,
            [req.body.nome, 
                req.body.preco,
                req.body.id_produtos],
            (err, resultado, fields) => {
                if (err) { return res.status(500).send({error: err})}
                res.status(201).send({
                    mensagem: 'Cadastro Atualizado'
                })
            }
        )
    });
});
router.delete('/', (req,res,next) =>{
    res.status(200).send({
        mensagem: 'Rota de DELETE'
    })
});

module.exports = router;
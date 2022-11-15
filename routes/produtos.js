const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos',
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response ={
                    quantidade : resultado.length,
                    produtos: resultado.map(prod =>{
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um valor especifico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
});

router.get('/:id_produto', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                if (resultado == 0) {return res.status(404).send({mensagem: 'Produto não encontrado com Este ID '})}
                const response ={
                   produto: {
                            id_produto: resultado[0].id_produto,
                            nome: resultado[0].nome,
                            preco: resultado[0].preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retonar um produto',
                                url: 'http://localhost:3000/produtos'
                            }
                        }
                }
                return res.status(201).send({response})
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
                if (err) { return res.status(500).send({ error: err })}
                const response ={
                    mensagem : 'Produto cadastro com sucesso.',
                    produtoCriado: {
                            id_produto: resultado.id_produto,
                            nome: resultado.nome,
                            preco: resultado.preco,
                            request: {
                                tipo: 'POST',
                                descricao: 'Insere um produto',
                                url: 'http://localhost:3000/produtos'
                            }
                        }
                }
                res.status(201).send({ response});
            }
        )
    });
});

   

router.patch('', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE produtos 
            SET nome = ?,
                preco = ?
            WHERE id_produto = ?`,
            [req.body.nome, 
                req.body.preco,
                req.body.id_produto],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response ={
                    mensagem : 'Produto atualizado com sucesso.',
                    produtoAtualizado: {
                            id_produto: req.body.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o produto atualizado',
                                url: 'http://localhost:3000/produtos' + req.body.id_produto
                            }
                        }
                }
                res.status(202).send({response})
            }
        )
    });
});

router.delete('/', (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response = {
                    mensagem: 'Produto Removido com Sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send({response})
            }
        )
    });
});

module.exports = router;
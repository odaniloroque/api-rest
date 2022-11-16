const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err){return res.status(500).send({error: err})}
        bcrypt.hash(req.body.senha, 10, (errBrypt, hash)=> {
            if(errBrypt) {return res.status(500).send({error: errBrypt})}
            conn.query = `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
            [
                req.body.email,
                hash
            ],
            (err, resultado, field) => {
                conn.release();
                if(err){return res.status(500).send({error: err})}
                response = {                    
                    mensagem: 'Usuario Cadastro com sucesso.',
                    usuarioCriado: {
                        id_usuario: resultado.insertId,
                        email: req.body.email
                    }
                }
                return res.status(201).send({response})
            }

        });
        

    })
})

router.post('/login', (req, res, next) => {
   console.log('login')
})

module.exports = router;
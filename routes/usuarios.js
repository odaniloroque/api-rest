const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err){return res.status(500).send({error: err})}
        conn.query("SELECT * FROM USUARIO WHERE email = ?",[req.body.email],(error, resultado)=> {
            if(resultado.length > 0) {
                return res.status(401).send({mensagem: 'Usuarios já cadastrado'})
            } else
            {
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

            }
        })  
    })
})

router.post('/login', (req, res, next) => {
   mysql.getConnection((conn, err) => {
    if(err) { return res.status(500).send({error: err})}
    const mensagemFalha = 'Falha na autenticação'; 
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    conn.query(query,[req.body.email],(error, resultado, fields)=> {
        conn.release();
        if(error) {return res.status(500).send({error: error})}
        if(resultado.length < 1) { return res.status(401).send({mensagem: mensagemFalha})  }
        bcrypt.compare(req.body.senha, resultado[0].senha,(err, resultado) => {
            if(err){ return res.status(401).send({mensagem: mensagemFalha}) }
            if(resultado) { 
                const token = jwt.sign({
                    id_usuario: resultado[0].id_usuario,
                    email: resultado[0].email
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
                return res.status(200).send({mensagem: "Autenticado com sucesso", token: token})}
            return res.status(401).send({mensagem: mensagemFalha})
        })
    })
   })
})

module.exports = router;
const express = require('express')
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err){return res.status(500).send({error: err})}
        conn.query("SELECT * FROM usuarios WHERE email = ?",[req.body.email],(error, resultado)=> {
            if(error){return res.status(500).send({error: error})}
            if(resultado.length > 0) {
                return res.status(401).send({mensagem: 'Usuarios já cadastrado'})
            } else
            {
                bcrypt.hash( req.body.senha, 10, (errBrypt, hash)=> {
                    if(errBrypt) {return res.status(500).send({error: errBrypt})}

                    conn.query(`INSERT INTO usuarios (email, senha) VALUES (?,?)`,[req.body.email, hash ],
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
                    });
                });
            }
       })  ;
    });
});

router.post('/login', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({error: err})}
        const mensageErrAuth = 'Falha na autenticação'; 
        const SQLquery = `SELECT * FROM usuarios WHERE email = ?`;
        conn.query(SQLquery, [req.body.email], (err, results, fields)=> {
                conn.release();
                if(err) { return res.status(500).send({error: err}) }
                if(results.length < 1) { 
                    return res.status(401).send({mensagem: mensageErrAuth});  
                    }
                    bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                            if(err){ return res.status(401).send({mensagem: mensageErrAuth}); }
                                if(result) { 
                                    const token = jwt.sign({
                                    id_usuario: results[0].id_usuario,
                                    email: results[0].email
                                    },
                                    process.env.JWT_KEY,
                                    {
                                    expiresIn: "1h"
                                    });
                                    return res.status(200).send({mensagem: "Autenticado com sucesso", token: token});
                                }
                            return res.status(401).send({mensagem: mensageErrAuth});
                        });
            });
    });
});

module.exports = router;
const mysql = require('../mysql').pool;

exports.getPedidos = (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
        `SELECT 
                pedidos.id_pedido, 
                pedidos.quantidade, 
                pedidos.id_produto, 
                produtos.nome, 
                produtos.preco
            FROM pedidos 
            INNER JOIN produtos 
            ON produtos.id_produto = pedidos.id_produto`,
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response ={
                    quantidade : resultado.length,
                    pedidos: resultado.map(ped =>{
                        return {
                            id_pedido: ped.id_pedido,
                            quantidade: ped.quantidade,
                            produto:{
                                id_produto: ped.id_produto,
                                nome: ped.nome,
                                preco: ped.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um valor especifico',
                                url: 'http://localhost:3000/pedido/' + ped.id_pedido
                            }
                        }
                    })
                }
                return res.status(201).send({response})
            }
        )
    });
}


exports.getByID = (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                if (resultado == 0) {return res.status(404).send({mensagem: 'pedido não encontrado com Este ID '})}
                const response ={
                   pedido: {
                            id_pedido: resultado[0].id_pedido,
                            id_produto: resultado[0].id_produto,
                            quantidade: resultado[0].quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retonar um pedido',
                                url: 'http://localhost:3000/pedidos'
                            }
                        }
                }
                return res.status(201).send({response})
            }
        )
    });
}

exports.postPedidos = (req,res,next) => {
    mysql.getConnection((error,conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query('SELECT * FROM produtos WHERE id_produto = ? ',
        [req.body.id_produto],
        (err,resultado,field)=>{
            if (err) { return res.status(500).send({ error: err })}
            if(resultado.length == 0){
                return res.status(404).send({mensagem: 'Produto não cadastrado'})
            }

            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                [req.body.id_produto, req.body.quantidade],
                (err, resultado, field) => {
                    conn.release();
                    if (err) { return res.status(500).send({ error: err })}
                    const response ={
                        mensagem : 'pedido cadastro com sucesso.',
                        pedidoCriado: {
                                id_pedido: resultado.id_pedido,
                                id_produto: resultado.id_produto,
                                quantidade: resultado.quantidade,
                                request: {
                                    tipo: 'POST',
                                    descricao: 'Insere um pedido',
                                    url: 'http://localhost:3000/pedidos'
                                }
                            }
                    }
                    res.status(201).send({ response});
                }
            )

         })
    })
}

exports.pathPedidos = (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            `UPDATE pedidos 
            SET id_produto = ?,
                quantidade = ?
            WHERE id_pedido = ?`,
            [req.body.id_produto, 
                req.body.quantidade,
                req.body.id_pedido],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response ={
                    mensagem : 'pedido atualizado com sucesso.',
                    pedidoAtualizado: {
                            id_pedido: req.body.id_pedido,
                            nome: req.body.id_produto,
                            preco: req.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna o pedido atualizado',
                                url: 'http://localhost:3000/pedidos' + req.body.id_pedido
                            }
                        }
                }
                res.status(202).send({response})
            }
        )
    });
}

exports.deletePedidos = (req,res,next) => {
    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [req.body.id_pedido],
            (err, resultado, fields) => {
                conn.release();
                if (err) { return res.status(500).send({error: err})}
                const response = {
                    mensagem: 'Pedido Removido com Sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            id_produto: 'String',
                            quantidade: 'Number'
                        }
                    }
                }
                return res.status(202).send({response})
            }
        )
    });
}
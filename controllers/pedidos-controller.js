const multer = require('multer');
const mysql = require('../mysql')

exports.get = async (req, res, next) => {
    try {
    const query = `SELECT 
                        pedidos.id_pedido, 
                        pedidos.quantidade, 
                        pedidos.id_produto, 
                        produtos.nome, 
                        produtos.preco
                    FROM pedidos 
                    INNER JOIN produtos 
                    ON produtos.id_produto = pedidos.id_produto`;
    const result = await mysql.execute(query);
    const response ={
        quantidade : result.length,
        pedidos: result.map(ped =>{
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
        return res.status(201).send({response});
    } catch (error) {
        return res.status(500).send({error: error});
    }
}

exports.getByID =  async (req,res,next) => {
    try {
        const query = 'SELECT * FROM pedidos WHERE id_pedido = ?';
        const result =  await mysql.execute(query,[req.params.id_pedido]);
        if (result == 0) {return res.status(404).send({mensagem: 'pedido não encontrado com Este ID '});}
        const response ={
            pedido: {
                     id_pedido: result[0].id_pedido,
                     id_produto: result[0].id_produto,
                     quantidade: result[0].quantidade,
                     request: {
                         tipo: 'GET',
                         descricao: 'Retonar um pedido',
                         url: 'http://localhost:3000/pedidos'
                     }
                 }
         }
         return res.status(201).send({response});
    } catch (error) {
        return res.status(500).send({error: error});
    }
}

exports.insert = async (req,res,next) => {
    try {
            const querySELECT = 'SELECT * FROM produtos WHERE id_produto = ?';
            const resultSELECT = await mysql.execute(querySELECT, [req.body.id_produto])
            if(resultSELECT.length == 0){
                return res.status(404).send({mensagem: 'Produto não cadastrado'})
            }
            const queryINSERT = 'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)';
            const result = await mysql.execute(queryINSERT,  [req.body.id_produto, req.body.quantidade])
            const response = {
                mensagem : 'pedido cadastro com sucesso.',
                pedidoCriado: {
                        id_pedido: result.id_pedido,
                        id_produto: result.id_produto,
                        quantidade: result.quantidade,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um pedido',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
            }
                res.status(201).send({ response});
            } catch (error) {
                return res.status(500).send({ error: error })
        }
}

exports.update = async (req, res, next) => {
   try {
    const query = `UPDATE pedidos SET id_produto = ?,  quantidade = ?  WHERE id_pedido = ?`
    await mysql.execute( query, [req.body.id_produto, req.body.quantidade, req.body.id_pedido]);
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
    } catch (error) {
        if(error) {return res.status(500).send({error: error})}
    }
}

exports.delete = async (req, res, next) => {
    try {
        const query = 'DELETE FROM pedidos WHERE id_pedido = ?';
        await mysql.execute(query,[req.body.id_pedido]);
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
    } catch (error) {
        if(error) {return res.status(500).send({error: error})}
    }
}

const mysql = require('../mysql');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + ' - ' + file.originalname)
    }
  });
const fileFilter = (req, file, cb) => {
    if(file.mimetype ==='image/jpeg' || file.mimetype =='image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    
}
const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1024*1024*5
        },
        fileFilter: fileFilter
});

exports.get = async (req, res, next) => {
    try {
    const query = "SELECT * FROM produtos";
    const result = await mysql.execute(query)
    const response = {
            quantidade : result.length,
            produtos: result.map(prod =>{
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem: prod.imagem_produto,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um valor especifico',
                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                    }
                }
            })
        }
        return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({error: error})
    }
}  

exports.getByID = async (req, res, next) => {
    try {
    const query = "SELECT * FROM produtos WHERE id_produto = ?";
    const result = await mysql.execute(query,[req.params.id_produto]);
    const response ={
        produto: {
                id_produto: result[0].id_produto,
                nome: result[0].nome,
                preco: result[0].preco,
                imagem: result[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retonar um produto',
                    url: 'http://localhost:3000/produtos'
                }
            }
    }
    return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({error: error})
    }
}  

exports.insert = async (req, res, next) => {
    try {
    const query = 'INSERT INTO produtos ( nome, preco, imagem_produto) VALUES ( ?, ?, ?)';
    const result = await mysql.execute(query,[req.body.nome, req.body.preco, req.file.path]);
    const response ={
        mensagem : 'Produto cadastro com sucesso.',
        produtoCriado: {
                id_produto: result.id_produto,
                nome: result.nome,
                preco: result.preco,
                imagem_produto: result.imagem_produto,
                request: {
                    tipo: 'POST',
                    descricao: 'Insere um produto',
                    url: 'http://localhost:3000/produtos'
                }
            }
    }
    return res.status(201).send({response})
    } catch (error) {
        return res.status(500).send({error: error})
    }
} 

exports.update = async (req, res, next) => {
    try {
    const query = `UPDATE 
                        produtos 
                    SET 
                        nome            = ?,
                        preco           = ?,
                        imagem_produto  = ?
                    WHERE 
                        id_produto      = ?`;
    const result = await mysql.execute(query,[req.body.nome, req.body.preco, req.file.path, req.body.id_produto])
    const response ={
        mensagem : 'Produto atualizado com sucesso.',
        produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna o produto atualizado',
                    url: 'http://localhost:3000/produtos' + req.body.id_produto
                }
            }
    }
         res.status(202).send({response})
    } catch (error) {
        return res.status(500).send({error: error})
    }
}  

exports.delete = async (req, res, next) => {
    try {
    const query = "DELETE FROM produtos WHERE id_produto = ?";
    const result = await mysql.execute(query,[req.params.id_produto]);
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
    } catch (error) {
        return res.status(500).send({error: error})
    }
}  
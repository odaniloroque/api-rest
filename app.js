const express =  require('express');
const app = express();


const rotaTeste = require('./routes/teste');
const rotaProtudos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use('/test',rotaTeste);
app.use('/produtos',rotaProtudos);
app.use('/pedidos', rotaPedidos);

app.use((req, res, next)=>{
    const erro = new Error('Não Encontrado');
    erro.status=404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({erro:{mensagem: error.mensage}})
})


module.exports = app;
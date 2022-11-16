const express = require("express");
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + ' - ' + file.originalname)
    }
  })
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

const produtoController = require('../controllers/produtos-controller');

router.get('/', produtoController.getProduto);
router.get('/:id_produto', produtoController.getByIDProduto);
router.post('/',login.obrigatorio,upload.single('imagem_produto'),produtoController.postProduto);
router.patch('/',login.obrigatorio, produtoController.patchProduto);
router.delete('/',login.obrigatorio, produtoController.deleteProduto);

module.exports = router;
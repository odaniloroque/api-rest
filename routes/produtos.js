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

const controller = require('../controllers/pedidos-controller');

router.get('/', controller.get);
router.get('/:id_', controller.getByID);
router.post('/',login.obrigatorio,upload.single('imagem_'),controller.insert);
router.patch('/',login.obrigatorio, controller.update);
router.delete('/',login.obrigatorio, controller.delete);

module.exports = router;
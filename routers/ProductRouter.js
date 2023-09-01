const Router = require('express');
const ProductController = require('../controllers/ProductController');

const productRouter = new Router();

productRouter.get('/search', ProductController.getAllBySearch);

productRouter.get('/filter', ProductController.getAllByFilter);

productRouter.get('/', ProductController.getAll);

productRouter.get('/:id', ProductController.getOne);

productRouter.get('/nextProduct/:id', ProductController.getOneNext);

productRouter.get('/prevProduct/:id', ProductController.getOnePrev);

productRouter.get('/lable/:lable', ProductController.getAllByLable);

productRouter.get('/category/:category', ProductController.getAllByCategory);

productRouter.post('/', ProductController.create);

productRouter.put('/:id', ProductController.updated);

productRouter.delete('/:id', ProductController.delete);

productRouter.post('/deleteMany', ProductController.deleteMany)

module.exports = productRouter;
const Router = require('express');
const FilterSlidesController = require('../controllers/FilterSlidesController');

const filterSlidesRouter = new Router();

filterSlidesRouter.get('/', FilterSlidesController.getAll);

filterSlidesRouter.get('/allCategory', FilterSlidesController.getAllCategory);

filterSlidesRouter.get('/:id', FilterSlidesController.getOne);

filterSlidesRouter.get('/categoryInfo/:category', FilterSlidesController.getAllByCategory);

filterSlidesRouter.post('/', FilterSlidesController.create);

filterSlidesRouter.put('/:id', FilterSlidesController.updated);

filterSlidesRouter.delete('/:id', FilterSlidesController.delete);

filterSlidesRouter.post('/deleteMany', FilterSlidesController.deleteMany)

module.exports = filterSlidesRouter;
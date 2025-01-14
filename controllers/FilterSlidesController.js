const FilterSlidesService = require('../service/FilterSlidesService');

class FilterSlidesController {
    getAll = async (req, res) => {
        try {

            if (req.query.range) {
                const { range } = req.query;
                const [start, end] = JSON.parse(range)

                const filterSlides = await FilterSlidesService.getAll(req.query.filter, req.query.language);

                const total = filterSlides.length;

                res.setHeader('Content-Range', `filterSlides ${start}-${end}/${total}`);
                const filterSlidesInRange = filterSlides.slice(start, end + 1);
    
                return res.json(filterSlidesInRange);   
            } else {
                const filterSlides = await FilterSlidesService.getAll(req.query.filter, req.query.language);

                return res.json(filterSlides);  

            }

        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }

    getOne = async (req, res) => {
        try {
            const filterSlide = await FilterSlidesService.getOne(req.params.id, req.query.language);
            return res.json(filterSlide);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    getAllByCategory = async (req, res) => {
        try {
            const allFilterSlides = await FilterSlidesService.getAllByCategory(req.params.category, req.query.language);
            return res.json(allFilterSlides);   
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    getAllCategory = async (req, res) => {

        try {
            const allCategory = await FilterSlidesService.getAllCategory();
            return res.json(allCategory);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    create = async (req, res) => {
        try {
            const folder = 'filterSlides';
            const picture =  req.body?.pictures?.[0];
            const product = await FilterSlidesService.create(req.body, picture, folder);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    updated = async (req, res) => {
        try {
            const folder = 'filterSlides';
            const pictures = req.body?.pictures?.[0];
            const product = await FilterSlidesService.updated(req.body, pictures, folder);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    delete = async (req, res) => {
        try {
            const product = await FilterSlidesService.delete(req.params.id);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    deleteMany = async (req, res) => {
        try {
            const product = await FilterSlidesService.deleteMany(req.body.ids)
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

}

module.exports = new FilterSlidesController();
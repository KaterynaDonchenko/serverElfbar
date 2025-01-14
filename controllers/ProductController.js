const ProductService = require('../service/ProducService');

class ProductController {
    
    getAll = async (req, res) => {
        try {
            if (req.query.range) {
                const { range } = req.query;
                const [start, end] = JSON.parse(range);

                const allProducts = await ProductService.getAll(req.query.filter, req.query.sort, req.query.language);

                const total = allProducts.length;

                res.setHeader('Content-Range', `products ${start}-${end}/${total}`);
                const productsInRange = allProducts.slice(start, end + 1);
                
                return res.json(productsInRange); 
            } else {
                const allProducts = await ProductService.getAll(req.query.filter, req.query.sort, req.query.language);
                return res.json(allProducts)
            }
        } catch (error) {
            return res.status(500).json(error.message);
        } 
    }

    getOne = async (req, res) => {
        try {
            const product = await ProductService.getOne(req.params.id, req.query.language);
            return res.json(product);
        } catch (error) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ message: 'Product not found' });
            } else {
                return res.status(500).json(error.message);
            }
        }
    }

    getOneNext = async (req, res) => {
        try {
            const product = await ProductService.getOneNext(req.params.id, req.query.language);
            return res.json(product);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    getOnePrev = async (req, res) => {
        try {
            const product = await ProductService.getOnePrev(req.params.id, req.query.language);
            return res.json(product);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    getAllByLabel = async (req, res) => {
        try {
            const product = await ProductService.getAllByLabel(req.params.label, req.query.language);
            return res.json(product) 
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    getAllBySearch = async (req, res) => {
        try {
            const product = await ProductService.getAllBySearch(req.query.s, req.query.language);
            return res.json(product);
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }

    getAllByCategory = async (req, res) => {
        try {
            const product = await ProductService.getAllByCategory(req.params.category, req.query.language);
            return res.json(product);
        } catch (error) {
            
        }
    }

    getAllByFilter = async (req, res) => {
        try {
            const product = await ProductService.getAllByFilter(req.query.orderby, req.query.language);
            return res.json(product);
        } catch (error) {
            
        }
    }

    create = async (req, res) => {
        try {
            const folder = 'products';
            const pictures = req.body?.pictures?.[0];
            
            const product = await ProductService.createProduct(req.body, pictures, folder);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    updated = async (req, res) => {
        try {
            const folder = 'products';
            const pictures = req.body?.pictures?.[0];
            const product = await ProductService.updated(req.body, pictures, folder);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    delete = async (req, res) => {
        try {
            const product = await ProductService.delete(req.params.id);
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

    deleteMany = async (req, res) => {
        try {
            const product = await ProductService.deleteMany(req.body.ids)
            return res.json(product);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }

}

module.exports = new ProductController();
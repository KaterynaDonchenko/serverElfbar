const ProductModel = require('../models/ProductModal');
const mongoose = require('mongoose');
const FileService = require('./FileService');
const ProductEngModel = require('../models/ProductModalEng');
const getModel = require('../utils/ModelHelpers');

class ProductService {
    async getAll (filter, sort, language) {

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const getProducts = await dataModel.find();

        if (!filter && !sort) {
            return getProducts;
        }

        const filters = JSON.parse(filter);
        const sorts = JSON.parse(sort);
        const [sortBy, sortOrder] = sorts; 
        const filtersCounter = Object.keys(filters).length;

        if (sortBy && sortOrder) {
            const sortData = getProducts.sort((a, b) => {
                if (sortOrder === 'ASC') {
                    return a[sortBy] - b[sortBy];
                } else if (sortOrder === 'DESC') {
                    return b[sortBy] - a[sortBy];
                }  else {
                    return 0
                }
            });

            if (filtersCounter === 0) {
                return sortData;
            } else {
                const filteredArray = sortData.filter(item => {
                let validateAllFilters = 0;
    
                for (const filter in filters) {
                    switch (filter) {
                        case 'title':
                            if (item[filter].toLowerCase().indexOf(filters[filter].toLowerCase()) > -1) {
                                validateAllFilters++
                            }
                            break;
                        case 'taste':
                            if (item[filter].toLowerCase().indexOf(filters[filter].toLowerCase()) > -1) { 
                                validateAllFilters++
                            }
                            break;
                        case 'price':
                            if (item[filter] == filters[filter]) {
                                validateAllFilters++
                            }
                            break;
                        case 'quantity':
                            if (item[filter] === filters[filter]) {
                                validateAllFilters++
                            }
                            break;
                        case 'label':
                            if (item[filter] === filters[filter]) {
                                validateAllFilters++
                            }
                            break;
                        case 'category':
                            if (item[filter] === filters[filter]) {
                                validateAllFilters++
                            }
                            break;
                    }
                }
                if (validateAllFilters === filtersCounter) {
                    return item
                }
    
                });
    
                return filteredArray;
            }
        }
    }

    async getOne (id, language) {
        if (!id && !language) {
            throw new Error("Id is omitted")
        }

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const getProduct = await dataModel.findById(id)

        return getProduct;
    }

    async getOneNext (_id, language) {
        if (!_id && !language) {
            throw new Error("Id is omitted")
        }

        let nextProduct;

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        await dataModel.find({ _id: { $gt: new mongoose.Types.ObjectId(_id) }})
        .sort({ id: 1 })
        .limit(1)
        .then(product => {
            nextProduct = product;
        })
        .catch(err => {
            console.log(err);
        });

        return nextProduct
    }

    async getOnePrev (_id, language) {
        if (!_id && !language) {
            throw new Error("Id is omitted")
        }

        let prevProduct;

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        await dataModel.find({ _id: { $lt: new mongoose.Types.ObjectId(_id) } })
        .sort({ id: 1 })
        .limit(1)
        .then(product => {
            prevProduct = product;
        })
        .catch(err => {
            console.log(err);
        });

        return prevProduct
    }

    async getAllByLabel (label, language) {
        if (!label & !language) {
            throw new Error('label is omitted');
        }

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const products = await dataModel.find({label: label});

        switch (label) {
            case 'Top':
            case 'топ':
                return products.sort((a, b) => b.numberOfOrders - a.numberOfOrders).slice(0, 10);
            case 'New arrival':
            case 'новинка':
                return products.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            }
    }

    async getAllBySearch (search, language) {
        if (!search && !language) {
            throw new Error('Search is omitted');
        }
        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const products = await dataModel.find();
        const getProducts = products.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return getProducts;
    }

    async getAllByCategory (category, language) {
        if (!category & !language) {
            throw new Error('category is omitted');
        }

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const getProducts = await dataModel.find({category: category});
        return getProducts;
    }

    async getAllByFilter (filter, language) {
        if (!filter && !language) {
            throw new Error('Filter is omitted');
        }

        const dataModel = getModel(language, ProductModel, ProductEngModel)

        const products = await dataModel.find({});

        switch (filter) {
            case 'all':
                return products.sort((a, b) => a._id - b._id)
            case 'price-incr':
                return products.sort((a, b) => a.price - b.price)
            case 'price-decr':
                return products.sort((a, b) => b.price - a.price)
            case 'popularity':
                return products.sort((a, b) => b.numberOfOrders - a.numberOfOrders)
            case 'date':
                return products.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
    }

    async createProduct (product, picture, folder) {
        const fileName = FileService.saveFile(picture, folder);
        product.__v = 0;

        const createProduct = await ProductModel.create(product);
        return createProduct;
    }

    async updated (product, picture, folder) {
        if (!product._id) {
            throw new Error ("Id is omitted")
        }

        if (picture) FileService.saveFile(picture, folder)
        const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, {new: true});
        return updatedProduct;
    }

    async delete (id) {
        if (!id) {
            throw new Error ("Id is omitted")
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        return deletedProduct;  
    }

    async deleteMany (ids) {
        if (!ids) {
            throw new Error ("Ids is omitted")
        }

        const products = await ProductModel.find({ _id: { $in: ids.map(item => new mongoose.Types.ObjectId(item))}});
        const deletedProductMany = await ProductModel.deleteMany({_id: {$in: ids.map(item => new mongoose.Types.ObjectId(item))}});

        if (!deletedProductMany) {
            throw new Error ('Error')
        }
        return products; 
    }
}

module.exports = new ProductService();
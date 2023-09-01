const ProductModel = require('../models/ProductModal');
const mongoose = require('mongoose');
const FileService = require('./FileService');

class ProductService {
    async getAll (query) {
        const getProducts = await ProductModel.find();

        if (!query) {
            return getProducts;
        }

        const filters = JSON.parse(query.filter);
        const sort = JSON.parse(query.sort);
        const [sortBy, sortOrder] = sort; 
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
                        case 'lable':
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

    async getOne (id) {
        if (!id) {
            throw new Error("Id is omitted")
        }
        const getProduct = await ProductModel.findById(id);
        return getProduct;
    }

    async getOneNext (_id) {
        if (!_id) {
            throw new Error("Id is omitted")
        }

        let nextProduct;

        await ProductModel.find({ _id: { $gt: new mongoose.Types.ObjectId(_id) }})
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

    async getOnePrev (_id) {
        if (!_id) {
            throw new Error("Id is omitted")
        }

        let prevProduct;

        await ProductModel.find({ _id: { $lt: new mongoose.Types.ObjectId(_id) } })
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

    async getAllByLable (lable) {
        if (!lable) {
            throw new Error('Lable is omitted');
        }

        const products = await ProductModel.find({lable: lable});
        switch (lable) {
            case 'топ':
                return products.sort((a, b) => b.numberOfOrders - a.numberOfOrders).slice(0, 10);
            case 'новинка':
                return products.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            }
    }

    async getAllBySearch (search) {
        if (!search) {
            throw new Error('Lable is omitted');
        }

        const products = await ProductModel.find();
        const getProducts = products.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return getProducts;
    }

    async getAllByCategory (category) {
        if (!category) {
            throw new Error('category is omitted');
        }

        const getProducts = await ProductModel.find({category: category});
        return getProducts;
    }

    async getAllByFilter (filter) {
        if (!filter) {
            throw new Error('Filter is omitted');
        }

        const products = await ProductModel.find({});

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
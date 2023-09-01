const FilterSlidesModal = require('../models/FilterSlidesModal');
const FileService = require('./FileService');
const mongoose = require('mongoose');

class FilterSlidesService {

    getAll = async (query = null) => {
        const getFilterSlides = await FilterSlidesModal.find();

        if (!query || Object.keys(JSON.parse(query.filter)).length <= 0) { 
            return getFilterSlides;
        }

        const filters = JSON.parse(query.filter);

        const getFiltredFilterSlides = getFilterSlides.filter(({name}) => 
            name.toLowerCase().indexOf(filters.name.toLowerCase()) > -1);

        return getFiltredFilterSlides;
    }

    getOne = async (id) => {
        if (!id) {
            throw new Error("Id is omitted")
        }
        const getFilterSlide = await FilterSlidesModal.findById(id);
        return getFilterSlide;
    }

    getAllByCategory = async (category) => {
        return await FilterSlidesModal.findOne({name: category})
    }

    getAllCategory = async () => {
        return (await FilterSlidesModal.find()).map(({name, _id, ...item}) => ({id: name, name}))
    }

    async create (filterSlides, picture, folder) {
        const fileName = FileService.saveFile(picture, folder);

        filterSlides.__v = 0;
        const getFilterSlide = await FilterSlidesModal.create(filterSlides);
        return getFilterSlide;
    }

    async updated (filterSlides, picture, folder) {
        if (!filterSlides._id) {
            throw new Error ("Id is omitted")
        }
        
        if (picture) FileService.saveFile(picture, folder);

        const getFilterSlide = await FilterSlidesModal.findByIdAndUpdate(filterSlides._id, filterSlides, {new: true});
        return getFilterSlide;
    }

    async delete (id) {
        if (!id) {
            throw new Error ("Id is omitted")
        }

        const getFilterSlide = await FilterSlidesModal.findByIdAndDelete(id);

        return getFilterSlide;  
    }

    async deleteMany (ids) {
        if (!ids) {
            throw new Error ("Ids is omitted")
        }

        const getFilterSlide = await FilterSlidesModal.find({ _id: { $in: ids.map(item => new mongoose.Types.ObjectId(item))}});

        const deletedgetFilterSlideMany = await FilterSlidesModal.deleteMany({_id: {$in: ids.map(item => new mongoose.Types.ObjectId(item))}});

        if (!deletedgetFilterSlideMany) {
            throw new Error ('Error')
        }
        return getFilterSlide; 
    }
}

module.exports  = new FilterSlidesService()
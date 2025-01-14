getModel = (language, UnModel, EnModel) => {
    let dataModel

    if (language === 'ua') {
        dataModel = UnModel
    } else if (language === 'en') {
        dataModel = EnModel
    }

    return dataModel
}

module.exports = getModel;
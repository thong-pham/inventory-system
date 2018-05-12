import mongoose from "mongoose";
import Color from "./../schema/feature/ColorSchema";
import Pattern from "./../schema/feature/PatternSchema";
import Quality from "./../schema/feature/QualitySchema";
import Size from "./../schema/feature/SizeSchema";
import Type from "./../schema/feature/TypeSchema";
import Unit from "./../schema/feature/UnitSchema";


export function createColor(data, callback) {
    const colorModel = new Color(data);
    colorModel.save(function (err, color) {
        callback(err, color);
    })
}

export function getColorById(id, callback) {
    Color.findOne({ "id": parseInt(id) }, function (err, color) {
        callback(err, color)
    });
}

export function getColorByKey(key, callback) {
    Color.findOne({ "key": key }, function (err, color) {
        callback(err, color)
    });
}

export function getColors(callback) {
    Color.find({}, function (err, colors) {
        callback(err, colors)
    });
}

export function updateColorById(id, data, callback) {
    Color.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, color) {
        callback(err, color);
    });
}

export function removeColorById(id, callback) {
    Color.findOneAndRemove({ "id": parseInt(id) }, function (err, color) {
        callback(err, color);
    });
}

export function createPattern(data, callback) {
    const patternModel = new Pattern(data);
    patternModel.save(function (err, pattern) {
        callback(err, pattern);
    })
}

export function getPatternById(id, callback) {
    Pattern.findOne({ "id": parseInt(id) }, function (err, pattern) {
        callback(err, pattern)
    });
}

export function getPatternByKey(key, callback) {
    Pattern.findOne({ "key": key }, function (err, pattern) {
        callback(err, pattern)
    });
}

export function getPatterns(callback) {
    Pattern.find({}, function (err, patterns) {
        callback(err, patterns)
    });
}

export function updatePatternById(id, data, callback) {
    Pattern.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, pattern) {
        callback(err, pattern);
    });
}

export function removePatternById(id, callback) {
    Pattern.findOneAndRemove({ "id": parseInt(id) }, function (err, pattern) {
        callback(err, pattern);
    });
}

export function createQuality(data, callback) {
    const qualityModel = new Quality(data);
    qualityModel.save(function (err, quality) {
        callback(err, quality);
    })
}

export function getQualityById(id, callback) {
    Quality.findOne({ "id": parseInt(id) }, function (err, quality) {
        callback(err, quality)
    });
}

export function getQualityByKey(key, callback) {
    Quality.findOne({ "key": key }, function (err, quality) {
        callback(err, quality)
    });
}

export function getQualities(callback) {
    Quality.find({}, function (err, qualities) {
        callback(err, qualities)
    });
}

export function updateQualityById(id, data, callback) {
    Quality.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, quality) {
        callback(err, quality);
    });
}

export function removeQualityById(id, callback) {
    Quality.findOneAndRemove({ "id": parseInt(id) }, function (err, quality) {
        callback(err, quality);
    });
}

export function createSize(data, callback) {
    const sizeModel = new Size(data);
    sizeModel.save(function (err, size) {
        callback(err, size);
    })
}

export function getSizeById(id, callback) {
    Size.findOne({ "id": parseInt(id) }, function (err, size) {
        callback(err, size)
    });
}

export function getSizeByKey(key, callback) {
    Size.findOne({ "key": key }, function (err, size) {
        callback(err, size)
    });
}

export function getSizes(callback) {
    Size.find({}, function (err, sizes) {
        callback(err, sizes)
    });
}

export function updateSizeById(id, data, callback) {
    Size.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, size) {
        callback(err, size);
    });
}

export function removeSizeById(id, callback) {
    Size.findOneAndRemove({ "id": parseInt(id) }, function (err, size) {
        callback(err, size);
    });
}

export function createType(data, callback) {
    const typeModel = new Type(data);
    typeModel.save(function (err, type) {
        callback(err, type);
    })
}

export function getTypeById(id, callback) {
    Type.findOne({ "id": parseInt(id) }, function (err, type) {
        callback(err, type)
    });
}

export function getTypeByKey(key, callback) {
    Type.findOne({ "key": key }, function (err, type) {
        callback(err, type)
    });
}

export function getTypes(callback) {
    Type.find({}, function (err, types) {
        callback(err, types)
    });
}

export function updateTypeById(id, data, callback) {
    Type.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, type) {
        callback(err, type);
    });
}

export function removeTypeById(id, callback) {
    Type.findOneAndRemove({ "id": parseInt(id) }, function (err, type) {
        callback(err, type);
    });
}

export function createUnit(data, callback) {
    const unitModel = new Unit(data);
    unitModel.save(function (err, feature) {
        callback(err, feature);
    })
}

export function getUnitById(id, callback) {
    Unit.findOne({ "id": parseInt(id) }, function (err, unit) {
        callback(err, unit)
    });
}

export function getUnitByKey(key, callback) {
    Unit.findOne({ "key": key }, function (err, unit) {
        callback(err, unit)
    });
}

export function getUnits(callback) {
    Unit.find({}, function (err, units) {
        callback(err, units)
    });
}

export function updateUnitById(id, data, callback) {
    Unit.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, unit) {
        callback(err, unit);
    });
}

export function removeUnitById(id, callback) {
    Unit.findOneAndRemove({ "id": parseInt(id) }, function (err, unit) {
        callback(err, unit);
    });
}

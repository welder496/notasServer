var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var funcionalidade = new Schema({
    descricao: String,
    subtipos: [String]
});

module.exports = mongoose.model('Funcionalidade',funcionalidade);
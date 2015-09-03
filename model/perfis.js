var mongoose   = require('mongoose');
var Schema  = mongoose.Schema;

var perfil = new Schema({
    descricao: String
});

module.exports = mongoose.model('Perfil',perfil);
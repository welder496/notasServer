var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var notas   = new Schema({
    codigo: String,
    nota: String,
    arquivos: [],
    tags: [],
    criado_em: {type: Date, default: Date.now},
    versao: {type: [Number], default: 0}
});

module.exports = mongoose.model('Notas', notas);

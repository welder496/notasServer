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

var perfil = new Schema({
    codigo: String,
    descricao: String
});

var funcionalidade = new Schema({
    codigo: String,
    descricao: String,
    subtipos: [String]
});

module.exports = {
      Notas: notas,
      Perfil: perfil,
      Funcionalidade: funcionalidade
};

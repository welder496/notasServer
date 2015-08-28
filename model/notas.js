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
    descricao: String
});

var funcionalidade = new Schema({
    descricao: String,
    subtipos: [String]
});

module.exports = {
      Notas: notas,
      Perfil: perfil,
      Funcionalidade: funcionalidade
};

//mongoose.model('Notas', notas);
//module.exports = mongoose.model('Perfil', perfil);
//module.exports = mongoose.model('Funcionalidade', funcionalidade);

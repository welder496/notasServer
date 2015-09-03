var express = require('express');
var routerNotasCodigoCodigo = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');
var fs = require('extfs');

var docs = __base + '/documentos';

routerNotasCodigoCodigo.route('/:codigo')

      .get(function(req, res) {
            var codigo = req.params.codigo.toUpperCase().trim();

             notas = mongoose.model('Notas');
             notas.findOne({codigo: codigo}, function(err, notas) {
                   if (err)
                          res.send(err);
                    if (notas != null){
                          res.json(notas);
                    } else {
                          res.json({message: "Nota não foi encontrada!!"});
                    }
             });
       })

       .put(function(req, res) {

             notas = mongoose.model('Notas');
             notas.findOne({codigo:req.params.codigo}, function(err, notas){
                   if (notas == null){
                         res.json({message: "A nota não foi encontrada!!"});
                   } else {
                          notas.nota = decodeURIComponent(req.body.nota);

                          var files =req.files;
                          var fileKeys = Object.keys(req.files);

                          fileKeys.forEach(function(key){
                                var arquivo = files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                if (notas.arquivos.indexOf(arquivo) == -1)
                                       notas.arquivos.push(arquivo);
                          });

                          notas.tags = decodeURIComponent(req.body.tags);

                          notas.versao.push(parseInt(req.body.versao)+1);
                          notas.versao.shift();

                          if (typeof(notas.codigo)!="undefined" &&
                              typeof(notas.nota)!="undefined" &&
                              typeof(notas.tags)!="undefined") {

                                       if (parseInt(req.body.versao) >= notas.__v) {
                                            notas.save(function(err) {
                                                   if (err)
                                                         res.send(err);
                                                   if (notas.arquivos.length > 0) {
                                                          fs.mkdir(docs,function(err){
                                                                 fs.mkdir(docs+'/'+notas._id,function(err){
                                                                       fileKeys.forEach(function(key){
                                                                              var arquivo = docs+'/'+notas._id+'/'+files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                                                              var writeStream = fs.createWriteStream(arquivo);
                                                                              writeStream.write(files[key].buffer);
                                                                              writeStream.end();
                                                                       });
                                                                });
                                                          });
                                                   }
                                            });
                                             res.json({message: 'Nota alterada com sucesso!'});
                                      } else {
                                             res.json({message: 'A nota está sendo alterada por outro usuário. Tente novamente mais tarde...!!'});
                                      }
                         } else {
                                res.json({message: "Todos os campos devem ser preenchidos!!"});
                         }
                   }
            });
       })

       .delete(function(req, res) {
             var codigo = req.params.codigo.toUpperCase().trim();
             var id = "";

             notas = mongoose.model('Notas');
             notas.findOne({codigo:codigo},function(err,notas){
                  id = notas._id;
             });

             notas.remove({codigo: codigo},function(err, notas) {
                   if (err)
                          res.send(err);

                   if (id != null) {
                          if (fs.existsSync(docs)){
                             if (fs.existsSync(docs+'/'+id)){
                                fs.readdirSync(docs+'/'+id).forEach(function(file,index){
                                      var currentPath=docs+'/'+id+'/'+file;
                                   if (!fs.lstatSync(currentPath).isDirectory()){
                                      fs.unlinkSync(currentPath);
                                   }
                                });
                                      fs.isEmpty(docs+'/'+id, function(empty){
                                             if (empty)
                                                   fs.rmdirSync(docs+'/'+id);
                                      });
                             }
                      }
                          res.json({message: 'Nota excluída com sucesso!!' });
                   } else {
                          res.json({message: 'Não foi possível excluir a Nota!!'});
                   }
             });
      });

module.exports = routerNotasCodigoCodigo;
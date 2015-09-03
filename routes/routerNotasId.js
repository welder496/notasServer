var express = require('express');
var routerNotasId = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');
var fs = require('extfs');

routerNotasId.route('/:nota_id')

    .get(function(req, res) {
        notas = mongoose.model('Notas');
        notas.findById(req.params.nota_id, function(err, notas) {
            if (err)
                res.send(err);
            if (notas != null) {
                res.json(notas);
            } else {
                res.json({message:"Nota não foi encontrada!!"});
            }
        });
    })

    /*
     * Change update of nota due to graphic or other archive inserted before.
     */

   .put(function(req, res) {
             notas = mongoose.model('Notas');
             notas.findById(req.params.nota_id, function(err, notas){
                   if (notas == null){
                         res.json({message: "A nota não foi encontrada!!"});
                   } else {
                          notas.nota = decodeURIComponent(req.body.nota);

                          var files = req.files;
                          var fileKeys = Object.keys(req.files);
                          fileKeys.forEach(function(key){
                                var arquivo = files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                if (arquivo.substring(arquivo.lastIndexOf(".")).toLowerCase() != '.js')
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
                                                                             if (arquivo.substring(arquivo.lastIndexOf(".")).toLowerCase() != '.js') {
                                                                                   var writeStream = fs.createWriteStream(arquivo);
                                                                                   writeStream.write(files[key].buffer);
                                                                                   writeStream.end();
                                                                             }
                                                                       });
                                                                });
                                                          });
                                                   }
                                              });
                                              res.json({message:"Nota alterada com sucesso!!"});
                                       } else {
                                             res.json({message: 'A nota está sendo alterada por outro usuário. Tente novamente mais tarde...!!'});
                                       }
                          } else {
                                res.json({message:"Todos os campos devem ser preenchidos!!"});
                         }
                   }
            });
    })

    .delete(function(req, res) {
             notas = mongoose.model('Notas');
             notas.remove({_id: req.params.nota_id}, function(err, notas) {
                   if (err)
                        res.send(err);
                   if (notas != null) {
                     if (fs.existsSync(docs)){
                            if (fs.existsSync(docs+'/'+notas._id) && notas._id!=""){
                               fs.readdirSync(docs+'/'+notas._id).forEach(function(file,index){
                                  var currentPath=docs+'/'+notas._id+'/'+file;
                                   if (!fs.lstatSync(currentPath).isDirectory()){
                                      fs.unlinkSync(currentPath);
                                   }
                                });
                                      fs.isEmpty(docs+'/'+notas._id, function(empty){
                                             if (empty)
                                                   fs.rmdirSync(docs+'/'+notas._id);
                                      });
                            }
                      }
                          res.json({message: "Nota excluída com sucesso!!" });
                   } else {
                          res.json({message: "Não foi possível excluir a Nota!!"});
                   }
            });
    });


module.exports = routerNotasId;
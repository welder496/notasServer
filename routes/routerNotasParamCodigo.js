var express = require('express');
var routerNotasParamCodigo = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');
var fs = require('extfs');

var docs = __base + '/documentos';

routerNotasParamCodigo.route('/id')
      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                      res.send(err);

                   if (notas != null)
                      res.json(notas._id);
                   else {
                      res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });

       });

routerNotasParamCodigo.route('/codigo')
      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                      res.send(err);

                   if (notas != null)
                      res.json(notas.codigo);
                   else {
                      res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });

       });

routerNotasParamCodigo.route('/nota')

     .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                      res.send(err);

                   if (notas != null)
                      res.json(notas.nota);
                   else {
                      res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
       });

routerNotasParamCodigo.route('/tags')

      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null)
                          res.json(notas.tags);
                   else {
                          res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
       });

routerNotasParamCodigo.route('/versao')

      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                  if (err)
                          res.send(err);
                  if (notas != null)
                          res.json(notas.versao);
                  else {
                          res.json({message: "Não foi possível encontrar a nota!!"});
                  }
            });
      });

routerNotasParamCodigo.route('/arquivos')

      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null)
                          res.json(notas.arquivos);
                   else {
                          res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
       });

routerNotasParamCodigo.route('/arquivo/:arquivo')

      .delete(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null) {
                          notas.arquivos.remove(req.params.arquivo);

                          notas.versao.push(parseInt(notas.__v + 1));
                          notas.versao.shift();

                          notas.save(function(err, notas){
                                if (fs.existsSync(docs)){
                                       if (fs.existsSync(docs+'/'+notas._id) && notas._id!=""){
                                             fs.readdirSync(docs+'/'+notas._id).forEach(function(file,index){
                                                    var currentPath=docs+'/'+notas._id+'/'+file;
                                                    if (req.params.arquivo == file)  {
                                                          if (!fs.lstatSync(currentPath).isDirectory()){
                                                                fs.unlinkSync(currentPath);
                                                          }
                                                   }
                                             });
                                             fs.isEmpty(docs+'/'+notas._id, function(empty){
                                               if (empty)
                                                   fs.rmdirSync(docs+'/'+notas._id);
                                             });
                                      }
                                }
                          });
                          res.json({message:"Arquivo excluído com sucesso!!"});
                   } else {
                          res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
      });

routerNotasParamCodigo.route('/arquivo/:arquivo/info')

      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.findOne({codigo:req.params.codigo}).exec(function(err,notas){
                  if (err)
                        res.send(err);
                  if (notas != null){
                          if (fs.existsSync(docs)){
                                var arquivo = docs+'/'+notas._id+'/'+req.params.arquivo.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                if (fs.existsSync(arquivo)){
                                      fs.stat(arquivo, function(err,stats){
                                             if (err)
                                                  res.send(err);
                                             res.json({name: arquivo, size: stats.size});
                                      });
                                }
                          }
                  }
            });
      });

module.exports = routerNotasParamCodigo;

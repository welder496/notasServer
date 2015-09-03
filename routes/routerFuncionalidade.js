var express = require('express');
var routerFuncionalidade = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var perfil = require('../model/funcionalidades');

routerFuncionalidade.route('/all')

      .get(function(req,res){
            funcionalidade = mongoose.model('Funcionalidade');
            funcionalidade.find().sort({'descricao':-1}).exec(function(err, funcionalidade) {
                    if (err)
                          res.send(err);
                    if (funcionalidade != null) {
                          res.json(funcionalidade);
                    } else {
                          res.json({message: "Funcionalidades não foram encontradas!!"});
                    }
            });
      });


routerFuncionalidade.route('/descricao/:descricao')

      .get(function(req,res){
             var descricao = req.params.descricao;

             funcionalidade = mongoose.model('Funcionalidade');
             funcionalidade.findOne({descricao: descricao}, function(err, funcionalidade){
                  if (err)
                        res.send(err);
                  if (funcionalidade != null) {
                        res.json(funcionalidade);
                  } else {
                        res.json({message: "Funcionalidade não foi encontrada!!"});
                  }
             });
      });

routerFuncionalidade.route('/new/descricao')

      .post(function(req,res){
            funcionalidade = mongoose.model('Funcionalidade');
            if (req.body.hasOwnProperty('descricao')) {
                  var Funcionalidade = new funcionalidade();
                  Funcionalidade.descricao = req.body.descricao;
                  funcionalidade.findOne({descricao: Funcionalidade.descricao}, function(err, funcionalidade){
                          if (funcionalidade != null) {
                                 res.json({message: "Funcionalidade já está cadastrada!!"});
                          } else {
                              funcionalidade.save(function(err){
                                 if (err)
                                       res.send(err);
                              });
                              res.json({message: "Funcionalidade cadastrada com sucesso!!"});
                          }
                  });
            } else {
                   res.json({message: "Não foi possível cadastrar a descrição de Funcionalidade!!"})
            }
      });

routerFuncionalidade.route('/new/:descricao/subtipo')

      .post(function(req,res){
            funcionalidade = mongoose.model('Funcionalidade');
            if (req.body.hasOwnProperty('subtipo')){
                  var descricao = req.params.descricao;
                  var subTipos = Object.keys(req.body.subtipo);
                  funcionalidade.findOne({descricao: descricao}).exec(function(err, funcionalidade){
                         if (err)
                             res.json(err);
                         if (funcionalidade != null) {
                             subTipos.forEach(function(key){
                                    var subtipo = subTipos[key];
                                    if (funcionalidade.subtipo.indexOf(subtipo)==-1)
                                          funcionalidade.subtipo.push(subtipo);
                             });
                             funcionalidade.save(function(err){
                                 if (err)
                                       res.json(err);
                             });
                             res.json({message: "Subtipo de Funcionalidade adicionado com sucesso!!"});
                         }
                  });
            } else {
                  res.json({message: "Não foi possível adicionar subtipo para esta Funcionalidade!!"});
            }

      });


module.exports = routerFuncionalidade;
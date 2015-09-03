var express = require('express');
var routerPerfil = express.Router();
var mongoose = require('mongoose');
var perfil = require('../model/perfis');

routerPerfil.route('/all')

      .get(function(req,res){
             perfil = mongoose.model('Perfil');
             perfil.find().sort({'descricao': -1}).exec(function(err, perfil) {
                    if (err)
                          res.send(err);
                    if (perfil != null) {
                          res.json(perfil);
                    } else {
                          res.json({message:"Perfis não foram encontrados!!"});
                    }
            });
      });

routerPerfil.route('/new')

      .post(function(req,res){

             perfil = mongoose.model('Perfil');
             if (req.body.hasOwnProperty('descricao')) {

                   var descricao = req.body.descricao;

                   var Perfil = new perfil();
                   Perfil.descricao = descricao;

                   models.perfil.findOne({descricao: Perfil.descricao}, function(err, perfil){
                        if (perfil != null) {
                              res.json({message: "Perfil foi encontrado!!"});
                        } else {
                               Perfil.save(function(err){
                                      if (err)
                                             res.send(err);
                               });
                               res.json({message: "Perfil cadastrado com sucesso!!"});
                         }
                   });
             } else {
                res.json({message:"Não foi possível cadastrar a descrição de Perfil!!"});
             }
      });

module.exports = routerPerfil;
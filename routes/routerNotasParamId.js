var express = require('express');
var routerNotasParamId = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

routerNotasParamId.route('/nota')

     .get(function(req,res){
            notas.findById(req.params.id).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null)
                          res.json(notas.nota);
                   else {
                         res.json({message:"Não foi possível encontrar a nota!!"});
                   }
             });
      });

routerNotasParamId.route('/tags')

      .get(function(req,res){
            notas.findById(req.params.id).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null)
                          res.json(notas.tags);
                   else  {
                          res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
       });

routerNotasParamId.route('/arquivos')

      .get(function(req,res){
            notas.findById(req.params.id).exec(function(err, notas){
                   if (err)
                          res.send(err);

                   if (notas != null)
                          res.json(notas.arquivos);
                   else {
                         res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
       });

module.exports = routerNotasParamId;
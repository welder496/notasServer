var express = require('express');
var routerNotasArquivos = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

routerNotasArquivos.route('/or*')

       .get(function(req,res){
             var iarquivos = req.query;

             var search = [];

             if (iarquivos.arquivos instanceof Array) {
                    var size = Object.keys(iarquivos.arquivos).length;
                    for (var i=0; i < size; i++){
                          search.push({ arquivos: { $regex: new RegExp(iarquivos.arquivos[i],'ig')}});
                    }
             } else {
                    search.push({ arquivos: { $regex: new RegExp(iarquivos.arquivos,'ig')}});
             }

             notas = mongoose.model('Notas');
             notas.find({$or: search}).sort({'criado_em': -1}).exec(function(err, notas) {
                    if (err)
                          res.send(err);
                    if (notas != null) {
                          res.json(notas);
                    } else {
                          res.json({message:"Notas não foram encontradas!!"});
                    }
             });
      });
/*
 * Search with AND operator with exact value behavior
 * The fields inputed into search most be complete
 */
routerNotasArquivos.route('/and*')

       .get(function(req,res){
             var iarquivos = req.query;

             var search = [];

             if (iarquivos.arquivos instanceof Array) {
                    var size = Object.keys(iarquivos.arquivos).length;
                    for (var i=0; i < size; i++){
                          search.push({ arquivos: { $regex: new RegExp(iarquivos.arquivos[i],'ig')}});
                   }
             } else {
                    search.push({ arquivos: { $regex: new RegExp(iarquivos.arquivos,'ig')}});
             }

             notas = mongoose.model('Notas');
             notas.find({$and: search}).sort({'criado_em': -1}).exec(function(err, notas) {
                   if (err)
                          res.send(err);
                    if (notas != null){
                          res.json(notas);
                    } else {
                          res.json({message:"Notas não foram encontradas!!"});
                    }
             });

       });


module.exports = routerNotasArquivos;
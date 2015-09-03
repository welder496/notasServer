var express = require('express');
var routerNotasAll = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');


routerNotasAll.route('/')

      .get(function(req,res){
            notas = mongoose.model('Notas');
            notas.find().sort({'criado_em': -1}).exec(function(err, notas) {
                    if (err)
                          res.send(err);
                    if (notas != null) {
                          res.json(notas);
                    } else {
                          res.json({message:"Notas não foram encontradas!!"});
                    }
            });
      });


routerNotasAll.route('/codigo')

    .get(function(req, res) {
          notas.find().sort({'criado_em': -1}).exec(function(err,notas){
                if (err)
                    res.send(err);

                var codigos = new Array();
                notas.forEach(function(item){
                      codigos.push(notas.codigo);
                });

                res.json(codigos);
          });
    });

routerNotasAll.route('/nota')

    .get(function(req, res) {
          notas.find().sort({'criado_em': -1}).exec(function(err,notas){
                if (err)
                    res.send(err);

                var nottas = new Array();
                notas.forEach(function(item){
                      nottas.push(notas.nota);
                });

                res.json(nottas);
          });
    });

routerNotasAll.route('/tags')

    .get(function(req, res) {
           notas.find().sort({'criado_em': -1}).exec(function(err, notas) {
               if (err)
                    res.send(err);

                var tags = new Array();
                notas.forEach(function(item){
                     tags.push(notas.tags);
                });

                res.json(tags);
          });
    });

routerNotasAll.route('/arquivos')

    .get(function(req, res) {
        notas.find().sort({'criado_em': -1}).exec(function(err, notas) {
            if (err)
                res.send(err);

             var arquivos = new Array();
             notas.forEach(function(item){
                   arquivos.push(notas.arquivos);
             });

            res.json(arquivos);
        });
    });



module.exports = routerNotasAll;
var express = require('express');
var routerNotasCodigoLike = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

routerNotasCodigoLike.route('/:codigo')

       .get(function(req, res) {
             var codigo = req.params.codigo.toUpperCase().trim();

             notas = mongoose.model('Notas');
             notas.find({codigo: {$regex: new RegExp(codigo,'ig')}}).sort({'criado_em': -1}).exec(function(err, notas) {
                    if (err)
                          res.send(err);
                    if (notas != null){
                          res.json(notas);
                    } else {
                          res.json({message: "Notas não foram encontradas!!"});
                    }
             });
       });


module.exports = routerNotasCodigoLike;

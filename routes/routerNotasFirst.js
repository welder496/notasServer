var express = require('express');
var routerNotasFirst = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

routerNotasFirst.route('/:quantity')

       .get(function(req, res) {

            var quantity = req.params.quantity;

            notas = mongoose.model('Notas');
            notas.find().sort({'criado_em': -1}).limit(quantity).exec(function(err, notas){
                    if (err)
                         res.send(err);
                    if (notas != null) {
                          res.json(notas);
                    } else {
                          res.json({message:"Nota não foi encontrada!!"});
                    }
            });
       });


module.exports = routerNotasFirst;
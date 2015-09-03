var express = require('express');
var routerNotasLike = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

routerNotasLike.route('/:nota')

    .get(function(req, res) {

        var reqs = req.params.nota;

        search = new RegExp(reqs,'ig');

        notas = mongoose.model('Notas');
        notas.find({nota: search}).sort({'criado_em': -1}).exec(function(err, notas) {
            if (err)
                  res.send(err);
            if (notas != null) {
                  res.json(notas);
            } else {
                  res.json({message:"Notas não foram encontradas!!"});
            }
        });
    });

module.exports = routerNotasLike;

var express = require('express');
var routerNotasTags = express.Router({mergeParams: true});
var mongoose = require('mongoose');
var notas = require('../model/notas');

/*
 * Search with the Like operator, with OR behavior
 * This search operates over tags field. Values do not need to be exact.
 */
routerNotasTags.route('/like*')

       .get(function(req, res) {
              var itags = req.query;

          var search = [];

          if (itags.tags instanceof Array) {
                      var size = Object.keys(itags.tags).length;
                for (var i=0; i < size; i++){
                          search.push(new RegExp(itags.tags[i],'ig'));
                }
          } else {
                search.push(new RegExp(itags.tags,'ig'));
          }

             notas = mongoose.model('Notas');
             notas.find({tags: {$in: search}}).sort({'criado_em': -1}).exec(function(err, notas) {
                    if (err)
                          res.send(err);
                    if (notas != null){
                          res.json(notas);
                    } else {
                          res.json({message:"Notas não foram encontradas!!"});
                    }
             });
       });

/*
 * Search with the OR operator
 * Operates over tags with exact values.
 */
routerNotasTags.route('/or*')

       .get(function(req, res) {
             var itags = req.query;

          var search = [];

          if (itags.tags instanceof Array) {
                      var size = Object.keys(itags.tags).length;
                for (var i=0; i < size; i++){
                          search.push({ tags :{ $regex: new RegExp(itags.tags[i],'ig')}});
                }
          } else {
                    search.push({ tags: { $regex: new RegExp(itags.tags,'ig')}});
          }

             notas = mongoose.model('Notas');
             notas.find({$or: search}).sort({'criado_em': -1}).exec(function(err, notas) {
                   if (err)
                          res.send(err);
                   if (notas != null){
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
routerNotasTags.route('/and*')

       .get(function(req, res) {
             var itags = req.query;

          var search = [];

          if (itags.tags instanceof Array) {
                      var size = Object.keys(itags.tags).length;
                for (var i=0; i < size; i++){
                          search.push({ tags :{ $regex: new RegExp(itags.tags[i],'ig')}});
                   }
          } else {
                    search.push({ tags: { $regex: new RegExp(itags.tags,'ig')}});
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



module.exports = routerNotasTags;
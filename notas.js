/*
 * Notas server with REST capability
 * Version: 1.0.0.15
 */

var fs = require('fs');
var multer = require('multer');
var util = require("util");
var notas = require('./model/notas');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path = require('path');

var docs = __dirname + '/documentos';

var port = process.env.PORT || 12345;

var router = express.Router();

/*
 * Database connection
 * Uses mongoDB (Document database)
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Notas');

/*
 * Configuring CORS(CROSS ORIGIN RESOURCE SHARING) for access REST routines
 */
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({inMemory:true}));
app.use('/notas',router);
app.use('/arquivos',express.static(docs));

/*
 * Here are configured many roots to connect with mongo db
 * This roots are REST roots that sends operations to mongo database
 */

router.route('/notas/:codigo/id')
      .get(function(req,res){
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

router.route('/notas/:codigo/codigo')
      .get(function(req,res){
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

router.route('/notas/:codigo/nota')

     .get(function(req,res){
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

router.route('/notas/:codigo/tags')

      .get(function(req,res){
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

router.route('/notas/:codigo/versao')

      .get(function(req,res){
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

router.route('/notas/:codigo/arquivos')

      .get(function(req,res){
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

router.route('/notas/:codigo/arquivo/:arquivo')

      .delete(function(req,res){
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
                                      }
                                }
                          });
                          res.json({message:"Arquivo excluído com sucesso!!"});
                   } else {
                          res.json({message:"Não foi possível encontrar a nota!!"});
                   }
            });
      });

router.route('/notas/:codigo/arquivo/:arquivo/info')

      .get(function(req,res){
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

/*
router.route('/notas/:id/nota')

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

router.route('/notas/:id/tags')

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

router.route('/notas/:id/arquivos')

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
*/
/*
 * Root defined to the document nota
 * See the "/model/notas.js"
 */
router.route('/notas/new')

     .post(function(req, res) {

             if (req.body.hasOwnProperty('codigo')){
                   var Notas = new notas();

                   Notas.codigo = req.body.codigo.toUpperCase().trim();
                   Notas.nota = decodeURI(req.body.nota);

                   var files = req.files;
                   var fileKeys = Object.keys(req.files);
                   fileKeys.forEach(function(key){
                          var arquivo = files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                          if (Notas.arquivos.indexOf(arquivo) == -1)
                                Notas.arquivos.push(arquivo);
                   });

                   Notas.tags = decodeURI(req.body.tags);

                   notas.findOne({codigo:Notas.codigo}, function(err, notas){
                        if (notas != null){
                              res.json({message: "A nota já está cadastrada!!"});
                        } else
                                if (typeof(Notas.codigo)!="undefined" &&
                                      typeof(Notas.nota)!="undefined" &&
                                      typeof(Notas.tags)!="undefined") {

                                Notas.save(function(err) {
                                      if (err)
                                             res.send(err);
                                      fs.mkdir(docs,function(err){
                                             fs.mkdir(docs+'/'+Notas._id,function(err){
                                                   fileKeys.forEach(function(key){
                                                          var arquivo = docs+'/'+Notas._id+'/'+files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                                          var writeStream = fs.createWriteStream(arquivo);
                                                          writeStream.write(files[key].buffer);
                                                          writeStream.end();
                                                   });
                                            });
                                      });
                                });
                                res.json({message: 'Nota criada com sucesso!'});
                          } else {
                                res.json({message: "Todos os campos devem ser preenchidos!!"});
                        }
                   });
             } else {
                res.json({message: "Digite um código para a nova Nota!!"});
             }
      });


router.route('/notas/first/:quantity')

       .get(function(req, res) {

            var quantity = req.params.quantity;

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

/*
 * This root gets all the "notas" document in the database
 */
router.route('/notas/all')

      .get(function(req,res){
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

/*
router.route('/notas/all/codigo')

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

router.route('/notas/all/nota')

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

router.route('/notas/all/tags')

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

router.route('/notas/all/arquivos')

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
*/
/*
 * Root defined to search for pieces of Nota
 */
router.route('/notas/like/:nota')

    .get(function(req, res) {

        var reqs = req.params.nota;

        search = new RegExp(reqs,'ig');

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

/*
 * Root created for access the documento from id
 * Get: search for object id
 * Put: update from object id
 * Delete: delete from object id
 */
router.route('/notas/id/:nota_id')

    .get(function(req, res) {
        notas.findById(req.params.nota_id, function(err, notas) {
            if (err)
                res.send(err);
            if (notas != null) {
                res.json(notas);
            } else {
                res.json({message:"Nota não foi encontrada!!"});
            }
        });
    })

    /*
     * Change update of nota due to graphic or other archive inserted before.
     */

   .put(function(req, res) {

             notas.findById(req.params.nota_id, function(err, notas){
                   if (notas == null){
                         res.json({message: "A nota não foi encontrada!!"});
                   } else {
                          notas.nota = decodeURI(req.body.nota);

                          var files = req.files;
                          var fileKeys = Object.keys(req.files);
                          fileKeys.forEach(function(key){
                                var arquivo = files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                if (notas.arquivos.indexOf(arquivo) == -1)
                                      notas.arquivos.push(arquivo);
                          });

                          notas.tags = decodeURI(req.body.tags);

                          notas.versao.push(parseInt(req.body.versao)+1);
                          notas.versao.shift();

                          if (typeof(notas.codigo)!="undefined" &&
                              typeof(notas.nota)!="undefined" &&
                              typeof(notas.tags)!="undefined") {

                                       if (parseInt(req.body.versao) >= notas.__v) {
                                             notas.save(function(err) {
                                                    if (err)
                                                           res.send(err);
                                                    fs.mkdir(docs,function(err){
                                                           fs.mkdir(docs+'/'+notas._id,function(err){
                                                                 fileKeys.forEach(function(key){
                                                                       var arquivo = docs+'/'+notas._id+'/'+files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                                                       var writeStream = fs.createWriteStream(arquivo);
                                                                       writeStream.write(files[key].buffer);
                                                                       writeStream.end();
                                                                 });
                                                          });
                                                    });
                                              });
                                              res.json({message:"Nota alterada com sucesso!!"});
                                       } else {
                                             res.json({message: 'A nota está sendo alterada por outro usuário. Tente novamente mais tarde...!!'});
                                       }
                          } else {
                                res.json({message:"Todos os campos devem ser preenchidos!!"});
                         }
                   }
            });
    })

    .delete(function(req, res) {
             notas.remove({_id: req.params.nota_id}, function(err, notas) {
                   if (err)
                        res.send(err);
                   if (notas != null) {
        	            if (fs.existsSync(docs)){
	                         if (fs.existsSync(docs+'/'+notas._id) && notas._id!=""){
		                         fs.readdirSync(docs+'/'+notas._id).forEach(function(file,index){
			                         var currentPath=docs+'/'+notas._id+'/'+file;
			                          if (!fs.lstatSync(currentPath).isDirectory()){
			       	                    fs.unlinkSync(currentPath);
			                          }
		                          });
	    	                          fs.rmdirSync(docs+'/'+notas._id);
	                         }
	                   }
                          res.json({message: "Nota excluída com sucesso!!" });
                   } else {
                          res.json({message: "Não foi possível excluir a Nota!!"});
                   }
            });
    });


/*
 * Access the Nota documento from "codigo" field
 * Get: Search from object id
 * Put: Update from object id
 * Delete: Delete from object id
 */
router.route('/notas/codigo/:codigo')

      .get(function(req, res) {
            var codigo = req.params.codigo.toUpperCase().trim();

             notas.findOne({codigo: codigo}, function(err, notas) {
                   if (err)
                          res.send(err);
                    if (notas != null){
                          res.json(notas);
                    } else {
                          res.json({message: "Nota não foi encontrada!!"});
                    }
             });
       })

       .put(function(req, res) {

             notas.findOne({codigo:req.params.codigo}, function(err, notas){
                   if (notas == null){
                         res.json({message: "A nota não foi encontrada!!"});
                   } else {
                          notas.nota = decodeURI(req.body.nota);

                          var files =req.files;
                          var fileKeys = Object.keys(req.files);

                          fileKeys.forEach(function(key){
                                var arquivo = files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                if (notas.arquivos.indexOf(arquivo) == -1)
                                       notas.arquivos.push(arquivo);
                          });

                          notas.tags = decodeURI(req.body.tags);

                          notas.versao.push(parseInt(req.body.versao)+1);
                          notas.versao.shift();

                          if (typeof(notas.codigo)!="undefined" &&
                              typeof(notas.nota)!="undefined" &&
                              typeof(notas.tags)!="undefined") {

                                       if (parseInt(req.body.versao) >= notas.__v) {
                                            notas.save(function(err) {
                                                  if (err)
                                                         res.send(err);
                                                  fs.mkdir(docs,function(err){
                                                         fs.mkdir(docs+'/'+notas._id,function(err){
                                                               fileKeys.forEach(function(key){
                                                                      var arquivo = docs+'/'+notas._id+'/'+files[key].originalname.replace(/[^a-zá-úÁ-Úâ-ûÂ-ÛA-Z0-9\-()\[\]\.]+/g,'_');
                                                                      var writeStream = fs.createWriteStream(arquivo);
                                                                      writeStream.write(files[key].buffer);
                                                                      writeStream.end();
                                                               });
                                                        });
                                                  });
                                            });
                                             res.json({message: 'Nota alterada com sucesso!'});
                                      } else {
                                             res.json({message: 'A nota está sendo alterada por outro usuário. Tente novamente mais tarde...!!'});
                                      }
                         } else {
                                res.json({message: "Todos os campos devem ser preenchidos!!"});
                         }
                   }
            });
       })

       .delete(function(req, res) {
             var codigo = req.params.codigo.toUpperCase().trim();
             var id = "";

             notas.findOne({codigo:codigo},function(err,notas){
                  id = notas._id;
             });

             notas.remove({codigo: codigo},function(err, notas) {
                   if (err)
                          res.send(err);

                   if (id != null) {
                          if (fs.existsSync(docs)){
	                          if (fs.existsSync(docs+'/'+id)){
		                          fs.readdirSync(docs+'/'+id).forEach(function(file,index){
		     	                          var currentPath=docs+'/'+id+'/'+file;
			                          if (!fs.lstatSync(currentPath).isDirectory()){
				                          fs.unlinkSync(currentPath);
			                          }
		                          });
		                          fs.rmdirSync(docs+'/'+id);
	                          }
	                   }
                          res.json({message: 'Nota excluída com sucesso!!' });
                   } else {
                          res.json({message: 'Não foi possível excluir a Nota!!'});
                   }
             });
      });

/*
 * Search with the Like operator, with OR behavior
 * This search operates over tags field. Values do not need to be exact.
 */
router.route('/notas/tags/like*')

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
router.route('/notas/tags/or*')

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
router.route('/notas/tags/and*')

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

/*
 * Search with OR operator with exact value behavior
 * The fields inputed into search most be complete
 */
router.route('/notas/arquivos/or*')

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
router.route('/notas/arquivos/and*')

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

/*
 *  Search with Codigo with like capability
 *
 */
router.route('/notas/codigo/like/:codigo')

       .get(function(req, res) {
             var codigo = req.params.codigo.toUpperCase().trim();

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

/*
 * Generic access to assess the application!!
 */
router.get('/', function(req, res){
   res.json({message: 'Aplicação notas está funcionando!!'});
});

console.log('Notas executando na porta ' + port);


module.exports = app;

/*End of Application
 *Written by: Welder Mauricio de Souza
 */


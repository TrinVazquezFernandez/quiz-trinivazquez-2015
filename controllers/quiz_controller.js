var models = require('../models/models.js');

//Autoload - factoriza el código se ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(
    function(quiz){
      if(quiz){
        req.quiz = quiz;
        next();
      }else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error){next(error);});
}

//GET /quizes/id
exports.show = function(req, res){
    res.render('quizes/show', {quiz: req.quiz});
}

//GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
}

//GET /quizes
// exports.index = function(req, res){
//   models.Quiz.findAll().then(
//     function(quizes){
//       res.render('quizes/index.ejs', {quizes:quizes});
//     }
//   ).catch(function(error){next(error);});
// }

//GET /quizes?search=texto_a_buscar
exports.index = function(req, res){
  var busqueda = '';
  if (req.query.search){
    busqueda += '%' + req.query.search.replace(' ', '%') + '%'
    models.Quiz.findAll({where:['pregunta like ?', busqueda], order: 'pregunta ASC'}).then(
      function(quizes){
        res.render('quizes/index.ejs', {quizes:quizes});
      }
    ).catch(function(error){next(error);});
  }
  else{
          models.Quiz.findAll().then(function(quizes) {
              res.render('quizes/index.ejs', {quizes: quizes});
          }).catch(function(error) {
              new(error);
          });

  }
}

//GET /quizes/creditos
exports.author = function(req, res){
  res.render('author', {autor: 'Trini Vázquez Fernández'
  });
}

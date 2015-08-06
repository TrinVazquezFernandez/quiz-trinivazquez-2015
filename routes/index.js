var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[] });
});

//Autoload de comandos con: quizeId
router.param('quizId', quizController.load); //autoload :quizeId
router.param('commentId', commentController.load); //autoload :commentId

router.get('/login', sessionController.new);
router.post('/login', sessionController.login);
router.get('/logout', sessionController.destroy);

router.get('/quizes', sessionController.validateSession, quizController.index);
router.get('/quizes/:quizId(\\d+)', sessionController.validateSession, quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', sessionController.validateSession, quizController.answer);
router.get('/quizes/new', sessionController.validateSession, sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.validateSession, sessionController.loginRequired, quizController.create);
router.put('/quizes/:quizId(\\d+)', sessionController.validateSession, sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.validateSession, sessionController.loginRequired, quizController.destroy);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.validateSession, sessionController.loginRequired, quizController.edit);

router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.validateSession, commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',sessionController.validateSession, commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
          sessionController.validateSession, sessionController.loginRequired, commentController.publish);

router.get('/author', quizController.author);
module.exports = router;

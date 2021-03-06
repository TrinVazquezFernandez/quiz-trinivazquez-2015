var path = require('path');

//Postgres DATABASE_URL = postgres://use:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
  dialect: protocol,
  protocol: protocol,
  port: port,
  host: host,
  storage: storage,
  omitNull: true
});

//Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar la definición de la tabla comments en comments.js
var comments_path = path.join(__dirname, 'comments');
var Comment = sequelize.import(comments_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //Exportar definición de la tabla Quiz
exports.Comment = Comment; //Exportar definición de la tabla Comment

//sequelize.sync() crea e inicializa tabla de preguntas en BD
sequelize.sync().then(function(){
  //success(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if(count === 0){ //La tabla se inicializa solo si está vacía
      Quiz.create({
        pregunta: 'Capital de Italia',
        respuesta: 'Roma',
        tema: 'Humanidades'
      });
      Quiz.create({
        pregunta: 'Capital de Portugal',
        respuesta: 'Lisboa',
        tema: 'Humanidades'
      })
      .then(function(){console.log('Base de datos inicializada')});
    }
  });
});

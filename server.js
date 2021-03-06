var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1;

app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.send('Todo send API Root');

app.get ('/' , function (req ,res){
	 res.send ('Todo send API Root');


});

//GET /todos
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};
  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }
  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }
  db.todo.findAll({
    where: where
  }).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).send();
  });
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {



  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function(e) {
    res.status(500).send();
  });


	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});
	 // var matchedTodo = _.findWhere(todos, {id: todoId});
	// todos.forEach (function (todo){
		// if (todoId === todo.id){
			// matchedTodo = todo;
			// return todo;
		// }
	// });
	// if (matchedTodo){
		// res.json (matchedTodo);
	// }else {
		// res.status(404).send();
	// }
	
// >>>>>>> 6c14ce2487b5abbeadf1d3acc8b87fee8c306e9b
});

//POST /todos/:id
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e) {
    res.status(400).json(e);
  });
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);


  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send();
  });
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  //var matchedTodo = _.findWhere(todos, {id: todoId});

  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }
    
  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      todo.update(attributes).then(function (todo){
          res.json(todo.toJSON());
      } , function (e){
          res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(404).send();
 
  });

  //_.extend (matchedTodo, validAttributes);
  //res.json (matchedTodo);
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
  });
});
const { db } = require("../util/admin");

exports.getAllTodos = (request, response) => {
  db.collection("todos")
    .where("username", "==", request.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(todos);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.getOneTodo = (request, response) => {
  db.doc(`/todos/${request.params.todoId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Todo not found" });
      }
      return response.json(doc.data());
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};
exports.postOneTodo = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Can not be empty" });
  }
  if (request.body.title.trim() === "") {
    return response.status(400).json({ title: "Can not be empty" });
  }

  const newItem = {
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
    username: request.user.username,
  };

  db.collection("todos")
    .add(newItem)
    .then((doc) => {
      return response.json({
        id: doc.id,
        ...newItem,
      });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: "Something went wrong" });
    });
};

exports.deleteTodo = (request, response) => {
  const document = db.doc(`/todos/${request.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Todo not found" });
      }
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: "Unauthorized" });
      }
      return document.delete();
    })
    .then(() => {
      return response.json({ message: "Todo deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editTodo = (request, response) => {
  if (request.body.todoId || request.body.createdAt) {
    response.status(403).json({ error: "Not allow to edit Todo" });
  }

  let document = db.collection("/todos").doc(`${request.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if (doc.data().username !== request.body.username)
        return response.status(403).json({ error: "Unauthorized" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
  document
    .update(request.body)
    .then(() => response.json({ message: "Update successfully" }))
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

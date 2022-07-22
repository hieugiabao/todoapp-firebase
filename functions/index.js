require("dotenv").config();
const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
} = require("./APIs/todos");
const { loginUser, signUpUser, uploadProfilePhoto } = require("./APIs/users");
const auth = require("./util/auth");

app.get("/todo", getAllTodos);
app.post("/todo", postOneTodo);
app.delete("/todo/:todoId", deleteTodo);
app.put("/todo/:todoId", editTodo);

app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/photo", auth, uploadProfilePhoto);

exports.api = functions.https.onRequest(app);

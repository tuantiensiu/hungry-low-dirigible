// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const shortid = require('shortid');

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({ todos: []})
  .write()

app.set("view engine", "pug");
app.set("views", "./views");
// https://expressjs.com/en/starter/basic-routing.html

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", (req, res) => {
  var q = req.query.q;
  var data = db.get("todos").value();
  if (q) {
    var matchWork = data.filter(item => {
      return item.text.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    res.render("todos", { works: matchWork });
  }
  res.render("todos", { works: data });
});

app.get("/todos/create", (req, res) => {
  res.render("create");
});

//delete user
app.get("/todos/:id/delete", (req, res) => {
  var userId = req.params.id;
  var user = db.get("todos").find({ id:userId}).value();
  db.get("todos").remove({ id:user.id}).write();
  res.redirect("/todos");
  
});

app.post("/todos/create", (req, res) => {
  var todoRecevie = req.body.todo;
  db.get("todos")
    .push({id: shortid.generate(), text: todoRecevie })
    .write();

  res.redirect("/todos");
});
//glitch.com/edit/#!/bai4-express?path=server.js:37:3
// listen for requests :)
https: app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

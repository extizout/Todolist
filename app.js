const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
//require locally module
const date = require(__dirname + '/date.js');

//conf for Express
const port = 3000;
const app = express();

//conf & connect to mongodb
const db = "todolistDB"
const dbPort = 27017
mongoose.connect("mongodb://localhost:" + dbPort + "/" + db);

//Schema & Model
const itemsSchema = {
  name: String
};
const Item = new mongoose.model("Item", itemsSchema)

const todo1 = new Item({
  name: "Buy food"
});
const todo2 = new Item({
  name: "Cigg"
});
const todo3 = new Item({
  name: "Learning"
});

Item.insertMany([todo1, todo2, todo3], (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully insert");
  };
})

const items = [];
const workItem = [];

//Set view engine to use EJS template
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
//Set staticFolder for relative location
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  let day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItems: items
  });
});

app.post("/", (req, res) => {
  let item = req.body.toDo;
  if (req.body.submit === 'Work') {
    workItem.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});


app.get('/work', (req, res) => {
  res.render("list", {
    listTitle: 'Work',
    newListItems: workItem
  });
})

app.post("/work", (req, res) => {
  let item = req.body.toDo;
  workItem.push(item);

  res.redirect('/work');
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

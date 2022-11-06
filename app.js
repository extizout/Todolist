const express = require('express');
const bodyParser = require('body-parser');
//require locally module
const date = require(__dirname + '/date.js');

const port = 3000;
const app = express();
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
  if(req.body.submit === 'Work'){
    workItem.push(item);
    res.redirect('/work');
  }else{
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

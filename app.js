const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const _ = require('lodash');
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
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const Item = new mongoose.model("Item", itemsSchema);
const List = new mongoose.model("List", listSchema);

//Conf for Default item
const todo1 = new Item({
  name: "Buy food"
});
const todo2 = new Item({
  name: "Cigg"
});
const todo3 = new Item({
  name: "Learning"
});

//Set view engine to use EJS templateconst dbPort = 27017
mongoose.connect("mongodb://localhost:" + dbPort + "/" + db);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
//Set staticFolder for relative location
app.use(express.static(__dirname + '/public'));

//Route root
app.get("/", (req, res) => {
  let day = date.getDate();
  Item.find({}, (err, items) => {
    res.render("list", {
      listTitle: "Today",
      newListItems: items
    });
  })
});

app.post("/", (req, res) => {
  let toDo = req.body.toDo;
  const submitType = req.body.submit;

  let newItem = new Item({
    name: toDo
  });

  if (submitType === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.find({
      name: submitType
    }, (err, result) => {
      result[0].items.push(newItem);
      result[0].save();

      res.redirect("/" + submitType);
    });
  };
});


app.get('/:customListName', (req, res) => {
  const capitalize = _.capitalize(req.params.customListName);
  const listName = capitalize;
  
  List.find({
    name: listName
  }, (err, result) => {
    if (!err) {
      if (result <= 0) {
        const listItem = new List({
          name: listName,
          items: [todo1, todo2, todo3]
        });

        listItem.save();

        console.log("Create " + listName + " Collection.");

        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: listName,
          newListItems: result[0].items
        });
        console.log("Already Create Collection.");
      };
    } else {
      console.log(err);
    }
  });
});

app.post("/work", (req, res) => {
  let item = req.body.toDo;
  workItem.push(item);
  res.redirect('/work');
});

app.post('/delete', (req, res) => {
  const checkedId = req.body.checkedbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedId, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedId}}}, (err,result)=>{
      if(!err){
        res.redirect("/" + listName);
      }
    });
  }
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

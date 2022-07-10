const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const connectionString =
  "mongodb+srv://raza:<password>@@cluster0.j5hy0dq.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.json());

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("Data inserted Successfuly!");
          res.redirect("/");
        })
        .catch((err) => console.error(err));
    });

  app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((result) => {
          res.render("index.ejs", { quotes: result });
          //console.log(result);
        })
        .catch((err) => console.error(err));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          {
            name: "Yoda",
          },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success!");
        })
        .catch((err) => console.error(err));
      //console.log(req.body);
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vadar's quote");
        })
        .catch((err) => console.error(err));
    });
    app.listen(3000, () => {
        console.log("listening on 3000");
    });
})
.catch((error) => console.error(error));



const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

const connectionString =
  "mongodb+srv://raza_2:zone123@cluster0.j5hy0dq.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    // Middlewares
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.json());


    // Routes

    //insert
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log("Data inserted Successfuly!");
          res.redirect("/");
        })
        .catch((err) => console.error(err));
    });

    //find
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((quotes) => {
          console.log(quotes);
          res.render("index.ejs", { quotes: quotes });
        })
        .catch((error) => console.error(error));
    });

    //update
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
    });

    //delete
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

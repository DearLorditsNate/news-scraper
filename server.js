// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

// Express
var PORT = process.env.PORT || 8000;
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars as default engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve public files
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

// Routes
// Home page
app.get("/", function(req, res) {
    db.Article.find({saved: false}).then(function(dbArticles) {
        res.render("home", {articles: dbArticles}); 
    }).catch(function(error) {
        console.log(error);
    });
});

// Saved articles
app.get("/saved", function (req, res) {
    db.Article.find({saved: true}).then(function(savedArticles) {
        // console.log(savedArticles);
        res.render("saved", {articles: savedArticles});
    }).catch(function(error) {
        console.log(error);
    });
});

// Scrape new articles
app.get("/scrape", function (req, res) {
    axios.get("https://www.digg.com").then(function (response) {
        var $ = cheerio.load(response.data);
        $("article").each(function (i, element) {

            var title = $(element).find("h2").text();
            var link = $(element).attr("data-contenturl");
            var summary = $(element).find(".digg-story__description").text();

            console.log(title);
            console.log(link);
            console.log(summary);

            db.Article.create({
                title: title,
                link: link,
                summary: summary
            }).then(function(inserted) {
                res.redirect("/");
            }).catch(function(error) {
                console.log(error);
            });
        });
    });
});

app.get("/clear", function(req, res) {
    db.Article.deleteMany({}).then(function(deleted) {
    }).then(function(dbArticle) {
        return db.Note.deleteMany({});
    }).then(function(dbNote) {
        res.redirect("/");
    }).catch(function(error) {
        console.log(error);
    });
});

app.put("/save/:id", function(req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { saved: true } }
    )
      .then(function(saved) {
        res.json(saved);
      })
      .catch(function(error) {
        console.log(error);
      });
});

app.delete("/delete/:id", function(req, res) {
    db.Article.deleteOne({_id: req.params.id}).then(function(deleted) {
        console.log(deleted);
        res.json(deleted);
    }).catch(function(error) {
        console.log(error);
    });
});

app.post("/savenote/:id", function(req, res) {
    db.Note.create({note: req.body.note}).then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        ).then(function(dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        }).catch(function(error) {
            console.log(error);
        });
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
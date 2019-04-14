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
    db.Article.find({}).then(function(dbArticles) {
        console.log(dbArticles);
        res.render("home", {articles: dbArticles}); 
    });
});

// Saved articles
app.get("/saved", function (req, res) {
    res.render("saved");
});

// Scrap new articles
app.get("/scrape", function (req, res) {
    axios.get("https://www.digg.com").then(function (response) {
        var $ = cheerio.load(response.data);
        $("h2 a").each(function (i, element) {

            var title = $(element).text();
            var link = $(element).attr("href");

            db.Article.create({
                title: title,
                link: link
            }, function (error, inserted) {
                if (error) {
                    console.log(error);
                } else {
                    // res.send("Scrape complete!");
                    res.redirect("/");
                }
            });
        });
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
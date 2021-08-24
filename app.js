//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',   {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model ("Article", articleSchema)

app.get("/articles", function(req, res){
Article.find(function(err, foundArticles){
    if (!err){
        res.send(foundArticles)
    
}else{
    res.send(err)
}
})
})

app.post("/articles", function(req, res){

    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(res, req){
        if (!err){
            res.send("successfully added new article")
        }else{
        res.send(err)
    }
    })
})

app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("successfully deleted all articles")
        } else {
            res.send(err)
        }
    })
})

///////////////////////////Request targetting A specific Article ///////////////////////

app.get("/articles/:articleTitle", function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle) {
            res.send(foundArticle)
         }else{
        res.send("No article matching that title was found")
    }
    }) 
    })
    
    app.put("/articles/:articleTitle", function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
              if (!err){
                res.send("successfully updated article")
          }
        })
        })

    app.patch("/articles/:articleTitle", function(req, res){
         Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("successfully updated article")
                }else{
                    res.render(err)
                }
        }
        )
        })

        app.delete("/articles/:articleTitle", function(req, res){
            Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
              if (!err){
                res.send("successfully deleted article")
            }else{
                res.render(err)
            }
        })
        })
        

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
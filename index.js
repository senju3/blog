const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require('./databases/connection');

const ArticleController = require('./articles/ArticleController')
const CategoryController = require('./categories/CategoryController')
const Article = require('./articles/Article');
const Category = require('./categories/Category')

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DATABASES
connection.authenticate().then(() => {
    console.log("connected with database !")
}).catch(error => {
    console.log(error)
});

//VIEW ENGINE
app.set('view engine', 'ejs');


//ROTAS GET
app.get("/", (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']]
    }).then(articles => {
        res.render('index', {articles: articles});
    });  
});
app.get("/:slug", (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        res.render('article', {article: article});
    });  
});
app.use("/", ArticleController);
app.use("/", CategoryController);

//STATIC
app.use(express.static('public'));

//SERVIDOR
app.listen(8080, error => {
    if(error) {
        console.log(error)
    }else{
        console.log("Server running !");
    };
})
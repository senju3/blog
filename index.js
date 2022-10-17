const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./databases/connection');

const ArticleController = require('./articles/ArticleController')
const CategoryController = require('./categories/CategoryController');
const UserController = require('./users/UsersController');


const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User');

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//SESSION
app.use(session({
    secret: 'asdfserfse', cookie: {maxAge: 3000000}, resave: true, saveUninitialized: true
}))


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
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });  
});
app.get("/:slug", (req, res) => {
    let slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        }else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    });  
});
app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        }, include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        }else {
            res.redirect('/')
        }
    }).catch(error => {
        res.redirect('/')
    });  
});
                                            // LISTAGEM DE DEFINIÇÃO DE USO DOS CONTROLLERS
app.use("/", ArticleController);
app.use("/", CategoryController);
app.use("/", UserController);

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
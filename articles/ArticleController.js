const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });    
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

router.post('/articles/save', (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    }).then(() => {
        res.redirect('/admin/articles')
    })
});
                                 // - delete
router.post('/articles/delete', (req, res) => {
    let id = req.body.id;

    if(id != undefined){

        if(!isNaN(id)){ //caso tenha passado em todas validações
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })
        }else{ //caso não seja um número
            res.redirect('/admin/articles')
        }
    }else{ //caso seja null
        res.redirect('/admin/articles')
    }
});
module.exports = router;
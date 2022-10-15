const express = require('express');
const router = express.Router();
const Category = require("../categories/Category");
const Article = require('./Article');
const slugify = require('slugify');

                                                //ROTAS GET
                                                // listing of article + delete and edit
router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });    
});
                                                // Adding new article in database
router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

                                                // page of edit
router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {article: article, categories: categories});
            });
            
        }else{
            res.redirect('/admin/articles');
        };
    }).catch(error => {
        res.redirect('/admin/articles')
    })
    
})
                                                // page pagination
router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0
    }else {
        offset = (parseInt(page) * 4)-4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then(articles => {
        let next
        if(offset + 4 >= articles.count){
            next = false;
        }else {
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        };

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories});
        });
    })

    
    /*
     */
    

})

                                                //ROTAS POST
                                                // - Save new article
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
                                                // - update
router.post('/articles/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;


    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    }, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(error => {
        res.redirect('/')
    })

})
module.exports = router;
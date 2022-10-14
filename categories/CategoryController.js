const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');

                                 //ROTAS GET
router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
});
router.get('/admin/categories', (req, res) => {
    
    Category.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories});
    })
    
});
                                 // ROTAS GET with PARAMS   
router.get("/admin/categories/edit/:id", (req, res) => {
    let id = req.params.id;

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit', {category: category});
        }else{
            res.redirect('/admin/categories')
        }
    }).catch(error => {
        res.redirect('/admin/categories')
    })
    
})
                                 // ROTA POST 
                                 // - new category
router.post('/form-new-category', (req, res) => {
    let title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/')
        })
    }else{
        res.redirect('/admin/categories/new');
    }
})
                                 // - delete
router.post('/categories/delete', (req, res) => {
    let id = req.body.id;

    if(id != undefined){

        if(!isNaN(id)){ //caso tenha passado em todas validações
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories')
            })
        }else{ //caso não seja um número
            res.redirect('/admin/categories')
        }
    }else{ //caso seja null
        res.redirect('/admin/categories')
    }
});
                              // - Atualizar
router.post('/categories/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    Category.update({
        title: title,
        slug: slugify(title)
    }, {
        where: {id: id}
    }).then(() => {
        res.redirect("/admin/categories")
    })

})

module.exports = router;
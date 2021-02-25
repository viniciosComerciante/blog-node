const express = require('express');
const router = express.Router();
const Category = require("../categories/CategoryModel.js");
const Article = require('./ArticleModel.js');
const slugify = require("slugify");


router.get('/admin/articles', (req, res)=>{

    Article.findAll({
        include:[{model: Category}]
    }).then(categories =>{
        res.render('admin/articles/index',{articles :categories});
    });


})

router.get('/admin/articles/new', (req, res)=>{
    Category.findAll().then(categories =>{
        res.render('./admin/articles/new', {categories:categories});
    })
})

router.post('/articles/save', (req, res)=>{
    const title = req.body.title;
    const category = req.body.category;
    const body = req.body.body;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{

        res.redirect('/admin/articles');

    })
})

router.post('/articles/delete', (req, res)=>{
    var id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id:id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            })
        }
        else{
            res.redirect('/admin/articles');
        }
    }else{
        res.redirect('/admin/articles');
    }
})


router.get('/admin/articles/edit/:id', (req, res)=>{

    const id = req.params.id;
    

    if(!isNaN(id)){
        Article.findByPk(id).then((article)=>{
            
            if(article != undefined){
                Category.findAll().then(categories =>{
                    res.render('./admin/articles/edit', {article: article, categories:categories});
                })
            }else{
                res.redirect('/admin/articles');
            }

        }).catch((error)=>{
            res.redirect('/admin/articles');
        })
    }else{
        res.redirect('/admin/articles');
    }
})

router.post('/admin/articles/update', (req, res)=>{

    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.category;

    Article.update({title: title, slug: slugify(title), body: body, categoryId: categoryId}, {
        where:{
            id:id,
        }
    }).then(()=>{
        res.redirect('/admin/articles');
    })

})

router.get("/articles/page/:num", (req, res)=>{
    const page = req.params.num;
    let offset = 0;
    const limit = 4;

    if(isNaN(page) || page ==1){
        offset = 0;
    }
    else{
        offset = parseInt(page-1) * limit;
    }

    //retorna todos os artigos e também retorana a quantidade de elementos existentes no banco de dados
    Article.findAndCountAll({
        limit: limit,
        offset: offset,
    }).then((articles)=>{

        var next;

        if(offset + limit >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next: next,
            articles: articles,
        }

        res.json(result);
    })
})




module.exports = router;
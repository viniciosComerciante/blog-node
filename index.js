const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database.js');

const categoriesController = require('./categories/CategoriesController.js');
const articlesController = require('./articles/ArticlesController.js');

const Article = require('./articles/ArticleModel');
const category = require('./categories/CategoryModel');


//view engine
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database

connection.authenticate()
    .then(()=>{
        console.log('conexão bd feita com sucesso')
    })

    .catch((error)=>{

        console.log(error);
    })


app.use("/", categoriesController);
app.use('/', articlesController);


app.get('/', (req, res)=>{
    Article.findAll().then((articles)=>{
        res.render('index', {articles: articles});
    })
})

app.get('/:slug', (req,res)=>{
    const slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then((article)=>{
        if(article != undefined){
            res.render("article", {article: article});
        }else{
            res.redirect('/');
        }
    }).catch((error)=>{
        res.redirect('/');
    })
})

app.listen(80, ()=>{
    console.log('o servidor está rodando');
})
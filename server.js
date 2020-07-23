    const PORT = 4000
var express = require('express')
var app = express()
var handlebars = require('express-handlebars')
var bodyParser = require('body-parser')
var nextid = 1

var posts = [
    {id: 0,
    title: 'The Default Post' ,
    author: 'Myself',
    content: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum'},
    ]

function FindPostById(postid)
{
    var post = null
    for(var i=0; i < posts.length; i++)
    {
        if(postid == posts[i].id)
        {
            post = posts[i]
        }
    }
    if(post == null) return false
    else return post
}

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('static'))

app.set('view-engine','hbs')
app.engine('hbs', handlebars({
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}))


app.listen(PORT, function(req,res){
    console.log('server started at: '+PORT);
})


//INDEX
app.get('/', function(req,res){
    res.render('index.hbs',{posts: posts})
})
//SHOW
app.get('/show/:id', function(req,res){
    var id = req.params.id
    var currentpost = FindPostById(id)
    res.render('show.hbs',currentpost)
})
//NEW
app.get('/new', function(req,res){
    var actionName = '/create'
    res.render('new.hbs',{actionName: actionName})
})
//CREATE
app.post('/create',function(req,res){
    var post = {id: nextid}
    if(Object.keys(req.body).includes("title"))
    {
        post.title = req.body.title
    }
    if(Object.keys(req.body).includes("author"))
    {
        post.author = req.body.author
    }
    if(Object.keys(req.body).includes("content"))
    {
        post.content = req.body.content
    }
    if(post.title == "") post.title = "Default title"
    if(post.author == "") post.author = "Default author"
    if(post.content == "") post.content = "Default content"
    posts.push(post)
    nextid++
    res.redirect('/show/'+post.id)
})
//EDIT
app.get('/edit/:id', function(req,res){
    var id = req.params.id
    var actionName = '/update/'+id
    res.render('edit.hbs', {actionName: actionName})
})
//UPDATE
app.post('/update/:id', function(req,res){
    var id = req.params.id
    var post = FindPostById(id)
    if(Object.keys(req.body).includes('title') && req.body.title != "")
    {
        post.title = req.body.title
    }
    if(Object.keys(req.body).includes('author') && req.body.author != "")
    {
        post.author = req.body.author
    }
    if(Object.keys(req.body).includes('content') && req.body.content != "")
    {
        post.content = req.body.content
    }
    res.redirect('/show/'+post.id)
})
//DESTROY
app.get('/destroy/:id', function(req,res){
    var id = req.params.id
    var post = FindPostById(id)
    var index = posts.indexOf(post)
    if(index > -1) posts.splice(index, 1)
    res.redirect('/')
})
//SEARCHFORM
app.get('/search', function(req,res){
    res.render('search.hbs')
})
//SEARCH
app.post('/search', function(req,res){
    var searchedID = req.body.search
    var currentpost = FindPostById(searchedID)
    var found = null

    if(currentpost.id != undefined) found = true
    else found = false
    
    if(found) res.redirect('/show/'+currentpost.id)
    else res.redirect('/error')
})
//ERROR
app.get('/error', function(req,res){
    res.render('error.hbs')
})

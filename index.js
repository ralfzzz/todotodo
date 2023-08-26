import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8003;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.listen(port,() => {
    console.log(`node running on port ${port}`);
});

app.get('/tes',(req, res) => {
    res.send('ralfzzz ready!');
});

let todo = ["makan", "makan2"];
let workTodo = ["kerja", "kerja2"];

app.get('/', (req, res) => {
    res.render('todo.ejs',{
        'todo' : todo, 
        'active': 'todo',
    })
})

app.post('/add', (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    if(req.body.add == 'todo'){
        todo.push(newTodo);
        res.redirect('/')
    } else {
        workTodo.push(newTodo);
        res.redirect('/work');
    }

})

app.post('/delete', (req,res, next) => {
    // console.log(req.body.deletedTodo);
    let deletedTodo = req.body.deletedTodo;
    if(req.body.deleted == 'todo'){
        todo.splice(deletedTodo, 1);
        res.redirect('/');
    } else {
        workTodo.splice(deletedTodo, 1);
        res.redirect('/work');
    }
})

app.get('/work', (req, res) => {
    res.render('todo.ejs', {
        'todo': workTodo,
        'active': 'work',
    });
})
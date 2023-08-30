import express from "express";
import bodyParser from "body-parser";
import cron from "node-cron";

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

let todo = ["tododo1", "tododo2","tododo3"];
let checkedTodo = ["check", "uncheck","uncheck"];
let workTodo = ["tododo1", "tododo2","tododo3"];
let checkedWorkTodo = ["uncheck", "check","uncheck"];

app.get('/', (req, res) => {
    res.render('todo.ejs',{
        'todo' : todo, 
        'active': 'todo',
        'check': checkedTodo,
    })
})

app.get('/work', (req, res) => {
    res.render('todo.ejs', {
        'todo': workTodo,
        'active': 'work',
        'check': checkedWorkTodo,
    });
})

app.post('/add', (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    if(req.body.add == 'todo'){
        todo.unshift(newTodo);
        checkedTodo.unshift('');
        res.redirect('/')
    } else {
        workTodo.unshift(newTodo);
        checkedWorkTodo.unshift('');
        res.redirect('/work');
    }
})

app.post('/delete', (req,res, next) => {
    // console.log(req.body.deletedTodo);
    let deletedTodo = req.body.deletedTodo;
    if(req.body.deleted == 'todo'){
        todo.splice(deletedTodo, 1);
        checkedTodo.splice(deletedTodo, 1);
        res.redirect('/');
    } else {
        workTodo.splice(deletedTodo, 1);
        checkedWorkTodo.splice(deletedTodo, 1);
        res.redirect('/work');
    }
})

app.post('/checked', (req,res) => {
    let check = req.body.check;
    // console.log(req.body.add);
    if(req.body.checked == 'todo'){
        checkedTodo[check] = checkedTodo[check]=='check'?'':'check';
        res.redirect('/')
    } else {
        checkedWorkTodo[check] = checkedWorkTodo[check]=='check'?'':'check';
        res.redirect('/work');
    }
})

cron.schedule('0 0 * * *', () => {
    if (todo.length>50 || workTodo.length>50) {
        todo = ["tododo1", "tododo2","tododo3"];
        checkedTodo = ["check", "uncheck","uncheck"];
        workTodo = ["tododo1", "tododo2","tododo3"];
        checkedWorkTodo = ["uncheck", "check","uncheck"];
        console.log('tododo data restarted!');
    }
  });
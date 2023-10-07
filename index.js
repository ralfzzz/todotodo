import express from "express";
import bodyParser from "body-parser";
// import cron from "node-cron";
import mongoose, { Mongoose } from "mongoose";

const app = express();
const port = 8003;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/tes',(req, res) => {
    res.send('ralfzzz ready!');
});

mongoose.connect('mongodb+srv://horsejaran22:V7pey02EdxEhc3F2@cluster0.k1mgs8m.mongodb.net/todoDB') // if error it will throw async error
    .then(() => { // if all is ok we will be here
        return app.listen(port,() => {
            console.log(`node and mongo is running`);
        });
    })
    .catch(err => { // we will not be here...
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

//CREATE MODEL/COLLECTIONS with data types & validations
const todoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true
      }
});

//DEFINE DATA INSERTED
const Todo = mongoose.model('todos', todoSchema);

const todo = new Todo({
    todo:"asdfasdf"
})

await todo.save().then((res,err)=>{
    if (!err) {
        console.log("todo inserted!")
    } else {
        console.log(err)
    }
});


let todo2 = ["tododo1", "tododo2","tododo3"];
let checkedTodo = ["check", "uncheck","uncheck"];
let workTodo = ["tododo1", "tododo2","tododo3"];
let checkedWorkTodo = ["uncheck", "check","uncheck"];

app.get('/', (req, res) => {
    res.render('todo.ejs',{
        'todo' : todo2, 
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

// cron.schedule('0 0 * * *', () => {
//     if (todo.length>50 || workTodo.length>50) {
//         todo = ["tododo1", "tododo2","tododo3"];
//         checkedTodo = ["check", "uncheck","uncheck"];
//         workTodo = ["tododo1", "tododo2","tododo3"];
//         checkedWorkTodo = ["uncheck", "check","uncheck"];
//         console.log('tododo data restarted!');
//     }
//   });
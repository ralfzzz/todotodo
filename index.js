import express from "express";
import bodyParser from "body-parser";
// import cron from "node-cron";
import mongoose from "mongoose";

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
      },
      statusTodo: {
        type: String,
      }
});
const workTodoSchema = new mongoose.Schema({
    workTodo: {
        type: String,
      },
      statusWorkTodo: {
        type: String,
      }
});

const Todo = mongoose.model('todos', todoSchema);
const WorkTodo = mongoose.model('workTodos', workTodoSchema);

//DEFINE DATA INSERTED

// const todo = new Todo({
//     todo:"makan3",
//     statusTodo:"uncheck",
//     workTodo:"makan4",
//     statusWorkTodo:"check",
// })

// await todo.save().then((res,err)=>{
//     if (!err) {
//         console.log("todo inserted!");
//         mongoose.connection.on('exit', function (){
//             mongoose.disconnect();
//         });
//     } else {
//         console.log(err);
//     }
// });


//GET DATA INSERTED
// let todo2 = [];
// await Todo.find({}).then((res,err)=>{
//     if (!err) {
//         res.forEach(todos => {
//             todo2.unshift(todos.todo)
//         });
//         // return todo2;
//     } else {
//         console.log(err);
//     }
// });


// let todo2 = ["tododo1", "tododo2","tododo3"];
// let checkedTodo = ["check", "uncheck","uncheck"];
// let workTodo = ["tododo1", "tododo2","tododo3"];
// let checkedWorkTodo = ["uncheck", "check","uncheck"];
let todoList = [];
let statusTodo = [];
let workTodo = [];
let statusWorkTodo = [];

app.get('/', async (req, res) => {
    await Todo.find({}).then((res,err)=>{
        if (!err) {
            if (res.length !== todoList.length) {
                todoList = [];
                statusTodo = [];
                res.forEach(todos => {
                    todoList.unshift(todos.todo);
                    statusTodo.unshift(todos.statusTodo);
                });   
                console.log(todoList);
            }
        } else {
            console.log(err);
        }
    });
    res.render('todo.ejs',{
        'todo' : todoList, 
        'active': 'todo',
        'check': statusTodo,
    })
})

app.get('/work', async (req, res) => {
    await WorkTodo.find({}).then((res,err)=>{
        if (!err) {
            if (res.length !== workTodo.length) {
                workTodo = [];
                statusWorkTodo = [];
                res.forEach(todos => {
                    workTodo.unshift(todos.workTodo);
                    statusWorkTodo.unshift(todos.statusWorkTodo);
                });
            };   
        } else {
            console.log(err);
        }
    });
    res.render('todo.ejs', {
        'todo': workTodo,
        'active': 'work',
        'check': statusWorkTodo,
    });
})

app.post('/addTodo', async (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    const todo = new Todo({
        todo:newTodo,
        statusTodo:"uncheck",
    })
    await todo.save().then((res,err)=>{
        if (!err) {
            console.log("todo inserted!");
            mongoose.connection.on('exit', function (){
                mongoose.disconnect();
            });
        } else {
            console.log(err);
        }
    });
    res.redirect('/')
    
    // if(req.body.add == 'todo'){
    //     todoList.unshift(newTodo);
    //     checkedTodo.unshift('');
    //     res.redirect('/')
    // } else {
    //     workTodo.unshift(newTodo);
    //     checkedWorkTodo.unshift('');
    //     res.redirect('/work');
    // }
})

app.post('/addWorkTodo', async (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    if (newTodo!==null) {        
        const workTodoDB = new WorkTodo({
            workTodo:newTodo,
            statusWorkTodo:"uncheck",
        })
        await workTodoDB.save().then((res,err)=>{
            if (!err) {
                console.log("todo inserted!");
                mongoose.connection.on('exit', function (){
                    mongoose.disconnect();
                });
            } else {
                console.log(err);
            }
        });
    }
    res.redirect('/work')

    // if(req.body.add == 'todo'){
    //     todoList.unshift(newTodo);
    //     checkedTodo.unshift('');
    //     res.redirect('/')
    // } else {
    //     workTodo.unshift(newTodo);
    //     checkedWorkTodo.unshift('');
    //     res.redirect('/work');
    // }
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
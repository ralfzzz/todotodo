import express from "express";
import bodyParser from "body-parser";
// import cron from "node-cron";
import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import 'dotenv/config';

const app = express();
const port = 8003;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/tes',(req, res) => {
    res.send('ralfzzz ready!');
});

mongoose.connect(process.env.URI_MONGODB) // if error it will throw async error
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
        unique: true
      },
      statusTodo: {
        type: String,
      }
});
const workTodoSchema = new mongoose.Schema({
    workTodo: {
        type: String,
        unique: true
      },
      statusWorkTodo: {
        type: String,
      }
});

todoSchema.plugin(mongooseUniqueValidator);
workTodoSchema.plugin(mongooseUniqueValidator);
const Todo = mongoose.model('todos', todoSchema);
const WorkTodo = mongoose.model('workTodos', workTodoSchema);


let todoList = [];
let statusTodo = [];
let workTodo = [];
let statusWorkTodo = [];
let status = 'success';

app.get('/', async (req, res) => {
    await Todo.find({}).then((res)=>{
            if (res.length !== todoList.length) {
                todoList = [];
                statusTodo = [];
                res.forEach(todos => {
                    todoList.unshift(todos.todo);
                    statusTodo.unshift(todos.statusTodo);
                });   
                // console.log(todoList);
            }
    }).catch(error => {
        console.log(error);
    });
    res.render('todo.ejs',{
        'todo' : todoList, 
        'active': 'todo',
        'check': statusTodo,
        'status': status
    })
})

app.get('/work', async (req, res) => {
    await WorkTodo.find({}).then((res)=>{
            if (res.length !== workTodo.length) {
                workTodo = [];
                statusWorkTodo = [];
                res.forEach(todos => {
                    workTodo.unshift(todos.workTodo);
                    statusWorkTodo.unshift(todos.statusWorkTodo);
                });
            };   
    }).catch(error => {
        console.log(error);
    });
    res.render('todo.ejs', {
        'todo': workTodo,
        'active': 'work',
        'check': statusWorkTodo,
        'status': status
    });
})

app.post('/addTodo', async (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    if (todoList.includes(newTodo)) {
        status = 'REminder: maKe unIque TODO!'
    } else {
    const todo = new Todo({
        todo:newTodo,
        statusTodo:"uncheck",
    })
    // console.log(todoList);
        await todo.save().then((res,err)=>{
            if (!err) {
                console.log("todo inserted!");
                mongoose.connection.on('exit', function (){
                    mongoose.disconnect();
                });
            } else {
                console.log(err.message);
            }
        });
    }
    res.redirect('/')
})

app.post('/addWorkTodo', async (req, res, next) => {
    let newTodo = req.body.todo;
    // console.log(req.body.add);
    if (workTodo.includes(newTodo)) {
        status = 'REminder: maKe unIque TODO!'
    } else {
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

})

app.post('/deleteTodo', async (req,res, next) => {
    // console.log(req.body.deletedTodo);
    let deletedTodo = req.body.deletedTodo;

    await Todo.deleteOne({ todo: deletedTodo }).then(function(){
        console.log("Data deleted!"); // Success
    }).catch(function(error){
        console.log(error); // Failure        
    });
    res.redirect('/');
})

app.post('/deleteWorkTodo', async (req,res, next) => {
    // console.log(req.body.deletedTodo);
    let deletedTodo = req.body.deletedTodo;

    await WorkTodo.deleteOne({ workTodo: deletedTodo }).then(function(){
        console.log("Data deleted!"); // Success
    }).catch(function(error){
        console.log(error); // Failure        
    });
    res.redirect('/work');
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


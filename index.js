import express from "express";
import bodyParser from "body-parser";
// import cron from "node-cron";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";
import 'dotenv/config';
import _ from "lodash";

const app = express();
const port = 8003;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

// app.get('/tes',(req, res) => {
//     res.send('ralfzzz ready!');
// });

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

// todoSchema.plugin(mongooseUniqueValidator);
// workTodoSchema.plugin(mongooseUniqueValidator);
const Todo = mongoose.model('todos', todoSchema);
const WorkTodo = mongoose.model('workTodos', workTodoSchema);


let todoList = [];
let statusTodo = [];
let idTodoList = [];
let workTodo = [];
let statusWorkTodo = [];
let idWorkTodo = [];
let status = 'success';

app.get('/', async (req, res) => {
    await Todo.find({}).then((res)=>{
            if (res !== todoList) {
                todoList = [];
                statusTodo = [];
                res.forEach(todos => {
                    todoList.unshift(todos.todo);
                    statusTodo.unshift(todos.statusTodo);
                    idTodoList.unshift(todos._id)
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
        'status': status,
        'id': idTodoList
    })
})

app.get('/work', async (req, res) => {
    await WorkTodo.find({}).then((res)=>{
            if (res !== workTodo) {
                workTodo = [];
                statusWorkTodo = [];
                res.forEach(todos => {
                    workTodo.unshift(todos.workTodo);
                    statusWorkTodo.unshift(todos.statusWorkTodo);
                    idWorkTodo.unshift(todos._id)
                });
            };   
    }).catch(error => {
        console.log(error);
    });
    res.render('todo.ejs', {
        'todo': workTodo,
        'active': 'work',
        'check': statusWorkTodo,
        'status': status,
        'id': idWorkTodo
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

    await Todo.deleteOne({ _id: deletedTodo }).then(function(){
        console.log("Data deleted!"); // Success
    }).catch(function(error){
        console.log(error); // Failure        
    });
    res.redirect('/');
})

app.post('/deleteWorkTodo', async (req,res, next) => {
    // console.log(req.body.deletedTodo);
    let deletedTodo = req.body.deletedTodo;

    await WorkTodo.deleteOne({ _id: deletedTodo }).then(function(){
        console.log("Data deleted!"); // Success
    }).catch(function(error){
        console.log(error); // Failure        
    });
    res.redirect('/work');
})

app.post('/checkedTodo', async (req,res) => {
    let check = req.body.check;
    let key = req.body.key;
    // console.log(key);
    // console.log(req.body.add);
    if (check == "check") {
        await Todo.updateOne({ _id: key },{statusTodo: "uncheck"}).then(function(){
            console.log("Data updated!"); // Success
        }).catch(function(error){
            console.log(error); // Failure        
        });
    } else {
        await Todo.updateOne({ _id: key },{statusTodo: "check"}).then(function(){
            console.log("Data updated!"); // Success
        }).catch(function(error){
            console.log(error); // Failure        
        });
    }
    res.redirect('/');
})

app.post('/checkedWorkTodo', async (req,res) => {
    let check = req.body.check;
    let key = req.body.key;
    // console.log(key);
    // console.log(req.body.add);
    if (check == "check") {
        await WorkTodo.updateOne({ _id: key },{statusWorkTodo: "uncheck"}).then(function(){
            console.log("Data updated!"); // Success
        }).catch(function(error){
            console.log(error); // Failure        
        });
    } else {
        await WorkTodo.updateOne({ _id: key },{statusWorkTodo: "check"}).then(function(){
            console.log("Data updated!"); // Success
        }).catch(function(error){
            console.log(error); // Failure        
        });
    }
    res.redirect('/work');
})

// CUSTOM ROUTE //
//CREATE MODEL/COLLECTIONS with data types & validations
const defaultList = [{todo: "aDd another lists:)", statusTodo: "uncheck"}]
const customListSchema = new mongoose.Schema({
    customTab: {
        type: String,
      },
      lists: [todoSchema]
});
const List = mongoose.model('list', customListSchema);

// SHOW OR CREATE NEW
app.get("/custom/:tab", async (req,res,next) => {
    let tab = req.params.tab;
    let customTab = _.capitalize(tab);

        await List.findOne({customTab: customTab}).then((e)=>{
            // console.log(res.lists);
            if (e) {
                todoList = [];
                statusTodo = [];
                e.lists.forEach(todos => {
                    todoList.unshift(todos.todo);
                    statusTodo.unshift(todos.statusTodo);
                    idTodoList.unshift(todos._id)
                });   
                res.render('custom.ejs',{
                    'todo' : todoList, 
                    'active': customTab,
                    'check': statusTodo,
                    'status': status,
                    'id': idTodoList
                })
            } else {
                const list = new List({
                    customTab: customTab,
                    lists: defaultList
                })
                list.save().then(()=>{
                    console.log("Data inserted!")
                }).then(()=>{
                    res.redirect('/custom/'+customTab);
                });
            }
    }).catch(error => {
        console.log(error);
    });
    
})

// ADD
app.post('/custom/:tab', async (req,res,next) => {
    let tab = req.params.tab;
    let customTab = _.capitalize(tab);
    let newCustomTodo = req.body.todo;
    
    await List.findOne({customTab: customTab}).exec().then((e) => {
        if (e !== null) {
            if (e.customTab == customTab) {
                let add = ({todo: newCustomTodo, statusTodo: "uncheck"});
                List.updateOne(
                    { customTab: customTab }, 
                    { $push: { lists: add } }
                ).then(()=>{
                    console.log("Data updated!")
                }).then(()=>{
                    res.redirect('/custom/'+customTab);
                });
            }
        }
    });
})

// DELETE
app.post('/custom/delete/:tab', async (req,res,next) => {
    let tab = req.params.tab;
    let customTab = _.capitalize(tab);
    let customDeletedTodo = req.body.deletedTodo;
    
    await List.findOne({customTab: customTab}).exec().then((e) => {
        if (e !== null) {
            if (e.customTab == customTab) {
                List.updateOne(
                    { customTab: customTab }, 
                    {$pull: { lists: {_id: customDeletedTodo} } }
                ).then(()=>{
                    console.log("Data deleted!")
                }).then(()=>{
                    res.redirect('/custom/'+customTab);
                });
            }
        }
    });
})

// EDIT
app.post('/custom/check/:tab', async (req,res,next) => {
    let tab = req.params.tab;
    let customTab = _.capitalize(tab);
    let customDeletedTodo = req.body.key;
    let customCheckTodo = req.body.check;
    let updateCheck = '';
    if (customCheckTodo == 'check') {
        updateCheck = 'uncheck'
    } else {
        updateCheck = 'check'
    }
    
    await List.findOne({customTab: customTab}).exec().then((e) => {
        if (e !== null) {
            if (e.customTab == customTab) {
                List.updateOne(
                    { 'lists._id': customDeletedTodo},
                    { '$set': {'lists.$.statusTodo': updateCheck} }
                ).then(()=>{
                    console.log("Data updated!")
                }).then(()=>{
                    res.redirect('/custom/'+customTab);
                });
            }
        }
    });
})

// SHOW CUSTOM
app.get("/custom", async (req,res)=>{
        await List.find({}).then((e)=>{
                let customTodo = [];
                let idCustomTodo = [];
                e.forEach(todos => {
                    customTodo.unshift(todos.customTab);
                    idCustomTodo.unshift(todos._id);
                })
                    res.render('add.ejs',{
                        'todo' : customTodo, 
                        'active': customTodo,
                        'status': status,
                        'id': idCustomTodo
                    })
                
    }).catch(error => {
        console.log(error);
    });
})

// DELETE CUSTOM
app.post("/delete/:tab", async (req,res)=>{
    let tab = req.params.tab;
    let customTab = _.capitalize(tab);
    let customDeletedTodo = req.body.deletedTodo;
    
    await List.findOne({customTab: customTab}).exec().then((e) => {
        if (e !== null) {
            if (e.customTab == customTab) {
                List.deleteOne(
                    { _id: customDeletedTodo }
                ).then(()=>{
                    console.log("Data deleted!")
                }).then(()=>{
                    res.redirect('/custom');
                });
            }
        }
    });
})

// ADD CATEGORY
app.post("/addCustom/",(req,res)=>{
    let custom = req.body.todo;
    res.redirect('/custom/'+custom);
})
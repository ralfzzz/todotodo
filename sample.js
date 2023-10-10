
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

// CRONJOB
// cron.schedule('0 0 * * *', () => {
//     if (todo.length>50 || workTodo.length>50) {
//         todo = ["tododo1", "tododo2","tododo3"];
//         checkedTodo = ["check", "uncheck","uncheck"];
//         workTodo = ["tododo1", "tododo2","tododo3"];
//         checkedWorkTodo = ["uncheck", "check","uncheck"];
//         console.log('tododo data restarted!');
//     }
//   });
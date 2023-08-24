import express from "express";

const app = express();
const port = 8003;

app.use(express.static('public'));

app.listen(port,() => {
    console.log(`node running on port ${port}`);
});

app.get('/tes',(req, res) => {
    res.send('ralfzzz ready!');
});

app.get('/', (req, res) => {
    res.render('todo.ejs');
})

app.get('/work', (req, res) => {
    res.render('todo.ejs');
})
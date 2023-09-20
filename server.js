const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, 'config.env')});

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

let todos = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.status(200).json(todos);
})

app.get('/:id', (req,res)=>{
    const idd = parseInt(req.params.id);
    const todo = todos.find(todo => todo.id === idd)
    if(!todo){
        res.status(404).send()
    }else{
        res.status(200).json(todo);
    }
})

app.post('/', (req, res) => {
    try {
        const newTodo = {
            id: nextId,
            title: req.body.title,
            description: req.body.description
        }
        nextId++;
        todos.push(newTodo);
        return res.status(201).json(newTodo);        
    } catch (error) {
        return res.status(500).json({
            "message": error.message
        })
    }

})

app.put('/:id', (req,res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id))
    if(todoIndex === -1){
        res.status(404).send();
    }else{
        todos[todoIndex].title = req.body.title;
        todos[todoIndex].description = req.body.description;
        res.status(200).json(todos);
    }
})

app.delete('/:id', (req,res) => {
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(req.params.id))
    if(todoIndex === -1){
        res.status(404)
    }else{
        todos.splice(todoIndex, 1);
        res.status(200).json({
            "message": "Todo has been deleted",
            "todos": todos
        });
    }
})

app.use((req, res, next)=>{
    res.status(404).json({
        "message": "Looks like you're lost"
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is up on PORT-${PORT}`);
})
const express = require("express");

const mongoose= require("mongoose");

const clientController = require("./controllers/clientController")

mongoose.connect("mongodb://localhost:27017/ClientDB",{useNewUrlParser : true, useUnifiedTopology:true});

const app = express();

app.use(express.static("public"));

app.use(express.json())

app.use('/api', clientController)



app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/src/index.html");
});


app.listen("3000", ()=>{
    console.log("servr is up and running at port 3000")
});
const express = require("express");


const db = require('./app/models');


db.mongoose.connect(db.url,{useNewUrlParser : true, useUnifiedTopology:true})


const app = express();

app.use(express.static("public"));

app.use(express.json());



app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/src/index.html");
});


require('./app/routes/routes.js')(app);



app.listen("3000", ()=>{
    console.log("servr is up and running at port 3000")
});
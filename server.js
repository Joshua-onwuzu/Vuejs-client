const express = require("express");

const cors = require("cors");

const db = require('./app/models');

const swaggerUI = require('swagger-ui-express');

const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');


db.mongoose.connect(db.url,{useNewUrlParser : true, useUnifiedTopology:true})


const app = express();

app.use(cors())

app.use(express.static("public"));

app.use(express.json());

app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocument))



app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/src/index.html");
});


require('./app/routes/routes.js')(app);



app.listen("3000", ()=>{
    console.log("servr is up and running at port 3000")
});
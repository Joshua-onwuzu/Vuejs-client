const express = require("express");

const mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/ClientDB",{useNewUrlParser : true, useUnifiedTopology:true});

const app = express();

app.use(express.static("public"));

app.use(express.json())



const clientProviderSchema = new mongoose.Schema ({
    id : {type : Number, ref : 'Provider'},
    name : String
});

const clientSchema =new mongoose.Schema({
    name : String,
    email : String,
    phone : Number,
    provider : [clientProviderSchema]
});

const providerSchema =new mongoose.Schema({
        _id : Number,
        name : String
});

const tableSchema =new mongoose.Schema({
    client : [clientSchema],
    provider : [providerSchema]
});

const Client = mongoose.model("Client",clientSchema)

const Provider = mongoose.model("Provider",providerSchema);

const Table = mongoose.model("Table",tableSchema);

const provider1 = new Provider ({
    _id : 1,
    name : "Provider1"
});

const provider2 = new Provider ({
    _id : 2,
    name : "Provider2"
});

const provider3 = new Provider ({
    _id : 3,
    name : "Provider3"
});


const defaultProvider = [provider1,provider2,provider3];




const newClient1 = {
    name : "Test1",
    email : "wen@gmail.com",
    phone : 123456789,
    provider : [{id : 1, name : "Provider1"}]
};

const newClient2 = {
    name : "Test5",
    email : "wendy@gmail.com",
    phone : 123456789,
    provider : [{id : 3,name : "Provider3"},{id : 5, name : "Provider5"}]
};

const defaultClient = [newClient1,newClient2];

const createProvider = async ()=>{
    const execute = await  Provider.find({},);
    if(execute.length == 0){
        const doIt = await Provider.insertMany(defaultProvider);
        const client = await Client.insertMany(defaultClient)
        if (doIt){
            Table.find({},(err,tdata)=>{
                if (tdata.length === 0){
                    try{
                        Provider.find({},(err,pdata)=>{
                            if(pdata.length > 0){
                                Client.find({},(err,cdata)=>{
                                    if (cdata.length > 0){
                                        const newTable = new Table ({
                                            client : [...cdata],
                                            provider : [...pdata]
                                        });
                                        newTable.save();
                                    } else{
                                        console.log("cdata is empty")
                                    }
                                })
                            }else{
                                console.log("pdata is empty");
                            }
                
                        });
                    } catch (err){
                        console.log(err);
                    }
            
                }
            });
        }
    }else {
        console.log("Provider isnt empty")
    }
};

createProvider();

let count = 4 ;

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/src/index.html");
});

app.get('/getProvider',(req,res)=>{
    Table.find({},(err,data)=>{
        res.send(data[0].provider)
    })
});

app.post('/addClient',(req,res)=>{
    const {name,email,phone,providerArray} = req.body;
    const idArray = providerArray.map(eachId =>{
        return {
            id : eachId.id,
            name : eachId.name
        }
    })

    const newClient = new Client ({
        name : name,
        email : email,
        phone : phone,
        provider : [...idArray]
    })

    newClient.save((err,cdata)=>{
        if (!err){
            Table.find({},(err,data)=>{
                Table.findOneAndUpdate({_id : data[0]._id}, {$push: {client : cdata}},{ 'new': true },(err,data)=>{
                    if(!err){
                        res.send("saved to client array")
                    }
                })
            })
        }
    })

    
});

app.post('/addProvider',(req,res)=>{
    const name = req.body.provider;
    const newProvider = new Provider ({
        _id : count,
        name : name
    });
    newProvider.save((err,pdata)=>{
        if (!err){
            Table.find({},(err,data)=>{
                Table.findOneAndUpdate({_id : data[0]._id}, {$push: {provider : pdata}},{ 'new': true },(err,data)=>{
                    if(!err){
                        res.send("saved to providers array")
                    }
                })
            })
        }
    });
    count++
});

app.post('/getClient',(req,res)=>{
    Client.findOne({_id : req.body.id},(err,data)=>{
        if(!err){
            res.send(data)
        }
    })
});

app.get("/client", (req,res)=>{
    Table.find({},(err,data)=>{
        res.send(data)
    })
});

app.post('/delete',(req,res)=>{

    Table.find({},(err,tdata)=>{
        if(!err){
            Client.findOne({_id : req.body.id},(err,data)=>{
                if(!err){
                    const clientName = data.name
                    Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {client :{name : clientName}}},{ 'new': true },(err,data)=>{
                        if(!err){
                            Client.findByIdAndRemove(req.body.id, (err)=>{
                                if(!err){
                                    res.send("deleted successfuly")
                                }
                            })
                        }
                    } )
                }

            })
        }
    })

});

app.post('/deleteProvider', (req,res)=>{
    

    Table.find({},(err,tdata)=>{
        if(!err){
            Provider.findOne({_id : req.body.id},(err,data)=>{
                if(!err){
                    const providerName = data.name
                    Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {provider :{name : providerName}}},{ 'new': true },(err,data)=>{
                        if(!err){
                            Provider.findByIdAndRemove(req.body.id, (err)=>{
                                if(!err){
                                    res.send("deleted successfully")
                                }
                            })
                        }
                    } )
                }

            })
        }
    })
});

app.post('/updateClient',(req, res)=>{
    const {name,email,phone,providerArray} = req.body
    const newClient = new Client ({
        name : name,
        email : email,
        phone : phone,
        provider : [...providerArray]
    })
    Table.find({},(err,tdata)=>{
        if(!err){
            Client.findOne({_id : req.body.id},(err,data)=>{
                if(!err){
                    const clientName = data.name
                    Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {client :{name : clientName}}},{ 'new': true },(err,data)=>{
                        if(!err){
                            newClient.save((err,cdata)=>{
                                if(!err){
                                    Table.findOneAndUpdate({_id : tdata[0]._id}, {$push: {client : cdata}},{ 'new': true },(err,data)=>{
                                        if(!err){
                                            Client.findByIdAndRemove(req.body.id, (err)=>{
                                                if(!err){
                                                    res.send("edit successfuly")
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    } )
                }

            })
        }
    })

});


app.listen("3000", ()=>{
    console.log("servr is up and running at port 3000")
});
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

let count = null ;

Provider.find({},(err,data)=>{
    count = data.length + 1
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/src/index.html");
});

app.get('/api/providers',(req,res)=>{
    Table.find({},(err,data)=>{
        res.status(200).send(data[0].provider)
    })
});

app.post('/api/add-client',(req,res)=>{

    const {name,email,phone,providerArray} = req.body;

    if (!name || !email || !phone || !providerArray){

        res.status(400).send({
            status : "fail",
            message : "all field required"
        })
    }

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

        if (err){
            res.status(500).send(err)
        }

        Table.find({},(err,data)=>{
            Table.findOneAndUpdate({_id : data[0]._id}, {$push: {client : cdata}},{ 'new': true },(err,data)=>{
                if(!err){
                    res.status(200).send({
                        status : "success",
                        message : "successfully saved client"
                    })
                }
            })
        })

    })

    
});

app.post('/api/add-provider',(req,res)=>{

    const name = req.body.provider;

    if (!name){
        res.status(400).send({
            status : "fail",
            message : "cannot add provider of name undefined"
        })
    }

    const newProvider = new Provider ({
        _id : count,
        name : name
    });

    newProvider.save((err,pdata)=>{

        if(err){
            res.status(500).send(err)
        }
        Table.find({},(err,data)=>{
            Table.findOneAndUpdate({_id : data[0]._id}, {$push: {provider : pdata}},{ 'new': true },(err,data)=>{
                if(!err){
                    res.status(200).send({
                        status : "success",
                        message : "successfully added a provider"
                    });
                };
            })
        })

    });
    count++

});

app.get('/api/client/:id',(req,res)=>{
    Client.findOne({_id : req.params.id},(err,data)=>{
        
        if(err){
            res.status(500)
        }

        res.status(200).send(data)

    })
});

app.get("/api/client", (req,res)=>{

    Table.find({},(err,data)=>{

        if(err){
            res.status(500).send(err)
        }

        res.status(200).send(data)

    })
});

app.get('/api/delete/client/:id',(req,res)=>{

    Table.find({},(err,tdata)=>{

        if(!err){

            Client.findOne({_id : req.params.id},(err,data)=>{

                if (err){
                    res.status(400).send({
                        status : "fail",
                        message : "unrecognized client id"
                    })
                }

                const clientName = data.name

                Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {client :{name : clientName}}},{ 'new': true },(err,data)=>{

                    Client.findByIdAndRemove(req.params.id, (err)=>{

                        if(err){
                            res.status(500).send(err)
                        }

                        res.status(200).send({
                            status : "success",
                            message : "sucessfully deleted"
                        })
                    })
                } )
            })
        }
    })

});

app.get('/api/delete/provider/:id', (req,res)=>{
    

    Table.find({},(err,tdata)=>{
        if(!err){

            Provider.findOne({_id : req.params.id},(err,data)=>{

                if(err){
                    res.status(400).send({
                        status : "fail",
                        message : "unrecognized provider id"
                    })
                }

                const providerName = data.name

                Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {provider :{name : providerName}}},{ 'new': true },(err,data)=>{

                    if(err){
                        res.status(500).send({
                            status : "fail",
                            message : "failed to delete provider"
                        })
                    }

                    Provider.findByIdAndRemove(req.params.id, (err)=>{
                        if(!err){
                            res.send({
                                status : "success",
                                message : "provider sucessfully deleted"
                            });
                        }
                    });
                })
            })
        }
    })
});

app.post('/api/update/client/:id',(req, res)=>{

    const {name,email,phone,providerArray} = req.body ;

    if(!name || !email || !phone || !providerArray){
        res.status(400).send({
            status : "failed",
            message : "all fields required"
        })
    }

    const newClient = new Client ({
        name : name,
        email : email,
        phone : phone,
        provider : [...providerArray]
    })

    Table.find({},(err,tdata)=>{
        if(!err){
            Client.findOne({_id : req.params.id},(err,data)=>{

                if(err){
                    res.status(400).send({
                        status : "fail",
                        message : "unrecognized client id"
                    })
                }

                const clientName = data.name

                Table.findOneAndUpdate({_id : tdata[0]._id},{$pull : {client :{name : clientName}}},{ 'new': true },(err,data)=>{
                    if(!err){

                        newClient.save((err,cdata)=>{
                            if(!err){

                                Table.findOneAndUpdate({_id : tdata[0]._id}, {$push: {client : cdata}},{ 'new': true },(err,data)=>{

                                    if(err){
                                        res.status(500).send(err)
                                    }

                                    Client.findByIdAndRemove(req.params.id, (err)=>{
                                        if(!err){
                                            res.status(200).send({
                                                status : "success",
                                                message : "client edited successfully"
                                            })
                                        }
                                    })
                                })
                            }
                        })
                    }
                } )
            })
        }
    })

});


app.listen("3000", ()=>{
    console.log("servr is up and running at port 3000")
});
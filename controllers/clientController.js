const express = require("express");

const Client = require("../database/models/client.js");

const Provider = require("../database/models/provider.js");

const Table = require("../database/models/table.js");

const router = express.Router();



let count = null ;

Provider.find({},(err,data)=>{
    count = data.length + 1
})

router.get('/providers',(req,res)=>{
    Table.find({},(err,data)=>{
        res.status(200).send(data[0].provider)
    })
});


router.post('/add-client',(req,res)=>{

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


router.post('/add-provider',(req,res)=>{
    
    const name = req.body.provider;

    if (!name){
        console.log("bad")
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


router.get('/client/:id',(req,res)=>{
    Client.findOne({_id : req.params.id},(err,data)=>{
        
        if(err){
            res.status(500)
        }

        res.status(200).send(data)

    })
});


router.get("/client", (req,res)=>{

    Table.find({},(err,data)=>{

        if(err){
            res.status(500).send(err)
        }

        res.status(200).send(data)

    })
});


router.get('/delete/client/:id',(req,res)=>{

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

router.get('/delete/provider/:id', (req,res)=>{
    

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

router.post('/update/client/:id',(req, res)=>{

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


module.exports = router
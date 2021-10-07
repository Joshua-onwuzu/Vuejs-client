<template>
    <div v-if="newclientpopup" class="add-client">
        <form action="">
            <div class="add-client-header">
                <h3 v-if="isnewclient">New Client</h3>
                <h3 v-if="iseditclient">Edit Client</h3>
            </div>
            <div class="inner-form">
                <div class="client-info">
                    <div class="form-box">
                        <div class="inner-box">
                            <div class="form-group row">
                                <label  class="col-sm-2 col-form-label" >Name</label>
                                <div v-if="isnewclient" class="col-sm-10">
                                    <input type="text" class="form-control" v-model="name">
                                </div>
                                <div v-if="iseditclient" class="col-sm-10">
                                    <input type="text" class="form-control" v-model="neweditname"  v-bind:placeholder="editname">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label  class="col-sm-2 col-form-label" >Email</label>
                                <div v-if="isnewclient" class="col-sm-10">
                                    <input type="email" class="form-control" v-model="email" >
                                </div>
                                <div v-if="iseditclient" class="col-sm-10">
                                    <input type="email" class="form-control" v-model="neweditemail"  v-bind:placeholder="editemail" >
                                </div>
                            </div>
                            <div class="form-group row">
                                <label  class="col-sm-2 col-form-label" >Phone</label>
                                <div v-if="isnewclient" class="col-sm-10">
                                    <input type="tel" class="form-control" v-model="phone" >
                                </div>
                                <div v-if="iseditclient" class="col-sm-10">
                                    <input type="tel" class="form-control" v-model="neweditphone"  v-bind:placeholder="editphone">
                                </div>
                            </div>

                            <Provider 
                            :iseditclient="iseditclient"
                            :isnewclient="isnewclient"
                            :clientprovider="clientprovider"
                            @providerId="saveProviderId($event)" 
                            @render="reRender"  
                            :key="index"
                            @popId="popId($event)"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="action-bar">
            <div class="inner-action-bar">
                <input v-if="iseditclient" v-bind:id="this.keyid" @click="handleDelete($event)" class="delete-client btn btn-sm" type="button" value="Delete Client"/>
                <input v-if="isnewclient" @click="handleCancel" type="button" value="Cancel" >
                <input v-if="iseditclient" @click="handleEditCancel" type="button" value="Cancel" >
                <input v-if="isnewclient" type="button" @click="saveClient" value="Save Client" >
                <input v-if="iseditclient" type="button" @click="editSaveClient" value="Save Client" >
            </div>
            </div>
        </form>
    </div> 
</template>

<script>
import Provider  from  './provider.vue' ;
    export default ({
        name: "clientcard",
        methods : {
            handleDelete (event){
                this.$emit("deleteclient", event.target.id)
            },
            editSaveClient() {
                
                let name = this.neweditname;

                let phone = this.neweditphone;

                let email = this.neweditemail;

                const editClientArray = [
                    {
                        value : name,
                        identifier : "name"
                    },
                    {
                        value : phone,
                        identifier : "phone"
                    },
                    {
                        value : email,
                        identifier : "email"
                    }
                ]

                const identifierArray = [];

                editClientArray.forEach(item =>{
                    if(item.value == null){
                        console.log("no")
                    }else{
                        identifierArray.push(item);
                    }
                });


                identifierArray.forEach(item =>{
                    if(item.identifier == "name"){
                        console.log("breach")
                        const data = {
                            name : item.value
                        }
                        const response = fetch (`http://localhost:3000/api/update/client/${this.editid}`,{
                            method : 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                },
                            body : JSON.stringify(data)
                        });

                        window.location.reload()
                    }
                    if(item.identifier == "phone"){
                        const data = {
                            phone : item.value
                        }
                        const response = fetch (`http://localhost:3000/api/update/client/${this.editid}`,{
                            method : 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                },
                            body : JSON.stringify(data)
                        })
                        window.location.reload()
                    } 
                    if(item.identifier == "email"){
                        const data = {
                            email : item.value
                        }
                        const response =  fetch (`http://localhost:3000/api/update/client/${this.editid}`,{
                            method : 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                                },
                            body : JSON.stringify(data)
                        });

                        window.location.reload()

                    }                                       
                });
            },
            saveProviderId (id){
                this.idArray.push(id)
            },
            popId (id){
                this.idArray.pop(id)
            },
            handleCancel (){
                this.$emit("cancel");
            },
            handleEditCancel (){
                this.$emit("clear")
            },
            saveClient (){
                const clientData = {
                    name : this.name,
                    email : this.email,
                    phone : this.phone,
                    providerArray : [...this.idArray]
                }

                const response = fetch ("http://localhost:3000/api/add-client",{
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body : JSON.stringify(clientData)
                })
                window.location.reload()
            },
            reRender(){
                this.index +=1
            }
        },
        data : ()=>{
        return {
            name: "",
            phone : "",
            email : "",
            idArray : [],
            index : 0,
            neweditphone : null,
            neweditname : null,
            neweditemail :null
        }
        },
        props: ["newclientpopup","editid","keyid","editclientpopup","clientprovider","isnewclient","iseditclient","client","editname","editphone","editemail"],
        components : {
            Provider
        }
    });
</script>
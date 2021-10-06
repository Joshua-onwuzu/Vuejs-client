<template>
    <div>
        <div class="form-group row">
            <label  class="col-sm-2 col-form-label" >Provider</label>
            <div class="col-sm-7">
                <input type="text" class="form-control"  v-model="newProvider">
            </div>
            <div style="display: inline;" class="col-sm-3">
                <input @click="addProvider" type="button" value="Add Provider">
            </div>
        </div>
        <div v-if="iseditclient" class="provider">
            <div class="provider-box">
                    <div  v-for="provider in providers" :key="provider._id" class="form-check">
                    <ClientProvider
                    :id="provider._id"
                    :name="provider.name"
                    :clientprovider="clientprovider"
                    />
                </div>
            </div>
        </div>
        <div v-if="isnewclient" class="provider">
            <div class="provider-box">
                <div class="emptyprovider" v-if="providers.length == 0">
                    <h5>Add new providers </h5>
                </div>
                <div  v-for="provider in providers" :key="provider._id" class="form-check">
                    <input  @change="handleCheckbox($event)" v-bind:value="provider.name" class="form-check-input col-sm-2" type="checkbox" v-bind:id="provider._id">
                    
                    <label class="form-check-label col-sm-6" >
                        {{provider.name}}
                    </label>
                    <span class="icon col-sm-2">
                        <i @click="deleteProvider($event)"  v-bind:id="provider._id" class="fas fa-trash"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ClientProvider from './clientprovider.vue'
    export default ({
        name: "helloworld",

        created (){
            this.makeRequest();
        },

        data : ()=>{

            return {
                newProvider : "",
                providers : [],
                checked: true
            }
        },

        methods : {
            async deleteProvider (event){

                const response = await fetch(`http://localhost:3000/api/delete/provider/${event.target.id}`)

                const data = await response.json()

                data.status == "success" ? this.$emit("render") : null

                
            },
            handleCheckbox (event){

                if(event.target.checked){
                    const obj = {
                        id : event.target.id,
                        name : event.target.value
                    }
                    
                    this.$emit("providerId",obj)
                } else {
                        const obj = {
                        id : event.target.id,
                        name : event.target.value
                    }
                    
                    this.$emit("popId",obj)
                }


            },
            async addProvider(){

                const providerData = {
                    provider : this.newProvider
                }

                const response = await fetch("http://localhost:3000/api/add-provider",{
                    method : 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(providerData)
                });

                const data =  await response.json()
                
                data.status == "success" ? this.$emit("render") : null
                
            },
            async  makeRequest (){

                const response = await fetch('http://localhost:3000/api/providers');

                const data = await response.json();
                
                this.providers = data
            }
        },
        
        props: ["iseditclient","isnewclient","clientprovider","editinputcomponent"],

        components : {
            ClientProvider
        }
    })
</script>
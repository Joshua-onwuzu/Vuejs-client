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

                const providerid = {
                    id : event.target.id
                }

                const response = await fetch("http://localhost:3000/deleteProvider",{
                    method : 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(providerid)
                });

                const data = await response.json()
                if(data.success){
                    this.$emit("render")
                }
                
            },
            handleCheckbox (event){
                

                if(event.target.checked){
                    const obj = {
                        id : event.target.id,
                        name : event.target.value
                    }
                    
                    this.$emit("providerId",obj)
                }


            },
            async addProvider(){

                const providerData = {
                    provider : this.newProvider
                }

                const response = await fetch("http://localhost:3000/addProvider",{
                    method : 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(providerData)
                });

                const data =  await response.json()
                if(data.success){
                    this.$emit("render")
                }
                
            },
            async  makeRequest (){

                const response = await fetch('http://localhost:3000/getProvider');

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
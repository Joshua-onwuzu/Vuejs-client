<template>
<div>
    <h2 v-if="islistclient">List of clients</h2>
    <h2 v-if="isnewclient">Adding a client</h2>
    <h2 v-if="iseditclient">Editing a Client</h2>

    <div class="client-section">
        <Header @showclient="showNewClient"/>
        <table class="client-table">
            
            <thead>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Providers</th>
                <th></th>
            </thead>

            <tbody>
                <tr v-for="client in clients" :key="client._id">
                    <td>{{client.name}}</td>
                    <td>{{client.email}}</td>
                    <td>{{client.phone}}</td>
                    <td>
                        <span class="provider-space" v-for="(provider,index) in client.provider" :key="index">{{provider.name}}</span>
                    </td>
                    <td>
                        <EditAndDelete @deletehandler="deleteHandler" @edithandler="editHandler($event)" :id="client._id" :client="client" @editnewclient="editClient" />
                    </td>
                    
                    <ClientCard 
                    @clear="editClient"
                    :editclientpopup="editclientpopup"
                    :newclientpopup="newclientpopup"
                    @cancel="showNewClient" 
                    :isnewclient="isnewclient" 
                    :iseditclient="iseditclient"
                    :editid = "editid"
                    :editname="editname"
                    :editphone="editphone"
                    :editemail="editemail"
                    :clientprovider="clientprovider"
                    :keyid="client._id"
                    @deleteclient="deleteHandler($event)"
                    />
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
    import Header from './header.vue' ;

    import EditAndDelete  from  './editanddelete.vue' ;

    import ClientCard  from  './clientcard.vue' ;

    export default{
        async created (){
            const response = await fetch('http://localhost:3000/client');
            const data = await response.json();
            this.clients = data[0].client
        },

        components : {
            Header,
            EditAndDelete,
            ClientCard
        },

        methods : {
            showNewClient (){
                this.islistclient = !this.islistclient
                this.isnewclient = !this.isnewclient
                this.newclientpopup = !this.newclientpopup
            },

            async editHandler (id){
                const clientId = {
                    id : id
                }
                const response = await fetch ("http://localhost:3000/getClient",{
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                    body : JSON.stringify(clientId)
                });
                const data = await response.json();
                this.editid = data._id
                this.editname = data.name 
                this.editemail = data.email
                this.editphone = data.phone
                this.clientprovider = data.provider
            },

            editClient (){
                this.islistclient = !this.islistclient
                this.iseditclient = !this.iseditclient
                this.newclientpopup = !this.newclientpopup
            },

            deleteHandler(id){
                const deleteid = {
                    id : id
                }

                fetch("http://localhost:3000/delete",{
                    method : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                        },
                    body : JSON.stringify(deleteid) 
                })

                window.location.reload()
            }
        },
        data : ()=>{
            return {
                clients : [],
                newclientpopup : false,
                isnewclient : false,
                iseditclient : false,
                editname : "",
                editphone : "",
                editemail : "",
                editid : "",
                islistclient : true,
                editclientpopup : false,
                clientprovider : [],
            }
        }
    }
</script>

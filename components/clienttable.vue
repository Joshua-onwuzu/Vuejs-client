<template>
<div>
    <h2 v-if="islistclient">List of clients</h2>
    <h2 v-if="isnewclient">Adding a client</h2>
    <h2 v-if="iseditclient">Editing a Client</h2>

    <div class="client-section" v-cloak>
        <Header @showclient="showNewClient"/>
            <div v-if="clients.length ==0" class="emptyclient">
                <h3> Add new client. </h3>
            </div>
        <table v-if="clients.length > 0"  class="client-table">
            
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

        <ClientCard v-if="clients.length == 0"
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
        @deleteclient="deleteHandler($event)"
        />
    </div>
</div>
</template>

<script>
    import Header from './header.vue' ;

    import EditAndDelete  from  './editanddelete.vue' ;

    import ClientCard  from  './clientcard.vue' ;

    export default{
        async created (){
            const response = await fetch('http://localhost:3000/api/client');
            const data = await response.json();
            this.clients = data
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

                const response = await fetch (`http://localhost:3000/api/client/${id}`)
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

                fetch(`http://localhost:3000/api/delete/client/${id}`)

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

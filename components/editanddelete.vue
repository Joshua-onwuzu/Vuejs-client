<template>
    <span>
        <span @click="edit" class="icon"><a>Edit</a></span>
        <span @click="handleDelete" class="icon"><a>Delete</a></span>
    </span>
</template>

<script>
    export default ({

        name: "editanddelete",

        methods:{
            edit (){
                this.$emit("edithandler",this.id)
                this.$emit("editnewclient")
            },
            handleDelete (){
                this.$emit("deletehandler",this.id)
            }
        },

        data : ()=>{
            return {
                name : "",
                email : "",
                phone : "",
            }
        },
        
        props:["id", "client"]

    })
</script>
<template>
    <span>
        <span @click="edit" class="icon"><i class="fas fa-edit"></i></span>
        <span @click="handleDelete" class="icon"><i class="fas fa-trash"></i></span>
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
<template>
    <div class="bg-light-blue flex items-center border p-4 ">
        <div class="w-full ">       
            <h3 class="text-blue">Clients</h3> 
        </div>
        <div class="">    
            <input class="" @click="show" type="button" value="New Client"> 
        </div>
    </div>
</template>

<script>
    export default ({

        name: "header",

        methods : {
            show(){
                this.$emit("showclient")
            }
        }
    })
</script>
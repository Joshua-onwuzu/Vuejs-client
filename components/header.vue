<template>
    <div class="client-header">
    <h3>Clients</h3>
    <input @click="show" type="button" value="Add Client">
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
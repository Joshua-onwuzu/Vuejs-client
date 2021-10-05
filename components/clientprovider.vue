<template>
    <div>
        <input v-if="clientArray.includes(this.id)" v-model="checked" class="form-check-input col-sm-2" type="checkbox" >
        <input v-else  v-model="unchecked" class="form-check-input col-sm-2" type="checkbox" >
        <label class="form-check-label col-sm-6" >
            {{name}}
        </label>
        <span class="icon col-sm-2">
            <i class="fas fa-trash"></i>
        </span>
    </div>

</template>

<script>

    export default ({

        name: "clientprovider",

        data : ()=>{
            return {
                clientArray : [],
                checked : true,
                unchecked : false
            }
        },

        created (){
            this.clientprovider.forEach(data =>{
                this.clientArray.push(data.id)
            });
        },

        props : ["clientprovider","id","name"]
    })
</script>
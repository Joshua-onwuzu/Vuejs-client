<template>
    <div>
        <input v-if="clientArray.includes(this.id)" @change="handleCheckbox" v-model="checked" class="form-check-input" type="checkbox" >
        <input v-else @change="handleCheckbox" v-model="unchecked" class="form-check-input" type="checkbox" >
        <label class="form-check-label" >
            {{name}}
        </label>
        <span class="icon"><i class="fas fa-edit"></i></span>
        <span class="icon"><i class="fas fa-trash"></i></span>
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
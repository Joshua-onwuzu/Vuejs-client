<template>
    <div class="page-wrapper">

        <ClientTable/>

    </div>
</template>

<script>

    import ClientTable from  '../components/clienttable.vue' ;

    export default {
        name : "Client",

        components : {
            ClientTable
        },
}
</script>
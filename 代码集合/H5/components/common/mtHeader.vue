<template>
    <div :class="[shadow ? 'shadow': '',gray ? 'gray-bg': '','head-box']">
        <mt-header :title="title" class="mutice_header_title">
            <router-link to slot="left" class="mutice_header_left">
                <mt-button @click="$router.back(-1)" icon="back"></mt-button>
            </router-link>
            <!-- <mt-button icon="search" class="mutice_header_right" slot="right" @click="search"></mt-button> -->
        </mt-header>
    </div>
</template>

<script>
export default {
    props: ['title','shadow','gray'],
    data(){
        return{
        }
    },
    methods:{
        goBack(){}
    },
    mounted(){     
        console.log(this.title);
    }
}
</script>

<style scoped>
.head-box{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 999;
}
</style>
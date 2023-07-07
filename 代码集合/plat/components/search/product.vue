<template>
    <div class="filter-value">
        <p v-for="(item,index) in list" :key="index" :class="[active==item.type ? 'active':'']" @click="chooseItem(item)">{{item.title}}</p>
    </div>
</template>
<script>
export default {
    props:{
        list:{
            type: Array,
            default: [],
        },
        active:{
            type: Number,
            default: 0
        }
    },
    data(){
        return{          
              
        }
    },
    methods:{
        chooseItem(item){
            this.active = item.type;
            this.$emit('typeChange',item.type)
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import './search-child'
</style>
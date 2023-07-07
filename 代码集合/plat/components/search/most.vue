<template>
    <div class="filter-value">
        <p v-for="(item,index) in most" :key="index" :class="[sort==item.type ? 'active':'']" @click="chooseItem(item)">{{item.title}}</p>
    </div>
</template>
<script>
export default {
    props:['sort'],
    data(){
        return{
            most:[{
                title: '综合排序',
                type: 'hottest'
            },{
                title: '发布时间',
                type: 'latest'
            }],
        }
    },
    methods:{
        chooseItem(item){
            this.$emit('sortChange', item.type)
        }
    }     
}
</script>
<style lang="stylus" scoped>
    @import './search-child'
</style>
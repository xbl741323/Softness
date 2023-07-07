<template>
    <div class="child-cont">
        <div class="full-width">
            <div class="scroll-item" v-for="(item,index) in newList" :key="index" @click="changeNew(item)">
                <p :class="[putunderIndex == item.id ? 'active-scroll-sty':'']">{{item.name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:["putunderIndex","newList"],
    data() {
        return {
            
        };
    },
    methods: {
        changeNew(item){
            this.$emit('update:putunderIndex', item.id); 
            this.$emit('childChange',item) 
        }
    },
    mounted(){
    }
};
</script>

<style lang="stylus" scoped>
@import './search-child'
</style>


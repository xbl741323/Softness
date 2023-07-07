<template>
    <div class="child-cont">
        <div class="full-width">
            <div class="scroll-item" v-for="(item,index) in newList" :key="index" @click="changeNew(item)">
                <p :class="[mostIndex == item.type ? 'active-scroll-sty':'']">{{item.title}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import statics from './datas'
export default {
    props:["mostIndex"],
    data() {
        return {
            newList: statics.mosts,
        };
    },
    methods: {
        changeNew(item){
            this.$emit('update:mostIndex', item.type); 
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

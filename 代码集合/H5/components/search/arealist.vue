<template>
    <div class="child-cont">
        <div class="full-width">
            <div class="scroll-item" v-for="(item,index) in areaList" :key="index" @click="changeNew(item)">
                <p :class="[areaIndex == item.no ? 'active-scroll-sty':'']">{{item.name}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:["areaIndex","areaList"],
    data() {
        return {
            
        };
    },
    methods: {
        changeNew(item){
            this.$emit('update:areaIndex', item.no); 
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


<template>
    <div :class="['fixedtop',fixed==true?'peg':'']">
        <div class="top-cont">
            <headers />
        </div>
    </div>
</template>
<script>
import Headers from './topComponents/head'
export default {
    components: {
        Headers
    },
    data(){
        return {
            fixed:false
        }
    },
    methods:{
        handleScroll() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this.fixed = scrollTop > 160 ? true : false
        },
    },
    mounted(){
        window.addEventListener("scroll", this.handleScroll,true)
    },
    destroyed(){
        window.removeEventListener("scroll", this.handleScroll,true)
    }
}
</script>
<style scoped>
    .fixedtop{
        width: 100%;
        height: 1.6rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9998;
    }
    .peg{
        background: linear-gradient(0deg,#107BFD 0%, #146BD5 100%);
    }
    .top-cont{        
        padding: 0.28rem 0.32rem 0 0.32rem;
    }
</style>

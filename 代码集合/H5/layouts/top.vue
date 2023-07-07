<template>
    <div class="position-re page-wrap">
        <nuxt />
        <div class="foa" v-if="top">
            <img src="@/assets/images/home/top_icon@2x.png" class="kkk" @click="Top"/>
            <img src="@/assets/images/home/zixun_icon@2x.png" class="jjj" @click="showMeiqia" />
        </div>
    </div>
</template>
<script>
export default {
    middleware: "midd",
    data() {
        return {
            top: false,
        }
    },
    methods: {
        //改变元素#searchBar的top值
        handleScroll() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
            // console.log(scrollTop)
            if (scrollTop >= 108) {
                this.top = true;
            } else {
                this.top = false;
            }
        },
        // 置顶
        Top() {
            window.scrollTo({
                behavior: "smooth",
                top: 0
			})
            
        },
        // 客服工具
        showMeiqia() {
            // window.open('https://tb.53kf.com/code/code/0c8e8b081090b185745c9bc98ff4b6cb1/2')
            var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
            _53.push("cmd", "mtalk"); /*开发者文档1.7 主动发起(手机端)*/
            _53.query();
        },
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
    },
    destroyed() {
        //离开该页面需要移除这个监听的事件
        window.removeEventListener("scroll", this.handleScroll);
    },
}
</script>
<style lang="stylus" scoped>
    @import './style-gather.styl'
</style>

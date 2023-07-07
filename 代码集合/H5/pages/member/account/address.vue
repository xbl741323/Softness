<template>
    <div class="wrap">
        <mt-header title="地址管理" :shadow = shadow />
        <addList :source="source" />
    </div>
</template>

<script>
import mtHeader from '~/components/common/mtHeader'
import addList from '~/components/address/addList'
export default {
    layout: 'empty',
    components: {
        mtHeader,
        addList
    },
    data(){
        return{
            shadow:true,    
            source:'account',        
        }
    },
    methods:{        
    },    
    head() {
        return {
            title: '收件地址管理',
            meta: [
                { charset: "utf-8" },
                {
                    name: "keywords",
                    content:"卧涛-专注企业服务"
                },
                {
                    hid: "description",
                    name: "description",
                    content:"卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。"
                }
            ],
        };
    },
}
</script>


<style scoped lang="stylus">
    @import '~assets/css/order/address.styl'
</style>
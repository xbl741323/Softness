<template>
    <div class="frame">
        <div class="details-content">
            <div class="left-details">
                <p style="font-size:20px;font-weight:bold;text-align:center;padding-top:54px;">{{form.title}}</p>
                <div style="text-align:center;margin:10px 0;">
                    <i class="el-icon-bell" style="color:#36A6FE;"></i><span style="color:#A8A8A8;margin: 0 20px 0 6px;">通知公告</span>
                    <span style="color:#A8A8A8;margin-right:20px;"> 2012-2-28</span>
                    <i class="el-icon-view" style="color:#36A6FE;"></i><span style="color:#A8A8A8;;margin: 0 20px 0 6px;">92306次</span>
                    <i class="el-icon-share" style="color:#36A6FE;"></i><span style="color:#A8A8A8;;margin: 0 20px 0 6px">分享</span>
                    <i class="el-icon-star-off" style="color:#A8A8A8;"></i><span style="color:#A8A8A8;;margin: 0 20px 0 6px;cursor:pointer">收藏</span>
                </div>
                <div class="text-content"><p v-html="form.content"></p></div>
            </div>
            <div class="right-details">
                <div class="attachment">
                    <i class="el-icon-folder-opened" style="font-size:16px;"></i><span style="font-size:16px;">本文附件：</span>
                    <div v-for="(item,index) in file" :key="index">
                        <p style="color:#36A6FE; word-break: break-all">{{item.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[],
            form:{},
            file:[],
            title:'',
            content:'',
        }
    },
    methods:{
        getRouterData(){
            console.log(this.form,'666666666666666666')
        }
    },
    created(){
        if(this.$route.query.form){
            this.form = JSON.parse(this.$route.query.form);
            this.file = JSON.parse(this.$route.query.files);
        }else{
            this.form = JSON.parse(sessionStorage.getItem('transferData'));
            this.file = JSON.parse(sessionStorage.getItem('files'));
        }
    },
    mounted(){
        this.getRouterData()
    },
}
</script>

<style scoped>
.frame{
    width:100%;
    background:#F1F1F1;
}
.details-content{
    width:1200px;
    height:100%;
    min-height: 935px;
    margin:0 auto;
    padding: 50px 0;
    display:flex;
}
.left-details{
    width:75%;
    background:#FFF;
    position: relative;
}
.right-details{
    width:24%;
    margin-left:1%;
    max-height: 500px;
    background:#FFF;
}
.attachment{
    margin:20px 10px;
    line-height:25px;
}
.text-content{
    width: 100%;
    margin: 30px 0;
    background: #fff;
}
.text-content p{
    margin: 30px 20px;
}
.hot-article{
    margin:30px 10px;
}
.hot-article span{
    line-height:25px;
    width:100%;
    display: inline-block;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow:ellipsis;
}
</style>
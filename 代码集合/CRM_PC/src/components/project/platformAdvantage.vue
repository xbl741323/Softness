<template>
    <div class="advantage">
        <p class="platform">平台优势</p>
        <div class="gridlist">
            <div v-for="(item,index) in list" :key="index">
                <img class="advantageImg" :src="item.imgUrl" />
                <p class="title">{{item.title}}</p>
                <p class="txt">{{item.txt}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list:[
                {
                    imgUrl:'/img/project/icon01_youshi_details@2x.png',
                    title:'专业性',
                    txt:'10年科技项目申报经验'
                },
                {
                    imgUrl:'/img/project/icon02_youshi_details@2x.png',
                    title:'多对一服务',
                    txt:'各领域专业团队定制服务'
                },
                {
                    imgUrl:'/img/project/icon03_youshi_details@2x.png',
                    title:'丰富的资源库',
                    txt:'多行业合作专家资源库'
                },
                {
                    imgUrl:'/img/project/icon04_youshi_details@2x.png',
                    title:'团队',
                    txt:'团队人员均为高等学历'
                },
            ]
        }   
    }
}
</script>

<style scoped>
.advantage{
    margin-top:20px;
}
    .platform{
        margin-left:50px;
        font-size:20px;
        font-weight:bold;
        color:#373D40;
    }
    .gridlist{
        width:849px;
        margin:50px auto;
        margin-bottom: 0;
        padding-bottom:50px;
        display:grid;
        grid-template-columns:25% 25% 25% 25%;
        text-align:center;
    }
        .advantageImg{
            width:90px;
            height:90px;
        }
        .title{
            font-size:20px;
            color:#36A6FE;
            margin-top:20px;
            margin-bottom:8px;
            line-height:26px;
            font-weight:bold;
        }
        .txt{
            font-size:16px;
            line-height:21px;
            color:#36A6FE;
        }
</style>
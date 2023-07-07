<template>
    <div class="bbbadvantage">
        <div style="display:flex;align-items: center;margin-left: 45px;">
            <div style="width: 4px;height: 14px;background: #36A6FE;opacity: 1;border-radius: 4px;margin-lef:40px"></div>
            <p class="bbbplatform">售后保障</p> 
        </div>
        <p class="bbbproject_content" v-html="projectContent.saleProtection"></p>
    </div>
</template>

<script>
export default {
    props:['projectContent'],
    data(){
        return{
            list:[
                {
                    imgUrl:'xiangmu/icon01_youshi_details@2x.png',
                    title:'专业性',
                    txt:'10年科技项目申报经验'
                },
                {
                    imgUrl:'xiangmu/icon02_youshi_details@2x.png',
                    title:'多对一服务',
                    txt:'各领域专业团队定制服务'
                },
                {
                    
                    imgUrl:'xiangmu/icon03_youshi_details@2x.png',
                    title:'丰富的资源库',
                    txt:'多行业合作专家资源库'
                },
                {
                    imgUrl:'xiangmu/icon04_youshi_details@2x.png',
                    title:'团队',
                    txt:'团队人员均为高等学历'
                },
            ]
        }   
    }
}
</script>

<style lang="stylus" scoped>
.bbbadvantage{
    margin-top:20px;
    padding-bottom:10px;
    .bbbplatform{
        font-size: 16px;
        font-weight:bold;
        color: #36A6FE;
        margin-left: 10px;

    }
}
.bbbproject_content{
        margin:20px 50px;
        >>> img {
          max-width: 100%;
          height: auto !important;
        }
        >>> iframe {
        max-width: 100%;
        height: 300px;
      }
      >>> video {
            margin-top:15px;
            width:100%;
            height: 300px;
      }
}
</style>
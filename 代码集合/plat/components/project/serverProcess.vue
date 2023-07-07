<template>
    <div class="cccprocess">
        <div style="display:flex;align-items: center;margin-left: 45px;">
            <div style="width: 4px;height: 14px;background: #36A6FE;opacity: 1;border-radius: 4px;margin-lef:40px"></div>
            <p class="title">项目参数</p>
        </div>
        <!-- productParam -->
        <p class="cccproject_content"  v-html="projectContent.productParam"></p>
        <!-- <div class="imgsty">
            <img :src="require('@/assets/images/'+processImg)" />
        </div> -->
    </div>
</template>

<script>
export default {
    props:['projectContent'],
    data(){
        return{
            processImg:'xiangmu/img_liucheng_details@2x.png'
        }
    }
}
</script>

<style lang="stylus" scoped>
 .cccproject_content{
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
            // max-width:650px;
            margin-top:15px;
            width:100%;
            height: 300px;
        }
         >>> table{
             float:none !important;
         }
         >>> table{
             float:none !important;
         }
    }
.cccprocess{
    margin-top:20px;
    .title{
        margin-left:10px;
        font-size: 16px;
        font-weight:bold;
        color: #36A6FE;
    }
    .imgsty{
        width:849px;
        height:252px;
        margin:0 auto;
    }
    .imgsty img{
        width:100%;
        height:100%;
    }
}
</style>
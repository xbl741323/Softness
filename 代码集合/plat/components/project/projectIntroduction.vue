<template>
    <div class="introduction_box">
        <client-only>
            <div style="display:flex;align-items: center;margin-left: 45px;">
                 <div style="width: 4px;height: 14px;background: #36A6FE;opacity: 1;border-radius: 4px;margin-lef:40px"></div>
                 <p class="title">项目详情</p>
            </div>
            <p class="aaaproject_content" v-if="projectContent.content" v-html="projectContent.content"></p>
        </client-only>
    </div>
</template>

<script>
export default {
    props:['projectContent']
}
</script>

<style lang="stylus" scoped>
.introduction_box{
    background:#FFF;
    margin-top:30px;
    padding-bottom:20px;
    .title{
        font-size:16px;
        font-weight:bold;
        color: #36A6FE;
        margin-left: 10px;

    }
    .aaaproject_content{
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
    }
}
</style>
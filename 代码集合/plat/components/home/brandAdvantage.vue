<template>
    <div class="frame">
        <div class="brand_content">
            <p class="brand_title">品牌优势</p>
            <div style="border:2px solid #FFF;width:20px;margin-top:3px;"></div>
            <div style="margin-top:46px;">
                <el-carousel :interval="3000" arrow="never" height="350px">
                    <el-carousel-item v-for="item in 4"  :key="item" >
                        <div class="brand_shuffling" style="display:flex;width:100%;background:#FFF">
                            <img src="@/assets/images/home/zhengshu01_home@2x.png" />
                            <div style="width:100%;display:flex;">
                                <div v-for="item in 4" :key="item" style="width:100%;margin:0 15px">
                                    <img src="@/assets/images/home/zhengshu01_home@2x.png" />
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    height:556px;
    font-family:Microsoft YaHei UI;
    background-image url('~@/assets/images/home/platform_advantage@2x.png');
    background-size:100%;
    .brand_content{
        width:1200px;
        margin:0 auto;
        .brand_title{
            width:98px;
            font-size:22px;
            padding-top:39px;
            color:#FFF;
            letter-spacing :2px;
        }
        .brand_shuffling{
            padding:14px 13px;
        }
        .brand_shuffling img{
            width:214px;
            height:250px;
        }
    }
    
}
</style>
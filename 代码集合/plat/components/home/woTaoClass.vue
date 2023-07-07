<template>
    <div class="frame">
        <div class="class_room">
            <p style="color:#373D40;font-size:26px;width:108px;margin:0 auto;">卧涛课堂</p>
            <p class="title_line"></p>
            <el-tabs>
                <el-tab-pane label="线上课堂">
                    <online-class></online-class>
                </el-tab-pane>
                <el-tab-pane label="线下培训">
                    <offline-training></offline-training>
                </el-tab-pane>
                <el-tab-pane label="行业沙龙">
                    <industry-sharon></industry-sharon>
                </el-tab-pane>
            </el-tabs>
            <div class="release">
                <img src="images/home/icon_class_home@2x.png" />
                <span >发布培训</span>
                <p>更多线下活动 ></p>
            </div>
        </div>
    </div>
</template>

<script>
import OnlineClass from '~/components/home/compontents/onlineClass'
import OfflineTraining from '~/components/home/compontents/offlineTraining'
import IndustrySharon from '~/components/home/compontents/industrySharon'
export default {
    components:{
        OnlineClass,
        OfflineTraining,
        IndustrySharon
    }
}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    min-width:1200px;
    margin-top:28px;
    background:#FFF;
    font-family:Microsoft YaHei UI;
    .class_room{
        width:1200px;
        margin:0 auto;
        position relative;
        .title_line{
            width:48px;
            height:3px;
            background:#36A6FE;
            margin:5px auto;
        }
        .release{
            position:absolute;
            margin-left:78%;
            margin-top:-370px;
            width:250px;
            font-size:14px;
        }
        .release img{
            width:14px;
            height:14px;
            cursor:pointer;
        }
        .release span{
            color:#FF6E37;
            cursor:pointer;
        }
        .release p{
            float:right;
            color:#A8A8A8;
            cursor:pointer;
        }
    }
}
</style>
<style>
.el-tabs--bottom .el-tabs__item.is-bottom, .el-tabs--bottom .el-tabs__item.is-top .el-tabs--top .el-tabs__item.is-bottom, .el-tabs--top .el-tabs__item.is-top {
    font-size:18px;
}
</style>
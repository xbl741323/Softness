<template>
  <div class="project">
    <div class="notice-cont">
      <div style="display:flex">
        <div class="bigtitle">
            <img src="~@/assets/images/home/jianbian_bg@2x.png" width="15" height="15" />
             <span style="font-weight: bold;color: #333333;font-size: 0.4266666666666667rem;margin-left: -8px;">热门项目</span>
        </div>
        <span class="smalltitle">为企业提供全面政策支持</span>
      </div>
      <span class="moretitle" @click="toProject">
        <span>更多</span><img :src="imgUrl" alt="" />
      </span>
    </div>
    <div
      style="width: 100%;height: 0px;border: 1px solid #E7E6EB;opacity: 0.3;"
    ></div>
    <projectList />
  </div>
</template>
<script>
import Headers from "./noticeComponents/head";
import projectDivide from "./project/projectDivide";
import projectList from "./project/projectList";
export default {
  components: {
    Headers,
    projectDivide,
    projectList
  },
  data() {
    return {
      imgUrl: require("~/assets/images/technology/pointer.png"),
    };
  },
  methods: {
    toProject() {
      this.$router.push({
        path: "/project"
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.project{
    width: 100%;
    background: #fff;
    margin-top: 6px;
    margin-bottom: 6px;
}
.notice-cont{
    margin: 0 .426666666rem
    padding-top 13px
    padding-bottom 13px
    display flex
    justify-content space-between
    align-items center
}
  .bigtitle{
        width 80px
        height 19px
        display flex
    }
    .smalltitle{
        display inline-block
        margin-top 2px
        color: #233558;
        opacity: 0.5;
        font-weight: 400;
        font-size:0.32rem;
        margin-left 0.1rem
        position: relative;
        top: 1px;
        left: -6px;
    }
    .moretitle{
        color: #233558;
        font-size:0.32rem;
        font-weight: 400;
        display flex
        justify-content center
        align-items center
        span{
          opacity 0.5
        }
        img{
          width: 0.1333333333333333rem;
          height: 0.1778666666666667rem;
          margin-left 0.1066666666666667rem
        }
    }
</style>

<template>
  <div class="notice">
    <div class="notice-cont">
      <!-- <headers :type="5" /> -->
     <div class="bigtitle">
            <img src="~@/assets/images/home/jianbian_bg@2x.png" width="15" height="15" />
             <span style="font-weight: bold;color: #333333;font-size: 0.4266666666666667rem;margin-left: -0.16rem;">政策广场</span>
      </div>
      <span class="smalltitle">解决企业的产业政策匹配与运用问题</span>
    </div>
    <div
      style="width: 100%;height: 0px;border: 1px solid #E7E6EB;opacity: 0.2;"
    ></div>
    <tab-views :type="1" />
  </div>
</template>
<script>
import Headers from "./noticeComponents/head";
import tabViews from "./noticeComponents/policyTabs";
export default {
  components: {
    Headers,
    tabViews
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="stylus" scoped>
.notice{
    width: 100%;
    background: #fff;
}
.notice-cont{
    margin: 0 .426666666rem
    padding-top 0.3466666666666667rem
    padding-bottom 0.3466666666666667rem
    display flex
}
.bigtitle{
        width 2.133333333333333rem
        height 0.5066666666666667rem
        display flex
    }
    .smalltitle{
        display inline-block
        margin-top 0.0533333333333333rem
        margin-left 0.15rem
        color: #233558;
        opacity: 0.5;
        font-size 0.32rem
        font-weight: 400;
        position: relative;
        top: 1px;
        left: -0.16rem;
    }
</style>

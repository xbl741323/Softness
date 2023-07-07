<template>
<div style="position: relative;">
    <div
      style="width: 100%;height: 0px;border: 1px solid #E7E6EB;opacity: 0.3;position: absolute;top: 46px;"
    ></div>
   <div class="advantage">
    <div class="navtitle">
      <div class="bigtitle">
            <img src="~@/assets/images/home/jianbian_bg@2x.png" width="15" height="15" />
             <span class="dddddd">平台优势</span>
        </div>
      <span class="smalltitle">&nbsp;专业服务、高效</span>
    </div>
    <div class="content">
      <div class="one">
        <div class="a">
          <p class="new">专注企业服务</p>
          <p class="old">专业人做专业事</p>
        </div>
        <div class="b">
          <p class="new">定制服务</p>
          <p class="old">多对一定制服务</p>
        </div>
      </div>
      <div class="two">
        <div class="c">
          <p class="new">高成功率</p>
          <p class="old">500家成功案例</p>
        </div>
        <div class="d">
          <p class="new">高学历团队</p>
          <p class="old">团队均为高学历</p>
        </div>
      </div>
    </div>
  </div>
</div>
 
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.dddddd{
  font-weight: bold;
  color: #333333;
  font-size: 0.4266666666666667rem;
  margin-left: -6px;
  width: 80px;
}
.content {
  width: 100%;
  height: 183px;
  padding: 15px;
}
.one {
  display: flex;
  margin-top: 6px;
}
.two {
  display: flex;
  margin-top: 9px;
}
.a {
  width: 172px;
  height: 68px;
  background: url("~@/assets/images/home/icon01_foot_home@3x.png") no-repeat
    center/cover;
  margin-right: 20px;
}
.b {
  width: 172px;
  height: 68px;
  background: url("~@/assets/images/home/icon02_foot_home@3x.png") no-repeat
    center/cover;
}
.c {
  width: 172px;
  height: 68px;
  background: url("~@/assets/images/home/icon03_foot_home@3x.png") no-repeat
    center/cover;
  margin-right: 20px;
}
.d {
  width: 172px;
  height: 68px;
  background: url("~@/assets/images/home/icon04_foot_home@3x.png") no-repeat
    center/cover;
}

.new {
  margin-top: 17px;
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.old {
  margin-left: 10px;
  font-size: 10px;
  font-weight: 400;
  color: #999999;
  margin-top: 2px;
}
</style>
<style lang="stylus" scoped>
.navtitle{
  display: flex;
  align-items: center;
  padding: .32rem 0;
}
 .bigtitle{
            width 80px
            height 19px
            display flex
            align-items center
        }
.smalltitle{
            display inline-block
            margin-top 4px
            color: #233558;
            opacity: 0.5;
            font-weight: 400;
 }
.advantage {
  width: 100%;
  background: #fff !important;
  padding: 0 0.426666666rem;
  margin-bottom: 6px;
}
.advantage-title {
  font-size: 0.48rem;
  color: #333;
  font-weight: 600;
  padding: 0.32rem 0;
}
.item-wrapper {
  width: 100%;
  display: inline-block;
}
.item-wrapper li {
  width: 50%;
  float: left;
  margin-bottom: 0.533333333rem;
}
.item-wrapper li:nth-child(even) {
  padding-left: 5%;
}
.item-box {
  display: flex;
  align-items: center;
}
.item-img {
  width: 1.0666666667rem;
  height: 1.0666666667rem;
}
.item-img img {
  width: 100%;
}
.item-desc {
  margin-left: 0.2rem;
}
.item-desc h3 {
  font-size: 0.3733333333rem;
  color: #666;
}
.item-desc p {
  color: #999;
  font-size: 0.32rem;
}
</style>

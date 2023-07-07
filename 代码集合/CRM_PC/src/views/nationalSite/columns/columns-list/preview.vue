<template>
  <div class="notice_detail">
    <div class="notice_detail_contain">
      <!-- 文章区域 -->
      <div class="contain_left">
        <div class="essay_left_top">
          <div class="essay_title">
            {{ navInfo.title }}
          </div>
          <div class="essay_contant">
            <div>
              {{ navInfo.policyTypeValue }} / {{ navInfo.createTime }}
            </div>
            <div>
              <span>
                <img :src="viewUrl" alt="" />
                <span>22333</span>
              </span>
              <span>
                <img :src="shareUrl" alt="" />
                <span>分享</span>
              </span>
            </div>
          </div>
        </div>
        <p class="essay_left_bottom" v-html="content"></p>
        <!-- 上一页-下一页 -->
        <div class="essay_other">
          <div>
            <span>上个问题></span>
            <span>{{ preInfo.title }}</span>
          </div>
          <div>
            <span>下个问题></span>
            <span>{{ nextInfo.title }}</span>
          </div>
        </div>
      </div>

      <!-- 推荐区域 -->
      <div class="contain_right">
        <div class="right_intro_title">推荐资讯</div>
        <div
          class="right_intro_item"
          v-for="(item, index) in introList"
          :key="index"
        >
          <div>{{ item.title }}</div>
          <div>
            {{ item.title }}
          </div>
          <div>
            <span>{{ item.createTime }}</span>
            <span>点击查看</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navInfo: {
          title:"",
          policyTypeValue:"",
          createTime:"2020-12-23",
      },
      content:"",
      nextInfo: {
          title:"关于印发《安徽省科技中介服务机构工作绩效评价办法(试行)》的通知"
      },
      preInfo: {
          title:"关于印发《安徽省科技中介服务机构工作绩效评价办法(试行)》的通知"
      },
      introList: [
          {
            title:"关于印发《安徽省科技中介服务机构工作绩效评价办法(试行)》的通知",
            createTime:"2020-12-23"
          },
          {
            title:"关于印发《安徽省科技中介服务机构工作绩效评价办法(试行)》的通知",
            createTime:"2020-12-23"
          },
          {
            title:"关于印发《安徽省科技中介服务机构工作绩效评价办法(试行)》的通知",
            createTime:"2020-12-23"
          }
      ],
      shareSrc:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=",
      viewUrl: require("@/assets/images/js-wotao/icon_view.png"),
      shareUrl: require("@/assets/images/js-wotao/icon_share.png"),
    };
  },
  created() {
    this.navInfo.title = this.$route.query.title
    this.navInfo.policyTypeValue = this.$route.query.navName
    this.content = this.$route.query.content
  },
  methods: {}
};
</script>

<style scoped>
.notice_detail {
  background: #f7f8f9;
  width: 100%;
  min-height: 850px;
  padding: 10px 0px;
  overflow: hidden;
}
.notice_detail_contain {
  width: 1200px;
  display: flex;
  margin: 0 auto;
}
.contain_left {
  width: 970px;
  min-height: 600px;
  margin-right: 10px;
  background: #ffffff;
  border-radius: 5px;
  padding: 19px 15px;
}
.essay_left_top {
  min-height: 68px;
  border-bottom: 1px solid #eceaea;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
}
.essay_title {
  font-size: 18px;
  color: #3d3e3e;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
}
.essay_contant {
  display: flex;
  justify-content: space-between;
  color: #bbbbbb;
  font-size: 12px;
  position: relative;
}
.essay_contant > div:nth-of-type(2) {
  display: flex;
  justify-content: space-between;
}
.essay_contant > div:nth-of-type(2) > span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.essay_contant > div:nth-of-type(2) > span > img {
  margin-right: 5px;
}
.essay_contant > div:nth-of-type(2) > span:nth-of-type(1) {
  margin-right: 30px;
}
.essay_contant img {
  widows: 14px;
  height: 12px;
}
.share_img_contain {
  position: absolute;
  right: -25px;
  top: 15px;
  width: 180px;
  min-height: 180px;
  background: #ffffff;
  border: 1px solid rgb(235, 231, 231);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0 15px 0;
  color: #474646;
}
.share_img_contain > p:nth-of-type(1) {
  margin-bottom: 10px;
}
.share_img_contain > p:nth-of-type(2) {
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}
.share_img_contain > div {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.share_img_contain > div > span {
  transition: 0.3s;
}
.share_img_contain > div > span:hover {
  color: #36a6fe;
}
.share_img_contain > div > span:nth-of-type(2) {
  margin-left: 20px;
}
.share_img_contain img {
  margin-bottom: 15px;
  width: 110px;
  height: 110px;
}
.contain_right {
  width: 220px;
  height: 590px;
  background: #ffffff;
  border-radius: 5px;
  padding-bottom: 10px;
}
.essay_left_bottom {
  padding: 16px 0;
  color: #333333;
  font-size: 12px;
  min-height: 300px;
}
.right_intro_title {
  width: 100%;
  height: 50px;
  background: #1172f3;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  border-radius: 5px 5px 0px 0px;
}
.right_intro_item {
  width: 100%;
  height: 106px;
  padding: 14px 17px;
  border-top: 1px solid #e7e5e5;
}
.right_intro_item > div:nth-of-type(1) {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(2) {
  width: 100%;
  height: 34px;
  color: #666666;
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.right_intro_item > div:nth-of-type(3) {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(1) {
  color: #666666;
}
.right_intro_item > div:nth-of-type(3) > span:nth-of-type(2) {
  color: #36a6fe;
}
.essay_other {
  width: 100%;
  font-size: 14px;
  margin-top: 50px;
  border-top: 1px solid #eeeaea;
  padding-top: 21px;
}
.essay_other > div:nth-of-type(1) {
  margin-bottom: 9px;
}
.essay_other > div > span:nth-of-type(1) {
  color: #000000;
  opacity: 0.5;
}
.essay_other > div > span:nth-of-type(2) {
  color: #3d3e3e;
}
</style>
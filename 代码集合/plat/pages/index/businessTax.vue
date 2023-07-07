<template>
  <div class="frame">
    <div class="flex shouye">
      <img class="zz_logo" :src="zz_logo" alt="" />
      <div style="margin-left: 33px">
        <p class="qijiandian">卓昭官方旗舰店</p>
        <p class="ziying">卧涛自营</p>
      </div>
      <img class="ren_bg1" :src="ren_bg1" />
      <div>
        <p class="title1">量身定制解</p>
        <p class="title2">决工商财税方案</p>
      </div>
      <img class="ren_bg2" :src="ren_bg2" />
    </div>

    <div class="flex zhuozhaoList">
      <div class="xuanzhong">卓昭首页</div>
      <template v-for="(item, index) in serviceList.slice(0, 4)">
        <div :key="index" @click="handleChoose(item.id)" class="noxuanzhong">
          {{ item.spuTitle }}
        </div>
      </template>
      <div
        class="noxuanzhong"
        @mouseover="isMore = true"
        @mouseout="isMore = false"
      >
        更多服务
        <template v-for="(item, index) in serviceList.slice(4)">
          <div class="moreItem" v-show="isMore" :key="index">
            <div @click="handleChoose(item.id)" class="item-service">
              {{ item.spuTitle }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="bannerImg flex_y">
      <p class="caiwu">卓昭财务</p>
      <p class="daiban">为企业工商财税免忧代办</p>
      <p class="dingzhihua">
        注册方案定制化 | 快速规避风险 | 税收优惠甄选 | 全方位税收政策解读
      </p>
    </div>
    <div class="flex_y zhuanyefuwu">
      <div class="flex_y" style="margin-bottom: 6px">
        <p class="title1" style="margin-top: 40px">专业服务</p>
        <p class="zyfwjieshao">
          1000多项企业服务助力企业发展，已为千万企业提供满意的服务
        </p>
      </div>
      <div class="serviceList">
        <template v-for="(item, index) in serviceList.slice(0, 6)">
          <div
            class="serviceItem"
            :key="item.id"
            :style="{
              backgroundImage: `url('${fuwuImg[index]}')`,
              backgroundSize: '100% 100%',
            }"
            @click="goDetail(item.id)"
          >
            <p class="title2" style="margin: 30px 0 0 30px">
              {{ item.spuTitle }}
            </p>
            <p class="jieshao">{{ item.spuSlogan }}</p>
            <p class="gengduo">了解更多 ></p>
          </div>
        </template>
      </div>
    </div>

    <div class="flex_y bg_4" :style="{ backgroundImage: `url('${bg_4}')` }">
      <p class="flex fangan">立即获取卓昭工商财税订制方案</p>
      <div class="flex" style="margin: 20px 0 10px 0">
        <el-input
          class="xuqiuInput"
          placeholder="请输入您的手机号码"
          v-model.trim="phoneNo"
        ></el-input>
        <div class="xuqiuButton" @click="doSubmit(0)">提交需求</div>
      </div>
      <p style="font-size: 16px; color: #ffffff">
        售前咨询，下单快速响应，所有客户信息严格保密保密免遭外泄骚扰！所有客户信息严格保密免遭外泄骚扰！
      </p>
    </div>

    <div class="flex_y" style="height: 832px; width: 100%">
      <div style="margin: 34px 0 40px 0">
        <span class="title1">创业或经营过程中，</span>
        <span class="title1" style="color: #36a6fe">你是否也有以下疑问？</span>
      </div>
      <img class="ren_bg" :src="ren_bg" />
    </div>

    <div class="flex_y hyfg">
      <p>
        <span class="allhagnye">全行业覆盖 </span>
        <span class="title1">&nbsp; 轻松经营当老板</span>
      </p>
      <p class="butonghy">不同行业/类型公司注册，办理条件和流程有所差别</p>
      <div class="flex" style="flex-wrap: wrap; width: 1180px">
        <template v-for="item in hangyeList">
          <div :key="item.name">
            <div class="hangye">{{ item.name }}</div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex_y" style="width: 100%; height: 537px; background: #eff8ff">
      <p style="margin-top: 40px">
        <span class="title1">为什么选择</span>
        <span class="title1" style="color: #36a6fe">卓昭</span>
      </p>
      <img class="lbx_pic" :src="lbx_pic" />
    </div>

    <div class="flex_y" style="width: 100%; height: 642px; background: #ffffff">
      <p class="title1" style="margin-top: 38px">我们的团队</p>
      <p style="color: #666666; font-size: 16px; margin-top: 3px">
        专业专利工程师为您保驾护航
      </p>
      <img class="td_pic" :src="td_pic" />
    </div>

    <div class="fuwu" :style="{ backgroundImage: `url('${fuwu_bg}')` }">
      <p class="title1" style="margin-top: 40px">服务流程</p>
      <p style="color: #666666; font-size: 16px; margin-top: 4px">
        工商财税服务，专业团队快速为您提供解决方案
      </p>
    </div>

    <div class="flex_y big_bg" :style="{ backgroundImage: `url('${big_bg}')` }">
      <p class="title1" style="margin-top: 40px">您的需求、问题在线快速响应</p>
      <p style="font-size: 21px; color: #666666; margin-top: 4px">
        快速预约通道，高效便捷，放心可靠
      </p>
      <div class="flex_y form">
        <el-input
          style="width: 637px; margin-top: 40px"
          v-model="form.name"
          :rows="10"
          placeholder="请输入您的公司名称"
        ></el-input>
        <el-input
          style="width: 637px; margin: 20px 0"
          v-model="form.phone"
          placeholder="请输入您的手机号码"
        ></el-input>
        <el-button class="tijiaoButton" type="primary" @click="doSubmit(1)"
          >立即提交</el-button
        >
      </div>
    </div>
    <el-dialog width="600px" :visible.sync="centerDialogVisible">
      <img src="~/assets/images/last/tj_pic@2x.png" class="ttt" />
      <p class="first">亲爱的用户：</p>
      <p class="two">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的需求已经提交，我们将尽快安排专属人员为您服务，请您保持手机畅通。
      </p>
    </el-dialog>
  </div>
</template>

<script>
import { getConsult } from "@/api/home";
import { getProductList } from "@/api/productdetails";
export default {
  head() {
    return {
      title: "工商财税找卓昭-工商注册、公司变更，费用透明，快速注册",
      meta: [
        { name: "keywords", content: "工商注册 工商变更 企业注册" },
        {
          hid: "description",
          name: "description",
          content:
            "全国各类公司注册、注销、工商变更、个体户注册等工商服务找卓昭，全国线下服务网点，无需本人到场，熟知政策专业代理代办，费用透明，3天快速注册！",
        },
      ],
    };
  },
  data() {
    return {
      phoneNo: "",
      centerPhone: "",
      identification: "",
      centerDialogVisible: false,
      reg: /^1[3-9]\d{9}$/,
      isMore: false,
      cdnPath: process.env.CDN_BASE_URL,
      form: {
        name: "",
        phone: "",
      },
      shouyeList: [],
      serviceList: [],
      bg_4: require("@/assets/images/cs/bg_4@2x.png"),
      ren_bg: require("@/assets/images/cs/ren_bg@2x.png"),
      hangyeList: [
        { name: "软件行业" },
        { name: "电商行业" },
        { name: "广告行业" },
        { name: "通信行业" },
        { name: "物流行业" },
        { name: "建筑设计行业" },
        { name: "建筑施工行业" },
        { name: "人力资源行业" },
        { name: "教育培训行业" },
        { name: "资产管理行业" },
        { name: "环保行业" },
        { name: "直播行业" },
        { name: "房地产开发行业" },
        { name: "生产制造行业" },
        { name: "更多行业" },
      ],
      fuwuImg: [
        require("@/assets/images/cs/zhuce_bg@2x.png"),
        require("@/assets/images/cs/biangeng_bg@2x.png"),
        require("@/assets/images/cs/jizhang_bg@2x.png"),
        require("@/assets/images/cs/zhuxiao_bg@2x.png"),
        require("@/assets/images/cs/baogao_bg@2x.png"),
        require("@/assets/images/cs/ssch_bg@2x.png"),
      ],
      lbx_pic: require("@/assets/images/cs/lbx_pic@2x.png"),
      td_pic: require("@/assets/images/cs/td_pic@2x.png"),
      fuwu_bg: require("@/assets/images/cs/fuwu_bg@2x.png"),
      big_bg: require("@/assets/images/cs/big_bg@2x.png"),
      ren_bg1: require("@/assets/images/cs/ren_bg1@2x.png"),
      zz_logo: require("@/assets/images/cs/zz_logo@2x.png"),
      ren_bg2: require("@/assets/images/cs/ren_bg2@2x.png"),
      chooseName: "卓昭首页",
    };
  },
  methods: {
    handleMore() {
      this.isMore = true;
    },
    handleChoose(id) {
      window.open(`/productdetails/details?spuId=${id}`);
    },
    goDetail(id) {
      window.open(`/productdetails/details?spuId=${id}`);
    },
    getData() {
      let param = {
        categoryId: 7,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 15,
      };
      getProductList(param).then((res) => {
        let data = res.data.data.records;
        if (data) {
          this.serviceList = data;
          this.serviceList.forEach((item) => {
            this.$set(item, "isHover", false);
          });
        }
      });
    },
    doSubmit(val) {
      let phone = "";
      if (val == 0) {
        phone = this.phoneNo;
      } else {
        phone = this.form.phone;
      }
      if (!this.reg.test(phone)) {
        this.$message({
          message: "请输入一个正确的手机号码",
          type: "error",
          showClose: true,
          offset: 200,
        });
      } else {
        let param = {
          phoneNumber: phone,
          origin: "0",
          identification: this.identification,
        };
        getConsult(param).then((res) => {
          if (res.data.code == 0) {
            this.centerDialogVisible = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning",
              showClose: true,
              offset: 200,
            });
          }
          this.phoneNo = "";
          this.centerPhone = "";
        });
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
 

<style lang="stylus" scoped>
.bannerImg {
  height: 440px;
  width: 100%;
  background-image: url('~assets/images/cs/banner@2x.png');
  background-size: 100% 100%;
}

.form {
  width: 717px;
  height: 282px;
  background-color: #D9E1E8;
  border-radius: 15px;
  margin: 22px 0 40px 0;
}

.form ::v-deep .el-input__inner {
  height: 54px;
  width: 637px;
}

.xuanzhong {
  width: 198px;
  height: 46px;
  font-size: 16px;
  font-weight: 600;
  line-height: 46px;
  text-align: center;
  color: #fdfeff;
  background: #2a65ef;
  border-radius: 5px 5px 0px 0px;
}

.xuanzhong:hover {
  cursor: pointer;
}

.noxuanzhong {
  font-size: 16px;
  color: #333333;
  width: 198px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  font-weight: 600;
}

.noxuanzhong:hover {
  cursor: pointer;
  color: #fdfeff;
  background: #2a65ef;
  border-radius: 5px 5px 0px 0px;
}

.moreService {
  font-size: 16px;
  color: #333333;
  width: 198px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  font-weight: 600;
}

.moreService:hover {
  cursor: pointer;
}

.title1 {
  font-size: 30px;
  font-weight: 600;
  color: #333333 3;
}

.title2 {
  font-size: 24px;
  color: #333333;
  font-weight: 600;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex_y {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.ziying {
  width: 80px;
  height: 31px;
  background: #fb322f;
  border-radius: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 31px;
  margin-top: 8px;
  color: #FFFFFF;
}

.xuqiuButton {
  display: inline-block;
  width: 179px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  background: #FED91F;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  cursor: pointer;
  margin-left: 20px;
}

.hangye {
  width: 200px;
  height: 54px;
  background: #ffffff;
  border-radius: 10px;
  margin: 0 20px 20px 0;
  font-size: 18px;
  color: #666666;
  text-align: center;
  line-height: 54px;
}

.fuwu {
  display: flex;
  align-items: center;
  width: 100%;
  height: 336px;
  background: #f6f6f6;
  flex-direction: column;
  background-size: 100% 100%;
}

.td_pic {
  width: 1190px;
  height: 480px;
  background-size: 100% 100%;
  margin: 20px 0 40px 0;
}

.shouye {
  width: 100%;
  height: 120px;
  background: #f6f6f6;
}

.ren_bg1 {
  width: 350px;
  height: 100%;
  background: #f6f6f6;
  margin-left: 98px;
}

.tijiaoButton {
  width: 637px;
  margin-bottom: 40px;
  height: 54px;
  border-radius: 10px;
}

.zz_logo {
  width: 128px;
  height: 61px;
}

.ren_bg2 {
  width: 162px;
  height: 120px;
  margin-left: 32px;
}

.jieshao {
  font-size: 14px;
  color: #666666;
  margin: 10px 0 0 30px;
}

.gengduo {
  font-size: 18px;
  color: #999999;
  margin: 34px 0 30px 30px;
}

.zhuanyefuwu {
  width: 100%;
  background-color: #EBF0F8;
}

.bg_4 {
  height: 231px;
  width: 100%;
  background-size: 100% 100%;
}

.xuqiuInput {
  width: 773px;
  height: 46px;
  display: inline-block;
  line-height: 46px;
}

.qijiandian {
  font-size: 20px;
  color: #333333;
}

.dingzhi {
  margin-left: 11px;
  width: 202px;
  height: 74px;
}

.zhuozhaoList {
  width: 1913px;
  height: 46px;
  background: #ffffff;
}

.caiwu {
  font-size: 60px;
  font-weight: bold;
  color: #f6cf50;
}

.daiban {
  font-size: 48px;
  color: #f2f4f5;
  margin: 2px 0 4px 0;
}

.dingzhihua {
  font-size: 20px;
  color: #ffffff;
}

.zyfujieshao {
  font-size: 16px;
  color: #666666;
  line-height: 21px;
}

.serviceList {
  display: flex;
  flex-wrap: wrap;
  width: 1200px;
  margin: 16px 0 30px 0;
}

.fangan {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.ren_bg {
  width: 1190px;
  height: 702px;
  background-size: 100% 100%;
  margin-bottom: 16px;
}

.hyfg {
  height: 385px;
  width: 100%;
  background: #ebf0f8;
}

.allhangye {
  font-size: 40px;
  color: #3388FF;
  font-weight: 600;
}

.butonghy {
  font-size: 16px;
  color: #666666;
  margin: 4px 0 40px 0;
}

.lbx_pic {
  width: 948px;
  height: 347px;
  background-size: 100% 100%;
  margin: 44px 0 40px 0;
}

.big_bg {
  width: 100%;
  height: 449px;
  background-size: 100% 100%;
}

.allhagnye {
  width: 434px;
  height: 52px;
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  color: #3388ff;
  line-height: 45px;
}

.zyfwjieshao {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: #666666;
  line-height: 21px;
  letter-spacing: 0.96px;
  margin-top: 4px;
}

.first {
  font-weight: bold;
  font-size: 16px;
  color: #000000;
  padding: 0 30px;
}

.two {
  font-size: 16px;
  color: #000000;
  padding: 15px 30px 40px 30px;
  line-height: 27px;
  font-weight: 400;
}

.ttt {
  width: 283px;
  height: 146px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.serviceItem {
  width: 380px;
  height: 175px;
  margin: 10px;
}

.serviceItem:hover {
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 4px 4px 6px #ccc;
  transform: translateX(2px)  
  -webkit-transform: translateX(2px)
}

.moreItem {
  width: 198px;
  height: 46px;
  background: #fff;
  border-top: 1px solid #eee;
}
.item-service{
  font-size: 16px;
  color: #fdfeff;
  background: #2a65ef;
}
</style>
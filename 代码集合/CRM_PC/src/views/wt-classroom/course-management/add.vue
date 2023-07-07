<template>
  <div class="wt-add-classroom">
    <!-- 头部信息 -->
    <div class="wt-steps-sty">
      <span>新建课程</span>
      <el-steps :active="cStep" finish-status="success" class="step-main">
        <el-step title="基本信息"></el-step>
        <el-step title="课程目录"></el-step>
        <el-step title="课程介绍"></el-step>
        <el-step title="交易完成"></el-step>
      </el-steps>
    </div>
    <!-- 基本信息 -->
    <div v-show="cStep == 1" class="wt-add-item">
      <classBasic :permissions="permissions" ref="basic" @close-dialog="passToNext" @pass="pass()" :pageFrom="2"></classBasic>
    </div>
    <!-- 课程目录 -->
    <div v-if="cStep == 2" class="wt-add-item">
      <classCatalogue :permissions="permissions" :classId="classId" :feeType="basicInfo.feeType" ref="catalogue"></classCatalogue>
    </div>
    <!-- 课程介绍 -->
    <div v-show="cStep == 3" class="wt-add-item">
      <classContent :permissions="permissions" :classId="classId" ref="content" :pageFrom="2"></classContent>
    </div>
    <!-- 按钮区域 -->
    <div class="wt-operate-btn">
      <!-- 基本信息区域 -->
      <el-button type="primary" size="medium" v-preventReClick v-if="cStep==1" @click="setNext()">下一步</el-button>
      <!-- 课程目录区域 -->
      <el-button type="primary" size="medium" v-preventReClick v-if="cStep==2" @click="showNext(1)">上一步</el-button>
      <el-button type="primary" size="medium" v-preventReClick v-if="cStep==2" @click="showNext(3)">下一步</el-button>
      <!-- 课程介绍区域 -->
      <el-button type="primary" size="medium" v-preventReClick v-if="cStep==3" @click="finalCreate()">创建</el-button>
      <el-button type="primary" size="medium" v-preventReClick v-if="cStep==3" @click="showNext(2)">上一步</el-button>
      <!-- 公共区域 -->
      <el-button size="medium" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addClass } from "@/api/project/wtClass";
import classBasic from "@/components/project/wt-classroom/class-basic";
import classContent from "@/components/project/wt-classroom/class-content";
import * as CodeMsg from "@/api/common/CodeChange";
import classCatalogue from "@/components/project/wt-classroom/class-catalogue";
import { clearDetail } from "@/util/clearDetail";
export default {
  components: {
    classBasic,
    classContent,
    classCatalogue,
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  data() {
    return {
      classId: "",
      basicInfo: {},
      cStep: 1,
    };
  },
  methods: {
    // 创建第一步，添加基本信息
    createClass() {
      let basicInfo = this.basicInfo;
      let themeType = [];
      basicInfo.themeType.forEach((item) => {
        themeType.push({
          subjectId: item,
        });
      });
      let params = {
        // 基本信息
        baseTitle: basicInfo.classTitle, // 课程标题
        baseSlogan: basicInfo.adviseDesc, // 广告语
        listSubject: themeType, // 专业类型
        baseCoverUrl: basicInfo.coverUrl, // 封面图片
        baseShowState: basicInfo.showStatus, // 显示状态
        listProduct: basicInfo.relateProduct, // 关联产品
        listPlate: this.$refs.basic.listPlate,
        serialNo: basicInfo.sort, // 序号
        // SEO信息
        seoTitle: basicInfo.metaTitle, // 网页标题
        seoMeta: basicInfo.metaKeywords, // meta关键字
        seoMetaDesc: basicInfo.metaDesc, // meta描述
        // 交易信息
        tradingChargeType: basicInfo.feeType, // 收费类型
        tradingOriginalPrice: basicInfo.classPreFee == "" ? 0 : Number(basicInfo.classPreFee), // 课程原价
        tradingCurrentPrice: basicInfo.classNowFee == "" ? 0 : Number(basicInfo.classNowFee), // 课程现价
        tradingVipPrice: basicInfo.classVipFee == "" ? 0 : Number(basicInfo.classVipFee), // 课程vip价
        tradingThirdFee: basicInfo.classThirdFee == "" ? 0 : Number(basicInfo.classThirdFee), // 课程第三方费用
        tradingThirdFeeState: basicInfo.classThirdFeeStatus, // 是否含有第三方费用
      };
      // 添加课程介绍
      addClass(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.cStep = 2;
          this.classId = res.data.data;
          this.$nextTick(() => {
            this.$refs.basic.classId = this.classId;
            this.$refs.basic.getDetail();
          });
        } else if (res.data.code == -1) {
          this.$message({
            type: "warning",
            message: res.data.msg,
            offset: 300,
          });
        } 
      });
    },
    finalCreate() {
      this.$nextTick(() => {
        this.$refs.basic.classId = this.classId;
        this.$refs.basic.finalSave(this.$refs.content.classInfo.classDesc);
      });
    },
    passToNext() {
      this.cStep = 2;
    },
    pass() {
      this.basicInfo = this.$refs.basic.classForm;
      this.createClass();
    },
    // 基本信息页点击下一步校验并调用接口
    setNext() {
      if (this.classId == "") {
        // classId没值时调用添加接口
        this.$refs.basic.saveParams();
      } else {
        // 否则调用编辑接口
        this.$refs.basic.saveData();
      }
    },
    showNext(num) {
      this.cStep = num;
      if (num == 1) {
        this.$nextTick(() => {
          this.$refs.basic.classId = this.classId;
          this.$refs.basic.getDetail();
          this.$refs.basic.getPlatesList();
        });
      }
    },
    cancel() {
      clearDetail("/wt-classroom/course-management/index");
      this.$router.push("/wt-classroom/course-management/index");
    },
  },
};
</script>

<style scoped>
.wt-add-classroom {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 40px 0 100px 100px;
}
.wt-steps-sty {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.wt-steps-sty > span:nth-of-type(1) {
  color: #333333;
  font-size: 16px;
  margin-right: 20px;
}
.step-main {
  width: 80%;
}
.wt-add-item {
  width: 80%;
}
.wt-operate-btn {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
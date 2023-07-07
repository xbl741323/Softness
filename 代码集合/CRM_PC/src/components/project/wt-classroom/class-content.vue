<template>
  <div class="class-xontent">
    <div>
      <h3 class="basic-title-content">课程介绍</h3>
      <div class="class-desc-contain">
        <tinymceEditor v-model="classInfo.classDesc" @getEditorValue="getChildEditor" :id="String(1)"></tinymceEditor>
      </div>
    </div>
    <!-- 快速修改/编辑按钮区域 -->
    <div class="fix-edit-btn" v-if="(pageFrom == 0)&&(classForm.baseShowState!==3)">
      <el-button type="primary" size="medium" class="save-btn" v-preventReClick @click="permissions.sys_wt_course_edit ? saveData() : $notAuthorized()">保存</el-button>
      <el-button size="medium" @click="cancel()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { editClass, getClassDetail } from "@/api/project/wtClass";
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import * as CodeMsg from "@/api/common/CodeChange";
import { clearDetail } from "@/util/clearDetail";
export default {
  props: {
    pageFrom: {
      type: Number,
      default: 0, // 0-编辑页 2-添加页
    },
    permissions:{
      type: Object
    }
  },
  components: {
    tinymceEditor,
  },
  created() {
    if (this.$route.query.classId) {
      this.classId = this.$route.query.classId;
    }
  },
  data() {
    return {
      classForm: {},
      classId: "",
      // 其他
      classInfo: {
        classDesc: "",
      },
    };
  },
  mounted() {
    if (this.classId !== "") {
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      let params = {
        id: this.classId,
      };
      getClassDetail(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let result = res.data.data;
          this.classInfo.classDesc = result.instruction;
          this.classForm = result;
        }
      });
    },
    checkContent() {
      let classDesc = this.classInfo.classDesc;
      classDesc = classDesc.replace(/&nbsp;/g, "").replace(/\s*/g, "");
      return classDesc;
    },
    saveData() {
      if (this.classInfo.classDesc !== "" && this.checkContent() !== "<p></p>") {
        let basicInfo = this.classForm;
        let params = {
          id: this.classId,
          // 基本信息
          baseTitle: basicInfo.baseTitle, // 课程标题
          baseSlogan: basicInfo.baseSlogan, // 广告语
          listSubject: basicInfo.listSubject, // 专业类型
          baseCoverUrl: basicInfo.baseCoverUrl, // 封面图片
          baseShowState: basicInfo.showStatus, // 显示状态
          listProduct: basicInfo.relateProduct, // 关联产品
          listPlate: basicInfo.listPlate, //所属板块
          serialNo: basicInfo.serialNo, // 序号
          // SEO信息
          seoTitle: basicInfo.seoTitle, // 网页标题
          seoMeta: basicInfo.seoMeta, // meta关键字
          seoMetaDesc: basicInfo.seoMetaDesc, // meta描述
          // 交易信息
          tradingChargeType: basicInfo.tradingChargeType, // 收费类型
          tradingOriginalPrice: basicInfo.tradingOriginalPrice, // 课程原价
          tradingCurrentPrice: basicInfo.tradingCurrentPrice, // 课程现价
          tradingVipPrice: basicInfo.tradingVipPrice, // 课程vip价
          tradingThirdFee: basicInfo.tradingThirdFee, // 课程第三方费用
          tradingThirdFeeState: basicInfo.tradingThirdFeeState, // 是否含有第三方费用
          instruction: this.classInfo.classDesc,
        };
        editClass(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "保存成功！",
              offset: 300,
            });
            this.getDetail();
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "课程介绍不能为空！",
          offset: 300,
        });
      }
    },
    cancel() {
      clearDetail("/wt-classroom/course-management/index");
      this.$router.push("/wt-classroom/course-management/index");
    },
    getChildEditor(data, index) {
      this.classInfo.classDesc = data;
      this.checkContent();
    },
  },
};
</script>

<style scoped>
.class-xontent {
  width: 100%;
}
.basic-title-content {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.class-desc-contain {
  padding-top: 15px;
  margin: 20px 0 30px 0;
}
.fix-edit-btn {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.save-btn {
  margin-right: 100px;
}
</style>
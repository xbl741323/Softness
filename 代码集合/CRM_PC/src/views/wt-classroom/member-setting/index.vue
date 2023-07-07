<template>
<basic-container>
  <div class="class-basic">
    <el-form ref="memberForm" :model="memberForm" :rules="rules">
      <!-- 基本信息区域 -->
      <div class="top-info">
        <h3 class="basic-title-basic">会员设置</h3>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>会员产品ID</span>
          </div>
          <el-form-item class="class-item-input" prop="memberId">
             HY001
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>会员名称</span>
          </div>
          <el-form-item class="class-item-input" prop="memberName">
            卧涛课堂VIP
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span>*</span>
            <span>封面图片</span>
          </div>
          <el-form-item class="class-item-input" prop="coverUrl">
            <div class="wt-img-upload">
              <imgUpload ref="upload" :imageDesc="imageDesc"></imgUpload>
            </div>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span></span>
            <span>价格</span>
          </div>
          <el-form-item class="class-item-input" prop="memberPrice">
            <div class="price-contain">
              <el-input type="number" size="small"  @change="memberForm.memberPrice = oninput(memberForm.memberPrice)" @keyup.native="memberForm.memberPrice = oninput(memberForm.memberPrice)" v-model="memberForm.memberPrice"></el-input>
              <span>元</span>
            </div>
          </el-form-item>
        </div>
        <div class="class-item">
          <div class="class-item-label">
            <span></span>
            <span>有效期</span>
          </div>
          <el-form-item class="class-item-input">
             购买后一年
          </el-form-item>
        </div>
        <!-- <div class="class-item">
          <div class="class-item-label">
            <span></span>
            <span>会员介绍</span>
          </div>
          <el-form-item class="class-item-input" prop="memberDesc">
            <tinymceEditor class="desc-sty" v-model="memberForm.memberDesc" @getEditorValue="getChildEditor" :id="String(1)"></tinymceEditor>
          </el-form-item>
        </div> -->
      </div>
    </el-form>
    <!-- 快速修改/编辑按钮区域 -->
    <div class="fix-edit-btn">
      <el-button type="primary" size="medium" class="save-btn" v-preventReClick @click="saveData()">保存</el-button>
      <el-button size="medium" @click="cancel()">取消</el-button>
    </div>
  </div>
  </basic-container>
</template>

<script>
import { getMemberInfo, updateMemberInfo } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import imgUpload from "@/components/upload/class-upload";
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
export default {
  components: {
    imgUpload,
    tinymceEditor,
  },
  data() {
    return {
      imageDesc:
        "仅可上传一张图片作为封面，格式为jpg，png等，大小控制在4M以内。",
      setContent: false,
      memberForm: {
        // 基本信息
        memberId: "",
        memberName: "",
        memberPrice: "",
        coverUrl: "",
        memberDesc: "",
      },
      rules: {
        coverUrl: [
          { required: true, message: "请上传视频封面", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 10);
      return value;
    },
    getChildEditor(data, index) {
      this.memberForm.classDesc = data;
    },
    // 编辑课堂信息 + 校验
    saveData() {
      if (this.$refs.upload.imgList.length > 0) {
        this.memberForm.coverUrl = this.$refs.upload.imgList[0].response.data;
      }
      this.$refs["memberForm"].validate((val) => {
        if (val) {
          // 调用编辑接口
          this.updateData();
        } else {
          this.$message({
            type: "warning",
            message: "请核验表单后再进行保存！",
            offset: 300,
          });
        }
      });
    },
    updateData() {
      let params = {
        id: 1,
        price: this.memberForm.memberPrice,
        coverUrl: this.memberForm.coverUrl,
      };
      updateMemberInfo(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "保存成功！",
            offset: 300,
          });
          this.getDetail();
        }
      });
    },
    // 获取课堂详情数据
    getDetail() {
      getMemberInfo().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.memberForm.memberPrice = r.price == null ? "" : Number(r.price);
          this.getCover(r);
        }
      });
    },
    getCover(r) {
      if (r.coverUrl != null) {
        this.$nextTick(() => {
          if (this.$refs.upload && r.coverUrl != null) {
            this.$refs.upload.imgList = [];
            this.$refs.upload.imgList.push({
              response: {
                data: r.coverUrl,
              },
            });
          }
        });
      }
    },
    // 保存参数
    saveParams() {
      if (this.$refs.upload.imgList.length > 0) {
        this.memberForm.coverUrl = this.$refs.upload.imgList[0].response.data;
      }
      this.$refs.memberForm.validate((val) => {
        if (val) {
          this.$emit("pass");
        } else {
          this.$message({
            type: "warning",
            message: "信息填写不全，请补充完整！",
            offset: 300,
          });
        }
      });
    },
    // 取消操作
    cancel() {
      this.$router.go(-1)
    },
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style scoped>
.class-basic {
  width: 100%;
  background: #ffffff;
}
.basic-title-basic {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.class-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-bottom: none !important;
}
.class-item:last-of-type {
  border-bottom: 1px solid #dcdfe6 !important;
}
.class-item-label {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  align-items: center;
  font-size: 14px;
}
.class-item-label > span:nth-of-type(1) {
  color: red;
}
.class-price-label {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
}
.class-price-label > span:nth-of-type(1) {
  color: red;
}
.class-item-input {
  width: 100%;
  flex: 6;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #dcdfe6;
  padding: 20px;
}
.class-item-input-fee {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
}
.item-input-value {
  width: 320%;
}
.item-edit-value {
  width: 500% !important;
}
.top-info {
  margin-bottom: 30px;
}
.wt-img-upload {
  padding-top: 30px;
  padding-left: 10px;
  margin-bottom: -20px;
}
.relate-list {
  display: flex;
  flex-direction: column;
}
.relate-btn span {
  margin-left: 10px;
}
.relate-list-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.realte-del-btn {
  width: 20px;
  height: 20px;
  margin-left: 20px;
  cursor: pointer;
  transition: 0.5s;
}
.realte-del-btn:hover {
  color: #36a6fe;
}
.class-fee-contain {
  width: 100%;
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-left: 1px solid #dcdfe6;
  padding: 10px 20px;
}
.input-fee-contain {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.input-fee-contain span {
  font-size: 14px;
}
.input-fee-contain > span:nth-of-type(1) {
  display: inline-block;
  text-align: center;
  width: 70px;
}
.input-fee-contain p {
  font-size: 14px;
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
.third-fee {
  margin-right: 20px !important;
}
.fee-status-sty {
  width: 200px;
}
.price-contain {
  display: flex;
}
.price-contain span {
  margin-left: 10px;
}
.desc-sty {
  margin-top: 0px;
}
</style>

<style>
.class-basic .el-form-item {
  margin: 0 !important;
}
.class-basic .el-form-item__content {
  margin-left: 0 !important;
}
</style>
<template>
  <!-- 统一跟进（包含客户跟、进线索跟进）组件 -->
  <div class="follow">
    <el-dialog :title="followTitle" width="40%" :visible.sync="followClueDialog"  v-if="followClueDialog" :close-on-click-modal="false" :before-close="handldeCancel">
      <el-form :model="followClueForm" ref="followClueForm" :rules="followClueRules" label-width="100px">
        <el-form-item label="跟进方式：" prop="followType">
          <el-select v-model="followClueForm.followType">
            <span v-for="item in followClueTypeList" :key="item.id">
              <el-option v-if="(item.id!=(env == 'development' ? 109 : env == 'test' ? 58 : 58))" :label="item.name" :value="item.id"/>
            </span>
          </el-select>
          <span class="tip-sty">见面拜访请到CRM小程序操作</span>
        </el-form-item>
        <el-form-item label="跟进内容：" prop="followContent">
          <el-input v-model="followClueForm.followContent" type="textarea" :rows="9" maxlength="500" show-word-limit size="medium" />
        </el-form-item>
        <el-form-item label="跟进产品：">
          <template v-if="selectOption && selectOption.length > 0">
            <div v-for="(item, index) in selectOption" :key="index" @click="dele(index)">
              {{ item.spuCode ? item.spuCode + "-" : ""}}{{ item.spuTitle }}
              <i class="el-icon-close pointer"></i>
            </div>
          </template>
          <el-button type="primary" :disabled="selectOption && selectOption.length >= 3" @click="showProduct()">选择产品</el-button>
          <div class="other-contain">
            <el-checkbox v-model="checked">其他</el-checkbox>
            <el-input class="other-pro-sty" v-if="checked" v-model="followClueForm.productOther" maxlength="30" show-word-limit size="medium" :class="{ borcolor: checked && requireShow == true }"/>
          </div>
          <p v-if="checked && requireShow == true" class="product-tip">请输入产品名称</p>
        </el-form-item>
        <el-form-item label="附件：">
          <fileupload v-if="followClueDialog" @fileList="getFileList" :followFileList="fileList" :multipleFile="true"/>
        </el-form-item>
        <el-form-item label="下次跟进：" prop="time">
          <el-date-picker v-model="followClueForm.time" format="yyyy-MM-dd" :picker-options="expireTimeOption" placeholder="选择日期时间" >
          </el-date-picker>
        </el-form-item>
        <div class="footer">
          <el-button size="medium" class="follow-right-btn" type="primary" @click="confirmFollow()" v-preventReClick>{{ $t("button.confirm") }}</el-button>
          <el-button size="medium" @click="handldeCancel()">{{ $t("button.cancel") }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加关联产品dialog -->
    <el-dialog :visible.sync="countDialog" :close-on-click-modal="false" width="55%">
      <add-product v-if="countDialog" @selectProduct="selectProduct" @closeDialog="closeDialog" :selectPro="selectOption"></add-product>
    </el-dialog>
  </div>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { followOperate, upLoadFollowFile } from "@/api/new-client/my-clue";
import fileupload from "@/components/file/file-upload";
import addProduct from "@/components/new-client/common/follow-product";
export default {
  components: {
    fileupload,
    addProduct,
  },
  data() {
    return {
      followId:'',
      env: process.env.NODE_ENV,
      operateType:0, // 0-创建 1-编辑
      followTitle:"",
      clueType:2, // 线索类型 1-个人 2-单位
      publicTime: 0,
      countDialog: false,
      requireShow: false,
      checked: false,
      selectOption: [], // 选择的产品列表
      followInfo: {},
      followClueDialog: false,
      followClueTypeList: [],
      fileList: [],
      followClueRules: {
        followType: [
          { required: true, message: "请选择跟进方式", trigger: "blur" },
        ],
        followContent: [
          { required: true, message: "请输入跟进内容", trigger: "blur" },
        ],
      },
      expireTimeOption: {
        disabledDate: (date) => {
          return (
            date.getTime() < Date.now() - 24 * 60 * 60 * 1000 
          );
        },
      },
      followClueForm: {
        followType: "",
        followContent: "",
        time: null,
        productOther: "",
      },
    };
  },
  mounted(){
    this.getDropList()
  },
  methods: {
    getDropList() {
      getClassifyList().then(res=>{
        if(res.data.code == 1000){
          let r = res.data.data 
          this.followClueTypeList = r[9].optionList;
        }
      })
    },
    closeDialog(){
      this.countDialog = false;
    },
    selectProduct(val){
      this.selectOption = val;
      this.countDialog = false;
    },
    handldeCancel() {
      this.followClueDialog = false;
      this.followClueForm = {
        followType: "",
        followContent: "",
        time: null,
        productOther: "",
      };
      this.checked = false;
      this.selectOption = [];
    },
    //获取文件上传组件返回的文件数组
    getFileList(val) {
      this.fileList = val;
    },
    showProduct() {
      this.countDialog = true;
    },
    dele(index) {
      this.selectOption.splice(index, 1);
    },
    // 获取产品信息
    getProInfo(){
      let result = []
      this.selectOption.forEach(item=>{
        result.push({
          spuId: item.id, // 产品ID
          followSpuCode: item.spuCode, // 跟进产品编号
          followSpuName: item.spuTitle, // 跟进产品名称
        })
      })
      return result;
    },
    // 上传文件
    upLoadMutiFile(){
      let upedList = this.fileList.filter(item=>{
        return item.followId
      })
      console.log(this.followClueForm.time,'this.followClueForm.time')
      let params = {
        clueId: this.clueType == 2? this.followInfo.clueCompanyId : this.followInfo.cluePersonId, // 线索ID
        clueType: String(this.clueType), // 线索类型 1-个人 2-单位
        followTypeId:this.followClueForm.followType, // 跟进方式id
        followContent:this.followClueForm.followContent, // 跟进内容
        nextFollowTime:Number(this.followClueForm.time) == 0?null:this.$moment(this.followClueForm.time).format("YYYY-MM-DD"), // 下次跟进时间
        otherSpu: this.checked == true ? this.followClueForm.productOther : "", // 其他产品
        clueFollowSpuList: this.selectOption.length>0? this.getProInfo() : null,  // 跟进产品列表 max-3
        clueFollowFileList: upedList  // 跟进附件列表 max-5
      }
      if(this.operateType == 1){
        params.id = this.followId // 编辑传id
      }
      let upList = this.fileList.filter(item=>{
        return !item.followId
      })
      console.log(upList,'upListupList')
      if(upList.length>0){
        let para = new FormData();
        upList.forEach(item=>{
          para.append("multipartFiles",item.raw,item.name)
       })
       upLoadFollowFile(para).then(res=>{
        if(res.data.code == 0){
          console.log(res.data.data);
          params.clueFollowFileList = params.clueFollowFileList.concat(res.data.data) 
          this.submitFollow(params);
        }
       })
      }else{
       this.submitFollow(params);
      }
    },
    // 跟进赋值校验
    confirmFollow() {
      this.$refs["followClueForm"].validate((valid) => {
       if (valid) {
        this.upLoadMutiFile();
      }
     });
    },
    // 提交跟进
    submitFollow(params) {
      if (this.checked && this.followClueForm.productOther == "") {
        this.requireShow = true;
        return false;
      }
      if(params.clueFollowFileList.length==0){
        params.clueFollowFileList = null
      }
      followOperate(params,this.operateType).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "跟进成功！",
            offset: 300,
          });
          this.followClueDialog = false;
          this.requireShow = false;
          this.$refs["followClueForm"].resetFields();
          this.fileList = [];
          this.selectOption = [];
          this.followClueForm.productOther = ""
          this.checked = false
          this.$emit("refresh");
        } else if (res.data.code != CodeMsg.CODE_1001) {
          this.$message({
            type: "warning",
            message: "跟进失败！",
            offset: 300,
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.other-contain {
  display: flex;
  margin-top: 15px;
}
.product-tip {
  color: red;
  margin-top: 2px;
  margin-left: 60px;
}
.footer {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
.follow-right-btn {
  margin-right: 100px;
}
.pointer{
  cursor: pointer;
}
.tip-sty{
  color: red;
  margin-left: 20px;
}
.other-pro-sty{
  margin-left: 10px;
  width: 400px;
}
</style>
<template>
<!-- 排查完成 -->
  <div class="template-frame">
    <p class="">合同模板</p>
    <el-form :model="templateForm" ref="templateForm" :rules="rules" label-width="120px" class="template-box">
      <el-form-item label="模板名称：" prop="templateName">
        <el-input v-model="templateForm.templateName" maxlength="50" placeholder="请输入模板名称" style="width:800px;"/>
        <br><span class="tip">请上传规范的模板名称，不超过50字</span>
      </el-form-item>
      <el-form-item label="签署方(乙方)：" prop="signatory">
         <el-select v-model="templateForm.signatory" placeholder="请选择签署方" style="width:250px;">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.partBName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板文件：" prop="file">
        <file-upload :limit='1' :acceptType="'.pdf'" :multipleFile=false :wordLimit="100" class="upload-file" @fileList="getFileList" :contractFile="templateFile" :status='templateStatus' v-model="templateForm.file"/>
        <p class="template-require">只允许上传一份合同文件，格式为pdf,文件大小不超过20M</p>
      </el-form-item>
    </el-form>
    <div class="template-add-btn">
      <el-button type="primary" @click="saveTemplate()">下一步</el-button>
      <el-button @click="cancel()">取 消</el-button>
    </div>

  </div>
</template>

<script>
import { addTemplate, toTemplate ,getSignatory} from '@/api/contracts/contracts'
import fileUpload from '@/components/file/file-upload.vue';
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  components: {
    fileUpload
  },
  data(){
    var fileValidate = (rule, value, callback)=>{
      if(Boolean(this.templateForm.file)){
        callback();
      }else{
        callback(new Error('请添加模板文件！'));
      };
    }
    return {
      templateForm: {
      },
      rules:{
        templateName:[{required: true, message: '请输入模板名称', trigger: 'blur'}],
        file:[{required: true, validator: fileValidate,trigger: 'blur'}],
        signatory:[{required: true,message: '请选择签署方',trigger: 'blur'}],
      },
      componentList: [],
      list: [],
      editStatus: false,
      templateFile: [],
      templateStatus: false,
      options: [],
    }
  },
  mounted(){
    if(this.$route.query.id){
      this.getTemplateDetail(this.$route.query.id);
    };
    this.getSignatory()
  },
  methods:{
    // 获取签署方列表
    getSignatory(){
      getSignatory().then(res =>{
        if (res.data.code == CodeMsg.CODE_0) {
            this.options = res.data.data
          }
      })
    },
    cancel(){
      history.go(-1);
    },
    getFileList(val){//获取上传的文件
      this.$set(this.templateForm,'file',val[0] || false);
    },
    saveTemplate(){
      this.$refs.templateForm.validate(valid=>{
        if(valid){
          let param = new FormData();
          param.append('templateName',this.templateForm.templateName);
          param.append('file',this.templateForm.file.raw);
          param.append('serviceSignId',this.templateForm.signatory);
          addTemplate(param).then(res=>{
            if(res.data.code == 0){
              this.$router.push({
                  path: "/contracts-template-map",
                  query: {
                    templateId: res.data.data,
                    name: this.templateForm.templateName

                  }
              });
              this.editTemplate(res.data.data, this.templateForm.templateName)
            }else{
              this.$message({
                type:'warning',
                message: res.data.msg,
                duration: 2000
              })
            };
          })
        }else{
          return false;
        };
      })
    },
    // 编辑合同模板
    editTemplate(id,name){
      let params = {
        id: id,
        returnUrl: window.location.origin + `/#/contracts-template-map?templateId=${id}&name=${name}`
      }
      toTemplate(params).then(res=>{
        window.open(res.data.data);
      })
    },
  }
}
</script>

<style scoped>
.template-frame{
  min-height: 100%;
  padding: 20px;
  background: #FFFFFF;
}
.template-add-btn{
  text-align: center;
  margin: 30px;
}
.control-btn{
  text-align: center;
}
.template-require{
  font-size: 12px;
  color: #666666;
}
.template-box .tip {
  color: #666666;
}
.template-box .textStyle1 {
  font-size: 14px !important;
  color: #666666;
}
.template-box .wid {
  width: 800px;
  margin-bottom: 15px;
  color: #666666;
  font-size: 12px;
}
</style>
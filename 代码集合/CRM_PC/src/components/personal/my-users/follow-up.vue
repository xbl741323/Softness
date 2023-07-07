<template>
<!-- 排查完成 -->
    <div>         
        <el-form :model="addForm" ref="addForm" inline :rules="rules" label-width="100px">
         <el-form-item label="跟进方式：" prop="followType">
          <el-select v-model="addForm.followType">
          <el-option           
            v-for="item in followStyleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
          </el-select>
         </el-form-item>
         <el-form-item label="跟进内容：" prop="followContent">
          <el-input class="content" maxlength="500" rows="8" show-word-limit v-model="addForm.followContent" type="textarea" clearable></el-input>
         </el-form-item>
        <div>
         <el-form-item label="附件：" prop="file">
          <el-upload
            class="upload-demo"
            action
            ref="upload"
            :file-list="fileList"           
            :on-remove="handleRemove"
             multiple
            :limit="5"
            :on-exceed="handleExceed"
            :on-change="OnChange"
            :auto-upload="false"
            :before-remove="beforeRemove"
          >
            <el-button size="small" type="primary">选择本地文件</el-button>
            <span style="color:#888;margin-left:10px;">当前限制选择5个文件</span>

           </el-upload>
         </el-form-item>
         <el-form-item label="下次跟进：" prop="followNext" style="display:flex;">
          <el-date-picker
          align="right"
          v-model="addForm.followNext" 
          type="datetime"
          :picker-options="expireTimeOption"
          placeholder="下次跟进时间"
          format="yyyy-MM-dd HH:mm"
          @change="dateChange">
         </el-date-picker>
         </el-form-item>
        </div>
        </el-form>
        <div slot="footer" class="btn-footer">
            <el-button type="primary" @click="setInfo()">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>         
        </div>
    </div>
</template>
<script>
import {getFollowup,confirmFollowup,upLoadFollowFile} from '@/api/personal/myusers'
import * as CodeMsg from "@/api/common/CodeChange"

export default {
  props:{
    userInfo:{ 
      type: Object,
      required : true
    },
  },
   data(){
      return{
        addForm: {
          followType:"",
          followContent:"",
          followTypeName:""        
      },
      rules:{
        followType: [{required: true, message: '请选择线跟进方式', trigger: 'change' }],   
        followContent: [{required: true, message: '请选择跟进内容', trigger: 'blur'}],
      },
      expireTimeOption: {
					disabledDate(date) {
			    //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
						return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
					}
				},    		    	
      followStyleList:[],
      fileList:[],
      dataList:[],
      dateData:false,      
   }
   },
   methods:{
     dateChange(val){
       if(val){
       this.dateData=true
       }
     },
     //up-loade操作
     OnChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
      if (existFile) {
        this.$message.error(file.name + "已经存在!");
        fileList.pop();
      }
      this.fileList = fileList;
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: fileList[i].name });
        var isLt2M = this.fileList[i].size / 1024 / 1024 < 20
        if (!isLt2M) {
          this.$message({
            message: "上传文件大小不能超过 20MB!",
            type: "warning",
            offset: 300
          });
          this.fileList.pop()
        }
        if(this.fileList[i].name.substring(0,this.fileList[i].name.lastIndexOf(".")).length>32){
          this.$message({
            message: "文件名不能超过32字",
            type: "warning",
            offset: 300
          });
          this.fileList.splice(this.fileList.indexOf(this.fileList[i]),1);
        }
      }
      this.fileName = this.unique(names);
    },
    unique(names) {
      const res = new Map();
      return names.filter(
        names => !res.has(names.name) && res.set(names.name, 1)
      );
    }, 
     beforeRemove(file, fileList) {
       return this.$confirm(`确定移除 ${file.name}？`, {
          cancelButtonClass: "btn-custom-cancel"
        });
      },
     handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择5个文件`);
      },
    cancel(){         
      this.$refs["addForm"].resetFields()  
      this.addForm = {
        
      }; 
      this.$emit("changeVisible");
    },
    setInfo(){
      this.followStyleList.forEach(item=>{
        if(this.addForm.followType == item.id){
          this.addForm.followTypeName = item.name
        }
      })
      let params = {
        files: null,
        nextFollowTime: null,
        userId: this.userInfo.userId,
        followTypeId: this.addForm.followType,
        followTypeName:this.addForm.followTypeName,
        followContent: this.addForm.followContent
      };
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          if (this.fileList.length > 0) {
            let para = new FormData();
            this.fileList.forEach(file => {
              para.append("multipartFiles",file.raw,file.name)
            });
            // 文件上传
            upLoadFollowFile(para).then(res=>{
              if(res.data.code == 0){
                params.files = res.data.data;
                this.submitFollow(params);
              }
            })
          }else{
            this.submitFollow(params);
          }
        }
      })
      if(this.dateData){
        params.nextFollowTime = this.$moment(this.addForm.followNext).format( "YYYY-MM-DD HH:mm");
      }
    },
    submitFollow(params){ 
      confirmFollowup(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type: "success",
            message: "跟进成功",
            offset: 300,
          })
          this.$emit("changeVisible",false)
        }else{
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
          this.$emit("changeVisible",false)
        }
      })
    },
    getDropData(){//获取下拉框数据
    let number = '15ea644a8fa2470b933e303dbc7fe19e'
      getFollowup(number).then(res=>{
        this.followStyleList = res.data.data[0].options;
        }).catch(err=>{
          return err;
        });
    },
   },
   mounted(){
     this.getDropData()
   },
   
}
</script>
<style scoped>
.content{
  width:500px
}
.btn-footer{
  text-align: right;
}
</style>
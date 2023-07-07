<template>
 <!-- <el-dialog :visible.sync="followVisible" :title="title" width="40%" >
      <follow-operate v-if="followVisible" @changeVisible="changeVisible" :createType=0 :userInfo="userInfo" :isCreate="isCreate" />
    </el-dialog>  -->
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
          type="date"
          :picker-options="expireTimeOption"
          placeholder="下次跟进时间"
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
import {getFollowup,comFollowup} from '@/api/personal/myusers'
import * as CodeMsg from "@/api/common/CodeChange"

export default {
  props:{
    userInfo:{

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
                return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
            }
        },    		    	
        followStyleList:[],
        fileList:[],
        dateData:false
     }
   },
   methods:{
     dateChange(val){
       if(val){
       this.dateData=true
       }
     },
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
      this.addForm = {}
      this.$emit("changeVisible");
    },
    setInfo(){
      console.log(this.userInfo,"duserInfo")
        this.followStyleList.forEach(item=>{
          if(item.id==this.addForm.followType){
            this.addForm.followTypeName=item.name
          }        
        })                         
        // console.log(this.addForm.followTypeName,"followupname")
       this.$refs["addForm"].validate(val=>{
        if(val){
        let params = new FormData();
         if (this.fileList.length > 0) {
         this.fileList.forEach(file => {
          params.append("files", file.raw, file.name);
          console.log(params,"params")
          console.log(file.raw,"params.file.raw")
        });
        }
        if(this.dateData){
          params.append("nextFollowTime",this.$moment(this.addForm.followNext).format( "YYYY-MM-DD HH:mm:ss"));

        }
      //  console.log(this.userInfo,"wode ")
        params.append("userId",this.userInfo.id);
        params.append("mobilephone", this.userInfo.accountNo);
        params.append("activityType", 0);
        params.append("userType",1);
        params.append("followTypeId",this.addForm.followType);
        params.append("followTypeName",this.addForm.followTypeName);
        params.append("followContent",this.addForm.followContent);      
        comFollowup(params).then(res=>{
          //  console.log(res)
          if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type: "success",
                message: "跟进成功",
                offset: 300,
              })
              this.$emit("changeVisible")
              }
        })
        }
       })
    },
     getDropData(){//获取下拉框数据
        
      let number = '15ea644a8fa2470b933e303dbc7fe19e'
        getFollowup(number).then(res=>{
          this.followStyleList = res.data.data[0].options;
          // console.log(this.followStyleList,"followup2")
          }).catch(err=>{
            return err;
          });
      }
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
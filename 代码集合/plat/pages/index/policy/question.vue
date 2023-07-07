<template>
  <div class="question_container">
    <div class="question_box">
      <div class="question_bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name:'index-policy-troubleshooting'}">{{$t('txt.troubleshooting')}}</el-breadcrumb-item>
            <el-breadcrumb-item >提问页面</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="question_content">
        <div class="question_son">
          <div class="question_title">
            <div class="question_txt_sty">
              <img src="~/assets/images/home/icon-quiz.png" alt="提问"/>
              <span>提问</span>
            </div>
            <div class="question_how_sty" @click="tipDialog=true">如何提问?</div>
          </div>
          <div class="question_form">
            <el-form :model="askForm" ref="askForm" :rules="askRules" label-width="110px">
              <el-form-item  prop="title">
                <el-input 
                  size="small" 
                  v-model.trim="askForm.title" 
                  placeholder="一句话完整的描述你的问题" 
                  maxlength="50" 
                  show-word-limit
                  class="title_sty"></el-input>
              </el-form-item>
              <el-form-item prop="detailContent">
                <el-input
                  type="textarea"
                  :rows="8"
                  placeholder="详细说明问题，以便更好的获得回答（选填）"
                  v-model.trim="askForm.detailContent"
                  maxlength="200" 
                  show-word-limit
                  class="content_sty">
                </el-input>
              </el-form-item>
              <div class="question_btn_box">
                <el-button type="primary" @click="submit()" class="question_btn">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog width="600px" top="180px" :visible.sync="tipDialog">
      <div class="tip_sty" v-for="item in textData" :key="item.id">
        <div :class="[item.id==2?'txts_sty':'txt_bold_sty']">{{item.title}}</div>
          <div v-if="item.attr" class="margin-bot">卧涛问答上的提问应遵循<span class="txts_sty">真实、完整、明确、简洁</span>的原则。
        </div>
        <ul :class="[item.id==1?'two':item.id==2?'three':'']">
         <li :class="[item.id==0?'first':item.id==1?'second':'third']" v-for="(citem,cindex) in item.content" :key="cindex">
          <span class="txt_bold_sty" v-if="item.id==0">{{citem.label}}</span>
          <img v-else :src="require('~/assets/images/'+citem.imgSrc)" alt>
          <span>{{citem.content}}</span>
         </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { saveQuestion } from '@/api/question'
import * as CodeMsg from "@/api/CodeChange"
import policyData from "@/pages/index/policy/policy_data";
export default {
  head() {
    return {
      title: "卧涛问答-提问页面",
      meta: [
        { name: "keywords", content: "卧涛问答" },
        {
          hid: "description",
          name: "description",
          content: "卧涛问答",
        },
      ],
    };
  },
  components: {

  },
  data () {
    return {
      askForm: {
        title: "",
        detailContent: ""
      },
      askRules:{
        title:[{required: true, message:'请输入你的问题',trigger:'change'}],
      },
      tipDialog: false,
      userId: '',
      textData: policyData.textData
    }
  },

  created () {
    
  },

  mounted () {
    if(localStorage.getItem('userInfo')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.userId = userInfo.userId
    }
  },

  methods: {
    showDialog(){
      this.tipDialog = true
    },
    // 表单提交
    submit(){
      this.$refs["askForm"].validate((valid) => {
        if(valid){
          let params = {
            title: this.askForm.title,
            description: this.askForm.detailContent,
            questionPort: 'PC',//提问端口(PC、APP、H5、APPLET)
            createBy: this.userId
          }
          saveQuestion(params).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                message: '提问成功',
                type: 'success',
                offset: 200,
                duration: 1500
              });
              this.$router.push({
                name: "index-policy-troubleshooting"
              });
            }else{
              if(res.data.code == 10002){
                this.$router.push("/login")
                sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
                return false
              }
              this.$message({
                message:res.data.msg,
                type: 'warning',
                offset: 200,
                duration: 1500
              });
            }
          })
        }
      })
    },
  }

}
</script>

<style scoped>
.question_container {
  display: flex;
  width: 100%;
  min-height: 680px;
  background: #eff2f3;
}
.question_box {
  margin: 0 auto;
  width: 1195px;
}
.question_bread {
  width: 100%;
  display: flex;
  background: #eff2f3;
  padding: 20px 0 18px 0;
}
.question_content {
  display: flex;
  width: 100%;
  height: 80%;
  border-radius: 5px;
  background: #ffffff;
  padding: 50px;
}
.question_son {
  margin: 0 auto;
  width: 799px;
  height: 100%;    
}
.question_title {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.question_txt_sty {
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  height: 21px;
}
.question_txt_sty>img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.question_txt_sty>span {
  display: inline-block;
  height: 16px;
  line-height: 16px;
  vertical-align: middle;
}
.question_how_sty {
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #36a6fe;
}
.question_how_sty:hover {
  cursor: pointer;
}
.question_form {
  width: 100%;
  margin-top: 13px;
  margin-left: -105px;
}
.title_sty>>> .el-input__inner{
  width: 799px;
  height: 50px;
  background: #ffffff;
  border: 1px solid #36a6fe;
  border-radius: 0;
}
.title_sty>>> .el-input__count{
  margin-right: -170px;
}
.content_sty>>> .el-textarea__inner{
  width: 799px;
  height: 229px;
  background: #ffffff;
  border: 1px solid #eaebef;
  border-radius: 0;
}
.content_sty>>> .el-input__count{
  margin-right: -112px;
  font-size: 14px;
  margin-bottom: -2px;
}
.question_btn_box {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-left: 110px;
}
.question_btn {
  width: 100px;
  height: 48px;
  background: #36a6fe;
  border-radius: 6px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #ffffff;
}
.tip_sty {
  padding: 10px 0 15px 25px;
}
.txt_sty {
  color: #555555;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-size: 14px;
}
.txts_sty {
  color: #333333;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-size: 14px;
}
.txt_bold_sty {
  color: #333333;
  font-weight: bold;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-size: 14px;
  margin-bottom: 10px;
}
.margin-bot {
  margin-bottom: 10px;
  color: #555555;
}
.first {
  list-style-type: disc;
  color: #555555;
  margin-left: -20px;
  padding: 3px;
}
.second {
  color: #555555;
  margin-top: 5px;
  margin-left: -38px;
}
.second>img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.second>span {
  display: inline-block;
  line-height: 16px;
  vertical-align: middle;
}
.third {
  color: #555555;
  margin-top: 5px;
  margin-left: -38px;
}
.third>img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.third>span {
  display: inline-block;
  line-height: 16px;
  vertical-align: middle;
}
</style>
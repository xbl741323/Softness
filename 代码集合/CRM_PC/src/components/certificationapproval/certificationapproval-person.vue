<template>
  <div class="page">
    <div class="contracts">
      <div class="details">
        <!-- 快照信息 -->
        <div class="top-detail">
          <div class="processnumber">
            <img src="../../assets/images/process/liucheng_icon.png" style="width: 24px; height: 24px; position: relative; top: 5px" />
            <span style="margin-left: 8px; font-weight: 600">个人认证审批</span>
          </div>
          <div class="detailno">{{detail.taskNo}}</div>
          <table class="table" style="margin-bottom: 30px">
            <tr><th>流程状态</th><th>用户ID</th><th>姓名</th><th>认证方式</th><th>认证来源</th><th>注册手机号</th><th>发起时间</th></tr>
            <tr>
              <td>
                <span v-show="detail.auditStatus == 0" class="circleBluec"></span>
                <span v-show="detail.auditStatus == 1" class="successc"><b>✔</b></span>
                <span v-show="detail.auditStatus == 2" class="circleRedc"></span>
                <span>{{ detail.auditStatus | filterStatus }}</span>
              </td>
              <td>{{ detail.userNo }}</td>
              <td>{{ detail.userName }}</td>
              <td> {{detail.authType | filterAuthType}}</td>
              <td>{{detail.authSource | filterAuthSource}}</td>
              <td>{{ detail.mobilPhone||detail.pwdMobilePhone}}</td>
              <td>{{ detail.gmtCreate}}</td>
            </tr>
          </table>
        </div>
         <!-- 信息验证 -->
        <div class="infocertification">
           <div class="list-header"><p class="rectangle"></p><b class="text">信息验证</b></div>
           <div class="info">
               <div class="flexbox"><div class="flexitem"> 用户数据</div><div class="flexitem boright">第三方反馈结果</div></div>
               <div class="flexbox"><div class="flexoneitem">姓名</div><div class="flextwoitem normal">{{detail.userName}}</div><div class="special"></div></div>
               <div class="flexbox"><div class="flexoneitem">身份证号</div><div class="flextwoitem normal">{{this.$route.query.person?detail.idCard:detail.encryptIdCard}}</div><div class="special" style="padding-top:18px;font-weight: normal;">{{detail.auditDesc}}</div></div>
               <div class="flexbox"><div class="flexoneitem">性别</div><div class="flextwoitem normal">{{detail.idCard?(detail.idCard.substr(detail.idCard.length-2,1)%2==0?'女':'男'):''}}</div><div class="special"></div></div>
               <div class="flexbox"><div class="flexoneitem bob">身份证有效期</div><div class="flextwoitem bob normal">{{detail.effectiveTime}}</div><div class="special bob"></div></div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApprovalDetail } from "@/api/processmanage/approval";
export default {
  data() {
    return {
      detail: {}  
    };
  },
  filters: {
    filterStatus(val) {
      if (val == "0") {
        return "待审核"
      } else if (val == "1") {
        return "已通过"
      } else if (val == "2") {
        return "未通过"
      }
    },
    filterOrgType(val){
      if(val==0){
          return '个人'
      }else if(val==1){
          return '企业'
      }else if(val==2){
          return '事业单位'
      }else if(val==3){
          return '高校'
      }else if(val==4){
          return '企业'
      }
    },
     filterAuthSource(val){
      if(val==0){
          return 'PC端'
      }else if(val==1){
          return '移动端'
      }else if(val==2){
          return '小程序'
      }
    },
    filterAuthType(val){
       if(val==0){
           return '支付宝'
       }else{
           return '阿里云'
       }
    },
  },
  mounted() {
    if (process.env.NODE_ENV === "production") {
        this.fileUrl = "//static.wotao.com/"
    } else {
        this.fileUrl = "//static-tst.wotao.com/"
    }  
    this.getDetail()
  },
  methods: {
    getDetail() {
        let param ={
            taskNo:this.$route.query.taskNo,
            isEncrypt:this.$route.query.person? false:true
        }
        getApprovalDetail(param).then((res) => {
                this.detail = res.data.data
        });
    },
  },
};
</script>
<style scoped>
.page {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.bottom-detail .el-tabs--border-card {
  background: #fff;
  border: 0;
  border-top: 0.1px solid #dcdfe6;
  box-shadow: 0 0 0 #fff;
}
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.contracts {
  margin-bottom: 0;
  background: #f6f7fa;
}
.record-top {
  margin-top: 10px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  background: #36a6fe;
  top: -2px;
  margin-right: 4px;
}
.circleRedc {
  width: 6px;
  height: 6px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  top: -2px;
  background: red;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 4px;
}
.details {
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail {
  background: #fff;
  padding-bottom: 15px;
}
.processnumber {
  font-weight: 300;
  margin-top: 10px;
  font-size: 20px;
  margin-left: -12px;
}
.top-detail tr {
  height: 30px;
  font-size: 14px;
  text-align: left;
}
.top-detail td {
  font-size: 14px;
  color: #333;
  width: 200px;
}
.top-detail th {
  padding-top: 25px;
}
.topBtn {
  padding: 25px;
}
.delete {
  margin-left: 30px;
}
.cell-blue {
  display: inline-block;
  color: #36a6fe;
  cursor: pointer;
  max-width: 140px;
}
.tabottom {
  margin-bottom: 50px;
}
.bottom-detail {
  margin-top: 16px;
  background: #fff;
}
.list-header {
  display: flex;
  margin: 0 0;
  align-items: center;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.process-record {
  background: #fff;
  margin-bottom: 30px;
}
.examine {
  margin-top: 16px;
  background: #fff;
  margin-bottom: 80px;
  font-size: 14px;
}
.examine-content {
  width: 100%;
  margin: 20px 0 0 15px;
  font-size: 14px;
}
.button {
  margin: 30px;
  text-align: center;
}
.unpassed {
  margin-left: 50px;
}
.showBottom {
  margin-bottom: 200px;
}
.achievecode:hover {
  background: #ffffff;
  color: #606266;
  border-color: #dcdfe6;
}
.ceshi {
  position: relative;
  left: 15px;
  top: -4px;
}
.aaa >>> .el-table th > .cell {
  text-align: center;
}

.aaa >>> .el-table .cell {
  text-align: center;
}
.record-top >>> .el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 115%;
  border-left: 2px solid #e4e7ed;
}
.err{
    color: red;
    font-size: 16px;
    position: relative;
    top: 1px;
}
.signing-spa {
  display: inline-block;
  color: #2c3e50;
  font-weight: bold;
  padding-left: 6px;
  border-left: #3e84df 3px solid;
  margin-top: 6.5px;
}
.bor {
  width: 100%;
  height: 1px;
  background-color: #dddddd45;
  margin-top: 10px;
}
.mt{
   margin-top: 20px; 
}
.detailno{
    margin: 15px 0 0 20px;
}
.page >>> .el-dialog{
    padding-left: 12px;
}
.page >>> .el-dialog__body{
    padding-top: 10px !important;
}
.infocertification{
    padding-bottom: 20px;
}
.info{
    padding: 15px 15px;
    position: relative;
}
.flexbox{
    display: flex;
    font-weight: bold;
}
.flexitem{
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    background-color: rgb(250, 250, 250);
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
}
.flexoneitem{
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
}
.flextwoitem{
    width: calc(50% - 150px);
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
}
.special{
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-left: 1px solid rgb(242, 242, 242);
    border-right: 1px solid rgb(242, 242, 242);
}
.bob{
    border-bottom: 1px solid rgb(242, 242, 242);
}
.normal{
    font-weight:normal
}
.boright{
    border-right: 1px solid rgb(242, 242, 242);
    border-bottom: 1px solid rgb(242, 242, 242);
}
.result{
    position: absolute;
    top: 55%;
    left: 68%;
}
</style>

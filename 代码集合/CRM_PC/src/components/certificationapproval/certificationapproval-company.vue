<template>
  <div class="page">
    <div class="contracts">
      <div class="details">
        <!-- 快照信息 -->
        <div class="top-detail">
          <div class="processnumber">
            <img src="../../assets/images/process/liucheng_icon.png" style="width: 24px; height: 24px; position: relative; top: 5px" />
            <span style="margin-left: 8px; font-weight: 600">单位认证审批</span>
          </div>
          <div class="detailno">{{detail.taskNo}}</div>
          <table class="table" style="margin-bottom: 30px">
            <tr><th>流程状态</th><th>用户ID</th><th class="specialwidth">单位名称</th><th>单位类型</th><th>联系人姓名</th><th>注册手机号</th><th>认证来源</th><th>发起时间</th></tr>
            <tr>
              <td>
                <span v-show="detail.auditStatus == 0" class="circleBluec"></span>
                <span v-show="detail.auditStatus == 1" class="successc"><b>✔</b></span>
                <span v-show="detail.auditStatus == 2" class="circleRedc"></span>
                <span>{{ detail.auditStatus | filterStatus }}</span>
              </td>
              <td>{{ detail.userNo }}</td>
              <td>{{ detail.orgName}}</td>
              <td class="specialwidth">{{detail.orgTypeName }}</td>
              <td>{{detail.userName}}</td>
              <td>{{ detail.mobilPhone||detail.pwdMobilePhone}}</td>
              <td>{{detail.authSource | filterAuthSource}}</td>
              <td>{{ detail.gmtCreate}}</td>
            </tr>
          </table>
        </div>
         <!-- 信息验证 -->
        <div class="infocertification">
           <div class="list-header"><p class="rectangle"></p><b class="text">信息验证</b></div>
           <div class="getdata" v-show="showGet" @click="getData">获取第三方最新数据</div>
           <div class="info">
               <div class="flexbox"><div class="flexitem">用户提交数据</div><div class="flexitem boright">第三方数据&nbsp;&nbsp;&nbsp;<span class="normal">{{thirdParty.createTime?'上次获取：':''}}{{thirdParty.createTime}}</span></div></div>
               <div class="flexbox"><div class="flexoneitem">单位名称</div><div class="flextwoitem normal">{{ detail.orgName}}</div><div class="special">{{thirdParty.orgName}}</div></div>
               <div class="flexbox"><div class="flexoneitem">统一社会信用代码</div><div class="flextwoitem normal">{{detail.creditCode}}</div><div class="special">{{thirdParty.creditCode}}</div></div>
               <div class="flexbox"><div class="flexoneitem">企业状态</div><div class="flextwoitem normal">{{thirdParty.orgStatus}}</div><div class="special">{{thirdParty.orgStatus}}</div></div>
               <div class="flexbox"><div class="flexoneitem">法人</div><div class="flextwoitem normal">{{detail.cfoName}}</div><div class="special">{{thirdParty.legalPerson}}</div></div>
               <div class="flexbox"><div class="flexthreeitem"><div>营业执照</div><div class="normal">{{onepreviewUrl.indexOf('pdf')==-1?'（点击图片查看大图）':'（点击链接查看PDF）'}}</div></div>
                    <div v-if="onepreviewUrl.indexOf('pdf')==-1" class="flexfouritem normal showcur">
                        <el-image  class="imgwid" :src="onepreviewUrl" :preview-src-list="onepreviewList" @click.stop="handleClickItem" ></el-image>
                    </div>
                    <div v-else class="flexfouritem normal showcur">
                         <a :href="onesrc" target="_blank" class="filecol">{{detail.orgName}}</a>
                    </div>
                    <div class="specialy">/</div>
               </div>
               <div class="flexbox">
                    <div class="flexthreeitem bob"><div>公函</div><div class="normal">{{twopreviewUrl.indexOf('pdf')==-1?'（点击图片查看大图）':'（点击链接查看PDF）'}}</div></div>
                      <div v-if="twopreviewUrl.indexOf('pdf')==-1"  class="flexfouritem bob normal showcur">
                         <el-image  class="imgwid" :src="twopreviewUrl" :preview-src-list="twopreviewList" @click.stop="handleClickItem"></el-image>
                      </div>
                      <div v-else class="flexfouritem bob normal showcur">
                          <a :href="twosrc" target="_blank" class="filecol">{{detail.orgName}}</a>
                           <!-- <pdf :src="twosrc" :class="{'pdfpreview':twoPreview==true}"></pdf> -->
                      </div>
                    <div class="specially">/</div>
               </div>
           </div>
        </div>
        <!-- 审核记录 -->
        <div class="process-record" v-if="recordData.length > 0">
          <div class="list-header"><p class="rectangle"></p><b class="text">审核记录</b></div>
          <div class="record-top">
            <el-timeline v-if="recordData.length > 0">
              <el-timeline-item v-for="(element, index) in recordData" :key="index" :color="index == 0 ? '#ff6600' : ''" placement="top" hide-timestamp>
                <p>{{ element.auditStatus | filterStatusText }}</p>
                <el-tooltip v-if="element.userType==1" effect="dark" :content="'工号：' +element.jobNumber +'  部门：' +element.departName" placement="right">
                  <span> 操作人：{{ element.operatorName ? element.operatorName : "暂无"}}</span>
                </el-tooltip>
                <span v-if="element.userType==0"> 操作人：{{ element.submitterNo ? element.submitterNo : "暂无"}}</span>
                <p v-if="element.auditStatus==2">原因：{{ element.auditDesc}}</p>
                <p>{{ element.gmtCreate }}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- 单位认证审批 -->
        <div class="examine" v-if="detail.auditStatus==0">
          <div class="list-header"><p class="rectangle"></p><b class="text">审批</b></div>
          <div class="examine-content">
            <div class="button">
                <el-button type="success" size="medium" v-preventReClick  @click="permissions.sys_auth_audit || isPersonal ? handlePass() : $notAuthorized()">审核通过</el-button>
                <el-button type="danger" size="medium" class="unpassed" v-preventReClick  @click="permissions.sys_auth_audit || isPersonal ? dialogVisible=true : $notAuthorized()">审核不通过</el-button>
            </div>
          </div>
        </div>
        <el-dialog title="选择不通过原因" :visible.sync="dialogVisible" v-if="dialogVisible" :before-close="handleClose" :close-on-click-modal=false width="22%" style="padding-left:15px">
            <div v-for="(item,index) in reasonOptions" :key="index" style="margin-top:13px">
                <el-radio :label="item.label" v-model="reason">{{item.value}}</el-radio>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-preventReClick  @click="handleUnpass">确 定</el-button>
                <el-button @click="dialogVisible = false;reason='单位名称有误'">取 消</el-button>
            </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import pdf from 'vue-pdf'
import * as CodeMsg from "@/api/common/CodeChange"
import moment from 'moment'
import { getApprovalDetail,getQichacha,getHistoryQichacha,audit,getRecord } from "@/api/processmanage/approval";
import { mapGetters } from 'vuex';
export default {
  components:{
    // pdf
  },  
  data() {
    return {
      baseUrl:process.env.VUE_APP_IMAGE_BASEURL,   
      onesrc:'',
      onepreviewUrl: '',
      onepreviewList: [],
      twosrc:'',
      twopreviewUrl: '',
      twopreviewList: [],
      onePreview:false,
      twoPreview:false,
      detail: {},          
      recordData: [],
      dialogVisible:false,
      reasonOptions:[
          {label:'单位名称有误',value:'单位名称有误'},
          {label:'统一社会信用代码有误',value:'统一社会信用代码有误'},
          {label:'企业状态异常',value:'企业状态异常'},
          {label:'营业执照有效期不足三个月',value:'营业执照有效期不足三个月'},
          {label:'法人姓名错误',value:'法人姓名错误'},
          {label:'营业执照照片有误或不合规',value:'营业执照照片有误或不合规'},
          {label:'公函有误或不合规',value:'公函有误或不合规'},
          {label:'该实名认证用户已存在',value:'该实名认证用户已存在'},
      ],
      reason:'单位名称有误',
      thirdParty:{},
      showGet:false,
      isPersonal: this.$route.query.source == 'personal',
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
     filterStatusText(val) {
      if (val == "0") {
        return "提交审核"
      } else if (val == "1") {
        return "审核通过"
      } else if (val == "2") {
        return "审核不通过"
      }
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
     this.getDetail()
  },
  methods: {  
    handleClickItem(){
        // 获取遮罩层dom
        setTimeout(function(){
          let domImageMask = document.querySelector(".el-image-viewer__wrapper");
          if (!domImageMask) {
            return;
          }
          domImageMask.addEventListener("click", (e) => {
            if(e.target.parentNode.className == 'el-image-viewer__actions__inner') {
              return;  //如果点击底部菜单，不关闭
            }
            // 点击遮罩层时调用关闭按钮的 click 事件
            document.querySelector(".el-image-viewer__close").click();
          });
        },300)
     },
    getDetail() {
      let param ={
          taskNo:this.$route.query.taskNo,
          isEncrypt:this.$route.query.person? false:true
      }
      getApprovalDetail(param).then((res) => {
            let data = res.data.data
            this.detail = data
            this.showGet = false
            if(data.businessLicenseUrl){
               this.onepreviewUrl =this.baseUrl+ data.businessLicenseUrl
               this.onepreviewList.push(this.baseUrl+data.businessLicenseUrl)
               this.onesrc = this.baseUrl+ data.businessLicenseUrl
            }
            if(data.officialLetterUrl){
               this.twopreviewUrl = this.baseUrl+ data.officialLetterUrl
               this.twopreviewList.push(this.baseUrl+data.officialLetterUrl)
               this.twosrc = this.baseUrl+ data.officialLetterUrl
            //    this.twosrc = 'http://static-tst.wotao.com/filebase/contract/c2733e26655448f0ad07ce98a33217c6/20210923191858.pdf'
            }
            let newparam ={  taskNo:this.$route.query.taskNo }
            // 历史企查查数据
            getHistoryQichacha(newparam).then(res=>{
                if(res.data.code == CodeMsg.CODE_0 && res.data.data &&res.data.data.createTime){
                    this.thirdParty = res.data.data
                    let currentTime = moment(new Date().getTime()).format('YYYY-MM-DD hh:mm:ss')
                    if(moment(currentTime).diff(moment(res.data.data.createTime),'days')>=7 && this.detail.auditStatus==0){
                        this.showGet = true
                    }else{
                        this.showGet = false
                    }
                }else{
                    if(this.detail.auditStatus==0){
                        this.showGet = true
                    }else{
                        this.showGet = false
                    }
                }
            })
            // 审核记录
            getRecord(newparam).then(res=>{
                this.recordData = res.data.data
            })
      });
  
    },
     // 获取第三方数据
    getData(){
       let param = {
           taskNo:this.$route.query.taskNo,
           orgName:this.detail.orgName
       }
       getQichacha(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
                this.thirdParty = res.data.data
                this.getDetail()
            }else{
                this.$message({
                    type: "error",
                    message: res.data.msg
                });
            }
       })
    },
    //审核通过
    handlePass() {
      let param = {
         taskNo:this.$route.query.taskNo,
         userType:1,
         auditStatus:1,
         auditDesc:null
      }
      audit(param).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "审核通过!"
          });
          this.getDetail()
        }else if(res.data.code == CodeMsg.CODE_1){
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    handleClose(){
        this.dialogVisible = false
        this.reason='单位名称有误'
    },
    // 审核不通过
    handleUnpass() {
         this.dialogVisible = false
         let param = {
            taskNo:this.$route.query.taskNo,
            userType:1,
            auditStatus:2,
            auditDesc:this.reason
        }
        audit(param).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
                type: "success",
                message: "审核不通过!"
            });
            this.getDetail()
            }else if(res.data.code == CodeMsg.CODE_1){
            this.$message({
                type: "error",
                message: res.data.msg,
            });
            }
             this.reason='单位名称有误'
        });
    }
  },
};
</script>
<style scoped>
.onepreview{
    transform: scale(3.8) !important;
    position: relative;
    left: 26.5%;
    z-index: 99999;
}
.twopreview{
    transform: scale(3.8) !important;
    position: relative;
    left: 26.5%;
    z-index: 99999;
}

.pdfpreview{
    position: relative;
    top: -450px;
    left: 10%;
    z-index: 99999;
}
.page >>> canvas {
  width: 210px !important;  
  height: 139px !important;
  OBJECT-FIT: none;
}
.page .showcur .pdfpreview >>> canvas{
  width: 710px !important;  
  height: 880px !important;
  border: 1px solid #c0c4cc94;
  OBJECT-FIT: none;
}
.imgwid{
    width: 210px; 
    height: 139px;
    object-fit: cover;
}
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
.getdata{
    border-width: 0px;
    width: 150px;
    height: 40px;
    background-color: rgba(0, 204, 153, 1);
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 13px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    margin-left: 15px;
}
.info{
    padding: 20px 15px;
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
.flexthreeitem{
    width: 150px;
    height: 160px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
    padding-top: 60px;
}
.flexfouritem{
    font-size: 0;
    line-height: 0;
    width: calc(50% - 150px);
    height: 160px;
    line-height: 160px;
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
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
    border-right: 1px solid rgb(242, 242, 242);
    color: #333333;
    font-weight: normal;
}
.specialy{
    width: 50%;
    height: 160px;
    line-height: 160px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
    border-right: 1px solid rgb(242, 242, 242);
}
.specially{
    width: 50%;
    height: 160px;
    line-height: 160px;
    text-align: center;
    color: #333333;
    font-size: 12px;
    border-top: 1px solid rgb(242, 242, 242);
    border-left: 1px solid rgb(242, 242, 242);
    border-right: 1px solid rgb(242, 242, 242);
    border-bottom: 1px solid rgb(242, 242, 242);
}
.boright{
    border-right: 1px solid rgb(242, 242, 242);
}
.bob{
    border-bottom: 1px solid rgb(242, 242, 242);
}
.normal{
    font-weight:normal
}
.pdf_frame{
    position :relative;
    width :230px;
    height :180px;
    border :1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
}
.pdf{
      width :56%;
      margin :0 auto;
    }
.showcur{
    padding-top: 10px;
}
.filecol{
    color: #0099ff;
    cursor: pointer;
}
.specialwidth{
    width: 320px;
}
</style>

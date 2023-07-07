<template>
    <div class="user_detail">
      <div class="detail-cont">
        <h3>用户详情</h3>
        <div class="staff_detail">
          <div class="detail-left">
            <div class="left-header">
              <div class="left-header-logo">
                <img v-if="logoUrl" :src="imgBaseUrl + logoUrl" alt="">
                <img v-else src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=249589786,2941481629&fm=26&gp=0.jpg" alt />
              </div>
              <p class="detail_align_sty">
                <span v-if="userData.accountType==0">
                  <img v-if="userData.auditStatus=='1'" :src="require('@/assets/images/new-client/certified_unit.png')" class="certified_solo_sty" alt="">
                  <el-tooltip effect="dark" :content="userData.accountSubject" placement="right">
                    <span class="over-sty">{{userData.accountSubject}}</span>
                  </el-tooltip>
                </span>
               <span v-if="userData.accountType==1">
                  <img v-if="userData.auditStatus=='1'" :src="require('@/assets/images/new-client/certified_unit.png')" class="certified_sty" alt="">
                  <el-tooltip effect="dark" :content="userData.accountSubject" placement="right">
                    <span class="over-sty" v-if="userData.accountSubject">{{userData.accountSubject}}</span>
                    <span class="over-sty" v-else>{{basicData.userNo}}</span>
                  </el-tooltip>
               </span>
              </p>
            </div>
            <div class="left-info">
              <p>
                <span>用&nbsp;&nbsp;户&nbsp;&nbsp;ID：</span>{{basicData.userNo}}
                <span v-if="userData.loginStatus=='1'"><el-radio v-model="radio" label="1">在线</el-radio></span>
                <span v-else><el-radio disabled v-model="radio" label="2">离线</el-radio></span>
              </p>
              <p><span>账号类型：</span>{{userData.accountType | accountTypeChange}}</p>
              <p v-if="memberInfo"><span>会员级别：</span>{{memberInfo.levelType | memberChange}}</p>
              <p v-else>会员级别: 暂无数据</p>
              <p v-if="userData.accountType==1"><span>联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span><span>{{basicData.name|noDatas}}</span></p>
              <p v-if="userData.accountType==1">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务：<span v-if="basicData.job">{{basicData.job}}</span><span v-else>暂无数据</span></p>
              <p><span>手&nbsp;&nbsp;机&nbsp;&nbsp;号：</span>{{userData.accountNo}}</p>
              <p><span>注册时间：</span>{{userData.registTime}}</p>
              <p><span>最近登录：</span>{{userData.lastLoginTime}}</p>
            </div>
          </div>
          <div class="detail-right">
              <!-- 用户信息头部 -->
              <div>
                <div class="staff_header">                  
                  <div class="header_right">
                      <div class="right_header">
                        <h3 style="margin:14px 0 14px 0;">{{userData.accountSubject}}</h3>                                              
                      </div>
                      <div class="right_content">
                         <div class="content-items">
                            <p class="com_p_sty">线索状态</p>                            
                              <span v-if="userData.customerStatus!=null" class="tes">
                                <i class="cirg" v-if="userData.isNetworkDept==true"></i>{{ userData.customerStatus}}
                              </span>
                              <span v-else class="tes">
                                <i class="cirg" v-if="userData.isDeptNetworkDept==true"></i>{{ userData.deptCustomerStatus}}
                                <span v-if="userData.deptCustomerStatus!=null && userData.personalCustomerStatus!=null">/&nbsp;</span>
                                <i class="cirg" v-if="userData.isPersonalNetworkDept==true"></i>{{ userData.personalCustomerStatus}}
                              </span>
                          </div>
                          <div class="content-items">
                            <p class="com_p_sty">客服</p>
                            <div class="disbale_content">
                            <span v-if="userData.customerNo!=null">
                            <el-tooltip effect="dark" :content="'工号：'+userData.customerNo+'   部门：'+userData.deptName" placement="right">
                            <span>{{ userData.customerName }}</span>
                            </el-tooltip>
                            </span>
                            <span v-else>暂无数据</span>
                            <img v-if="userData.customerLockFlag!==null&&userData.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
                            </div>
                          </div>
                          <div class="content-items">
                            <p class="com_p_sty">推广归属</p>
                            <div class="disbale_content">
                            <span v-if="userData.userBelongNo!=null">
                            <el-tooltip effect="dark" :content="'工号：'+userData.userBelongNo+'   部门：'+userData.userBelongDeptName" placement="right">
                            <span>{{ userData.userBelongName }}</span>
                            </el-tooltip>
                            </span>
                            <span v-else>暂无数据</span>
                            <img v-if="userData.userBelongLockFlag!==null&&userData.userBelongLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
                            </div>
                          </div>
                          <div class="content-items">
                            <p class="com_p_sty">业务员</p>
                            <div class="disbale_content">
                              <span v-if="userData.saleBelongNo!=null">
                              <el-tooltip effect="dark" :content="'工号：'+userData.saleBelongNo+'   部门：'+userData.saleBelongDeptName" placement="right">
                              <span>{{ userData.saleBelongName }}</span>
                              </el-tooltip>
                            </span>
                            <span v-else>暂无数据</span>
                            <img v-if="userData.saleBelongLockFlag!==null&&userData.saleBelongLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
                            </div>
                          </div>
                          <div class="content-items">
                            <p class="com_p_sty">最近用户跟进</p>
                            <span v-if="userData.userFollowTime!==null">{{ userData.userFollowTime }}</span>
                            <span v-else>暂无数据</span>
                          </div>
                          <div class="content-items">
                            <p class="com_p_sty">最近客户跟进</p>
                            <span v-if="userData.clueFollowTime!==null">{{ userData.clueFollowTime }}</span>
                            <span v-else>暂无数据</span>
                          </div>
                      </div>
                  </div>
                  <div class="header_button">
                      <el-button type="primary" @click="handleTransfer()">用户分配</el-button>
                  </div>
              </div>
              <!-- 备注 -->
              <div class="remark_content">
                <div class="remark_desc_title">
                 <span>备注</span>
                 <i class="el-icon-edit pointer_sty_clue" @click="remarkDialog = true"></i>
                </div>
                <div class="remark_sty" v-if="userData.accountRemark!==null&&userData.accountRemark!==''">
                   {{ userData.accountRemark }}
                </div>
                <div class="remark_sty" v-else>{{ $t("message.noData") }}</div>
              </div>
              </div>
              <!-- 备注dialog -->
              <el-dialog :visible.sync="remarkDialog" :close-on-click-modal="false" :before-close="remarkCancel">
               <el-form>
                <el-form-item label="备注：">
                 <el-input type="textarea" show-word-limit maxlength="500" v-model="userData.accountRemark" :autosize="{ minRows: 10,}"></el-input>
                </el-form-item>
               </el-form>
              <div class="remark_clue_sty">
               <el-button size="medium" type="primary" @click="remarkSubmit()">确定</el-button>
               <el-button size="medium" class="remark_btn_left" @click="remarkCancel()">取消</el-button>
              </div>
              </el-dialog>
              <!-- 切换显示不同数据 -->
              <div class="user_content">
                  <el-tabs v-model="activeName" class="user_tab">
                      <!-- 活动记录 -->
                      <el-tab-pane :label="$t('message.handleRecords')" name="third"></el-tab-pane>
                      <!-- 用户信息 -->
                      <el-tab-pane :label="$t('message.registInfo')" name="first"></el-tab-pane>
                      <!-- 订单记录 -->
                      <el-tab-pane label="订单记录" name="four"></el-tab-pane>
                      <!-- 用户数据 -->
                      <el-tab-pane :label="$t('message.userLogs')" name="second"></el-tab-pane>                  
                  </el-tabs>
                  <act-record :id="userData.id" :userData="userData" ref="records" v-if="activeName=='third'"></act-record>
                  <basic-detail v-if="activeName=='first'" :userData="userData" :innerInfo='basicData' :unitVO="unitVO" :type="0" :clueOrganization="clueOrganization"></basic-detail>
                  <user-logs v-if="activeName=='second'" :encrypted="encrypted" ref="logs" :userNo="basicData.userNo"></user-logs>
                  <order-records v-if="activeName=='four'" :source="'personal'"></order-records>
              </div>
          </div>
        </div>
      </div>
      <!-- 用户分配 -->
      <el-dialog title="用户分配" :visible.sync="transferVisible" :before-close="handleClose"  :close-on-click-modal="false" width="23%" >
      <el-form :model="clueForm" ref="clueForm" :rules="rules" inline label-width="140px" v-loading="allotLoading">
        <el-form-item label="请选择客服：">
          <el-select v-model="clueForm.service" placeholder="请选择" @change="handleChange">
            <el-option
              v-for="(item,index) in customerList"
              :disabled="serviceDisabled"
              :key="index"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择推广归属：">
          <el-cascader :disabled="userDisabled" filterable :show-all-levels='false' ref="userBelong" v-model="clueForm.userBelong" :options="empList" @change="handleUserBelongChange"></el-cascader>
        </el-form-item>
        <el-form-item label="请选择业务员：">
          <el-cascader :disabled="salesDisabled" filterable :show-all-levels='false' ref="salesMan" v-model="clueForm.salesMan" :options="empList" @change="handleSalesManChange"></el-cascader>
        </el-form-item>
        </el-form>
        <div class="allot-btn-contain">
          <el-button :disabled="!latestSelectStatus" style="margin-right:60px;" type="primary" @click="comTransf">{{ $t("button.confirm") }}</el-button >
          <el-button  @click="transfCancle">{{ $t("button.cancel") }}</el-button  >
        </div>   
    </el-dialog>
  </div>
</template>

<script>
import { judgeStatus }from "@/util/userAllot"
import { transferUsers, getMyAccountDetail,editUserRemark } from "@/api/personal/myusers";
import orderRecords from "@/components/user/common/orderRecords"
import basicDetail from "@/components/user/basicDetail";
import actRecord from "@/components/personal/my-users/act-record";
import * as CodeMsg from "@/api/common/CodeChange"
import userLogs from "@/components/user/userLogs";
import { getEmpList,getCustomerList } from "@/api/clue/clue";
export default {
  components: {
    basicDetail,
    actRecord,
    userLogs,
    orderRecords
  },
  data() {
    return {
      allotLoading:false,
      customerList:[],
      latestSelectStatus:false,
      serviceDisabled:false,
      userDisabled:false,
      salesDisabled:false,
      serviceObj: {},
      userBelongObj:{},
      salesManObj:{},
      clueForm: {
        service: "",
        userBelong:"",
        salesMan:""
      },
      baseUrl: process.env.BASE_URL,
      remarkDialog:false,
      clueOrganization:{}, // 单位信息
      empList: [],
      rules: {
        service: [{ required: true, message: "请选择客服", trigger: "change" }],
        userBelong: [{ required: true, message: "请选择推广归属", trigger: "change" }],
        salesMan: [{ required: true, message: "请选择业务员", trigger: "change" }],
      },
      transferVisible: false,
      activeName: "third",
      accountId: "",
      userData: {},
      basicData: {},
      unitVO: {},
      memberInfo: {},
      imgBaseUrl:
        process.env.NODE_ENV === "production"
          ? "//static.wotao.com/"
          : "//static-tst.wotao.com/",
      encrypted: 0,
      logoUrl: null,
      radio: "1",
    };
  },
  filters: {
    noDatas(val) {
      if (val == null || val == "") {
        return "暂无数据";
      } else {
        return val;
      }
    },
    memberChange(value) {
      if (value === "0") {
        var levelType = "普通会员";
      } else {
        var levelType = "未知等级";
      }
      return levelType;
    },
    accountTypeChange(value) {
      if (value == 0) {
        var accountType = "个人";
      } else if (value == 1) {
        var accountType = "单位";
      } else {
        var accountType = "未知";
      }
      return accountType;
    },
  },
  methods: {
    remarkSubmit(){
      let params = {
        id:this.userData.id,
        accountRemark: this.userData.accountRemark,
      }
      editUserRemark(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
           this.$message({
             type:'success',
             message:"修改成功！",
             offset:300
           })
           this.remarkDialog = false
           this.getData()
         }
      })
    },
    remarkCancel(){
      this.remarkDialog = false
      this.getData()
    },
    //分配按钮
    handleTransfer() {
      this.serviceDisabled = false,
      this.userDisabled = false,
      this.salesDisabled = false,
      this.clueForm.service = "";
      this.clueForm.userBelong = "";
      this.clueForm.salesMan = "";
      this.transferVisible = true;
      this.latestSelectStatus = false
      if(this.userData.customerCascadeView!==null&&this.userData.customerCascadeView.length>0){
          this.latestSelectStatus = true
          this.clueForm.service = this.userData.customerCascadeView.length>0? Number(this.userData.customerCascadeView[0]):"";
      }
      if(this.userData.userCascadeView!==null&&this.userData.userCascadeView.length>0){
           this.latestSelectStatus = true
           this.clueForm.userBelong = this.userData.userCascadeView;
      }
      if(this.userData.saleCascadeView!==null&&this.userData.saleCascadeView.length>0){
           this.latestSelectStatus = true
           this.clueForm.salesMan = this.userData.saleCascadeView;
      }
      this.allotTranslate(this.userData);
    },
    transfCancle() {
      this.$refs["clueForm"].resetFields();
      this.transferVisible = false;
    },
    allotTranslate(row){
      let obj = judgeStatus(row);
      this.serviceDisabled = obj.serviceDisabled
      this.userDisabled = obj.userDisabled
      this.salesDisabled = obj.salesDisabled
      console.log(obj)
    },
    //确定分配操作
    comTransf() {
      this.$refs["clueForm"].validate((val) => {
        if (val) {
          this.allotLoading = true
          let params = {
            userNo: this.$route.query.loginEmpNo,
            deptId: this.serviceObj.deptId,
            deptName: this.serviceObj.departName,
            deptNumber: this.serviceObj.deptNumber,
            customerId: this.serviceObj.userId,
            customerName: this.serviceObj.name,
            customerNo: this.serviceObj.number,
            userBelongName:this.userBelongObj.customerName,
            userBelongNo:this.userBelongObj.customerNo,
            userBelongDeptName:this.userBelongObj.customerDeptName,
            saleBelongNo:this.salesManObj.customerNo,
            saleBelongName:this.salesManObj.customerName,
            saleBelongDeptName:this.salesManObj.customerDeptName,
            customerCascadeView: this.clueForm.service!==""?this.clueForm.service :"",
            userCascadeView: this.clueForm.userBelong!==""?this.clueForm.userBelong.join(","):"",
            saleCascadeView: this.clueForm.salesMan!==""?this.clueForm.salesMan.join(","):"",
            accountVOS: [this.userData],
          };
          transferUsers(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "分配成功！",
                offset: 300,
              });
              this.serviceObj = {}
              this.userBelongObj = {}
              this.salesManObj = {}
              this.transferVisible = false;
              this.allotLoading = false
              this.$router.push("/personal/my-users");
            }
          });
        }
      });
    },
    // 选择网络客服
    handleChange(value) {
      this.serviceObj = {};
      this.customerList.forEach(item=>{
        if(item.userId == value){
          this.serviceObj = item
          this.latestSelectStatus = true
        }
      })
    },
    // 选择用户归属
    handleUserBelongChange(value) {
      this.userBelongObj = {};
      this.$nextTick(() => {
        this.userBelongObj = this.$refs["userBelong"].getCheckedNodes()[0].data;
        this.userBelongObj.deptName = this.userBelongObj.customerDeptName;
        this.latestSelectStatus = true
      });
    },
    // 选择业务员
    handleSalesManChange(value) {
      this.salesManObj = {};
      this.$nextTick(() => {
        this.salesManObj = this.$refs["salesMan"].getCheckedNodes()[0].data;
        this.salesManObj.deptName = this.salesManObj.customerDeptName;
        this.latestSelectStatus = true
      });
    },
    handleClose() {
      this.transferVisible = false;
    },
    // 获取用户信息
    getData() {
      getMyAccountDetail(this.accountId)
        .then((res) => {
          this.userData = res.data.data;
          this.basicData = res.data.data.userVO;
          this.clueForm.service = this.userData.customerCascadeView;
          if(res.data.data.userVO.unitVO!==null){
            this.unitVO = res.data.data.userVO.unitVO;
            if(this.unitVO.unitOrganization!==null){
              this.clueOrganization = this.unitVO.unitOrganization
            }
          }
          this.memberInfo = res.data.data.member;
          if (this.userData.accountType == 0) {
            this.logoUrl = this.basicData.expertVO.portraitUrl;
          } else {
            if(res.data.data.userVO.unitVO!==null){
              this.logoUrl = this.basicData.unitVO.orgLogoUrl;
            }
          }
        })
    },
    getDropData() {
      getCustomerList().then((res) => {
        this.customerList = res.data.data
      });
      getEmpList().then((res) => {
        this.empList = res.data.data;
      });
    },
  },
  created() {
    this.accountId = this.$route.query.id;
  },
  mounted() {
    this.getDropData();
    this.getData();
  },
};
</script>

<style scoped>
.user_detail {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 0;
}
.allot-btn-contain {
  margin-top: 25px;
  display: flex;
  justify-content: center;
}
.clue_greensty {
  display: flex;
}
.clue_redsty {
  display: flex;
}
.circleGreen {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: green;
  margin-top: 7px;
  margin-right: 4px !important;
}
.circleRed {
  background: red;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 7px;
  margin-right: 4px !important;
}
.margin-right {
  margin-left: 70%;
  margin-top: 120px;
}
.margin-left {
  margin-left: 30px;
  margin-bottom: 10px;
}
.detail-cont {
  width: 90%;
  margin-left: 3%;
}
.staff_detail {
  padding-bottom: 200px;
  display: flex;
}
.detail-left {
  width: 240px;
  border: 1px solid #eee;
}
.detail-right {
  width: 70%;
  margin-left: 20px;
  border: 1px solid #eee;
  flex: 1;
}
.staff_header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 7px 14px 0px 30px;
}
.left-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 159px;
  margin-top: 30px;
  border-bottom: 2px solid #e4e7ed;
}
.left-header p {
  text-align: center;
}
.left-header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.left-header-logo img {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border: 1px solid #ccc;
}
.left-info {
  margin: 20px 20px 0 20px;
}
.left-info p {
  font-size: 13px;
  line-height: 20px;
}
.left-info p > span:nth-of-type(1) {
  display: inline-block;
  text-align: left;
  width: 66px;
}
.header_right {
  flex: 1;
}
.right_header h3 {
  color: #333;
  display: flex;
  font-size: 20px;
}
.right_header > span:nth-of-type(1) {
  font-weight: bold;
  font-size: 14px;
}
.right_header > span:nth-of-type(2) {
  margin-left: 25px;
  font-size: 14px;
}
.right_content {
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  margin-right: 20px;
}
.content-items {
  max-width: 200px;
  margin-right: 50px;
  font-size: 14px !important;
}
.content-items span{
  color: #666666;
}
.content-items p:first-child {
  font-size: 14px;
  font-weight: bold;
}
.content-items p:last-child {
  font-size: 14px;
}
.header_button {
  margin-right: 60px;
}
.right_footer {
  margin-top: 8px;
  font-size: 14px;
}
.right_footer span {
  margin-right: 5px;
}
.cirg {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: green;
  position: relative;
  top: -1px;
  left: -2px;
}
.tes {
  font-size: 14px;
  position: relative;
}
.remark_clue_sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.remark_btn_left{
  margin-left: 100px !important;
}
.pointer_sty_clue{
  cursor: pointer;
  margin-left: 3px;
}
.remark_content{
 padding: 0px 14px 20px 30px;
 font-size: 14px;
}
.remark_desc_title{
  font-size: 14px;
  font-weight: bold;
}
.remark_sty{
  padding: 5px 0 0 0;
  color: #666666;
}
.certified_sty {
  width: 17px;
  height: 19px;
  margin-right: 3px;
}
.certified_solo_sty{
  width: 15px;
  height: 19px;
}
.detail_align_sty{
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.detail_align_sty span{
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  align-items: flex-start;
}
.com_p_sty{
  margin-bottom:7px;
}
.over-sty{
  max-width: 180px;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  margin-bottom: 5px;
}
.disbale_content{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
</style>
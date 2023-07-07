<template>
  <div class="new_basic_info">
    <!-- top区域 -->
    <div class="new_info_top">
       <!-- source:true-公海 -->
      <div v-if="source">
         <div class="info_top_name" v-if="userData.clueType == 1">
          <span v-if="userData.companyName!==null">{{ userData.companyName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" :content="userData.certifiedLabel==2?'高级认证':'初级认证'" placement="right" v-if="(userData.certifiedLabel&&userData.certifiedLabel!=0)">
            <img class="certify_img_sty" :src="userData.certifiedLabel==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
        <div class="info_top_name" v-if="userData.clueType == 0">
          <span v-if="userData.contactName!==null">{{ userData.contactName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip v-if="userData.certifiedLabel" effect="dark" :content="userData.certifiedLabel == 2 ?'高级认证':'初级认证'" placement="right">
            <img class="certify_img_sty" :src="userData.certifiedLabel == 2 ? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
        <el-tag v-if="userData.clueStatusId&&userData.clueStatusId!==0" class="flag_right_sty">{{ userData.clueStatusId|filterClueStatus }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueNo }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueType|accountType }}</el-tag>
        <el-tag class="flag_right_sty" v-if="userData.clueGradeId&&userData.clueGradeId!==0">{{ userData.clueGradeId|filterClueLabel() }}</el-tag>
      </div>
      <!-- source:false-非公海 -->
      <div v-else>
        <div class="info_top_name" v-if="userData.clueType == 1">
          <span v-if="userData.companyName!==null">{{ userData.companyName }}</span> 
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip v-if="userData.certifiedLabel" effect="dark" :content="userData.certifiedType==2?'高级认证':'初级认证'" placement="right">
            <img class="certify_img_sty" :src="userData.certifiedType==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
        <div class="info_top_name" v-if="userData.clueType == 0">
          <span v-if="userData.contactName!==null">{{ userData.contactName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip v-if="userData.certifiedLabel" effect="dark" :content="userData.certifiedLabel == 2?'高级认证':'初级认证'" placement="right">
            <img class="certify_img_sty" :src="userData.certifiedLabel == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
        <el-tag v-if="userData.clueStatusId&&userData.clueStatusId!==0" class="flag_right_sty">{{ userData.clueStatusId|filterClueStatus }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueNo }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueType|accountType }}</el-tag>
        <el-tag class="flag_right_sty" v-if="userData.clueGradeId&&userData.clueGradeId!==null">{{ userData.clueGradeId|filterClueLabel() }}</el-tag>
      </div>
      <div v-if="type==0&&!userInfo.isPartner">
        <div v-if="!sourceType">
        <el-button type="primary" v-if="!source&&(userData.clueStatusId==0||userData.clueStatusId==4)" @click="followOperate()">线索跟进</el-button>
        <el-button type="primary" @click="permissions.bt_enter_contract_my_flag?entering():$notAuthorized()" v-preventReClick v-if="(!source)&&(userData.clueStatusId==0||userData.clueStatusId==4)&&(userData.clueSalesmanEmpId == userInfo.id)">录入合同</el-button>
        <el-button type="primary" v-if="(!source)&&(userData.clueAttributionEmpId == userInfo.id)&&(userData.clueStatusId==0)" @click="permissions.bt_allot_clue_attr_my ?distrBelong(0):$notAuthorized()" v-preventReClick>分配线索归属</el-button>
        <el-button type="primary" v-if="(!source)&&(userData.clueStatusId==0||userData.clueStatusId==4)&&((userData.clueAttributionEmpId == userInfo.id)||(userData.clueSalesmanEmpId == userInfo.id))" @click="permissions.bt_allot_clue_salesman_my?distrBelong(1):$notAuthorized()" v-preventReClick>分配业务员</el-button>
        <el-button type="primary" v-if="source||(userData.clueStatusId==2||userData.clueStatusId==3)" @click="permissions.bt_receive_clue_my? batchReceive():$notAuthorized()">领取</el-button>
        <el-button type="primary" v-if="(!source)&&(userData.clueStatusId==0||userData.clueStatusId==4)" @click="permissions.bt_add_order ?validateOrder(userData, $route.query.clueType):$notAuthorized()">发起订单</el-button>
        </div>
      </div>
      <div v-if="type==1&&!userInfo.isPartner">
        <div v-if="!source&&!sourceType">
        <el-button type="primary" v-if="userData.clueStatusId==0" @click="permissions.bt_allot_clue_attr ? distrBelong(0) : $notAuthorized()" v-preventReClick>分配线索归属</el-button>
        <el-button type="primary" v-if="userData.clueStatusId==0||userData.clueStatusId==4" @click="permissions.bt_allot_clue_salesman ? distrBelong(1) : $notAuthorized()" v-preventReClick>分配业务员</el-button>
        </div>
      </div>
    </div>
    <!-- info区域 -->
    <div class="new_info_contain">
      <div class="info_item" v-if="userData.clueType == 0">
        <span>姓名/性别/职位</span>
        <span class="content_color_sty">
          {{ userData.contactName|noData }}&nbsp;&nbsp;
          {{ userData.sex|sexFilter }}&nbsp;&nbsp;
          {{ userData.jobName|noData }}
        </span>
       </div>
       <div class="info_item" v-if="userData.clueType == 1">
        <span>联系人姓名/职位</span>
        <span class="content_color_sty" v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>0">
          {{ userData.clueCompanyContactList[0].contactName|noData }}&nbsp;&nbsp;
          {{ userData.clueCompanyContactList[0].jobName|noData }}
        </span>
        <span class="content_color_sty" v-else>{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item">
        <span>联系人手机号</span>
        <span v-if="userData.clueType == 1" class="center-sty">
          <span class="content_color_sty" v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>0">{{ userData.clueCompanyContactList[0].mobile }}</span>
          <span class="content_color_sty" v-else>{{ $t("message.noData") }}</span>
          <span v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>0&&userData.clueCompanyContactList[0].authorizedLabel!=0">
            <span v-if="(userData.clueCompanyContactList[0].authorizedLabel != 0)">
              <el-tooltip effect="dark" :content="userData.clueCompanyContactList[0].authorizedLabel == 2?'高级授权':'初级授权'" placement="right">
               <img class="certify_img_sty" :src="userData.clueCompanyContactList[0].authorizedLabel == 2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
              </el-tooltip>
            </span>
            <!-- <span v-else-if="(userData.clueCompanyContactList[0].authStatus==1)" class="alread_register">{{ userData.clueCompanyContactList[0].authStatus|filterAuthStatus }}</span> -->
          </span>
        </span>
        <span v-if="userData.clueType == 0" class="center-sty">
          <span class="content_color_sty" v-if="userData.mobile!==null">{{ userData.mobile }}</span>
          <span class="content_color_sty" v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" :content="userData.certifiedLabel==2?'高级认证':'初级认证'" placement="right" v-if="userData.certifiedLabel">
            <img class="certify_img_sty" :src="userData.certifiedLabel==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </span>
        </div>
        <!-- 仅部门公海显示 start -->
        <div class="info_item" v-if="source">
        <span>公海部门</span>
        <span v-if="userData.clueAttributionEmpDeptId!==null">{{userData.clueAttributionEmpDeptId|filterDept}}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item" v-if="source">
        <span>绑定成交客户</span>
        <span class="content_color_sty" v-if="userData.clueType == 1">{{userData.transactionCompanyId|filterBind}}</span>
        <span class="content_color_sty" v-if="userData.clueType == 0">{{userData.transactionPersonId|filterBind}}</span>
      </div>
      <div class="info_item" v-if="source">
        <span>成交状态</span>
        <span v-if="userData.isDeal!==null">{{userData.isDeal|filterTransaction}}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <!-- end -->
      <div class="info_item" v-if="!source">
        <span>客户归属</span>
        <span v-if="userData.clueUserEmpId!==null">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.clueUserEmpId)">{{ userData.clueUserEmpName }}</span>
          </el-tooltip>
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item" v-if="!source">
        <span>线索归属</span>
        <span v-if="userData.clueAttributionEmpName!==null">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.clueAttributionEmpId)">{{ userData.clueAttributionEmpName }}</span>
          </el-tooltip>
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item" v-if="!source">
        <span>业务员</span>
        <span v-if="userData.clueSalesmanEmpName !== null">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top" :disabled="userInfo.isPartner">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.clueSalesmanEmpId)">{{ userData.clueSalesmanEmpName }}</span>
          </el-tooltip>
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
       <div class="info_item">
        <span>创建人</span>
        <span v-if="userData.createByName !== null">
           <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.createBy)">{{ userData.createByName }}</span>
          </el-tooltip>
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
    </div>
    <div class="new_info_contain">
      <div class="info_item">
        <span>行业类型</span>
        <el-tooltip effect="dark" :content="filterIndustryData(userData.industry)" placement="top-start">
          <span v-if="userData.industry!==null" class="industry_over_sty content_color_sty">
          {{ userData.industry|filterIndustry }}
          </span>
          <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </el-tooltip>
      </div>
      <div class="info_item">
        <span>地区</span>
        <span v-if="userData.orgAddress!==null" class="content_color_sty">{{ userData.orgAddress|filterArea }}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item">
        <span>最近签约时间</span>
        <span v-if="userData.lastSignTime&&userData.lastSignTime !== null" class="content_color_sty">{{ userData.lastSignTime }}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item">
        <span>最近线索跟进</span>
        <span v-if="userData.lastClueFollowTime&&userData.lastClueFollowTime !== null" class="content_color_sty">{{ userData.lastClueFollowTime }}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item">
        <span>最近用户跟进</span>
        <span v-if="userData.lastUserFollowTime&&userData.lastUserFollowTime !== null" class="content_color_sty">{{ userData.lastUserFollowTime }}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item">
        <span>最近用户登录</span>
        <span v-if="userData.lastUserLoginTime&&userData.lastUserLoginTime !== null" class="content_color_sty">{{ userData.lastUserLoginTime }}</span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
    </div>
    <!-- 备注区域 -->
    <div>
      <h5>
        <span>备注</span>
        <i class="el-icon-edit pointer-sty" v-if="type == 0" @click="setRemark()"></i>
      </h5>
      <div class="info_be_sty content_color_sty" v-if="userData.remark!==''">
        {{ userData.remark }}
      </div>
      <div class="info_be_sty content_color_sty" v-else>{{ $t("message.noData") }}</div>
    </div>
    <!-- 备注dialog -->
    <el-dialog :visible.sync="remarkDialog" :close-on-click-modal="false" :before-close="remarkCancel">
      <el-form class="remark-sty">
        <el-form-item label="备注：">
          <el-input type="textarea" show-word-limit maxlength="500" v-model="userData.remark" :autosize="{ minRows: 10,}"></el-input>
        </el-form-item>
      </el-form>
      <div class="remark_clue_sty">
        <el-button size="medium" type="primary" @click="remarkSubmit()">确定</el-button>
        <el-button size="medium" class="remark_btn_left" @click="remarkCancel()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 跟进操作 -->
    <follow ref="follow" @refresh="refresh"></follow>
    <!-- 分配操作 -->
    <allot-operate ref="allot" @refresh="refresh"></allot-operate>
  </div>
</template>

<script>
import { saveDetal } from "@/util/clearDetail";
import { receiveForMy,updateRemark,validateCreateOrder } from '@/api/new-client/my-clue'
import { getEmpInfo } from "@/api/project/wtClass";
import { clearDetail } from "@/util/clearDetail";
import * as CodeMsg from "@/api/common/CodeChange";
import follow from "@/components/new-client/common/follow";
import allotOperate from "@/components/new-client/common/allot";
import { mapState, mapGetters } from "vuex";
import { filterIndustry, filterClueLabel, filterArea, filterDept } from "@/util/new-client/filter"
export default {
  components: {
    follow,
    allotOperate,
  },
  props: ["userData", "type", "source", "loginEmpNo", "accountId", "sourceType"],
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      remarkDialog: false,
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(['permissions']),
  },
  filters: {
    filterBind(val){
      return val!=null?'是':'否'
    },
    filterTransaction(val){
      return val == 1?'已成交':val == 2?'未成交':''
    },
    filterAuthStatus(val){
      return val == 0?"自定义":val == 1?"已注册":val == 2?"已授权":""
    },
    // 3-部门公海 4-集团公海
    filterClueStatus(val){
      return val == 0?"正常":val == 1?"失效":val == 2||val == 3?"公海":val == 4?"机构":''
    },
    sexFilter(val) {
      return val == 1 ? "男" : val == 2 ? "女" : "暂无数据";
    },
    accountType(value) {
      return value == 0 ? "个人" : value == 1 ? "单位" : "";
    },
    noData(value) {
      return value == null ? "暂无数据" : value;
    },
    filterIndustry(val){
      return filterIndustry(val)
    },
    filterClueLabel(val){
      return filterClueLabel(val)
    },
    filterArea(val){ 
      return filterArea(val)
    },
    filterDept(val){ 
      return filterDept(val)
    },
  },
  methods: {
    // 修改线索b备注
    setRemark(){
      this.remarkDialog = true
    },
    // 发起订单校验-公海线索不能发起订单
    validateOrder(row, clueType){
     if(row.clueStatusId != 2 && row.clueStatusId != 3){
      this.validateProOrder(row,clueType)
     }else{
       this.$message({
         type:'warning',
         message:"不符合发起订单条件！",
         offset:300
       })
     }
    },
    // 检查发起订单是否符合条件
    validateProOrder(row,clueType){
      let params = clueType == 1 ?{
        companyName:row.companyName,
        organization:row.organization
      }:{
        mobile:row.mobile,
        personName:row.contactName
      }
      validateCreateOrder(params,clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.initOrder(row, clueType)
        }else{
          this.$alert(`${res.data.msg}`, '', {
           confirmButtonText: '确定',
           center: true,
          });
        }
      })
    },
    initOrder(row, clueType){
      this.$router.push({
        path:'/init-order',
        query:{
          id: row.clueCompanyId || row.cluePersonId,
          clueType: clueType,//1-单位 0-个人
        }
      })
    },
    // 领取提示
    batchReceive(){
      this.$confirm(this.type == 0?'公海的线索，领取后，不改变该线索的线索归属和业务员，确定领取?':this.$t("message.seaConfirmOne"),{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.receiveOperate(this.userData.clueType == 1?[this.userData.clueCompanyId]:[this.userData.cluePersonId])
        })
    },
    // 领取操作
    receiveOperate(receiveList){
      let params = {
        clueIdList: receiveList
      }
      receiveForMy(params,this.userData.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$notify({
            title: this.$t("text.success"),
            message: this.$t("message.receiveSuccess"),
            type: "success",
            duration: 2000,
          });
          this.receiveSkip()
        }else{
          this.$notify({
            title: "提示",
            message: res.data.msg,
            type: "warning",
            duration: 2000,
          });
        }
      })
    },
    // 领取跳转
    receiveSkip(){
      if(this.source){
        clearDetail("/seas-customers/department-seas/index");
        this.$router.push("/seas-customers/department-seas/index");
      }else{
        clearDetail("/personal/customer/my-clue");
        this.$router.push("/personal/customer/my-clue");
      }
    },
    filterIndustryData(val){
      return filterIndustry(val)
    },
    refresh(){
      this.$emit("refresh");
    },
    remarkSubmit() {
      let clueType = this.userData.clueType
      let params = {
        id: clueType == 1? this.userData.clueCompanyId:this.userData.cluePersonId,
        remark: this.userData.remark,
      };
      updateRemark(params,clueType).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "修改成功！",
            offset: 300
          });
          this.remarkDialog = false;
          this.$emit("refresh");
        }
      });
    },
    remarkCancel() {
      this.remarkDialog = false;
      this.$emit("refresh");
    },
    // 跟进操作
    followOperate() {
      this.$nextTick(() => {
        this.$refs.follow.followClueDialog = true;
        this.$refs.follow.followInfo = this.userData;
        this.$refs.follow.followTitle = "线索跟进"
        this.$refs.follow.clueType = this.userData.clueType == 0?1:2;
      });
    },
    // 跳转录入合同页面
    entering(){
      let path = "/entering-contract";
      let query = {
        clueId: this.userData.clueType == 1? this.userData.clueCompanyId : this.userData.cluePersonId,
        clueType: this.userData.clueType,
        source: 'personal',
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    // 0-分配线索归属 1-分配业务员
    distrBelong(val) {
      this.$nextTick(() => {
        this.$refs.allot.clueList = [this.userData]
        this.$refs.allot.isPerson = this.type == 1?false:true
        this.$refs.allot.clueType = this.userData.clueType
        this.$refs.allot.distrBelong(val,val == 0?"分配线索归属":"分配业务员");
      });
    },
  },
};
</script>

<style scoped>
.new_basic_info {
  background: #ffffff;
  min-height: 373px;
  padding: 30px 40px;
  border-radius: 3px;
}
.new_info_top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.info_top_name {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}
.flag_left_sty {
  margin-left: 10px;
}
.flag_right_sty{
  margin-right: 10px;
}
.new_info_contain {
  width: 100%;
  display: flex;
  white-space: wrap;
  margin-bottom: 20px;
}
.info_item {
  position: relative;
  width: 20%;
  height: 70px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
.info_item > span:nth-of-type(1) {
  font-weight: bold;
}
.info_item > span:nth-of-type(2) {
  margin-top: 10px;
}
.info_be_sty {
  margin-top: -10px;
  font-size: 14px;
}
.industry_over_sty {
  display: -webkit-box;
  height: 70px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.alread_register {
  text-align: center;
  display: inline-block;
  padding: 1px 5px 2px 5px;
  border-radius: 5px;
  color: #ffffff;
  background: #409eff;
  font-size: 12px;
  margin-left: 5px;
}
.content_color_sty {
  color: #666666 !important;
}
.remark_clue_sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.remark_btn_left {
  margin-left: 100px !important;
}
.certify_img_sty{
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.pointer-sty{
  cursor: pointer;
  margin-left: 3px;
}
.remark-sty{
  margin-top: -20px;
}
.center-sty{
  display: flex;
  align-items: center;
}
</style>
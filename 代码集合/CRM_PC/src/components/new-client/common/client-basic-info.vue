<template>
  <div class="new_basic_info">
    <!-- top区域 -->
    <div class="new_info_top">
       <!-- source:true-公海 -->
       <div v-if="source">
         <div class="info_top_name" v-if="userData.clueType == 1">
          <span v-if="userData.companyName!==null">{{ userData.companyName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" :content="userData.certifiedType==2?'高级认证':'初级认证'" placement="right" v-if="(userData.certifiedType&&userData.certifiedType!=0)">
            <img class="certify_img_sty" :src="userData.certifiedType==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
        <div class="info_top_name" v-if="userData.clueType == 0">
          <span v-if="userData.contactName!==null">{{ userData.contactName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" content="高级认证" placement="right">
            <img v-if="userData.isAutoConversion" class="certify_img_sty" :src="require('@/assets/images/new-client/certified_unit.png')" alt="">
          </el-tooltip>
        </div>
        <el-tag v-if="userData.clueStatusId&&userData.clueStatusId!==0" class="flag_right_sty">{{ userData.clueStatusId|filterClueStatus }}</el-tag>
        <el-tag v-if="userData.isAutoConversion" class="flag_right_sty">{{ userData.userNo }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueType|accountType }}</el-tag>
        <el-tag class="flag_right_sty" v-if="userData.clueGradeId&&userData.clueGradeId!==0">{{ userData.clueGradeId|filterClueLabel() }}</el-tag>
      </div>
      <!-- source:false-非公海 -->
      <div v-else>
         <div class="info_top_name" v-if="userData.clueType == 1">
          <span v-if="userData.companyName!==null">{{ userData.companyName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" :content="userData.certifiedType==2?'高级认证':'初级认证'" placement="right" v-if="(userData.certifiedType&&userData.certifiedType!=0)">
            <img class="certify_img_sty" :src="userData.certifiedType==2? require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
          </el-tooltip>
        </div>
         <div class="info_top_name" v-if="userData.clueType == 0">
          <span v-if="userData.contactName!==null">{{ userData.contactName }}</span>
					<span v-else>{{ $t("message.noData") }}</span>
          <el-tooltip effect="dark" content="高级认证" placement="right">
            <img v-if="userData.isAutoConversion" class="certify_img_sty" :src="require('@/assets/images/new-client/certified_unit.png')" alt="">
          </el-tooltip>
        </div>
        <el-tag v-if="userData.clueStatusId&&userData.clueStatusId!==0" class="flag_right_sty">{{ userData.clueStatusId|filterClueStatus }}</el-tag>
        <el-tag v-if="userData.isAutoConversion" class="flag_right_sty">{{ userData.userNo }}</el-tag>
        <el-tag class="flag_right_sty">{{ userData.clueType|accountType }}</el-tag>
        <el-tag class="flag_right_sty" v-if="userData.clueGradeId!==null">{{ userData.clueGradeId|filterClueLabel() }}</el-tag>
      </div>
      <div v-if="type==0&&!userInfo.isPartner">
        <el-button type="primary" v-if="!source&&(userData.clueStatusId==0||userData.clueStatusId==4)" @click="followOperate()">客户跟进</el-button>
        <!-- <el-button type="primary" @click="entering()" v-if="(!source)&&(userData.clueSalesmanEmpId == userInfo.id)">录入合同</el-button> -->
        <!-- <el-button type="primary" v-if="source||(userData.clueStatusId==2||userData.clueStatusId==3)" @click="permissions.bt_receive_clue_my?batchReceive():$notAuthorized()">领取</el-button> -->
      </div>
    </div>
    <!-- info区域 -->
    <div class="new_info_contain">
      <div class="info_item" v-if="userData.createType =='2'">
        <span>用户ID</span>
        <span class="content_color_sty">{{ userData.userNo }}</span>
      </div>
      <div class="info_item" v-else>
        <span>线索编号</span>
        <span class="content_color_sty">{{ userData.clueNo }}</span>
      </div>
       <div class="info_item" v-if="userData.clueType == 0&&!source">
        <span>姓名/性别/职位</span>
        <span class="content_color_sty">
          {{ userData.contactName|noData }}&nbsp;&nbsp;
          {{ userData.sex|sexFilter }}&nbsp;&nbsp;
          {{ userData.jobName|noData }}
        </span>
       </div>
       <div class="info_item" v-if="userData.clueType == 1&&!source">
        <span>联系人姓名/职位</span>
        <span class="content_color_sty" v-if="userData.clueCompanyContactList&&userData.clueCompanyContactList.length>0">
          {{ userData.clueCompanyContactList[0].contactName|noData }}&nbsp;&nbsp;
          {{ userData.clueCompanyContactList[0].jobName|noData }}
        </span>
        <span class="content_color_sty" v-else>{{ $t("message.noData") }}</span>
      </div>
        <!-- 仅集团公海显示 start -->
        <div class="info_item" v-if="source">
        <span>联系人姓名</span>
        <span class="content_color_sty">{{ userData.contactName|noData }}</span>
      </div>
      <div class="info_item" v-if="source">
        <span>联系人性别</span>
        <span class="content_color_sty">{{ userData.sex|sexFilter }}</span>
      </div>
      <div class="info_item" v-if="source">
        <span>联系人职位</span>
        <span class="content_color_sty">{{ userData.jobName|noData }}</span>
      </div>
      <!-- end -->
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
          <span class="content_color_sty" v-if="userData.mobile!==null">{{ userData.mobile}}</span>
          <span class="content_color_sty" v-else>{{ $t("message.noData") }}</span>
          <span class="alread_register" v-if="(userData.isAutoConversion||userData.isUserConversion)">
            <span v-if="userData.isAutoConversion">已授权</span>
            <span v-else-if="userData.isUserConversion">已注册</span>
          </span>
        </span>
        </div>
      <div class="info_item" v-if="!source">
        <span>客户/线索归属</span>
        <span v-if="userData.clueAttributionEmpName!==null" class="disbale_content_client">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.clueAttributionEmpId)">{{ userData.clueAttributionEmpName }}</span>
          </el-tooltip>
          <img v-if="userData.userBelongLockFlag!==null&&userData.userBelongLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
      <div class="info_item" v-if="!source">
        <span>业务员</span>
        <span v-if="userData.clueSalesmanEmpName != null">
          <el-tooltip effect="dark" :content="tooltipContent" placement="top" :disabled="userInfo.isPartner">
            <span class="content_color_sty" @mouseenter="showUserInfo(userData.clueSalesmanEmpId)">{{ userData.clueSalesmanEmpName }}</span>
          </el-tooltip>
        </span>
        <span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
      </div>
       <div class="info_item">
        <span>创建人</span>
        <span v-if="userData.createByName != null">
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
         <el-tooltip class="item" effect="dark" :content="filterIndustryData(userData.industry)" placement="top-start">
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
      <div class="info_item" v-if="userData.createType =='2'"></div>
    </div>
    <!-- 备注区域 -->
    <div>
      <h5>
        <span>备注</span>
        <i class="el-icon-edit pointer_sty_clue" v-if="!source&&type == 0" @click="setRemark()"></i>
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
          <el-input type="textarea" show-word-limit maxlength="500" v-model="userData.clueRemark" :autosize="{ minRows: 10,}"></el-input>
        </el-form-item>
      </el-form>
      <div class="remark_clue_sty">
        <el-button size="medium" type="primary" @click="remarkSubmit()">确定</el-button>
        <el-button size="medium" class="remark_btn_left" @click="remarkCancel()">取消</el-button>
      </div>
    </el-dialog>
    <!-- 跟进操作 -->
    <follow ref="follow" @refresh="refresh"></follow>
  </div>
</template>

<script>
import { receive,updateRemark } from '@/api/new-client/my-clue'
import { clearDetail } from "@/util/clearDetail";
import * as CodeMsg from "@/api/common/CodeChange";
import follow from "@/components/new-client/common/follow";
import { mapGetters, mapState } from "vuex";
import { filterIndustry, filterClueLabel, filterArea } from "@/util/new-client/filter"
export default {
  components: {
    follow,
  },
  props: ["userData", "type", "source", "loginEmpNo", "accountId"],
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
    ...mapGetters(['permissions'])
  },
  filters: {
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
  },
  methods: {
    // 修改线索b备注
    setRemark(){
      this.remarkDialog = true
    },
    // 领取提示
    batchReceive(){
      this.$confirm(this.$t("message.seaConfirmOne"),{
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
      receive(params,this.clueType).then(res=>{
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
        clearDetail("/seas-customers/group-seas/index");
        this.$router.push("/seas-customers/group-seas/index");
      }else{
        clearDetail("/personal/customer/my-client");
        this.$router.push("/personal/customer/my-client");
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
        clueRemark: this.userData.clueRemark,
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
        this.$refs.follow.followTitle = "客户跟进"
        this.$refs.follow.clueType = this.userData.clueType == 0?1:2;
        this.$refs.follow.publicTime = this.userData.publicTime;
      });
    },
    // 跳转录入合同页面
    entering(){
      let path = "/entering-contract";
      let query = {
        clueId: this.userData.id,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
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
.tag-sty {
  margin-top: 2px;
  margin-left: 6px;
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
  padding: 2px 5px;
  border-radius: 5px;
  color: #ffffff;
  background: #409eff;
  font-size: 12px;
  margin-left: 5px;
}
.content_color_sty {
  color: #666666 !important;
}
.pointer_sty_clue {
  cursor: pointer;
  margin-left: 3px;
}
.remark_clue_sty {
  display: flex;
  justify-content: center;
  align-items: center;
}
.remark_btn_left {
  margin-left: 100px !important;
}
.disbale_content_client {
  display: flex;
  justify-content: flex-start;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.certify_img_sty{
  width: 20px;
  height: 20px;
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

<template>
  <div class="new_clue_info">
     <span style="font-size:14px;color:#2c3e50">用户ID：{{accountId}}<span style="margin-left:66px">注册时间：{{time}}</span></span>
    <!-- 基本信息 -->
    <div class="new_left_span">
      <span></span>
      <span>基本信息</span>
    </div>
    <!-- 单位客户 -->
    <div class="basic_info_contain_parent_column" v-if="accountType == 1">
      <div class="basic_info_contain_column">
       <div class="basic_info_item"><span>单位类型：</span><span class="content_color_sty">{{ userData.orgTypeName|valiData }}</span></div>
       <div class="basic_info_item"><span>行业类型：</span><span class="content_color_sty">{{ userData.industry|valiData }}</span></div>
       <div class="basic_info_item"><span>详细地址：</span><span class="content_color_sty">{{ userData.orgDetailAddress|noDate }}</span></div>
       <div class="basic_info_item"><span>所在地区：</span><span class="content_color_sty">{{ userData.orgAddressNameList|arrFilter }}</span></div>
      </div>
      <div class="basic_info_contain_column">
      <div class="basic_info_item">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人1：</span>
        <span class="content_color_sty">{{ userData.name }}</span>
        <span class="span_left_sty content_color_sty">{{ userData.job }}</span>
        <span class="span_left_sty content_color_sty">
          <span class="content_color_sty" v-if="type == 0">{{phone}}</span>
          <span class="content_color_sty" v-if="type == 1">{{phone}}</span>
           <span class="alread_register" v-if="userData.phone&&userData.phone!==null" @click="openRegisterDialog(0,accountType)">
            <span>已注册</span>
            <span v-if="accountType!==null&&accountType == 1">单位</span>
            <span v-if="accountType!==null&&accountType == 0">个人</span>
          </span>
        </span>
      </div>
       <div class="basic_info_item" v-show="userData.userTwoName!==null&&userData.userTwoName!==''">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人2：</span>
        <span class="content_color_sty">{{ userData.userTwoName|noDate }}</span>
        <span class="span_left_sty content_color_sty">{{ userData.userTwoJob|noDate }}</span>
        <span class="span_left_sty content_color_sty">
          <span class="content_color_sty" v-if="type == 0">{{ userData.userTwoPhone|noDate }}</span>
          <span class="content_color_sty" v-if="type == 1">{{ userData.userTwoPhone|noDate }}</span>
          <!-- <span class="alread_register" v-if="userData.mobilePhoneTwoIsRegister==0||userData.mobilePhoneTwoIsRegister==1" @click="openRegisterDialog(1,userData.mobilePhoneTwoIsRegister)">{{ userData.mobilePhoneTwoIsRegister|registerFilter }}</span> -->
        </span>
      </div>
      <div class="basic_info_item" v-if="userData.userThreeName!==null&&userData.userThreeName!==''">
        <span v-if="userData.userTwoName!==null&&userData.userTwoName!==''">联&nbsp;&nbsp;系&nbsp;&nbsp;人3：</span>
        <span v-else>联&nbsp;&nbsp;系&nbsp;&nbsp;人2：</span>
        <span class="content_color_sty">{{ userData.userThreeName|noDate }}</span>
        <span class="span_left_sty content_color_sty">{{ userData.userThreeJob|noDate }}</span>
        <span class="span_left_sty content_color_sty">
          <span class="content_color_sty" v-if="type == 0">{{ userData.userThreePhone|noDate }}</span>
          <span class="content_color_sty" v-if="type == 1">{{ userData.userThreePhone|noDate }}</span>
          <!-- <span class="alread_register" v-if="userData.mobilePhoneThreeIsRegister==0||userData.mobilePhoneThreeIsRegister==1" @click="openRegisterDialog(2,userData.mobilePhoneThreeIsRegister)">{{ userData.mobilePhoneThreeIsRegister|registerFilter }}</span> -->
        </span>
      </div>
      </div>
    </div>
    <!-- 个人客户 -->
    <div class="basic_info_contain_parent" v-else>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span>
        <span class="content_color_sty">{{ userData.name }}</span>
        <span class="span_left_sty content_color_sty">{{ userData.job }}</span>
        <span class="span_left_sty content_color_sty">
          <span class="content_color_sty" v-if="type == 0">{{ phone }}</span>
          <span class="content_color_sty" v-if="type == 1">{{ phone }}</span>
          <!-- 缺少判断是否注册 -->
          <span class="alread_register" v-if="userData.phone&&userData.phone!==null" @click="openRegisterDialog(0,accountType)">
            <span>已注册</span>
            <span v-if="accountType!==null&&accountType == 1">单位</span>
            <span v-if="accountType!==null&&accountType == 0">个人</span>
          </span>
        </span>
      </div>
      <div class="basic_info_item"><span>所在地区：</span><span class="content_color_sty">{{ userData.areaName|noDate }}</span></div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item"><span>单位类型：</span><span class="content_color_sty">{{ userData.orgTypeName|noDate }}</span></div>
      <div class="basic_info_item"><span>行业类型：</span><span class="content_color_sty">{{ userData.orgIndustryName|noDate }}</span></div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>单位名称：</span>
        <span>
          <span v-if="userData.orgName" class="content_color_sty">{{ userData.orgName }}</span>
					<span v-else class="content_color_sty">{{ $t("message.noData") }}</span>
        </span>
      </div>
      <div class="basic_info_item"><span>详细地址：</span><span class="content_color_sty">{{ userData.orgDetailAddress|noDate }}</span></div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div v-if="accountType == 1">
    <div class="new_left_span">
      <span></span>
      <span>单位数据</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0" @click="openEditDialog('second')"></i>
    </div>
    <!-- 数据未加处理 -->
    <div class="org_contain">
      <div class="org_title"><span></span><span>知产情况</span></div>
      <div class="org_list_main">
        <div class="org_list_item">
          <span>发明专利</span>
          <div v-if="clueOrganization.inventionPatent" class="patent_top_sty">
            <span>{{ clueOrganization.inventionPatent }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>实用新型专利</span>
          <div v-if="clueOrganization.practicalPatent" class="patent_top_sty">
            <span>{{ clueOrganization.practicalPatent }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>外观专利</span>
          <div v-if="clueOrganization.appearancePatent" class="patent_top_sty">
            <span>{{ clueOrganization.appearancePatent }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>商标</span>
          <div v-if="clueOrganization.trademark" class="patent_top_sty">
            <span>{{ clueOrganization.trademark }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>版权</span>
          <div v-if="clueOrganization.copyright" class="patent_top_sty">
            <span>{{ clueOrganization.copyright }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
        <div class="org_list_item">
          <span>其他知产</span>
          <div v-if="clueOrganization.others" class="patent_top_sty">
            <span>{{ clueOrganization.others }}</span>
            <span class="span_font_sty">件</span>
          </div>
          <div v-else class="no_font-sty content_color_sty patent_top_sty">暂无数据</div>
          </div>
      </div>
    </div>
    <div class="org_contain">
      <div class="org_title"><span></span><span>财务及人员情况</span></div>
      <div class="org_list_main">
        <div class="org_list_item">
          <span>上年度销售总额</span>
          <el-tag size="mini" class="tag_sty" v-if="clueOrganization.lastTotalSalesCategory">{{ clueOrganization.lastTotalSalesCategory}}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="clueOrganization.lastTotalSales">
            <span>{{ clueOrganization.lastTotalSales }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度资产总计</span>
          <el-tag size="mini" class="tag_sty" v-if="clueOrganization.lastTotalPropertyCategory">{{ clueOrganization.lastTotalPropertyCategory }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="clueOrganization.lastTotalProperty">
            <span>{{ clueOrganization.lastTotalProperty }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度利润总额</span>
          <el-tag size="mini" class="tag_sty" v-if="clueOrganization.lastTotalProfitCategory">{{ clueOrganization.lastTotalProfitCategory }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="clueOrganization.lastTotalProfit">
            <span>{{ clueOrganization.lastTotalProfit }}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>上年度研发费用总额</span>
          <el-tag size="mini" class="tag_sty" v-if="clueOrganization.lastTotalResearchCategory">{{ clueOrganization.lastTotalResearchCategory }}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="clueOrganization.lastTotalResearch">
            <span>{{ clueOrganization.lastTotalResearch}}</span>
            <span class="span_font_sty">万</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item">
          <span>单位人数</span>
          <el-tag size="mini" class="tag_sty" v-if="clueOrganization.totalEmployeesCategory">{{ clueOrganization.totalEmployeesCategory}}</el-tag>
          <el-tag size="mini" class="tag_sty content_color_sty" v-else>暂无数据</el-tag>
          <div v-if="clueOrganization.totalEmployees">
            <span>{{ clueOrganization.totalEmployees }}</span>
            <span class="span_font_sty">人</span>
          </div>
          <div v-else class="no_font-sty content_color_sty">暂无数据</div>
        </div>
        <div class="org_list_item"></div>
      </div>
    </div>
    <div class="org_contain">
      <div class="org_title"><span></span><span>主营业务</span></div>
      <div class="org_desc content_color_sty" v-if="clueOrganization.mainBusiness&&clueOrganization.mainBusiness!==''">{{ clueOrganization.mainBusiness}}</div>
      <div v-else class="org_desc content_color_sty">暂无数据</div>
    </div>
    <div class="org_contain">
      <div class="org_title"><span></span><span>下一步项目规划</span></div>
      <div class="org_desc content_color_sty" v-if="clueOrganization.nextProjectPlan&&clueOrganization.nextProjectPlan!==''">{{ clueOrganization.nextProjectPlan }}</div>
      <div v-else class="org_desc content_color_sty">暂无数据</div>
    </div>
    <!-- 基本信息 -->
    <div class="new_left_span">
      <span></span>
      <span>人员信息</span>
      <i class="el-icon-edit pointer_sty" v-if="type == 0" @click="openEditDialog('third')"></i>
    </div>
    <div class="basic_info_contain_parent">
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人：</span>
        <span class="content_color_sty">{{ unitVO.orgLegalName|noDate }}</span>
        <span v-if="type ==0" class="phone_left_sty content_color_sty">{{ unitVO.orgLegalMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgLegalMobilephone|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>营销主管：</span>
        <span class="content_color_sty">{{ unitVO.orgMarketingName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgMarketingMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgMarketingMobilephone|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>财务主管：</span>
        <span class="content_color_sty">{{ unitVO.orgTreasurerName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgTreasurerMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgTreasurerMobilephone|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>人事主管：</span>
        <span class="content_color_sty">{{ unitVO.orgCompetentName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>技术主管：</span>
        <span class="content_color_sty">{{ unitVO.orgTechnicalName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgTechnicalMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgTechnicalMobilephone|noDate }}</span>
      </div>
      </div>
    </div>
      <!-- 开票信息 -->
    <div class="new_left_span">
      <span></span>
      <span>开票信息</span>
    </div>
     <div class="basic_info_contain_parent">
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>单位名称：</span>
        <span v-if="type ==0" class="phone_left_sty content_color_sty">{{ unitVO.orgLegalMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgLegalMobilephone|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>注册电话：</span>
        <span class="content_color_sty">{{ unitVO.orgMarketingName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgMarketingMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgMarketingMobilephone|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>发票税号：</span>
        <span class="content_color_sty">{{ unitVO.orgTreasurerName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgTreasurerMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgTreasurerMobilephone|noDate }}</span>
      </div>
      <div class="basic_info_item">
        <span>开户银行：</span>
        <span class="content_color_sty">{{ unitVO.orgCompetentName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>注册地址：</span>
        <span class="content_color_sty">{{ unitVO.orgTechnicalName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgTechnicalMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgTechnicalMobilephone|noDate }}</span>
      </div>
       <div class="basic_info_item">
        <span>银行账号：</span>
        <span class="content_color_sty">{{ unitVO.orgCompetentName|noDate }}</span>
        <span v-if="type == 0" class="phone_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
        <span v-else class="span_left_sty content_color_sty">{{ unitVO.orgCompetentMobilephone|noDate }}</span>
      </div>
      </div>
    </div>
    </div>

    <div class="basic_info_contain_parent">
    <!-- 线索编辑dialog -->
    <el-dialog :visible.sync="editClueDialog" title="用户信息" width="690px" :close-on-click-modal="false">
      <operate-clue v-if="editClueDialog" ref="clue" :accountType="accountType" :userInfo="userData" @close-clue="editClueDialog=false" @closeClueOperate="closeClueOperateDialog" :phone="phone"></operate-clue>
    </el-dialog>
    <!-- 注册信息dialog -->
    <el-dialog :visible.sync="registerDialog" :width="basicData.accountType == 1?'850px':'700px'">
      <register-info :dialog="true" :userData="userData" :type="type" :source="false" :basicData="basicData" :innerInfo='innerInfo' :unitVO='unitVO' :showTitle="true"></register-info>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRegisterInfo,getClueRegister } from "@/api/clue/clue"
import operateClue from "@/components/task/online/edit-user"
import * as CodeMsg from "@/api/common/CodeChange"
import registerInfo from "@/components/user/common/register-info";
export default {
  components:{
    operateClue,
    registerInfo
  },
  props:['userData','type','clueOrganization','accountType','unitVO','phone','accountId','time','parent'],
  data() {
    return {
      basicData:{},
      innerInfo:{},
      // unitVO:{},
      registerDialog:false,
      createType:1,
      editClueDialog:false
    };
  },
  filters:{
    createType(val){
      return val == '0' ? '用户转化' : val == '1' ? '手动创建' : '不详';
    },
    valiData(val){
      return val == null? '暂无数据' : val
    },
    noDate(val){
      return val == null? '暂无数据' :val == ''?'暂无数据':val
    },
    registerFilter(val){
      return val == 0?"已注册个人":val == 1?"已注册单位":""
    },
    arrFilter(val){
      if(val!==null&&val!==''&&val.length>0){
        return val.join(',')
      }else{
        return "暂无数据"
      }
    },
  },
  mounted(){
 console.log("this.userData",this.userData)
  },
  methods:{
    openRegisterDialog(index,ctype){
      // getClueRegister(this.userData.id,index,this.type == 0?0:1).then(res=>{
      //  if(res.data.code == CodeMsg.CODE_0){
      //   this.basicData = res.data.data
      //   if (this.basicData.userVO !== null) {
      //       this.innerInfo = this.basicData.userVO;
      //       if (this.basicData.userVO.unitVO !== null) {
      //         this.unitVO = this.basicData.userVO.unitVO;
      //       }
      //     }
      //  }
      // })
      this.registerDialog = true
    },
    openEditDialog(val){
      // 此处需要添加操作权限逻辑
      this.editClueDialog = true
      this.$nextTick(()=>{
       if(this.$refs.clue){
        this.$refs.clue.activeName = val
      }
      })
    },
    closeClueOperateDialog(){
      this.editClueDialog = false
      this.parent.getInfo()
    //   this.$router.push({
    //     path:"/personal/my-users"
    //   })
    }
  }
};
</script>

<style scoped>
.new_clue_info {
  padding: 10px 0 50px 0;
}
.new_left_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0 25px 0px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E4E7ED;
}
.new_left_span > span:nth-of-type(1) {
  display: inline-block;
  width: 5px;
  height: 20px;
  background: #108ee9;
}
.new_left_span > span:nth-of-type(2) {
  display: flex;
  width: 65px;
  height: 20px;
  margin-right: 5px;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: #2c3e50;
  font-weight: bold;
}
.first_create_sty{
  font-size: 14px;
}
.first_create_sty>span:nth-of-type(1){
  margin-right: 50px;
}
.basic_info_contain{
  display: flex;
  margin-bottom: 30px;
}
.basic_info_contain_column:nth-of-type(1){
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  flex: 1;
}
.basic_info_contain_column:nth-of-type(2){
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  flex: 1.5;
}
.basic_info_contain_column .basic_info_item{
  margin-top: 20px;
}
.basic_info_contain_column>.basic_info_item:nth-of-type(1){
  margin-top: 0px;
}
.basic_info_item{
  position: relative;
}
.basic_info_contain_column>.basic_info_item>span{
  flex:1;
  font-size: 14px;
}
.basic_info_contain>.basic_info_item:nth-of-type(1){
  flex:1;
  font-size: 14px;
}
.basic_info_contain>.basic_info_item:nth-of-type(2){
  flex:1.5;
  font-size: 14px;
}
.basic_info_contain_parent_column{
  display: flex;
}
.basic_info_contain_parent{
  margin: 20px 0 60px 0;
}
.org_contain{
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.org_title{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.org_title>span:nth-of-type(1){
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #000000;
  transform: rotate(-45deg);
  margin-left: 5px;
  margin-right: 5px;
}
.org_title>span:nth-of-type(2){
  font-weight: bold;
}
.org_desc{
  font-size: 14px;
  padding: 10px 150px 10px 5px;
}
.org_list_main{
  display: flex;
  width: 100%;
  padding: 10px 0 0 5px;
}
.org_list_item{
 flex: 1;
 display: flex;
 flex-direction: column;
 padding: 10px 0 0 5px;
 align-items: flex-start;
 font-size: 20px;
}
.org_list_item>span:nth-of-type(1){
  font-size: 14px;
  margin-right: 20%;
}
.org_list_item>span:nth-of-type(2){
  font-size: 20px;
}
.tag_sty{
  width: 90px;
  font-size: 14px !important;
  text-align: center;
  margin: 10px 0;
}
.span_font_sty{
  font-size: 16px;
  margin-left: 3px;
}
.pointer_sty{
  cursor: pointer;
}
.span_left_sty{
  margin-left: 15px;
  position: relative;
}
.alread_register{
  width: 70px;
  text-align: center;
  display: inline-block;
  padding: 2px 5px;
  border-radius: 5px;
  color: #ffffff !important;
  background: #409EFF;
  font-size: 12px;
  margin-left: 5px;
  cursor: pointer;
}
.no_font-sty{
  font-size: 14px;
}
.phone_left_sty{
  margin-left: 10px;
}
.content_color_sty{
  color: #666666;
}
.patent_top_sty{
  margin-top: 3px;
}
</style>
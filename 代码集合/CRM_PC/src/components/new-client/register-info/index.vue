<template>
 <div>
   <div class="new_left_span" v-if="showTitle">
      <span></span>
      <span>注册信息</span>
    </div>
  <div class="new_register_info">
    <!-- 单位客户 -->
    <div class="basic_info_contain_parent" v-if="basicData.accountType == 1">
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>账号类型：</span>
        <span v-if="basicData.accountType!==null">
          <span>{{ basicData.accountType | accountTypeChange}}</span>
          <el-tooltip class="item" effect="dark" content="账号类型与线索类型冲突" placement="top-start">
            <span v-if="Number(userData.clueType)!==basicData.accountType" class="chong_tu_sty">!</span>
          </el-tooltip>
        </span>
        <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
       <div class="basic_info_contain">
       <div class="basic_info_item" v-if="innerInfo&&innerInfo.name!==null">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span>
        <span>{{ innerInfo.name }}</span>
        <span class="span_left_sty" v-if="innerInfo.job&&innerInfo.job!==null">{{ innerInfo.job }}</span>
        <span class="span_left_sty" v-else>暂无数据</span>
        </div>
      <div v-else class="basic_info_item">
        <span>联&nbsp;&nbsp;系&nbsp;&nbsp;人：</span>
        <span>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>单位名称：</span>
         <span v-if="source">
           <span v-if="innerInfo.orgName&&innerInfo.orgName!==null">{{ innerInfo.orgName }}</span>
           <span v-else>暂无数据</span>
        </span>
        <span v-else>
          <span v-if="type == 0">
            <span v-if="innerInfo.orgName&&innerInfo.orgName!==null">{{ innerInfo.orgName }}</span>
            <span v-else>暂无数据</span>
          </span>
          <span v-if="type == 1">
            <span v-if="innerInfo.pwdOrgName&&innerInfo.pwdOrgName!==null">{{ innerInfo.pwdOrgName }}</span>
            <span v-else>暂无数据</span>
          </span>
        </span>
      </div>
      </div>
       <div class="basic_info_contain">
        <div class="basic_info_item" v-if="type == 0">
        <span>信用代码：</span>
         <span v-if="basicData.creditCode!==null">{{ basicData.creditCode }}</span>
         <span v-else>暂无数据</span>
        </div>
        <div class="basic_info_item" v-if="type == 1">
        <span>信用代码：</span>
         <span v-if="basicData.pwdCreditCode!==null">{{ basicData.pwdCreditCode }}</span>
         <span v-else>暂无数据</span>
        </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
          <span>单位类型：</span>
          <span v-if="innerInfo.orgTypeName&&innerInfo.orgTypeName!==null">{{ innerInfo.orgTypeName }}</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
       <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>行业类型：</span>
        <span v-if="innerInfo.industry&&innerInfo.industry!==null">{{ innerInfo.industry }}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>企业数据：</span>
        <span>专利：</span>
        <span v-if="unitVO&&unitVO.orgPatentNumber&&unitVO.orgPatentNumber!==null">{{ unitVO.orgPatentNumber }}件</span>
        <span v-else>暂无数据</span>
        <span class="span_left_sty">上一年销售额：</span>
        <span v-if="unitVO&&unitVO.orgSalesYearName&&unitVO.orgSalesYearName!==null">{{ unitVO.orgSalesYearName }}</span>
        <span v-else>暂无数据</span>
        <span class="span_left_sty">单位人数：</span>
        <span v-if="unitVO&&unitVO.orgEmployeesNumberName&&unitVO.orgEmployeesNumberName!==null">{{ unitVO.orgEmployeesNumberName }}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
          <span>所在地区：</span>
          <span v-if="innerInfo.orgAddress&&innerInfo.orgAddress!==null">{{ innerInfo.orgAddress}}</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
       <div class="basic_info_contain">
        <div class="basic_info_item">
          <span>详细地址：</span>
          <span v-if="innerInfo.orgDetailAddress&&innerInfo.orgDetailAddress!==null">{{ innerInfo.orgDetailAddress}}</span>
          <span v-else>暂无数据</span>
        </div>
      </div>
    </div>
    <!-- 个人客户 -->
    <div class="basic_info_contain_parent" v-else>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>账号类型：</span>
        <span v-if="basicData.accountType!==null">
          <span>{{ basicData.accountType | accountTypeChange}}</span>
          <el-tooltip class="item" effect="dark" content="账号类型与线索类型冲突" placement="top-start">
            <span v-if="Number(userData.clueType)!==basicData.accountType" class="chong_tu_sty">!</span>
          </el-tooltip>
        </span>
        <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
        <span v-if="innerInfo&&innerInfo.name!==null">{{ innerInfo.name }}</span>
        <span v-else>暂无数据</span>
        </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item" v-if="innerInfo&&innerInfo.name!==null">
        <span>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务：</span>
        <span v-if="innerInfo.job&&innerInfo.job!==null">{{ innerInfo.job }}</span>
        <span v-else>暂无数据</span>
        </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>单位名称：</span>
         <span v-if="source">
           <span v-if="innerInfo.orgName&&innerInfo.orgName!==null">{{ innerInfo.orgName }}</span>
           <span v-else>暂无数据</span>
        </span>
        <span v-else>
          <span v-if="type == 0">
            <span v-if="innerInfo.orgName&&innerInfo.orgName!==null">{{ innerInfo.orgName }}</span>
            <span v-else>暂无数据</span>
          </span>
          <span v-if="type == 1">
            <span v-if="basicData.accountType == 0">
              <span v-if="innerInfo.orgName&&innerInfo.orgName!==null">{{ innerInfo.orgName }}</span>
              <span v-else>暂无数据</span>
            </span>
            <span v-if="basicData.accountType == 1">
              <span v-if="innerInfo.pwdOrgName&&innerInfo.pwdOrgName!==null">{{ innerInfo.pwdOrgName }}</span>
              <span v-else>暂无数据</span>
            </span>
          </span>
        </span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>单位类型：</span>
        <span v-if="innerInfo.orgTypeName&&innerInfo.orgTypeName!==null">{{ innerInfo.orgTypeName }}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>行业类型：</span>
        <span v-if="innerInfo.industry&&innerInfo.industry!==null">{{ innerInfo.industry }}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
        <div class="basic_info_item" v-if="dialog">
        <span>所在地区：</span>
        <span v-if="innerInfo.orgAddress&&innerInfo.orgAddress!==null">{{ innerInfo.orgAddress }}</span>
        <span v-else>暂无数据</span>
      </div>
      <div class="basic_info_item" v-else>
        <span>所在地区：</span>
        <span v-if="innerInfo.orgAddressNameList&&innerInfo.orgAddressNameList.length>0">{{ innerInfo.orgAddressNameList|arrFilter }}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>详细地址：</span>
        <span v-if="innerInfo.orgDetailAddress&&innerInfo.orgDetailAddress!==null">{{ innerInfo.orgDetailAddress}}</span>
        <span v-else>暂无数据</span>
      </div>
      </div>
    </div>
    <!-- 注册信息 -->
    <div class="basic_info_contain_parent">
      <div class="basic_info_contain">
      <div class="basic_info_item">
          <span>用&nbsp;&nbsp;户&nbsp;&nbsp;ID：</span>
          <span v-if="innerInfo.userNo&&innerInfo.userNo!==null">{{innerInfo.userNo}}</span>
          <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
       <div class="basic_info_contain">
        <div class="basic_info_item">
        <span>手&nbsp;&nbsp;机&nbsp;&nbsp;号：</span>
        <span v-if="type==1">
          <span v-if="basicData.phone!==null">{{basicData.phone}}</span>
          <span v-else-if="basicData.accountNo!==null">{{basicData.accountNo}}</span>
          <span v-else>{{$t('message.noData')}}</span>
        </span>
        <span v-else>
          <span v-if="basicData.accountNo!==null">{{basicData.accountNo}}</span>
          <span v-else>{{$t('message.noData')}}</span>
        </span>
      </div>
       </div>
      <div class="basic_info_contain">
         <div class="basic_info_item">
          <span>微信绑定：</span>
          <span v-if="basicData.bindAccount!==null">{{ basicData.bindAccount | wxfilter }}</span>
          <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>注册时间：</span>
        <span v-if="basicData.registTime!==null">{{ basicData.registTime }}</span>
        <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
       <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>注册来源：</span>
        <span v-if="basicData.registTime!==null">{{ basicData.terminalType | terminalChange }}</span>
        <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>认证时间：</span>
        <span v-if="basicData.auditTime!==null">{{ basicData.auditTime }}</span>
        <span v-else>未认证</span>
      </div>
      </div>
      <div class="basic_info_contain">
      <div class="basic_info_item">
        <span>认证来源：</span>
        <span v-if="basicData.authSource!==null">{{ basicData.authSource|certifyFilter }}</span>
        <span v-else>{{$t('message.noData')}}</span>
      </div>
      </div>
    </div>
  </div>
 </div>
</template>

<script>
export default {
    props:['userData','type','source','basicData','innerInfo','unitVO','dialog','showTitle'],
  data() {
    return {};
  },
  filters:{
    accountTypeChange(val){
      return val == 0? "个人" : val == 1?"单位" : ""
    },
    wxfilter(val){            
      return val == true? "已绑定" : "未绑定";
    },
    valiData(val){
      return val == null? '不详' : val
    },
    noDate(val){
      return val == null? '暂无数据' :val == ''?'暂无数据':val
    },
    terminalChange(val){
      return val == '0'? "移动端" : val == '1'? "pc端" : val == '2'?"小程序":""
    },
    certifyFilter(val){
      return val == 1? "移动端" : val == 0? "pc端" : val == 2?"小程序":""
    },
    arrFilter(val){
      return val.join(',')
    }
  }
};
</script>

<style scoped>
.new_register_info{
  margin-top: 10px;
  padding-bottom: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.new_left_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0 25px 0px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
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
  color: #666666;
  font-weight: bold;
}
.basic_info_contain_parent {
  margin: 0px 0 60px 0;
}
.basic_info_contain_parent:nth-of-type(2){
  margin-left: 80px !important;
}
.basic_info_contain {
  display: flex;
  margin-bottom: 30px;
}
.basic_info_contain > .basic_info_item:nth-of-type(1) {
  flex: 1;
  font-size: 14px;
}
.basic_info_contain > .basic_info_item:nth-of-type(2) {
  flex: 1.5;
  font-size: 14px;
}
.span_left_sty{
  margin-left: 15px;
}
.chong_tu_sty{
  display: inline-block;
  width: 15px;
  height: 15px;
  background: red;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  margin-left: 5px;
}
</style>
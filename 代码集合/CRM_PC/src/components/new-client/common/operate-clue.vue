<template>
<!-- 排查完成 -->
  <div class="new-create-clue">
   <el-form :model="basicInfo" ref="basicInfo" label-width="110px" :rules="clueRules" >
        <el-form-item label="线索类型：" prop="clueType">
          <el-radio-group v-model="basicInfo.clueType" v-if="!editClue" @change="changeType">
            <el-radio :label="1">单位线索</el-radio>
            <el-radio :label="0">个人线索</el-radio>
          </el-radio-group>
          <div v-if="editClue">
            <span v-if="basicInfo.clueType == 1">单位线索</span>
            <span v-if="basicInfo.clueType == 0">个人线索</span>
          </div>
        </el-form-item>
   </el-form>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="*基本信息" name="first"></el-tab-pane>
      <el-tab-pane v-if="basicInfo.clueType == 1" label="单位数据" name="second"></el-tab-pane>
      <el-tab-pane v-if="basicInfo.clueType == 1" label="人员信息" name="third"></el-tab-pane>
      <el-tab-pane label="开票信息" name="fourth"></el-tab-pane>
    </el-tabs>

    <!-- 基本信息 -->
    <div v-show="activeName == 'first'">
      <el-form :model="basicInfo" ref="basicInfo" label-width="110px" :rules="clueRules" >
        <el-form-item class="block label-sty" label="线索标签：" prop="clueMark">
          <el-select value-key="id" v-model="basicInfo.clueMark">
            <el-option v-for="(item,index) in clueLabelList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div class="contact_sty" v-if="basicInfo.clueType == 0">
        <div class="item_contact_sty">
          <el-form-item label="联 系 人：" prop="contactName">
        <el-input v-model.trim="basicInfo.contactName" :disabled="contactOneNameStatus" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contactJob" label-width="20px">
          <el-input v-model.trim="basicInfo.contactJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label-width="20px" v-if="!editClue">
          <el-input :disabled="createType == 0?true:false" @change="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" @keyup.native="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" v-model.trim="basicInfo.contactPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label-width="20px" v-if="editClue">
          <el-input :disabled="contactOnePhoneStatus" @change="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" @keyup.native="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" v-model.trim="basicInfo.contactPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        </div>
        </div>
         <div class="form-item" v-if="basicInfo.clueType == 0">                
           <el-form-item class="item-label" label="性别：" label-width="95px">
          <el-radio-group v-model="basicInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        </div>
        <div class="form-item">
          <span class="required" v-if="basicInfo.clueType ==1">*</span>&nbsp;                    
          <el-form-item class="item-label" label="单位名称：" prop="unitName" v-if="basicInfo.clueType == 1&&!editClue">
              <el-input v-model.trim="basicInfo.unitName" maxlength="50" show-word-limit placeholder="请输入企业营业执照全称"></el-input>           
          </el-form-item>
          <el-form-item class="item-label" label="单位名称：" prop="unitName" v-if="basicInfo.clueType == 1&&editClue">
              <el-input :disabled="(userInfo.certifiedType!=0)" v-model.trim="basicInfo.unitName" maxlength="50" show-word-limit placeholder="请输入企业营业执照全称"></el-input>           
          </el-form-item>
          <el-form-item class="item-label" label="单位名称：" v-if="basicInfo.clueType == 0">
              <el-input v-model.trim="basicInfo.unitName" maxlength="50" show-word-limit placeholder="请输入企业营业执照全称"></el-input>           
          </el-form-item>
        </div>
        <div class="form-item" v-if="basicInfo.clueType == 1&&!editClue">
          <span class="required">*</span>&nbsp;                    
          <el-form-item class="item-label" label="信用代码：" prop="uscc">
            <el-input maxlength="18" @change="basicInfo.uscc = oninputForBank(basicInfo.uscc)" @keyup.native="basicInfo.uscc = oninputForBank(basicInfo.uscc)" v-model.trim="basicInfo.uscc" show-word-limit placeholder="请输入单位的统一社会信用代码"></el-input>           
          </el-form-item>
        </div>
        <div class="form-item" v-if="basicInfo.clueType == 1&&editClue">
          <span class="required">*</span>&nbsp;                    
          <el-form-item class="item-label" label="信用代码：" prop="uscc">
            <el-input :disabled="(userInfo.certifiedType!=0)" maxlength="18" @change="basicInfo.uscc = oninputForBank(basicInfo.uscc)" @keyup.native="basicInfo.uscc = oninputForBank(basicInfo.uscc)" v-model.trim="basicInfo.uscc" show-word-limit placeholder="请输入单位的统一社会信用代码"></el-input>           
          </el-form-item>
        </div>
        <div class="form-item">
          <span class="required" v-if="basicInfo.clueType ==1">*</span>&nbsp;                    
          <el-form-item class="item-label" label="单位类型：" prop="unitType">
            <el-select v-model="basicInfo.unitType">
              <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item">
          <span class="required" v-if="basicInfo.clueType ==1">*</span>&nbsp;                    
          <el-form-item class="item-label" label="行业类型：" prop="industry">
            <el-select v-model="basicInfo.industry" :multiple="true" :multiple-limit="3">
              <el-option v-for="(item,index) in industryTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item">
          <span class="required" v-if="basicInfo.clueType ==1">*</span>&nbsp;                    
          <el-form-item class="item-label" label="所在地区：" prop="area">
            <el-cascader :options="areaTree" v-model="basicInfo.area" :props="{value: 'id',label: 'areaName'}"/>
          </el-form-item>
        </div>                        
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input v-model.trim="basicInfo.detailAddress" maxlength="100" show-word-limit placeholder="请填写"></el-input>
        </el-form-item>
        <div class="contact_sty" v-if="basicInfo.clueType == 1">
         <div class="item_contact_sty">
         <el-form-item label="联 系 人1：" prop="contactName">
          <el-input class="input_item_sty" :disabled="contactOneNameStatus" v-model.trim="basicInfo.contactName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contactJob" label-width="20px">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contactJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label-width="20px" v-if="editClue">
          <el-input class="input_item_sty" :disabled="contactOnePhoneStatus" @change="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" @keyup.native="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" v-model.trim="basicInfo.contactPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label-width="20px" v-if="!editClue">
          <el-input class="input_item_sty" :disabled="createType == 0?true:false" @change="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" @keyup.native="basicInfo.contactPhone = oninputForPhone(basicInfo.contactPhone)" v-model.trim="basicInfo.contactPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item label-width="15px" v-if="createType == 1&&contactInfoList.length == 0">
          <el-button class="com_sty_add" @click="changeContactIndex(true)">+</el-button>
        </el-form-item>
         </div>
         <div v-if="contactInfoList.length>0">
        <div class="item_contact_sty" v-for="(item,index) in contactInfoList" :key="index">
         <el-form-item :label="'联 系 人'+(index+2)+'：'">
          <el-input class="input_item_sty" :disabled="item.contactNameStatus" v-model.trim="item.contactName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-input class="input_item_sty" v-model.trim="item.contactJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-input class="input_item_sty" :disabled="item.contactPhoneStatus" @change="item.contactPhone = oninputForPhone(item.contactPhone)" @keyup.native="item.contactPhone = oninputForPhone(item.contactPhone)" v-model.trim="item.contactPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item label-width="15px" v-if="createType == 1">
          <el-button class="com_sty_add" @click="changeContactIndex(false,index)">-</el-button>
        </el-form-item>
        <el-form-item label-width="15px" v-if="createType == 1&&(index == contactInfoList.length-1)">
          <el-button class="com_sty_add" @click="changeContactIndex(true,index)">+</el-button>
        </el-form-item>
         </div>
         </div>
        </div>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" :rows="5" maxlength="500" show-word-limit v-model="basicInfo.remarks"></el-input>
        </el-form-item>
        <el-form-item v-if="!newUserInfo.isPartner&&!this.editClue" label="分配业务员：" prop="allotSalesMan" label-width="110px">
          <el-cascader ref="salesman" filterable clearable :show-all-levels='false' :options="empList" :before-filter="beforeFilter" v-model="basicInfo.allotSalesMan">
            <template slot-scope="{data}">
              <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                <div slot="content">{{data.customerNo}}</div>
                <span>{{data.label}}</span>
              </el-tooltip>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item v-if="newUserInfo.isPartner&&!this.editClue" label="分配业务员：" label-width="110px">
          <span>{{connectEmpInfo.connectEmpName}}</span>
        </el-form-item>
      </el-form>
    </div>

    <!-- 单位数据 -->
    <div v-if="activeName == 'second'&&basicInfo.clueType == 1">
      <el-form :model="unitData" ref="unitData" inline label-width="125px">
        <!-- 知产情况 -->
        <div class="basic_unit_span">
        <span></span>
        <span>知产情况</span>
        </div>
        <el-form-item label="发明专利数量：" prop="inventionPatentCount">
          <el-input disabled type="number" placeholder="请输入" v-model="unitData.inventionPatentCount"></el-input>
        </el-form-item>
        <el-form-item label="商  标  数  量：" prop="trademarkCount">
          <el-input disabled type="number" placeholder="请输入" v-model.trim="unitData.trademarkCount"></el-input>
        </el-form-item>
        <el-form-item label="实用专利数量：" prop="usefulPatentCount">
          <el-input disabled type="number" placeholder="请输入"  v-model.trim="unitData.usefulPatentCount"></el-input>
        </el-form-item>
        <el-form-item label="版  权  数  量：" prop="copyrightCount">
          <el-input disabled type="number" placeholder="请输入" v-model.trim="unitData.copyrightCount"></el-input>
        </el-form-item>
        <el-form-item label="外观专利数量：" prop="facePtentCount">
          <el-input disabled type="number" placeholder="请输入" v-model.trim="unitData.facePtentCount"></el-input>
        </el-form-item>
        <el-form-item label="其他知产数量：" prop="otherPropertyCount">
          <el-input disabled type="number" placeholder="请输入" v-model.trim="unitData.otherPropertyCount"></el-input>
        </el-form-item>
        <!-- 财务及人员情况 -->
        <div class="basic_unit_span long-sty">
        <span></span>
        <span>财务及人员情况 <span class="left-sty" v-if="this.editClue">{{currentYear}}</span></span>
        </div>
        <el-form-item label="上年度销售总额：" prop="lastYearSalesCount">
          <el-select disabled type="number" v-model="unitData.lastYearSalesCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearSalesCountDetail">
          <el-input disabled type="number" placeholder="请输入" @change="unitData.lastYearSalesCountDetail = oninput(unitData.lastYearSalesCountDetail)" @keyup.native="unitData.lastYearSalesCountDetail = oninput(unitData.lastYearSalesCountDetail)" v-model.trim="unitData.lastYearSalesCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度资产总计：" prop="lastYearCapitalCount">
          <el-select disabled type="number" v-model="unitData.lastYearCapitalCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearCapitalCountDetail">
          <el-input disabled type="number" placeholder="请输入" @change="unitData.lastYearCapitalCountDetail = oninput(unitData.lastYearCapitalCountDetail)" @keyup.native="unitData.lastYearCapitalCountDetail = oninput(unitData.lastYearCapitalCountDetail)" v-model.trim="unitData.lastYearCapitalCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度利润总额：" prop="lastYearProfitCount">
          <el-select disabled type="number" v-model="unitData.lastYearProfitCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearProfitCountDetail">
          <el-input disabled type="number" placeholder="请输入" @change="unitData.lastYearProfitCountDetail = oninput(unitData.lastYearProfitCountDetail)" @keyup.native="unitData.lastYearProfitCountDetail = oninput(unitData.lastYearProfitCountDetail)" v-model.trim="unitData.lastYearProfitCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度研费总额：" prop="lastYearDevelopCount">
          <el-select disabled type="number" v-model="unitData.lastYearDevelopCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearDevelopCountDetail">
          <el-input disabled type="number" placeholder="请输入" @change="unitData.lastYearDevelopCountDetail = oninput(unitData.lastYearDevelopCountDetail)" @keyup.native="unitData.lastYearDevelopCountDetail = oninput(unitData.lastYearDevelopCountDetail)" v-model.trim="unitData.lastYearDevelopCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="单    位   人   数：" prop="unitPersonCount">
          <el-select disabled type="number" v-model="unitData.unitPersonCount">
            <el-option v-for="(item,index) in unitNumberList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（人）：" prop="unitPersonCountDetail">
          <el-input disabled type="number" placeholder="请输入" @change="unitData.unitPersonCountDetail = oninput(unitData.unitPersonCountDetail)" @keyup.native="unitData.unitPersonCountDetail = oninput(unitData.unitPersonCountDetail)" v-model.trim="unitData.unitPersonCountDetail"></el-input>
        </el-form-item>
        <!-- 主营业务 -->
        <div class="basic_unit_span">    
        <span></span>
        <span>主营业务</span>
        </div>
        <el-form-item prop="mainBusiness">
          <el-input type="textarea" :rows="5" style="width:350%;" maxlength="500" show-word-limit v-model="unitData.mainBusiness"></el-input>
        </el-form-item>
        <!-- 下一步项目规划 -->
        <div class="basic_unit_span">
        <span></span>
        <span>下一步项目规划</span>
        </div>
        <el-form-item prop="nextProjectPlan">
          <el-input type="textarea" :rows="5" style="width:350%;" maxlength="500" show-word-limit v-model="unitData.nextProjectPlan"></el-input>
        </el-form-item>
        </el-form>
        </div>

    <!-- 人员信息 -->
    <div v-if="activeName == 'third'&&basicInfo.clueType == 1">
      <el-form :model="personInfo" ref="personInfo" inline label-width="100px">
        <el-form-item label="法人：" prop="legalPerson" v-if="!editClue">
          <el-input placeholder="请输入姓名" v-model="personInfo.legalPerson"></el-input>
        </el-form-item>
        <el-form-item label="法人：" prop="legalPerson" v-if="editClue">
          <el-input :disabled="userInfo.certifiedType!=0" placeholder="请输入姓名" v-model="personInfo.legalPerson"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="legalPersonPhone" v-if="!editClue">
          <el-input @change="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" @keyup.native="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" placeholder="请输入电话" v-model.trim="personInfo.legalPersonPhone"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="legalPersonPhone" v-if="editClue">
          <el-input :disabled="userInfo.certifiedType!=0" @change="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" @keyup.native="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" placeholder="请输入电话" v-model.trim="personInfo.legalPersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="财务主管：" prop="treasurer">
          <el-input placeholder="请输入姓名" v-model="personInfo.treasurer"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="treasurerPhone">
          <el-input @change="personInfo.treasurerPhone = oninputForPhone(personInfo.treasurerPhone)" @keyup.native="personInfo.treasurerPhone = oninputForPhone(personInfo.treasurerPhone)" placeholder="请输入电话" v-model.trim="personInfo.treasurerPhone"></el-input>
        </el-form-item>
        <el-form-item label="技术主管：" prop="technicalDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.technicalDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="technicalDirectorPhone">
          <el-input @change="personInfo.technicalDirectorPhone = oninputForPhone(personInfo.technicalDirectorPhone)" @keyup.native="personInfo.technicalDirectorPhone = oninputForPhone(personInfo.technicalDirectorPhone)" placeholder="请输入电话" v-model.trim="personInfo.technicalDirectorPhone"></el-input>
        </el-form-item>
        <el-form-item label="营销主管：" prop="marketingDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.marketingDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="marketingDirectorPhone">
          <el-input @change="personInfo.marketingDirectorPhone = oninputForPhone(personInfo.marketingDirectorPhone)" @keyup.native="personInfo.marketingDirectorPhone = oninputForPhone(personInfo.marketingDirectorPhone)" placeholder="请输入电话" v-model.trim="personInfo.marketingDirectorPhone"></el-input>
        </el-form-item>
        <el-form-item label="行政主管：" prop="executiveDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.executiveDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="executiveDirectorPhone">
          <el-input @change="personInfo.executiveDirectorPhone = oninputForPhone(personInfo.executiveDirectorPhone)" @keyup.native="personInfo.executiveDirectorPhone = oninputForPhone(personInfo.executiveDirectorPhone)" placeholder="请输入电话" v-model.trim="personInfo.executiveDirectorPhone"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 开票信息 -->
    <div v-if="activeName == 'fourth'">
      <el-form :model="billingInfo" ref="billingInfo" label-width="100px">
        <el-form-item label="单位名称：" prop="unitName" v-if="basicInfo.clueType == 0">
          <el-input placeholder="请输入" v-model.trim="billingInfo.unitName"></el-input>
        </el-form-item>
        <el-form-item label="单位名称：" prop="unitName" v-if="basicInfo.clueType == 1">
          <el-input disabled placeholder="由基本信息获取，无需填写" v-model.trim="billingInfo.unitName"></el-input>
        </el-form-item>
        <el-form-item label="发票税号：" prop="billingNumber" v-if="basicInfo.clueType == 0">
          <el-input @change="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" @keyup.native="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" placeholder="请输入" v-model="billingInfo.billingNumber"></el-input>
        </el-form-item>
        <el-form-item label="发票税号：" prop="billingNumber" v-if="basicInfo.clueType == 1">
          <el-input disabled @change="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" @keyup.native="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" placeholder="由基本信息获取，无需填写" v-model="billingInfo.billingNumber"></el-input>
        </el-form-item>
        <el-form-item label="注册地址：" prop="registerAddress">
          <el-input placeholder="请输入" maxlength="100" show-word-limit v-model.trim="billingInfo.registerAddress"></el-input>
        </el-form-item>
        <el-form-item label="注册电话：" prop="registerPhone">
          <el-input @change="billingInfo.registerPhone = oninputForPhone(billingInfo.registerPhone)" @keyup.native="billingInfo.registerPhone = oninputForPhone(billingInfo.registerPhone)" placeholder="请输入" v-model="billingInfo.registerPhone"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="depositBank">
          <el-input placeholder="请输入" v-model.trim="billingInfo.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccountNo">
          <el-input @change="billingInfo.bankAccountNo = oninputForPhone(billingInfo.bankAccountNo)" @keyup.native="billingInfo.bankAccountNo = oninputForPhone(billingInfo.bankAccountNo)" placeholder="请输入" v-model="billingInfo.bankAccountNo"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="basic_btn_sty">
      <el-button size="medium" type="primary" v-preventReClick @click="operateClue()">确定</el-button>
      <el-button size="medium" class="btn_left_handle" @click="handleClose()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { getEmpList} from '@/api/clue/clue'
import { operateClue,getConnectEmp } from "@/api/new-client/my-clue"
import * as CodeMsg from "@/api/common/CodeChange"
import { mapState } from "vuex";
export default {
  props:{
    createType:{//创建方式 0: 用户转化 1: 手动创建线索
      default:1,
      required: false
    },
    userInfo:{ //用户、线索编辑回显
      type: Object,
      required : false
    },
    editClue:{ // true: 线索编辑 false: 创建线索
      type: Boolean,
      default:false,
      required: false
    },
    financeInfo:{ // 财务及人员信息
      required: false
    }
  },
  data() {
    var validateNull = (rule, value, callback)=>{//个人线索非必填
      if(value){
        callback();
      }else{
        if(this.basicInfo.clueType==1){
          callback(new Error('请选择'));
        }else{
          callback();
        }
      }
    };
    var validateArrayNull = (rule, value, callback)=>{//个人线索非必填
      if(value.length>0){
        callback();
      }else{
        if(this.basicInfo.clueType==1){
          callback(new Error('请选择'));
        }else{
          callback();
        }
      }
    };
    var validateName = (rule, value, callback) => {//单位名称验证
      if (value === '') {
        if(this.basicInfo.clueType==1){
          callback(new Error('请输入单位名称'));
        }else{
          callback();
        }
      } else {
        callback();
      };
    };
    var validateContactPhone = (rule, value, callback)=>{//联系人手机号码验证
      if(value == ''){
        callback(new Error('请输入联系人电话'));
      }else{
        callback();
      };
    };
    var validateClueMark = (rule, value, callback)=>{//联系人手机号码验证
      if(value.id == ''){
        callback(new Error('请选择线索标签'));
      }else{
        callback();
      }
    };
    var validateCode = (rule, value, callback)=>{//联系人手机号码验证
    console.log(value.length,'长度')
      if(value.length!==18){
        callback(new Error('请填写18位的统一社会信用代码'));
      }else{
        callback();
      }
    };
    return {
      currentYear:'', // 财务及人员年份值，默认上一年
      connectEmpInfo:{},
      contactOneNameStatus:false,
      contactOnePhoneStatus:false,
      combineClueId:"", // 40001专属合并clueId
      combineStatus:false, // combineStatus：true-合并 false-不合并
      auditStatus:"",
      activeName: "first",
      contactInfoList:[], // 可添加联系人信息-数量无限制
      basicInfo: {
        sex:'',
        clueType: 1,
        clueMark:{
          id:""
        },
        unitName:"",
        unitType:"",
        uscc:"", // 统一社会信用代码
        industry:[],
        area:[],
        detailAddress:"",
        contactName:"",
        contactJob:"",
        contactPhone:"",
        remarks:"",
        allotSalesMan:[],
        allotSalesManNo:"",
        allotSalesManId:"",
        allotSalesManLabel:""
      },
       clueRules:{
        clueType: [{required: true, message: '请选择线索类型', trigger: 'change' }],
        clueMark: [{required: true, validator: validateClueMark, trigger: 'change' }],
        unitName: [{validator: validateName, trigger: 'change' }],
        unitType: [{validator: validateNull, trigger: 'change' }],
        area: [{validator: validateArrayNull, trigger: 'change'}],
        industry: [{validator: validateArrayNull, trigger: 'change'}],
        contactName: [{required: true, message: '请输入联系人姓名', trigger: 'change' }],
        contactJob: [{required: true, message: '请输入联系人职务', trigger: 'change' }],
        contactPhone: [{required: true, validator: validateContactPhone, trigger: 'change' }],
        uscc: [{required: true,validator: validateCode, trigger: 'change' }],
        allotSalesMan: [{required: true, message: '请选择', trigger: 'change' }],
      },
      unitData: {
        inventionPatentCount:"", // 发明专利数量
        usefulPatentCount:"", // 实用专利数量
        facePtentCount:"", // 外观数量
        trademarkCount:"", // 商标数量
        copyrightCount:"", // 版权数量
        otherPropertyCount:"", // 其他知产数量
        lastYearSalesCount:"", // 上一年销售总额
        lastYearSalesCountDetail:"",
        lastYearCapitalCount:"", // 上一年资产总额
        lastYearCapitalCountDetail:"",
        lastYearProfitCount:"", // 上一年利润总额
        lastYearProfitCountDetail:"",
        lastYearDevelopCount:"", // 上一年销研发总额
        lastYearDevelopCountDetail:"",
        unitPersonCount:"", // 单位人数
        unitPersonCountDetail:"",
        mainBusiness:"", // 主营业务
        nextProjectPlan:"" // 下一步项目规划
      },
      personInfo: {
        legalPerson:"", // 法人
        legalPersonPhone:"",
        treasurer:"", // 财务主管
        treasurerPhone:"",
        technicalDirector:"", // 技术主管
        technicalDirectorPhone:"",
        marketingDirector:"", // 营销主管
        marketingDirectorPhone:"",
        executiveDirector:"", // 行政主管
        executiveDirectorPhone:""
      },
      billingInfo: {
        unitName:"", // 单位名称
        billingNumber:"", // 发票税号
        registerAddress:"", // 注册地址
        registerPhone:"", // 注册电话
        depositBank:"", // 开户银行
        bankAccountNo:"" // 银行账号
      },
      clueLabelList:[],
      unitTypeList:[],
      industryTypeList:[],
      lastYearsSalesList:[],
      unitNumberList:[],
      areaTree:[],
      empList:[]
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
      area: (state) => state.category.area,
      newUserInfo: (state) => state.user.userInfo,
    }),
  },
  methods:{
    getConnectEmpData(){
      if(this.newUserInfo.isPartner){
        let partnerId = this.newUserInfo.partnerId
        getConnectEmp(partnerId).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.connectEmpInfo = res.data.data
          }
        })
      }
    },
    //显示工号
    async beforeFilter() {
      await getEmpList(false).then((res) => {
        if (res.data.code == 0) {
          this.empList = res.data.data;
        }
      });
      this.$loop(this.empList[0], this.empList[0])
      return false
    },
    changeType(){
      this.activeName = 'first'
    },
    getSalesmanInfo(){
      let object = this.$refs.salesman.getCheckedNodes()[0].data
      this.basicInfo.allotSalesManNo = object.customerNo
      this.basicInfo.allotSalesManId = object.customerId
      this.basicInfo.allotSalesManLabel = object.customerName
    },
    // type:修改类型 true-添加 false-删除 index数组下标
    changeContactIndex(type,index){
      if(type){
        let obj = {
          contactName:"",
          contactPhone:"",
          contactJob:"",
          contactNameStatus:false,
          contactPhoneStatus:false
        }
        this.contactInfoList.push(obj)
      }else{
        this.$confirm('确定删除该条数据吗？','提示',{
          type: 'warning',
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }).then(()=>{
          this.contactInfoList.splice(index,1)
        })
      }
    },
    // 校验手机号
    oninputForPhone(value){
      return value.replace(/[^\d-+]/g, "");
    },
    // 校验信用代码
    oninputForBank(value){
      return value.replace(/[^\w\.\/]/ig,'')
    },
    // 校验数量
    oninputForPatent(value) {
      if(value.length == 1){
        return value.replace(/[^1-9]/g,'0')
        } else {
        return value.replace(/\D/g,'')
      }
    },
    // 校验数字
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value = value.indexOf(".") > 0 ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1] : value.substring(0, 10);
      return value;
    },
    // 返回单位数据
    fixCompanyUnitQuery(){
      let object = { 
        inventionNum:this.basicInfo.clueType == 0?"":this.unitData.inventionPatentCount, // 发明专利数量
        practicalNum:this.basicInfo.clueType == 0?"":this.unitData.usefulPatentCount, // 实用专利数量
        appearanceNum:this.basicInfo.clueType == 0?"":this.unitData.facePtentCount, // 外观专利数量
        trademarkNum:this.basicInfo.clueType == 0?"":this.unitData.trademarkCount, // 商标数量
        copyrightNum:this.basicInfo.clueType == 0?"":this.unitData.copyrightCount, // 版权数量
        otherNum:this.basicInfo.clueType == 0?"":this.unitData.otherPropertyCount, // 其他知产数量
        mainBusiness:this.basicInfo.clueType == 0?"":this.unitData.mainBusiness, // 主营业务
        nextPlanning:this.basicInfo.clueType == 0?"":this.unitData.nextProjectPlan, // 规划
       }
       // 只有创建时才传-编辑从任务那边编辑
       if(!this.editClue){
        object.lastYearSale = this.basicInfo.clueType == 0?"":this.unitData.lastYearSalesCount // 上年度销售总额id
        object.lastYearSaleAmount = this.basicInfo.clueType == 0?"":this.unitData.lastYearSalesCountDetail, 
        object.lastYearAssets = this.basicInfo.clueType == 0?"":this.unitData.lastYearCapitalCount // 上年度资产总计id
        object.lastYearAssetsAmount = this.basicInfo.clueType == 0?"":this.unitData.lastYearCapitalCountDetail
        object.lastYearProfit = this.basicInfo.clueType == 0?"":this.unitData.lastYearProfitCount // 上年度利润总额id
        object.lastYearProfitAmount = this.basicInfo.clueType == 0?"":this.unitData.lastYearProfitCountDetail
        object.lastYearDevExpenses = this.basicInfo.clueType == 0?"":this.unitData.lastYearDevelopCount // 上年度研费总额id
        object.lastYearDevExpensesAmount = this.basicInfo.clueType == 0?"":this.unitData.lastYearDevelopCountDetail, 
        object.unitEmployees = this.basicInfo.clueType == 0?"":this.unitData.unitPersonCount // 单位人数id
        object.unitEmployeesNum = this.basicInfo.clueType == 0?"":this.unitData.unitPersonCountDetail
       }
      return object
    },
     // 返回人员数据
    fixCompanyStaffQuery(){
      let object = { 
        legalName: this.basicInfo.clueType == 0?"":this.personInfo.legalPerson, // 法人
        legalMobile: this.basicInfo.clueType == 0?"":this.personInfo.legalPersonPhone, 
        treasurerName: this.basicInfo.clueType == 0?"":this.personInfo.treasurer, // 财务主管
        treasurerMobile: this.basicInfo.clueType == 0?"":this.personInfo.treasurerPhone, 
        technicalName: this.basicInfo.clueType == 0?"":this.personInfo.technicalDirector, // 技术主管
        technicalMobile: this.basicInfo.clueType == 0?"":this.personInfo.technicalDirectorPhone, 
        marketingName: this.basicInfo.clueType == 0?"":this.personInfo.marketingDirector, // 营销主管
        marketingMobile: this.basicInfo.clueType == 0?"":this.personInfo.marketingDirectorPhone, 
        administrativeName: this.basicInfo.clueType == 0?"":this.personInfo.executiveDirector, // 人事主管
        administrativeMobile: this.basicInfo.clueType == 0?"":this.personInfo.executiveDirectorPhone,
      }
      return object
    },
     // 返回开票数据
    fixInvoiceQuery(){
      let object = { 
        registerAddress:this.billingInfo.registerAddress, // 注册地址
        registerMobile:this.billingInfo.registerPhone, // 注册电话
        bankName:this.billingInfo.depositBank, // 开户银行
        bankAccount:this.billingInfo.bankAccountNo, // 银行账号
      }
      // 创建和编辑个人线索时才传
      if(this.basicInfo.clueType == 0){
        object.companyName = this.billingInfo.unitName // 单位名称
        object.organization = this.billingInfo.billingNumber // 发票税号
      }
      return object
    },
    // 返回联系人信息
    fixcontactQuery(){
      let contactList = [ 
          {
            authStatus: this.createType == 1? "0": this.createType ==0?"1":"2", // 0-自定义 1-已注册 2-已授权
            isManager:0, // 是否管理员账号1-是 0-否
            mobile: this.basicInfo.contactPhone,
            contactName: this.basicInfo.contactName,
            jobName: this.basicInfo.contactJob,
          }
        ]
        if(this.contactInfoList.length>0){
          this.contactInfoList.forEach(item=>{
            if(item.contactPhone!=''){
              contactList.push({
                authStatus: this.createType == 1? "0": this.createType ==0?"1":"2", // 0-自定义 1-已注册 2-已授权
                isManager:0,
                mobile: item.contactPhone,
                contactName: item.contactName,
                jobName: item.contactJob,
             })
            }
          })
        }
        return contactList; 
    },
     // 编辑时返回联系人信息
    fixcontactEditQuery(){
      let contactList = [ 
          {
            authStatus: String(this.userInfo.clueCompanyContactList[0].authStatus), // 0-自定义 1-已注册 2-已授权
            isManager:this.userInfo.clueCompanyContactList[0].isManager, // 是否管理员账号1-是 0-否
            mobile: this.basicInfo.contactPhone,
            contactName: this.basicInfo.contactName,
            jobName: this.basicInfo.contactJob,
          }
        ]
        if(this.contactInfoList.length>0){
          this.contactInfoList.forEach(item=>{
            if(item.contactPhone!=''){
              contactList.push({
                authStatus: item.authStatus?String(item.authStatus):this.createType == 1? "0": this.createType ==0?"1":"2", // 0-自定义 1-已注册 2-已授权
                isManager: item.isManager?item.isManager:0,
                mobile: item.contactPhone,
                contactName: item.contactName,
                jobName: item.contactJob,
             })
            }
          })
        }
        return contactList; 
    },
    // 操作线索
    operateFinalClue(){
      let params = {
        clueGradeId: this.basicInfo.clueMark.id, // 重构线索标签
        companyName: this.basicInfo.unitName, // 重构单位名称
        orgType: this.basicInfo.unitType, // 重构单位类型
        industry: this.basicInfo.industry.join(','),  // 重构行业类型
        orgAddress: this.basicInfo.area.join(','),  // 重构所在地区
        detailAddress: this.basicInfo.detailAddress,  // 重构详细地址
        remark: this.basicInfo.remarks, // 重构备注
      }
      if(!this.newUserInfo.isPartner&&!this.editClue && this.basicInfo.allotSalesMan.length>0){ // 内部员工重构业务员
        this.getSalesmanInfo()
        params.clueSalesmanEmpNo = this.basicInfo.allotSalesManNo // 重构业务员No
        params.clueSalesmanEmpId = this.basicInfo.allotSalesManId // 重构业务员id
        params.clueSalesmanEmpName = this.basicInfo.allotSalesManLabel // 重构业务员name
      }
      if(this.newUserInfo.isPartner&&!this.editClue){ // 合作机构重构业务员
        params.clueSalesmanEmpNo = this.connectEmpInfo.connectEmpNo // 重构业务员No
        params.clueSalesmanEmpId = this.connectEmpInfo.connectEmpId // 重构业务员id
        params.clueSalesmanEmpName = this.connectEmpInfo.connectEmpName // 重构业务员name
      }
      // 创建和编辑单位线索时才传
      if(this.basicInfo.clueType == 1){
        params.organization=this.basicInfo.uscc, // 重构信用代码
        params.clueCompanyUnit = this.fixCompanyUnitQuery() // 重构单位数据
        params.clueCompanyStaff = this.fixCompanyStaffQuery() // 重构员工数据
        params.clueCompanyContactList = this.editClue == true?this.fixcontactEditQuery(): this.fixcontactQuery() // 重构联系人列表
        params.clueCompanyInvoice = this.fixInvoiceQuery() // 重构开票信息 
      }else{
        // 创建和编辑个人线索时才传
        params.sex = this.basicInfo.sex,
        params.mobile = this.basicInfo.contactPhone,
        params.contactName = this.basicInfo.contactName,
        params.jobName = this.basicInfo.contactJob
        params.cluePersonInvoice = this.fixInvoiceQuery() // 重构开票信息 
      }
      if(this.editClue){
        this.basicInfo.clueType == 1? params.clueCompanyId = this.userInfo.clueCompanyId : params.cluePersonId = this.userInfo.cluePersonId
      }
      if(this.createType == 1||this.createType == 0&&this.editClue){
        this.operateClueData(params)
      }
    },
    // 创建和编辑线索 editClue：false-创建线索 true-修改线索
    operateClueData(params){
      operateClue(params,this.editClue,this.basicInfo.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:this.editClue == false?"创建成功！":"修改成功！",
            offset:300
          })
         this.editClue == true? this.$emit('closeClueOperate'):this.$emit('close-clue')
         this.handleClose()
        }else {
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset:300
          })
        }
      })
    },
    // 检查联系人信息
    checkcontact(){
      let result = this.contactInfoList.filter(item=>{
        return (item.contactName == ''||item.contactJob == ''||item.contactPhone == '')
      })
      let resultNull = this.contactInfoList.filter(item=>{
        return (item.contactName == ''&&item.contactJob == ''&&item.contactPhone == '')
      })
      if((result.length>0&&resultNull.length==0)){
        this.$message({
            type:"warning",
            message:"请将联系人信息补充完整！",
            offset:300
          })
      }else{
        this.combineStatus = false
        this.operateFinalClue()
      }
    },
    // 提交校验
    operateClue(){
      this.$refs['basicInfo'].validate(valid=>{
        if(valid){
          this.checkcontact()
        }else{
          this.$message({
            type: "warning",
            message:"表单填写信息有误，请检查！",
            offset: 300,
          });
        }
      })
    },
    handleClose(){
      this.$emit("close-clue")
      if(!this.editClue){
        if(this.$refs['basicInfo']){
          this.$refs['basicInfo'].resetFields();
        } 
      }
      if(this.$refs['unitData']){
        this.$refs['unitData'].resetFields();
      }
      if(this.$refs['personInfo']){
        this.$refs['personInfo'].resetFields();
      }
      if(this.$refs['billingInfo']){
        this.$refs['billingInfo'].resetFields();
      }
    },
    handleClick(){
      if(this.$refs['basicInfo']&&this.activeName!=='first'){
        this.$refs['basicInfo'].clearValidate()
      }
    },
    //获取下拉框数据
    getDropData(){
      getClassifyList().then(res=>{
        if(res.data.code == 1000){
          let r = res.data.data
          this.industryTypeList = r[4].optionList;
          this.unitTypeList = r[5].optionList;
          this.lastYearsSalesList = r[6].optionList;
          this.unitNumberList = r[7].optionList;
          this.clueLabelList = r[8].optionList;
        }
      })
      getArea().then(res=>{
          if(res.data.code == 0){
            this.areaTree = res.data.data;
          }
        })
      // 去除禁用后的员工
      getEmpList(false).then(res=>{
        this.empList = res.data.data;
      })
    },
    // 回显联系人信息
    receiveContactInfo(){
      if(this.userInfo.clueCompanyContactList&&this.userInfo.clueCompanyContactList.length>0){
        let objectOne = this.userInfo.clueCompanyContactList[0]
        // 回显联系人1信息
        this.basicInfo.contactName = objectOne.contactName
        this.basicInfo.contactJob = objectOne.jobName
        this.basicInfo.contactPhone = objectOne.mobile
        this.contactOneNameStatus = objectOne.authorizedLabel != 0?true:false
        this.contactOnePhoneStatus = objectOne.authorizedLabel != 0?true:false
         if(this.basicInfo.clueType == 1&&this.userInfo.clueCompanyContactList.length>1){
           this.contactInfoList = []
           this.userInfo.clueCompanyContactList.slice(1).forEach((item)=>{
           this.contactInfoList.push({
               isManager:item.isManager,
               authStatus:item.authStatus,
               contactName:item.contactName,
               contactJob:item.jobName,
               contactPhone:item.mobile,
               contactNameStatus:false,
               contactPhoneStatus:false
             })
           })
         }
      }
    },
    // 回显单位信息 + 单位人员信息
    receiveUnitInfo(){
      if(this.basicInfo.clueType == 1){
          this.basicInfo.uscc = this.userInfo.organization == null?"":this.userInfo.organization // 回显信用代码
          // 单位信息
          if(this.userInfo.clueCompanyUnit){
            let clueOrganization = this.userInfo.clueCompanyUnit 
            this.unitData.inventionPatentCount = clueOrganization.inventionList == null?0:clueOrganization.inventionList.length // 发明专利数量
            this.unitData.usefulPatentCount = clueOrganization.practicalList == null?0:clueOrganization.practicalList.length // 实用专利数量
            this.unitData.facePtentCount = clueOrganization.appearanceList == null?0:clueOrganization.appearanceList.length // 外观专利数量
            this.unitData.trademarkCount = clueOrganization.trademarkList == null?0:clueOrganization.trademarkList.length // 商标数量
            this.unitData.copyrightCount = clueOrganization.copyrightList == null?0:clueOrganization.copyrightList.length // 版权数量
            this.unitData.otherPropertyCount = clueOrganization.otherList == null?0:clueOrganization.otherList.length // 其他知产数量
          }
          if(this.financeInfo){
            let financeInfo = this.financeInfo
            // 回显的财务及人员情况需要处理
            this.unitData.lastYearSalesCount = Number(financeInfo.lastYearSale)==0?'':Number(financeInfo.lastYearSale) // 上年度销售总额id
            this.unitData.lastYearSalesCountDetail = financeInfo.lastYearSaleAmount
            this.unitData.lastYearCapitalCount = Number(financeInfo.lastYearAssets)==0?'':Number(financeInfo.lastYearAssets) // 上年度资产总计id
            this.unitData.lastYearCapitalCountDetail = financeInfo.lastYearAssetsAmount
            this.unitData.lastYearProfitCount = Number(financeInfo.lastYearProfit)==0?'':Number(financeInfo.lastYearProfit) // 上年度利润总额id
            this.unitData.lastYearProfitCountDetail = financeInfo.lastYearProfitAmount
            this.unitData.lastYearDevelopCount = Number(financeInfo.lastYearDevExpenses)==0?'':Number(financeInfo.lastYearDevExpenses) // 上年度研费总额id
            this.unitData.lastYearDevelopCountDetail = financeInfo.lastYearDevExpensesAmount
            this.unitData.unitPersonCount = Number(financeInfo.unitEmployees)==0?'':Number(financeInfo.unitEmployees) // 单位人数
            this.unitData.unitPersonCountDetail = financeInfo.unitEmployeesNum
            this.unitData.mainBusiness = Number(financeInfo.mainBusiness)==0?'': financeInfo.mainBusiness // 主营业务
            this.unitData.nextProjectPlan = Number(financeInfo.nextPlanning)==0?'': financeInfo.nextPlanning // 规划
          }
          // 人员信息
          if(this.userInfo.clueCompanyStaff){
            let clueCompanyStaff = this.userInfo.clueCompanyStaff
            this.personInfo.legalPerson = clueCompanyStaff.legalName
            this.personInfo.legalPersonPhone = clueCompanyStaff.legalMobile
            this.personInfo.treasurer = clueCompanyStaff.treasurerName
            this.personInfo.treasurerPhone = clueCompanyStaff.treasurerMobile
            this.personInfo.technicalDirector = clueCompanyStaff.technicalName
            this.personInfo.technicalDirectorPhone = clueCompanyStaff.technicalMobile
            this.personInfo.marketingDirector = clueCompanyStaff.marketingName
            this.personInfo.marketingDirectorPhone = clueCompanyStaff.marketingMobile
            this.personInfo.executiveDirector = clueCompanyStaff.administrativeName
            this.personInfo.executiveDirectorPhone = clueCompanyStaff.administrativeMobile
         }
        }
    },
    // 回显开票信息
    receiveInvoiceInfo(){
      if(this.userInfo.clueCompanyInvoice&&this.basicInfo.clueType == 1){
         let clueInvoice = this.userInfo.clueCompanyInvoice
         this.billingInfo.unitName = clueInvoice.companyName
         this.billingInfo.billingNumber = clueInvoice.organization
         this.billingInfo.registerAddress = clueInvoice.registerAddress
         this.billingInfo.registerPhone = clueInvoice.registerMobile
         this.billingInfo.depositBank = clueInvoice.bankName
         this.billingInfo.bankAccountNo = clueInvoice.bankAccount
       }
       if(this.userInfo.cluePersonInvoice&&this.basicInfo.clueType == 0){
         let clueInvoice = this.userInfo.cluePersonInvoice
         this.billingInfo.unitName = clueInvoice.companyName
         this.billingInfo.billingNumber = clueInvoice.organization
         this.billingInfo.registerAddress = clueInvoice.registerAddress
         this.billingInfo.registerPhone = clueInvoice.registerMobile
         this.billingInfo.depositBank = clueInvoice.bankName
         this.billingInfo.bankAccountNo = clueInvoice.bankAccount
       }
    },
    // 回显基本信息
    receiveBasicInfo(){
      this.basicInfo.clueType = Number(this.userInfo.clueType) 
      this.basicInfo.clueMark = {id:Number(this.userInfo.clueGradeId)} // 回显线索标签
      this.basicInfo.unitName = this.userInfo.companyName // 回显单位名称
      if(this.userInfo.orgType){ // 回显单位类型
        this.basicInfo.unitType = Number(this.userInfo.orgType)
      }
      this.basicInfo.industry = []
      if(this.userInfo.industry){ // 回显行业类型
        this.userInfo.industry.split(',').forEach(item=>{
        this.basicInfo.industry.push(Number(item))
       })
      }
      this.basicInfo.area = []
      if(this.userInfo.orgAddress){ // 回显地区
        this.userInfo.orgAddress.split(',').forEach(item=>{
        this.basicInfo.area.push(Number(item))
       })
      }
      this.basicInfo.detailAddress = this.userInfo.detailAddress // 回显详细地址
      this.basicInfo.remarks = this.userInfo.remark // 回显备注
      // 个人线索信息回显
      if(this.basicInfo.clueType == 0){ // 回显性别
        this.basicInfo.sex = this.userInfo.sex
        this.basicInfo.contactName = this.userInfo.contactName
        this.basicInfo.contactJob = this.userInfo.jobName
        this.basicInfo.contactPhone = this.userInfo.mobile
        this.contactOneNameStatus = this.userInfo.isAutoConversion ==true?true:false
        this.contactOnePhoneStatus = this.userInfo.isAutoConversion ==true?true:this.userInfo.isUserConversion ==true?true:false
      }
    },
    // 线索编辑时数据回显
    editReceive(){
      this.receiveBasicInfo()
      this.receiveContactInfo()
      this.receiveUnitInfo()
      this.receiveInvoiceInfo()
    },
    finalReceive(){
      // 回显线索数据
      if(this.editClue){
        this.editReceive();
      }
    }
  },
  mounted(){
    this.getDropData();
    this.finalReceive();
    this.getConnectEmpData();
  }
};
</script>
<style scoped>
.new-create-clue{
  margin-top: -20px;
}
.required{
  color:red;
  opacity: .9;
  margin-left:18px;
}
.item-label{
  position:absolute;   
  top:-8px;
}
.form-item{
  position: relative;
  height:32px;
  margin:20px 0;
  width:100%  
}
.contact_sty{
  display: flex;
  flex-direction: column;
}
.item_contact_sty{
  display: flex;
}
.basic_btn_sty{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
.btn_left_handle{
  margin-left: 100px !important;
}
.basic_unit_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0 5px 0px;
  padding-bottom: 20px;
}
.basic_unit_span > span:nth-of-type(1) {
  display: inline-block;
  width: 5px;
  height: 20px;
  background: #108ee9;
}
.basic_unit_span > span:nth-of-type(2) {
  display: flex;
  width: 100px;
  height: 20px;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  color: #666666;
  font-weight: bold;
  margin-left: 8px;
}

.long-sty > span:nth-of-type(2) {
  width: 300px !important;
}
.input_left_sty{
  margin-left: 15px;
}
.create-warning{
  color: #ff0000;
}
.input_item_sty{
  width: 130px;
}
.com_sty_add{
  width: 38px !important;
}
.label-sty{
  padding-bottom: 8px !important;
}
.left-sty{
  margin-left: 4px;
}
</style>
<style>
.new-create-clue .form-item .el-input__inner,.new-create-clue .block .el-input__inner{
  width:300px;
}
</style>
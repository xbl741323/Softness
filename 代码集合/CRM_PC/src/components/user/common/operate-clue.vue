<template>
  <div class="create-clue">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="accountType == 1">
      <el-tab-pane label="*基本信息" name="first"></el-tab-pane>
      <el-tab-pane v-if="accountType == 1" label="单位数据" name="second"></el-tab-pane>
      <el-tab-pane v-if="accountType == 1" label="人员信息" name="third"></el-tab-pane>
    </el-tabs>

    <!-- 基本信息 -->
    <div v-show="activeName == 'first'">
      <el-form :model="basicInfo" ref="basicInfo" label-width="96px" :rules="clueRules" >
        <div class="contract_sty" v-if="accountType == 0">
        <div class="item_contract_sty">
          <el-form-item label="联 系 人：" prop="contractName">
        <el-input disabled v-model.trim="basicInfo.contractName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJob" label-width="20px">
          <el-input v-model.trim="basicInfo.contractJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px">
          <el-input :disabled="true" @change="basicInfo.contractPhone = oninputForPhone(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPhone(basicInfo.contractPhone)" v-model.trim="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        </div>
        </div>
         <div class="form-item" v-if="accountType == 0">                
           <el-form-item class="item-label" label="性别：" label-width="95px">
          <el-radio-group v-model="basicInfo.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==0">                   
          <el-form-item class="item-label" label="单位名称：">
            <el-input v-model="basicInfo.unitName"></el-input>
          </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==0">
          <el-form-item class="item-label" label="单位类型：">
            <el-select v-model="basicInfo.unitType">
              <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==0">
          <el-form-item class="item-label" label="行业类型：">
            <el-select v-model="basicInfo.industry" :multiple="true" :multiple-limit="3">
              <el-option v-for="(item,index) in industryTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==0">
          <el-form-item class="item-label" label="所在地区：">
            <el-cascader :options="areaTree" v-model="basicInfo.area" :props="{value: 'id',label: 'areaName'}"/>
          </el-form-item>
        </div>              
        <div class="form-item" v-if="accountType ==1">
          <span class="required">*</span>&nbsp;                    
          <el-form-item class="item-label" label="单位类型：" prop="unitType">
            <el-select v-model="basicInfo.unitType">
              <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==1">
          <span class="required">*</span>&nbsp;                    
          <el-form-item class="item-label" label="行业类型：" prop="industry">
            <el-select v-model="basicInfo.industry" :multiple="true" :multiple-limit="3">
              <el-option v-for="(item,index) in industryTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-item" v-if="accountType ==1">
          <span class="required">*</span>&nbsp;                    
          <el-form-item class="item-label" label="所在地区：" prop="area">
            <el-cascader :options="areaTree" v-model="basicInfo.area" :props="{value: 'id',label: 'areaName'}"/>
          </el-form-item>
        </div>                        
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input v-model.trim="basicInfo.detailAddress" maxlength="100" show-word-limit placeholder="请填写"></el-input>
        </el-form-item>
        <div class="contract_sty" v-if="accountType == 1">
         <div class="item_contract_sty">
         <el-form-item label="联 系 人1：" prop="contractName">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJob" label-width="20px">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px">
          <el-input class="input_item_sty" :disabled="true" @change="basicInfo.contractPhone = oninputForPhone(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPhone(basicInfo.contractPhone)" v-model.trim="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item label-width="15px">
          <el-button class="com_sty_add" @click="changeContractIndex(true,1)" v-if="(showInfo.twoStatus == false&&showInfo.threeStatus == false)">+</el-button>
        </el-form-item>
         </div>
         <div class="item_contract_sty" v-if="showInfo.twoStatus">
         <el-form-item label="联 系 人2：">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractNameTwo" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJobTwo" label-width="20px">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractJobTwo" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhoneTwo" label-width="20px">
          <el-input class="input_item_sty" @change="basicInfo.contractPhoneTwo = oninputForPhone(basicInfo.contractPhoneTwo)" @keyup.native="basicInfo.contractPhoneTwo = oninputForPhone(basicInfo.contractPhoneTwo)" v-model.trim="basicInfo.contractPhoneTwo" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item label-width="15px">
          <el-button class="com_sty_add" @click="changeContractIndex(false,2)">-</el-button>
        </el-form-item>
        <el-form-item label-width="15px">
          <el-button class="com_sty_add" @click="changeContractIndex(true,2)" v-if="!showInfo.threeStatus">+</el-button>
        </el-form-item>
         </div>
         <div class="item_contract_sty" v-if="showInfo.threeStatus">
         <el-form-item :label="showInfo.twoStatus&&showInfo.threeStatus == true?'联 系 人3：':showInfo.twoStatus == false && showInfo.threeStatus == true?'联 系 人2：':''">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractNameThree" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJobThree" label-width="20px">
          <el-input class="input_item_sty" v-model.trim="basicInfo.contractJobThree" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhoneThree" label-width="20px">
          <el-input class="input_item_sty" @change="basicInfo.contractPhoneThree = oninputForPhone(basicInfo.contractPhoneThree)" @keyup.native="basicInfo.contractPhoneThree = oninputForPhone(basicInfo.contractPhoneThree)" v-model.trim="basicInfo.contractPhoneThree" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item label-width="15px">
          <el-button class="com_sty_add" @click="changeContractIndex(false,3)">-</el-button>
        </el-form-item>
        <el-form-item label-width="15px">
          <el-button class="com_sty_add" @click="changeContractIndex(true,3)" v-if="showInfo.twoStatus == false">+</el-button>
        </el-form-item>
         </div>
        </div>
      </el-form>
    </div>

    <!-- 单位数据 -->
    <div v-if="activeName == 'second'&&accountType == 1">
      <el-form :model="unitData" ref="unitData" inline label-width="125px">
        <!-- 知产情况 -->
        <div class="basic_unit_span">
        <span></span>
        <span>知产情况</span>
        </div>
        <el-form-item label="发明专利数量：" prop="inventionPatentCount">
          <el-input type="number" placeholder="请输入" @change="unitData.inventionPatentCount = oninputForPatent(unitData.inventionPatentCount)" @keyup.native="unitData.inventionPatentCount = oninputForPatent(unitData.inventionPatentCount)" v-model="unitData.inventionPatentCount"></el-input>
        </el-form-item>
        <el-form-item label="商  标  数  量：" prop="trademarkCount">
          <el-input type="number" placeholder="请输入" @change="unitData.trademarkCount = oninputForPatent(unitData.trademarkCount)" @keyup.native="unitData.trademarkCount = oninputForPatent(unitData.trademarkCount)" v-model.trim="unitData.trademarkCount"></el-input>
        </el-form-item>
        <el-form-item label="实用专利数量：" prop="usefulPatentCount">
          <el-input type="number" placeholder="请输入" @change="unitData.usefulPatentCount = oninputForPatent(unitData.usefulPatentCount)" @keyup.native="unitData.usefulPatentCount = oninputForPatent(unitData.usefulPatentCount)" v-model.trim="unitData.usefulPatentCount"></el-input>
        </el-form-item>
        <el-form-item label="版  权  数  量：" prop="copyrightCount">
          <el-input type="number" placeholder="请输入" @change="unitData.copyrightCount = oninputForPatent(unitData.copyrightCount)" @keyup.native="unitData.copyrightCount = oninputForPatent(unitData.copyrightCount)" v-model.trim="unitData.copyrightCount"></el-input>
        </el-form-item>
        <el-form-item label="外观专利数量：" prop="facePtentCount">
          <el-input type="number" placeholder="请输入" @change="unitData.facePtentCount = oninputForPatent(unitData.facePtentCount)" @keyup.native="unitData.facePtentCount = oninputForPatent(unitData.facePtentCount)" v-model.trim="unitData.facePtentCount"></el-input>
        </el-form-item>
        <el-form-item label="其他知产数量：" prop="otherPropertyCount">
          <el-input type="number" placeholder="请输入" @change="unitData.otherPropertyCount = oninputForPatent(unitData.otherPropertyCount)" @keyup.native="unitData.otherPropertyCount = oninputForPatent(unitData.otherPropertyCount)" v-model.trim="unitData.otherPropertyCount"></el-input>
        </el-form-item>
        <!-- 财务及人员情况 -->
        <div class="basic_unit_span">
        <span></span>
        <span>财务及人员情况</span>
        </div>
        <el-form-item label="上年度销售总额：" prop="lastYearSalesCount">
          <el-select type="number" v-model="unitData.lastYearSalesCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearSalesCountDetail">
          <el-input type="number" placeholder="请输入" @change="unitData.lastYearSalesCountDetail = oninput(unitData.lastYearSalesCountDetail)" @keyup.native="unitData.lastYearSalesCountDetail = oninput(unitData.lastYearSalesCountDetail)" v-model.trim="unitData.lastYearSalesCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度资产总计：" prop="lastYearCapitalCount">
          <el-select type="number" v-model="unitData.lastYearCapitalCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearCapitalCountDetail">
          <el-input type="number" placeholder="请输入" @change="unitData.lastYearCapitalCountDetail = oninput(unitData.lastYearCapitalCountDetail)" @keyup.native="unitData.lastYearCapitalCountDetail = oninput(unitData.lastYearCapitalCountDetail)" v-model.trim="unitData.lastYearCapitalCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度利润总额：" prop="lastYearProfitCount">
          <el-select type="number" v-model="unitData.lastYearProfitCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearProfitCountDetail">
          <el-input type="number" placeholder="请输入" @change="unitData.lastYearProfitCountDetail = oninput(unitData.lastYearProfitCountDetail)" @keyup.native="unitData.lastYearProfitCountDetail = oninput(unitData.lastYearProfitCountDetail)" v-model.trim="unitData.lastYearProfitCountDetail"></el-input>
        </el-form-item>
        <el-form-item label="上年度研费总额：" prop="lastYearDevelopCount">
          <el-select type="number" v-model="unitData.lastYearDevelopCount">
            <el-option v-for="(item,index) in lastYearsSalesList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（万元）：" prop="lastYearDevelopCountDetail">
          <el-input type="number" placeholder="请输入" @change="unitData.lastYearDevelopCountDetail = oninput(unitData.lastYearDevelopCountDetail)" @keyup.native="unitData.lastYearDevelopCountDetail = oninput(unitData.lastYearDevelopCountDetail)" v-model.trim="unitData.lastYearDevelopCountDetail"></el-input>
        </el-form-item>
         <el-form-item label="单    位   人   数：" prop="unitPersonCount">
          <el-select type="number" v-model="unitData.unitPersonCount">
            <el-option v-for="(item,index) in unitNumberList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体值（人）：" prop="unitPersonCountDetail">
          <el-input type="number" placeholder="请输入" @change="unitData.unitPersonCountDetail = oninput(unitData.unitPersonCountDetail)" @keyup.native="unitData.unitPersonCountDetail = oninput(unitData.unitPersonCountDetail)" v-model.trim="unitData.unitPersonCountDetail"></el-input>
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
    <div v-if="activeName == 'third'&&accountType == 1">
      <el-form :model="personInfo" ref="personInfo" inline label-width="100px">
        <el-form-item label="法人：" prop="legalPerson">
          <el-input disabled placeholder="请输入姓名" v-model="personInfo.legalPerson"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="legalPersonPhone">
          <el-input @change="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" @keyup.native="personInfo.legalPersonPhone = oninputForPhone(personInfo.legalPersonPhone)" placeholder="请输入电话" v-model.trim="personInfo.legalPersonPhone"></el-input>
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

    <div class="basic_btn_sty">
      <el-button size="medium" type="primary" v-preventReClick @click="operateClue">确定</el-button>
      <el-button size="medium" class="btn_left_handle" @click="handleClose()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { 
  getUnitType,
  getIndustryType, 
  getLastYearsSales, 
  getUnitNumber, 
  getAreaTree, 
  getEmpList,
} from '@/api/clue/clue'
import { updateUserData } from "@/api/admin/user"
export default {
  props:{
    userInfo:{//用户、线索编辑回显
      type: Object,
      required : false
    },
    accountType:{
      type:Number
    },
    phone:{
      type:String
    }
  },
  data() {
    return {
      activeName: "first",
      showInfo:{
        twoStatus:false,
        threeStatus:false
      },
      unitVoId:"",
      basicInfo: {
        sex:'',
        unitName:"",
        unitType:"",
        uscc:"", // 统一社会信用代码
        industry:[],
        area:[],
        detailAddress:"",
        contractName:"",
        contractJob:"",
        contractPhone:"",
        contractNameTwo:"",
        contractJobTwo:"",
        contractPhoneTwo:"",
        contractNameThree:"",
        contractJobThree:"",
        contractPhoneThree:"",
        remarks:"",
        allotSalesMan:[]
      },
       clueRules:{
        unitType: [{required: true,message: '请选择单位名称', trigger: 'change' }],
        area: [{required: true,message: '请选择所在区域', trigger: 'change'}],
        industry: [{required: true,message: '请选择行业类型', trigger: 'change'}],
        contractName: [{required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contractJob: [{required: true, message: '请输入联系人职务', trigger: 'blur' }],
        contractPhone: [{required: true, message: '请输入联系人手机号', trigger: 'blur' }],
        uscc: [{required: true, trigger: 'blur' }],
      },
      unitData: {
        id:"",
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
      unitTypeList:[],
      industryTypeList:[],
      lastYearsSalesList:[],
      unitNumberList:[],
      areaTree:[],
      empList:[]
    };
  },
  methods:{
    changeContractIndex(type,index){
      if(index == 1){
        this.showInfo.twoStatus = true
      }else if(index == 2){
        if(type){
          this.showInfo.threeStatus = true
        }else{
          this.$confirm('确定删除该条数据吗？','提示',{
           type: 'warning',
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           cancelButtonClass: "btn-custom-cancel"
          }).then(()=>{
            this.showInfo.twoStatus = false
            this.basicInfo.contractNameTwo = ""
            this.basicInfo.contractJobTwo = ""
            this.basicInfo.contractPhoneTwo = ""
          })
        }
      }else if(index == 3){
        if(type){
          this.showInfo.twoStatus = true
        }else{
          this.$confirm('确定删除该条数据吗？','提示',{
           type: 'warning',
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           cancelButtonClass: "btn-custom-cancel"
          }).then(()=>{
            this.showInfo.threeStatus = false
            this.basicInfo.contractNameThree = ""
            this.basicInfo.contractJobThree = ""
            this.basicInfo.contractPhoneThree = ""
          })
        }
      }
    },
    oninputForPhone(value){
      return value.replace(/[^\d-+]/g, "");
    },
    oninputForBank(value){
      return value.replace(/[^\w\.\/]/ig,'')
    },
    oninputForPatent(value) {
      if(value.length==1){
        return value.replace(/[^1-9]/g,'0')
        }else{
        return value.replace(/\D/g,'')}
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value =
      value.indexOf(".") > 0
        ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
        : value.substring(0, 10);
      return value;
    },
    operateNewClueData(){
      var params = {}
      if(this.accountType ==1 ){
        params = {
          id:this.userInfo.accountId,
          accountType:this.accountType,
          userVO:{
            userNo:this.$route.query.userNo,
            id:this.userInfo.id,
            // 单位数据
            unitVO:{
            // id:this.userInfo.unitVO.id,
            // 单位人员信息
            orgLegalName: this.accountType == 0?"":this.personInfo.legalPerson, // 法人
            orgLegalMobilephone: this.accountType == 0?"":this.personInfo.legalPersonPhone, 
            orgTreasurerName: this.accountType == 0?"":this.personInfo.treasurer, // 财务主管
            orgTreasurerMobilephone: this.accountType == 0?"":this.personInfo.treasurerPhone, 
            orgTechnicalName: this.accountType == 0?"":this.personInfo.technicalDirector, // 技术主管
            orgTechnicalMobilephone: this.accountType == 0?"":this.personInfo.technicalDirectorPhone, 
            orgMarketingName: this.accountType == 0?"":this.personInfo.marketingDirector, // 营销主管
            orgMarketingMobilephone: this.accountType == 0?"":this.personInfo.marketingDirectorPhone, 
            orgCompetentName: this.accountType == 0?"":this.personInfo.executiveDirector, // 人事主管
            orgCompetentMobilephone: this.accountType == 0?"":this.personInfo.executiveDirectorPhone, 
            // 单位信息
            unitOrganization:{
              id: this.unitData.id,
              inventionPatent: this.accountType == 0?"":this.unitData.inventionPatentCount, // 发明专利数量
              practicalPatent: this.accountType == 0?"":this.unitData.usefulPatentCount, // 实用专利数量
              appearancePatent: this.accountType == 0?"":this.unitData.facePtentCount, // 外观专利数量
              trademark: this.accountType == 0?"":this.unitData.trademarkCount, // 商标数量
              copyright: this.accountType == 0?"":this.unitData.copyrightCount, // 版权数量
              others: this.accountType == 0?"":this.unitData.otherPropertyCount, // 其他知产数量
              lastTotalSalesId: this.accountType == 0?"":this.unitData.lastYearSalesCount, // 上年度销售总额id
              lastTotalSales: this.accountType == 0?"":this.unitData.lastYearSalesCountDetail, 
              lastTotalPropertyId: this.accountType == 0?"":this.unitData.lastYearCapitalCount, // 上年度资产总计id
              lastTotalProperty: this.accountType == 0?"":this.unitData.lastYearCapitalCountDetail, 
              lastTotalProfitId: this.accountType == 0?"":this.unitData.lastYearProfitCount, // 上年度利润总额id
              lastTotalProfit: this.accountType == 0?"":this.unitData.lastYearProfitCountDetail,
              lastTotalResearchId: this.accountType == 0?"":this.unitData.lastYearDevelopCount, // 上年度研费总额id
              lastTotalResearch: this.accountType == 0?"":this.unitData.lastYearDevelopCountDetail, 
              totalEmployeesId: this.accountType == 0?"":this.unitData.unitPersonCount, // 单位人数id
              totalEmployees: this.accountType == 0?"":this.unitData.unitPersonCountDetail, 
              mainBusiness: this.accountType == 0?"":this.unitData.mainBusiness,
              nextProjectPlan: this.accountType == 0?"":this.unitData.nextProjectPlan,
             },
           },
             // 基本信息
            orgName: this.basicInfo.unitName, 
            orgType: this.basicInfo.unitType,
            industry: this.basicInfo.industry.join(','), 
            orgAddress: this.basicInfo.area.join(','),  
            orgDetailAddress: this.basicInfo.detailAddress, 
            name: this.basicInfo.contractName == ''?null:this.basicInfo.contractName,
            job: this.basicInfo.contractJob == ''?null:this.basicInfo.contractJob,
            //联系人2和联系人3
            userTwoName:this.basicInfo.contractNameTwo == ''?"":this.basicInfo.contractNameTwo,
            userTwoJob:this.basicInfo.contractJobTwo == ''?"":this.basicInfo.contractJobTwo,
            userTwoPhone:this.basicInfo.contractPhoneTwo == ''?"":this.basicInfo.contractPhoneTwo,
            userThreeName:this.basicInfo.contractNameThree == ''?"":this.basicInfo.contractNameThree,
            userThreeJob:this.basicInfo.contractJobThree == ''?"":this.basicInfo.contractJobThree,
            userThreePhone:this.basicInfo.contractPhoneThree == ''?"":this.basicInfo.contractPhoneThree
          },
        }
        if(this.unitVoId!==null&&this.unitVoId!==''){
          this.$set(params.userVO.unitVO,"id",this.unitVoId)
          this.$set(params.userVO.unitVO.unitOrganization,"unitId",this.unitVoId)
        }
        if(this.unitData.id!==''&&this.unitData.id!==null){
          this.$set(params.userVO.unitVO.unitOrganization,"id",this.unitData.id)
        }
      }else{
        params = {
          id:this.userInfo.accountId,
          userVo:{
           id:this.userInfo.id,
           // 基本信息
           gender:this.basicInfo.sex,
           orgName: this.basicInfo.unitName, 
           orgTypeId: this.basicInfo.unitType,
           orgIndustryNo: this.basicInfo.industry.join(','), 
           orgAddress: this.basicInfo.area.join(','),  
           orgDetailAddress: this.basicInfo.detailAddress, 
           contactName: this.basicInfo.contractName == ''?null:this.basicInfo.contractName,
           contractJob: this.basicInfo.contractJob == ''?null:this.basicInfo.contractJob,
           contactMobilephone: this.basicInfo.contractPhone == ''?null:this.basicInfo.contractPhone,
          }
        }
      }
      updateUserData(params).then(res=>{
          if(res.data.code==0){
            this.$message({
              type: "success",
              message: "操作成功！",
              offset: 300,
            });
            this.$emit('closeClueOperate',false); // 操作成功
          }
      })
    },
    operateClue(){
      this.$refs['basicInfo'].validate(valid=>{
        if(valid){
          if(
            this.basicInfo.contractNameTwo == ''&&
            this.basicInfo.contractJobTwo==''&&
            this.basicInfo.contractPhoneTwo=='' || 
            this.basicInfo.contractNameTwo !== ''&&
            this.basicInfo.contractJobTwo !==''&&
            this.basicInfo.contractPhoneTwo !==''){
            if(
              this.basicInfo.contractNameThree == ''&&
              this.basicInfo.contractJobThree==''&&
              this.basicInfo.contractPhoneThree=='' ||
               this.basicInfo.contractNameThree !== ''&&
               this.basicInfo.contractJobThree !==''&&
               this.basicInfo.contractPhoneThree !==''){
               this.operateNewClueData()
            }else{
              this.$message({
              type:"warning",
              message:"请将联系人信息补充完整！",
              offset:300
            })
            }
          }else{
            this.$message({
              type:"warning",
              message:"请将联系人信息补充完整！",
              offset:300
            })
          }
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
      if(this.$refs['unitData']){
        this.$refs['unitData'].resetFields();
      }
      if(this.$refs['personInfo']){
        this.$refs['personInfo'].resetFields();
      }
      this.$emit("close-clue")
    },
    handleClick(val){
      if(this.$refs['basicInfo']&&this.activeName!=='first'){
        this.$refs['basicInfo'].clearValidate()
      }
    },
    getDropData(){//获取下拉框数据
      const unitTypeNumber = 'unittype';
      const industryTypeNumber = 'industrytype';
      const lastYearsSales = 'lastyearssales';
      const unitNumber = 'numberofunits';
      getUnitType(unitTypeNumber).then(res=>{
        this.unitTypeList = res.data.data[0].options;
      })
      getIndustryType(industryTypeNumber).then(res=>{
        this.industryTypeList = res.data.data[0].options;
      })
      getLastYearsSales(lastYearsSales).then(res=>{
        this.lastYearsSalesList = res.data.data[0].options;
      })
      getUnitNumber(unitNumber).then(res=>{
        this.unitNumberList = res.data.data[0].options;
      })
      getAreaTree().then(res=>{
        this.areaTree = res.data.data;
      })
      //去除禁用后的员工
      getEmpList(false).then(res=>{
        this.empList = res.data.data;
      })
    },
    // 线索编辑时数据回显
    editReceive(){
        // 基本信息
        this.basicInfo.unitName = this.userInfo.orgName // 单位名称
        this.basicInfo.unitType = this.userInfo.orgType // 单位类型
        this.basicInfo.industry = [] // 行业类型
        if(this.userInfo.industryIdList!==null&&this.userInfo.industryIdList.length>0){
          this.userInfo.industryIdList.forEach(item=>{
          this.basicInfo.industry.push(Number(item))
        })
        }
        this.basicInfo.area = [] // 所在区域
        if(this.userInfo.orgAddress){
          this.userInfo.orgAddress.split(',').forEach(item=>{
          this.basicInfo.area.push(Number(item))
        })
        }
        this.basicInfo.detailAddress = this.userInfo.orgDetailAddress // 详细地址
        this.basicInfo.contractName = this.userInfo.name //联系人姓名
        this.basicInfo.contractJob = this.userInfo.job //联系人工作
        this.basicInfo.contractPhone = this.phone

        // 当账户类型是1时回显单位信息数据和人员信息数据
        if(this.accountType == 1){
          // 联系人2
          if(this.userInfo.userTwoName!==null&&this.userInfo.userTwoName!==""){this.showInfo.twoStatus = true}
          this.basicInfo.contractNameTwo = this.userInfo.userTwoName == null?"":this.userInfo.userTwoName
          this.basicInfo.contractJobTwo = this.userInfo.userTwoJob == null?"":this.userInfo.userTwoJob
          this.basicInfo.contractPhoneTwo = this.userInfo.userTwoPhone == null?"":this.userInfo.userTwoPhone
          // 联系人3
          if(this.userInfo.userThreeName!==null&&this.userInfo.userThreeName!==""){this.showInfo.threeStatus = true}
          this.basicInfo.contractNameThree = this.userInfo.userThreeName == null?"":this.userInfo.userThreeName
          this.basicInfo.contractJobThree = this.userInfo.userThreeJob == null?"":this.userInfo.userThreeJob
          this.basicInfo.contractPhoneThree = this.userInfo.userThreePhone == null?"":this.userInfo.userThreePhone

          // 单位信息
          if(this.userInfo.unitVO.unitOrganization!==null){
          let clueOrganization = this.userInfo.unitVO.unitOrganization
          this.unitData.id = clueOrganization.id;
          this.unitData.inventionPatentCount = clueOrganization.inventionPatent
          this.unitData.usefulPatentCount = clueOrganization.practicalPatent
          this.unitData.facePtentCount = clueOrganization.appearancePatent
          this.unitData.trademarkCount = clueOrganization.trademark
          this.unitData.copyrightCount = clueOrganization.copyright
          this.unitData.otherPropertyCount = clueOrganization.others
          this.unitData.lastYearSalesCount = clueOrganization.lastTotalSalesId ==null?'':clueOrganization.lastTotalSalesId ==''?'':Number(clueOrganization.lastTotalSalesId)
          this.unitData.lastYearSalesCountDetail = clueOrganization.lastTotalSales
          this.unitData.lastYearCapitalCount = clueOrganization.lastTotalPropertyId ==null?'':clueOrganization.lastTotalPropertyId ==''?'':Number(clueOrganization.lastTotalPropertyId)
          this.unitData.lastYearCapitalCountDetail = clueOrganization.lastTotalProperty
          this.unitData.lastYearProfitCount = clueOrganization.lastTotalProfitId == null?'':clueOrganization.lastTotalProfitId == ''?'':Number(clueOrganization.lastTotalProfitId)
          this.unitData.lastYearProfitCountDetail = clueOrganization.lastTotalProfit
          this.unitData.lastYearDevelopCount = clueOrganization.lastTotalResearchId == null?'':clueOrganization.lastTotalResearchId == ''?'':Number(clueOrganization.lastTotalResearchId)
          this.unitData.lastYearDevelopCountDetail = clueOrganization.lastTotalResearch
          this.unitData.unitPersonCount = clueOrganization.totalEmployeesId == null?'':clueOrganization.totalEmployeesId == ''?'':Number(clueOrganization.totalEmployeesId)
          this.unitData.unitPersonCountDetail = clueOrganization.totalEmployees
          this.unitData.mainBusiness = clueOrganization.mainBusiness
          this.unitData.nextProjectPlan = clueOrganization.nextProjectPlan          
          }
          // 人员信息
          if(this.userInfo.unitVO!==null){
            if(this.userInfo.unitVO.id!==null&&this.userInfo.unitVO.id!==""){
              this.unitVoId = this.userInfo.unitVO.id
            }
          // 法人
          this.personInfo.legalPerson = this.userInfo.unitVO.orgLegalName
          this.personInfo.legalPersonPhone = this.userInfo.unitVO.orgLegalMobilephone
          // 财务主管
          this.personInfo.treasurer = this.userInfo.unitVO.orgTreasurerName
          this.personInfo.treasurerPhone = this.userInfo.unitVO.orgTreasurerMobilephone
          // 技术主管
          this.personInfo.technicalDirector = this.userInfo.unitVO.orgTechnicalName
          this.personInfo.technicalDirectorPhone = this.userInfo.unitVO.orgTechnicalMobilephone
          // 营销主管
          this.personInfo.marketingDirector = this.userInfo.unitVO.orgMarketingName
          this.personInfo.marketingDirectorPhone = this.userInfo.unitVO.orgMarketingMobilephone
          // 人事主管
          this.personInfo.executiveDirector = this.userInfo.unitVO.orgCompetentName
          this.personInfo.executiveDirectorPhone = this.userInfo.unitVO.orgCompetentMobilephone
          }
        }else{
          this.basicInfo.sex = this.userInfo.gender
        }
    },
  },
  mounted(){
    this.getDropData();
    console.log(this.userInfo,"dd")
    this.editReceive();
  }
};
</script>

<style scoped>
.required{
    color:red;
    opacity: .9;
    margin-left:4px;
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
.contract_sty{
  display: flex;
  flex-direction: column;
}
.item_contract_sty{
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
</style>
<style>
.form-item .el-input__inner,.block .el-input__inner{
  width:300px;
}
</style>
import basicInfo from '@/components/new-client/common/clue-basic-info';
<template>
  <div class="create-clue">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <!-- <el-tab-pane label="*基本信息" name="first"></el-tab-pane> -->
      <el-tab-pane v-if="basicInfo.clueType == 1" label="单位数据" name="second"></el-tab-pane>
      <el-tab-pane v-if="basicInfo.clueType == 1" label="人员信息" name="third"></el-tab-pane>
      <!-- <el-tab-pane label="开票信息" name="fourth"></el-tab-pane> -->
    </el-tabs>

    <!-- 基本信息 -->
    <!-- <div v-show="activeName == 'first'">
      <el-form :model="basicInfo" ref="basicInfo" label-width="96px" :rules="clueRules">
        <el-form-item label="线索类型：" prop="clueType">
          <el-radio-group v-model="basicInfo.clueType">
            <el-radio :label="1">单位线索</el-radio>
            <el-radio :label="0">个人线索</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="线索标签：" prop="clueMark">
          <el-select value-key="id" v-model="basicInfo.clueMark">
            <el-option v-for="(item,index) in clueLabelList" :key="index"  :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <div class="contract_sty" v-if="basicInfo.clueType == 0">
          <el-form-item label="联 系 人：" prop="contractName">
          <el-input v-model="basicInfo.contractName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJob" label-width="20px">
          <el-input v-model="basicInfo.contractJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px" v-if="editClue">
          <el-input type="number" :disabled="userInfo.createType == '0'?true:false" @change="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" v-model="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px" v-if="!editClue">
          <el-input type="number" :disabled="createType == 0?true:false" @change="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" v-model="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        </div>
        <el-form-item label="单位名称：" prop="unitName">
          <el-input v-model="basicInfo.unitName" placeholder="请输入企业营业执照全称"></el-input>
        </el-form-item>
        <el-form-item label="单位类型：" prop="unitType">
          <el-select v-model="basicInfo.unitType">
            <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业类型：" prop="industry">
          <el-select v-model="basicInfo.industry" :multiple="true" :multiple-limit="3">
            <el-option v-for="(item,index) in industryTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在地区：" prop="area">
          <el-cascader :options="areaTree" v-model="basicInfo.area" :props="{value: 'id',label: 'areaName'}"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input v-model="basicInfo.detailAddress" placeholder="请填写"></el-input>
        </el-form-item>
        <div class="contract_sty" v-if="basicInfo.clueType == 1">
          <el-form-item label="联 系 人：" prop="contractName">
          <el-input v-model="basicInfo.contractName" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contractJob" label-width="20px">
          <el-input v-model="basicInfo.contractJob" placeholder="联系人职务"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px" v-if="editClue">
          <el-input type="number" :disabled="userInfo.createType == '0'?true:false" @change="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" v-model="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        <el-form-item prop="contractPhone" label-width="20px" v-if="!editClue">
          <el-input type="number" :disabled="createType == 0?true:false" @change="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" @keyup.native="basicInfo.contractPhone = oninputForPatent(basicInfo.contractPhone)" v-model="basicInfo.contractPhone" placeholder="联系人电话"></el-input>
        </el-form-item>
        </div>
        <el-form-item style="margin-top:10px;" label="备注：" prop="remarks">
          <el-input type="textarea" :rows="5" maxlength="500" show-word-limit v-model="basicInfo.remarks"></el-input>
        </el-form-item>
        <el-form-item label="分配业务员：" prop="allotSalesMan" label-width="96px" v-if="!this.editClue">
          <el-cascader filterable clearable :show-all-levels='false' :options="empList" v-model="basicInfo.allotSalesMan"/>
        </el-form-item>
      </el-form>
    </div> -->

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
          <el-input disabled type="number" placeholder="请输入" v-model.trim="unitData.usefulPatentCount"></el-input>
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
        <div class="basic_unit_span">
        <span></span>
        <span>财务及人员情况 </span>-{{currentYear}}年度
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
    <div v-if="activeName == 'third'&&basicInfo.clueType == 1">
      <el-form :model="personInfo" ref="personInfo" inline label-width="100px">
        <el-form-item label="法人：" prop="legalPerson">
          <el-input placeholder="请输入姓名" v-model="personInfo.legalPerson"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="legalPersonPhone">
          <el-input  @change="personInfo.legalPersonPhone = oninputForPatent(personInfo.legalPersonPhone)" @keyup.native="personInfo.legalPersonPhone = oninputForPatent(personInfo.legalPersonPhone)" placeholder="请输入电话" v-model="personInfo.legalPersonPhone"></el-input>
        </el-form-item>
        <el-form-item label="财务主管：" prop="treasurer">
          <el-input placeholder="请输入姓名" v-model="personInfo.treasurer"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="treasurerPhone">
          <el-input  @change="personInfo.treasurerPhone = oninputForPatent(personInfo.treasurerPhone)" @keyup.native="personInfo.treasurerPhone = oninputForPatent(personInfo.treasurerPhone)" placeholder="请输入电话" v-model="personInfo.treasurerPhone"></el-input>
        </el-form-item>
        <el-form-item label="技术主管：" prop="technicalDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.technicalDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="technicalDirectorPhone">
          <el-input  @change="personInfo.technicalDirectorPhone = oninputForPatent(personInfo.technicalDirectorPhone)" @keyup.native="personInfo.technicalDirectorPhone = oninputForPatent(personInfo.technicalDirectorPhone)" placeholder="请输入电话" v-model="personInfo.technicalDirectorPhone"></el-input>
        </el-form-item>
        <el-form-item label="营销主管：" prop="marketingDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.marketingDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="marketingDirectorPhone">
          <el-input  @change="personInfo.marketingDirectorPhone = oninputForPatent(personInfo.marketingDirectorPhone)" @keyup.native="personInfo.marketingDirectorPhone = oninputForPatent(personInfo.marketingDirectorPhone)" placeholder="请输入电话" v-model="personInfo.marketingDirectorPhone"></el-input>
        </el-form-item>
        <el-form-item label="行政主管：" prop="executiveDirector">
          <el-input placeholder="请输入姓名" v-model="personInfo.executiveDirector"></el-input>
        </el-form-item>
        <el-form-item class="input_left_sty" prop="executiveDirectorPhone">
          <el-input @change="personInfo.executiveDirectorPhone = oninputForPatent(personInfo.executiveDirectorPhone)" @keyup.native="personInfo.executiveDirectorPhone = oninputForPatent(personInfo.executiveDirectorPhone)" placeholder="请输入电话" v-model="personInfo.executiveDirectorPhone"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 开票信息 -->
    <!-- <div v-if="activeName == 'fourth'">
      <el-form :model="billingInfo" ref="billingInfo" label-width="100px">
        <el-form-item label="单位名称：" prop="unitName">
          <el-input :disabled="editClue==true?true:false" placeholder="请输入" v-model="billingInfo.unitName"></el-input>
        </el-form-item>
        <el-form-item label="发票税号：" prop="billingNumber">
          <el-input @change="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" @keyup.native="billingInfo.billingNumber = oninputForBank(billingInfo.billingNumber)" placeholder="请输入" v-model="billingInfo.billingNumber"></el-input>
        </el-form-item>
        <el-form-item label="注册地址：" prop="registerAddress">
          <el-input placeholder="请输入" v-model="billingInfo.registerAddress"></el-input>
        </el-form-item>
        <el-form-item label="注册电话：" prop="registerPhone">
          <el-input type="number" @change="billingInfo.registerPhone = oninputForPatent(billingInfo.registerPhone)" @keyup.native="billingInfo.registerPhone = oninputForPatent(billingInfo.registerPhone)" placeholder="请输入" v-model="billingInfo.registerPhone"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="depositBank">
          <el-input placeholder="请输入" v-model="billingInfo.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccountNo">
          <el-input type="number" placeholder="请输入" v-model="billingInfo.bankAccountNo"></el-input>
        </el-form-item>
      </el-form>
    </div> -->

    <p v-if="warningShow" class="create-warning">{{ warningInfo }}</p>
    <div class="basic_btn_sty">
      <el-button size="medium" class="right_btn_sty" type="primary" @click="operateClue">确定</el-button>
      <el-button size="medium" @click="handleClose()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { 
  getEmpList, 
  clueValidate,
} from '@/api/clue/clue'
import { operateClue, operateTaskClue } from "@/api/new-client/my-clue"
import { mapState } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  props:{
    createType:{//创建方式 0:用户转化 1:线索创建
      default:1,
      required: false
    },
    userInfo:{//用户、线索编辑回显
      type: Object,
      required : false
    },
    businessInfo:{
      type: Object,
      required : true
    },
    editClue:{//true:线索编辑 false:创建线索
      type: Boolean,
      default:false,
      required: false
    },
    currentYear:{//当前选择年份
      type: Number,
      default: new Date().getFullYear()-1
    }
  },
  data() {
    var validateName = (rule, value, callback) => {//单位名称验证
      if (value === '') {
        callback(new Error('请输入单位名称'));
      } else {
        var param = {
          clueType: this.basicInfo.clueType,
          orgName: this.basicInfo.unitName
        };
        if(this.editClue){
          param.operType = 0;//编辑标识
          param.id = this.userInfo.id
        };
        clueValidate(param).then(res=>{
          if(res.data.code === 0){
            callback();
          }else{
            callback(new Error(res.data.msg));
          };
        }).catch(()=>{
          return false;
        });
      };
    };
    var validateContactPhone = (rule, value, callback)=>{//联系人手机号码验证
      if(value === ''){
        callback(new Error('请输入联系人电话(固话须加区号)'));
      }else{
        var pattern = /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/;
        if(pattern.test(value)){
          var para = {
            clueType: this.basicInfo.clueType,
            contactMobilephone: this.basicInfo.contractPhone,
          };
          if(this.editClue){
            para.operType = 0;//编辑标识
            para.id= this.userInfo.id
          };
          clueValidate(para).then(res=>{
            if(res.data.code === 0){
              callback();
            }else{
              callback(new Error(res.data.msg));
            };
          }).catch(()=>{
            return false;
          });
        }else{
          callback(new Error('请填写正确的联系电话(固话须加区号)'));
        };
      };
    };
    var validateClueMark = (rule, value, callback)=>{//联系人手机号码验证
      if(value.id == ''){
        callback(new Error('请选择线索标签'));
      }else{
        callback();
      }
    };
    return {
      warningShow:false, 
      warningInfo:"xxx",
      activeName: "first",
      clueRules:{
        clueType: [{required: true, message: '请选择线索类型', trigger: 'blur' }],
        clueMark: [{required: true, validator: validateClueMark, trigger: 'blur' }],
        unitName: [{required: true, validator: validateName, trigger: 'blur' }],
        unitType: [{required: true, message: '请选择单位类型', trigger: 'blur' }],
        area: [{required: true, message: '请选择单位所在地', trigger: 'blur'}],
        industry: [{required: true, message: '请选择单位所属行业类型', trigger: 'blur'}],
        contractName: [{required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        contractJob: [{required: true, message: '请输入联系人职务', trigger: 'blur' }],
        contractPhone: [{required: true, validator: validateContactPhone, trigger: 'blur' }],
      },
      personRules:{
        legalPersonPhone: [{message: "请填写正确的联系电话", pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/, trigger: "blur" }],
        treasurerPhone: [{message: "请填写正确的联系电话", pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/, trigger: "blur" }],
        technicalDirectorPhone: [{message: "请填写正确的联系电话", pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/, trigger: "blur" }],
        marketingDirectorPhone: [{message: "请填写正确的联系电话", pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/, trigger: "blur" }],
        executiveDirectorPhone: [{message: "请填写正确的联系电话", pattern: /^\s*((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))\s*$/, trigger: "blur" }],
      },
      basicInfo: {
        clueType: 1,
        clueMark:{
          id:""
        },
        unitName:"",
        unitType:"",
        industry:[],
        area:[],
        detailAddress:"",
        contractName:"",
        contractJob:"",
        contractPhone:"",
        remarks:"",
        allotSalesMan:[]
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
    }),
  },
  methods:{
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
    // 返回单位数据
    fixCompanyUnitQuery(){
      let object = { 
        inventionNum:this.unitData.inventionPatentCount, // 发明专利数量
        practicalNum:this.unitData.usefulPatentCount, // 实用专利数量
        appearanceNum:this.unitData.facePtentCount, // 外观专利数量
        trademarkNum:this.unitData.trademarkCount, // 商标数量
        copyrightNum:this.unitData.copyrightCount, // 版权数量
        otherNum:this.unitData.otherPropertyCount, // 其他知产数量
        lastYearSale:this.unitData.lastYearSalesCount, // 上年度销售总额id
        lastYearSaleAmount:this.unitData.lastYearSalesCountDetail, 
        lastYearAssets:this.unitData.lastYearCapitalCount, // 上年度资产总计id
        lastYearAssetsAmount:this.unitData.lastYearCapitalCountDetail, 
        lastYearProfit:this.unitData.lastYearProfitCount, // 上年度利润总额id
        lastYearProfitAmount:this.unitData.lastYearProfitCountDetail,
        lastYearDevExpenses:this.unitData.lastYearDevelopCount, // 上年度研费总额id
        lastYearDevExpensesAmount:this.unitData.lastYearDevelopCountDetail, 
        unitEmployees:this.unitData.unitPersonCount, // 单位人数id
        unitEmployeesNum:this.unitData.unitPersonCountDetail,
        mainBusiness:this.unitData.mainBusiness, // 主营业务
        nextPlanning:this.unitData.nextProjectPlan, // 规划
        lastYear: this.currentYear || null,//编辑年份
       }
       
      return object
    },
     // 返回人员数据
    fixCompanyStaffQuery(){
      let object = { 
        legalName: this.personInfo.legalPerson, // 法人
        legalMobile: this.personInfo.legalPersonPhone, 
        treasurerName: this.personInfo.treasurer, // 财务主管
        treasurerMobile: this.personInfo.treasurerPhone, 
        technicalName: this.personInfo.technicalDirector, // 技术主管
        technicalMobile: this.personInfo.technicalDirectorPhone, 
        marketingName: this.personInfo.marketingDirector, // 营销主管
        marketingMobile: this.personInfo.marketingDirectorPhone, 
        administrativeName: this.personInfo.executiveDirector, // 人事主管
        administrativeMobile: this.personInfo.executiveDirectorPhone,
      }
      return object
    },
     operateFinalClue(){
      let params = {
        clueCompanyUnit: this.fixCompanyUnitQuery(), // 重构员工数据
        clueCompanyStaff: this.fixCompanyStaffQuery(), // 重构联系人列表
        clueCompanyId: this.userInfo.clueCompanyId
      }
      this.operateClueData(params)
    },
    // 创建和编辑线索 editClue：false-创建线索 true-修改线索
    operateClueData(params){
      operateTaskClue(params,true,1).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"修改成功！",
            offset:300
          })
        this.$emit('closeClueOperate')
        }else {
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset:300
          })
        }
      })
    },
    operateClue(){
      this.operateFinalClue()
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
    //   if(this.$refs['basicInfo']&&this.activeName!=='first'){
    //     this.$refs['basicInfo'].clearValidate()
    //   }
    },
    getDropData(){//获取下拉框数据
      this.industryTypeList = this.category[4].optionList;
      this.unitTypeList = this.category[5].optionList;
      this.lastYearsSalesList = this.category[6].optionList;
      this.unitNumberList = this.category[7].optionList;
      this.clueLabelList = this.category[8].optionList;
      this.areaTree = this.area;
      // 去除禁用后的员工
      getEmpList(false).then(res=>{
        this.empList = res.data.data;
      })
    },
    // 回显单位信息 + 单位人员信息
    receiveUnitInfo(){
          this.basicInfo.uscc = this.userInfo.organization == null?"":this.userInfo.organization // 回显信用代码
          // 单位信息
          if(this.userInfo.clueCompanyUnit){
            let clueOrganization = this.userInfo.clueCompanyUnit;
            let businessInfo = this.businessInfo;
            this.unitData.inventionPatentCount = clueOrganization.inventionList == null?0:clueOrganization.inventionList.length // 发明专利数量
            this.unitData.usefulPatentCount = clueOrganization.practicalList == null?0:clueOrganization.practicalList.length // 实用专利数量
            this.unitData.facePtentCount = clueOrganization.appearanceList == null?0:clueOrganization.appearanceList.length // 外观专利数量
            this.unitData.trademarkCount = clueOrganization.trademarkList == null?0:clueOrganization.trademarkList.length // 商标数量
            this.unitData.copyrightCount = clueOrganization.copyrightList == null?0:clueOrganization.copyrightList.length // 版权数量
            this.unitData.otherPropertyCount = clueOrganization.otherList == null?0:clueOrganization.otherList.length // 其他知产数量
            this.unitData.lastYearSalesCount = Number(businessInfo.lastYearSale)==0?'':Number(businessInfo.lastYearSale) // 上年度销售总额id
            this.unitData.lastYearSalesCountDetail = businessInfo.lastYearSaleAmount
            this.unitData.lastYearCapitalCount = Number(businessInfo.lastYearAssets)==0?'':Number(businessInfo.lastYearAssets) // 上年度资产总计id
            this.unitData.lastYearCapitalCountDetail = businessInfo.lastYearAssetsAmount
            this.unitData.lastYearProfitCount = Number(businessInfo.lastYearProfit)==0?'':Number(businessInfo.lastYearProfit) // 上年度利润总额id
            this.unitData.lastYearProfitCountDetail = businessInfo.lastYearProfitAmount
            this.unitData.lastYearDevelopCount = Number(businessInfo.lastYearDevExpenses)==0?'':Number(businessInfo.lastYearDevExpenses) // 上年度研费总额id
            this.unitData.lastYearDevelopCountDetail = businessInfo.lastYearDevExpensesAmount
            this.unitData.unitPersonCount = Number(businessInfo.unitEmployees)==0?'':Number(businessInfo.unitEmployees) // 单位人数
            this.unitData.unitPersonCountDetail = businessInfo.unitEmployeesNum
            this.unitData.mainBusiness = businessInfo.mainBusiness // 主营业务
            this.unitData.nextProjectPlan = businessInfo.nextPlanning // 规划        
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
    },
    finalReceive(){
    this.receiveUnitInfo()
    }
  },
  mounted(){
    this.getDropData();
    console.log(this.userInfo,"dd")
    this.finalReceive();
  }
};
</script>

<style scoped>
.contract_sty{
  display: flex;
}
.basic_btn_sty{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 20px;
}
.left_btn_sty{
  margin-left: 100px;
}
.basic_unit_span {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 20px 0 25px 0px;
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
.right_btn_sty{
  margin-right: 80px;
}
.create-warning{
  color: #ff0000;
}
</style>
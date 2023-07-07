<template>
<!-- 排查完成 -->
  <div class="add_product_main">
    <div class="add-product-pro">
    <div class="add-top">
      <span class="title-size">{{ $t("message.createProduct") }}</span>
      <el-steps :active="active" finish-status="success" class="steps-sty">
        <el-step :title="$t('message.basicInfo')"></el-step>
        <el-step title="交易信息"></el-step>
        <el-step :title="$t('message.detailContent')"></el-step>
        <el-step :title="$t('message.createSuccess')"></el-step>
      </el-steps>
    </div>
    <!-- 第一步-表格区域 -->
    <div v-show="active==0">
      <h3 class="basic-title">{{ $t('message.basicInfo') }}</h3>
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <table class="tab-sty">
          <tr style="flex: 1">
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("message.productName") }}</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("message.ipType") }}</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("message.slogan") }}</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span class="img-select-sty">{{ $t("message.coverImg") }}</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("message.productStatus") }}</span>
            </th>
            <!-- <th class="special-th">{{ $t("label.guidePrice") }}</th> -->
            <th>
              <span class="must-sty">*</span>
              <span>工作流：</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("label.webTitle") }}</span>
            </th>
            <th>
              <span class="must-sty">*</span>
              <span>{{ $t("label.metaKeyword") }}</span>
            </th>
            <th class="last-th">
              <span class="must-sty">*</span>
              <span>{{ $t("label.metaDescription") }}</span>
            </th>
            <th >
              <span class="must-sty">*</span>
              <span>是否在线交易</span>
            </th>
          </tr>
          <tr style="flex: 5">
            <td>
              <el-form-item class="input-sty" prop="name">
                <el-input @input="checkName()" v-model="addForm.name" maxlength="16" :placeholder="$t('input.noMorethan16')" show-word-limit></el-input>
              </el-form-item>
            </td>
            <td>
              <el-radio-group v-model="addForm.type">
                <el-radio :label="1">{{ $t("message.patent") }}</el-radio>
                <el-radio :label="2">{{ $t("message.trademark") }}</el-radio>
                <el-radio :label="3">{{ $t("message.copyright") }}</el-radio>
                <el-radio :label="4">其他</el-radio>
              </el-radio-group>
            </td>
            <td>
              <el-form-item class="input-sty" prop="advertise">
                <el-input
                  v-model="addForm.advertise"
                  maxlength="20"
                  :placeholder="$t('input.noMorethan20')"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </td>
            <td class="img-select-add">
              <el-button type="primary" @click="imgVisible = true">{{ $t("button.addImg") }}</el-button>
              <img class="select-img" :src="imgBaseUrl+addForm.imgUrl" alt="">
            </td>
            <td>
              <el-form-item class="input-sty" prop="status">
                <el-radio-group v-model="addForm.status">
                  <el-radio :label="1">{{ $t("status.show") }}</el-radio>
                  <el-radio :label="2">{{ $t("status.noShow") }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
            <!-- <td class="pay-sty-select">
              <div class="check-select" v-for="(item,index) in payList" :key="index">
                <el-checkbox class="check-btn-select" @change="checkSelect(index)" v-model="item.status">{{ item.payName }}</el-checkbox>
                <el-form-item label-width="0px" class="check-select-form">
                  <el-input type="number" maxlength="10" :disabled="!item.status" @change="item.price = oninput(item.price)" @keyup.native="item.price = oninput(item.price)" v-model.trim="item.price"></el-input>
                </el-form-item>
                <span>{{ $t("message.element") }}</span>
                <span class="pay-type-sty" v-if="index == 2&&item.status == true">{{ $t("message.OfficialFeeBillingType") }}</span>
                 <el-radio-group v-model="item.type" v-if="index == 2&&item.status == true">
                  <el-radio :label="0">{{ $t("message.invoice") }}</el-radio>
                  <el-radio :label="1">{{ $t("message.receipt") }}</el-radio>
                </el-radio-group>
              </div>
            </td> -->
             <td>
              <el-form-item class="input-sty" prop="workId">
              <el-select v-model="addForm.workId">
                <el-option 
                v-for="(item,index) in flowList" :key="index" 
                :label="item.flowNo+'-'+item.flowName"
                :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            </td>
            <td>
              <el-form-item class="input-sty" prop="metaTitle">
                <el-input
                  v-model="addForm.metaTitle"
                  maxlength="70"
                  :placeholder="$t('input.noMorethan70')"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="input-sty" prop="metaKeywords">
                <el-input
                  v-model="addForm.metaKeywords"
                  maxlength="100"
                  :placeholder="$t('input.noMorethan100')"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="input-sty" prop="metaDesc">
                <el-input
                  type="textarea"
                  v-model="addForm.metaDesc"
                  maxlength="200"
                  :placeholder="$t('input.noMorethan200')"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item class="input-sty" prop="isOnline">
                <el-radio-group v-model="addForm.isOnline">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>     
    </div>
    <!-- 第二步-表格区域 -->
    <div v-show="active==1">
      <trade-info ref="tradeInfo" :editType="false" :isOnline="addForm.isOnline===0?true:false" ></trade-info>
    </div>
    <!-- 第三步-表格区域 -->
    <div v-show="active==2">
      <h3 class="basic-title">{{ $t('message.detailContent') }}</h3>
      <div class="two-tab">
        <h3 class="title-sty">{{ $t('message.editContent') }}</h3>
        <div class="two-btn-sty">
          <span><el-button type="primary" @click="showAddDialog(0)">{{ $t('button.addTag') }}</el-button></span>
          <span v-if="tinyList.length!==0">
            <el-button type="primary" @click="toLast">{{ $t('button.lastStep') }}</el-button>
            <el-button type="primary" @click="createProduct()" v-preventReClick>{{ $t('button.create') }}</el-button>
            <el-button type="warning" @click="preview">{{ $t('button.preview') }}</el-button>
            <el-button @click="leave">{{ $t('button.cancel') }}</el-button>
          </span>
        </div>
        <p class="desc-sty">{{ $t('message.productTipsOne') }}</p>
        <p class="desc-sty">{{ $t('message.productTipsTwo') }}</p>
        <p class="desc-sty">{{ $t('message.productTipsThree') }}</p>
        <div style="margin-top:20px;" v-for="(item,index) in tinyList" :key="index">
        <div class="tag-sty">
        <span>
        <span v-if="item.tagName" style="font-size:14px;">{{ item.tagName }}</span>
        <i @click="showAddDialog(1,index)" class="el-icon-edit cursor-pointer"></i>
        </span>
        <span @click="delTag(index)"><i class="el-icon-delete cursor-pointer"></i></span>
        </div>
        <div><tinymce-editor v-model="item.tagContent" @getEditorValue="getChildEditor"  @limit='wordLimit' :id='String(index)'></tinymce-editor></div>
        </div>
      </div>
    </div>
    <!-- 按钮区域 -->
    <div class="btn-confirm">
      <el-button size="medium" type="primary" v-if="active!=0" class="cancel-sty-two" @click="toLast">{{ $t('button.lastStep') }}</el-button>
      <el-button size="medium" type="primary" v-if="active!=2" @click="toNext">{{ $t('button.nextStep') }}</el-button>
      <el-button size="medium" type="primary" v-if="active==2" @click="createProduct()" v-preventReClick>{{ $t('button.create') }}</el-button>
      <el-button size="medium" type="warning" class="cancel-sty-two" v-if="tinyList.length!=0 && active==2" @click="preview">{{ $t('button.preview') }}</el-button>
      <el-button size="medium" class="cancel-sty-two" @click="leave">{{ $t('button.cancel') }}</el-button>
    </div>
    <!-- dialog添加标签 -->
    <el-dialog
      :title="operateName"
      :visible.sync="dialogVisible"
      width="20%"
      center
      :before-close="handleClose"
    >
      <el-form ref="addObj" :model="addObj" inline :rules="rules">
        <el-form-item :label="$t('label.tagName')" prop="tagName">
          <el-input
            v-model="addObj.tagName"
            maxlength="4"
            :placeholder="$t('input.noMorethan4')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-sty">
        <el-button type="primary" v-if="operateName == $t('button.addTag')" @click="addTag()">{{ $t('button.confirm') }}</el-button>
        <el-button type="primary" v-if="operateName == $t('button.editTag')" @click="editTag()">{{ $t('button.confirm') }}</el-button>
        <el-button class="cancel-style" @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 添加图片 -->
    <el-dialog
      :title="$t('button.addImg')"
      :visible.sync="imgVisible"
      width="60%"
      center>
      <el-radio-group v-model="addForm.imgUrl"> 
        <el-radio v-for="(item,index) in imgList" :key="index" :label="item.imgUrl">
        <img class="pro-img" :src="imgBaseUrl+item.imgUrl" alt="">
        </el-radio>
      </el-radio-group>
      <div class="btn-sty-img">
        <el-button type="primary" @click="imgVisible = false" v-preventReClick>{{ $t('button.confirm') }}</el-button>
        <el-button class="cancel-style" @click="imgVisible = false">{{ $t('button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>
<script>
import { addProduct, getProductImg,checkProductName } from "@/api/project/ip";
import tinymceEditor from "./tinymceEditor";
import tradeInfo from "@/components/ip-service/trade-info";
import { getAllFlow } from "@/api/processmanage/work-flow"
import * as CodeMsg from "@/api/common/CodeChange"
import detailHead from "@/page/index/top/index";
import { clearDetail } from "@/util/clearDetail";
const math = require('mathjs')

export default {
  components: { tinymceEditor,detailHead,tradeInfo },
  data() {
    return {
      flowList:[],
      cheseMony:"",
      nameStatus:false,
      imgList: [],
      imgBaseUrl: process.env.NODE_ENV === "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
      addObj: {
        tagName: "",
      },
      priceStatus:false,
      checkStatus: false,
      editIndex: "",
      operateName: "",
      imgVisible: false,
      dialogVisible: false,
      tinyList: [],
      showStatus: true,
      limit: true,
      rules: {
        tagName: [{ required: true, message: this.$t("message.productRuleTipsOne"), trigger: "blur" }],
      },
      addRules: {
        name: [{ required: true, message: this.$t("message.productRuleTipsTwo"), trigger: "blur" }],
        advertise: [{ required: true, message: this.$t("message.productRuleTipsThree"), trigger: "blur" }],
        metaTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        metaKeywords: [{ required: true, message: "请填写", trigger: "blur" }],
        metaDesc: [{ required: true, message: "请填写", trigger: "blur" }],
        workId: [{ required: true, message: "请选择", trigger: "change" }],
        isOnline: [{ required: true, message: "请选择", trigger: "change" }],
      },
      payList: [
        {
          payName: this.$t("message.agencyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.threePartyFee"),
          price: "",
          status: false,
        },
        {
          payName: this.$t("message.officialFee"),
          price: "",
          status: false,
          type: 0,
        },
      ],
      addForm: {
        name: "",
        type: 1,
        advertise: "",
        imgUrl: "",
        status: 1,
        routePay: "",
        workId:"",
        metaTitle: "",
        metaKeywords: "",
        metaDesc: "",
        agencyFee: "",
        thirdPartyFee: "",
        governmentFee: "",
        billingType: "",
        isOnline:""
      },
      active:0,
    };
  },
  methods: {
    // @input="cnMoneyFormat(item.price)"
    //将阿拉伯数字翻译成中文的大写数字
    cnMoneyFormat(num){
      if(!/^\d*(\.\d*)?$/.test(num)){alert("Number is wrong!"); return false;}
      var AA = new Array("零","一","二","三","四","五","六","七","八","九");
      var BB = new Array("","十","百","千","万","亿","点","");
      var a = (""+ num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
      for(var i=a[0].length-1; i>=0; i--){
        switch(k)
        {
            case 0 : re = BB[7] + re; break;
            case 4 : if(!new RegExp("0{4}\\d{"+ (a[0].length-i-1) +"}$").test(a[0]))
                     re = BB[4] + re; break;
            case 8 : re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
        }
        if(k%4 == 2 && a[0].charAt(i+2) != 0 && a[0].charAt(i+1) == 0) re = AA[0] + re;
        if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k%4] + re; k++;
    }
     if(a.length>1) //加上小数部分(如果有小数部分)
      {
        re += BB[6];
        for(var i=0; i<a[1].length; i++) re += AA[a[1].charAt(i)];
      }
      this.cheseMony = re
      console.log(this.cheseMony)
      return re;
    },
    checkName(){
      let params = {
        name:this.addForm.name
      }
      checkProductName(params).then(res=>{
        if(res.data.code==1){
         this.nameStatus = true
         this.$message({
          type:"warning",
          message:res.data.msg,
          offset:300
        })
        }else{
         this.nameStatus = false
        }
      })
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
    leave() {
      clearDetail("/project/ip-service/index")
      this.$router.push("/project/ip-service/index");
    },
    checkSelect(index) {
      // console.log(this.payList)
      this.payList.forEach(item=>{
        if(item.status == false){
          item.price = ""
        }
      })
    },
    createProduct() {
      this.checkStatus = false;
      //判断至少添加一个标签并包含内容才可创建产品
      this.tinyList.forEach((item) => {
        if (item.tagName==""||item.tagContent == "") {
          this.checkStatus = false;
        }else{
          this.checkStatus = true
        }
      });
      if (this.checkStatus) {

        this.saveParams();
      } else {
        this.$message({
          type: "warning",
          message: this.$t("message.productMsgTipsOne"),
          offset: 300,
        });
      }
    },
    saveParams() {
      let labelList = [];
      let contentList = [];
      this.tinyList.forEach((item) => {
        labelList.push(item.tagName);
        contentList.push(item.tagContent);
      });
      let params = {
        //上一页
        name: this.addForm.name,
        type: this.addForm.type,
        slogan: this.addForm.advertise,
        coverUrl: this.addForm.imgUrl,
        status: this.addForm.status,
        isOnline:this.addForm.isOnline,
        // agencyFee: this.payList[0].price,
        // thirdPartyFee: this.payList[1].price,
        // governmentFee: this.payList[2].price,
        // billingType: this.payList[2].type,
        metaTitle: this.addForm.metaTitle,
        metaKeywords: this.addForm.metaKeywords,
        metaDesc: this.addForm.metaDesc,
        workId:this.addForm.workId,
        //下一页
        labelNames: labelList,
        labelContents: contentList,
      };
      let tradeInfo=this.$refs["tradeInfo"].tradeInfo;
      // params.isOnline=tradeInfo.isOnline;
      params.hasPublicExpense=tradeInfo.hasPublicExpense;
      params.feeType=tradeInfo.feeType;
      params.allBillingType=tradeInfo.allBillingType;   
       params.previousFee= !tradeInfo.previousFee?null:Number(math.format(tradeInfo.previousFee*100,12));//因为非必填 
      params.nowFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12))
      if(tradeInfo.feeType==2){//费用类型改变，注意清空之前的选择
          params.previousFee=null;
          params.thirdPartyFee=null;
          params.agencyFee=null;
          params.governmentFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12)) 
      }else if(tradeInfo.feeType==1){
          params.thirdPartyFee=!tradeInfo.thirdPartyFee?null:Number(math.format(tradeInfo.thirdPartyFee*100,12)) ;
          params.agencyFee=!tradeInfo.agencyFee?null:Number(math.format(tradeInfo.agencyFee*100,12)) ;
          params.nowFee=(tradeInfo.thirdPartyFee || tradeInfo.agencyFee)?Number(math.format(tradeInfo.agencyFee*100,12))+Number(math.format(tradeInfo.thirdPartyFee*100,12)):null;
          params.governmentFee=null
      }else if(tradeInfo.feeType===0){
          params.thirdPartyFee=null;
          params.governmentFee=null
          params.agencyFee=!tradeInfo.nowFee?null:Number(math.format(tradeInfo.nowFee*100,12));
      }else{
          params.thirdPartyFee=null;
          params.agencyFee=null;
          params.governmentFee=null;                       
      }    
      params.governmentFeeTypeList=[];
      params.billingType=null;
      if(tradeInfo.feeType!=2 && tradeInfo.hasPublicExpense===0){//是否选择官费
        tradeInfo.governmentFeeTypeList.forEach((item,index)=>{
          params.governmentFeeTypeList.push({typeFee:Number(math.format(item.typeFee*100,12)),typeName:item.typeName,isDefault:1})
          if(this.$refs["tradeInfo"].defaultGovernmentFee==index){
            console.log(item,"item")
              params.governmentFeeTypeList[index].isDefault=0;
          }
        })
        params.billingType=tradeInfo.billingType;
      } 
      addProduct(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: this.$t("message.createSuccess")+'!',
            offset: 300,
          });
          this.leave()
        } else {
          this.$message({
            type: "warning",
            message: res.data.data,
            offset: 300,
          });
        }
      });
    },
    getImg() {
      getProductImg().then((res) => {
        this.imgList = res.data.data;
      });
    },
    showAddDialog(num, index) {
      this.dialogVisible = true;
      if (num == 0) {
        this.operateName = this.$t('button.addTag');
        this.addObj.tagName = "";
      } else {
        this.editIndex = index;
        this.operateName = this.$t('button.editTag');
        this.addObj.tagName = this.tinyList[index].tagName;
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    preview() {
      let dataInfo={};
      console.log(this.$refs["tradeInfo"].tradeInfo,"dataInfo")
      dataInfo.name=this.addForm.name;
      dataInfo.slogan=this.addForm.advertise;  
      dataInfo.nowFee=this.$refs["tradeInfo"].tradeInfo.nowFee===null?null:Number(dataInfo.nowFee)*100;
      dataInfo.previousFee=this.$refs["tradeInfo"].tradeInfo.previousFee===null?null:Number(dataInfo.previousFee)*100;     
      if(this.$refs["tradeInfo"].tradeInfo.feeType==1){
        dataInfo.nowFee=(this.$refs["tradeInfo"].tradeInfo.thirdPartyFee || this.$refs["tradeInfo"].tradeInfo.agencyFee)?((Number(this.$refs["tradeInfo"].tradeInfo.thirdPartyFee)+Number(this.$refs["tradeInfo"].tradeInfo.agencyFee)).toFixed(2))*100:null;
      }
      dataInfo.governmentFeeTypeList=[];  
      if(this.$refs["tradeInfo"].tradeInfo.hasPublicExpense===0){
        this.$refs["tradeInfo"].tradeInfo.governmentFeeTypeList.forEach((item,index)=>{
          console.log(item,"item")
          dataInfo.governmentFeeTypeList.push({typeFee:Number(math.format(item.typeFee*100,12)),typeName:item.typeName,isDefault:1})
          if(this.$refs["tradeInfo"].defaultGovernmentFee==index){
            dataInfo.governmentFeeTypeList[index].isDefault=0;
          }
        })
      }
      if(this.addForm.isOnline===0 ) dataInfo.isOnline=0;                      
      let routeData = this.$router.resolve({
        path: "/preview-product",
        query: {
          dataInfo:JSON.stringify(dataInfo),
          dataList: JSON.stringify(this.tinyList),
          type:"add"
        },
      });
      window.open(routeData.href, "_blank");
    },
    getChildEditor(data, index) {
      this.tinyList[index].tagContent = data;
      console.log(this.tinyList);
    },
    wordLimit(val) {
      this.limit = val;
    },
    delTag(index) {
			this.$confirm(this.$t("message.productConfirmOne"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          this.tinyList.splice(index, 1);
        })
    },
    editTag() {
      this.$refs["addObj"].validate((val) => {
        if (val) {
          this.tinyList[this.editIndex].tagName = this.addObj.tagName;
          this.dialogVisible = false;
        }
      });
    },
    addTag() {
      this.$refs["addObj"].validate((val) => {
        if (val) {
          if (this.tinyList.length < 4) {
            let obj = {
              tagName: this.addObj.tagName,
              tagContent: "",
              status: false,
            };
            this.tinyList.push(obj);
            this.dialogVisible = false;
          } else {
            this.$message({
              type: "warning",
              message: this.$t("message.productMsgTipsTwo"),
            });
          }
        }
      });
    },
    toNext() {
      console.log(this.$refs["tradeInfo"].tradeInfo.previousFee,this.$refs["tradeInfo"].tradeInfo.nowFee,)
      if(this.active==0){//第一步里的“下一步”
        if(this.nameStatus){
          this.$message({
                type: "warning",
                message: "产品名称已存在！",
                offset: 300,
              });
        }else{
            this.priceStatus = false
            this.$refs["addForm"].validate((val) => {
              if (val) {              
                // if(this.payList[0].status&&(this.payList[0].price==""||this.payList[0].price==0)){
                //   this.$message({
                //     type: "warning",
                //     message: this.$t("message.productMsgOne"),
                //     offset: 300,
                //   });
                // }else if(this.payList[1].status&&(this.payList[1].price==""||this.payList[1].price==0)){
                //   this.$message({
                //     type: "warning",
                //     message: this.$t("message.productMsgTwo"),
                //     offset: 300,
                //   });
                // }else if(this.payList[2].status&&(this.payList[2].price==""||this.payList[2].price==0)){
                //   this.$message({
                //     type: "warning",
                //     message: this.$t("message.productMsgThree"),
                //     offset: 300,
                //   });
                // }else{
                //   this.showStatus = false;
                // }
                this.active++;
              } else {
                this.$message({
                  type: "warning",
                  message: "请修改填写不正确的信息",
                  offset: 300,
                });
              }
            });
        }
      }else if(this.active==1){//第二步里的“下一步”
        this.$refs["tradeInfo"].$refs["tradeInfoForm"].validate(val=>{
          if(val){
            let tradeInfo=Object.assign({},this.$refs["tradeInfo"].tradeInfo); 

            if(tradeInfo.feeType==1 && (Number(tradeInfo.agencyFee)+Number(tradeInfo.thirdPartyFee))>Number(tradeInfo.previousFee)){
              this.$message({
                type: "error",
                message: "合并现单价应小于等于原单价",
                offset: 300,
              });
            }else{
              this.active++;
            }
          }else{
            this.$message({
              type: "warning",
              message: "请修改填写不正确的信息",
              offset: 300,
            });
          }
        })

      }
    },
    toLast() {
      this.showStatus = true;
      this.active--;
    },
  },
  mounted() {
    this.getImg();
    getAllFlow().then(res=>{
      this.flowList = res.data.data
    })
  },
};
</script>

<style scoped>
.add_product_main{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 40px 20px;
}
.add-product-pro {
  width: 80%;
  margin-left: 5%;
}
.add-top {
  display: flex;
}
.title-size {
  margin-top: 4px;
  font-size: 14px;
}
.steps-sty {
  width: 85%;
  margin-left: 50px;
}
.basic-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.input-sty {
  width: 100%;
  margin-top: 10px;
}
table,
th,
td {
  border-collapse: collapse;
}
.tab-sty {
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  display: flex;
}
tr {
  display: flex;
  flex-direction: column;
}
th {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
}
th,
td {
  min-height: 65px;
  padding: 0 12px;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
td {
  display: flex;
  align-items: center;
  padding-left: 18px;
}
.check-select {
  display: flex;
  align-items: center;
}
.pay-sty-select {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.special-th {
  height: 148px;
}
.check-select-form {
  margin: 8px !important;
}
.last-th {
  height: 79px;
}
.btn-confirm {
  margin-bottom:46px;
  margin-top:20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.cancel-sty-left {
  margin-left: 80px;
  width: 84px;
}
.cancel-sty-two {
  margin-left: 20px;
  width: 84px;
}
.two-tab {
  border: 1px solid #ebeef5;
  padding: 20px 20px;
  min-height: 400px;
}
.desc-sty {
  font-size: 14px;
  margin-bottom: -5px;
}
.title-sty {
  font-size: 16px;
}
.two-btn-sty {
  display: flex;
  justify-content: space-between;
}
.tag-sty {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.cursor-pointer {
  cursor: pointer;
  margin-left: 5px;
}
.btn-sty {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cancel-style {
  margin-left: 35px;
}
.pay-type-sty {
  font-size: 14px;
  margin: 0 15px 0 20px;
}
.check-btn-select {
  width: 100px;
}
.pro-img {
  width: 100px;
}
.btn-sty-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.must-sty {
  color: red;
}
.select-img {
  width: 100px;
  margin-left: 20px;
}
.img-select-sty {
  height: 100px;
  line-height: 100px;
}
.img-select-add {
  height: 101px;
}
</style>

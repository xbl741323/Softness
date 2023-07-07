<template>
<!-- 排查完成 -->
  <div class="add_project">
    <div id="child" class="new-page-contain">
     <div class="add-top">
      <span class="title-size">新建项目</span>
      <el-steps :active="active" finish-status="success" class="steps-sty">
        <el-step :title="$t('message.basicInfo')"></el-step>
        <el-step title="交易信息"></el-step>
        <el-step :title="$t('message.detailContent')"></el-step>
        <el-step :title="$t('message.createSuccess')"></el-step>
      </el-steps>
    </div>

    <!-- 第一部分 -->
      <el-row v-show="active==0">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form">
            <h3 class="form-title">{{ $t("title.basicParameter") }}</h3>
            <div class="border_sty_complex border_sty_special">
              <span class="title_sty_complex"><span class="must-sty">*</span>产品标题：</span>
              <el-form-item prop="spuTitle" class="commom_height_special">
                <el-input class="commom_width_add" v-model.trim="form.spuTitle" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
              </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.slogan') }}</span>
              <el-form-item prop="spuSlogan" class="commom_height_special">
                <el-input class="commom_width_add" v-model.trim="form.spuSlogan" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
              </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>产品类型：</span>
              <el-form-item class="commom_height_special">
                <span class="commom_width_add" v-if="type == 1">项目申报</span>
                <span class="commom_width_add" v-if="type !=1 && type != 2">{{title}}</span>
                <el-radio-group v-model="form.categoryId" v-if="type == 2">
                  <el-radio label="3">{{ $t("message.patent") }}</el-radio>
                  <el-radio label="4">{{ $t("message.trademark") }}</el-radio>
                  <el-radio label="5">{{ $t("message.copyright") }}</el-radio>
                  <el-radio label="6">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex" style="height:480px"><span class="must-sty">*</span>{{ $t('label.coverImg') }}</span>
              <el-form-item prop="productImgFile" class="commom_height_special">
             <!-- 封面图片上传 -->
             <video-upload ref="video"></video-upload>
            <div>
              <p>1.上传相关图片，图片选择“展示”会在项目详情页进行展示</p>
              <p style="margin:-20px 0 -10px 0;">2.图片最多6张包括视频，分辨率为530*378px，格式为jpg，png，gif，mp4，avi，mov等，图片不超过4M，视频不超过100M。</p>
            </div>
            </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>产品状态：</span>
              <el-form-item prop="status" class="commom_height_special">
                <el-radio-group v-model="form.status">
                  <el-radio label="1">{{ $t("status.show") }}</el-radio>
                  <el-radio label="2">{{ $t("status.noShow") }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="border_sty_complex" v-if="type == 1">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.level') }}</span>
              <el-form-item prop="level" class="commom_height_special">
                <el-select v-model="form.level" :placeholder="$t('input.choose')" @change="levelChange">
                  <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
           <div class="border_sty_complex" v-if="type == 1">
             <span class="title_sty_complex"><span class="must-sty">*</span>地区：</span>
             <el-form-item prop="region" class="commom_height_special">
              <el-cascader ref="cas" class="commom_select_special" @change="areaChange" :options="areaOptions" v-model="form.region" :placeholder="casDisable==false?$t('input.choose'):'全国'" :props="{ value: 'no', label: 'name'}" :disabled="casDisable"></el-cascader>
            </el-form-item>
           </div>
            <div v-for="(item, index) in form.belongData.slice(0,1)" :key="index">
              <div class="border_sty_complex" v-if="type == 1">
                <span class="title_sty_complex" style="height:64px;"><span v-if="item.must == 1"><span class="must-sty">*</span></span>{{ item.categoryName + '：' }}</span>
                <el-form-item :prop="'belongData.' + index + '.itemData'" :rules="rules.selectDrop" class="commom_height_special" v-if="item.must == 1">
                  <el-select
                    class="commom_select_special"
                    :placeholder="$t('input.choose')"
                    v-model="item.itemData"
                    value-key="id"
                    @change="selectData(item.itemData)"
                    :multiple="item.choice == 1 ? true : false">
                    <el-option v-for="values in item.optionList" :key="values.id" :label="values.name" :value="values.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else class="commom_height_special">
                  <el-select
                    class="commom_select_special"
                    :placeholder="$t('input.choose')"
                    v-model="item.itemData"
                    value-key="id"
                    @change="selectData(item.itemData)"
                    :multiple="item.choice == 1 ? true : false">
                    <el-option  v-for="values in item.optionList" :key="values.id" :label="values.name" :value="values.id"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty" v-if="form.isOnline">*</span>合同模板：</span>
              <div class="commom_height_special contract" >
                <el-checkbox v-model="onlineContract" @change="chooseContract()">电子合同</el-checkbox>
                <el-form-item :prop="onlineContract ? 'spuContractTemplateId' : ''" >
                  <el-select v-model="form.spuContractTemplateId" :disabled="!onlineContract" class="commom_select_special" @change="chooseTemplate">
                    <el-option v-for="(item,index) in contractsTemplateList" :key="index" :label="item.templateId+'-'+item.templateName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item> 
                <el-checkbox v-model="offlineContract">纸质合同</el-checkbox>
              </div>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>工作流：</span>
              <el-form-item prop="workflowId" class="commom_height_special">
                <el-select v-model="form.workflowId" class="commom_select_special">
                  <el-option v-for="(item,index) in flowList" :key="index" :label="item.flowNo+'-'+item.flowName" :value="item.id" @mouseover.native="getWorkFlowDetail(item.id)" @select="getWorkFlowDetail(item.id)"></el-option>
                </el-select>
                <div class="workflow">
                  <span v-for="(item, index) in workflowInfoList" :key="index">
                    <span>{{!item.finishType ? item.stepName : endObj[item.finishType]}}</span>
                    <span class="pointer_right" v-if="!item.finishType"></span>
                  </span>
                </div>
              </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.formSort') }}</span>
              <el-form-item prop="sort" class="commom_height_special">
                <el-input type="number" min="1" v-model.trim="form.sort" show-word-limit class="commom_select_special" />
              </el-form-item>
            </div>
            <div class="border_sty_complex">
              <span class="title_sty_complex"><span class="must-sty">*</span>是否在线交易</span>
              <el-form-item prop="isOnline" class="commom_height_special">
                <el-radio-group v-model="form.isOnline">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <h3 class="form-title">SEO信息</h3>
            <div class="border_sty_complex border_sty_special">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.webTitle') }}</span>
              <el-form-item prop="seoTitle" class="commom_height_special">
                <el-input class="commom_width_add" v-model.trim="form.seoTitle" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
              </el-form-item>
            </div>
            <div class="border_sty_complex">
                <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.metaKeyword') }}</span>
                <el-form-item prop="metaKey" class="commom_height_special">
                <el-input class="commom_width_add" v-model.trim="form.metaKey" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
              </el-form-item>
            </div>
            <div class="border_sty_complex">
                <span class="title_sty_complex" style="height:122px;"><span class="must-sty">*</span>{{ $t('label.metaDescription') }}</span>
                <el-form-item prop="metaDetail" class="commom_height_special">
                <el-input class="commom_width_add" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model.trim="form.metaDetail" onkeyup="this.value=this.value.replace(/[, ]/g,'')" 
                :placeholder="$t('input.noMorethan200')"
                  maxlength="200"
                  show-word-limit/>
              </el-form-item>
            </div>
          </el-form>
      </el-row>

      <!-- 第二部分 -->
       <el-row v-show="active==1">
          <trade-info ref="tradeForm" @passValidate="passValidate" :editType="false" :isOnline="form.isOnline" ></trade-info>
       </el-row>

      <!-- 第三部分 -->
      <el-row v-show="active==2">
        <div class="two-tab">
          <h3 class="basic-title">{{ $t('message.detailContent') }}</h3>
          <div class="two-btn-sty">
            <span><el-button type="primary" @click="showAddDialog(0)">{{ $t('button.addTag') }}</el-button></span>
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
            <div><tinymce-editor v-model="item.text" @getEditorValue="getChildEditor"  @limit='wordLimit' :id='String(index)'></tinymce-editor></div>
          </div>
        </div>
      </el-row>
      <div class="btn-confirm ">
        <el-button class="cancel-sty-two" size="medium" @click="finalAdd" v-if="active==2" v-preventReClick type="primary">创建</el-button>
        <el-button class="cancel-sty-two" size="medium" type="primary" v-if="active!=0" @click="toPre">上一步</el-button>
        <el-button class="cancel-sty-two" size="medium" type="primary" v-if="active!=2" @click="checkPrice">下一步</el-button>
        <el-button class="cancel-sty-two" size="medium" @click="goback">取消</el-button>
      </div>
    </div>
    <!-- dialog添加标签 -->
    <el-dialog
      :title="operateName"
      :visible.sync="dialogVisible"
      width="20%"
      :close-on-click-modal="false"
      center
    >
      <el-form :model="addObj" ref="addObj" inline :rules="rules">
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
  </div>
</template>

<script>
import videoUpload from "@/components/upload/video-upload";
import { rechecking, addByJson } from "@/api/project/project";
import tinymceEditor from "./ip-service/tinymceEditor";
import { getDropPolicy, getNewArea } from "@/api/policy/list";
import * as CodeMsg from "@/api/common/CodeChange";
import detailHead from "@/page/index/top/index";
import { getAllFlow, getWorkFlowInfo } from "@/api/processmanage/work-flow";
import PolicyFileUpload from "@/components/file/policyFileUpload";
import { clearDetail } from "@/util/clearDetail";
import tradeInfo from "@/components/ip-service/project-trade";
import { getTemplate } from '@/api/contracts/contracts'
const math = require("mathjs");
export default {
  components: {
    tinymceEditor,
    PolicyFileUpload,
    detailHead,
    videoUpload,
    tradeInfo,
  },
  data() {
    var recheck = (rule, value, callback) => {
      rechecking({ title: value }).then((res) => {
        if (res.data.code === CodeMsg.CODE_2000) {
          return callback(new Error(this.$t("input.titleExisted")));
        } else {
          callback();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    };
    var txtLength = (rule, value, callback) => {
      // if (this.type == 4) {
        if (value.length > 30) {
          return callback(new Error(this.$t("input.txtLong30")));
        } else {
          callback();
        }
      // } else {
      //   if (value.length > 70) {
      //     return callback(new Error(this.$t("input.txtLong70")));
      //   } else {
      //     callback();
      //   }
      // }
    };
    return {
      onlineContract:false,
      offlineContract: false,
      hasPassValidate: false,
      generateAttributeList:[
        {
          attributeId: 1,
          attributeName: '地区',
          attributeValue: '',
          attributeValueDesc: '',
        },{
          attributeId: 2,
          attributeName: '归口',
          attributeValue: '',
          attributeValueDesc: '',
        },{
          attributeId: 3,
          attributeName: '级别',
          attributeValue: '',
          attributeValueDesc: '',
        }
      ],
      dialogVisible: false,
      editIndex: '',
      addObj:{
        tagName:''
      },
      operateName:'',
      contractsTemplateList:[],
      attributeInfo:{},
      areaInfo:{},
      title:'',
      params: {},
      disabled: false,
      tinyList: [],
      active: 0,
      flowList: [],
      workflowInfoList: [],
      workFlowId: "",
      timer:null,
      endObj: {
        "A": "完成(A)：仅可选完成",
        "B": "完成(B)：可选通过、不通过",
        "C": "完成(C)：可选完成、通过、不通过",
      },
      filesIdLength: 0,
      fileListLength: 0,
      libraryFileList: [], //接收文件库选择的文件列表
      filesIdList: [],
      uploadDialog: false, //添加附件
      ItIndex: -1,
      editor: "",
      spuTitle: "",
      status: "",
      productImgFile: null,
      editorContent: "",
      belongData: [],
      files: [],
      checkFlieRepet: false,
      repeatName: "",
      levelList: [{
            label: '国家级',
            value: 1
        },{
            label: '省级',
            value: 2
        },{
            label: '市级',
            value: 3
        },{
            label: '区级',
            value: 4
        }],
      rules: {
        spuTitle: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur" },
          { validator: recheck, trigger: "blur" },
          { validator: txtLength, trigger: "blur" },
        ],
        sort: [
          { required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur" },
          { message: "请输入正整数", pattern: /^[0-9]*[1-9][0-9]*$/, trigger: "blur" },
        ],
        spuSlogan: [
          { required: true, message: "请输入广告语", trigger: "blur" },
          { min: 1, max: 30, message: this.$t("input.txtLong30"), trigger: "blur" },
        ],
        guidancePrice: [
          { message: this.$t("message.guidePriceRules"), pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{0,2})?$/, trigger: "blur" },
          { message: this.$t("message.guidePriceRules"), pattern: /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/, trigger: "blur" },
        ],
        status: [
          { required: true, message: this.$t("input.pleaseChooseShowStatus"), trigger: "change" },
        ],
        seoTitle: [
          { required: true, message: this.$t("input.pleaseInputWebTitle"), trigger: "blur" },
          { min: 1, max: 70, message: this.$t("input.txtLong70"), trigger: "blur" },
        ],
        region: [
          { required: true, message: this.$t("input.pleaseChooseRegion"), trigger: "change" },
        ],
        level: [
          { required: true, message: this.$t("input.pleaseChooseLevel"), trigger: "change" },
        ],
        metaKey: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur" },
          { min: 1, max: 100, message: this.$t("input.txtLong100"), trigger: "blur" },
        ],
        metaDetail: [
          { required: true, message: "请输入meta描述", trigger: "blur" },
          { min: 1, max: 200, message: this.$t("input.txtLong200"), trigger: "blur" },
        ],
        selectDrop: [
          { required: true, message: this.$t("input.choose"), trigger: "change" },
        ],
        workflowId: [
          { required: true, message: this.$t("input.choose"), trigger: "change" },
        ],
        spuContractTemplateId: [
          { required: true, message: this.$t("input.choose"), trigger: "change" },
        ],
        isOnline: [{ required: true, message: "请选择", trigger: "change" }],
      },
      labelPosition: "right",
      form: {
        spuTitle: "",
        status: '1',
        seoTitle: "",
        metaKey: "",
        metaDetail: "",
        region: null,
        content: "",
        selectDrop: [],
        belongData: [],
        workflowId: "",
        categoryId: '1',
        sort: "1",
        isOnline: true,
      },
      areaOptionId: "",
      optionList: [],
      productImg: null,
      transferData: {},
      fileName: [],
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      contentNeed: false,
      edited: false,
      beFrom: null,
      limit: true, //默认编辑框字数合理 接收子组件传参
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
      casDisable: false,
    };
  },
  methods: {
    getWorkFlowDetail(id) {
      clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          if (this.workFlowId == id) return
          getWorkFlowInfo({workFlowId: id}).then(res => {
            if (res.data.code == 0) {
              this.workFlowId = id
              this.workflowInfoList  = res.data.data.flowStepList
              // res.data.data.flowStepList.forEach(item => {
              //   if (item.finishType) {
              //     this.workflowInfo.push(this.endObj[item.finishType])
              //   } else {
              //     this.workflowInfo.push(item.stepName)
              //   }
              // })
            }
          })
        },300)
    },
    levelChange(e){
      switch (Number(e)){
        case 1:
          this.casDisable = true
          this.form.region = null
          this.generateAttributeList[2].attributeValue = 1
          this.generateAttributeList[2].attributeValueDesc = '国家级'
          break
        case 2:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.provinceOptions
          this.generateAttributeList[2].attributeValue = 2
          this.generateAttributeList[2].attributeValueDesc = '省级'
          break
        case 3:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.cityOptions
          this.generateAttributeList[2].attributeValue = 3
          this.generateAttributeList[2].attributeValueDesc = '市级'
          break
        case 4:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.districtOptions
          this.generateAttributeList[2].attributeValue = 4
          this.generateAttributeList[2].attributeValueDesc = '区级'
          break
      }
    },
    getTreeData (data, num) {
      data.forEach(v => {
        if (v.level <= num) {
          if (v.level === num) {
            // children若为空数组，则将children设为undefined
            v.children = undefined
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(v.children, num)
          }
        }
      })
      return data
    },
    chooseContract(){
      if(!this.onlineContract){
        this.form.spuContractTemplateId = null;
        this.form.spuContractTemplateName = null;
      }
    },
    chooseTemplate(){
      this.contractsTemplateList.forEach(item => {
        if(this.form.spuContractTemplateId == item.id){
          this.$set(this.form,'spuContractTemplateName',item.templateName);
        };
      });
    },
    delTag(index) {
			this.$confirm(this.$t("message.productConfirmOne"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(() => {
        
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
              text: "",
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
    getChildEditor(data, index) {
      this.tinyList[index].text = data;
    },
    wordLimit(val) {
      this.limit = val;
    },
    showAddDialog(num, index) {
      this.dialogVisible = true;
      if (num == 0) {
        this.operateName = this.$t('button.addTag');
        this.$set(this.addObj,'tagName','')
      } else {
        this.editIndex = index;
        this.operateName = this.$t('button.editTag');
        this.$set(this.addObj,'tagName',this.tinyList[index].tagName)
      };
    },
    goback() {
      clearDetail("/project/index");
      // this.$router.push("/project/index");
      history.go(-1);
    },
    toNext() {
      ++this.active;
    },
    toPre() {
      --this.active;
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value = value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 10);
      return value;
    },
    checkSelect(index) {
      this.payList.forEach((item) => {
        if (item.status == false) {
          item.price = "";
        }
      });
    },
    areaChange() {
      this.areaOptionId = "";
      this.generateAttributeList[0].attributeValue = this.form.region.join(',')
      this.generateAttributeList[0].attributeValueDesc = this.$refs['cas'].getCheckedNodes()[0].pathLabels.join(',')
    },
    selectData(val) {
      this.optionList = [];
      let attributeValueDesc = '';
      for (let i = 0; i < this.form.belongData.length; i++) {
        if (Array.isArray(this.form.belongData[i].itemData) == true) {
          this.form.belongData[i].itemData.forEach((it) => {
            this.optionList.push(it);
          });
        } else if (this.form.belongData[i].itemData) {
          this.optionList.push(this.form.belongData[i].itemData);
          this.form.belongData[i].optionList.forEach(item => {
            if(this.form.belongData[i].itemData == item.id){
              attributeValueDesc = item.name;
            }
          });
          this.attributeInfo = {
            attributeId: this.form.belongData[i].categoryId,
            attributeName: this.form.belongData[i].categoryName,
            attributeValue: this.form.belongData[i].itemData,
            attributeValueDesc: attributeValueDesc,
          }
          this.generateAttributeList[1] = this.attributeInfo;
        }
      }
    },
    passValidate(val){
      this.hasPassValidate = false;
      this.hasPassValidate = val;
    },
    // 下一步校验
    checkPrice() {
      if (this.active == 0) {
        // //第一步里的“下一步”
        this.publishNotice("form");
      } else if (this.active == 1) {
        this.$refs.tradeForm.tradeInfoCheck();
        //第二步里的“下一步”
        if(this.hasPassValidate){
          this.toNext();
        }else{
          // this.$message.error('请检查交易信息！')
        };
      };
    },
    // 新增
    finalAdd() {
      this.checkStatus = false;
      //判断至少添加一个标签并包含内容才可创建产品
      this.tinyList.forEach((item) => {
        if (item.tagName==""||item.text == "") {
          this.checkStatus = false;
        }else{
          this.checkStatus = true
        }
      });
      if (this.checkStatus) {
        this.saveParam();
        addByJson(this.params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$notify.success(this.$t("alert.sucessPublish"));
            clearDetail("/project/index");
            clearDetail("/project/ip-service/index");
            clearDetail("/project/common-service/gs-register/index");
            clearDetail("/project/common-service/rz-list/index");
            clearDetail("/project/common-service/legal-service/index");
            clearDetail("/project/common-service/rj-design/index");
            history.go(-1);
          }else{
            this.$message({
              type:'warning',
              message: res.data.msg
            })
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("message.productMsgTipsOne"),
          offset: 300,
        });
      }
    },
    //第一步校验
    publishNotice(formName) {
      if(this.form.level == 1){
        this.form.region = ['000000']
        this.generateAttributeList[0].attributeValue = '000000'
        this.generateAttributeList[0].attributeValueDesc = '全国'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$refs.video.fileList.length > 0) {
            if((this.form.isOnline && (this.onlineContract && this.form.spuContractTemplateId)) || !this.form.isOnline || (this.offlineContract && !this.onlineContract)){
              this.toNext();
            }else{
              this.$message({
                type:'warning',
                message:'请选择合同模板'
              })
            };
          } else {
            this.$message({
              type: "warning",
              message: this.$t("alert.lackofcoverImg"),
              offset: 300,
              duration: 2000,
            });
          }
        }
      });
    },
    // 保存表单数据
    saveParam() {
      this.params = {};
      var imageList = [];
      let tradeInfo = []
      this.$refs.video.fileList.forEach((item) => {
        imageList.push({
          isDefault: this.$refs.video.checkd == item.response.data ? true : false,
          imageUrl: item.response.data,
          mediaUrl: item.response.faceUrl == null ? "" : item.response.faceUrl,
        });
      });
      this.$refs.tradeForm.$refs.modelform.validate(valid =>{
        if(valid){
          tradeInfo = this.$refs.tradeForm.modelform
        }
      })
      this.params = {
        categoryId: Number(this.form.categoryId),
        spuTitle: this.form.spuTitle,
        spuSlogan: this.form.spuSlogan,
        status: this.form.status,
        sortId: parseInt(this.form.sort),
        seoTitle: this.form.seoTitle,
        metaKey: this.form.metaKey,
        metaDetail: this.form.metaDetail.replace(/[, ]/g, ""),
        spuContractTemplateId: this.form.spuContractTemplateId || 0,
        spuContractTemplateName: this.form.spuContractTemplateName,
        workflowId: Number(this.form.workflowId),
        generateAttributeList: this.generateAttributeList,
        detailList: this.tinyList,
        dynamicAttributeList: this.$refs.tradeForm.specificationList,
        skuList: this.$refs.tradeForm.modelform.skuList,
        imageList: imageList,
        isOnline: this.form.isOnline,
        contractScope: (this.onlineContract && this.offlineContract ) ? 3 : this.onlineContract ? 1 : 2
      };
    },
    handlePreview(file) {
      console.log(file);
    },
    getDropdown() {
      getDropPolicy(4).then((res) => {
        this.form.belongData = res.data.data.factors;
        this.$nextTick(() => {
          this.$refs["form"].clearValidate();
        });
      })
      getNewArea().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
          this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
          this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
        }
      })
      getAllFlow().then((res) => {
        this.flowList = res.data.data;
      });
      let param = {
        pageSize: -1,
        pageNo: 1
      }
      getTemplate(param).then(res=>{
        this.contractsTemplateList = res.data.data.records;
      })
    },
  },
  created() {
    this.type = this.$route.query.type;
    this.beFrom = this.$route.query.beFrom;
  },
  mounted() {
    this.getDropdown();
    if (this.type == 1) {
      this.form.categoryId = 1;
      this.title = this.$t("label.projectTitle");
      this.status = this.$t("label.projectStatus");
    }else if(this.type == 2){
      this.title = '知识产权';
      this.form.categoryId = '3';
      this.status = this.$t("label.projectStatus");
    } else if(this.type == 7) {
      this.form.categoryId = '7';
      this.title = '工商注册';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 8) {
      this.form.categoryId = '8';
      this.title = '财税服务';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 9) {
      this.form.categoryId = '9';
      this.title = '融资上市';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 10) {
      this.form.categoryId = '10';
      this.title = '法律服务';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 11) {
      this.form.categoryId = '11';
      this.title = '软件开发';
      this.showStatus = this.$t("label.showStatus");
    }else{

    };
  },
};
</script>
<style lang="scss" scoped>
.add_project {
  width: 100% !important;
  background: #ffffff;
  margin-left: 10px;
  padding-top: 60px;
}
.tag-sty {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
}
.new-page-contain {
  width: 80% !important;
  margin-left: 5%;
  padding-bottom: 30px;
  background: #ffffff;
}
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  margin-top: 20px;
  font-size: 16px;
}
.form-title:first-child {
  margin-top: 25px;
}
.must:before {
  content: "*";
  color: #f56c6c;
  margin-left: -91px;
}
.content-warning {
  color: #f56c6c;
  font-size: 12px;
}
.deleteBtn {
  margin-left: 10px;
  color: chocolate;
  cursor: pointer;
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
.check-btn-select {
  width: 100px;
}
.cursor-pointer {
  cursor: pointer;
  margin-left: 5px;
}
.pay-type-sty {
  font-size: 14px;
  margin: 0 15px 0 20px;
}
.add-top {
  display: flex;
}
.steps-sty {
  width: 85%;
  margin-left: 50px;
}
.tag-name-sty {
  margin-bottom: 22px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background: rgb(75, 154, 228);
  text-align: center;
  color: #ffffff;
}
.border_sty_complex {
  border: 1px solid #dcdfe6;
  border-top: none;
  padding: 0px 20px 0px 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.border_sty_special {
  border-top: 1px solid #dcdfe6;
}
.title_sty_complex {
  display: inline-block;
  border-right: 1px solid #dcdfe6;
  height: 74px;
  margin-right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  width: 200px;
}
.commom_width_add {
  width: 100%;
}
.commom_select_special {
  width: 200px;
}
.must-sty {
  color: red;
}
.btn-confirm {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
.cancel-sty-two {
  margin-left: 20px;
  width: 84px;
}
::v-deep.form-item{
  margin-bottom: 0;
}
::v-deep.el-form-item{
  margin-bottom: 0;
}
.file_contain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.up-flex-sty {
  display: flex !important;
  flex-direction: column;
  font-size: 14px;
}
.contract{
  display: flex;
  line-height: 35px;
  grid-gap: 20px;
}
.pointer_right{
  display: inline-block;
  width: 6px;
  height: 6px;
  border-top: 1px solid #606266;
  border-right: 1px solid #606266;
  transform: rotate(45deg);
  margin: 0 6px 1px 3px;
}

.workflow{
  display: inline-block;
  color: #606266;
  font-size: 14px;
  margin-left: 20px;
}
.commom_height_special {
  width: 100%;
}

.btn-sty{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}
.cancel-style{
  margin-left: 50px;
}
</style>





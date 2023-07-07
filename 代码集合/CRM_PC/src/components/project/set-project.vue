<template>
<!-- 排查完成 -->
  <div id="set_project" class="app-container calendar-list-container">
       <el-row v-show="hideStatus">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form">
            <h3 class="form-title">{{ $t("title.basicParameter") }}</h3>
            <div class="border_sty_complex_edit border_sty_special">
              <span class="title_sty_complex"><span class="must-sty">*</span>产品标题：</span>
              <el-form-item prop="spuTitle" class="commom_height_special">
              <el-input class="commom_width_special" v-model.trim="form.spuTitle" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
            </el-form-item>
            </div>
            <div class="border_sty_complex_edit">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.slogan') }}</span>
              <el-form-item prop="spuSlogan" class="commom_height_special">
                <el-input class="commom_width_special" v-model.trim="form.spuSlogan" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
              </el-form-item>
            </div>
            <div class="border_sty_complex_edit" v-if="!isFastEdit">
              <span class="title_sty_complex"><span class="must-sty">*</span>产品类型：</span>
              <el-form-item class="commom_height_special">
                <span class="commom_width_add" v-if="type == 1">项目申报</span>
                <span class="commom_width_add" v-if="type !=1 && type != 2">{{title}}</span>
                <el-radio-group v-model="form.categoryId" v-if="type == 2">
                  <el-radio :label="3">专利</el-radio>
                  <el-radio :label="4">版权</el-radio>
                  <el-radio :label="5">商标</el-radio>
                  <el-radio :label="6">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="border_sty_complex_edit_belong">
              <span class="title_sty_complex" style="height:500px"><span class="must-sty">*</span>{{ $t('label.coverImg') }}</span>
              <el-form-item prop="productImgFile" class="commom_height_special_img">
                <!-- 封面图片上传 -->
                <vide-upload ref="video"></vide-upload>
                <div>
                  <p>1.上传相关图片，图片选择“展示”会在项目详情页进行展示</p>
                  <p style="margin:-20px -40px -10px 0;">2.图片最多6张包括视频，分辨率为530*378px，格式为jpg，png，gif，mp4，avi，mov等，图片不超过4M，视频不超过100M。</p>
                </div>
              </el-form-item>
            </div>
            <div class="border_sty_complex_edit" v-if="!isFastEdit">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ showStatus }}</span>
              <el-form-item prop="status" class="commom_height_special">
              <el-radio-group v-model="form.status">
                <el-radio label="1">{{ $t("status.show") }}</el-radio>
                <el-radio label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            </div>
            <div class="border_sty_complex_edit" v-if="type == 1 && !isFastEdit">
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
            <div class="border_sty_complex_edit" v-if="type == 1 && !isFastEdit">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.area') }}</span>
              <el-form-item prop="region" class="commom_height_special">
                <el-cascader ref="cas" class="commom_select_special" @change="areaChange" :options="areaOptions" v-model="form.region" :placeholder="prompt" :props="{ value: 'no', label: 'name'}" :disabled="casDisable"></el-cascader>
              </el-form-item>
            </div>
            <div v-if="!isFastEdit">
              <div v-for="(item, index) in form.selectDrop.slice(0,1)" :key="index" >
                <div class="border_sty_complex_edit" v-if="type == 1">
                  <span class="title_sty_complex" style="height:64px;"><span v-if="item.must == 1"><span class="must-sty">*</span></span>{{ item.categoryName + '：' }}</span>
                  <el-form-item
                    :prop="'selectDrop.' + index + '.itemData'"
                    :rules="rules.selectDrop"
                    class="commom_height_special_two"
                    v-if="item.must == 1">
                    <el-select
                      class="commom_select_special"
                      :placeholder="$t('input.choose')"
                      v-model="item.itemData"
                      value-key="id"
                      @change="selectData(item.itemData)"
                      :multiple="item.choice == 1 ? true : false">
                      <el-option
                        v-for="values in item.optionList"
                        :key="values.id"
                        :label="values.name"
                        :value="values.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-else class="commom_height_special_two">
                    <el-select
                      class="commom_select_special"
                      :placeholder="$t('input.choose')"
                      v-model="item.itemData"
                      value-key="id"
                      @change="selectData(item.itemData)"
                      :multiple="item.choice == 1 ? true : false">
                      <el-option
                        v-for="values in item.optionList"
                        :key="values.id"
                        :label="values.name"
                        :value="values.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex"><span class="must-sty">*</span>工作流：</span>
              <el-form-item prop="workflowId">
                <el-select v-model="form.workflowId" class="commom_select_special">
                  <el-option v-for="(item,index) in flowList" :key="index" :label="item.flowNo+'-'+item.flowName" :value="item.id" @mouseover.native="getWorkFlowDetail(item.id)" @select="getWorkFlowDetail(item.id)"></el-option>
                </el-select>
              </el-form-item>
              <div class="workflow">
                <span v-for="(item, index) in workflowInfoList" :key="index">
                  <span>{{!item.finishType ? item.stepName : endObj[item.finishType]}}</span>
                  <span class="pointer_right" v-if="!item.finishType"></span>
                </span>
              </div>
            </div>
            <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex"><span class="must-sty" v-if="form.isOnline">*</span>合同模板：</span>
              <div class="commom_height_special contract">
                <el-checkbox v-model="onlineContract" @change="chooseContract()">电子合同</el-checkbox>
                <el-form-item :prop="onlineContract ? 'spuContractTemplateId' : ''">
                  <el-select v-model="form.spuContractTemplateId" :disabled='!onlineContract' class="commom_select_special" @change="chooseTemplate()">
                    <el-option v-for="(item,index) in contractsTemplateList" :key="index" :label="item.templateId+'-'+item.templateName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-checkbox v-model="offlineContract">纸质合同</el-checkbox>
              </div>
            </div>
            <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex"><span class="must-sty">*</span>是否在线交易</span>
              <el-form-item prop="isOnline" class="commom_height_special">
                <el-radio-group v-model="form.isOnline">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="border_sty_complex_edit">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.formSort') }}</span>
              <el-form-item prop="sortId" class="commom_height_special">
              <el-input type="number" min="1" v-model.trim="form.sortId" show-word-limit class="commom_select_special" />
            </el-form-item>
            </div>
            <h3 class="form-title">SEO信息</h3>
            <div class="border_sty_complex_edit border_sty_special">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.webTitle') }}</span>
              <el-form-item prop="seoTitle" class="commom_height_special">
              <el-input class="commom_width_special" v-model.trim="form.seoTitle" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            </div>
           <div class="border_sty_complex_edit">
              <span class="title_sty_complex"><span class="must-sty">*</span>{{ $t('label.metaKeyword') }}</span>
              <el-form-item prop="metaKey" class="commom_height_special">
              <el-input class="commom_width_special" v-model.trim="form.metaKey" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
            </el-form-item>
           </div>
           <div class="border_sty_complex_edit">
              <span class="title_sty_complex" style="height:122px;"><span class="must-sty">*</span>{{ $t('label.metaDescription') }}</span>
              <el-form-item prop="metaDetail" class="commom_height_special">
              <el-input class="commom_width_special" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model.trim="form.metaDetail" onkeyup="this.value=this.value.replace(/[, ]/g,'')" 
               :placeholder="$t('input.noMorethan200')"
                maxlength="200"
                show-word-limit/>
            </el-form-item>
           </div>
           <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex">发布人：</span>
              <el-form-item class="commom_height_special">
                <span>{{ form.createByName }}</span>
            </el-form-item>
           </div>
           <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex">发布时间：</span>
              <el-form-item class="commom_height_special">
                <span>{{ form.createTime }}</span>
            </el-form-item>
           </div>
           <div class="border_sty_complex_edit"  v-if="!isFastEdit">
              <span class="title_sty_complex">浏览量/收藏量：</span>
              <el-form-item class="commom_height_special">
                <span>浏览量：{{ form.countView }}</span>
                <span style="margin-left:20px;">收藏量：{{ form.countCollect }}</span>
            </el-form-item>
           </div>
          </el-form>
      </el-row>
      <div class="btn-confirm">
      <el-button class="cancel-sty-two" size="medium" type="primary" @click="checkPrice()" v-preventReClick>{{$t('button.save')}}</el-button>
      <el-button class="cancel-sty-two" size="medium" @click="goback">{{$t('button.cancel')}}</el-button>
      </div>
  </div>
</template>

<script>
import videUpload from "@/components/upload/video-upload"
import {
  getDetail,
  modBaseInfo
} from "@/api/project/project";
import { getAllFlow, getWorkFlowInfo } from "@/api/processmanage/work-flow"
import * as CodeMsg from "@/api/common/CodeChange";
import { getDropPolicy , getNewArea} from "@/api/policy/list";
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import PolicyFileUpload from '@/components/file/policyFileUpload';
import { clearDetail } from "@/util/clearDetail"
import { getTemplate } from '@/api/contracts/contracts'
export default {
  props:{
    spuId:{
      type: Number
    },
    productType:{
      type: Number
    },
    isFastEdit:{
      type: Boolean
    }
  },
  components: {
    tinymceEditor,
    PolicyFileUpload,
    videUpload
  },
  data() {
    var recheck = (rule, value, callback) => {
      // rechecking({ title: value, number: this.number }).then(res => {
      //     if (res.data.code === CodeMsg.CODE_2000) {
      //       return callback(new Error(this.$t("input.titleExisted")));
      //     } else {
            callback();
      //     }
      //   }).catch(err => {
      // });
    };
    var templateValidate = (rule, value, callback) =>{
      if(value == null){
        callback('请选择合同模板！')
      }else{
        callback();
      };
    }
    return {
      prompt: '请选择选项',
      onlineContract: false,
      offlineContract: false,
      areaId: '',
      attrId: '',
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
      contractsTemplateList: [],
      params:{},
      disabled: false,
      tinyList:[
        {
          tagName:"项目详情",
          tagContent:""
        },
        {
          tagName:"项目参数",
          tagContent:""
        },
        {
          tagName:"售后保障",
          tagContent:""
        }
      ],
      hideStatus:true,
      active: 1,
      flowList:[],
      filesIdList:[],
      areaOptionId:"",
      optionList:[],
      imgBaseUrl: "",
      fileList: [],
      belongData: [],
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      casDisable: false,
      publishStatus: "",
      putUnderData: [],
      files: [],
      title: "",
      productImgFile: null,
      checkFlieRepet: false,
      editor: "",
      editorContent: "",
      putUnderId: null,
      rules: {
        spuTitle: [
          {
            required: true,
            message: this.$t("input.pleaseInputAticleTitle"),
            trigger: "blur"
          },
          {
            min: 1,
            max: 70,
            message: this.$t("input.txtLong70"),
            trigger: "blur"
          },
          { validator: recheck, trigger: "blur" }
        ],
        spuSlogan: [
          {
            required: true,
            message: "请输入广告语",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: this.$t("input.txtLong30"),
            trigger: "blur"
          }
        ],              
        guidancePrice:[
          { message: this.$t("message.guidePriceRules"),pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{0,2})?$/, trigger: "blur"},
          { message: this.$t("message.guidePriceRules"),pattern: /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/, trigger: "blur"},
        ],
        region: [
          {
            required: true,
            message: this.$t("input.pleaseChooseRegion"),
            trigger: "change"
          }
        ],
        level: [
          { required: true, message: this.$t("input.pleaseChooseLevel"), trigger: "change" },
        ],
        status: [
          {
            required: true,
            message: this.$t("input.pleaseChooseShowStatus"),
            trigger: "change"
          }
        ],
        sortId:[
          { required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", },
          { message: "请输入正整数", pattern: /^[0-9]*[1-9][0-9]*$/, trigger: "blur" },
        ],
        seoTitle: [
          { required: true, message: this.$t("input.pleaseInputWebTitle"), trigger: "blur"},
          {
            min: 1,
            max: 70,
            message: this.$t("input.txtLong70"),
            trigger: "blur"
          }
        ],
        metaKey: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur"},
          {
            min: 1,
            max: 100,
            message: this.$t("input.txtLong100"),
            trigger: "blur"
          }
        ],
        metaDetail: [
          { required: true, message: "请输入meta描述", trigger: "blur"}
        ],
        selectDrop: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "change"
          }
        ],
        putUnder: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "change"
          }
        ],
        workflowId: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "blur"
          }
        ],
        isOnline: [{ required: true, message: "请选择", trigger: "change" }],
        spuContractTemplateId: [{required: true, validator: templateValidate, message: this.$t("input.choose"), trigger: "change" }],
      },
      labelPosition: "right",
      form: {
        selectDrop: [],
        workflowId:"",
        sortId: "",
        isOnline: true
      },
      showStatus: "",
      number: "",
      type: "",
      fileName: [],
      workflowInfoList: [],
      urls: [],
      contentNeed: false,
      beFrom: null,
      workFlowId: "",
      timer:null,
      endObj: {
        "A": "完成(A)：仅可选完成",
        "B": "完成(B)：可选通过、不通过",
        "C": "完成(C)：可选完成、通过、不通过",
      },
      productImg: "",
      deleteStatus: false,
      ItIndex: -1,
      limit :true, //编辑框字数是否超出 接收子组件传参
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
          type: "0",
        },
      ],
    };
  },
  created() {
    if(this.isFastEdit){
      this.number = this.spuId;
      this.type = this.productType;
    }
    if(this.$route.query.number){
      this.number = this.$route.query.number;
      this.beFrom = this.$route.query.beFrom;
      this.type = this.$route.query.type;
    }
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
    levelChange(e,status,item){
      switch (e){
        case 1:
          this.casDisable = true
          this.prompt = '全国'
          this.$set(this.form, 'region', null);
          this.$set(this.generateAttributeList[2], 'attributeValue', 1);
          this.$set(this.generateAttributeList[2], 'attributeValueDesc', '国家级');
          break
        case 2:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.provinceOptions
          this.$set(this.form, 'region', status ? item.attributeValue.split(',').map(String) : null);
          this.$set(this.generateAttributeList[2], 'attributeValue', 2);
          this.$set(this.generateAttributeList[2], 'attributeValueDesc', '省级');
          break
        case 3:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.cityOptions
          this.$set(this.form, 'region', status ? item.attributeValue.split(',').map(String) : null);
          this.$set(this.generateAttributeList[2], 'attributeValue', 3);
          this.$set(this.generateAttributeList[2], 'attributeValueDesc', '市级');
          break
        case 4:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.districtOptions
          this.$set(this.form, 'region', status ? item.attributeValue.split(',').map(String) : null);
          this.$set(this.generateAttributeList[2], 'attributeValue', 4);
          this.$set(this.generateAttributeList[2], 'attributeValueDesc', '区级');
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
    wordLimit(val) {
      this.limit = val;
    },
    toNext(){
      this.hideStatus = false
      this.active = 2
    },
    toPre(){
      this.hideStatus = true
      this.active = 1
    },
    inputId(){
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
    checkSelect(index) {
      this.payList.forEach(item=>{
        if(item.status == false){
          item.price = ""
        }
      })
    },
    areaChange(e) {
      this.areaOptionId = "";
      this.generateAttributeList[0].attributeValue = this.form.region.join(',')
      this.generateAttributeList[0].attributeValueDesc = this.$refs['cas'].getCheckedNodes()[0].pathLabels.join(',')
    },
    selectData(val) {
        this.optionList = [];
        let attributeValueDesc = '';
        for (let i = 0; i < this.form.selectDrop.length; i++) {
          if (Array.isArray(this.form.selectDrop[i].itemData) == true) {
            this.form.selectDrop[i].itemData.forEach((it) => {
              this.optionList.push(it);
            });
          } else if (this.form.selectDrop[i].itemData) {
            this.optionList.push(this.form.selectDrop[i].itemData);
            this.form.selectDrop[i].optionList.forEach(item => {
              if(this.form.selectDrop[i].itemData == item.id){
                attributeValueDesc = item.name;
              }
            });
            this.attributeInfo = {
              id: this.putUnderId,
              spuId: Number(this.number),
              attributeId: this.form.selectDrop[i].categoryId,
              attributeName: this.form.selectDrop[i].categoryName,
              attributeValue: this.form.selectDrop[i].itemData,
              attributeValueDesc: attributeValueDesc,
            }
            this.generateAttributeList[1] = this.attributeInfo;
          }
        }
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    limitNum(val){
      this.limit = val;
    },
    goback() {
      clearDetail("/project/index")
      if(this.isFastEdit){
         this.$emit("close")
      }else{
        history.go(-1);
      };
    },
    checkPrice(){
      this.saveNotice('form')
    },
    saveNotice(formName) {
      if(this.form.region==null||JSON.parse(JSON.stringify(this.form.region)).length == 0){
        this.form.region = ['000000']
        this.generateAttributeList[0].attributeValue = '000000'
        this.generateAttributeList[0].attributeValueDesc = '全国'
      }
      this.$refs[formName].validate(valid => {
        if(valid){
          if (this.$refs.video.fileList.length>0) {
            if((this.form.isOnline && (this.onlineContract && this.form.spuContractTemplateId)) || !this.form.isOnline || (this.offlineContract && !this.onlineContract)){
              this.saveParam();
            }else{
              this.$message({
                type:'warning',
                message:'请选择合同模板'
              })
            }
          } else{
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
    saveParam() {
      this.params = {}
      let imageList = []
      this.$refs.video.fileList.forEach((item) => {
        imageList.push({
          isDefault: this.$refs.video.checkd == item.response.data ? true : false,
          imageUrl: item.response.data,
          mediaUrl: item.response.faceUrl == null ? "" : item.response.faceUrl,
        });
      });
      this.params = {
        id:this.form.id,
        categoryId:Number(this.form.categoryId),
        projectId:this.form.projectId,
        spuTitle:this.form.spuTitle,
        spuSlogan:this.form.spuSlogan,
        status:this.form.status,
        seoTitle:this.form.seoTitle,
        metaKey:this.form.metaKey,
        metaDetail:this.form.metaDetail.replace(/[, ]/g, ""),
        workflowId:Number(this.form.workflowId),
        spuContractTemplateId: this.form.spuContractTemplateId || 0,
        spuContractTemplateName: this.form.spuContractTemplateName,
        isOnline:this.form.isOnline,
        sortId: parseInt(this.form.sortId),
        imageList: imageList,
        contractScope: (this.onlineContract && this.offlineContract ) ? 3 : this.onlineContract ? 1 : 2
      }
      if(this.generateAttributeList.length > 0){
        this.params.generateAttributeList = Array.from(this.generateAttributeList);
      }
      this.params.generateAttributeList.forEach(item => {
        if(item.attributeName == '归口'){
          item.attributeValue = String(item.attributeValue)
        }
      })
      modBaseInfo(this.params).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type:"success",
            message:"修改成功！"
          })
          this.getDetailData()
          if(this.isFastEdit){
            this.$emit("close")
          }else{
            history.go(-1);
          };
        } else{
          this.$message({
            type:"warning",
            message: res.data.msg
          })
        }
      })
    },
    unique(names) {
      const res = new Map();
      return names.filter(names => !res.has(names) && res.set(names, 1));
    },
    getDetailData() {
      getDetail({spuId:this.number}).then(res => {
        this.form = res.data.data;
        if (this.form.workflowId) {
          this.getWorkFlowDetail(this.form.workflowId)
        }
        if(this.form.contractScope == 3){
          this.onlineContract = true;
          this.offlineContract = true;
        }else if(this.form.contractScope == 2){
          this.offlineContract = true;
        }else if(this.form.contractScope == 1){
          this.onlineContract = true;
        }
        this.form.spuContractTemplateId = this.form.spuContractTemplateId > 0 ? Number(this.form.spuContractTemplateId) : null;
        this.form.selectDrop = this.belongData;
        this.form.sortId = res.data.data.sortId
        this.publishStatus = res.data.data.isDraft;
        let data = {
          spuTitle: this.form.spuTitle,
          number: this.number
        };
        this.$emit("getTitle", data);
        try {
          let arr = res.data.data.generateAttributeList
          arr.forEach(item => {
            if(item.attributeId == 2){
              this.putUnderId = item.id
              this.$set(this.generateAttributeList, 1, item);
            }else{
              let val = item.attributeValue
              this.$set(this.form, 'level', Number(val));
              this.$set(this.generateAttributeList, 2, item);
            }
          });
          this.$nextTick(()=>{
            this.levelChange(Number(this.form.level), true, arr[0])
            this.$set(this.generateAttributeList, 0, arr[0]);
          })
        } catch (error) {
          
        };
        if (res.data.data.policyClassVO) {
          this.form.putUnder = res.data.data.policyClassVO;
          this.$set(this.form.putUnder,"options",this.form.putUnder.optionsName);
          this.$set(this.form.putUnder, "id", this.form.putUnder.optionsId);
          this.$delete(this.form.putUnder, "optionsName");
          this.$delete(this.form.putUnder, "optionsId");
        }
        if(res.data.data.imageList!==""&&res.data.data.imageList.length == 0){
            this.$refs.video.fileList = []
            this.$refs.video.fileList.push({
            response:{
              data:res.data.data.imageList,
            }
          })
          // this.$refs.video.checkd = res.data.data.coverUrl
        }else if(res.data.data.imageList.length > 0){
          if (res.data.data.imageList!==null) {
            this.$refs.video.fileList=[]
            res.data.data.imageList.forEach(item=>{
            this.$refs.video.fileList.push({
            response:{
              data:item.imageUrl,
              faceUrl:item.mediaUrl
            }
          })
          if(item.isDefault == true){
            this.$refs.video.checkd = item.imageUrl
          }
          })
        }
        }
        if (this.generateAttributeList.length > 1) {
          this.form.selectDrop.forEach((item, index) => {
              if (item.choice == 0 && item.categoryId == this.generateAttributeList[1].attributeId) {
                this.$set(item,'itemData',Number(this.generateAttributeList[1].attributeValue));
              } else if (item.choice == 1 && item.categoryId == val.id) {
                item.itemData = []
                item.itemData = this.generateAttributeList[1].attributeValue.split(',');
              }
          });
        }
        this.form.workflowId = this.form.workflowId
      }).catch(err => {

      });
    },
    async getDropdown() {
      await getAllFlow().then(res=>{
        this.flowList = res.data.data
      })
      await getNewArea().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
          this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
          this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
        }
      })
      await getDropPolicy(4).then(res => {
        this.belongData = res.data.data.factors;
        this.$nextTick(()=>{
          this.getDetailData()
        });
      })
      let param = {
        pageSize: -1,
        pageNo: 1
      }
      await getTemplate(param).then(res=>{
        this.contractsTemplateList = res.data.data.records;
      })
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    }
  },
  mounted() {
    this.switch();
    this.getDropdown();
    if (this.type == 1) {
      this.title = this.$t("label.projectTitle");
      this.showStatus = this.$t("label.projectStatus");
    } else if(this.type == 2) {
      this.title = '知识产权';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 7) {
      this.title = '工商注册';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 8) {
      this.title = '财税服务';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 9) {
      this.title = '融资上市';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 10) {
      this.title = '法律服务';
      this.showStatus = this.$t("label.showStatus");
    } else if(this.type == 11) {
      this.title = '软件开发';
      this.showStatus = this.$t("label.showStatus");
    }else{

    };
  }
};
</script>
<style scoped>
.form-title {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  margin-top: 20px;
  font-size: 16px;
}
.form-title:first-child{
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
.deleteBtn{
  margin-left:10px;
  color: chocolate;
  cursor:pointer;
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
.video-avatar{
  width: 148px;
  height: 148px;
  border: 1px solid #DCDFE6;
}
.card_img_edit{
  position: absolute;
  bottom: -30px;
  left: 0;
  z-index: 1000;
  cursor: pointer;
}
.card_img_edit:hover{
  color:  rgb(75, 154, 228);
}
.card_img_sty{
  position: absolute;
  bottom: -30px;
  left: 60px;
  z-index: 1000;
}
.border_sty_complex_edit{
  border: 1px solid #DCDFE6;
  border-top: none;
  padding: 0px 20px 0px 20px;
  display: -webkit-box;
  justify-content:flex-start;
  align-items: center;
}
.border_sty_complex_edit_belong{
  border: 1px solid #DCDFE6;
  border-top: none;
  padding: 0px 20px 0px 20px;
  display: flex;
  justify-content:flex-start;
  align-items: center;
}
.border_sty_special{
  border-top: 1px solid #DCDFE6;
}
.title_sty_complex{
  display:inline-block;
  border-right: 1px solid #DCDFE6;
  height: 74px;
  margin-right: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  width: 200px;
}
.commom_height_special{
  width: 100%;
}
#set_project :deep(.form-item){
  margin-bottom: 0;
}
#set_project :deep(.el-form-item){
  margin-bottom: 0;
}
.commom_height_special_img{
  margin-top:12px;
  width: 75%;
}
.commom_width_special{
  width: 880px;
}
.commom_select_special{
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
.file_contain{
  display: flex;
  justify-content: center;
  align-items: center;
}
.up-flex-sty{
  display: flex !important;
  flex-direction: column;
  font-size: 14px;
}
.contract{
  display: flex;
  line-height: 35px;
  grid-gap: 10px;
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
  color: #606266;
  font-size: 12px;
  margin-left: 30px;
}
</style>
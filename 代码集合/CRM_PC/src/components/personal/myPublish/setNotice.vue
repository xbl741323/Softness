<!-- 排查完成 -->
<template>
  <div class="app-container calendar-list-container full-page" v-loading.fullscreen.lock="fullscreenLoading">>
      <h3 v-if="type==0">{{$t('title.noticeDetail')}}</h3>
      <h3 v-if="type==1">{{$t('title.policyDetail')}}</h3>
      <h3 v-if="type==2">{{$t('title.troubleDetail')}}</h3>
      <el-row>
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form" label-width="200px">
            <h3 class="form-title">{{$t('title.basicParameter')}}</h3>
            <el-form-item :label="title" prop="title">
              <el-input v-model="form.title" :disabled="deleteStatus" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit @change="handlerChange" />
            </el-form-item>
            <el-form-item :label="$t('label.slogan')" prop="slogan" v-if="type == 4">
              <el-input v-model.trim="form.slogan" :disabled="deleteStatus" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.coverImg')" prop="productImgFile" v-if="type == 4">
              <span class="must"></span>
              <up-img :url="productImgFile" :editable="deleteStatus" @change-license="uploadImg"></up-img>
            </el-form-item>
            <el-form-item :label="$t('label.showStatus')" prop="showStatus">
              <el-radio-group v-model="form.showStatus" :disabled="deleteStatus">
                <el-radio v-if="beFrom==1&&type!=4" :label="0" disabled>{{$t('status.toped')}}</el-radio>
                <el-radio v-if="beFrom!=1&&type!=4" :label="0">{{$t('status.toped')}}</el-radio>
                <el-radio :label="1">{{$t('status.show')}}</el-radio>
                <el-radio :label="2">{{$t('status.noShow')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="type == 4" :label="$t('label.formSort')" prop="sort">
              <el-input v-model.trim="form.sort" type="number" :disabled="deleteStatus" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
              <el-input v-model="form.metaTitle" :disabled="deleteStatus" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
              <el-input v-model="form.metaKeyword" :disabled="deleteStatus" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
              <el-input type="text" :disabled="deleteStatus" :autosize="{ minRows: 4, maxRows: 6 }" v-model.trim="form.metaDescription" onkeyup="this.value=this.value.replace(/[, ]/g,'')" :placeholder="$t('input.noMorethan200')" maxlength="200" show-word-limit />
            </el-form-item>
          
             <!-- 上传图片 -->
            <img-upload ref="upload" :status="form.showStatus"></img-upload>

            <h3 class="form-title" style="margin-top: 50px">{{$t('title.detailInfo')}}</h3>
            <!-- 级别 -->
            <el-form-item :label="$t('label.level')" prop="level">
              <el-select v-model="form.level" :placeholder="$t('input.choose')" @change="levelChange" :disabled="deleteStatus">
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 地区 -->
            <el-form-item :label="$t('label.area')" prop="region">
              <el-cascader ref="cas" @change="putArea" :options="areaOptions" v-model="form.region" :placeholder="prompt" :props="{ value: 'no', label: 'name'}" :disabled="casDisable||deleteStatus"></el-cascader>
            </el-form-item>
            <!-- 归口 -->
            <div v-for="(item,index) in form.selectDrop" :key="index">
              <el-form-item :label="item.categoryName+'：'" :prop="'selectDrop.'+index+'.itemData'" :rules="rules.selectDrop" v-if="item.must==1">
                <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="selectData" :multiple="item.choice == 1?true:false" value-key="id" :disabled="deleteStatus">
                  <el-option v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else :label="item.categoryName+'：'">
                <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="selectData" :multiple="item.choice == 1?true:false" value-key="id" :disabled="deleteStatus">
                  <el-option v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 申报时间 -->
            <el-form-item :label="$t('label.declarationTime')" prop="declarationTime" :rules="rules.declarationTime">
              <el-date-picker
                v-model="form.declarationTime"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                class="receive-time">
              </el-date-picker>
            </el-form-item>
            <!-- 关联产品 -->
            <el-form-item :label="$t('label.relatedProduct')" prop="productData">
              <template v-if="deleteStatus">
                <el-tag
                  class="mr"
                  v-for="item in selectProList"
                  :key="item.spuId"
                  type=""
                  :disable-transitions="true">
                  {{item.spuTitle}}
                </el-tag>
              </template>
              <template v-else>
                <el-tag
                  class="mr"
                  v-for="item in selectProList"
                  :key="item.spuId"
                  type=""
                  closable
                  @close="closeTag(item)"
                  :disable-transitions="true">
                  {{item.spuTitle}}
                </el-tag>
              </template>
              <!-- 添加产品 -->
              <el-button type="primary" v-preventReClick @click="showProduct" :disabled="deleteStatus">{{$t("button.addProduct")}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('label.detailContent')" prop="content">
              <span class="must"></span>
              <tinymce-editor v-model="editorContent" :disabled="deleteStatus" :value="editorContent" @getEditorValue="getChildEditor" @limit='limitNum' ref="editor"></tinymce-editor>
              <span class="content-warning" v-if="contentNeed">{{$t('input.detailContent')}}</span>
            </el-form-item>
            <div class="notice-file" style="margin-top: 30px">
               <!-- 添加附件 -->
              <el-form-item :label="$t('label.adjunct')" v-if="type != 4">
                <policy-file-upload  v-if="uploadDialog" :librarySelectList="libraryFileList" :uploadList="fileList" :listLength='fileListLength' :filesTempList="filesTempList" @closeDialog='closeReplace' @selectedList='selectedIdsList' @fileList="getLocaltionFileList"></policy-file-upload>
                <el-button size="small" type="primary" @click="uploadDialog = true" :disabled="deleteStatus || filesIdLength + fileListLength + filesTempListLength >=5">{{ $t("button.addAdjunct")}}</el-button>
                <span class="limit-file">仅限添加5条文件</span>
                <div v-for="item in libraryFileList" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFileId(item)">x</span>
                </div>
                <div v-for="item in fileList" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFile(item)">x</span>
                </div>
                <div v-for="item in filesTempList" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFileTemp(item)">x</span>
                </div>
              </el-form-item>
            </div>
            <el-form-item :label="$t('label.publishMan')">
              <p style="margin:0">
                <el-tooltip effect="dark" :content="'工号：'+deptInfo.number+'   部门：'+deptInfo.deptName" placement="right">
                  <span>{{form.createName}}</span>
                </el-tooltip>
              </p>
            </el-form-item>
            <el-form-item :label="$t('label.publishTime')">
              <span>{{ form.createTime }}</span>
            </el-form-item>
            <el-form-item :label="$t('label.viewNumber')">
              <p style="margin:0">
                <span>{{$t('message.viewNumber')}} {{form.pageViews}}</span>
                <span style="margin-left: 16px">{{$t('message.collectNumber')}} {{form.collects}}</span>
              </p>
            </el-form-item>
          </el-form>
        </el-card>
      </el-row>
      <div class="btn-contain" v-if="deleted==0">
      <el-button type="primary" @click="saveNotice('form', publishStatus == 1 ? 1 : 0)" v-preventReClick>{{publishStatus == 1 ? $t('button.save') : '提交审核'}}</el-button>
      <el-button type="success" @click="publishNotice('form')"  v-if="publishStatus == 1" v-preventReClick>提交审核</el-button>
      <el-button type="info" @click="goback">{{$t('button.cancel')}}</el-button>
      <el-button type="warning" @click="previewNotice">{{$t('button.preview')}}</el-button>
      <el-button type="danger" @click="delNotice" v-preventReClick>
        <span v-if="type!=4">{{$t('button.deleteArticle')}}</span>
        <span v-else>{{$t('button.deleteProject')}}</span>
      </el-button>
    </div>
    <!-- 添加关联产品 -->
    <add-product @receive-product="receiveProduct" @refresh="refresh()" :pageFrom="0" ref="child"></add-product>
  </div>
</template>

<script>
import {
  getDetail,
  addNotice,
  deleteNotice,
  editNotice,
  rechecking
} from "@/api/personal/notice";
import imgUpload from "@/components/upload/img-upload" 
import * as CodeMsg from "@/api/common/CodeChange";
import { getDropPolicy, getNewArea } from "@/api/policy/list";
import upImg from "@/components/policy/upImg";
import tinymceEditor from "@/views/policySquare/tinymceEditor";
import PolicyFileUpload from '@/components/file/policyFileUpload';
import { getEmpInfo } from "@/api/project/wtClass"
import { clearDetail } from "@/util/clearDetail"
import addProduct from "@/components/policy/add-product";
export default {
  components: {
    upImg,
    tinymceEditor,
    PolicyFileUpload,
    imgUpload,
    addProduct
  },
  data() {
    var recheck = (rule, value, callback) => {
      rechecking({ title: value, number: this.number }).then(res => {
          if (res.data.code === CodeMsg.CODE_2000) {
            return callback(new Error(this.$t("input.titleExisted")));
          } else {
            callback();
          }
        }).catch(err => {
          console.log(err);
        });
    };
    return {
      filesIdLength: 0,
      fileListLength: 0,
      filesTempListLength: 0,
      libraryFileList:[],//接收文件库选择的文件列表
      filesIdList:[],
      uploadDialog: false,//添加附件
      areaOptionId:"",
      optionList:[],
      imgBaseUrl: "",
      fullscreenLoading: false,
      fileList: [],
      belongData: [],
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      publishStatus: "",
      putUnderData: [],
      deptInfo: {},
      files: [],
      title: "",
      productImgFile: null,
      checkFlieRepet: false,
      editor: "",
      editorContent: "",
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
      articleStatus: "",//审核状态
      rules: {
        title: [
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
        slogan: [
          {
            required: true,
            message: this.$t("input.pleaseInputAticleTitle"),
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: this.$t("input.txtLong30"),
            trigger: "blur"
          }
        ],
        region: [
          {
            required: true,
            message: this.$t("input.pleaseChooseArea"),
            trigger: "change"
          }
        ],
        showStatus: [
          {
            required: true,
            message: this.$t("input.pleaseChooseShowStatus"),
            trigger: "change"
          }
        ],
        sort:[
          { required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", },
        ],
        metaTitle: [
          {
            required: true,
            message: this.$t("input.pleaseInputWebTitle"),
            trigger: "blur"
          },
          {
            min: 1,
            max: 70,
            message: this.$t("input.txtLong70"),
            trigger: "blur"
          }
        ],
        metaKeyword: [
          {
            required: true,
            message: this.$t("input.pleaseInputMetaKeywords"),
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: this.$t("input.txtLong100"),
            trigger: "blur"
          }
        ],
        metaDescription: [
          {
            required: true,
            message: this.$t("input.pleaseInputMetaKeywords"),
            trigger: "blur"
          }
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
        level: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "change"
          }
        ],
        declarationTime: [
          { required: true, message: this.$t("input.pleaseChooseDate"), trigger: "blur" },
        ],
      },
      labelPosition: "right",
      form: {
        selectDrop: [],
        region: [],
        level: null,
        productData: [],
        declarationTime: []
      },
      number: "",
      type: "",
      fileName: [],
      urls: [],
      contentNeed: false,
      beFrom: null,
      deleted: "",
      productImg: "",
      deleteStatus: false,
      ItIndex: -1,
      limit :true, //编辑框字数是否超出 接收子组件传参
      casDisable: false,
      prompt: '请选择选项',
      articleId: null,
      username: "",
      selectProList: [], // 选择的产品数据
      filesTempList: [],
    };
  },
  created() {
    this.number = this.$route.query.number;
    this.beFrom = this.$route.query.beFrom;
    this.type = this.$route.query.type;
    this.deleted = this.$route.query.deleted;
    this.deletedStatus();
  },
  computed: {},
  methods: {
    // 回显选择的产品数据
    receiveProduct(val) {
      this.selectProList = val
    },
    // 添加产品
    showProduct() {
      this.$nextTick(()=>{
        this.$refs.child.showProduct()
        this.$refs.child.getList()
        this.$refs.child.setProList(JSON.parse(JSON.stringify(this.selectProList)))
      })
    },
    // 关闭标签
    closeTag(item) {
      this.$confirm('确认删除'+item.spuTitle+'吗？','删除',{
        type:'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        this.selectProList.splice(this.selectProList.indexOf(item), 1);
      })
    },
    levelChange(e,status,item){
      switch (e){
        case 1:
          this.casDisable = true
          this.prompt = '全国'
          this.$set(this.form, 'region', null);
          break
        case 2:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.provinceOptions
          this.$set(this.form, 'region', status ? item.split(',').map(String) : null);
          break
        case 3:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.cityOptions
          this.$set(this.form, 'region', status ? item.split(',').map(String) : null);
          break
        case 4:
          this.casDisable = false
          this.prompt = '请选择选项'
          this.areaOptions = this.districtOptions
          this.$set(this.form, 'region', status ? item.split(',').map(String) : null);
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
    closeReplace(val){
      this.uploadDialog = val;
    },
    deleteFile(row){
      this.$confirm('确认删除'+row.name+'吗？','删除',{
        type:'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        this.fileList.splice(this.fileList.indexOf(row),1);
        this.fileListLength = this.fileList.length;// 删除后的文件数量
      })
    },
    deleteFileTemp(row){
      this.$confirm('确认删除'+row.name+'吗？','删除',{
        type:'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        this.filesTempList.splice(this.filesTempList.indexOf(row),1);
        this.fileListLength = this.filesTempList.length;// 删除后的文件数量
      })
    },
    deleteFileId(row){
      this.$confirm('确认删除'+row.name+'吗？','删除',{
        type:'warning',
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        this.libraryFileList.splice(this.libraryFileList.indexOf(row),1);
        this.filesIdList.splice(this.filesIdList.indexOf(row.id));
        this.filesIdLength = this.libraryFileList.length;//删除后文件数量
      })
    },
    getLocaltionFileList(val){
      if(this.fileList.length == 0){
        this.fileList = val;
      }else{
        const list =[];
        this.fileList.forEach(oldItem => {
          list.push(oldItem.name);
        });

        val.forEach(newItem => {
          if(list.indexOf(newItem.name)>-1){

          }else{
            this.fileList.push(newItem);
          }
        });
      }
      this.fileListLength = this.fileList.length;//删除后文件数量
      this.replaceDialog = false;
    },
    selectedIdsList(val){//选中的文件id
      this.libraryFileList = val
      this.filesIdLength = this.libraryFileList.length;
    },

    putArea(val){
      console.log(this.form.region, "输出选择的地区");
    },
    selectData(val) {
      this.optionList = [];
       for (let i = 0; i < this.form.selectDrop.length; i++) {
        if (Array.isArray(this.form.selectDrop[i].itemData) == true) {
          this.form.selectDrop[i].itemData.forEach(it=>{
            this.optionList.push(it);
          })
        } else {
          this.optionList.push(this.form.selectDrop[i].itemData);
        }
      }
    },
    uploadImg(imgUrl) {
      let blob = new Blob([imgUrl]);
      let objectUrl = window.URL.createObjectURL(blob);
      let imgFile = this.base64ImgtoFile(imgUrl);
      this.productImg = imgFile;
      this.productImgFile = imgUrl;
    },
    base64ImgtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    limitNum(val){
      this.limit = val;
    },
    deletedStatus() {
      if (this.deleted == 1) {
        this.deleteStatus = true;
      } else {
        this.deleteStatus = false;
      }
    },
    previewNotice() {
      this.transferData = {
        title: this.form.title,
        slogan: this.form.slogan,
        content: this.editorContent
      };
      if (this.type == 4) {
        let routeData = this.$router.resolve({
          path: "/project-preview",
          query: {
            form: JSON.stringify(this.transferData),
            url: this.productImgFile
          }
        });
        window.open(routeData.href);
      } else {
        sessionStorage.setItem('transferData',JSON.stringify(this.transferData))
        sessionStorage.setItem('files',JSON.stringify(this.fileName))
        let routeData = this.$router.resolve({
          path: "/policy-preview",
        });
        window.open(routeData.href);
      }
    },
    goback() {
      clearDetail("/personal/myPublish")
      this.$router.push("/personal/myPublish");
    },
    saveNotice(formName, type) {
      if (this.checkFlieRepet) {
        this.$message({
          type: "warning",
          message: this.repeatName + this.$t("alert.fileNameRepeat"),
          offset: 300,
          duration: 1500
        });
      } else if(this.limit){
        if(this.form.region==null||JSON.parse(JSON.stringify(this.form.region)).length == 0){
          this.form.region = ['000000']
        }
        this.saveParam();
        if(this.articleStatus){
          this.param.append("policyStatus", this.articleStatus);
        }else{
          this.param.append("policyStatus", 0);
        }
        this.param.append("isDraft", type)
        this.$refs[formName].validate(valid => {
          if (
            valid &&
            this.editorContent.trim() != ""
          ) {
            let config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };
            this.fullscreenLoading = true
            editNotice(this.param, config).then(res => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$notify.success(this.$t("alert.sucessEdit"));
                  clearDetail("/personal/myPublish")
                  this.$router.push("/personal/myPublish");
                }else{
                  this.$message({
                    type: "warning",
                    message: res.data.msg,
                    offset: 300,
                    duration: 1500
                  });
                }
                this.fullscreenLoading = false
              }).catch(err => {
                console.log(err);
              });
          } else {
            if (
              this.editorContent == "" ||
              this.editorContent == "<p><br></p>"
            ) {
              this.contentNeed = true;
            }
            this.$message({
              type: "warning",
              message: this.$t("alert.checkForm"),
              offset: 300,
              duration: 1500
            });
          }
        });
      }else{
         this.$message({
          type: "warning",
          message: '详情内容字数超出上限！',
          offset: 300,
          duration: 2000,
        });
      }
    },
    publishNotice(formName) {
      if (this.checkFlieRepet) {
        this.$message({
          type: "warning",
          message: this.repeatName + this.$t("alert.fileNameRepeat"),
          offset: 300,
          duration: 1500
        });
      } else if(this.limit){
        if(this.form.region==null||JSON.parse(JSON.stringify(this.form.region)).length == 0){
          this.form.region = ['000000']
        }
        this.saveParam();
        if(this.articleStatus){
          this.param.append("policyStatus", this.articleStatus);
        }else{
          this.param.append("policyStatus", 0);
        }
        this.param.append("isDraft", 0)
        this.$refs[formName].validate(valid => {
          if (
            valid &&
            this.editorContent != "" &&
            this.editorContent != "<p><br></p>"
          ) {
            let config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };
            this.fullscreenLoading = true
            addNotice(this.param, config).then(res => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$notify.success(this.$t("alert.sucessPublish"));
                  clearDetail("/personal/myPublish")
                  this.$router.push("/personal/myPublish");
                }else{
                  this.$message({
                    type: "warning",
                    message: res.data.msg,
                    offset: 300,
                    duration: 1500
                  });
                }
                this.fullscreenLoading = false
              })
          } else {
            if (
              this.editorContent == "" ||
              this.editorContent == "<p><br></p>"
            ) {
              this.contentNeed = true;
            }
            this.$message({
              type: "warning",
              message: this.$t("alert.checkForm"),
              offset: 300,
              duration: 1500
            });
          }
        });
      }else{
         this.$message({
          type: "warning",
          message: '详情内容字数超出上限！',
          offset: 300,
          duration: 2000,
        });
      }
    },
    saveParam() {
      this.areaOptionId = 2
      this.optionList= []
      for (let i = 0; i < this.form.selectDrop.length; i++) {
        if (Array.isArray(this.form.selectDrop[i].itemData) == true) {
          this.form.selectDrop[i].itemData.forEach(it=>{
            this.optionList.push(it);
          })
        } else {
          this.optionList.push(this.form.selectDrop[i].itemData);
        }
      }
      for (let i = 0; i < this.optionList.length; i++) {
          if(this.optionList[i] == [] || this.optionList[i] == "" || this.optionList[i] == undefined){
            this.optionList.splice(i,1);
            i = i - 1;
          }
        };
      this.param = new FormData();
      this.param.append("type", this.type);
      this.param.append("title", this.form.title);
      this.param.append("number", this.number);
      this.param.append("showStatus", this.form.showStatus);
      if (this.form.sort != ""&&this.type == 4) {
        this.param.append("sort", this.form.sort);
      }
      this.param.append("metaTitle", this.form.metaTitle);
      this.param.append("metaKeyword", this.form.metaKeyword);
      this.param.append("metaDescription", this.form.metaDescription);
      let fileTempIds = []
      this.filesTempList.forEach(item => {
        fileTempIds.push(item.id)
      })
      if (fileTempIds.length > 0) {
        this.param.append("fileTempIds", fileTempIds)
      }
      if(this.username){
        this.param.append("createUser", this.username);
      }
      if (this.fileList.length > 0) {
        this.fileList.forEach((file) => {
          this.param.append("files", file.raw, file.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
        });
      }
      if (this.form.declarationTime) {
        this.param.append(
          "applyStartTime",
          this.$moment(this.form.declarationTime[0]).format("YYYY-MM-DD")
        );
        this.param.append(
          "applyEndTime",
          this.$moment(this.form.declarationTime[1]).format("YYYY-MM-DD")
        );
      }
      if (this.selectProList.length > 0) {
        this.selectProList.forEach((item,index)=>{
          this.param.append("prods["+index+"].spuId", item.spuId);
          this.param.append("prods["+index+"].spuTitle", item.spuTitle);
        })
      }
      if (this.form.slogan != undefined) {
        this.param.append("slogan", this.form.slogan);
      }
      if (this.form.region != null) {
        this.param.append("areaNo", this.form.region.toString());
        this.param.append("areaOptionId", this.areaOptionId);
      }
      if(this.form.level){
        this.param.append("level", this.form.level);
      }
      this.param.append("id", this.articleId);
      this.param.append("optionIds", this.optionList);
      this.param.append("content", this.editorContent);
      let fileIdsList = []
      this.libraryFileList.forEach(file => {
        fileIdsList.push(file.id);
      });
      if(this.filesIdList.length>0){
        for(let i = 0; i<this.filesIdList.length;i++){
          fileIdsList.push(this.filesIdList[i]);
        }
      }
      if (fileIdsList.length > 0) {
        this.param.append("fileIds", fileIdsList)
      }
      if(this.$refs.upload.imgList.length>0){
        this.param.append("coverUrl", this.$refs.upload.imgList[0].response.data);
      }else{
        this.param.append("coverUrl", "");
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter(names => !res.has(names) && res.set(names, 1));
    },
    getDetailData() {
      getDetail(this.number).then(res => {
          this.form = res.data.data;
          this.getDeptName(this.form.createBy)
          this.form.selectDrop = this.belongData;
          this.publishStatus = res.data.data.isDraft;
          if (res.data.data.filesList) {
            this.libraryFileList = [];
            res.data.data.filesList.forEach(item => {
              const { fileName, ...rest } = item
              const newItem = { 'name': fileName, ...rest };
              this.libraryFileList.push(newItem)
            })
            let names = [];
            for (let i = 0; i < this.libraryFileList.length; i++) {
              names.push({ name: this.libraryFileList[i].name });
            }
            this.fileName = this.unique(names);
            this.filesIdLength = this.libraryFileList.length
          }
          if (res.data.data.filesTempList) {
            this.filesTempList = res.data.data.filesTempList;
            this.filesTempListLength = this.filesTempList.length
          }
          let data = {
            title: this.form.title,
            number: this.number
          };
          this.$emit("getTitle", data);
          this.articleId = res.data.data.id
          this.form.level = Number(res.data.data.level);
          this.articleStatus = res.data.data.policyStatus
          this.selectProList = res.data.data.prods;
          this.username = res.data.data.createUser
          if(res.data.data.applyStartTime){
            this.form.declarationTime = [res.data.data.applyStartTime,res.data.data.applyEndTime]
          }
          if(Number(res.data.data.level)){
            this.levelChange(this.form.level, true, res.data.data.areaNo)
          }
          if (res.data.data.policyClassVO) {
            this.form.putUnder = res.data.data.policyClassVO;
            this.$set(this.form.putUnder,"options",this.form.putUnder.optionsName);
            this.$set(this.form.putUnder, "id", this.form.putUnder.optionsId);
            this.$delete(this.form.putUnder, "optionsName");
            this.$delete(this.form.putUnder, "optionsId");
          }
           if (res.data.data.coverUrl) {
            this.$refs.upload.imgList = []
            this.$refs.upload.imgList.push({
              response:{
                data:res.data.data.coverUrl
              }
            })
          }
          this.editorContent = res.data.data.content;
          if (res.data.data.categories) {
            this.form.selectDrop.forEach((item, index) => {
              res.data.data.categories.forEach((val, index) => {
                if (val.multi == false &&item.categoryId == val.id) {
                  item.itemData = val.checkbox[0]==null?"":val.checkbox[0].optionId
                } else if (val.multi == true &&item.categoryId == val.id) {
                  item.itemData = []
                  if(val.checkbox[0]==null){
                    item.itemData = []
                  }else{
                    val.checkbox.forEach(it=>{
                      item.itemData.push(it.optionId)
                    })
                  }
                }
              });
            });
          }
          this.form = JSON.parse(JSON.stringify(this.form));
        }).catch(err => {
          console.log(err);
        });
    },
    getDeptName(id) {
      getEmpInfo(id).then(res => {
        if (res.data.code == 0) {
          this.deptInfo = res.data.data
        }
      })
    },
    delNotice() {
      this.$confirm(
        this.$t("alert.confirmDeleteArticle"),
        this.$t("message.warningTxt"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        }
      ).then(() => {
          deleteNotice(this.number).then(res => {
            this.$notify.success(this.$t("alert.sucessDelete"));
            clearDetail("/personal/myPublish")
            this.$router.push("/personal/myPublish");
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDropdown() {
      getDropPolicy(this.type).then(res => {
        this.belongData = res.data.data.factors;
      }).catch(err => {
        console.log(err);
      });
      getNewArea().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
          this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
          this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
          setTimeout(this.getDetailData(), 2000);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    handlerChange(e) {
      // alert(2)
    }
  },
  watch: {
    editorContent(val) {
      if (val != "") {
        this.contentNeed = false;
      }
    },
    form: {
      handler(newVal) {},
      deep: true,
      immediate: false
    }
  },
  mounted() {
    this.switch();
    if (this.type == 4) {
      this.title = this.$t("label.projectTitle");
      this.showStatus = this.$t("label.projectStatus");
    } else {
      this.title = this.$t("label.articleTitle");
      this.showStatus = this.$t("label.showStatus");
    }
    this.getDropdown();
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
  font-size: 16px;
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
.mr {
  margin-right: 8px;
}
.ml {
  margin-left: 8px;
}
.btn-contain{
  text-align: center;
  margin: 30px 0
}
</style>
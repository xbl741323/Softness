<template>
  <div class="policy_add">
    <div>
      <h3 v-if="type == 0">{{ $t("title.noticeCreated") }}</h3>
      <h3 v-if="type == 1">{{ $t("title.policyCreated") }}</h3>
      <h3 v-if="type == 2">{{ $t("title.troubleCreated") }}</h3>
      <h3 v-if="type == 4">{{ $t("title.projectCreated") }}</h3>
      <el-row>
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form" label-width="200px">
            <h3 class="form-title">{{ $t("title.basicParameter") }}</h3>
            <el-form-item :label="title" prop="title">
              <el-input v-if="type == 4" v-model.trim="form.title" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
              <el-input v-else v-model.trim="form.title" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.slogan')" prop="slogan" v-if="type == 4" >
              <el-input v-model.trim="form.slogan" :placeholder="$t('input.noMorethan30')" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.coverImg')" prop="productImgFile" v-if="type == 4">
              <span class="must"></span>
              <up-img :url="productImgFile" @change-license="uploadImg"></up-img>
            </el-form-item>
            <el-form-item :label="showStatus" prop="showStatus">
              <el-radio-group v-model="form.showStatus">
                <el-radio v-if="beFrom == 0 && type != 4" :label="0">{{
                  $t("status.toped")
                }}</el-radio>
                <el-radio :label="1">{{ $t("status.show") }}</el-radio>
                <el-radio :label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="type == 4" :label="$t('label.formSort')" prop="sort">
              <el-input v-model.trim="form.sort" maxlength="6" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
              <el-input v-model.trim="form.metaTitle" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
              <el-input v-model.trim="form.metaKeyword" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
              <el-input type="text" :autosize="{ minRows: 4, maxRows: 6 }" v-model.trim="form.metaDescription" onkeyup="this.value=this.value.replace(/[, ]/g,'')" 
              :placeholder="$t('input.noMorethan200')"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            
            <h3 class="form-title" style="margin-top: 50px">
              {{ $t("title.detailInfo") }}
            </h3>
            <el-form-item :label="$t('label.level')" prop="level">
              <el-select v-model="form.level" :placeholder="$t('input.choose')" @change="levelChange">
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('label.area')" prop="region">
              <el-cascader ref="cas" 
                @change="areaChange" 
                :options="areaOptions" 
                v-model="form.region" 
                :placeholder="casDisable==false?$t('input.choose'):'全国'" 
                :props="{ value: 'no', label: 'name'}" 
                :disabled="casDisable">
              </el-cascader>
            </el-form-item>
            <div v-for="(item, index) in form.belongData" :key="index">
              <el-form-item
                :label="item.categoryName + '：'"
                :prop="'belongData.' + index + '.itemData'"
                :rules="rules.selectDrop"
                v-if="item.must == 1"
              >
                <el-select
                  :placeholder="$t('input.choose')"
                  v-model="item.itemData"
                  value-key="id"
                  @change="selectData"
                  :multiple="item.choice == 1 ? true : false"
                >
                  <el-option
                    v-for="values in item.optionList"
                    :key="values.id"
                    :label="values.name"
                    :value="values.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else :label="item.categoryName + '：'">
                <el-select
                  :placeholder="$t('input.choose')"
                  v-model="item.itemData"
                  value-key="id"
                  @change="selectData"
                  :multiple="item.choice == 1 ? true : false"
                >
                  <el-option
                    v-for="values in item.optionList"
                    :key="values.id"
                    :label="values.name"
                    :value="values.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item :label="$t('label.detailContent')">
              <span class="must"></span>
              <tinymce-editor
                v-model="editorContent"
                @getEditorValue="getChildEditor"
                @limit = 'wordLimit'
                ref="editor"
              ></tinymce-editor>
              <!-- <div id="editorElem" ref="editor" style="text-align:left; margin-top: -22px"></div> -->
              <span class="content-warning" v-if="contentNeed">{{
                $t("input.detailContent")
              }}</span>
            </el-form-item>
            <div class="notice-file" style="margin-top: 30px">
              <!-- 添加附件 -->
              <el-form-item :label="$t('label.adjunct')" v-if="type != 4">
                <policy-file-upload  v-if="uploadDialog" :librarySelectList="libraryFileList" :uploadList="fileList"  @closeDialog='closeReplace'  @selectedList='selectedIdsList' @fileList="localtionFileList"></policy-file-upload>
                <el-button size="small" type="primary" @click="uploadDialog = true;" :disabled="filesIdLength + fileListLength>=10">{{ $t("button.addAdjunct")}}</el-button>
                <span class="limit-file" v-if="filesIdLength + fileListLength>=10">当前文章已有10个附件如需添加请先删除其他附件</span>
                <div v-for="item in libraryFileList" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFileId(item)">x</span>
                </div>
                <div v-for="item in fileList" :key="item.id">
                  <span>{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFile(item)">x</span>
                </div>
              </el-form-item>
              <!-- <div style="width: 50%">
                <el-form-item label="发布时间：">
                  <el-date-picker
                    class="time-picker"
                    style="width: 100%"
                    v-model="form.createTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
              </div> -->
            </div>
          </el-form>
        </el-card>
      </el-row>
      <div style="text-align: center; margin: 30px 0">
        <el-button type="success" v-if="type != 4" @click="publishNotice('form')" v-preventReClick>{{ $t("button.publish") }}</el-button>
        <el-button @click="publishNotice('form')" v-if="type == 4" type="primary" v-preventReClick>{{ $t("button.submit") }}</el-button>
        <el-button type="warning" @click="previewNotice">{{$t("button.preview")}}</el-button>
        <el-button @click="draft('form')" v-if="type != 4" type="primary" v-preventReClick>{{$t("button.saveDraft")}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveDraft, addNotice, rechecking } from "@/api/personal/policy";
import { checkFileName } from "@/api/policy/detail"
import upImg from "@/components/policy/upImg";
import tinymceEditor from "@/views/policySquare/tinymceEditor";
import preventReClick from "@/util/preventReClick";
import detailHead from "@/page/index/top/index";
import { getDropPolicy , getNewArea} from "@/api/policy/list";
import * as CodeMsg from "@/api/common/CodeChange";
import PolicyFileUpload from '@/components/file/policyFileUpload';
import { clearDetail } from "@/util/clearDetail"
export default {
  components: {
    upImg,
    tinymceEditor,
    PolicyFileUpload,
    detailHead
  },
  data() {
    var recheck = (rule, value, callback) => {
      rechecking({ title: value })
        .then((res) => {
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
      if (this.type == 4) {
        if (value.length > 30) {
          return callback(new Error(this.$t("input.txtLong30")));
        } else {
          callback();
        }
      } else {
        if (value.length > 70) {
          return callback(new Error(this.$t("input.txtLong70")));
        } else {
          callback();
        }
      }
    };
    return {
      filesIdLength: 0,
      fileListLength: 0,
      libraryFileList:[],//接收文件库选择的文件列表
      filesIdList:[],
      uploadDialog: false,//添加附件
      ItIndex: -1,
      editor: "",
      title: "",
      showStatus: "",
      productImgFile: null,
      editorContent: "",
      fileList: [],
      belongData: [],
      param: new FormData(),
      files: [],
      checkFlieRepet: false,
      repeatName: "",
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
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
        title: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur", },
          { validator: txtLength, trigger: "blur" },
          { validator: recheck, trigger: "blur" },
        ],
        sort:[
          { required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", },
          { min: 1, max: 6, message: '请输入正整数', pattern: /^[+]{0,1}(\d+)$/, trigger: "blur"},
        ],
        slogan: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur"},
          { min: 1, max: 30, message: this.$t("input.txtLong30"), trigger: "blur"},
        ],
        showStatus: [
          {
            required: true,
            message: this.$t("input.pleaseChooseShowStatus"),
            trigger: "change",
          },
        ],
        metaTitle: [
          {
            required: true,
            message: this.$t("input.pleaseInputWebTitle"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 70,
            message: this.$t("input.txtLong70"),
            trigger: "blur",
          },
        ],
        region: [
          { required: true, message: this.$t("input.pleaseChooseArea"), trigger: "change", },
        ],
        level: [
          { required: true, message: this.$t("input.pleaseChooseLevel"), trigger: "change" },
        ],
        metaKeyword: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 100, message: this.$t("input.txtLong100"), trigger: "blur", },
        ],
        metaDescription: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 200, message: this.$t("input.txtLong200"), trigger: "blur", },
        ],
        selectDrop: [
          {
            required: true,
            message: this.$t("input.choose"),
            trigger: "change",
          },
        ],
      },
      labelPosition: "right",
      form: {
        title: "",
        showStatus: 1,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        region: null,
        content: "",
        selectDrop: [],
        createTime: "",
        belongData: [],
        sort:'1'
      },
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
      areaOptionId:"",
      optionList: [],
      productImg: null,
      transferData: {},
      fileName: [],
      contentNeed: false,
      edited: false,
      beFrom: null,
      limit: true,//默认编辑框字数合理 接收子组件传参
      casDisable: false,
      username: ''
    };
  },
  methods: {
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
    localtionFileList(val){
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
      this.fileListLength = val.length;
      this.uploadDialog = false;
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
    selectedIdsList(val){//选中的文件id
      for(let i= 0; i<val.length; i++){
        this.libraryFileList.push(val[i]);
      }
      for(let i = 0;i <this.libraryFileList.length; i++){
        if(this.filesIdList.indexOf(this.libraryFileList[i].id) === -1){
          this.filesIdList.push(this.libraryFileList[i].id);
        }
      }
      this.filesIdLength = this.filesIdList.length;
      this.uploadDialog = false;
    },
    areaChange() {
      this.areaOptionId = ''
    },
    draft(formName) {
      if(Number(this.form.level) == 1){
        this.form.region = ['000000']
      }
      if (this.checkFlieRepet) {
        this.$message({
          type: "warning",
          message: this.repeatName + this.$t("alert.fileNameRepeat"),
          offset: 300,
        });
      } else {
        this.editForm();
        if (this.edited) {
          this.saveParam();
          this.$refs[formName].validate(valid=>{
            if(valid && this.editorContent.trim() != ""){
              let config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          saveDraft(this.param, config)
            .then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                 this.$notify.success(this.$t("alert.sucessSave"));
                clearDetail("/personal/myPublish")
                this.$router.push("/personal/myPublish");
              } else {
                this.$notify.warning(this.$t("alert.ContactStaffHandleFail"));
              }
            })
            .catch((err) => {
              console.log(err);
            });
            }else {
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
              duration: 2000,
            });
          }
          })
        } else {
          this.$message({
            type: "warning",
            message: this.$t("alert.inputArticleTitle"),
            offset: 300,
          });
        }
      }
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    wordLimit(val){
      this.limit = val;
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
        type: mime,
      });
    },
    selectData(val) {
      this.optionList = [];
      for (let i = 0; i < this.form.belongData.length; i++) {
        if (Array.isArray(this.form.belongData[i].itemData) == true) {
          this.form.belongData[i].itemData.forEach(it=>{
            this.optionList.push(it);
          })
        } else if(this.form.belongData[i].itemData) {
          this.optionList.push(this.form.belongData[i].itemData);
        }
      }
    },
    editForm() {
      if (this.form.title != "") {
        this.edited = true;
      }
    },
    publishNotice(formName) {
      if (this.checkFlieRepet) {
        this.$message({
          type: "warning",
          message: this.repeatName + this.$t("alert.fileNameRepeat"),
          offset: 300,
        });
      } else if(this.limit) {
        if(this.form.level == 1){
          this.form.region = ['000000']
        }
        this.saveParam();
        this.$refs[formName].validate((valid) => {
          if ( valid && this.editorContent.trim() != "") {
            if (this.productImg != null || this.type != 4) {
              let config = {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              };
              addNotice(this.param, config).then((res) => {
                  if (res.data.code == CodeMsg.CODE_1000) {
                    this.$notify.success(this.$t("alert.sucessPublish"));
                    clearDetail("/personal/myPublish")
                    this.$router.push("/personal/myPublish");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$message({
                type: "warning",
                message: this.$t("alert.lackofcoverImg"),
                offset: 300,
                duration: 2000,
              });
            }
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
              duration: 2000,
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
    // 保存表单数据
    saveParam() {
      this.param = new FormData();
      this.param.append("type", this.type);
      if (this.form.title != "") {
        this.param.append("title", this.form.title);
      }
      if (this.form.slogan != undefined) {
        this.param.append("slogan", this.form.slogan);
      }
      if (this.form.showStatus != null) {
        this.param.append("showStatus", this.form.showStatus);
      }
      if (this.form.sort != ""&&this.type == 4) {
        this.param.append("sort", this.form.sort);
      }
      if (this.form.metaTitle != "") {
        this.param.append("metaTitle", this.form.metaTitle);
      }
      if (this.form.metaKeyword != "") {
        this.param.append("metaKeyword", this.form.metaKeyword);
      }
      if(this.filesIdList.length>0){//文件库选择附件
        this.param.append('baseFileIds',this.filesIdList);
      }
      if (this.form.metaDescription != "") {
        this.param.append(
          "metaDescription",
          this.form.metaDescription
        );
      }
      if (this.form.createTime != "") {
        this.param.append(
          "createTime",
          this.$moment(this.form.createTime).format("YYYY-MM-DD HH:mm")
        );
      }
      //地区
      if (this.form.region != null) {
        this.param.append("areaOptionId", 2);
        this.param.append("areaNo", this.form.level == 1 ? '000000': this.form.region.toString());
      }
      if(this.form.level){
        this.param.append("level", this.form.level);
      }
      if (this.editorContent != "") {
        this.param.append("content", this.editorContent);
      }
      if (this.fileList.length > 0) {
        this.fileList.forEach((file) => {
          this.param.append("files", file.raw, file.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上
        });
      }
      //动态的
      this.param.append("optionIds", this.optionList);
      if (this.productImg) {
        this.param.append("projectCover", this.productImg);
      }
      if(this.username){
        this.param.append("createUser", this.username);
      }
    },
    previewNotice() {
      this.transferData = {
        title: this.form.title,
        slogan: this.form.slogan,
        content: this.editorContent,
      };
      if (this.type == 4) {
        let routeData = this.$router.resolve({
          path: "/project-preview",
          query: {
            form: JSON.stringify(this.transferData),
            url: this.productImgFile,
          },
        });
        window.open(routeData.href);
      } else {
        let routeData = this.$router.resolve({
          path: "/policy-preview",
          query: {
            form: JSON.stringify(this.transferData),
            files: JSON.stringify(this.fileName),
          },
        });
        window.open(routeData.href);
      }
    },
    handlePreview(file) {
    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
      this.fileList = fileList;
      if (this.fileList.length > 0) {
        let para = new FormData();
        this.fileList.forEach((file) => {
          para.append("files", file.raw, file.raw.name);
        });
        checkFileName(para).then((res) => {
          if (res.data.data.length > 0) {
            this.repeatName = "";
            for (let i = 0; i < res.data.data.length; i++) {
              this.repeatName += res.data.data[i].name + ",";
            }
            this.$message({
              type: "error",
              message: this.repeatName + this.$t("alert.fileNameRepeat"),
              offset: 300,
            });
            this.checkFlieRepet = true;
          } else {
            this.checkFlieRepet = false;
          }
        });
      } else {
        this.checkFlieRepet = false;
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: this.$t("alert.upFileLessThan20"),
          type: "warning",
          offset: 300,
        });
      }
      return isLt2M;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel",
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 文件改变时触发的方法
    OnChange(file, fileList) {
      let existFile = fileList.slice(0, fileList.length - 1).find((f) => f.name === file.name);
      if (existFile) {
        // 　　　　this.$message.error(this.$t('alert.fileExisted'));
        fileList.pop();
      }
      this.fileList = fileList;
      if (this.fileList.length > 0) {
        let para = new FormData();
        this.fileList.forEach((file) => {
          para.append("files", file.raw, file.raw.name);
        });
        checkFileName(para).then((res) => {
            if (res.data.data.length > 0) {
              this.repeatName = "";
              for (let i = 0; i < res.data.data.length; i++) {
                this.repeatName += res.data.data[i].name + ",";
              }
              this.$message({
                type: "error",
                message: this.repeatName + this.$t("alert.fileNameRepeat"),
                offset: 300,
              });
              this.checkFlieRepet = true;
            } else {
              this.checkFlieRepet = false;
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter((names) => !res.has(names) && res.set(names, 1));
    },

    getDropdown() {
      getDropPolicy(this.type).then((res) => {
        this.form.belongData = res.data.data.factors;
        // this.$nextTick(() => {
        //   this.$refs["form"].clearValidate();
        // });
      }).catch((err) => {
        console.log(err);
      });
      getNewArea().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
          this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
          this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
        }
      }).catch((err) => {
        console.log(err);
      });
    },
  },
  watch: {
    editorContent(val) {
      if (val != "") {
        this.contentNeed = false;
      }
    },
  },
  created() {
    this.type = this.$route.query.type;
    this.beFrom = this.$route.query.beFrom;
    if(sessionStorage.getItem('pigx-userInfo')){
      let data = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content
      this.username = data.username
    }
  },
  mounted() {
    this.getDropdown();
    if (this.type == 4) {
      this.title = this.$t("label.projectTitle");
      this.showStatus = this.$t("label.projectStatus");
    } else {
      this.title = this.$t("label.articleTitle");
      this.showStatus = this.$t("label.showStatus");
    }
  },
};
</script>
<style scoped>
.policy_add{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
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
</style>




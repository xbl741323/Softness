<template>
  <div class="app-container calendar-list-container">
      <h3 class="title-sty">行业资讯详情</h3>
      <basic-container>
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form" label-width="200px">
            <h3 class="form-title">{{$t('title.basicParameter')}}</h3>
            <el-form-item label="文章标题：" prop="title">
              <el-input v-model="form.title" :placeholder="$t('input.noMorethan70')" @input="handleChange" maxlength="70" show-word-limit/>
            </el-form-item>
            <el-form-item :label="$t('label.showStatus')" prop="showStatus">
              <el-radio-group v-model="form.showStatus" @change="handleChange">
                <el-radio :disabled="$route.query.source=='person'?true:false" :label="0">{{$t('status.toped')}}</el-radio>
                <el-radio :label="1">{{$t('status.show')}}</el-radio>
                <el-radio :label="2">{{$t('status.noShow')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
              <el-input v-model="form.metaTitle" @input="handleChange" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
              <el-input v-model="form.metaKeyword" @input="handleChange" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
              <el-input type="text" @input="handleChange" :autosize="{ minRows: 4, maxRows: 6 }" v-model.trim="form.metaDescription" onkeyup="this.value=this.value.replace(/[, ]/g,'')" :placeholder="$t('input.noMorethan200')" maxlength="200" show-word-limit />
            </el-form-item>
            <h3 class="form-title" style="margin-top: 50px">{{$t('title.detailInfo')}}</h3>
            <el-form-item :label="$t('label.cate')" prop="cate">
              <el-select v-model="form.cate" :placeholder="$t('input.choose')">
                <el-option
                  v-for="item in cateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('label.detailContent')" prop="content">
              <span class="must"></span>
              <tinymce-editor @onClick="hideSelect" v-model="editorContent" :value="editorContent" @getEditorValue="getChildEditor" @limit='limitNum' ref="editor"></tinymce-editor>
              <span class="content-warning" v-if="contentNeed">{{$t('input.detailContent')}}</span>
            </el-form-item>
            <div class="notice-file" style="margin-top: 30px">
               <!-- 添加附件 -->
              <!-- <el-form-item :label="$t('label.adjunct')">
                <policy-file-upload  v-if="uploadDialog" :librarySelectList="libraryFileList" :uploadList="fileList" :listLength='fileListLength' @closeDialog='closeReplace' @selectedList='selectedIdsList' @fileList="localtionFileList"></policy-file-upload>
                <el-button size="small" type="primary" @click="uploadDialog = true" :disabled="fileListLength + filesIdLength >= 10">{{ $t("button.addAdjunct")}}</el-button>
                <div v-for="item in libraryFileList" :key="item.id">
                  <span class="dow-load" @click="downloadFile">{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFileId(item)">x</span>
                </div>
                <div v-for="item in fileList" :key="item.id">
                  <span class="dow-load" @click="downloadFile">{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFile(item)">x</span>
                </div>
              </el-form-item> -->
            </div>
            <el-form-item :label="$t('label.publishMan')">
              <p style="margin:0">
              <!-- <el-tooltip effect="dark" :content="'工号：'+form.createByNo" placement="right"> -->
                 <span>{{form.createByName}}</span>
            <!-- </el-tooltip> -->
              </p>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ form.createTime }}</span>
             </el-form-item>
            <el-form-item :label="$t('label.publishTime')" v-if="form.publishTime">
              <span>{{ form.publishTime }}</span>
            </el-form-item>
            <el-form-item :label="$t('label.viewNumber')" v-if="form.pageViews">
              <p style="margin:0">
                <span>{{$t('message.viewNumber')}} {{form.pageViews}}</span>
                <span style="margin-left: 16px" v-if="form.collects">{{$t('message.collectNumber')}} {{form.collects}}</span>
              </p>
            </el-form-item>
            <el-form-item label="审核状态：">
              <span>{{ form.auditState|industryFilter }}</span>
             </el-form-item>
          </el-form>
      <div style="text-align: center; margin: 30px 0">
      <el-button type="primary" :disabled="operatePower" @click="publishNotice('form',0)">提交审核</el-button>
      <!-- <el-button type="success"  @click="publishNotice('form',1)">保存</el-button> -->
      <el-button type="warning" @click="previewNotice()">{{$t('button.preview')}}</el-button>
      <el-button @click="goback()">{{$t('button.cancel')}}</el-button>
      <el-button type="danger" @click="delNotice" icon="el-icon-delete">删除文章</el-button>
      </div>
      <!-- 添加编辑操作 -->
    <el-dialog
      :visible.sync="auditDialog"
      :close-on-click-modal="false"
      title="提交审核"
      width="38%">
      <el-form class="form-sty" ref="auditForm" :model="auditForm" label-width="90px" :rules="auditRules">
         <el-form-item label="审核人：" prop="auditMan">
          <el-cascader filterable ref="audit" :show-all-levels='false' @change="changeAudit()" :options="empList" v-model="auditForm.auditMan" :props="{value: 'customerNo',label: 'label'}" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" show-word-limit maxlength="100" :autosize="{ minRows: 4, maxRows: 6 }" v-model="auditForm.remarks"></el-input>
        </el-form-item>
        <div class="btn-industry">
          <el-button
            class="indus-left-sty"
            type="primary"
            size="medium"
            :disabled="auditForm.auditMan == '' ? true : false" @click="throttle()">{{ $t("button.confirm") }}</el-button>
          <el-button type="primary" size="medium" @click="auditDialog = false">{{
            $t("button.cancel")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { saveDraft } from "@/api/personal/information";
import { addIndustry,recheckIndustryTitle,getIndustryDetail,editIndustry,deleteIndustry,editPolicyIndustry } from "@/api/policy/industry";
import tinymceEditor from "@/views/policySquare/tinymceEditor";
import { fileDownload } from "@/api/policy/list";
import * as CodeMsg from "@/api/common/CodeChange";
import PolicyFileUpload from '@/components/file/policyFileUpload';
import { clearDetail } from "@/util/clearDetail"
import orderData from '@/components/member/order-data'
export default {
  components: {
    tinymceEditor,
    PolicyFileUpload,
  },
  data() {
    var recheck = (rule, value, callback) => {
      recheckIndustryTitle({ title: value, industryNo: this.number })
        .then((res) => {
          if (res.data.code != CodeMsg.CODE_1000) {
            return callback(new Error(this.$t("input.titleExisted")));
          } else {
            callback();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return {
      foxNum:0,
      operatePower:true,
      industryNameList:[],
      auditForm:{
        auditMan:"",
        remarks:""
      },
      empList:[],
      policyStatus:"",
      auditDialog:false,
      filesIdLength: 0,
      fileListLength: 0,
      editFilesLength:0,
      libraryFileList:[],//接收文件库选择的文件列表
      filesIdList:[],
      uploadDialog: false,//添加附件
      areaOptionId:"",
      optionList:[],
      imgBaseUrl: "",
      fileList: [],
      belongData: [],
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      publishStatus: "",
      deleteStatus: "",
      files: [],
      title: "",
      lastTime:0,
      productImgFile: null,
      checkFlieRepet: false,
      editor: "",
      auditManId:"",
      editorContent: "",
      cateList: orderData.orderTypeNewData,
      auditRules:{
        auditMan:[
          {
            required: true,
            message: "请选择审核人",
            trigger: "change",
          },
          ]
      },
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
        cate: [
          {
            required: true,
            message: this.$t("input.pleaseChooseCate"),
            trigger: "change"
          }
        ],
      },
      labelPosition: "right",
      form: {
        cate: null
      },
      number: "",
      type: "",
      fileName: [],
      urls: [],
      contentNeed: false,
      beFrom: null,
      productImg: "",
      ItIndex: -1,
      limit :true, //编辑框字数是否超出 接收子组件传参
      casDisable: false,
      prompt: '请选择选项',
      articleId: null,
    };
  },
  created() {
    this.number = this.$route.query.number;
    this.beFrom = this.$route.query.beFrom;
    this.type = this.$route.query.type;
  },
  filters:{
     industryFilter(val){
      switch(val){
        case "0":
        return "待审核" ;
        case "1":
        return "草稿" ;
        case "2":
        return "已通过" ;
        case "3":
        return "未通过" ;;
      }
    }
  },
  methods: {
    //下载文件
    downloadFile(row) {
      this.loadstatus = undefined;
      this.promtMessage = "准备下载中...";
      fileDownload(row.id).then(res => {
          this.loadstatus = res;
          let blob = new Blob([res.data]);
          let objectUrl = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = objectUrl;
          a.download = row.name;
          a.click();
        }).catch(err => {
          this.$message({
            type: warning,
            message: err
          });
        });
    },
    closeReplace(val){
      this.uploadDialog = val;
    },
    deleteFile(row){
      this.operatePower = false
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
      this.operatePower = false
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
      this.fileListLength = this.fileList.length;
      this.replaceDialog = false;
    },
    deleteFileId(row){
      this.operatePower = false
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
      this.operatePower = false
      for(let i = 0;i< val.length;i++){
        this.libraryFileList.push(val[i])
      }
      for(let i = 0;i <this.libraryFileList.length; i++){
        if(this.filesIdList.indexOf(this.libraryFileList[i].id) === -1){
          this.filesIdList.push(this.libraryFileList[i].id);
        }
      }
      this.filesIdLength = this.filesIdList.length;
    },
    selectData(val) {
      this.operatePower = false
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
       this.form.selectDrop.forEach(item=>{
        if(item.categoryId == 5){
          if(val.length==0){
            item.optionList.forEach(it=>{
            it.disabled = false
          })
          }else{
            if(val[0] == 201){
            item.optionList.forEach(it=>{
            it.disabled = true
            if(it.id == 201){
              it.disabled = false
            }
          })
           }else{
            item.optionList.forEach(it=>{
            it.disabled = false
            if(it.id == 201){
              it.disabled = true
            }
          })
           }
          }
        }
      })
      this.filterName(val)
    },
     filterName(val){
      this.industryNameList=[]
      this.form.selectDrop.forEach(item=>{
          item.optionList.forEach(it=>{
            val.forEach(ve=>{
              if(ve == it.id){
               this.industryNameList.push(it.name)
              }
            })
            
          })
      })
    },
    handleChange(val){
      console.log(val)
      this.operatePower = false
    },
    getChildEditor(data) {
      this.editorContent = data;
      // this.operatePower = false
    },
    hideSelect(){
      this.$refs.select.forEach(item=>{
         item.blur()
      })
    },
    limitNum(val){
      this.foxNum++
      if(this.foxNum>1){
        this.operatePower = false
      }
      this.limit = val;
    },
    finalAdd(){
        this.param.isDraft = 0
        this.param.deleted = 0
        editIndustry(this.param,this.$route.query.source).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            if(this.$route.query.source=='list'){
              this.$notify.success("提交审核成功！");
              clearDetail("/policySquare/industry/index")
              this.$router.push("/policySquare/industry/index");
            }else{
              this.$notify.success("提交审核成功！");
              clearDetail("/personal/myPublish")
              this.$router.push("/personal/myPublish");
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning',
              offset: 300,
              duration: 1500
            });
          }
        })
    },
    newAdd(){
      if(this.$route.query.source== 1){
          editPolicyIndustry(this.param).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.$notify.success("保存成功！");
            clearDetail("/policySquare/industry/index")
            this.$router.push("/policySquare/industry/index");
          }
        })
        }else if(this.$route.query.type == 0){
          if(this.form.auditState == 3 ){
            saveDraft(this.param).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.$notify.success("保存成功！");
            clearDetail("/personal/myPublish")
            this.$router.push("/personal/myPublish");
          }
        })
          }else{
            editPolicyIndustry(this.param).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.$notify.success("保存成功！");
            clearDetail("/personal/myPublish")
            this.$router.push("/personal/myPublish");
          }
        })
          } 
        }
    },
    auditSubmit(){
      this.$refs['auditForm'].validate(valid=>{
        if(valid){
        this.policyStatus = 0
        this.saveParam()
        this.finalAdd()
        }
      })
    },
    throttle(){
            let now= new Date().valueOf();
            if(this.lastTime==0){
                this.auditSubmit()
                this.lastTime = now;
            }else{
                if((now-this.lastTime)>2000){
                    this.lastTime = now;
                    console.log('间隔大于2秒，触发事件');
                     
                }else{
                    console.log('不触发');
                }
            }
        },
    publishNotice(formName,num) {
     this.$refs[formName].validate((valid)=>{
        if(valid && this.editorContent.trim() != ""){
           if(this.editorContent.includes("<img")){
             this.$message({
                type:"warning",
                message:"图片不支持发布！请删除图片！"
              })
           }else{
             if(this.limit){
             this.policyStatus = this.form.auditState
             this.saveParam()
             if(num == 0){
                // this.auditDialog = true 
                this.policyStatus = 0
                this.saveParam()
                this.finalAdd()
              }else{
                this.newAdd()
              }
             }else{
               this.$message({
                 type:"warning",
                 message:"详细内容字数限制最多30000字！"
               })
             }
             
           }
        }else{
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
    },
    previewNotice() {
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.fixName()
          this.transferData = {
            title: this.form.title,
            content: this.editorContent,
            publishMan: this.form.createUserName,
            industryList:this.industryNameList
          };
          let routeData = this.$router.resolve({
            path: "/preview-industry",
            query: {
              form: JSON.stringify(this.transferData),
              files: JSON.stringify(this.fileName.concat(this.libraryFileList)),
            },
          });
          window.open(routeData.href);
        }
      })
    },
     fixName(){
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: this.fileList[i].name });
            }
      this.fileName = this.unique(names);
    },
    changeAudit(){
      this.operatePower = false
      this.$nextTick(()=>{
       this.auditManId = this.$refs['audit'].getCheckedNodes()[0].data.customerId;
      })
    },
    goback() {
        if (this.type == 0) {
          clearDetail("/personal/myPublish")
          this.$router.push("/personal/myPublish");
        } else {
          clearDetail("/policySquare/industry/index")
          this.$router.push("/policySquare/industry/index");
        } 
    },
    saveParam() {
      this.param = {
        createBy: this.userId,
        title: this.form.title,
        state: this.form.showStatus,
        metaTitle: this.form.metaTitle,
        metaKeyword: this.form.metaKeyword,
        metaDescription: this.form.metaDescription,
        categoryId: this.form.cate,
        createByName: this.username,
        content: this.editorContent,
        industryNo: this.$route.query.number
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter(names => !res.has(names) && res.set(names, 1));
    },
    translate(){
      this.form.selectDrop.forEach(item=>{
        if(item.categoryId == 5){
          if(item.itemData.length==0||item.itemData==null){
            item.optionList.forEach(it=>{
            it.disabled = false
          })
          }else{
            if(item.itemData[0] == 201){
            item.optionList.forEach(it=>{
            it.disabled = true
            if(it.id == 201){
              it.disabled = false
            }
          })
           }else{
            item.optionList.forEach(it=>{
            it.disabled = false
            if(it.id == 201){
              it.disabled = true
            }
          })
           }
          }
        }
      })
    },
    getDetailData() {
        getIndustryDetail(this.number,this.$route.query.source).then(res => {
          if(res.data.code == CodeMsg.CODE_1000) {
            this.form = res.data.data;
            this.publishStatus = res.data.data.isDraft;
            this.deleteStatus = res.data.data.deleted;
            this.form.showStatus = res.data.data.state;
            this.form.cate = res.data.data.categoryId;
            let data = {
              title: this.form.title,
              number: this.number
            };
            this.$emit("getTitle", data);
            this.articleId = res.data.data.id
            this.editorContent = res.data.data.content;
            this.form = JSON.parse(JSON.stringify(this.form));
            if (res.data.data.filesList) {
              this.fileList = res.data.data.filesList;
              this.fileListLength = this.fileList.length;
              let names = [];
              for (let i = 0; i < this.fileList.length; i++) {
                names.push({ name: this.fileList[i].name });
              }
              this.fileName = this.unique(names);
            }
          }
        })
    },
    delNotice() {
      this.$confirm(
        "确定删除改文章？",
        this.$t("message.warningTxt"),
        {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        }
      ).then(() => {
        deleteIndustry(this.number,this.$route.query.source).then(res => {
            if(this.$route.query.source == 'list'){
              this.$notify.success(this.$t("alert.sucessDelete"));
            clearDetail("/policySquare/industry/index")
            this.$router.push("/policySquare/industry/index");
            }else{
               this.$notify.success(this.$t("alert.sucessDelete"));
              clearDetail("/personal/myPublish")
              this.$router.push("/personal/myPublish");
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
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
    this.getDetailData()
  }
};
</script>
<style>
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
.btn-industry{
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.indus-left-sty{
  margin-right: 40px;
}
.title-sty{
  margin-left: 30px;
}
.dow-load{
  color: #125BBE;
  cursor: pointer;
}
.industy-select-sty{
  width:250px;
}
</style>




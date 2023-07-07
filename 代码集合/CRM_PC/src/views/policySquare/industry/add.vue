<template>
  <div class="add_industry">
    <div class="add_industry_contain">
      <h3>新建行业资讯</h3>
      <el-row>
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :rules="formrules" :model="form" label-width="200px">
            <h3 class="form-title">{{ $t("title.basicParameter") }}</h3>
            <el-form-item label="文章标题" prop="title">
              <el-input v-model.trim="form.title" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item label="显示状态" prop="showStatus">
              <el-radio-group v-model="form.showStatus">
                <el-radio :disabled="$route.query.source == 0?true:false" :label="0" v-if="$route.query.source=='list'">{{ $t("status.toped")}}</el-radio>
                <el-radio :disabled="$route.query.type == 0?true:false" :label="1">{{ $t("status.show") }}</el-radio>
                <el-radio :disabled="$route.query.type == 0?true:false" :label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
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
                show-word-limit
                maxlength="200"/>
            </el-form-item>
            <h3 class="form-title" style="margin-top: 50px">
              {{ $t("title.detailInfo") }}
            </h3>
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
            <el-form-item :label="$t('label.detailContent')">
              <span class="must"></span>
              <tinymce-editor
                v-model="editorContent"
                @getEditorValue="getChildEditor"
                @limit = 'wordLimit'
                ref="editor"
              ></tinymce-editor>
              <span class="content-warning" v-if="contentNeed">{{
                $t("input.detailContent")
              }}</span>
            </el-form-item>
            <div class="notice-file" style="margin-top: 30px">
              <!-- 添加附件 -->
              <!-- <el-form-item :label="$t('label.adjunct')">
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
              </el-form-item> -->
            </div>
          </el-form>
        </el-card>
      </el-row>
      <div style="text-align: center; margin: 30px 0">
        <el-button type="primary" @click="publishNotice('form',0)" v-preventReClick>提交审核</el-button>
        <el-button type="warning" @click="previewNotice">{{$t("button.preview")}}</el-button>
        <el-button @click="draft('form')" type="warning" v-preventReClick>{{$t("button.saveDraft")}}</el-button>
      </div>
      <!-- 添加操作 -->
    <el-dialog
      :visible.sync="auditDialog"
      :close-on-click-modal="false"
      title="提交审核"
      width="38%">
      <el-form class="form-sty" ref="auditForm" :model="auditForm" label-width="90px">
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
    </div>
  </div>
</template>

<script>
import { saveIndustryDraft, addIndustry, recheckIndustryTitle } from "@/api/policy/industry";
import tinymceEditor from "../tinymceEditor";
import { getEmpList } from '@/api/clue/clue';
import detailHead from "@/page/index/top/index";
import * as CodeMsg from "@/api/common/CodeChange";
import PolicyFileUpload from '@/components/file/policyFileUpload';
import { mapState } from "vuex";
import { clearDetail } from "@/util/clearDetail"
import orderData from '@/components/member/order-data'
export default {
  components: {
    tinymceEditor,
    PolicyFileUpload,
    detailHead
  },
  data() {
    var recheck = (rule, value, callback) => {
        recheckIndustryTitle({ title: value })
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
      industryNameList:[],
      policyStatus:"",
      auditForm:{
        auditMan:"",
        remarks:""
      },
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      cateList: orderData.orderTypeNewData,
      kuFileList:[],
      empList:[],
      optionList: [],
      auditDialog:false,
      filesIdLength: 0,
      fileListLength: 0,
      libraryFileList:[],//接收文件库选择的文件列表
      filesIdList:[],
      uploadDialog: false,//添加附件
      ItIndex: -1,
      editor: "",
      title: "",
      showStatus: "",
      editorContent: "",
      fileList: [],
      belongData: [],
      param: new FormData(),
      files: [],
      checkFlieRepet: false,
      repeatName: "",
      lastTime:0,
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
      auditRules:{
        auditMan:[
          {
            required: true,
            message: "请选择审核人",
            trigger: "change",
          },
          ]
      },
      formrules: {
        title: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur", },
          { validator: txtLength, trigger: "blur" },
          { validator: recheck, trigger: "blur" },
        ],
        // sort:[
        //   { required: true, message: this.$t("input.pleaseInputSort"), trigger: "blur", },
        //   { min: 1, max: 6, message: '请输入正整数', pattern: /^[+]{0,1}(\d+)$/, trigger: "blur"},
        // ],
        // slogan: [
        //   { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur"},
        //   { min: 1, max: 30, message: this.$t("input.txtLong30"), trigger: "blur"},
        // ],
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
        cate: [
          { required: true, message: this.$t("input.pleaseChooseCate"), trigger: "change" },
        ],
        metaKeyword: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 100, message: this.$t("input.txtLong100"), trigger: "blur", },
        ],
        metaDescription: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 200, message: this.$t("input.txtLong200"), trigger: "blur", },
        ],
      },
      labelPosition: "right",
      auditManId:"",
      form: {
        title: "",
        showStatus: 1,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        content: "",
        cate: null,
        sort:'1'
      },
      areaOptionId:"",
      transferData: {},
      fileName: [],
      contentNeed: false,
      edited: false,
      beFrom: null,
      limit: true,//默认编辑框字数合理 接收子组件传参
      casDisable: false,
      username:'',
      userId:''
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    changeAudit(){
      this.$nextTick(()=>{
       this.auditManId = this.$refs['audit'].getCheckedNodes()[0].data.customerId;
      })
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
    this.kuFileList = []
      for(let i= 0; i<val.length; i++){
        this.libraryFileList.push(val[i]);
        this.kuFileList.push({name:val[i].name})
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
      console.log(this.form.region, "输出选择的地区");
    },
    draft(formName) {
      this.$refs[formName].validateField("title",valid=>{
        if(!valid){
          this.policyStatus = 3
          this.saveParam()
          this.param.deleted = 0
          this.param.isDraft = 1
          saveIndustryDraft(this.param, this.$route.query.source).then(res=>{
             if(res.data.code == CodeMsg.CODE_1000){
                if(this.$route.query.source=='list'){
                  this.$notify.success("保存草稿成功!");
                  clearDetail("/policySquare/industry/index")
                  this.$router.push("/policySquare/industry/index");
                }else{
                   this.$notify.success("保存草稿成功!");
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
        }else{
          this.$message({
            type:"warning",
            message:"您尚未填写文章标题！"
          })
        }
      })
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
    hideSelect(){
      this.$refs.select.forEach(item=>{
         item.blur()
      })
    },
    wordLimit(val){
      this.limit = val;
    },
    finalAdd(){
      this.param.deleted = 0
      this.param.isDraft = 0
      addIndustry(this.param, this.$route.query.source).then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          this.$notify.success(this.$t("提交审核成功！"));
          if(this.$route.query.source == 'list'){
            clearDetail("/policySquare/industry/index")
            this.$router.push("/policySquare/industry/index");
          }else{
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
    publishNotice(formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid && this.editorContent.trim() != ""){
          console.log(12121)
           if(this.editorContent.includes("<img")){
              this.$message({
                type:"warning",
                message:"图片不支持发布！请删除图片！"
              })
           }else{
             if(this.limit){
                // this.auditDialog = true 
                this.policyStatus = 0
                this.saveParam()
                this.finalAdd()        
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
        auditState: 0
      }
    },
    previewNotice() {
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.fixName()
          this.transferData = {
            title: this.form.title,
            slogan: this.form.slogan,
            content: this.editorContent,
            publishMan: this.userInfo.name,
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
    handlePreview(file) {
      console.log(file);
    },
    fixName(){
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: this.fileList[i].name });
            }
      this.fileName = this.unique(names);
    },
    unique(names) {
      const res = new Map();
      return names.filter(names => !res.has(names) && res.set(names, 1));
    },
    getDropdown() {
      getEmpList(false).then(res=>{//员工
          this.empList = res.data.data;
      })
    },
  },
  watch: {
    editorContent(val) {
      if (val != "") {
        this.contentNeed = false;
      }
    },
  },
  created(){
     if(sessionStorage.getItem('pigx-userInfo')){
      let data = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content
      this.username = data.username
      this.userId = data.userId
    }
  },
  mounted() {
    this.getDropdown();
  },
};
</script>
<style scoped>
.add_industry{
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
.deleteBt  {
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
.industy-select-sty{
  width: 250px;
}
.deleteBtn{
  margin-left:10px;
  color: chocolate;
  cursor:pointer;
}
</style>




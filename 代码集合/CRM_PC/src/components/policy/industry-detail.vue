<template>
  <div class="app-container calendar-list-container new-industry">
    <div class="top-distance">
      <h3>行业资讯详情</h3>
      <el-row>
        <el-card class="box-card">
          <el-form ref="form" :label-position="labelPosition" :rules="rules" :model="form" label-width="200px">
            <h3 class="form-industry">{{ $t("title.basicParameter") }}</h3>
            <el-form-item label="文章标题：" prop="title">
              <span>{{ form.title }}</span>
            </el-form-item>
            <el-form-item label="显示状态：" prop="showStatus">
              <el-radio-group v-model="form.showStatus">
                <el-radio disabled :label="0">{{ $t("status.toped")}}</el-radio>
                <el-radio disabled :label="1">{{ $t("status.show") }}</el-radio>
                <el-radio disabled :label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
              <span>{{ form.metaTitle }}</span>
            </el-form-item>
            <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
              <span>{{ form.metaKeyword }}</span>
            </el-form-item>
            <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
             <span>{{ form.metaDescription }}</span>
            </el-form-item>
            <h3 class="form-industry" style="margin-top: 50px">
              {{ $t("title.detailInfo") }}
            </h3>
            <el-form-item :label="$t('label.cate')" prop="cate">
              <el-select v-model="form.cate" :placeholder="$t('input.choose')" disabled>
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
                :disabled="true"
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
                  <span class="dow-load" @click="downloadFile">{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFileId(item)">x</span>
                </div>
                <div v-for="item in fileList" :key="item.id">
                  <span class="dow-load" @click="downloadFile(item)">{{item.name}}</span>
                  <span class="deleteBtn" @click="deleteFile(item)">x</span>
                </div>
              </el-form-item> -->
            </div>
             <el-form-item label="发布人：">
              <p style="margin:0">
              <!-- <el-tooltip effect="dark" :content="'工号：'+form.createByNo+'   部门：'+form.deptName" placement="right"> -->
                 <span>{{form.createByName}}</span>
            <!-- </el-tooltip> -->
              </p>
             </el-form-item>
             <el-form-item label="创建时间：">
              <span>{{ form.createTime }}</span>
             </el-form-item>
             <el-form-item label="发布时间：" v-if="form.publishTime">
              <span>{{ form.publishTime }}</span>
             </el-form-item>
             <el-form-item label="浏览量/收藏量：" v-if="form.pageViews">
              <span>浏览量：{{form.pageViews }}</span>
              <span class="left-collect-sty" v-if="form.collects">收藏量：{{ form.collects }}</span>
             </el-form-item>
             <el-form-item label="审核状态：">
              <span>{{ form.auditState|industryFilter }}</span>
             </el-form-item>
          </el-form>
        </el-card>
      </el-row>
    </div>
  </div>
</template>

<script>
import orderData from '@/components/member/order-data'
import { getIndustryDetail} from "@/api/policy/industry";
import tinymceEditor from "@/views/policySquare/tinymceEditor";
import detailHead from "@/page/index/top/index";
import { fileDownload } from "@/api/policy/list";
import * as CodeMsg from "@/api/common/CodeChange";
import PolicyFileUpload from '@/components/file/policyFileUpload';
export default {
  components: {
    tinymceEditor,
    PolicyFileUpload,
    detailHead
  },
  data() {
    return {
      type:4,
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
      param: new FormData(),
      files: [],
      checkFlieRepet: false,
      repeatName: "",
      cateList: orderData.orderTypeNewData,
      rules: {
        title: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur", },
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
        metaKeyword: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 100, message: this.$t("input.txtLong100"), trigger: "blur", },
        ],
        metaDescription: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 200, message: this.$t("input.txtLong200"), trigger: "blur", },
        ],
        cate: [
          {
            required: true,
            message: this.$t("input.pleaseChooseCate"),
            trigger: "change"
          }
        ]
      },
      labelPosition: "right",
      form: {
        title: "",
        showStatus: 1,
        metaTitle: "",
        metaKeyword: "",
        metaDescription: "",
        cate: null,
        content: "",
        createTime: "",
        sort:'1'
      },
      transferData: {},
      fileName: [],
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      contentNeed: false,
      limit: true,//默认编辑框字数合理 接收子组件传参
      casDisable: false,
      prompt: '请选择选项',
    };
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
    getDetailData(){
       getIndustryDetail(this.$route.query.number,this.$route.query.source).then(res => {
          if(res.data.code == CodeMsg.CODE_1000) {
            this.form = res.data.data;
            this.publishStatus = res.data.data.isDraft;
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
    unique(names) {
      const res = new Map();
      return names.filter(names => !res.has(names) && res.set(names, 1));
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
        console.log(this.libraryFileList);
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
    getChildEditor(data) {
      this.editorContent = data;
    },
    wordLimit(val){
      this.limit = val;
    },
  },
  watch: {
    editorContent(val) {
      if (val != "") {
        this.contentNeed = false;
      }
    },
  },
  mounted() {
    this.getDetailData()
  },
};
</script>
<style scoped>
.form-industry {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  margin-left: 20px;
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
.new-industry{
  margin: -62px 1% 0 1%;
}
.area-sty{
  width:260px;
}
.left-collect-sty{
  margin-left: 10px;
}
.dow-load{
  color: #125BBE;
  cursor: pointer;
}
.industy-select-sty{
  width: 250px;
}
</style>




<template>
  <div class="my_publish">
    <div class="column_table" v-if="viewStatus == true">
      <el-form :model="filters" :inline="true" @keyup.enter.native="getFirstAllList()">
        <el-form-item :label="$t('label.keywords')">
          <el-input
            :placeholder="$t('message.inputProjectKeyWords')"
            v-model="filters.kerWords"
          ></el-input>
        </el-form-item>
        <el-button @click="getFirstAllList()">{{ $t('button.search') }}</el-button>
        <el-button @click="viewStatus = false,showType = 0" type="primary">{{ $t('button.addArticle') }}</el-button>
      </el-form>
      <div style="margin-bottom:10px;">
        <span style="font-size:14px;">{{ $t('label.batch') }}：</span>
        <el-button size="mini" type="danger" :disabled="deleteArr.length>0?false:true" @click="mutiDelete" icon="el-icon-delete">{{ $t('button.delete') }}</el-button>
      </div>
      <el-table
        :data="columnList"
        style="width:1300px;"
        border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column v-if="type == 1" prop="sort" label="序号" align="center" width="80px;"></el-table-column>
        <el-table-column :label="$t('message.essayNo')" align="center">
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="handleEdit(scope.row,scope.$index)">{{ scope.row.number }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.title')" align="center">
          <template slot-scope="scope">
            <div style="color:#409EFF;cursor:pointer;" @click="handleEdit(scope.row,scope.$index)">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" :label="$t('label.publishMan')" align="center">
         <template slot-scope="scope">
         <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUser }}</span>
         </el-tooltip>
         </template>
      </el-table-column>
        <el-table-column prop="createTime" :label="$t('label.publishTime')" align="center"></el-table-column>
        <el-table-column :label="$t('label.showStatus')" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.deleted == 1">{{ scope.row.deleted|deleteFilter }}</div>
            <el-select
              v-if="scope.row.deleted == 0"
              v-model="scope.row.showStatus"
              style="width:100px;"
              @change="changeStatus(scope.row)">
              <el-option :label="$t('status.show')" :value="1"></el-option>
              <el-option :label="$t('status.noShow')" :value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="浏览量" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.pageViews|viewFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('label.opration')" align="center" width="210">
          <template slot-scope="scope">
             <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click="showFastEdit(scope.row,false)"
              :disabled="scope.row.deleted == 1">快速修改</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              v-preventReClick
              @click="handleEdit(scope.row,scope.$index)"
              :disabled="scope.row.deleted == 1">{{ $t('button.edit') }}</el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row,scope.$index)"
              :disabled="scope.row.deleted == 1">{{ $t('button.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- dialog快速修改 -->
      <el-dialog
       title="快速修改"
       :visible.sync="fastVisible"
       width="30%"
       :center="true"
       :before-close="handleClose">
         <el-form :model="fastForm" ref="fastForm" label-width="100px" :rules="fastRules">
            <el-form-item label="文章标题" prop="essayTitle">
              <el-input v-model="fastForm.title" maxlength="70" placeholder="请填写" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="显示状态" prop="showStatus">
              <el-radio-group v-model="fastForm.showStatus">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="网页标题" prop="metaTitle">
              <el-input v-model="fastForm.metaTitle" placeholder="请填写" maxlength="70" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta关键字" prop="metaKeyWord">
              <el-input v-model="fastForm.metaKeyWord" placeholder="请填写" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="meta描述" prop="metaDescription">
              <el-input type="textarea" v-model="fastForm.metaDescription" placeholder="请填写" maxlength="200" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="序号" prop="sort" v-if="type==1">
              <el-input 
              @change="fastForm.sort = oninput(fastForm.sort)"
              @keyup.native="fastForm.sort = oninput(fastForm.sort)"
              type="number" 
              v-model.trim="fastForm.sort" 
              style="width:100px;" 
              placeholder="请填写"></el-input>
            </el-form-item>
         </el-form>
       <div class="fast-edit">
         <el-button type="primary" class="fast-save-sty" v-preventReClick @click="fastEdit()">保存</el-button>
         <el-button @click="handleClose">取消</el-button>
       </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, jumper, total"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :total="total"
        style="float:right;margin-top:20px;margin-right:10px;"
      ></el-pagination>
    </div>
    <div v-if="viewStatus == false">
      <span class="borer-tab"></span>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-left:40px;">
        <el-tab-pane :label="$t('message.essayInfo')" name="notice"></el-tab-pane>
        <el-tab-pane v-if="showType == 1" :label="$t('message.operateRecords')" name="policy"></el-tab-pane>
      </el-tabs>
      <div v-if="showStatus == 0" style="width:98%;">
        <essay-info ref="child" @to-list="tolist" :id="id" :type="showType" :sortShow="type" :essayId="essayId" :name="name"></essay-info>
      </div>
      <div v-if="showStatus == 1" style="width:100%;">
        <operate :number="number" :title="title"></operate>
      </div>
    </div>
  </div>
</template>

<script>
import {
  articleList,
  editArticle,
  articleDetail,
  changeArticleSatus,
  deleteArticle,
  batchDelete
} from "@/api/siteSettings/column";
import essayInfo from "./essayInfo";
import * as CodeMsg from "@/api/common/CodeChange"
import operate from "./operateRecords";
export default {
  props: ["id", "type","name"],
  components: {
    essayInfo,
    operate
  },
  data() {
    return {
      clickStatus:false,
      title:"",
      sortStatus:false,
      fastForm:{
        title:"",
        showStatus:"",
        metaTitle:"",
        metaDescription:"",
        metaKeyWord:"",
        sort:"",
        id:"",
        number:"",
        sort:1
      },
      fastVisible:false,
      number: "",
      deleteArr: [],
      numbers:[],
      essayId: "",
      showType: 0,
      total: 20,
      pageSize: 10,
      currentPage: 1,
      filters: {
        kerWords: ""
      },
      viewStatus: true,
      activeName: "notice",
      showStatus: "0",
      columnList: [],
      fastRules:{
        title:[{ required: true, message: '请填写', trigger: 'blur' }],
        showStatus:[{ required: true, message: '请选择', trigger: 'blur' }],
        metaTitle:[{ required: true, message: '请填写', trigger: 'blur' }],
        metaDescription:[{ required: true, message: '请填写', trigger: 'blur' }],
        metaKeyWord:[{ required: true, message: '请填写', trigger: 'blur' }],
        sort:[{ required: true, message: '请填写', trigger: 'blur' }]
      }
    };
  },
  filters: {
    viewFilter(val){
      if(val/10000>=1){
        return (val/10000).toFixed(2)+'万'
      }else{
        return val
      }
    },
    deleteFilter(val) {
      return this.$t('status.deleted');
    }
  },
  methods: {
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", ".");
      value = value.replace(/\D|^0/g,'')
      value =
      value.indexOf(".") > 0
        ? value.split(".")[0].substring(0, 5) + "." + value.split(".")[1]
        : value.substring(0, 5);
      return value;
    },
    handleClose(){
      this.fastVisible = false
      this.$refs["fastForm"].resetFields()
    },
    showFastEdit(val,status){
      this.sortStatus = status
      this.fastVisible = true
      articleDetail(val.id).then(res => {
          let result = res.data.data;
          this.fastForm.title = result.title;
          this.fastForm.metaTitle = result.metaTitle;
          this.fastForm.metaKeyWord = result.metaKeyword;
          this.fastForm.sort = result.sort;
          this.fastForm.showStatus = result.showStatus;
          this.fastForm.number = result.number;
          this.fastForm.id = result.id;
          this.fastForm.metaDescription = result.metaDescription;
        });
    },
    fastEdit(){
      let params = {
          title: this.fastForm.title,
          metaTitle: this.fastForm.metaTitle,
          metaKeyword: this.fastForm.metaKeyWord,
          metaDescription: this.fastForm.metaDescription,
          showStatus:this.fastForm.showStatus,
          id: this.fastForm.id,
          number: this.fastForm.number
        };
        if(this.type == 1){
          params.sort = this.fastForm.sort
        }
        editArticle(params).then(res => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: this.$t("button.modifySuccess")
            });
            this.fastVisible = false
            this.getAllList()
          } else if (res.data.code == CodeMsg.CODE_2000) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
          }
        });
    },
    mutiDelete() {
       this.$confirm(this.$t("label.confirmDelete"), this.$t("message.tips"), {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        }).then(() => {
          let params = {
          ids: this.deleteArr,
          numbers:this.numbers
      };
      batchDelete(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t('alert.sucessDelete')
          });
          this.getAllList();
        }
      })
    })
    },
    handleEdit(row, index) {
      this.title = row.title
      this.showType = 1;
      this.viewStatus = false;
      this.essayId = row.id;
      this.number = row.number;
      this.showStatus = 0;
    },
    handleDelete(row, index) {
      this.$confirm(this.$t("label.confirmDelete"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(() => {
          let params = {
            id: row.id,
            number: row.number
          };
          deleteArticle(params).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: this.$t('alert.sucessEdit')
              });
              this.getAllList();
            }
          });
        })
    },
    handleSelectionChange(val) {
      this.deleteArr = [];
      this.numbers = [];
      val.forEach(item => {
        this.deleteArr.push(item.id);
        this.numbers.push(item.number);
      });
    },
    changeStatus(row) {
      let params = {
        id: row.id,
        number: row.number,
        showStatus: row.showStatus,
        type: this.type,
        programId: this.id
      };
      changeArticleSatus(params).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: this.$t('alert.sucessEdit')
          });
          this.getAllList();
        } else if (res.data.code == CodeMsg.CODE_2000) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
          this.getAllList();
        }
      });
    },
    getAllList() {
      this.currentPage = 1;
      this.getList();
    },
    getFirstAllList() {
      this.clickStatus = true
      this.getAllList()
    },
    getList() {
      let params = {
        size: this.pageSize,
        start: this.currentPage,
        programId: this.id,
        title: this.clickStatus == true?this.filters.kerWords:""
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      articleList(params).then(res => {
        this.columnList = res.data.data.list;
        this.total = res.data.data.total;
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    handleClick(val) {
      this.showStatus = val.index;
    },
    tolist() {
      this.viewStatus = true;
      this.getList();
    }
  },
  created(){
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      this.filters.kerWords = keepParams.params.title
      this.currentPage = keepParams.params.start
      this.pageSize = keepParams.params.size
      this.clickStatus = keepParams.clickStatus
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.my_publish {
  margin-top: 30px;
  margin-right: 100px;
  margin-left: 20px;
  width: 100%;
  position: relative;
}
.column_table{
  width: 90%;
}
.borer-tab {
  display: inline-block;
  width: 50px;
  height: 2px;
  background: #e4e7ed;
  position: absolute;
  left: 0px;
  top: 38px;
}
.fast-edit{
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-save-sty{
  margin-right: 50px;
}
</style>
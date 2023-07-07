<template>
<!-- 排查完成 -->
  <div class="template-frame">
    <el-button type="primary" class="template-btn" @click="addTemplate()">添加模板</el-button>
    <avue-crud ref="crud"
      class="batch-choose"
      :data="tableData"
      :option="templateTable"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="templateName" slot-scope="{row}">
        <p class="able-click" @click="editTemplate(row)">{{row.templateName}}</p>
      </template>
      <template slot="relatedSpuNum" slot-scope="{row}">
        <p class="able-click" @click="relatedNum = true; viewRelatedProd(row)">{{row.relatedSpuNum || 0}}</p>
      </template>
      <template slot="menu" slot-scope="{row}">
        <el-button type="text" @click="editTemplate(row)">编辑</el-button>
        <el-button type="text" @click="relatedNum = false;addRelatedProduct(row)">添加关联产品</el-button>
        <!-- <el-button type="text">预览</el-button> -->
        <el-popconfirm
          title="是否确认删除？"
          @confirm="deleteTemplate(row.id)"
        >
          <el-button type="text" class="del-btn" slot="reference" v-if="row.relatedSpuNum == null">删除</el-button>
        </el-popconfirm>
      </template>
    </avue-crud>

    <!-- 关联产品清单 -->
    <el-dialog :visible.sync="relatedProductDialog" title="合同模板-关联产品清单" :close-on-click-modal="false" width="900px">
      <el-form :model="relatedProductForm" label-width="90px" inline>
        <el-form-item label="产品类型：">
          <el-select v-model="relatedProductForm.productType">
            <el-option
              v-for="item in productTypelist"
              :key="item.id"
              :value="item.id"
              :label="item.categoryName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input class="input-keyword" v-model="relatedProductForm.keyWords" placeholder="请输入产品编号或产品名称关键字" />
        </el-form-item>
        <el-button type="primary" @click="getRelatedProduct(currentTemplate)">搜索</el-button>
        <el-button @click="reset(currentTemplate)">重置</el-button>
        <el-button type="primary" @click="relatedNum = false;addRelatedProduct(currentTemplate)">添加关联产品</el-button>
      </el-form>
      <el-table border :data="relatedPordList">
        <el-table-column label="产品编号" prop="spuCode" align="center"></el-table-column>
        <el-table-column label="产品类型" prop="categoryName" align="center"></el-table-column>
        <el-table-column label="产品名称" prop="spuTitle" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="changeTemplate(row)">更换合同模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleControlCurrentChange"
        :current-page="relatedCurrentPage"
        :page-size="relatedPageSize"
        layout="total, prev, pager, next"
        :total="relatedTotal">
      </el-pagination>
    </el-dialog>

    <!-- 更换合同模板 -->
    <el-dialog title="更换合同模板" :visible.sync="changeDialog" :close-on-click-modal="false">
      <p>合同模板更换后只对待签约订单及新订单生效</p>
      <el-form :model="templateForm" label-width="90px">
        <el-form-item label="产品名称：">{{productName}}</el-form-item>
        <el-form-item label="选择模板：">
          <el-select v-model="templateForm.templateId" @change="chooseTemplate">
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :value="item.id"
              :label="item.templateName"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="confirmChangeTemplate()">确 定</el-button>
        <el-button @click="cancelChange()">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加产品" :visible.sync="productDialog" :close-on-click-modal="false" width="900px">
      <choose-product v-if="productDialog" @list="getProductList" @closeDialog="closeProductDialog" :existingProducts="relatedPordList" :currentTemplateId="currentTemplateId" :multipleNum='5'/>
    </el-dialog>
  </div>
</template>

<script>
import { templateTable } from '@/const/crud/contracts/template'
import { getTemplate, getList, getCategory, del, modTemplateBatch, toTemplate} from '@/api/contracts/contracts'
import chooseProduct from './choose-product.vue'

export default {
  components: {
    chooseProduct
  },
  data(){
    return {
      templateTable: templateTable,
      tableData:[],
      page: {
        currentPage: 1,
        total:0,
        layout: "total, sizes, prev, pager, next, jumper",
        background: true ,
        pageSizes: [3, 5, 10, 20, 30, 40, 50, 100 ],//选择每页显示条数
        pageSize: 20
      },
      form:{
        orderList:[]
      },
      relatedProductDialog: false,
      relatedProductForm:{
        productType: 0
      },
      productDialog: false,
      relatedPordList: [],
      templateForm: {},
      changeDialog: false,
      productName: '',
      productTypelist: [],
      templateList: [],
      productId: '',
      relatedCurrentPage: 1,
      relatedPageSize: 10,
      relatedTotal: 0,
      currentTemplateId: -1,
      currentTemplate: {},
      spuContractTemplateName: '',
      relatedNum: false,//关联清单,
      templateName: ''
    }
  },
  mounted(){
    this.getTemplateList();
  },
  methods:{
    chooseTemplate(val){
      this.templateList.forEach(template => {
        if(val == template.id){
          this.templateName = template.templateName
        }
      });
    },
    cancelChange(){
      this.templateForm = {};
      this.changeDialog = false;
    },
    reset(row){
      this.relatedProductForm = {
        productType: 0
      };
      this.getRelatedProduct(row);
    },
    handleControlCurrentChange(val){
      this.relatedCurrentPage = val;
      this.getRelatedProduct(this.currentTemplate);
    },
    deleteTemplate(id){
      let params = {
        id: id,
        returnUrl: window.location.origin + `/#/contracts-template-map?templateId=${id}`
      }
      del(params).then(res=>{
        if(res.data.code == 0){
          this.$message({
            type:'success',
            message:'模板删除成功！',
            duration: 2000
          })
          this.getTemplateList();
        }
      })
    },
    confirmChangeTemplate(){
      let param = {
        spuContractTemplateId: this.templateForm.templateId,
        spuContractTemplateName: this.templateName,
        ids: [this.productId]
      }
      modTemplateBatch(param).then(res=>{
        if(res.data.code == 0){
          this.$message({
            type:'success',
            message:'更换合同模板成功！'
          })
          this.changeDialog = false;
          this.viewRelatedProd(this.currentTemplate);
          this.getTemplateList();
        }
      })
    },
    getCategoryList(){
      getCategory({parentId:0}).then(res=>{
        this.productTypelist = res.data.data;
        if(this.relatedNum){
          this.productTypelist.unshift({id: 0,categoryName:'全部'})
          this.relatedProductForm.productType = 0;
        }
      })
    },
    changeTemplate(row){
      this.productName = row.spuTitle;
      this.productId = row.id;
      this.changeDialog = true;
    },
    addRelatedProduct(row){
      this.currentTemplateId = row.id;
      this.spuContractTemplateName = row.templateName;
      this.productDialog = true;
    },
    editTemplate(row){
      let params = {
        id: row.id,
        templateName: row.templateName,
        returnUrl: window.location.origin + `/#/contracts-template-map?templateId=${row.id}&name=${row.templateName}`
      }
      toTemplate(params).then(res=>{
        window.open(res.data.data);
      })
    },
    viewRelatedProd(row){
      this.currentTemplate = row;
      this.templateList = this.tableData.filter((item)=>{
        return item.id != row.id;
      })
      this.getCategoryList();
      this.currentTemplateId = row.id;
      this.getRelatedProduct(row);
      this.relatedProductDialog = true;
    },
    getRelatedProduct(row){
      let param = {
        spuContractTemplateId: row.id,
        pageNo: this.relatedCurrentPage,
        pageSize: this.relatedPageSize,
        categoryId: this.relatedProductForm.productType,
        key: this.relatedProductForm.keyWords
      }
      getList(param).then(res=>{
        this.relatedPordList = res.data.data.records;
        this.relatedTotal = res.data.data.total;
      })
    },
    getProductList(val){
      this.relatedPordList = val;
      let obj = {
        ids:[],
        spuContractTemplateId: this.currentTemplateId,
        spuContractTemplateName: this.spuContractTemplateName
      };
      this.relatedPordList.forEach(item => {
        obj.ids.push(item.id);
      });
      modTemplateBatch(obj).then(res=>{
        if(res.data.code == 0){
          this.$message({
            type:'success',
            message:'添加关联产品成功！'
          })
          this.relatedProductDialog = false;
          this.getTemplateList();
        }
      })
    },
    closeProductDialog(val){
      this.productDialog = val;
    },
    getTemplateList(){
      let param = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getTemplate(param).then(res=>{
        this.tableData = res.data.data.records;
        this.page.total = res.data.data.total;
      })
    },
    addTemplate(){
      this.$router.push({
        path:'/contracts-template-add'
      })
    },
    sizeChange(val){
      this.page.pageSize = val;
      this.getTemplateList();
    },
    currentChange(val){
      this.page.currentPage = val;
      this.getTemplateList();
    },
  }
}
</script>

<style>
.template-frame{
  min-height: 100%;
  background: #FFFFFF;
  padding: 20px;
}
.template-btn{
  margin: 20px 0;
}
.input-keyword{
  width: 230px;
}
.able-click{
  cursor: pointer;
  color: #36A6FE;
}
.del-btn{
  color: red;
  margin-left: 10px;
}
</style>
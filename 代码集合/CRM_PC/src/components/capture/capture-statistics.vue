<template>
  <div class="statistics">
    <p>该部分内容只为抓取需求的统计表格，若需执行抓取请联系管理员进行配置</p>
    <el-table border class="statistics_table" :data="captureList">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="信息标题" prop="titles"></el-table-column>
      <el-table-column label="网址">
        <template slot-scope="scope">
          <a style="color: #409EFF" :href="scope.row.url">{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.number +'   部门：'+scope.row.deptName" placement="top">
            <span>{{scope.row.createName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch :active-value='0' :inactive-value='1' v-model="scope.row.isDisable" @change="switchStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editCapture(scope.row)">编辑</el-button>
          <el-button type="text" @click="delCapture(scope.row)">删除</el-button>
        </template>
      </el-table-column>    
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-button type="primary" @click="addNewCapture()">新建记录</el-button>
    <!-- 新建/编辑记录 -->
    <el-dialog :title="dialogTitle" :visible.sync="captureDialog" width="550px" :close-on-click-modal="false">
      <el-form :model="captureForm" inline ref="captureForm" :rules="rules" v-if="captureDialog">
        <el-form-item label="地区：" prop="region">
          <el-cascader
            @change="areaChange"
            :options="areaOptions"
            v-model="captureForm.region"
            :props="{value: 'id',label: 'areaName'}"
            placeholder="请选择地区"
          ></el-cascader>
          <!-- <el-cascader :options="areaTree" v-model="clueForm.orgAddress" :props="{value: 'id',label: 'areaName'}"/> -->
        </el-form-item>
        <el-form-item label="归口：" prop="attribute">
          <el-select v-model="captureForm.attribute" placeholder="请选择归口">
            <el-option 
              v-for="item in attributionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="板块：" prop="modelName">
          <el-input placeholder="请输入板块名称" v-model="captureForm.modelName"/>
        </el-form-item>
        <el-form-item label="网址：" prop="url">
          <el-input placeholder="请输入目标网址" v-model="captureForm.url"/>
        </el-form-item>
        <el-form-item label="状态：" v-if="!isEdit">
          <el-radio label="0" v-model="status">启用</el-radio>
          <el-radio label="1" v-model="status" disabled>禁用</el-radio>
        </el-form-item>
        <div>
          <el-form-item label="备注：">
            <el-input type="textarea" rows="5" maxlength="200" show-word-limit v-model="captureForm.desc" class="capture_desc" />
          </el-form-item>
        </div>
      </el-form>
      <p>图片最多4张，格式为jpg，png，gif等，大小控制在4M以内</p>
      <file-upload :limit="4" :acceptType="'.gif,.jpg,.png'" :show="false" :fileSize="4" :multipleFile="true" :listType="'picture-card'"  @fileList="getFileList" :followFileList='files' v-if="captureDialog" />
      <div class="confirmBtn">
        <el-button type="primary" @click="submitCapture()">确定</el-button>
        <el-button type="warning" @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDropPolicy } from "@/api/policy/list";
import fileUpload from '../file/file-upload.vue';
import * as CodeMsg from "@/api/common/CodeChange"
import { addCapture, getStatisticsList, del, updateStatus } from '@/api/capture-data/index'
import { getAreaTree } from '@/api/clue/clue'
export default {
  components: { 
    fileUpload
  },
  data(){
    return {
      captureDialog: false,
      captureForm: {},
      captureList: [],
      areaOptions: [],//地区
      attributionList: [],//归口
      status: '0',
      fileList: [],
      files: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      isEdit: false,
      url: '',
      urls:[],
      fileNames:[],
      dialogTitle:'新建记录',
      rules:{
        region: [{required: true, message:'请选择地区', trigger:'blur'}],
        modelName: [{required: true, message:'请选择板块', trigger:'blur'}],
        url: [{required: true, message:'请输入网址', trigger:'blur'}],
        attribute: [{required: true, message:'请选择归口', trigger:'blur'}],
      }
    } 
  },
  mounted(){
    this.getCaptureList();
    this.getDropdown();
  },
  methods:{
    cancel(){
      this.files = [];
      this.captureDialog = false;
    },
    editCapture(row){
      this.url = '/wtcrm/grab/change';
      this.dialogTitle = '编辑记录';
      this.isEdit = true;
      this.$set(this.captureForm,'region',row.are.split(',').map(Number));
      this.$set(this.captureForm,'attribute',Number(row.gk));
      this.$set(this.captureForm,'url',row.url);
      this.$set(this.captureForm,'modelName',row.title);
      this.$set(this.captureForm,'desc',row.bz);
      this.$set(this.captureForm,'id',row.id);
      this.files = row.fileUrls;
      this.fileList = row.fileUrls;
      this.captureDialog = true;
    },
    switchStatus(row){
      let param ={
        isDisable: row.isDisable,
        id: row.id,
        userId: JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.id
      };
      updateStatus(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          this.$message({
            type:'success',
            message:'修改成功！'
          })
        }
        this.getCaptureList();
      })
    },
    delCapture(row){
      this.$confirm('确定删除该条数据吗？','删除',{
        type: 'warning',
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      }).then(()=>{
        del(row.id).then(res=>{
          if(res.data.code == CodeMsg.CODE_1000){
            this.$message({
              type:'success',
              message:'删除成功！',
              duration: 2000
            })
          }
          this.getCaptureList();
        }).catch(err=>{
          return err;
        });
      }).catch(err=>{
        return err;
      });
    },
    getFileList(row){
      this.fileList = [];
      this.fileList = row;
    },
    addNewCapture(){
      this.url = '/wtcrm/grab/build';
      this.isEdit = false;
      this.captureForm = {};
      this.files = [];
      this.fileList = []
      this.dialogTitle = '新建记录';
      this.captureDialog = true;
    },
    getDropdown() {
      getDropPolicy(0).then((res) => {
        this.captureForm.belongData = res.data.data.factors;
        this.attributionList = res.data.data.factors[0].optionList;
      }).catch((err) => {
        console.log(err);
      });
      getAreaTree().then(res=>{
        let areaTree = res.data.data;        
        for(var i = 0; i <areaTree.length; i++){
            let newList=[];
            for(var j = 0; j <areaTree[i].children.length; j++){                
            newList.push({
              areaName:areaTree[i].children[j].areaName,
              id:areaTree[i].children[j].id,
              nodeNumber:areaTree[i].children[j].nodeNumber,
              parentId:areaTree[i].children[j].parentId
            })
            }            
        areaTree[i].children=newList;
        }
        this.areaOptions=areaTree 
      }).catch(err=>{
        return err;
      });
    },
    areaChange() {
      console.log(this.captureForm.region);
      this.areaOptionId = ''
      this.areaOptions.forEach(item=>{
        if(item.value == this.captureForm.region[0]){
          this.areaOptionId = item.optionId;
        }
      })
    },
    submitCapture(){
      this.$refs.captureForm.validate(valid=>{
        if(valid){
          let param = new FormData();
          if(this.captureForm.id){
            param.append('id',this.captureForm.id);
          };
          param.append('url', this.captureForm.url);
          param.append('areaNo', this.captureForm.region[1]);
          param.append('provincialNo', this.captureForm.region[0]);
          param.append('gk', this.captureForm.attribute);
          if(this.captureForm.desc){
            param.append('bz', this.captureForm.desc);
          };
          param.append('title', this.captureForm.modelName);
          if(this.fileList.length > 0){
            this.fileList.forEach(item => {
              if(item.raw){
                param.append('wtGrabPictures',item.raw);
              }else{
                this.urls.push(item.url);
                this.fileNames.push(item.name);
              }
            });
            param.append('pictures',this.urls);
            param.append('pictureNames',this.fileNames);
          };
          param.append('userId',JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.id);
          addCapture(param,this.url).then(res=>{
            if(res.data.code == CodeMsg.CODE_1000){
              this.$message({
                type:'success',
                message:'数据提交成功！'
              })
            }
            this.urls = [];
            this.fileNames = [];
            this.captureDialog = false;
            this.getCaptureList();
          }).catch(err=>{
            return err;
          });
        }else{
          return false;
        };
      })
    },
    getCaptureList(){
      let param = {
        size: this.pageSize,
        start: this.currentPage
      };
      getStatisticsList(param).then(res=>{
        this.captureList = res.data.data.list;
        this.total = res.data.data.total;
      }).catch(err=>{
        return err;
      });
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getCaptureList();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getCaptureList();
    },
  }
}
</script>

<style scoped>
.statistics{
  height: 100%;
  background: #FFFFFF;
  margin-bottom: 0;
  padding: 10px;
}
.statistics_table{
  margin: 10px 0;
}
.capture_desc{
  width: 400px;
}
.confirmBtn{
  margin-top: 30px;
  text-align: center;
}
.pagination{
  text-align: right;
}
</style>
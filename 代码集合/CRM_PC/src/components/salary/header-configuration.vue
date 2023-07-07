<template>
  <div>
    <el-form :model="headerForm" inline>
      <el-form-item label="部门：" prop="deptId">
        <avue-input-tree v-model="headerForm.deptId" :dic="treeData" :node-click="getNodeData" @change="checkDept" :props="{label: 'name',value: 'id'}" placeholder="请选择部门"/>
      </el-form-item>
      <el-button type="primary" @click="addDeptHeader()">新建部门表头</el-button>
    </el-form>

    <el-table :data="options" border>
      <!-- 表头标签 1-基础薪酬 2-考勤 3-津贴 4-绩效 5-社保+公积金 6-个税 7-其他 8-预留 -->
      <el-table-column label="工资表表头及对应结果值" align="center">
        <el-table-column label="基础薪酬">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_1" :key="index"><span >{{item.resultName}}<span v-if="index < row.resultNameList.key_1.length-1">、</span></span></span>
          </template>
        </el-table-column>
        <el-table-column label="考勤">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_2" :key="index"><span >{{item.resultName}}<span v-if="index < row.resultNameList.key_2.length-1">、</span></span></span>
          </template>
        </el-table-column>
        <el-table-column label="津贴">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_3" :key="index"><span >{{item.resultName}}<span v-if="index < row.resultNameList.key_3.length-1">、</span></span></span>
          </template>
        </el-table-column>
        <el-table-column label="绩效">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_4" :key="index"><span >{{item.resultName}}<span v-if="index < row.resultNameList.key_4.length-1">、</span></span></span>
          </template>
        </el-table-column>
        <el-table-column label="社保+公积金">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_5" :key="index"><span >{{item.resultName}}<span v-if="index < row.resultNameList.key_5.length-1">、</span></span></span>
          </template>
        </el-table-column>
        <el-table-column label="其他">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.resultNameList.key_7" :key="index"><span >{{item.resultName}} <span v-if="index < row.resultNameList.key_7.length-1">、</span> </span></span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="使用部门">
        <template slot-scope="{row}">
          <span v-for="(item,index) in row.payrollHeadConfDeptList" :key="item.deptId">{{item.deptName}} <span v-if="index < row.payrollHeadConfDeptList.length-1">;</span> </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="text" @click="editHeader(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="paging">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="current"
        background
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <!-- 新建/编辑表头 -->
    <el-dialog :visible.sync="headerDialog" :close-on-click-modal="false" @close="closeDialog" width="750px" :title="title" >
      <el-form :model="form">
        <el-form-item label="使用部门：">
          <el-cascader
            ref="dept"
            v-model="form.dept"
            :options="deptData"
            :props="{ multiple: true, checkStrictly: true, emitPath: false}"
            @change="deptArr"
            filterable
            collapse-tags
            clearable>
          </el-cascader>
        </el-form-item>
        <span class="header-prompt">先选择使用部门（选择的部门仅包含本部门，不包含其下属部门），再选择所选使用部门涉及到的结果值项，再将结果值项分配到所属表头</span>
      </el-form>

      
      <el-form :model="resultForm" ref="formRef" :rules="rules" >
        <el-table ref="resultTable" :data="resultForm.resultData" border @selection-change="selectionChange" :row-key="(row)=>{return row.id}">
          <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true"></el-table-column>
          <el-table-column label="结果值名称" prop="name"></el-table-column>
          <el-table-column label="名称描述" prop="des"></el-table-column>
          <el-table-column label="所属表头项" >
            <template slot-scope="{row, $index}">
                <el-form-item :prop="$index+'headTagId'" :rules="rules.headTagId">
                  <el-select v-model="row.headTagId" :disabled="row.disabled">
                    <el-option
                      v-for="item in headerList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="paging">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          background
          :page-sizes="[5, 10, 15, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div slot="footer">
        <el-button size="mini" @click="closeDialog()">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmAddHeader()">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { result } from '@/api/salary/result'
import { pageHeader, addHeader, listPayrollHeadConfDeptId } from '@/api/salary/salary'
import headerData from './examine'
import Vue from 'vue'
export default {
  props:{
    treeData:{//部门tree
      default: []
    }
  },
  data(){
    var headTagValidate = (rules, value, callback)=>{
      let index = rules.field.match(/\d/g)[0];
      if(this.resultForm.resultData[index].headTagId && this.selectedIds.indexOf(this.resultForm.resultData[index].id) > -1){//勾选并选择表头
        callback()
      }else if(this.selectedIds.indexOf(this.resultForm.resultData[index].id) == -1){//未勾选
        callback();
      }else{
        callback(new Error('请选择所属表头项'))
      }
    };
    return {
      headerForm: {},
      editInfo: {},//编辑信息
      form: {
        dept:[]
      },
      deptData: [],
      options: [],
      headerList: headerData.headerList,
      usedDeptIds: [],
      resultForm:{
        resultData: [],
      },
      selectedList: [],
      selectedIds: [],
      deptIds: [],
      rules:{
        headTagId:[{ validator:headTagValidate, message:'请选择所属表头', trigger:'change'}]
      },
      headerDialog: false,
      title:'',
      operate: 1,
      pageNo:1,
      current:1,
      pageSize: 15,
      size: 20,
      total: 0,
      pageTotal: 0,
      payrollHeadConfDeptQueryList: [],//关联部门信息
    }
  },
  mounted(){
    this.getResultData();
    this.getHeaderList();
  },
  methods:{
    getSelectedDeptId(){
      listPayrollHeadConfDeptId().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$nextTick(()=>{
            this.deptIds = res.data.data;
            this.clearChild(this.treeData);
            this.deptData = this.treeData;
          })
        }
      })
    },
    closeDialog(val){
      this.form.dept = [];
      this.$refs.resultTable.clearSelection();
      this.headerDialog = false;
    },
    checkDept(){
      this.getHeaderList();
    },
    getNodeData(row){
      this.headerForm.deptId = row.value;
      this.getHeaderList();
    },
    editHeader(row){
      this.editInfo = row;
      this.operate = 0;
      this.echoHeader(row);
    },
    echoHeader(row){
      if(row.length > 0 || this.operate == 0){
        let list = [];
        if(this.operate){
          list = row
        }else{
          Object.values(row.resultNameList).forEach(el => {
            list = [...list, ...el];
          });
          this.form.dept = [];
          row.payrollHeadConfDeptList.forEach(el => {
            this.form.dept.push(el.deptId);
          });
          this.payrollHeadConfDeptQueryList = row.payrollHeadConfDeptList
        }
        this.$nextTick(()=>{  
          this.resultForm.resultData.forEach(el => {
            Vue.delete(el,'headTagId');
            this.$refs.resultTable.toggleRowSelection(el, false);
            list.forEach(item => {
              if(el.id == item.resultNameId || el.id == item.id){
                this.$set(el,'headTagId',item.headTagId);
                this.$refs.resultTable.toggleRowSelection(el, true);
              }
            });
          }); 
        })
        this.headerDialog = true;
      }
    },
    confirmAddHeader(){
      if(this.payrollHeadConfDeptQueryList.length > 0){
        let param = {
          id: this.editInfo.id || '',
          payrollHeadConfDeptQueryList: this.payrollHeadConfDeptQueryList,
          payrollHeadConfResultNameQueryList:[]
        }
        this.selectedList.forEach(el => {
          param.payrollHeadConfResultNameQueryList.push({
            resultNameId: el.id,
            resultName: el.name,
            headTagId: el.headTagId
          })
        });
        this.$refs.formRef.validate(valid=>{
          if(valid){
            addHeader(param,this.operate).then(res=>{
              if(res.data.code == CodeMsg.CODE_0){
                this.$message({
                  type:'success',
                  message: res.data.msg
                })
              }else{
                this.$message({
                  type:'warning',
                  message: res.data.msg
                })
              }
              this.headerDialog = false;
              this.getHeaderList();
            })
          }else{
            return false;
          }
        })
        
      }else{
        this.$message({
          type:'warning',
          message:'请选择使用部门!'
        })
      }
    },
    selectAble(row){
      return true;
    },
    selectionChange(row){
      this.selectedList = row;
      this.selectedIds = [];
      this.selectedList.forEach(el => {
        this.selectedIds.push(el.id);
      });
    },
    getResultData(){
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      result(param).then(res=>{
        this.resultForm.resultData = res.data.data.records;
        this.total = res.data.data.total;
        this.getSelectedDeptId();
        if(this.operate == 0){
          this.echoHeader(this.editInfo);
        }else{
          this.echoHeader(this.selectedList);
        }
      })
    },
    deptArr(){
      this.payrollHeadConfDeptQueryList = [];
      this.$refs.dept.getCheckedNodes().forEach(el => {
        this.payrollHeadConfDeptQueryList.push({deptId:el.value,deptName: el.label})
      });
    },
    addDeptHeader(){
      this.resultForm.resultData.forEach(el => {
        Vue.delete(el,'headTagId');
      })
      this.form.dept = [];
      this.operate = 1;
      this.title = '新建部门工资表表头';
      this.headerDialog = true;
    },
    clearChild(arr){//清除空children
      arr.forEach(el => {
        if(this.deptIds.indexOf(el.id) > -1){
          this.$set(el,'disabled',true)
        }
        if(el.children && el.children.length == 0){
          Vue.delete(el,'children')
        }else if(el.children && el.children.length > 0){
          this.clearChild(el.children)
        }
      });
    },
    getHeaderList(){
      let param = {
        pageSize: this.size,
        pageNo: this.current,
        deptId: this.headerForm.deptId
      }
      pageHeader(param).then(res=>{
        this.options = res.data.data.records;
        this.pageTotal = res.data.data.total;
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getResultData();
    },
    sizeChange(val){
      this.size = val;
      this.getHeaderList();
    },
    currentChange(val){
      this.current = val;
      this.getHeaderList();
    },
    handleCurrentChange(val){
      this.pageNo = val;
      this.getResultData();
    },
  }
}
</script>

<style scoped>
.header-prompt{
  font-size: 12px;
  color: #AAAAB2;
}
.select-box{
  height: 35px;
}
</style>
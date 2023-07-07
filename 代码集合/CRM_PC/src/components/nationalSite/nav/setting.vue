
<template>
    <div class="js-column">
      <el-button type="primary" @click="editColumns(0)">添加导航</el-button>
      <span class="message">您所添加的导航会在{{substationName}}前台导航进行展示</span>
      <avue-crud 
      @size-change="sizeChange"
      @current-change="currentChange"
      :page.sync="page" 
      :data="columnsList" 
      :option="tableOption" 
      :span-method="spanMethod2">
        <template slot="isTwo" slot-scope="scope">
          <span>{{scope.row.isTwo | childrenName(scope.row.childrenName)}}</span>
        </template>
        <template slot="type" slot-scope="scope">
          <span>{{scope.row.type | columnsType()}}</span>
        </template>
        <template slot="status" slot-scope="scope">
          <el-switch v-model="scope.row.status" :disabled="scope.row.type==4 ||scope.row.type==5||scope.row.type==6" @change="changeStatus(scope.row)" active-color="#13ce66" inactive-color="#ccc" :active-value="0" :inactive-value="1">  </el-switch>
        </template>
        <template slot="secondSort" slot-scope="scope">
          <span v-if="scope.row.isTwo == 0">/</span>
          <span v-else>
            <span>
              <i class="el-icon-sort-down move"  id="down" style="margin-right:10px" @click="handleSecondMove(0, scope.row)" v-if="!(scope.row.childrenIsLast)"></i>
              <i class="el-icon-sort-up move" style="margin-right:10px" id="up" @click="handleSecondMove(1, scope.row)" v-if="!(scope.row.childrenIsFirst)"></i>
            </span>
          </span>
        </template>
        <template slot="menu" slot-scope="scope">
          <span>
            <i class="el-icon-sort-down move"  id="down" style="margin-right:10px" @click="handleMove(0,scope.row)"  v-if="!(scope.row.isLast && lastPage==page.currentPage)&&!(page.currentPage==1&&scope.row.$index==0)" ></i>
            <i class="el-icon-sort-up move" style="margin-right:10px" id="up" @click="handleMove(1,scope.row)" v-if="!(page.currentPage==1&&(scope.row.$index==0||scope.row.$index==1))"></i>
          </span>
          <el-button size="mini" type="text" v-if="scope.row.type!=5&&scope.row.type!=6"  @click="editColumns(1,scope.row.id,scope.row.type)" icon="el-icon-edit" >编辑</el-button>
          <el-button size="mini" type="text" v-if="scope.row.type!=4 &&scope.row.type!=5&&scope.row.type!=6" @click="handleDelete(scope.row)"  icon="el-icon-delete">删除</el-button>    
          <!-- <el-button size="mini" type="text" v-if="scope.row.type!=4 &&scope.row.type!=5&&scope.row.type!=6" @click="handlePower(scope.row)"  icon="el-icon-setting">权限</el-button>           -->
        </template>           
      </avue-crud>
      <!-- 新增、编辑对话框 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" @close="closeForm" :close-on-click-modal='false' width="1120px" center >  
        <columns-form v-if="dialogVisible" @closeForm="closeForm" :syType="syType" :columnId="columnId" :substationId="substationId" :isAdd="isAdd"></columns-form>
      </el-dialog>
      <!-- 权限设置 -->
      <el-dialog title="权限管理" :visible.sync="powerVisible" width="520px" center :close-on-click-modal='false'>  
         <el-form :model="powerInfo" ref="powerInfo" :rules="powerRules">
            <el-form-item label="导航名称：" label-width="100px">
               <span>{{ powerInfo.navName }}</span>
            </el-form-item>
           <div class="power_sty">
              <el-form-item label="权限人：" label-width="100px" prop="powerType">
              <el-radio-group v-model="powerInfo.powerType" @change="changeType">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="powerInfo.powerType == 1" prop="powerMan" label-width="30px">
              <el-cascader 
              :key="iscascaderShow"
              @change="changePowerMan"
              ref="cascader"
              filterable 
              clearable 
              collapse-tags
              :show-all-levels='false' 
              :options="empList" 
              v-model="powerInfo.powerMan" 
              :props="{value: 'customerId',label: 'label',multiple:true}" />
            </el-form-item>
           </div>
           <p class="power_left_sty">说明：指定权限人之前，请先联系管理员配置其菜单权限，确保其可以使用相应菜单</p>
         </el-form>
         <div class="power_btn_sty">
           <el-button size="medium" type="primary" @click="operatePower">确认</el-button>
           <el-button size="medium" class="btn_left_sty" @click="closePower">取消</el-button>
         </div>
      </el-dialog>
    </div>
</template>
<script>
import { tableOption } from "@/const/crud/nationalSite/columns-manage";
import {
  getColumnsList,
  deleteColumn,
  moveColumn,
  changStatus,
  editNavPower,
  moveSecondColumn
} from "@/api/js-wotao-b/columns";
import columnsForm from "@/components/nationalSite/columns";
import * as CodeMsg from "@/api/common/CodeChange"
import { getEmpList } from "@/api/clue/clue";
import { log } from 'mathjs';
export default {
  props:{
    substationName:{
      type: String,
      required: true
    },
    substationId:{
      required: true
    }
  },
  components: {
    columnsForm,
  },
  data() {
    return {
      iscascaderShow:0,
      names:[],
      customerNos:[],
      appoints:[],
      powerInfo: {
        navName: "",
        id:"",
        powerType: 0,
        powerMan: [],
      },
      empList: [],
      powerVisible: false,
      title: "",
      powerRules:{
        powerType:[{ required: true, message: '请选择', trigger: 'blur' }],
        powerMan:[{ required: true, message: '请选择', trigger: 'blur' }]
      },
      dialogVisible: false,
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, // 是否倒序,
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      columnsList: [],
      columnId: null,
      syType: null,
      lastPage: "",
      isAdd: false
    };
  },
  watch:{
    'powerInfo.powerMan':{
      handler(newVal, oldVal){
        // this.powerInfo.powerMan = newVal
        ++this.iscascaderShow
      },
      deep: true,
      immediate: true
    }
  },
  filters: {
    childrenName(val, childrenName) {
      if (val == 1) {
        return childrenName;
      } else {
        return "/";
      }
    },
    columnsType(val) {
      switch (val) {
        case 0:
          return "图文内容";
        case 1:
          return "文章列表";
        case 2:
          return "图文列表";
        case 3:
          return "图片列表";
        default:
          return "/";
      }
    },
  },
  mounted() {
    this.getDropData();
    this.getColumnsList();
  },
  methods: {
    removeTag(val){
      this.powerInfo.powerMan = []
      if(val.length>0){
        val.forEach(item=>{
        this.powerInfo.powerMan.push(item);
        ++this.iscascaderShow
      })
      }
    },
    changePowerMan(val){
      this.customerNos = []
      this.powerInfo.powerMan.forEach(item=>{
        this.customerNos.push(item[item.length-1])
      })
    },
    changeType(val){
      this.$refs['powerInfo'].clearValidate()
      if(val == 0){
        this.customerNos = []
        this.powerInfo.powerMan = []
      }
    },
    operatePower(){
      this.$refs['powerInfo'].validate(valid=>{
        if(valid){
          if (this.customerNos.length > 20) {
            return this.$message({
              type: 'warning',
              message: "人数不超过20，请重新选择"
            })
          }
          let params = {
            id:this.powerInfo.id,
            customerNos:this.customerNos, // customerNo集合
            appoints:this.powerInfo.powerMan,  // 回显集合
            isTwo: this.powerInfo.isTwo,
            substationId: this.substationId,
          }
          editNavPower(params).then(res=>{
             if(res.data.code == CodeMsg.CODE_1000){
               this.$message({
                 type:"success",
                 message:"操作成功！",
                 offset:300
               })
               this.customerNos = []
               this.powerInfo.powerMan = []
               this.powerVisible = false
               this.getColumnsList()
             } else {
                this.$message({
                type: 'error',
                message: res.data.msg
              })
             }
          })
        }
      })
    },
    handlePower(row){
      this.powerInfo.powerMan = []
      if(row.appointType == null||row.appointType == '[]'||row.appointType == ''){
        this.powerInfo.powerType = 0
      }else{
        this.powerInfo.powerType = 1
        this.powerInfo.powerMan = JSON.parse(row.appointType)
        this.customerNos = []
        this.powerInfo.powerMan.forEach(item=>{
        this.customerNos.push(item[item.length-1])
      })
        ++this.iscascaderShow
      }
      this.powerInfo.navName = row.name
      this.powerInfo.id = row.id
      this.powerInfo.isTwo = row.isTwo
      this.powerVisible = true
    },
    getDropData() {
      //去除禁用后的员工
      getEmpList(false).then((res) => {
        this.empList = res.data.data;
      });
    },
    closePower(){
      this.powerVisible = false
      this.powerInfo.powerMan = []
      this.powerInfo.powerType = 0
    },
    getColumnsList() {
      let params = {};
      params.current = this.page.currentPage;
      params.size = this.page.pageSize;
      params.substationId = this.substationId
      getColumnsList(params).then((res) => {
        this.columnsList = [];
        this.page.total = res.data.data.total;
        if (Number(this.page.total) % Number(this.pageSize) === 0) {
          this.lastPage = Number(this.page.total) / Number(this.page.pageSize);
        } else {
          this.lastPage =
            parseInt(Number(this.page.total) / Number(this.page.pageSize)) + 1;
        }
        res.data.data.records.forEach((item, index) => {
          if (item.isTwo == 1) {
           if(item.childrenColumnVoList.length==0){
            let childList = {
                sort: item.sort,
                // itemId:item.id,//若用id,合并单元格时前端渲染报错
                name: item.name,
                isTwo: 0,
                size: item.childrenColumnVoList.length,
                childrenName: '',
                type: 0,
                createTime: item.createTime,
                status: item.status,
                permissionName: item.permissionName,
                number: index+1,
                childrenId: null,
                childrenSort: null,
                childrenIsTwo: null,
                childrenIsFirst: false,
                childrenIsLast: false,
              };
              if (index == item.length - 1) childList.isLast = true;
                this.columnsList.push(childList);
           }else{
             item.childrenColumnVoList.forEach((child, i) => {
              let childList = {
                sort: item.sort,
                // itemId:item.id,//若用id,合并单元格时前端渲染报错
                name: item.name,
                isTwo: item.isTwo,
                size: item.childrenColumnVoList.length,
                childrenName: child.name,
                type: child.type,
                createTime: item.createTime,
                status: item.status,
                permissionName: item.permissionName,
                childrenId: child.id,
                childrenSort: child.sort,
                childrenIsTwo: child.isTwo,
                childrenIsFirst: false,
                childrenIsLast: false,
              };
              child.index = i
              if(i == item.childrenColumnVoList.length-1) childList.childrenIsLast = true;
              if(i == 0) childList.childrenIsFirst = true;

              if (index == item.length - 1) childList.isLast = true;
              if (i == 0) {
                this.columnsList.push(
                  Object.assign(
                    { itemIndex: 0, id: item.id, number: index + 1 },
                    childList
                  )
                );
              } else {
                this.columnsList.push(childList);
              }
            });
           }
          } else {
            this.columnsList.push(item);
            item.number = index + 1;
            if (index == Number(res.data.data.total) - 1) {
              item.isLast = true;
            }
          }
        });
        this.columnsList[this.columnsList.length - 1].isLast = true;
      });
    },
    closeForm() {
      this.columnId = null;
      this.dialogVisible = false;
      this.getColumnsList();
    },
    //列表操作
    changeStatus(row) {
      //0-显示；1-不显示
      let params = {
        id: row.id,
        status: row.status == 0 ? 0 : 1,
        substationId: this.substationId,
      };
      changStatus(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            message: "状态修改成功",
            type: "success",
            offset: 300,
          });
        }
        this.getColumnsList();
      });
    },
    handleMove(type, row) {
      //0-下移；1-上移
      let params = {
        sort: row.sort,
        moveToken: type,
        id: row.id,
        substationId: this.substationId,
      };
      moveColumn(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          if (type == 0) {
            this.$message({
              type: 'success',
              message: '下移成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: '上移成功'
            })
          }
          this.getColumnsList();
        }
      });
    },
    handleDelete(row) {
      this.$confirm(`确定删除${row.name}栏目？`, "提示", {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        deleteColumn(row.id).then((res) => {
          if ((res.data.code = 1000)) {
            this.$message({
              message: "删除成功",
              type: "success",
              offset: 300,
            });
            this.getColumnsList();
          }
        });
      });
    },
    editColumns(number, id, type) {
      this.dialogVisible = true;
      if (number === 0) {
        this.isAdd = true
        this.title = "添加栏目";
      } else {
        this.isAdd = false
        this.title = "编辑栏目";
        this.columnId = id;
        this.syType = type;
      }
    },
    //合并行列
    spanMethod2({ row, column, rowIndex, columnIndex }) {
      if (
        (columnIndex === 0 && row.size) ||
        (columnIndex === 1 && row.size) ||
        (columnIndex === 4 && row.size) ||
        (columnIndex === 5 && row.size) ||
        (columnIndex === 7 && row.size)
      ) {
        if (row.itemIndex === 0) {
          return {
            rowspan: row.size,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    handleSecondMove(type, row){
      //  0-下移；1-上移
      let params = {
        sort: row.childrenSort,
        moveToken: type,
        id: row.childrenId,
        substationId: this.substationId,
        isTwo: row.childrenIsTwo
      };
      moveSecondColumn(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_1000) {
          if (type == 0) {
            this.$message({
              type: 'success',
              message: '下移成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: '上移成功'
            })
          }
          this.getColumnsList();
        }
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getColumnsList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getColumnsList();
    },
  },
};
</script>

<style scoped>
.js-column {
  width: 99%;
  margin: 0px 0 0 15px;
  background: #fff;
}
.move {
  font-size: 20px;
  cursor: pointer;
  color: #409eff;
}
.message {
  margin-left: 20px;
  letter-spacing: 1.3px;
  font-size: 14px;
  color: #999;
}
.power_sty {
  display: flex;
}
.power_left_sty{
  margin-left: 20px;
}
.power_btn_sty{
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn_left_sty{
  margin-left: 60px;
}
.over_sty_power{
  display: inline-block;
  width: 260px;
  height: 16px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tool-class{
  max-width: 280px !important;
  line-height: 20px;
}
</style>

<template>
  <div>
    <el-form :model="rankSearchForm" inline class="form-rank" @keyup.enter.native="getRankList()">
      <el-radio-group v-model="categoryId" @change="page.currentPage = 1; getRankList()">
        <el-radio-button class="rank-category-btn" :class="item.number > 0 ? 'border-left':''" v-for="item in rankCategoryList" :key="item.number" :label="item.number">{{item.name}}</el-radio-button>
      </el-radio-group>
      <el-form-item label="搜索：">
        <el-input placeholder="请输入职级名称/创建人" v-model="rankSearchForm.keyWords" >
          <el-button slot="append" icon="el-icon-search" @click="page.currentPage = 1; getRankList()"></el-button>
        </el-input>
      </el-form-item>
      <div class="rank-add-btn">
        <el-button size="mini" type="primary" @click="operateRank()">新建职级</el-button>
      </div>
    </el-form>

    <el-popconfirm
      :key="'rank'+Date.now()"
      confirm-button-text='确定'
      cancel-button-text='取消'
      icon="el-icon-info"
      icon-color="red"
      @confirm="batchDelRank({ids:rankIds})"
      title="确定删除所选职级吗？"
    >
      <el-button size="mini" type="primary" slot="reference" :disabled="rankIds.length == 0">批量删除</el-button>
    </el-popconfirm>
    <el-table :data="rankList" border @selection-change="selcetRanks" :row-key="(row)=>{return row.id}" class="rank-table">
      <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" ></el-table-column>
      <el-table-column label="职位级别" align="center" width="200px">
        <template slot-scope="{row,$index}">
          <div class="rank-level">
            <p class="rank-name">{{row.rankLevel}}</p>
            <div class="icon-location" :class="$index == 0 || $index == rankList.length-1 ? 'top-or-bottom':''">
              <p v-if="$index != 0" ><i class="el-icon-caret-top change-location" @click="moveLocation(row, 1)"></i></p>
              <p v-if="$index != rankList.length-1"><i class="el-icon-caret-bottom change-location" @click="moveLocation(row, 2)"></i></p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="职级描述" >
        <template slot-scope="{row}">
          <span>{{row.description || '/'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用人数" prop="usedSysUserCounts" width="100px" align="center">
        <template slot-scope="{row}">
          <span class="user-count" @click="getRankUsedSysUserDetail(row)" >{{row.usedSysUserCounts}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="150px">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="'工号：'+ empNo +'   部门：'+ deptName" placement="top">
            <span @mouseover="showUserInfo(row.createBy)">{{ row.createByName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{row}">
          <el-button type="text" @click="editRank(row)">编辑</el-button>
          <el-popconfirm
            :key="Date.now()"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            @confirm="batchDelRank({ids:[row.id]})"
            title="确定删除该职级吗？"
          >
          <el-button type="text" slot="reference" class="rank-del-btn" v-if="row.usedSysUserCounts == 0">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        background
        :page-sizes="[1, 5, 10, 20, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

    <!-- 新增/编辑职级 -->
    <el-dialog :visible.sync="addRankDialog" :close-on-click-modal="false" :title="rankTitle" width="620px">
      <el-form v-if="addRankDialog" :model="rankForm" ref="rankForm" :rules="rankRules" inline class="rank-operate">
        <el-form-item label="职级类型：" prop="category">
          <el-select v-model="rankForm.category" placeholder="请选择职级类型" :disabled="rankForm.id > 0">
            <el-option 
              v-for="item in rankCategoryList"
              :key="item.number"
              :value="item.number"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职级描述：">
          <el-input placeholder="请输入职级描述" maxlength="20" v-model.trim="rankForm.description" />
        </el-form-item>
        <el-form-item label="职位级别：" prop="rankLevel">
          <el-input placeholder="请输入英文+数字的格式,如P1-1" maxlength="15" v-model.trim="rankForm.rankLevel" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="footer-rank">
        <el-button type="primary" size="mini" @click="confirmAddRank()" v-if="!rankForm.id">创建</el-button>
        <el-button type="primary" size="mini" @click="confirmEditRank()" v-if="rankForm.id">确定</el-button>
      </div>
    </el-dialog>
    
    <!-- 使用人 -->
    <el-dialog :visible.sync="userDialog" :close-on-click-modal="false" width="600px" title="职级使用人">
      <div class="user-list">
        <p v-for="item in userList" :key="item.number">{{item.name}}-{{item.number}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRankCategoryList, getRankListOfCategory, addRank, editRank, delRank, priorityChange, rankUserList} from "@/api/staff/index";
export default {
  data(){
    return {
      categoryId: 0,
      addRankDialog: false,
      userDialog: false,
      rankSearchForm: {},
      rankForm: {},
      rankCategoryList: [],
      rankList: [],
      userList: [],
      rankIds: [],
      rankTitle:'',
      rankRules:{
        category:[{required: true, message:'请选择职级类型',trigger:'change'}],
        rankLevel:[{required: true, message:'请输入职位级别'}]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
      },
    }
  },
  mounted(){
    this.getRankCategory();
    this.getRankList();
  },
  methods:{
    getRankUsedSysUserDetail(row){
      rankUserList(row.id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.userList = res.data.data;
          if(this.userList.length> 0){
            this.userDialog = true;
          }
        }
      })
    },
    moveLocation(row, type){
      priorityChange({category: row.category, currentId: row.id, type: type}).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'移动成功！'
          })
          this.getRankList();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },
    selcetRanks(row){
      this.rankIds = [];
      row.forEach( el => {
        this.rankIds.push(el.id);
      });
    },
    selectable(row){
      return row.usedSysUserCounts == 0;
    },
    editRank(row){
      this.rankForm = JSON.parse(JSON.stringify(row));
      this.rankTitle = '编辑职级';
      this.addRankDialog = true;
    },
    confirmAddRank(){
      let param = {
        category: this.rankForm.category,
        description: this.rankForm.description,
        rankLevel: this.rankForm.rankLevel
      }
      this.$refs.rankForm.validate(valid=>{
        if(valid){
          addRank(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message:'职级添加成功！'
              })
              this.addRankDialog = false;
              this.rankForm = {};
              this.$refs.rankForm.clearValidate();
              this.getRankList();
            }else{
              this.$message({
                type:'warning',
                message: res.data.msg
              })
            }
          })
        }else{
          return false;
        }
      })
    },

    confirmEditRank(){
      let param  = {
        description: this.rankForm.description,
        rankId: this.rankForm.id,
        rankLevel: this.rankForm.rankLevel
      }
      this.$refs.rankForm.validate(valid=>{
        if(valid){
          editRank(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type:'success',
                message:'职级修改成功！'
              })
              this.addRankDialog = false;
              this.rankForm = {};
              this.$refs.rankForm.clearValidate();
              this.getRankList();
            }else{
              this.$message({
                type:'warning',
                message: res.data.msg
              })
            }
          })
        }else{
          return false;
        }
      })
    },

    batchDelRank(row){
      let param = {
        ids: row.ids.join(',')
      }
      delRank(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'删除成功！'
          })
          this.getRankList();
        }else{
          this.$message({
            type:'warning',
            message: res.data.msg
          })
        }
      })
    },

    operateRank(){
      this.rankTitle = '新增职级';
      this.addRankDialog = true;
      this.rankForm = {};
    },
    getRankCategory(){
      getRankCategoryList().then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.rankCategoryList = res.data.data;
        }
      })
    },
    getRankList(){
      let param = {
        category: this.categoryId,
        current: this.page.currentPage,
        size: this.page.pageSize,
        rankLevelOrCreateByName: this.rankSearchForm.keyWords
      }
      getRankListOfCategory(param).then( res=>{
        this.rankList = res.data.data.records;
        this.page.total = res.data.data.total;
      })
    },
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getRankList();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getRankList();
    },
  }
}
</script>

<style scoped>
  .rank-category-btn{
    margin-right: 20px;
  }
  .border-left{
    border-left: 1px solid #DCDFE6;
  }
  .rank-operate >>> .el-input__inner{
    width: 190px;
  }
  .footer-rank{
    padding-top: 10px;
    border-top: 1px solid #DCDFE6;
  }
  .rank-del-btn{
    margin-left: 10px;
    color: red;
  }
  .rank-level{
    display: flex;
  }
  .icon-location{
    /* display: inline-block; */
    /* margin-top: 10px; */
    margin-left: 5px;
  }
  .icon-location p{
    margin: 0;
    height: 16px;
  }
  .change-location{
    font-size: 16px;
    cursor: pointer;
    color: #36a6fe;
  }
  .top-or-bottom{
    margin-top: 10px !important;
  }
  .form-rank{
    position: relative;
  }
  .rank-add-btn{
    position: absolute;
    right: 20px;
    top: 0;
  }
  .rank-table{
    margin: 20px 0;
  }
  .rank-name{
    line-height: 16px;
  }
  .user-list{
    display: grid;
    grid-template-columns: repeat(4,1fr);
  }
  .user-count{
    color: #36a6fe;
    cursor: pointer;
  }
</style>
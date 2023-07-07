<template>
  <div class="capture_edit">
    <div>
      <div class="tab">
        <p class="choose_type">选择编辑发布类型</p>
        <div style="background:#EEEEEE;width:150px;padding:5px 1px;">
          <p class="model" v-for="item in modelList" :key="item.type" @click="selectType(item.type)" :class="articleType == item.type ? 'selected_type':''">{{item.name}}</p>
        </div>
      </div>
    </div>
    <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章详情" name="first">
        <edit-detail :articleType="articleType" v-if="activeName == 'first' && show"/>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="second">
        <div v-if="activeName == 'second'" style="min-height:760px">
          <el-table :data="editRecordsList">
            <el-table-column :label="editRecordsList.length>0 ? editRecordsList[0].title : ''" align="center">
              <el-table-column label="操作时间" prop="createTime"></el-table-column>
              <el-table-column label="操作人">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" :content="'工号：'+scope.row.number +'   部门：'+scope.row.deptName" placement="top">
                    <span>{{scope.row.createName}}({{scope.row.number}})</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="操作内容" prop="type">
              </el-table-column>
            </el-table-column>
          </el-table>
          <div style="text-align:right;">
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
        </div>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
import editDetail from './edit-detail.vue'
import { editRecords } from '@/api/capture-data/index'
export default {
  components: {
    editDetail
  },
  data(){
    return {
      modelList:[
        {
          name:'通知公告',
          type: 0
        },
        {
          name:'政策汇编',
          type: 1
        },
        {
          name:'疑难解答',
          type: 3
        },
        {
          name:'行业资讯',
          type: 10
        },
      ],
      activeName: 'first',
      articleType: 0,
      show: true,
      editRecordsList:[],
      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },

  mounted(){
    this.getRecords();
    sessionStorage.setItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value,JSON.stringify({
        page: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).page,
        screening: JSON.parse(sessionStorage.getItem(JSON.parse(sessionStorage.getItem('pigx-tag')).content.value)).screening,//表单筛选信息
        ID: JSON.parse(sessionStorage.getItem('pigx-tag')).content.label,//页面标识
        detail:{query:this.$route.query,path:this.$route.path}
      })
    );//保存页面信息
  },
  methods:{
    getRecords(){
      let param = {
        size: this.pageSize,
        start: this.currentPage,
        id: this.$route.query.number
      }
      editRecords(param).then(res=>{
        this.editRecordsList = res.data.data.list;
        this.total = res.data.data.total;
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getRecords();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getRecords();
    },
    selectType(type){
      this.show = false;
      this.activeName = 'first';
      this.$nextTick(()=>{
        this.articleType = type;
        this.show = true;
      })
    }
  }
}
</script>

<style scoped>
.capture_edit{
  background: #FFFFFF;
  margin-bottom: 0;
  min-width: 1020px;
  padding: 10px;
  display: grid;
  grid-template-columns: 180px 88%;
}
.choose_type{
  background: #999999;
  width: 150px;
  padding: 10px 0;
  font-size: 16px;
  text-align: center;
  margin: 0;
}
.model{
  width: 150px;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #DCDCDC;
  cursor: pointer;
}
.selected_type{
  color: #1f61db;
}
.tab{
  position:fixed;
}
</style>
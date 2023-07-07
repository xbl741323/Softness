<template>
  <div class="hot_set">
    <p class="hot_title">政策类详情热点设置</p>
    <p class="hot_instructions">说明：热点文章按发布时间倒序排列</p>
    <div class="click_quantity">
      <div class="name">
        点击量：
      </div>
      <div class="content">
        <span>点击量达到<span class="click_num">{{count}}</span>时归为热点文章</span>
        <el-button size="mini" class="change_btn" @click="changClick()">修改</el-button>
      </div>
    </div>
    <el-table :data="tableData" border >
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="板块名称" prop="name"></el-table-column>
      <el-table-column label="显示篇数">
        <template slot-scope="scope">
          <el-select v-model="scope.row.count" @change="changeShowCount(scope.row)">
            <el-option 
              v-for="(item,index) in countList"
              :key="index"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template style="display: flex;text-algin:center;" slot-scope="scope">
          <p class="el-icon-bottom bottom" v-show="scope.row.locationId != tableData.length-1" @click="move(scope.row,0)"></p>
          <p class="el-icon-top top" v-show="scope.row.locationId != 0" @click="move(scope.row,1)"></p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="changeDialog" title="修改点击量" :close-on-click-modal='false' @close="close()">
      <template>
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="点击量达到" prop="count">
            <el-input v-model="form.count" style="width:200px;" />
            <span>时归为热点文章</span>
          </el-form-item>
          <p style="color:#999">请输入100以上的整数</p>
        </el-form>
      </template>
      <div style="text-align:center;">
        <el-button size="mini" type="primary" @click="submit()">确定</el-button>
        <el-button size="mini" type="warning" @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { getHotList, changeHotCount, changeCount, moveLocation} from '@/api/js-wotao-b/columns.js'
export default {
  data(){
    return {
      tableData: [],
      count: 0,
      countList: [],
      changeDialog: false,
      form: {
        count: 0
      },
      rules:{
        count:[{required: true,pattern:/^[1-9]\d{2,}$/ ,message:'请输入大于100的整数',trigger: 'blur'}]
      }
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(){
      this.countList = [];
      for(var i = 1; i<=20; i++){
        let para = {
          value: i,
          label: i+''
        };
        this.countList.push(para);
      }
      getHotList(1).then(res=>{
        res.data.data.list.forEach((item, index) => {
          this.$set(item,'locationId',index);
        });
        this.tableData = res.data.data.list;
        this.count = res.data.data.hotcount;
      })
    },
    changClick(){
      this.form.count = this.count;
      this.changeDialog = true;
    },
    cancel(){
      this.changeDialog = false;
      this.getList();
    },
    close(){
      this.getList();
    },
    submit(){
      let param = {
        hotCount : this.form.count,
        substationId: 1,
      }
      this.$refs.form.validate(valid=>{
        if(valid){
          changeHotCount(param).then(res=>{
            if(res.data.code == CodeMsg.CODE_1000){
              this.$message({
                type:'success',
                message:'修改成功！'
              })
            }
            this.changeDialog = false;
            this.getList();
          })
        }else{
          return false;
        }
      })
    },
    changStatus(row){
      let param ={
        id: row.id,
        status: row.status == true ? 1 : 0,
        substationId: 1,
      }
      changeCount(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          this.$message({
            type:'success',
            message:'修改成功！'
          })
        }
        this.getList();
      })
    },
    changeShowCount(row){
      let param ={
        id: row.id,
        count: row.count,
        substationId: 1,
      }
      changeCount(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          this.$message({
            type:'success',
            message:'修改成功！'
          })
        }
        this.getList();
      })
    },
    move(row,type){
      let param = {
        id: row.id,
        moveToken: type,
        sort: row.sort,
        substationId: 1,
      };
      moveLocation(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_1000){
          this.$message({
            type:"success",
            message: '操作成功！'
          })
        }
        this.getList();
      })
    }
  }
}
</script>

<style scoped>
.hot_set{
  height: 100%;
  background: #FFF;
  padding: 10px;
}
.hot_title{
  padding-left: 5px;
  border-left: 4px #3e63c7 solid;
  font-size: 16px;
  font-weight: 550;
}
.click_quantity{
  display: grid;
  grid-template-columns: 10% 90%;
  border: 1px #EBEEF5 solid;
  margin: 10px 0;
}
.hot_instructions{
  font-size: 12px;
}
.name{
  text-align: right;
  line-height: 25px;
  padding: 5px;
  border-right: 1px #EBEEF5 solid;
}
.click_num{
  color: #3e63c7;
}
.content{
  line-height: 25px;
  padding: 5px;
}
.change_btn{
  margin-left: 10px;
}
.bottom{
  margin-right: 20px;
  font-size: 16px;
  cursor: pointer;
}
.top{
  font-size: 16px;
  cursor: pointer;
}
</style>
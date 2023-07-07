<template>
<!-- 排查完成 -->
  <div class="template-frame">
    <el-form :model="templateForm" ref="templateForm" :rules="rules" label-width="120px" class="template-box">
      <div class="text-sty">合同模板：{{$route.query.name}}合同模板</div>
      <el-form-item label="参数映射关系：" prop="tableData">
        <div class="wid">
          新增/编辑的合同模板需要生成映射关系，否则不生效
          <el-button type="primary" class="update_btn" @click="updateTemplateControl()">更新映射</el-button>
        </div>
        <el-table :data="templateForm.tableData" border class="table_sty" :row-style="{height:'0'}" :cell-style="{padding:'15px'}">
          <el-table-column label="名称" prop="templateComponentName" align="center"></el-table-column>
          <el-table-column label="映射" prop="templateComponentId" align="center">
            <template slot-scope="scope">
                <el-select size="mini" v-model="scope.row.templateParamId" placeholder="请选择映射" clearable style="font-size:13px">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.componentDesc"
                    :value="item.id">
                  </el-option>
                </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="template-add-btn">
      <el-button type="primary" @click="saveMapping()" :disabled="isDisabled">保 存</el-button>
      <el-button @click="cancel()">取 消</el-button>
    </div>

  </div>
</template>

<script>
import { getTemplateWidget, getParamsList, saveMapping, updateTemplateControl} from '@/api/contracts/contracts'
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  data(){
    return {
      templateForm: {
        tableData: [],
        templateParamId:[]
      },
      componentList: [],
      list: [],
      editStatus: false,
      templateFile: [],
      templateStatus: false,
      options: [],
      isDisabled: false
    }
  },
  mounted(){
    if(this.$route.query.templateId){
      this.getTemplateWidget(this.$route.query.templateId);
    };
    this.getParamsList()
  },
  methods:{
    cancel(){
      history.go(-1);
    },
    getFileList(val){//获取上传的文件
      this.$set(this.templateForm,'file',val[0] || false);
    },
    // 根据模板Id获取控件
    getTemplateWidget(id){
        getTemplateWidget({myTemplateId: id}).then( res => {
          if(res.data.code == CodeMsg.CODE_0){
            this.templateForm.tableData= res.data.data
          }
        })
    },
    // 获取参数列表
    getParamsList(){
      getParamsList().then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.options = res.data.data
        }
      })
    },
    // 更新模板控件信息 
    updateTemplateControl(){
      updateTemplateControl({id: this.$route.query.templateId}).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          if(res.data.data == true){
             this.$message({
              message: '更新映射成功！',
              type: 'success',
              offset:300,
              duration: 2000
            });
            this.getTemplateWidget(this.$route.query.templateId)
            this.getParamsList()
            this.isDisabled = false
          }
        }else{
            this.$message({
              message: '更新映射失败！',
              type: 'warning',
              offset:300,
              duration: 2000
            });
            this.isDisabled = true
          }
      })
    },
    // 保存控件与参数的映射关系 
    saveMapping(){
      let arr = JSON.parse(JSON.stringify(this.templateForm.tableData))
      arr.forEach(item=>{
        delete item.componentDesc
        delete item.templateComponentName
      })
      saveMapping(arr).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          if(res.data.data == true){
            this.$message({
              message: '保存成功！',
              type: 'success',
              offset:300,
              duration: 2000
            });
          }
        }else{
          this.$message({
            message: '保存失败！',
            type: 'warning',
            offset:300,
            duration: 2000
          });
        }
        this.$router.push('/contracts/contracts-template')
      })
    },
  }
}
</script>

<style scoped>
.template-frame{
  min-height: 100%;
  padding: 20px;
  background: #FFFFFF;
}
.template-add-btn{
  text-align: center;
  margin: 30px;
}
.control-btn{
  text-align: center;
}
.template-require {
  color: #666666;
}
.template-box {
  font-size: 16px !important;
}
.template-box .wid {
  width: 800px;
  margin-bottom: 15px;
  color: #666666;
}
.template-box .update_btn {
  float: right;
}
.template-box .table_sty {
  width: 800px;
  font-size: 13px;
}
.template-box .text-sty {
  font-size: 14px;
  color: #606266;
  padding-left: 10px;
  margin-bottom: 5px;
}

</style>
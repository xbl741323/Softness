<template>
  <div>
    <!-- 文件替换 -->
    <el-dialog :visible.sync='replaceDialog' title="替换文件" width="450px" :close-on-click-modal="false" @close="closeResourceDialog()">
        <span>请选择新文件的来源：</span>
        <template>
        <el-radio-group v-model="sourceFile">
            <el-radio :label="0">文件库</el-radio>
            <el-radio :label="1">本地文件</el-radio>
        </el-radio-group>
        </template>
        <div class="dialogBtn">
        <el-button size="mini" type="primary" @click='next()'>下一步</el-button>
        <el-button size="mini" type="warning" @click="closeResourceDialog()">{{$t('button.cancel')}}</el-button>
        </div>
    </el-dialog>
    <!-- 文件库替换 -->
    <el-dialog :visible.sync='libraryDialog' title="替换文件" :close-on-click-modal="false">
        <span>请选择文件</span>
        <el-input placeholder="请输入目标文件编号或文件名称关键字" style="width:260px;margin:0 20px" v-model="fileKeywords" />
        <el-button  @click="next()">搜索</el-button>
        <el-table border :data="libraryList" class="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="radio()" ></el-table-column>
        <el-table-column label="文件编号" prop="number"></el-table-column>
        <el-table-column label="文件名称" prop="name"></el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next, total"
            @current-change="replaceCurrentChange"
            :page-size="20"
            :total='total'
        ></el-pagination>
        <div class="dialogBtn">
        <el-button size="mini" type="primary" @click='libraryDialog = false'>上一步</el-button>
        <el-button size="mini" type="primary" @click="replaceFile()">{{$t('button.confirm')}}</el-button>
        <el-button size="mini" type="warning" @click="libraryDialog = false">{{$t('button.cancel')}}</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import {getLibraryList} from "@/api/policy/list";
export default {
    props:['display'],
    data(){
        return{
            currentPage:0,
            pageSize:20,
            total:0,
            libraryDialog: false,
            replaceDialog:true,
            sourceFile:0,
            libraryList:[],
            fileKeywords:''
        }
    },
    methods:{
        closeResourceDialog(){
            this.$emit('closeDialog',false);
        },
        radio(row){

        },
        handleSelectionChange(row){
            
        },
        replaceCurrentChange(val){
            this.currentPage = val;
            this.next();
        },
        replaceFile(){

        },
        next(){//文件库替换列表
            if(this.sourceFile == 0){
                this.libraryDialog = true;
                let para = {
                size:20,
                start:this.currentPage,
                keyword: this.fileKeywords.trim()
                }
                getLibraryList(para).then(res=>{
                if(res.data.code == CodeMsg.CODE_1000){
                    var a = res.data.data.list;
                    for(let i = 0; i <a.length; i++){
                    a[i].able = true;
                    }
                    this.libraryList = a;
                    this.replace.total = res.data.data.total;
                }
                }).catch(()=>{
                return false;
                })
            }else{

            }
        },
    }
}
</script>

<style scoped>
.dialogBtn {
  margin-top: 40px;
  text-align: center;
}
.table {
  margin-top: 10px;
}
</style>
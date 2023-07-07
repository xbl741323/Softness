<template>
    <div class="frame">
        <div style="border-bottom:1px solid #36A6FE"></div>
        <p class="span_sty">热门词汇设置</p>
        <p>说明:</p>
        <p>1.热门关键词展示在前台搜索框下方，用户点击该词汇可直接进行对应词汇的搜索；</p>
        <p>2.热门关键词限制在2-6个字；</p>
        <p>3.同一位置下关键词不可重复，不同位置的关键词不受此限制。</p>
        <avue-crud
            ref="crud"
            :data="list"
            :option="tableOption"
            @selection-change="selectionChange"
            @on-load="getList"
            :cell-style='cell'
            :span-method="spanMethod"
        >
        <template slot="keyword" slot-scope="scope" class="add">
            <span class="edit_table" @click="editContent(scope.row)" v-if="scope.row.location ==null" @mouseover="showBorder(scope.row)" >{{scope.row.keyword}}</span>
            <span class="keyword_sty" @click="editContent(scope.row)" v-if="scope.row.location == 2" @mouseleave="clear(scope.row)">{{scope.row.keyword}}
                <el-button class="btn" icon="el-icon-edit" v-if="scope.row.location == 2" @click="editContent(scope.row)"></el-button>
            </span>
            <input type="text" class="edit_box" minlength="2" maxlength="6" v-model="scope.row.keyword" v-focus v-if="scope.row.location == 1" @blur="cancle(scope.row)" >
            <el-button icon="el-icon-check" v-if="scope.row.location == 1" :disabled="scope.row.keyword.length<2" @click="saveKeyWords(scope.row)"></el-button>
            <el-button icon="el-icon-close" v-if="scope.row.location == 1" @click="cancle(scope.row)"></el-button>
            <el-button
                v-if="scope.row.location==null && scope.row.$index%5 !==0"
                type="text"
                size="small"
                icon="el-icon-top"
                @click="changeLocation(scope.row,0)"
            >{{$t('button.moveUp')}}</el-button>
            <el-button
                v-if="scope.row.location==null && (scope.row.$index+1)%5 !==0"
                type="text"
                size="small"
                icon="el-icon-bottom"
                @click="changeLocation(scope.row,1)"
            >{{$t('button.moveDown')}}</el-button>
        </template>
        <template slot="status" slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changeSwitch(scope.row)"></el-switch>
        </template>
        </avue-crud>
    </div>
</template>

<script>
import { tableOption} from "@/const/crud/siteSettings/hotSearch";
import * as CodeMsg from "@/api/common/CodeChange"
import { getHotList,change,move} from '@/api/siteSettings/hotSearch'
export default {
    data(){
        return{
            tableOption:tableOption,
            list:[],
            show:true,
            transferKeyword:''
        }
    },
    //input自动聚焦
    directives:{
        focus:{
            inserted:function(el){
                el.focus();
            }
        }
    },
    methods:{
        cell({ row, column, rowIndex, columnIndex }){
            return {
                background:'#FFF'
            }
        },
        showBorder(val){
            val.location = 2;
        },
        clear(val){
            val.location = null;
        },
        //保存关键词
        saveKeyWords(val){
            var param = {
                id :val.id,
                keyword:val.keyword,
                type:val.type
            }
            this.changeStatus(param)
        },
        cancle(val){
            //防止失焦在click前触发
            setTimeout(()=>{
                val.keyword = this.transferKeyword;
                val.location = null;
            },200)
        },
        editContent(val){
            setTimeout(()=>{
                this.transferKeyword = val.keyword;
                val.location = 1;
            },300);
        },
        changeSwitch(val){
            if(val.status==true){
                var status = 1;
            }else{
                var status = 2;
            }
            var param={
                id:val.id,
                showStatus:status,
                type:val.type
            }
            this.changeStatus(param)
        },
        changeLocation(val,num){
            var param = {
                id:val.id,
                moveToken:num,
                sort:val.sort,
                type:val.type
            }
            move(param).then(res=>{
                this.$message({
                    type:'success',
                    message:this.$t('button.modifySuccess')
                })
                this.getList();
            }).catch(err=>{
                console.log(err);
            })
        },
        changeStatus(val){
            change(val).then(res=>{
                if(res.data.code == CodeMsg.CODE_1000){
                    this.$message({
                        type:'success',
                        message:this.$t('button.modifySuccess')
                    })
                    this.getList();
                }else{
                    this.$message({
                        type:'warning',
                        message:res.data.data
                    })
                    this.getList();
                }
            })
        },
        getList(){
            getHotList().then(res=>{
                this.list = res.data.data;
            }).catch(()=>{

            })
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 5 === 0) {
                    return {
                    rowspan: 5,
                    colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        selectionChange(val){

        },
        currentChange(val){

        },
    },
    mounted(){

    }
}
</script>

<style scoped>
    .frame{
        background:#FFF;
        font-size:14px;
    }
    .span_sty{
        padding-left:5px;
        border-left:3px solid #36A6FE;
    }
    .edit_table{
        width:150px;
        height:25px;
        padding:5px 20px;
    }
    .keyword_sty{
        border-top:1px solid #ddd;
        border-left:1px solid #ddd;
        border-bottom:1px solid #ddd;
        padding:8px 15px;
    }
    .edit_box{
        width:150px;
        margin-right:10px;
        border:1px solid #eee;
        padding:7px 15px;
    }
    .btn{
        margin-left:20px;
        margin-right:-30px;
    }
</style>
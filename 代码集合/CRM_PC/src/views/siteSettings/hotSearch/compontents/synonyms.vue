<template>
    <div class="synonyms">
        <span class="titlebtn">同义词设置</span>
        <p>说明:一些简写词或其他用户可能使用的词，在用户输入的词汇进行搜索时，即搜索对应的目标词。</p>
        <el-button size="mini" @click="openDialog()" class="addbtn">添加目标词</el-button>
        <el-table :data="dataList" border :span-method="spanMethod" :cell-style='cell' :header-cell-style="{'background':'#fafafa','text-align':'center'}"  style="width:900px;">
            <el-table-column prop="targetWords" label="目标词" ></el-table-column>
            <el-table-column prop="synonymWords" label="同义词" >
                 <template slot-scope="scope">
                    <span class="edit_table"  @click="editContent(scope.row)" v-if="scope.row.options == null" @mouseover="showBorder(scope.row)" >{{scope.row.synonymWords}}</span>
                    <span class="keyword_sty"  @click="editContent(scope.row)" v-if="scope.row.options == 2" @mouseleave="clear(scope.row)">{{scope.row.synonymWords}}
                        <el-button class="btn" icon="el-icon-edit" v-if="scope.row.options == 2" @click="editContent(scope.row)"></el-button>
                    </span>
                    <input type="text" class="edit_box" minlength="3" maxlength="6" v-model="scope.row.synonymWords" v-focus v-if="scope.row.options == 1" @blur="cancle(scope.row)" >
                    <el-button icon="el-icon-check" v-if="scope.row.options == 1" :disabled="scope.row.synonymWords.length<1" @click="saveSynonym(scope.row)"></el-button>
                    <el-button icon="el-icon-close" v-if="scope.row.options == 1" @click="cancle(scope.row)"></el-button>
                    <el-button icon="el-icon-delete" style="margin-left:20px;" type="text"  @click="deleteSynonym(scope.row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作"> 
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="confirm(3,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加目标词 -->
        <el-dialog title="添加目标词" :visible.sync='addDialog' :close-on-click-modal="false" width="600px">
            <el-form :model="synonymsForm" ref="synonymsForm" :rules="rules"  v-if="addDialog">
                <el-form-item label="目标词:" prop="words" >
                    <el-input v-model="synonymsForm.words" style="width:200px"></el-input>
                </el-form-item>
                    <div v-for="(item, index) in synonymsForm.synonymList" :key="index">
                        <div style="display: flex; align-items: center">
                            <el-form-item
                                style="flex: 1"
                                :prop="'synonymList.' + index + '.itemData'"
                            >
                                同义词{{index+1}}：
                                <el-input id="index" v-model="item.words" style="width:200px;margin-right:10px;"></el-input>
                                <el-button @click="deleteItem(index)" type="danger" v-if="index !== 0" size="mini">删除本条</el-button>
                            </el-form-item> 
                        </div>
                    </div>
                    <el-form-item label="" prop="add">
                        <el-button @click="addInput()" size="small" type="primary">新增</el-button>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm(0)" v-preventReClick>确 定</el-button>
                <el-button @click="closeDialog()">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 编辑目标词 -->
        <el-dialog title="编辑" :visible.sync='editDialog' :close-on-click-modal="false" width="600px">
            <el-form :model="editForm" ref="editForm" :rules="editRules" >
                <el-form-item label="目标词:" prop="words" >
                    <el-input v-model="editForm.words" style="width:200px"></el-input>
                </el-form-item>
                    <div v-for="(item, index) in editForm.synonymList" :key="index">
                        <div style="display: flex; align-items: center">
                        <el-form-item
                            style="flex: 1"
                            :prop="'synonymList.' + index + '.words'"
                        >
                            同义词{{index+1}}：
                            <el-input id="index" v-model="item.words" style="width:200px;margin-right:10px;"></el-input>
                            <el-button @click="deleteEditItem(index)" type="danger" v-if="index !== 0" size="mini">删除本条</el-button>
                        </el-form-item> 
                        <el-form-item>
                        </el-form-item>
                        </div>
                    </div>
                    <el-form-item label="" prop="add">
                        <el-button @click="addEditInput()" size="small" type="primary">新增</el-button>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm(1)" v-preventReClick>保 存</el-button>
                <el-button @click="closeDialog()">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var num = 0;//防止在组件中自增报红
var num2 = 0;
import * as CodeMsg from "@/api/common/CodeChange"
import { getTarget,addSynonyms,changeSynonym,delSynonym} from '@/api/siteSettings/hotSearch'
export default {
    data(){
        return{
            dataList:[],
            getNum:new Map(),
            transferOption:'',
            addDialog:false,
            editDialog:false,
            synonymsForm:{},
            editForm:{
                synonymList:[],
                words:'',
                type:1
            },
            rules:{
                words:[{required:'true',message:'请输入目标词',trigger:'blur'}]
            },
            editRules:{
                words:[{required:true,message:'请输入目标词',trigger:'blur'}]
            }
        }
    },
    directives:{
        focus:{
            inserted:function(el){
                el.focus();
            }
        }
    },
    methods:{
        openDialog(){
            this.addDialog = true
            // this.$refs.synonymsForm.clearValidate();
            // this.$refs.synonymsForm.resetFields();
            this.synonymsForm = {
                synonymList:[
                    {
                        words:'',
                    },
                ],
                words:'',
                type:0
            }
        },
        deleteSynonym(row){
            let para = {
                id: row.synonymId
            }
            this.$confirm('','删除同义词',{
                type:'warning',
                message:'确认删除该条同义词吗？',
                cancelButtonClass: "btn-custom-cancel"
            }).then(()=>{
                delSynonym(para).then(res=>{
                   this.confirmJudge(res);
                })
            }).catch(()=>{
                return false;
            })
        },
        saveSynonym(row){
            let para = {
                id: row.synonymId,
                words: row.synonymWords
            }
            changeSynonym(para).then(res=>{
                this.confirmJudge(res);
            })
        },
        getData(){
            getTarget().then(res=>{
                let a = res.data.data
                for(let i =0;i< a.length;i++){
                    a[i].options = null;
                }
                this.dataList = a;
                this.count();
            })
        },
        closeDialog(){
            this.addDialog = false;
            this.editDialog = false;
            this.$refs.synonymsForm.clearValidate();
            this.$refs.synonymsForm.resetFields();
        },
        confirmJudge(res){
            if(res.data.code == CodeMsg.CODE_1000){
                this.$message({
                    type:'success',
                    message:'操作成功！'
                })
                this.synonymsForm= {
                    synonymList:[
                        {
                            words:'',
                        },
                    ],
                    words:'',
                    type:0
                }
                this.getData();
                this.editDialog = false;
                this.addDialog = false;
            }else{
                this.$message({
                    type:'warning',
                    message: res.data.data
                })
            }
        },
        confirm(type,row){
            if(type == 0){//新增
                for(let i = 0;i< this.synonymsForm.synonymList.length;i++){
                    if(this.synonymsForm.synonymList[i].words.trim() == ''){
                        var judge = false;
                    }else{
                        var judge = true;
                    }
                }
                this.$refs['synonymsForm'].validate(valid=>{
                    if(valid && judge && this.synonymsForm.words.trim() !== ''){
                        addSynonyms(this.synonymsForm).then(res=>{
                            this.confirmJudge(res);
                        }).catch(()=>{
                            return false;
                        })
                    }else{
                        this.$message({
                            type:'warning',
                            message:'请检查数据是否填写完整！'
                        })
                    }
                })
            }else if(type == 1){//编辑
                for(let i = 0;i< this.editForm.synonymList.length;i++){
                    if(this.editForm.synonymList[i].words.trim() == ''){
                        var judge = false;
                    }else{
                        var judge = true;
                    }
                }
                this.$refs['editForm'].validate(valid=>{
                    if(valid && judge && this.editForm.words.trim() !== ''){
                        addSynonyms(this.editForm).then(res=>{
                            this.confirmJudge(res);
                        }).catch(()=>{
                            return false;
                        })
                    }else{
                        this.$message({
                            type:'warning',
                            message:'请检查数据是否填写完整！'
                        })
                    }
                })
            }else if(type ==3){//删除整个目标词
                 this.$confirm('','删除目标词',{
                    type:'warning',
                    message:'确认删除该条目标词吗？',
                    cancelButtonClass: "btn-custom-cancel"
                }).then(()=>{
                    addSynonyms({id: row.targetId}).then(res=>{
                        this.confirmJudge(res);
                    }).catch(()=>{
                        return false;
                    })
                }).catch(()=>{
                    return false;
                })
            }
        },
        deleteItem(index){
            this.synonymsForm.synonymList.splice(index, 1);
        },
        deleteEditItem(index){
            this.$confirm('','删除目标词',{
                    type:'warning',
                    message:'确认删除该条同义词吗？',
                    cancelButtonClass: "btn-custom-cancel"
                }).then(()=>{
                    this.editForm.synonymList.splice(index, 1);
                })
        },
        edit(row){
            this.editForm = {
                synonymList:[],
                words:'',
                type:1
            };
            this.editForm.words = row.targetWords;
            this.editForm.id = row.targetId;
            for(let i = 0;i< this.dataList.length;i++){
                if(this.dataList[i].targetWords == row.targetWords ){
                    this.editForm.synonymList.push({words:this.dataList[i].synonymWords,id:this.dataList[i].synonymId});
                }
            }  
            this.editDialog = true;
        },
        addInput(){
            this.synonymsForm.synonymList.push({
                words:''
            })
        },
        addEditInput(){
            this.editForm.synonymList.push({
                words:''
            })
        },
        cancle(val){ 
            //防止失焦在click前触发
            setTimeout(()=>{
                val.synonymWords = this.transferOption;
                val.options = null;
            },200)
        },
        editContent(val){
            setTimeout(()=>{
                this.transferOption = val.synonymWords;
                val.options = 1;
            },300)
        },
        showBorder(val){
            val.options = 2;
        },
        clear(val){
            val.options = null;
        },
        /* ------------------分水岭------------- */
        count(){
            let dataMap = new Map();
            for (let i= 0; i< this.dataList.length;i++){
                let key = this.dataList[i].targetWords;
                if(dataMap.has(key)){
                    dataMap.set(key,dataMap.get(key)+1)
                } else{
                    dataMap.set(key,1);
                }
            }
            this.getNum = dataMap;
        },
        spanMethod({ row, column, rowIndex, columnIndex }){
            if (columnIndex===0) {
                let initNum = num;
                if(initNum+1 ==this.getNum.get(row.targetWords)){
                    num = 0;
                }else{
                    num++;
                }
                if(initNum  % this.getNum.get(row.targetWords) === 0){
                    return{
                        rowspan:this.getNum.get(row.targetWords),
                        colspan: 1
                    } 
                }else{
                    return{
                        rowspan:0,
                        colspan: 0
                    } 
                }
            }else if (columnIndex===2) {
                let initNum = num2;
                if(initNum+1 ==this.getNum.get(row.targetWords)){
                    num2 = 0;
                }else{
                    num2++;
                }
                if(initNum  % this.getNum.get(row.targetWords) === 0){
                    return{
                        rowspan:this.getNum.get(row.targetWords),
                        colspan: 1
                    } 
                }else{
                    return{
                        rowspan:0,
                        colspan: 0
                    } 
                }
            }
        },
        cell({ row, column, rowIndex, columnIndex }){
            return {
                background:'#FFF',
                'text-align':'center'
            }
        },
    },
    mounted(){
        this.getData();
    }
}
</script>

<style scoped>
.synonyms{
    padding:10px;
}
.titlebtn{
    border-left:5px solid #36A6FE;
    padding-left:10px;
}
.btn{
    margin-left:20px;
    margin-right:-30px;
}
.edit_box{
    width:120px;
    margin-right:10px;
    border:1px solid #eee;
    padding:7px 15px;
}
.addbtn{
    margin:20px 0;
}
.keyword_sty{
    border-top:1px solid #ddd;
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    padding:8px 15px;
}
</style>
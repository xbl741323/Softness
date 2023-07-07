<template>
    <div class="server_frame">
        <p>说明：</p>
        <p>1.服务分类用于展示在导航栏“服务分类”下拉栏中;</p>
        <p>2.分类名称和选项名称限制在3-7个字，每个分类选项最多可加7个;</p>
        <el-button type="primary" @click="addNew">添加分类</el-button>
        <div class="server-grid">
            <div class="left-box">
                <p class="title">服务分类</p>
                <div
                    v-for="(item, index) in serverList"
                    :key="item.id"
                    class="name-box"
                >
                    <p :class="item.id == serverId ? 'server-name active-server':'server-name' " @click="choose(item.name,item.id)">{{item.name}}</p>
                    <el-button
                        class="top-btn"
                        v-if="index !==0"
                        type="text"
                        icon="el-icon-top"
                        @click="changeLocation(item,0)"
                    ></el-button>
                    <el-button
                        class="top-btn"
                        v-if="index != serverList.length-1"
                        type="text"
                        icon="el-icon-bottom"
                        @click="changeLocation(item,1)"
                    ></el-button>
                </div>
            </div>
            <div>
                <el-table :data='list' :span-method="spanMethod" :cell-style="cell" border>
                    <el-table-column label="分类名称" align="center">
                        <template slot-scope="scope">
                            <span class="server_edit_table"  @click="editTitle(scope.row)" v-if="scope.row.moveToken == null" @mouseover="showClassBorder(scope.row)" >{{scope.row.name}}</span>
                            <span class="server_keyword_sty"  @click="editTitle(scope.row)" v-if="scope.row.moveToken == 2" @mouseleave="clearTitle(scope.row)">{{scope.row.name}}
                                <el-button class="server_btn" icon="el-icon-edit" v-if="scope.row.moveToken == 2" @click="editTitle(scope.row)"></el-button>
                            </span>
                            <input type="text" class="server_edit_box" minlength="3" maxlength="7" v-model="scope.row.name" v-focus v-if="scope.row.moveToken == 1" @blur="cancleTitle(scope.row)" >
                            <el-button icon="el-icon-check" v-if="scope.row.moveToken == 1" :disabled="scope.row.name.length<3" @click="saveClassName(scope.row)"></el-button>
                            <el-button icon="el-icon-close" v-if="scope.row.moveToken == 1" @click="cancleTitle(scope.row)"></el-button>
                            <p class="locationUrl" @click="toUrl(scope.row.url)">{{serverUrl}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="选项名称" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.url">
                                <span class="server_edit_table"  @click="editContent(scope.row)" v-if="scope.row.options == null" @mouseover="showBorder(scope.row)" >{{scope.row.optionName}}</span>
                                <span class="server_keyword_sty"  @click="editContent(scope.row)" v-if="scope.row.options == 2" @mouseleave="clear(scope.row)">{{scope.row.optionName}}
                                    <el-button class="server_btn" icon="el-icon-edit" v-if="scope.row.options == 2" @click="editContent(scope.row)"></el-button>
                                </span>
                                <input type="text" class="server_edit_box" minlength="3" maxlength="7" v-model="scope.row.optionName" v-focus v-if="scope.row.options == 1" @blur="cancle(scope.row)" >
                                <el-button icon="el-icon-check" v-if="scope.row.options == 1" :disabled="scope.row.optionName.length<3" @click="saveKeyWords(scope.row)"></el-button>
                                <el-button icon="el-icon-close" v-if="scope.row.options == 1" @click="cancle(scope.row)"></el-button>
                            </div>
                            <p v-else></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="链接地址" align="center">
                        <template slot-scope="scope">
                            <p class="locationUrl" @click="toUrl(scope.row.url)">{{scope.row.url}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="显示状态" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-switch :active-value="1" :inactive-value="2" :disabled="!scope.row.url" v-model="scope.row.showStatus" @change="changeSwitch(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150px" align="center">
                        <template >
                            <el-button type="text" class="editBtn" icon="el-icon-edit" @click="openEdit(list),status =0,title = '编辑分类'">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
        
        <el-dialog :visible.sync="editDialog"  width="805px" :close-on-click-modal='false' destroy-on-close :title="title" center> 
            <el-form :model="addForm" ref="addForm" :rules="editRules"  v-if="editDialog" label-width="100px">
                <div style="display:flex">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input v-model="addForm.name" placeholder="请填入分类名称" style="width:200px" />
                    </el-form-item>
                    <el-form-item label="链接地址：" prop="icon">
                        <el-input v-model="addForm.icon" placeholder="请填入分类对应的链接地址" style="width:200px" />
                    </el-form-item>
                </div>
                <div v-for="(item, index) in addForm.serviceOptionList" :key="index" >
                    <div style="display: flex">
                        <el-form-item
                            :prop="'serviceOptionList.' + index + '.optionName'"
                            :label="'选项'+Number(index+1)+':'"
                            :rules="editRules.optionName"
                        >
                            <el-input id="index" placeholder="请填入选项名称" v-model="item.optionName" style="width:200px;"></el-input>
                        </el-form-item> 
                        <el-form-item
                            :prop="'serviceOptionList.' + index + '.url'"
                            :label="'链接地址'+Number(index+1)+':'"
                            :rules="editRules.optionUrl"
                        >
                            <el-input id="index" placeholder="请填入选项对应的链接地址" v-model="item.url" style="width:200px;margin-right:20px;"></el-input>
                            <el-button @click="deleteItem(index)" type="danger" size="mini">删除本条</el-button>
                        </el-form-item> 
                    </div>
                </div>
                <el-form-item v-if="addForm.serviceOptionList.length < 7">
                    <el-button @click="addInput()" size="small" type="primary">新增</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add(addForm)" v-preventReClick>确 定</el-button>
                <el-button @click="closeDialog()">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { tableOption} from "@/const/crud/siteSettings/serverClassification";
import * as CodeMsg from "@/api/common/CodeChange"
import upImg from "@/components/siteSettings/serverimg";
import { getList,changeOption,move,change,changeName,changeIcon,addServiceClass,getServerList} from '@/api/siteSettings/serverClassification'
export default {
    components: {
      upImg
    },
    data(){
        return{
            transferName:'',
            transferOption:'',
            list:[],
            editDialog:false,
            editForm:{},
            editRules:{
                name:[ 
                    {required:true,message:'请填写服务分类名称',trigger:'blur'},
                    {min:3,max:7,message:'请保持长度在3-7个字之间',trigger:'blur'}
                ],
                icon:[
                    {required:true,message:'请输入链接地址',trigger:'blur'},
                ],
                optionName:[
                    {required: true,message: '请填写选项名', trigger: 'blur'},
                    {min:3, max:7, message: '请保持长度在3-7个字之间', trigger: 'blur'}
                ],
                optionUrl:[
                    {required: true,message: '请填写链接地址', trigger: 'blur'}
                ],
            },
            addForm:{
                id:'',
                icon:'',
                name:'',
                serviceOptionList:[]
            },
            file:'',
            show:true,
            showrequire:false,
            serverId:'',
            serverList: [],
            serverName:'',
            serverUrl:'',
            status: '',//0-编辑 1-新增
            title:''
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
    mounted(){
    //   this.switch();
      this.getServerList();
    },
    methods:{
        addNew(){
            this.status = 1;
            this.title = '添加分类'
            this.addForm = {
                id:'',
                icon:'',
                name:'',
                serviceOptionList:[]
            };
            this.editDialog = true;
        },
        add(row){
            if(this.status == 1){
                this.$refs.addForm.validate(valid=>{
                    if(valid){
                        addServiceClass(row).then(res=>{
                            if(res.data.code == CodeMsg.CODE_1000){
                                this.$message({
                                    type:'success',
                                    message:'添加成功！'
                                })
                                this.editDialog = false;
                                this.getServerList();
                            }else{
                                this.$message({
                                    type:'warning',
                                    message:res.data.data
                                })
                                this.getServerList();
                            };
                        })
                    }else{
                        return false;
                    };
                })
            }else{
                this.edit(row);
            };
        },
        addInput(){
            this.addForm.serviceOptionList.push({
                optionName:'',
                url:''
            })
        },
        deleteItem(index){
            this.addForm.serviceOptionList.splice(index,1);
        },
        choose(name, id){
            this.serverName = name;
            this.serverId = id;
            this.getServerList();
        },
        //关闭弹框
        closeDialog(){
            this.editDialog = false;
            this.$refs.addForm.clearValidate();
            this.$refs.addForm.resetFields();
        },
        edit(val){
            this.$refs.addForm.validate(valid=>{
                if(valid){
                    change(val).then(res=>{
                        if(res.data.code == CodeMsg.CODE_1000){
                            this.$message({
                                type:'success',
                                message:this.$t('button.modifySuccess')
                            })
                            this.editDialog = false;
                            this.getServerList();
                        }else{
                            this.$message({
                                type:'warning',
                                message:res.data.data
                            })
                            this.getServerList();
                        };
                    });
                }else{
                    return false;
                }
            })
        },
        openEdit(val){
            this.addForm = JSON.parse(JSON.stringify({
                id:this.addForm.id,
                icon: this.serverUrl,
                name: this.serverName,
                serviceOptionList:val
            }))
            this.editDialog = true;
        },
        toUrl(data){
            window.open(data)
        },
        /* ============================================= */ 
        //鼠标移上
        showClassBorder(val){
            val.moveToken = 2;
        },
        //鼠标移开
        clearTitle(val){
            val.moveToken = null;
        },
        cancleTitle(val){
            //防止失焦在click前触发
            setTimeout(()=>{
                val.name = this.transferName;
                val.moveToken = null;
            },100)
        },
        //点击分类名
        editTitle(val){
            this.transferName = val.name;
            val.moveToken = 1;
        },
        // 修改分类名
        saveClassName(val){
            var param ={
                id:val.serviceId,
                name:val.name
            }
            changeName(param).then(res=>{
                if(res.data.code==1000){
                    this.$message({
                        type:'success',
                        message:this.$t('button.modifySuccess')
                    })
                    this.getServerList();
                }else{
                    this.$message({
                        type:'warning',
                        message:res.data.data
                    })
                    this.getServerList();
                }
            })
        },
        saveName(val){
            change(val).then(res=>{
                if(res.data.code == CodeMsg.CODE_1000){
                    this.$message({
                        type:'success',
                        message:this.$t('button.modifySuccess')
                    })
                    this.optionsList={
                        id:'',
                        name:'',
                        options:[]
                    };
                    this.getServerList();
                }else{
                    this.$message({
                        type:'warning',
                        message:res.data.data
                    })
                    this.getServerList();
                }
            }).catch(err=>{
                console.log(err);
            })
           
        },
        /* ================================================ */
        // 选项
        //鼠标移上显示外框
        showBorder(val){
            val.options = 2;
        },
        clear(val){
            val.options = null;
        },
        //保存关键词
        saveKeyWords(val){
            var param = {
                id :val.id,
                optionName:val.optionName,
            }
            this.changeStatus(param)
        },
        cancle(val){ 
            //防止失焦在click前触发
            setTimeout(()=>{
                val.optionName = this.transferOption;
                val.options = null;
            },200)
        },
        editContent(val){
            setTimeout(()=>{
                this.transferOption = val.optionName;
                val.options = 1;
            },300);
        },
        changeSwitch(val){
            if(val.showStatus==1){
                var status = 1;
            }else{
                var status = 2;
            }
            var param={
                id:val.id,
                showStatus:status,
            }
            this.changeStatus(param)
        },
        changeLocation(val,num){
            var param = {
                id:val.id,
                moveToken:num,
                sort:val.sort,
            }
            move(param).then(res=>{
                if(res.data.code == CodeMsg.CODE_1000){
                    this.$message({
                        type:'success',
                        message:this.$t('button.modifySuccess')
                    })
                    this.getServerList();
                }
            }).catch(err=>{
                console.log(err);
            });
        },
        changeStatus(val){
            changeOption(val).then(res=>{
                if(res.data.code == CodeMsg.CODE_1000){
                    this.$message({
                        type:'success',
                        message:this.$t('button.modifySuccess')
                    })
                    this.getServerList();
                }else{
                    this.$message({
                        type:'warning',
                        message:res.data.data
                    })
                    this.getServerList();
                }
            })
        },
        getServerList(){
            getServerList().then(res=>{
                this.serverList = res.data.data;
                if(this.serverId >0 ){
                    getList({id:this.serverId}).then(res=>{
                        this.serverName = res.data.data.name;
                        this.serverUrl = res.data.data.icon;
                        this.addForm.id = res.data.data.id;
                        //用arrList处理数据在赋值给list 防止即时编辑无反应问题
                        var arrList = res.data.data.list;
                        if(arrList.length == 0){
                            arrList.push({
                                optionName:''
                            })
                        };
                        arrList.forEach(item => {
                            this.$set(item,'name', this.serverName);
                            item.options = null;
                            item.moveToken = null;
                        });
                        this.list = arrList
                    })
                }else{
                    getList({id:this.serverList[0].id}).then(res=>{
                        this.serverId = this.serverList[0].id;
                        this.serverName = res.data.data.name;
                        this.serverUrl = res.data.data.icon;
                        this.addForm.id = res.data.data.id;
                        var arrList = res.data.data.list;
                        if(arrList.length == 0){
                            arrList.push({
                                optionName:''
                            })
                        };
                        arrList.forEach(item => {
                            this.$set(item,'name', this.serverName);
                            item.options = null;
                            item.moveToken = null;
                        });
                        this.list = arrList
                    })
                }
            })
        },
        cell({ row, column, rowIndex, columnIndex }){
            return {
                background:'#FFF'
            }
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex ===4) {
                if (rowIndex % 7 === 0) {
                    return {
                    rowspan: 7,
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
    },
}
</script>

<style scoped>
/* .desccheck{
    font-size: 12px;
    color: rgb(245, 108, 108);
    position: relative;
    left: -86px;
    top: 38px;
}
.require::before{
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
    position: absolute;
    top: 76px;
    right: 300px;
} */

.server_frame{
    padding:10px;
    background:#FFF;
    font-size:14px;
    margin-bottom: 0;
    min-height: 820px;
}
.span_sty{
    padding-left:5px;
    border-left:3px solid #36A6FE;
}
.server_edit_table{
    width:50px;
    height:25px;
    padding:5px 20px;
}
.server_keyword_sty{
    border-top:1px solid #ddd;
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    padding:8px 15px;
}
.server_edit_box{
    width:120px;
    margin-right:10px;
    border:1px solid #eee;
    padding:7px 15px;
}
.server_btn{
    margin-left:20px;
    margin-right:-30px;
}
.locationUrl{
    color:#36A6FE;
    cursor:pointer;
}
.editBtn{
    color:#36A6FE;
}
.head{
    width:40px;
    margin:0 auto;
    margin-top:-40px;
    margin-bottom:30px;
}
.server-grid{
    display:grid;
    grid-template-columns: 230px 80%;
    margin-top: 20px;
    min-width: 960px;
}
.left-box{
    width: 200px;
    border: 1px solid #DCDCDC;
    text-align: center;
}
.title{
    background: #000000;
    line-height: 40px;
    margin: 0;
    color: #FFFFFF;
}
.name-box{
    display: flex;

}
.server-name{
    cursor: pointer;
    width: 150px;
    text-align: center;
}
.server-name:hover{
    color: #36A6FE;
}
.active-server{
    color: #36A6FE;
}
.top-btn{
    padding-top: 10px
}
</style>
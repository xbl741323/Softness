<template>
    <div>
        <span class="common_edit_table"  @click="editContent(row)" v-if="row.options == null" @mouseover="showBorder(row)" >{{row.names}}</span>
        <span class="common_keyword_sty"  @click="editContent(row)" v-if="row.options == 2" @mouseleave="clearBorder(row)">{{row.names}}
            <el-button class="common-btn" icon="el-icon-edit" v-if="row.options == 2" @click="editContent(row)"></el-button>
        </span>
        <input type="text" class="common_edit_box" v-model="fileName" v-focus v-if="row.options == 1" @blur="cancle(row)" >
        <span class="common_suffix" v-if="row.options == 1">{{row.names.substring(row.names.lastIndexOf("."),row.names.length)}}</span>
        <el-button icon="el-icon-check" v-if="row.options == 1" :disabled="row.names.length<3" @click="saveKeyWords(row)"></el-button>
        <el-button icon="el-icon-close" v-if="row.options == 1" @click="cancle(row)"></el-button>
    </div>
</template>

<script>
export default {
    props:['row'],
    data(){
        return{
            fileName:'',
            suffix:'',
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
        //鼠标移上显示外框
        showBorder(val){
            val.options = 2;
        },
        clearBorder(val){
            val.options = null;
        },
        //保存关键词
        saveKeyWords(val){
            var param = {
                id: val.id,
                showStatus: val.showStatus,
                names: this.fileName+ this.suffix,
                uid: val.uid
            }
            this.$emit('saveKeywords',param);
        },
        cancle(val){ 
            //防止失焦在click前触发
            setTimeout(()=>{
                val.names = this.transferOption;
                this.fileName = val.names.substring(0, val.names.lastIndexOf("."));
                val.options = null;
            },200)
        },
        editContent(val){
            setTimeout(()=>{
                // this. fileName = val.names.substring(0, val.names.lastIndexOf("."));
                this.suffix = val.names.substring(val.names.lastIndexOf('.'),val.names.length);
                this.transferOption = val.names;
                val.options = 1;
            },300);
        },
    },
    created(){
        this.fileName = this.row.names.substring(0,this.row.names.lastIndexOf('.'));
    },
}
</script>

<style scoped>
.common-btn{
    margin-left:20px;
    margin-right:-30px;
}
.common_edit_table{
    width:150px;
    height:25px;
    padding:5px 20px;
}
.common_edit_box{
    width:120px;
    margin-right:3px;
    border:1px solid #eee;
    padding:7px 15px;
}
.common_keyword_sty{
    border-top:1px solid #ddd;
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    padding:8px 15px;
}
.common_suffix{
    margin-right:3px;
}
</style>
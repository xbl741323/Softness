<template>
    <div>
        <span class="edit_table"  @click="editContent(row)" v-if="row.options == null" @mouseover="showBorder(row)" >{{row.name}}</span>
        <span class="keyword_sty"  @click="editContent(row)" v-if="row.options == 2" @mouseleave="clear(row)">{{row.name}}
            <el-button class="btn" icon="el-icon-edit" v-if="row.options == 2" @click="editContent(row)"></el-button>
        </span>
        <input type="text" class="edit_box" minlength="3" maxlength="6" v-model="fileName" v-focus v-if="row.options == 1" @blur="cancle(row)" >
        <span class="suffix" v-if="row.options == 1">{{row.name.substring(row.name.lastIndexOf("."),row.name.length)}}</span>
        <el-button icon="el-icon-check" v-if="row.options == 1" :disabled="row.name.length<3" @click="saveKeyWords(row)"></el-button>
        <el-button icon="el-icon-close" v-if="row.options == 1" @click="cancle(row)"></el-button>
    </div>
</template>

<script>
export default {
    props:['row'],
    data(){
        return{
            fileName:'',
            suffix:''
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
                id: val.id,
                showStatus: val.showStatus,
                name: this.fileName+ this.suffix,
            }
            this.$emit('saveKeywords',param);
        },
        cancle(val){ 
            //防止失焦在click前触发
            setTimeout(()=>{
                val.name = this.transferOption;
                this.fileName = val.name.substring(0, val.name.lastIndexOf("."));
                val.options = null;
            },200)
        },
        editContent(val){
            setTimeout(()=>{
                // this. fileName = val.name.substring(0, val.name.lastIndexOf("."));
                this.suffix = val.name.substring(val.name.lastIndexOf('.'),val.name.length);
                this.transferOption = val.name;
                val.options = 1;
            },300);
        },
    },
    created(){
        this.fileName = this.row.name.substring(0,this.row.name.lastIndexOf('.'));
    }
}
</script>

<style scoped>
.btn{
    margin-left:20px;
    margin-right:-30px;
}
.edit_table{
    width:150px;
    height:25px;
    padding:5px 20px;
}
.edit_box{
    width:120px;
    margin-right:3px;
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
.suffix{
    margin-right:3px;
}
</style>
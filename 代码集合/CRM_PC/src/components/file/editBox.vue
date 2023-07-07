<template>
    <div :style="filebox">
        <div class="file-line" v-if="row.options == null">
            <div class="file-name" @mouseover="showTrue" @mouseleave="showFalse">
                <span class="common_edit_table" :style="editbox">{{row.name}}</span>
                <i class="el-icon-edit icon-edit" v-show="show" @click="editContent(row)" ></i>
            </div>
            <i class="el-icon-close icon-edit" @click="deleteRow" v-if="showDelete"></i>
        </div>
        
        <!-- <div class="common_keyword_sty"  @click="editContent(row)" v-if="row.options == 2" @mouseleave="clearBorder(row)">
            <p class="name">
                {{row.name}}
            </p>
            <el-button class="common-btn" icon="el-icon-edit" v-if="row.options == 2" @click="editContent(row)"></el-button>
        </div> -->
        <input type="text" class="common_edit_box" maxlength="20" v-model="fileName" v-focus v-if="row.options == 1" @blur="cancle(row)" >
        <span class="common_suffix" v-if="row.options == 1">{{row.name.substring(row.name.lastIndexOf("."),row.name.length)}}</span>
        <el-button icon="el-icon-check" v-if="row.options == 1" :disabled="this.fileName.length<3" @click="saveKeyWords(row)"></el-button>
        <el-button icon="el-icon-close" v-if="row.options == 1" @click="cancle(row)"></el-button>
    </div>
</template>

<script>
export default {
    props:{
        row:{

        },
        width:{
            default:500
        },
        permissions: {
            type: Boolean,
            default: true
        },
        showDelete: {
            type: Boolean,
            default: true,
        }
    },
    data(){
        return{
            fileName:'',
            suffix:'',
            show: false
        }
    },
    computed: {
        filebox(){
            let style = {};
            // style.width = this.width+'px';
            // style.margin = '0 auto';
            return style;
        },
        editbox(){
            let style = {
                // width: '250px'
            };
            // style.width = this.width+'px';
            // style.margin = '0 auto';
            return style;
        }
    },
    watch:{
       row(newVal,oldVal){

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
        showTrue() {
            this.show = true
        },
        showFalse() {
            this.show = false
        },
        //保存关键词
        saveKeyWords(val){
            var param = {
                id: val.id,
                showStatus: val.showStatus,
                options: null,
                name: this.fileName+ this.suffix,
                uid: val.uid
            }
            this.$emit('saveKeywords',param);
        },
        cancle(val){
            //防止失焦在click前触发
            setTimeout(()=>{
                val.name = this.transferOption;
                this.fileName = val.name.substring(0, val.name.lastIndexOf("."));
                val.options = null;
            },200);
        },
        editContent(val){
            setTimeout(()=>{
                // 给input框赋值
                this.fileName = val.name.substring(0, val.name.lastIndexOf("."));
                this.suffix = val.name.substring(val.name.lastIndexOf('.'),val.name.length);
                this.transferOption = val.name;
                this.$set(val, 'options', 1)
            },300);
        },
        deleteRow() {
            this.$emit("deleteRow", this.row)
        }
    },
    mounted(){
        if(this.row){
            this.fileName = this.row.name.substring(0,this.row.name.lastIndexOf('.'));
        }else{
           
        }
    },
}
</script>

<style scoped>
.common-btn{
    /* margin-left:0; */
    /* float: right;
    margin-right:-60px;
    margin-top:-46px; */
    height:34px;
    /* margin-right:-30px; */
}
.common_edit_table{
    line-height: 25px;
    padding:7px 0;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow:hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
}
.common_edit_box{
    width:200px;
    line-height: 25px;
    margin-right:3px;
    border:1px solid #eee;
    padding:7px 15px;
}
.common_keyword_sty{
    width: 210px;
    padding: 6px 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.common_suffix{
    margin-right:3px;
}
.name{
    width:150px;
    padding:6px 15px;
    line-height: 20px;
    /* padding-right:60px; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    border-top:1px solid #ddd;
    border-left:1px solid #ddd;
    border-bottom:1px solid #ddd;
    border-right:1px solid #ddd;
}
.file-name{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 100px;
}
.icon-edit{
    margin-left: 10px;
    cursor: pointer;
}
.file-line{
    display: flex;
    align-items: center;
}
</style>
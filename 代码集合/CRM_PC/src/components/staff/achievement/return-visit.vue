<template>
    <div>
        <div class="title">
            <div>{{visitData&&visitData!=''?visitData.orgName:userInfo.orgName}}</div>
            <div class="info">
                <span>{{visitData&&visitData!=''?visitData.contactName:userInfo.contactName }}</span>
                <span>|</span>
                <span>{{visitData&&visitData!=''?visitData.jobName:userInfo.jobName}}</span>
                <span>|</span>
                <span>{{visitData&&visitData!=''?visitData.mobile:userInfo.mobile}}</span>
            </div>           
        </div>
        <el-form :model="visitForm" :rules="rules" ref="visitForm" label-width="100px" class="visitForm" label-position="left">
            <el-form-item label="回访内容:" prop="returnVisitContent">
                <el-input type="textarea"  v-model.trim="visitForm.returnVisitContent" maxlength="500" rows="8" show-word-limit ></el-input>
            </el-form-item>
            <el-form-item label="服务满意度:" prop="score">
                <div >
                    <el-input type="number" v-model.trim="visitForm.score" style="width:160px"></el-input>
                    <span> 分</span>
                </div>
            </el-form-item>
            <span class="desc">评分标准 ：【0-5分】分不满意，  【5-8分】比较满意， 【8-10分】 非常满意</span>
        </el-form>
        <div class="form-btn">
            <el-button type="primary" @click="comfirm()">确定</el-button>
            <el-button @click="reset()">取消</el-button>
        </div>
    </div>
</template>

<script>
import { addClueReturnVisit,modClueReturnVisit } from "@/api/staff/achievement";

export default{
    props:["userInfo","visitData"],
    data() {
        var checkFraction = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请填写服务满意度'));
            }else {
                let reg=/^(?!0\d|[0.]+$)\d+(\.\d{1})?$/                
                if (reg.test(value) && value>=0 && value<=10) {
                    callback();
                }else{
                    callback("请输入【0-10】之间的数字，小数点最多保留1位");
                }
            }
        };
       return{
            visitForm:{
                returnVisitContent:"",
                score:"",
            },
            rules: {
                returnVisitContent: [
                    { required: true, message: '请输入回访内容', trigger: 'blur' },
                ],
                score: [
                    { required: true,validator: checkFraction, trigger: 'blur' },
                ],
            }
       } 
    },
    methods:{
        comfirm(){
            this.$refs.visitForm.validate((valid) => {
                if (valid) {
                    if(this.visitData){
                        let params={
                            id:this.visitData.id,
                            returnVisitContent:this.visitForm.returnVisitContent,
                            score:this.visitForm.score,
                        };
                        modClueReturnVisit(params).then(res=>{
                            if(res.data.code==0){
                                this.$message({
                                    message: '编辑回访成功',
                                    type: 'success',
                                    offset: 300
                                });
                                this.$emit("update:visible",false);
                                this.$emit("getAllList");
                            }
                        }) 
                    }else{
                        let params={
                            clueType:this.userInfo.clueType,
                            clueId: this.userInfo.clueId,
                            contactName: this.userInfo.contactName,
                            mobile: this.userInfo.mobile,
                            jobName: this.userInfo.jobName,
                        }
                        addClueReturnVisit(Object.assign(params,this.visitForm)).then(res=>{
                            if(res.data.code==0){
                                this.$message({
                                    message: '创建回访成功',
                                    type: 'success',
                                    offset: 300
                                });
                                this.$emit("update:visible",false);
                                this.$emit("getAllList");
                            }
                        })  
                    }
                }else {
                    this.$message({
                        message: '信息填写有误',
                        type: 'warning',
                        offset: 300
                    });
                }
            });
        },
        reset() {
            this.$refs.visitForm.resetFields();
            this.$emit("update:visible",false);
        }
    },
    mounted(){
        if(this.visitData){//"编辑"回访
            this.visitForm.returnVisitContent=this.visitData.returnVisitContent;
            this.visitForm.score=this.visitData.score;
        }
    }
}
</script>

<style scoped>
.title{
    display: flex;
    align-items: flex-start;
    font-size: 16px;
}
.title div:first-child{
    max-width: 50%;
    overflow:hidden; 
    text-overflow:ellipsis; 
    display:-webkit-box;  
    -webkit-box-orient:vertical;  
    -webkit-line-clamp:2; 
    font-weight: 600;
}
.info{
    min-width: 30%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left:30px;
}
.visitForm{
    margin:30px 0
}
.desc{
    margin-left:20px;
    font-size:12px;
    color:#999
}
.form-btn{
    display: flex;
    justify-content: center;
}
.form-btn button:first-child{
    margin-right:40px
}
</style>
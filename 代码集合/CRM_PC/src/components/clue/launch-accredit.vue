<template>
    <basic-container> 
    <div class="approve-wrap">
        <h3>发起授权</h3>
        <div class="error-note" v-if="userAuthInfo == 1">
            <el-empty description="网络错误，请稍后重试！"></el-empty>
        </div>
        <div class="block-info" v-else>
            <div class="block-title">
                <span class="rectangle"></span>
                <p>用户已认证信息</p>
            </div>
            <div class="table-box margin-t-b-16">
                <el-table :data="userAuthInfo"  class="table-box" :header-cell-style="{ background: '#FAFAFA'}" border>
                    <el-table-column prop="userNo" label="主体ID"></el-table-column>  
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="companyName" label="主体名称"></el-table-column>
                    <el-table-column label="信用代码">
                        <template slot-scope="scope">
                            <!-- 认证标签 certifiedLabel 0：未认证；1：初级认证；2：高级认证 -->
                            <div class="certify-contain">
                                <span v-if="scope.row.organization!=null">{{scope.row.organization}}</span>
                                <el-tooltip effect="dark" :content="scope.row.certifiedLabel == 2?'高级认证':'初级认证'" placement="right" v-if="(scope.row.certifiedLabel&&scope.row.certifiedLabel!=0)">
                                    <img class="certify_img_sty" :src="scope.row.certifiedLabel==2?require('@/assets/images/new-client/certified_unit.png'):require('@/assets/images/new-client/certified_unit_low.png')" alt="">
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>                    
                    <el-table-column prop="customerServerName" label="客服"></el-table-column>
                    <el-table-column prop="promoteAttributionName" label="推广归属"></el-table-column>
                </el-table> 
            </div>
            <div class="block-title margin-t-b-16">
                <span class="rectangle"></span>
                <p>待授权信息</p>
                <span class="note-txt">联系人姓名及手机号将作为授权人信息进行审核，如有问题请到线索中修改</span>
            </div>
            <div class="flex-layout">
                <p>{{chooseAccreditOne.contactName}}</p>
                <p>{{chooseAccreditOne.mobile}}</p>
            </div>
            <div class="form-box">
                <el-form :model="approveForm" :rules="rules" ref="approveForm" class="demo-approveForm" label-position="left">
                    <el-form-item label="合同附件：" prop="file">
                        <file-upload :limit='1' :fileSize="5" :acceptType="'.pdf'" :multipleFile=false :wordLimit="100" class="upload-file" @fileList="getFileList" :contractFile="templateFile" :status='templateStatus' v-model="approveForm.file"/>
                        <p class="template-require">只允许上传一份合同文件，格式为pdf,文件大小不超过20M</p>
                    </el-form-item>              
                    <el-form-item label="审核人：" prop="audit">
                        <el-select v-model="approveForm.audit" @change="selectAudit" placeholder="请选择审核人">
                            <el-option
                            v-for="item in optionsList"
                            :key="item.userId"
                            :label="item.name"
                            :value="item.userId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" maxlength="100" show-word-limit v-model="approveForm.remark" placeholder="请输入备注信息"></el-input>
                    </el-form-item>
                </el-form>           
                <div class="center-btn"> 
                    <el-button type="primary" @click="submitForm('approveForm')">提交审核</el-button>
                        <el-button @click="cancleForm('approveForm')">取消</el-button>
                </div>
            </div>
        </div>
    </div>
    </basic-container>  
</template>
<script>
import {getAuthCompanyUserVoByOrganization, getClueDetail, listAuthCompanyUserVoByMobile,  listCertifiedAuthorized, saveAuthorized } from "@/api/new-client/my-clue"
import fileUpload from '@/components/file/file-upload.vue';
import { uploadContactFile } from "@/api/clue/clue-contract";
import { uploadMedia } from "@/api/project/project";
export default {
    components: {
        fileUpload
    },    
    data(){
        var contractValidate = (rule, value, callback) => {
            if (this.judge(this.approveForm.file)) {
                callback(new Error("请上传合同附件"));
            } else {
                callback();
            }
        };
        return{
            approveForm:{
            },
            chooseAccreditOne:{},
            userAuthInfo:[],
            centerDialogVisible: false,
            userList:[],
            userInfo:[],
            userData:null,
            optionsList:[],
            rules:{
                audit: [
                    { required: true, message: '请选择审核人', trigger: 'change' }
                ],
                file:[{required: true, validator: contractValidate,trigger: 'change'}],
            },
            choosedId:null,
            templateStatus: false,
            baseUrl: process.env.BASE_URL,
            templateFile: [],
            chooseAudit:{},
        }
    },
    methods:{
        getDetail(){
            let params = {
                clueCompanyId: this.$route.query.id
            }
            getClueDetail(params,1,true).then(res=>{
                if (res.data.code == CodeMsg.CODE_0) {
                    this.userData = res.data.data;
                    this.chooseAccreditOne = res.data.data.clueCompanyContactList.filter(item=>item.id == this.$route.query.chooseId)[0];
                    console.log(this.chooseAccreditOne)
                }
            })
            getAuthCompanyUserVoByOrganization(this.$route.query.organization).then(res=>{
                if(res.data.code == CodeMsg.CODE_0) {
                    this.userAuthInfo = [res.data.data];
                } else {
                    this.userAuthInfo = 1;
                }
            })
            listCertifiedAuthorized().then(res=>{
                if (res.data.code == CodeMsg.CODE_0) {
                    this.optionsList = res.data.data
                }
            })
        },
        selectAudit(val){
            this.chooseAudit = this.optionsList.filter(item=>{
                return item.userId == val
            })
            console.log(this.chooseAudit);
        },
        getLicense(val){
            this.$set(this.approveForm,'license',val[0] || false);
            console.log(val)
            this.approveForm.licenseName = val[0].name;
            this.uploadContractFile(val[0],'license');
        },
        getFileList(val){//获取上传的合同附件
            this.$set(this.approveForm,'file',val[0] || false);
            console.log(val)
            this.uploadContractFile(val[0],'contract');
        },
        // 判断是否为空
        judge(val){
            if(val == '' || val == null || val == undefined || val.length==0){
                return true;
            }else{
                return false;
            }
        },
         // 上传文件
        uploadContractFile(val,type){
            this.approveForm.file = val;
            if(!this.judge(val)){
                var para = new FormData();
                if(type == 'license'){
                    para.append('file', val.raw);                    
                } else {
                    para.append('multipartFile', val.raw);
                }
                let url = type == 'contract'?uploadContactFile : uploadMedia
                url(para).then(res=>{
                    if(res.data.code == 0){
                        if(type == 'contract'){
                            this.approveForm.contractUrl = res.data.data.url;
                            this.approveForm.contractName = res.data.data.name;
                        } else {
                            this.approveForm.licenseUrl = res.data.data;
                        }                        
                    }
                })
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.confirmApprove();
            } else {
                this.$offsetMessage.warning('请完成必填项！');
                return false;
            }
            });
        },
        cancleForm(formName) {
            this.$confirm('确定取消?', '提示', {
                cancelButtonText: '取消',
                cancelButtonClass: 'btn-custom-cancel',
                confirmButtonText: '确定',
            type: 'warning'
            }).then(() => {
                this.$refs[formName].resetFields();
                this.$router.go(-1)
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '继续'
                // });          
            });
        },
        chooseUser(){
            let filters = this.userData.clueCompanyContactList.filter(item=>{
                return item.id == this.approveForm.clueCompanyContactId
            })
            console.log(filters);
            listAuthCompanyUserVoByMobile(filters[0].mobile).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.userList = res.data.data
                }
            })
            return this.centerDialogVisible=true;
        },
        selectable(row, index){
            let isSelected = this.$refs.multipleTable.selection.includes(row)
            return !(this.$refs.multipleTable.selection.length >= 1) || isSelected;
        },
        handleSelectionChange(val){            
            if (val.length >= 1) {
                let tempArr = val.slice(1);
                tempArr.forEach((ele) => {
                    this.$refs.multipleTable.toggleRowSelection(ele, false);
                });
                val = val.slice(0, 1);
                this.choosedId = val[0].userId;
            }             
        },
        confirmUser(){
            let list = this.userList.filter(i=>i.userId == this.choosedId);
            console.log(list);
            this.userInfo = list;
            this.centerDialogVisible = false;
        },
        confirmApprove(){
            console.log(this.chooseAudit,'this.chooseAudit');
            let para = {
                type: 2,
                auditId: this.chooseAudit[0].userId,
                auditName: this.chooseAudit[0].name,
                auditNo: this.chooseAudit[0].number,
                clueId: this.$route.query.id,
                clueNo: this.userData.clueNo,
                clueName: this.userData.companyName,
                clueCompanyContactId: this.chooseAccreditOne.id,
                contractName: this.approveForm.contractName,
                contractUrl: this.approveForm.contractUrl,                
                contactMobile: this.chooseAccreditOne.mobile,
                contactName: this.chooseAccreditOne.contactName,
                userId: this.userAuthInfo[0].userId,
                userNo: this.userAuthInfo[0].userNo,
                legalName: this.userAuthInfo[0].legalName,
                legalMobile: this.userAuthInfo[0].legalMobile,
                organization: this.userData.organization,
                remark: this.approveForm.remark,
            }
            saveAuthorized(para).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.$offsetMessage.success('发起授权创建成功！')
                    setTimeout(()=>{
                        this.$router.go(-1)
                    },1500)
                } else {
                    this.$offsetMessage({
                        message: res.data.msg + "，请稍后重试!",
                        type: "warning",
                    });
                }
            })
        },
        
    },
    mounted(){
        this.getDetail()
    }
}
</script>
<style lang="stylus">
@import "./clue.styl"
</style>
<style scoped>
    @import url("./entering-contract.css");
</style>
<template>
    <basic-container> 
    <div class="approve-wrap">
        <h3>发起认证
            <span class="note-red">认证信息如有问题，请到线索中修改</span>
        </h3>
        <div class="error-note" v-if="userData == 1">
            <el-empty description="网络错误，请稍后重试！"></el-empty>
        </div>
        <div class="block-info" v-else>
            <div class="block-title">
                <span class="rectangle"></span>
                <p>认证信息</p>
            </div>
            <div class="form-box" v-if="userData">
                <el-form :model="approveForm" :rules="rules" ref="approveForm" class="demo-approveForm" label-position="left">
                    <el-form-item :label="$route.query.clueType == 0 ? '个人姓名：':'单位名称：'" class="flex-layout">
                        <p>{{$route.query.clueType == 0 ? userData.contactName : userData.companyName}}</p>
                    </el-form-item>
                    <el-form-item label="信用代码：" class="flex-layout" v-if="$route.query.clueType == 1">
                        <p>{{userData.organization}}</p>
                    </el-form-item>
                    <div class="customer-infos" v-if="$route.query.clueType == 1"> 
                        <el-form-item label="法人信息：" prop="legalName">
                            <el-input v-model="approveForm.legalName" placeholder="请输入法人姓名" class="customer-name"></el-input>
                        </el-form-item>
                        <el-form-item prop="legalMobile">
                            <el-input v-model="approveForm.legalMobile" class="customer-phone" placeholder="请输入法人手机号码"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="选择授权人：" prop="clueCompanyContactId" class="accredit margin-t-b-16">
                        <el-radio-group v-model="approveForm.clueCompanyContactId" @change="changeAccredit" class="margin-t-b-16">
                            <el-radio v-for="( item, index) in userData.clueCompanyContactList" :disabled="item.disabled" :key="item.id" :label="item.id" class="radio-block">
                                联系人{{index+1}}： {{item.contactName}} {{item.mobile}}
                                <span v-if="item.disabled" class="warning-text">仅合规手机号可用于签约，请去线索信息中修改</span>
                                <span v-if="creatNewId == item.id" class="warning-text">该授权人无用户账号信息（卧涛网），认证成功后系统将自动为该授权人创建一个用户账号</span>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="block-title">
                        <div class="flex-fb">
                            <span class="rectangle"></span>
                            <p>用户信息</p>
                        </div>
                        <el-button v-if="(userInfo.length==0)" :disabled="!approveForm.clueCompanyContactId" type="primary" @click="chooseUser()">选择用户</el-button>
                        <el-button v-else type="primary" @click="centerDialogVisible = true">更换用户</el-button>
                    </div>
                    <el-form-item prop="userOne" class="margin-t-b-16">
                        <el-table :data="userInfo" class="table-box" :header-cell-style="{ background: '#FAFAFA'}" border>
                            <el-table-column prop="userNo" label="主体ID"></el-table-column>  
                            <el-table-column prop="username" label="用户名"></el-table-column>
                            <el-table-column prop="mobile" label="联系方式"></el-table-column>
                            <el-table-column prop="customerServerName" label="客服"></el-table-column>
                            <el-table-column prop="promoteAttributionName" label="推广归属"></el-table-column>
                        </el-table>  
                    </el-form-item>  
                    <el-form-item label="个人身份证号码：" prop="idCard" v-if="$route.query.clueType == 0">
                            <el-input v-model="approveForm.idCard" placeholder="请输入身份证号码" class="id-input"></el-input>
                        </el-form-item>
                    <el-form-item label="营业执照：" prop="license" class="margin-t-b-16" v-if="$route.query.clueType == 1">
                        <file-upload :limit='1' :acceptType="'.pdf,.jpg,.png'" :fileSize=4 :wordLimit="100" :multipleFile="false" class="upload-file" @fileList="getLicense" :contractFile="templateFile" :status='templateStatus' v-model="approveForm.license"/>
                        <p class="template-require">请上传营业执照，格式为pdf或者图片格式（JPG/PNG等），大小不超过4M</p>
                    </el-form-item> 
                    <el-form-item label="电商订单截图：" v-if="$route.query.lauchType == 2" prop="screenshot" class="margin-t-b-16">
                        <div class="flex-layout">
                            <file-upload :limit='1' :acceptType="'.pdf,.jpg,.png'" :fileSize=4 :wordLimit="100" :multipleFile="false" class="upload-file" @fileList="getShot" :contractFile="templateFile" :status='templateStatus' v-model="approveForm.screenshot"/>
                            <p class="color-warning">请上传订单截图</p>
                        </div>
                        <p class="template-require">请上传一份订单截图，格式为pdf或者图片格式（JPG/PNG等），大小不超过4M</p>
                    </el-form-item>  
                    <el-form-item label="合同附件：" v-if="$route.query.lauchType == 1" prop="file" class="margin-t-b-16">
                        <file-upload :limit='1' :acceptType="'.pdf'" :fileSize=20 :wordLimit="100" class="upload-file" :multipleFile="false" @fileList="getFileList" :contractFile="templateFile" :status='templateStatus' v-model="approveForm.file"/>
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
            <el-dialog title="选择用户" :visible.sync="centerDialogVisible" :close-on-click-modal="false" center width="66%">
                <el-table ref="multipleTable" :data="userList" stripe class="table-box" :header-cell-style="{ background: '#FAFAFA'}" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                    <el-table-column prop="userNo" label="主体ID"></el-table-column>  
                    <el-table-column prop="username" label="用户名"></el-table-column>
                    <el-table-column prop="mobile" label="联系方式"></el-table-column>
                    <el-table-column prop="customerServerName" label="客服"></el-table-column>
                    <el-table-column prop="promoteAttributionName" label="推广归属"></el-table-column>
                    <el-table-column prop="createTime" label="注册时间"></el-table-column>
                </el-table>  
                <p class="note-red" v-if="userList.length==0">暂无数据，请提示用户用所选联系人手机号注册一个卧涛网新账号！</p>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmUser()" :disabled = "!choosedId">确 定</el-button>
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                </span> 
            </el-dialog>
        </div>
    </div>
    </basic-container>  
</template>
<script>
import { getClueDetail, listAuthCompanyUserVoByMobile, listCertifiedAuthorized, saveCertified } from "@/api/new-client/my-clue"
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
        var licenseValidate = (rule, value, callback) => {
            if (this.judge(this.approveForm.license)) {
                callback(new Error("请上传营业执照"));
            } else {
                callback();
            }
        };
        var shotValidate = (rule, value, callback) => {
            if (this.judge(this.approveForm.screenshot)) {
                callback(new Error("请上传订单截图"));
            } else {
                callback();
            }
        };
        var userValidate = (rule, value, callback) => {
            if (this.judge(this.userInfo) && !this.creatNewId) {
                callback(new Error("请选择待认证的用户信息"));
            } else {
                callback();
            }
        };
        return{
            approveForm:{
            },
            accredits:[{
                name:'李二成',
                mobile:'13512345220',
                disabled:false
            },{
                name:'李二成',
                mobile:'0553123456',
                disabled:true
            }],
            centerDialogVisible: false,
            userList:[],
            userInfo:[],
            userData: null,
            creatNewId: null,
            optionsList:[],
            rules:{
                legalName:[
                    { required: true, message: '请输入法人姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                legalMobile:[
                    { required: true, message: '请输入法人手机号码', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号码', trigger: 'blur'},

                ],
                idCard:[
                    { required: true, message: '请输入身份证号码', trigger: 'blur' },
                    { pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message: '请输入正确的18位身份证号码', trigger: 'blur'},

                ],
                clueCompanyContactId: [
                    { required: true, message: '请选择授权人', trigger: 'change' }
                ],
                audit: [
                    { required: true, message: '请选择审核人', trigger: 'change' }
                ],
                userOne:[{required: true, validator: userValidate,trigger: 'change'}],
                file:[{required: true, validator: contractValidate,trigger: 'change'}],
                license:[{required: true, validator: licenseValidate,trigger: 'change'}],
                screenshot:[{required: true, validator: shotValidate,trigger: 'change'}],
            },
            choosedId:null,
            templateStatus: false,
            templateFile: [],
            chooseAudit:{},
            auditRadio:{},
            fullscreenLoading: false,
        }
    },
    methods:{
        // 选择授权人radio框change触发事件
        changeAccredit(val){
            let filters = this.userData.clueCompanyContactList.filter(item=>item.id == val)[0];
            this.auditRadio = filters;
            console.log(this.auditRadio);
            this.userInfo = [];
        },
        // 获取认证相关信息：下拉审核人、单位详细信息
        getDetail(){
            let type = this.$route.query.clueType;
            let params = type == 1 ? {clueCompanyId: this.$route.query.id} : {cluePersonId: this.$route.query.id};
            getClueDetail(params,type,true).then(res=>{
                if (res.data.code == CodeMsg.CODE_0) {
                    let data = res.data.data;
                    this.fullscreenLoading.close();
                    if(data.clueCompanyStaff && data.clueCompanyStaff.legalName){
                        this.$set(this.approveForm, "legalName", data.clueCompanyStaff.legalName)
                    }
                    if(data.clueCompanyStaff && data.clueCompanyStaff.legalMobile){
                        this.$set(this.approveForm, "legalMobile", data.clueCompanyStaff.legalMobile)
                    }
                    if(type == 0) {
                        let para = {};
                        para.contactName = data.contactName;
                        para.mobile = data.mobile;
                        para.id = this.$route.query.id;
                        this.approveForm.clueCompanyContactId = this.$route.query.id;
                        data.clueCompanyContactList = [para];
                    }
                    console.log(data,'datalllll');
                    this.userData = data;
                    let reg = /^1[3456789]\d{9}$/;
                    if(data.clueCompanyContactList) return data.clueCompanyContactList.forEach(item=>{
                        if(reg.test(item.mobile)){
                            this.$set(item,'disabled',false);
                        }else{
                            this.$set(item,'disabled',true);
                        }
                    })
                } else {
                    this.fullscreenLoading.close();
                    this.userData = 1;
                }
                    console.log(this.userData,'1this.userData');
            }).catch((err)=>{
                this.fullscreenLoading.close()
                this.userData = 1;
            })
            // 获取审核人数据
            listCertifiedAuthorized().then(res=>{
                if (res.data.code == CodeMsg.CODE_0) {
                    this.optionsList = res.data.data
                }
            })
        },
        // 选择审核人
        selectAudit(val){
            this.chooseAudit = this.optionsList.filter(item=>{
                return item.userId == val
            })
            console.log(this.chooseAudit);
        },
        // 获取上传的营业执照
        getLicense(val){
            this.$set(this.approveForm,'license',val[0] || false);
            console.log(val)
            this.approveForm.licenseName = val[0].name;
            this.uploadContractFile(val[0],'license');
        },
        // 获取订单截图
        getShot(val){
            this.$set(this.approveForm,'screenshot',val[0] || false);
            console.log(val)
            // 后台设置订单截图与合同共用一个字段
            this.approveForm.contractName = val[0].name;
            this.uploadContractFile(val[0],'screenshot');
        },
        getFileList(val){//获取上传的合同附件
            this.$set(this.approveForm,'file',val[0] || false);
            console.log(val)
            this.uploadContractFile(val[0],'contract');
        },
        // 判断是否为空
        judge(val){
            console.log(val);
            if(val == '' || val == null || val == undefined || val.length==0){
                return true;
            }else{
                return false;
            }
        },
         // 上传文件转url、获取name等
        uploadContractFile(val,type){
            // this.approveForm.file = val;
            if(!this.judge(val)){
                var para = new FormData();
                if(type == 'license' || type == 'screenshot'){
                    para.append('file', val.raw);                    
                } else {
                    para.append('multipartFile', val.raw);
                }
                let url = type == 'contract' ? uploadContactFile : uploadMedia
                url(para).then(res=>{
                    if(res.data.code == 0){
                        if(type == 'contract'){
                            this.approveForm.contractUrl = res.data.data.url;
                            this.approveForm.contractName = res.data.data.name;
                        } else {
                            if(type == 'license') return this.approveForm.licenseUrl = res.data.data;
                            // 后台设置订单截图与合同共用一个字段
                            this.approveForm.contractUrl = res.data.data;
                        }                        
                    }
                })
            }
        },
        // 提交审核按钮
        submitForm(formName) {
            console.log(this.userInfo,'this.userInfo');
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.confirmApprove();
            } else {
                this.$offsetMessage.warning('请完成必填项！');
                return false;
            }
            });
        },
        // 取消按钮
        cancleForm(formName) {
            this.$confirm('确定取消?', '提示', {
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            confirmButtonText: '确定',
            type: 'warning'
            }).then(() => {
                this.$refs[formName].resetFields();            
                this.$router.push('/personal/customer/my-clue')
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '继续'
                // });          
            });
        },
        // 根据选择的授权人获取对应手机号账号列表
        chooseUser(){
            let filters = this.userData.clueCompanyContactList.filter(item=>{
                return item.id == this.approveForm.clueCompanyContactId
            })
            console.log(filters);
            listAuthCompanyUserVoByMobile(filters[0].mobile).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    let data = res.data.data;
                    if(data.length == 0 && this.$route.query.lauchType == 2) return this.$confirm('该授权人无用户账号信息（卧涛网），认证成功后系统将自动为该授权人创建一个用户账号!', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'success'
                    }).then(() => {
                        this.creatNewId = filters[0].id;
                    }).catch(() => {
                        this.creatNewId = filters[0].id;        
                    });
                    this.userList = res.data.data;
                    this.centerDialogVisible=true;
                }
            })
        },
        // 弹框-列表选择用户单选
        selectable(row, index){
            let isSelected = this.$refs.multipleTable.selection.includes(row)
            return !(this.$refs.multipleTable.selection.length >= 1) || isSelected;
        },
        // 弹框-列表单选框触发事件
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
        // 弹框-列表选择用户后确定
        confirmUser(){
            let list = this.userList.filter(i=>i.userId == this.choosedId);
            console.log(list);
            this.userInfo = list;
            this.centerDialogVisible = false;
        },
        // 最后一步提交所填信息
        confirmApprove(){
            let lauchType = this.$route.query.lauchType;
            let clueType = this.$route.query.clueType;
            console.log(this.auditRadio,'this.auditRadio');
            let para = {
                clueType: clueType == 1 ? 2 : 1,//1：个人；2：单位
                type: 1,//1：认证；2：授权
                authType: lauchType,//1：后台自主认证；2：电商认证
                auditId: this.chooseAudit[0].userId,
                auditName: this.chooseAudit[0].name,
                auditNo: this.chooseAudit[0].number,
                userId: this.userInfo[0] ? this.userInfo[0].userId : null,
                userNo: this.userInfo[0] ? this.userInfo[0].userNo : null,
                clueId: this.$route.query.id,
                clueNo: this.userData.clueNo,
                clueName: clueType == 1 ? this.userData.companyName : this.userData.contactName,
                contactMobile: clueType == 1 ? this.auditRadio.mobile : this.userData.mobile,
                contactName: clueType == 1 ? this.auditRadio.contactName : this.userData.contactName,
                legalName: this.approveForm.legalName,
                legalMobile: this.approveForm.legalMobile,
                remark: this.approveForm.remark,
                contractName: this.approveForm.contractName,
                contractUrl: this.approveForm.contractUrl,
                organization: clueType == 1 ? this.userData.organization : this.approveForm.idCard
            }
            if(clueType == 1){
                para.licenseUrl = this.approveForm.licenseUrl;
                para.licenseName = this.approveForm.licenseName;
            };
            console.log(para);
            saveCertified(para).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                    this.$offsetMessage.success('创建认证成功！');
                    setTimeout(()=>{
                        this.$router.push('/personal/customer/my-clue');
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
        this.fullscreenLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.getDetail();
    }
}
</script>
<style scoped>
    @import url("./entering-contract.css");
</style>
<style lang="stylus">
@import "./clue.styl"
</style>
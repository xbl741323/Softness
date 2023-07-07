<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
            <div class="radio-group">
                <el-radio-group v-model="partnerType" @change="handleChange">
                    <el-radio :label="2">单位</el-radio>
                    <el-radio :label="1">个人</el-radio>
                </el-radio-group>
            </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">

                <el-form-item label="合作机构编号：" prop="partnerNo" v-if="ruleForm.partnerNo">
                    <el-input v-model="ruleForm.partnerNo" placeholder="请输入合作机构编号" disabled></el-input>
                </el-form-item>

                <el-form-item label="合作机构：" prop="partnerName">
                    <el-input v-model="ruleForm.partnerName" placeholder="请输入合作机构名称" maxlength="50"></el-input>
                </el-form-item>

                <el-form-item :label="partnerType == 2 ? '联系人姓名：' : '姓名：'" prop="contactName">
                    <el-input v-model="ruleForm.contactName" :placeholder="partnerType == 2 ? '请输入联系人姓名' : '请输入合作者姓名'" maxlength="10"></el-input>
                </el-form-item>

                <el-form-item :label="partnerType == 2 ? '联系人手机号：' : '手机号：'" prop="contactMobile">
                    <el-input v-model="ruleForm.contactMobile" :placeholder="partnerType == 2 ? '请输入联系人手机号' : '请输入合作者手机号'"></el-input>
                </el-form-item>

                <el-form-item :label="partnerType == 2 ? '信用代码：' : '身份证号：'" prop="identifyNo">
                    <el-input v-model="ruleForm.identifyNo" placeholder="请输入18位信用代码" maxlength="18" show-word-limit v-if="partnerType ==2"></el-input>
                    <el-input v-else v-model="ruleForm.identifyNo" placeholder="请输入与合作者身份证号"></el-input>
                </el-form-item>

                <el-form-item :label="partnerType == 2 ? '单位地址：' : '通讯地址：'">
                    <el-input v-model="ruleForm.partnerAddress" :placeholder="partnerType == 2 ? '请输入合作机构公司地址' : '请输入与合作者通讯地址'" maxlength="50"></el-input>
                </el-form-item>

                <el-form-item :label="partnerType == 2 ? '营业执照：' : '身份证件：'">
                    <imgUpload ref="upload"></imgUpload>
                </el-form-item>

                <el-form-item label="查重部门：" prop="deptBusinessGroup">
                    <el-select v-model="ruleForm.deptBusinessGroup" multiple clearable :multiple-limit="limitNum()" @change="changeDept">
                        <el-option
                        v-for="item in repeatDeptOptions"
                        :key="item.id"
                        :value="item.id"
                        :label="item.businessGroupName"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="卧涛对接人：" prop="connectEmpId">
                    <el-cascader @change="changeEngineer" :props="{value: 'customerId', label: 'label', emitPath: false }" :show-all-levels="false" filterable clearable :options="empList" ref="engineer" v-model="ruleForm.connectEmpId" :before-filter="beforeFilter">
                        <template slot-scope="{data}">
                            <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                                <div slot="content">{{data.customerNo}}</div>
                                <span>{{data.label}}</span>
                            </el-tooltip>
                        </template>
                    </el-cascader>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="big" @click="handleSave">保存</el-button>
                    <el-button size="big" @click="dialogClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import imgUpload from "@/components/upload/businessLicence-upload";
import { addPartner } from "@/api/partner/partner.js"
import { getEmpList } from "@/api/clue/clue";
export default {
    components: {
        imgUpload
    },
    props: ['repeatDeptOptions', "empList"],
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "添加合作机构",
            partnerType: 2,
            connectEmp: {},
            isAdd: true,
            ruleForm: {
                partnerName: "",
                contactName: "",
                contactMobile: "",
                identifyNo: "",
                partnerAddress: "",
                partnerNo: "",
                deptBusinessGroup: [],
                connectEmpId: "",
            },
            rules: {
                partnerName: [
                    { required: true, message: '请输入合作机构名称', trigger: 'blur' },
                ],
                deptBusinessGroup: [
                    { required: true, message: '请选择查重部门', trigger: 'blur' }
                ],
                connectEmpId: [
                    { required: true, message: '请选择卧涛对接人', trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.handleChangeRules()
    },
    methods: {
        //显示工号
        async beforeFilter() {
            await getEmpList(false).then((res) => {
                if(res.data.code == CodeMsg.CODE_0){
                    this.empList = res.data.data;
                }
            });
            this.$loop(this.empList[0], this.empList[0])
            return false
        },
        //编辑工程师
        changeEngineer() {
            this.$nextTick(() => {
                let rList = this.$refs.engineer.getCheckedNodes();
                rList.forEach(item => {
                    if (item.data.customerId != null) {
                        this.connectEmp.connectEmpId = item.data.customerId
                        this.connectEmp.connectEmpName = item.data.customerName
                    }
                });
            })
        },
        // 获取数据员工 false-去除禁用后的员工 true-获取所有员工
        getDropList() {
            getEmpList(false).then((res) => {
                if(res.data.code == CodeMsg.CODE_0){
                    this.empList = res.data.data;
                }
            });
        },
        handleChangeRules() {
            this.rules.contactName = [
                { required: true, message: this.partnerType == 2 ? '请输入联系人姓名' : '请输入合作者姓名', trigger: 'blur' }
            ]
            this.rules.contactMobile = [
                { required: true, message: this.partnerType == 2 ? '请输入联系人手机号' : '请输入合作者手机号', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号码', trigger: 'blur' }
            ]
            this.rules.identifyNo = [
                this.partnerType == 2 ? { required: true, min: 18, max: 18, message: '请输入正确的信用代码', trigger: 'blur' } : { required: true, min: 18, max: 18, message: '请输入正确的证件号码', pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, trigger: 'blur'}
            ]
        },
        //改变机构类型
        handleChange() {
            this.handleChangeRules()
            this.ruleForm.identifyNo = ""
            this.$refs.ruleForm.clearValidate()
            this.ruleForm.deptBusinessGroup = []
            this.ruleForm.deptBusinessGroup.push(this.repeatDeptOptions[0].id)
        },
        //关闭弹窗
        dialogClose() {
            this.dialogVisible = false
            this.$refs.ruleForm.resetFields()
            this.ruleForm = {
                partnerName: "",
                contactName: "",
                contactMobile: "",
                identifyNo: "",
                partnerAddress: "",
                deptBusinessGroup: [],
                connectEmpId: "",
            }
            this.$refs.upload.imgList = []
            this.ruleForm.deptBusinessGroup.push(this.repeatDeptOptions[0].id)
        },
        //点击保存按钮提交表单
        handleSave() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let params = {
                        partnerName: this.ruleForm.partnerName,
                        contactName: this.ruleForm.contactName,
                        contactMobile: this.ruleForm.contactMobile,
                        identifyNo: this.ruleForm.identifyNo,
                        partnerAddress: this.ruleForm.partnerAddress,
                        identifyUrl: this.$refs.upload.imgList.length > 0 ? this.$refs.upload.imgList[0].response.data : "",
                        deptBusinessGroup: this.ruleForm.deptBusinessGroup.join(','),
                        connectEmpId: this.connectEmp.connectEmpId,
                        connectEmpName: this.connectEmp.connectEmpName,
                        partnerType: this.partnerType,
                    }
                    if (!this.isAdd) {
                        params.id = this.ruleForm.id
                    }
                    addPartner(this.isAdd ? 1 : 2, params).then(res => {
                        if (res.data.code == 0) {
                            this.$emit("getAllPartnerList")
                            this.dialogVisible = false
                            this.$message.success(this.isAdd == 1 ? "添加成功" : "编辑成功")
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        //选择全部清除其他勾选项
        changeDept() {
            if (this.ruleForm.deptBusinessGroup.includes(this.repeatDeptOptions[0].id)) {
                this.ruleForm.deptBusinessGroup = []
                this.ruleForm.deptBusinessGroup[0] = this.repeatDeptOptions[0].id
            }
        },
        //选择全部限制勾选个数
        limitNum() {
            try {
                if (this.ruleForm.deptBusinessGroup.includes(this.repeatDeptOptions[0].id)) {
                    return 1
                }
                return 0
            } catch (error) {

            }

        },
    }
}
</script>

<style lang="scss" scoped>
.radio-group{
    text-align: center;
    margin-bottom: 20px;
}
:deep(.el-input) {
    width: 360px;
}
:deep(.el-form) {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>

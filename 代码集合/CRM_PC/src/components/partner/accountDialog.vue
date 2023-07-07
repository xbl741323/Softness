<template>
    <div>
        <el-dialog :title="dialogTitle" :close-on-click-modal="false" :visible.sync="dialogVisible" @close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
                <el-form-item label="所属合作机构：" prop="deptId">
                    <el-select placeholder="请选择合作机构" v-model="ruleForm.deptId" :disabled="isAdd == 2">
                        <el-option 
                        v-for="item in partnerDeptOptions"
                        :key="item.partnerId"
                        :value="item.partnerId"
                        :label="item.partnerName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="工号：" prop="number">
                    <el-input v-model="ruleForm.number" placeholder="请输入工号" :disabled="isAdd == 2"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入姓名" maxlength="8"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="ruleForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="请输入合作机构员工手机号" :disabled="isAdd == 2"></el-input>
                    <span class="changePhone" @click="changePhone" v-if="isAdd == 2">修改手机号</span>
                </el-form-item>
                <el-form-item label="角色：" prop="roleList">
                    <el-select v-model="ruleForm.roleList" placeholder="请选择角色" multiple clearable>
                        <el-option 
                        v-for="item in roleOptions"
                        :key="item.roleId"
                        :value="item.roleId"
                        :label="item.roleName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="big" @click="handleSave">保存</el-button>
                    <el-button size="big" @click="handleCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog> 
    </div>
</template>

<script>
import imgUpload from "@/components/upload/businessLicence-upload";
import { addPartnerAccount, partnerList, partnerRoleList } from "@/api/partner/account.js"
export default {
    components: { 
        imgUpload 
    },
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "添加账号",
            isAdd: 1,
            roleOptions: [], //角色列表
            partnerDeptOptions: [], //合作机构列表
            ruleForm: {
                deptId: "",
                number: "",
                name: "",
                sex: "",
                phone: "",
                roleList: [],
            },
            rules: {
                deptId: [
                    { required: true, message: '请选择合作机构', trigger: 'blur' },
                ],
                number: [
                    { required: true, message: '请输入工号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入合作机构员工手机号', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/,message: '请输入正确的手机号码', trigger: 'blur' }
                ],
                roleList: [
                    { required: true, message: '请选择角色', trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.getPartnerAndRoleList()
    },
    methods: {
        //获取合作机构和角色列表
        getPartnerAndRoleList() {
            partnerRoleList().then(res => {
                if (res.data.code == 0) {
                    this.roleOptions = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            partnerList().then(res => {
                if (res.data.code == 0) {
                    this.partnerDeptOptions = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        // 关闭弹窗
        handleCancel() {
            this.$confirm(`是否取消${this.isAdd == 1 ? '添加' : '编辑'}账号`, '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                this.handleClose()
            }).catch(action => {
                
            });
        },
        handleClose() {
            this.dialogVisible = false
            this.$refs.ruleForm.resetFields()
            this.ruleForm = {
                deptId: "",
                number: "",
                name: "",
                sex: "",
                phone: "",
                roleList: [],
            }
        },
        // 保存按钮
        handleSave() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    addPartnerAccount(this.isAdd, this.ruleForm).then(res => {
                        if (res.data.code == 0) {
                            this.handleClose()
                            this.$emit("getAllList")
                            this.$message.success(this.isAdd == 1? '添加成功！' : "编辑成功！")
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        changePhone() {
            this.$emit("changePhone", this.ruleForm)
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-input) {
    width: 360px;
}
:deep(.el-form) {
    display: flex;
    flex-direction: column;
    align-items: center;
}
:deep(.el-radio-group){
    width: 360px;
}
.changePhone{
    position: absolute;
    right: -85px;
    color: #409eff;
    cursor: pointer;
}
</style>
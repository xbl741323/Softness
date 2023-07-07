<template>
    <div>
        <el-form inline>
            <el-form-item label="关键字：">
                <el-input placeholder="机构名称/联系人姓名关键字/完整机构编号/手机号/证件号码" class="wid1" v-model="form.keyword" clearable></el-input>
            </el-form-item>
            <el-form-item label="机构类型：">
                <el-select v-model="form.partnerType">
                    <el-option label="全部" :value="''"></el-option>
                    <el-option label="单位" :value="2"></el-option>
                    <el-option label="个人" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="卧涛对接人：">
                <el-cascader @change="changeEngineer" :props="{value: 'customerId', label: 'label', emitPath: false }" :show-all-levels="false" filterable clearable :options="empList" ref="engineer" v-model="form.connectEmpId" :before-filter="beforeFilter">
                    <template slot-scope="{data}">
                        <el-tooltip class="item" effect="dark" placement="right" v-if="data.customerNo">
                            <div slot="content">{{data.customerNo}}</div>
                            <span>{{data.label}}</span>
                        </el-tooltip>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item label="添加时间：">
                <el-date-picker
                    style="width: 340px"
                    v-model="form.createTime"
                    type="datetimerange"
                    range-separator="~"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
            </el-form-item>
            <el-button size="small" type="warning" @click="resetList">重置</el-button>
            <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
        </el-form>
        <div class="button-group">
            <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加机构</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="handleToAccount">账号管理</el-button>
        </div>
        <avue-crud
            ref="crud"
            class="batch-choose"
            :data="tableData"
            :option="tableOption"
            :page.sync="page"
            @size-change="sizeChange"
            @current-change="currentChange"
        >
            <template slot="partnerAddress" slot-scope="scope">
                {{ scope.row.partnerAddress || '-' }}
            </template>
            <template slot="partnerType" slot-scope="scope">
                {{ scope.row.partnerType == 1 ? "个人" : "单位" }}
            </template>
            <template slot="sysBusinessGroupList" slot-scope="scope">
                {{ [scope.row.sysBusinessGroupList, repeatDeptOptions] | filterGroup }}
            </template>
            <template slot="menu" slot-scope="scope">
                <el-button type="text" @click="showTransferImg(scope.row.identifyUrl)">查看证件</el-button>
                <el-button type="text" @click="handldEdit(scope.row)">编辑</el-button>
            </template>
        </avue-crud>
        <!-- 预览 -->
        <div class="demo-image__preview image_fix_sty">
            <el-image 
                ref="preview"
                style="width: 0px; height: 0px"
                :src="preUrl" 
                :preview-src-list="srcList">
            </el-image>
        </div>
        <organizeDialog ref="organizeDialog" :repeatDeptOptions="repeatDeptOptions" :empList="empList" @getAllPartnerList="getAllPartnerList"></organizeDialog>
    </div>
</template>

<script>
import { tableOption } from "@/const/crud/partner/organize.js"
import organizeDialog from "@/components/partner/organizeDialog.vue"
import { getPartnerList } from "@/api/partner/partner.js"
import { repeatDeptList } from "@/api/admin/user";
import { getEmpList } from "@/api/clue/clue";
export default{
    components: {
        organizeDialog,
    },
    data() {
        return {
            imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
            tableData: [],
            tableOption: tableOption,
            repeatDeptOptions: [],
            connectEmp: {},
            dialogVisible: false,
            preUrl: "",
            srcList: [],
            empList: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
            },
            form: {
                keyword: "",
                partnerType: "",
                createTime: "",
                connectEmpId: "",
                connectEmpName: "",
            }
        }
    },
    filters: {
        //回显查重部门
        filterGroup(val) {
            let groupName = []
            let deptBusinessGroup = []
            val[0].forEach(item => {
                groupName.push(item.businessGroupName)
                deptBusinessGroup.push(item.businessGroupId)
            })
            let repeatDeptOptionsId = []
            val[1].forEach(item => {
                if (item.businessGroupName != "全部") {
                    repeatDeptOptionsId.push(item.id)
                }
            })
            if (deptBusinessGroup.sort().toString() == repeatDeptOptionsId.sort().toString()) {
                groupName = []
                groupName[0] = "全部"
            }
            return groupName.join(',')
        }
    },
    created() {
        if(sessionStorage.getItem(`${this.$route.path}`)){
            let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
            this.form.keyword = keepParams.params.keyword
            this.form.partnerType = keepParams.params.partnerType
            this.form.connectEmpId = keepParams.params.connectEmpId
            this.form.connectEmpName = keepParams.params.connectEmpName
            this.form.createTime = keepParams.params.time
            this.page.currentPage = keepParams.params.pageNo
            this.page.pageSize = keepParams.params.pageSize
        }
        this.getAllPartnerList()
        this.getRepeatDeptList()
        this.getDropList()
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
                        this.form.connectEmpId = item.data.customerId
                        this.form.connectEmpName = item.data.customerName
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
        //获取查重部门列表
        getRepeatDeptList(){
            repeatDeptList().then(res=>{
                if (res.data.code == 0) {
                    let allList = []
                    this.repeatDeptOptions = []
                    res.data.data.forEach(item => {
                        allList.push(item.id)
                    })
                    res.data.data.unshift({
                        businessGroupName: "全部",
                        id: allList.join(',')
                    })
                    this.repeatDeptOptions = res.data.data;
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //编辑合作机构
        handldEdit(val) {
            let deptBusinessGroup = []
            val.sysBusinessGroupList.forEach(item => {
                deptBusinessGroup.push(item.businessGroupId)
            });
            let repeatDeptOptionsId = []
            this.repeatDeptOptions.forEach(item => {
                if (item.businessGroupName != "全部") {
                    repeatDeptOptionsId.push(item.id)
                }
            })
            if (deptBusinessGroup.sort().toString() == repeatDeptOptionsId.sort().toString()) {
                deptBusinessGroup = []
                deptBusinessGroup[0] = this.repeatDeptOptions[0].id
            }
            if (val.identifyUrl) {
                setTimeout(() => {
                    this.$refs.organizeDialog.$refs.upload.imgList = []
                    this.$refs.organizeDialog.$refs.upload.imgList.push({
                        response:{
                            data: val.identifyUrl,
                        }
                    })
                }, 50)
            }
            
            this.$refs.organizeDialog.partnerType = val.partnerType
            this.$refs.organizeDialog.ruleForm = {
                id: val.id,
                partnerNo: val.partnerNo,
                partnerName: val.partnerName,
                contactName: val.contactName,
                contactMobile: val.contactMobile,
                identifyNo: val.identifyNo,
                partnerAddress: val.partnerAddress,
                deptBusinessGroup: deptBusinessGroup,
                connectEmpId: val.connectEmpId,
            }
            this.$refs.organizeDialog.dialogTitle = "编辑合作机构"
            this.$refs.organizeDialog.handleChangeRules()
            this.$refs.organizeDialog.isAdd = false
            this.$refs.organizeDialog.dialogVisible = true
        },
        sizeChange(val) {
            this.page.pageSize = val
            this.getAllPartnerList()
        },
        currentChange(val) {
            this.page.currentPage = val
            this.getAllPartnerList()
        },
        //搜索按钮
        handleSearch() {
            this.page.currentPage = 1
            this.getAllPartnerList()
        },
        //重置按钮
        resetList() {
            this.form = {
                keyword: "",
                partnerType: "",
                connectEmpId: "",
                connectEmpName: "",
                createTime: "",
            }
            this.getAllPartnerList()
        },
        //点击添加机构
        handleAdd() {
            this.$refs.organizeDialog.dialogVisible = true
            this.$refs.organizeDialog.dialogTitle = "添加合作机构"
            this.$refs.organizeDialog.partnerType = 2
            this.$refs.organizeDialog.ruleForm.deptBusinessGroup = []
            this.$refs.organizeDialog.ruleForm.deptBusinessGroup.push(this.repeatDeptOptions[0].id)
        },
        //查看证件
        showTransferImg(url){
            if (!url) {
                return this.$message.warning("暂未上传证件照片")
            }
            this.preUrl = this.imgUrl + url
            this.srcList = [
                this.preUrl,
                this.preUrl
            ]
            this.$refs.preview.showViewer = true
        },
        //获取合作机构列表
        getAllPartnerList() {
            let params = {
                keyword: this.form.keyword,
                partnerType: this.form.partnerType,
                connectEmpId: this.form.connectEmpId,
                connectEmpName: this.form.connectEmpName,
                startTime: this.form.createTime ? this.form.createTime[0] : "",
                endTime: this.form.createTime ? this.form.createTime[1] : "",
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
            }
            getPartnerList(params).then(res => {
                if (res.data.code == 0) {
                    // 需要缓存的参数
                    params.time = this.form.createTime
                    let keepParams = {
                        params: params
                    }
                    sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
                    this.tableData = res.data.data.records
                    this.page.total = res.data.data.total;
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleToAccount() {
            this.$emit("handleToAccount")
        },
    },
}
</script>

<style lang="scss" scoped>
.wid1{
    width: 360px;
}
.button-group{
    margin-bottom: 20px;
}
.image_fix_sty{
  position: absolute;
  top: 0;
  z-index: 10000;
}
</style>
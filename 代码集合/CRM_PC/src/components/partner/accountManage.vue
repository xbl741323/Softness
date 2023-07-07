<template>
    <div>
        <el-form inline>
            <el-form-item label="关键字：">
                <el-input placeholder="请输入员工姓名/合作机构或完整工号/手机号查询" class="wid1" v-model="form.keyword" clearable></el-input>
            </el-form-item>
            <el-form-item label="公众号：">
                <el-select v-model="form.subscriptionStatus">
                    <el-option label="全部" :value="null"></el-option>
                    <el-option label="已订阅" :value="1"></el-option>
                    <el-option label="未订阅" :value="0"></el-option>
                </el-select>
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
            <el-button type="primary" icon="el-icon-edit" @click="handleAdd">添加账号</el-button>
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
            <template slot="name" slot-scope="scope"> 
                <div class="common-contain" @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
                    <div class="common-flex" v-if="!scope.row.editName" @click="editName(scope.row)">
                        <span v-if="scope.row.name">{{ scope.row.name }}</span>
                        <i class="el-icon-edit" v-if="scope.row.repeatStatus == false"></i>
                    </div>
                    <template v-else>
                        <div class="common-flex">
                            <el-input v-focus maxlength="30" :ref="'deliverableNameInput' + scope.row.userId" 
                            @blur="updateName(scope.row)"
                            v-model="scope.row.name"
                            placeholder="请输入内容">
                            </el-input>
                        </div>
                    </template>
                </div>
            </template>
            <template slot="sex" slot-scope="scope">
                <div class="common-contain"  @mouseenter="showIcon(scope.row)" @mouseleave="closeIcon(scope.row)">
                    <div class="common-contain" v-if="scope.row.editSex">
                        <el-select style="width:60px !important" :ref="'input' + scope.row.userId" v-model="scope.row.sex" @change="updateSex(scope.row)" @blur="cancelEdit(scope.row)">
                            <el-option
                                v-for="item in [
                                    {'value': 1, 'label': '男'},
                                    {'value': 2, 'label': '女'},
                                ]"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="common-contain" v-else  @click="editSex(scope.row)">
                        {{ scope.row.sex | filterSex }}
                        <i class="el-icon-edit" v-if="scope.row.repeatStatus == false" ></i>
                    </div>
                </div>
            </template>
            <template slot="wx" slot-scope="scope">
                {{ scope.row.wx | filterWx }}
            </template>
            <template slot="lockFlag" slot-scope="scope">
                {{ scope.row.lockFlag | filterLock }}
            </template>
            <template slot="roleList" slot-scope="scope">
              <span v-for="(role, index) in scope.row.roleList" :key="index">
                <el-tag
                  style="cursor: pointer;"
                  @click="handlePermission(role, scope.row)">{{ role.roleName }}
                </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template slot="menu" slot-scope="scope">
                <el-button type="text" @click="handldEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleChangePwd(scope.row)">重置密码</el-button>
                <el-button type="text" @click="handleChangePhone(scope.row)">修改手机号</el-button>
                <el-button type="text" @click="getPartnerLogList(scope.row)">查看日志</el-button>
                <el-button type="text" @click="handleChangeDisable(scope.row)">
                    {{scope.row.lockFlag == 0 ? "禁用" : "启用"}}</el-button>
            </template>        
        </avue-crud>

        <!-- 添加/编辑弹窗 -->
        <accountDialog ref="accountDialog" @getAllList="getAllList" @changePhone="changePhone"></accountDialog>

        <!-- 查看角色弹窗 -->
        <el-dialog
            :visible.sync="dialogPermissionVisible"
            :close-on-click-modal="false"
            :title="roleTitle"
            center
        >
            <div class="dialog-main-tree">
                <div class="data_jurisdiction">菜单权限</div>
                <el-tree
                    ref="menuTree"
                    :data="treeDataRole"
                    :default-checked-keys="stateData"
                    disabled="true"
                    :check-strictly="false"
                    :props="{ 'label': 'name','value': 'id' }"
                    class="filter-tree"
                    node-key="id"
                    show-checkbox
                    highlight-current/>
            </div>
            <el-divider></el-divider>
            <div class="data_jurisdiction">数据权限</div>
            <table border class="table_sty" >
            <tr>
                <th>序号</th>
                <th>数据名称</th>
                <th>数据权限</th>
            </tr>
            <tr v-for=" (item,index) in dataJurisdiction" :key="item.id">
                <td>{{ index+1 }}</td>
                <td>{{ item.menuName }}</td>
                <td>{{item.dsPartnerType | filterDsPartnerType}}</td>
            </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button size="big" type="primary" @click="dialogPermissionVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        
        <!-- 重置密码弹窗 -->
        <el-dialog
            title="重置密码"
            ref="pwdDialog"
            :visible.sync="pwdDialogVisible"
            :close-on-click-modal="false"
            width="30%"
            :before-close="handleClose"
            @close="pwdDialogClose"
            center
        >
        <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules">
            <el-form-item label="验证码" label-width="130px" prop="code">
                <el-input v-model="pwdForm.code" class="com_wid_sty" readonly onfocus="this.removeAttribute('readonly')" autocomplete="off"></el-input>
                <el-button
                    size="small"
                    @click="getCode(1)"
                    :disabled="disabledObj1[accountInfo.userId]"
                    v-if="disabledObj1[accountInfo.userId] == false"
                >获取验证码</el-button>
                <el-button
                    size="small"
                    @click="getCode(1)"
                    :disabled="disabledObj1[accountInfo.userId]"
                    v-if="disabledObj1[accountInfo.userId] == true"
                >{{ btntxtObj1[accountInfo.userId] }}</el-button>
                <p class="com_color_sty">{{ statusMsgObj1[accountInfo.userId] }}</p>
                <div class="com_font_sty">
                    请输入尾号为{{ accountInfo.phone | phoneCut }}的手机号接收到的验证码
                </div>
            </el-form-item>
            <el-form-item label="请输入新密码：" label-width="130px" prop="newPassword">
                <el-input type="password" v-model="pwdForm.newPassword" style="width:80%;"></el-input>
            </el-form-item>
            <el-form-item
            label="确认新密码："
            label-width="130px"
            prop="checkPassword">
                <el-input type="password" v-model="pwdForm.checkPassword" style="width:80%;"></el-input>
            </el-form-item>
        </el-form>
        <div class="com_flex_sty">
            <el-button
            type="primary"
            class="com_right_sty"
            @click="editPwd">确认修改</el-button>
            <el-button @click="pwdDialogVisible = false">取消</el-button>
        </div>
        </el-dialog>

        <!-- 修改手机号 -->
        <el-dialog
            title="修改手机号"
            :visible.sync="phoneDialogVisible"
            :close-on-click-modal="false"
            width="30%"
            :before-close="handleClose"
            @close="phoneDialogClose"
            center>
            <el-form :model="phoneForm" ref="phoneForm" :rules="phoneRules">
                <el-form-item label="请输入账户密码：" label-width="135px" prop="password">
                    <el-input type="password" v-model="phoneForm.password" style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="新手机号：" label-width="135px" prop="phoneNumber">
                    <el-input v-model="phoneForm.phoneNumber" style="width:80%;" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="验证码：" label-width="135px" prop="code">
                    <el-input v-model="phoneForm.code" class="com_wid_sty"></el-input>
                    <el-button
                        size="small"
                        @click="getCode(0)"
                        :disabled="disabledObj[accountInfo.userId]"
                        v-if="disabledObj[accountInfo.userId] == false">获取验证码</el-button>
                    <el-button
                        size="small"
                        @click="getCode(0)"
                        :disabled="disabledObj[accountInfo.userId]"
                        v-if="disabledObj[accountInfo.userId]==true"
                        >{{ btntxtObj[accountInfo.userId] }}</el-button>
                    <p class="com_color_sty">{{ statusMsgObj[accountInfo.userId] }}</p>
                    <div class="com_font_sty">请输入新手机号接收到的验证码</div>
                </el-form-item>
            </el-form>
            <div class="com_flex_sty">
                <el-button
                type="primary"
                class="com_right_sty"
                @click="editPhone">确认修改</el-button>
                <el-button @click="phoneDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!-- 查看日志 -->
        <el-dialog
            title="修改手机号"
            :visible.sync="logDialogVisible"
            :close-on-click-modal="false"
            center>
            <avue-crud
                :data="logData"
                :option="logOption"
                :page.sync="logPage"
                @size-change="logSizeChange"
                @current-change="logCurrentChange"
            >
            </avue-crud>
        </el-dialog>
    </div>
</template>

<script>
import { tableOption, logOption } from "@/const/crud/partner/account.js"
import accountDialog from "@/components/partner/accountDialog.vue"
import { getMessage, editInfo, checkMessage} from "@/api/admin/user";
import { getPartnerAccountList, changeDisable, addPartnerAccount, partnerlogList, partnerRoleIdList } from "@/api/partner/account.js";
export default {
    components: {
        accountDialog,
    },
    data() {
        return {
            tableData: [],
            inicialData: [],
            stateData: [],
            disabled: false,
            treeDataRole: [],
            logData: [],
            logOption: logOption,
            time: 0,
            timer: null,
            btntxt: "60s后重新获取",
            tableOption: tableOption,
            dialogPermissionVisible: false,
            phoneDialogVisible: false,
            logDialogVisible: false,
            accountInfo: {},
            btntxtObj: {},
            disabledObj: {},
            statusMsgObj: {},
            timeObj: {},
            timerObj: {},
            btntxtObj1: {},
            disabledObj1: {},
            statusMsgObj1: {},
            timeObj1: {},
            timerObj1: {},
            dataJurisdiction: [],
            statusMsg: "",
            lastTime: new Date(),
            pwdDialogVisible: false,
            roleTitle: '',
            form: {
                keyword: null,
                subscriptionStatus: null,
                createTime: null,
            },
            pwdForm: {
                newPassword: "",
                checkPassword: "",
                code: "",
            },
            phoneForm: {
                password: "",
                phoneNumber: "",
                code: "",
            },
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
            },
            logPage: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
            },
            pwdRules: {
                newPassword: [
                    {
                        required: true,
                        message: "请输入6~16位字母/数字/符号（至少两种）组合密码",
                        pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
                        trigger: "blur",
                    },
                ],
                checkPassword: [
                    {
                        required: true,
                        message: "请输入6~16位字母/数字/符号（至少两种）组合密码",
                        pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
                        trigger: "blur",
                    },
                ],
                code: [
                    {
                        required: true,
                        message: "验证码不能为空",
                        trigger: "blur",
                    },
                ],
            },
            phoneRules: {
                password: [
                    {
                        required: true,
                        message: "请输入账户密码",
                        trigger: "blur",
                    },
                ],
                phoneNumber: [
                    {
                        required: true,
                        message: "请输入新手机号",
                        trigger: "blur",
                        pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                    },
                ],
                code: [
                    {
                        required: true,
                        message: "验证码不能为空",
                        trigger: "blur",
                    },
                ],
            },
        }
    },
    filters: {
        filterSex(val) {
            switch (val) {
                case 1:
                    return '男'

                case 2:
                    return '女'
            }
        },
        filterLock(val) {
            switch (val) {
                case "0":
                    return '正常'

                case "9":
                    return '锁定'
            }
        },
        filterWx(val) {
            switch (val) {
                case 0:
                    return '未关注'

                case 1:
                    return '已关注'
            }
        },
        filterDsPartnerType(val) {
            switch (val) {
                case "0":
                    return "全部"

                case "1":
                    return "自定义"

                case "2":
                    return "本合作商权限"
                    
                case "3":
                    return "本级"
            }
        },
        phoneCut(val) {
            if (val) {
                return val.substring(7, 11);
            }
        },
    },
    created() {
        if(sessionStorage.getItem(`${this.$route.path}-account`)){
            let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}-account`))
            this.form.keyword = keepParams.params.keyword
            this.form.subscriptionStatus = keepParams.params.wx
            this.form.createTime = keepParams.params.time
            this.page.currentPage = keepParams.params.pageNo
            this.page.pageSize = keepParams.params.pageSize
        }
        this.getAllList()
    },
    methods: {
        //编辑姓名
        updateName(row) {
            this.$set(row, "editName", false);
            let params = {
                name: row.name,
                userId: row.userId,
            }
            this.inicialData.forEach((item) => {
                if (row.userId == item.userId) {
                    if (row.name.split('').length > 8) {
                        this.$message.warning("员工姓名最多8个字符")
                        this.getAllList()
                        return
                    }
                    if (row.name == "" || row.name == item.name) {
                        this.getAllList()
                    } else {
                        this.editPartner(params)
                    }
                } else {
                    this.$set(item, "editName", false);
                }
            });
        },
        editName(row) {
            this.tableData.forEach((item) => {
                if (row.userId == item.userId) {
                    this.$set(item, "editName", true);
                } else {
                    this.$set(item, "editName", false);
                }
            });
        },
        //编辑性别
        updateSex(row) {
            let params = {
                sex: row.sex,
                userId: row.userId,
            }
            this.inicialData.forEach((item) => {
                if (row.userId == item.userId) {
                    if (row.sex == ""  || row.sex == item.sex) {
                        this.getAllList()
                    } else {
                        this.editPartner(params)
                    }
                } else {
                    this.$set(item, "editName", false);
                }
            });
        },

        editPartner(params) {
            addPartnerAccount(2,params).then(res => {
                if (res.data.code == 0) {
                    this.$message.success("编辑成功")
                    this.getAllList()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        editSex(row) {
            this.tableData.forEach((item) => {
                if (row.userId == item.userId) {
                    this.$set(item, "editSex", true);
                } else {
                    this.$set(item, "editSex", false);
                }
            });
            let that = this;
            setTimeout(() => {
                that.$refs["input" + row.userId].focus();
            }, 300);
        },
        showIcon(row){
            this.tableData.forEach((item) => {
                if (row.userId == item.userId) {
                    this.$set(row, "repeatStatus", false);
                }
            })
        },
        cancelEdit(row) {
            this.$set(row, "repeatStatus", true);
            setTimeout(() => {
                this.$set(row, "editSex", false);
            }, 300);
        },
        closeIcon(row){
            this.tableData.forEach((item) => {
                if (row.userId == item.userId) {
                    this.$set(row, "repeatStatus", true);
                }
            })
        },
        //获取日志列表
        getPartnerLogList(row) {
            let params = {
                current: this.logPage.currentPage,
                size: this.logPage.pageSize,
                createBy: row.username
            }
            partnerlogList(params).then(res => {
                if (res.data.code == 0) {
                    this.logData = res.data.data.records
                    this.logPage.total = res.data.data.total
                    this.logDialogVisible = true
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        logSizeChange(val) {
            this.logPage.pageSize = val
            this.getPartnerLogList()
        },
        logCurrentChange(val) {
            this.logPage.currentPage = val
            this.getPartnerLogList()
        },
        //搜索按钮
        handleSearch() {
            this.page.currentPage = 1
            this.getAllList()
        },
        //点击重置按钮
        resetList() {
            this.form = {
                keyword: null,
                subscriptionStatus: null,
                createTime: null,
            }
            this.getAllList()
        },
        // 获取账号列表
        getAllList() {
            let params = {
                keyword: this.form.keyword,
                wx: this.form.subscriptionStatus,
                beginTime: this.form.createTime ? this.form.createTime[0] : "",
                endTime: this.form.createTime ? this.form.createTime[1] : "",
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
            }
            getPartnerAccountList(params).then(res => {
                if (res.data.code == 0) {
                    // 需要缓存的参数
                    params.time = this.form.createTime
                    let keepParams = {
                        params: params
                    }
                    sessionStorage.setItem(`${this.$route.path}-account`,JSON.stringify(keepParams))
                    this.tableData = res.data.data.records
                    this.inicialData = []
                    res.data.data.records.forEach(item => {
                        this.inicialData.push({
                            userId: item.userId,
                            name: item.name,
                            sex: item.sex
                        })
                    })
                    this.page.total = res.data.data.total
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        throttle(fun, time){
            //函数执行时的时间
            let now = new Date()
            //两次调用的时间差
            if (now - this.lastTime > time){
                fun()
                //调用成功，上一次调用时间值修改
                this.lastTime = now
            }
        },
        // 编辑账号
        handldEdit(row) {
            let roleList = []
            row.roleList.forEach(item => {
                roleList.push(item.roleId)
            })
            this.$refs.accountDialog.ruleForm = {
                deptId: row.partnerId,
                number: row.number,
                name: row.name,
                sex: row.sex,
                phone: row.phone,
                username: row.username,
                roleList: roleList
            }
            this.$refs.accountDialog.isAdd = 2
            this.$refs.accountDialog.dialogTitle = "编辑账号资料"
            this.$refs.accountDialog.ruleForm.userId = row.userId
            this.$refs.accountDialog.dialogVisible = true
        },
        // 添加账号
        handleAdd() {
            this.$refs.accountDialog.dialogVisible = true
            this.$refs.accountDialog.isAdd = 1
            this.$refs.accountDialog.dialogTitle = "添加账号"
        },
        sizeChange(val) {
            this.page.pageSize = val
            this.getAllList()
        },
        currentChange(val) {
            this.page.currentPage = val
            this.getAllList()
        },
        // 重置修改密码表单
        pwdDialogClose() {
            this.$refs.pwdForm.resetFields()
        },
        // 重置修改手机号表单
        phoneDialogClose() {
            this.$refs.phoneForm.resetFields()
        },
        // 账号启禁用
        handleChangeDisable(row) {
            this.$confirm(`确定${row.lockFlag == 0 ? '禁用' : '启用'}账号`, '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    userId: row.userId,
                    username: row.username
                }
                changeDisable(row.lockFlag == 0 ? false : true, params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(row.lockFlag == 0 ? "禁用成功" : "启用成功")
                        this.getAllList()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(action => {
                
            });
        },
        //60S倒计时
        codeTime() {
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                for (const key in this.timeObj) {
                    if (Object.hasOwnProperty.call(this.timeObj, key)) {
                        this.$set(this.timeObj, key, this.timeObj[key] -= 1)
                    }
                }
                for (const key in this.timeObj1) {
                    if (Object.hasOwnProperty.call(this.timeObj1, key)) {
                        this.$set(this.timeObj1, key, this.timeObj1[key] -= 1)
                    }
                }
                if (this.timeObj[this.accountInfo.userId] > 0) {
                    this.$set(this.btntxtObj, this.accountInfo.userId, this.timeObj[this.accountInfo.userId] + "s后重新获取")
                } else {
                    this.$set(this.timeObj, this.accountInfo.userId, 0)
                    this.$set(this.btntxtObj, this.accountInfo.userId, "重新发送")
                    this.$set(this.disabledObj, this.accountInfo.userId, false)
                }
                if (this.timeObj1[this.accountInfo.userId] > 0) {
                    this.$set(this.btntxtObj1, this.accountInfo.userId, this.timeObj1[this.accountInfo.userId] + "s后重新获取")
                } else {
                    this.$set(this.timeObj1, this.accountInfo.userId, 0)
                    this.$set(this.btntxtObj1, this.accountInfo.userId, "重新发送")
                    this.$set(this.disabledObj1, this.accountInfo.userId, false)
                }
            }, 1000)
        },
        handleChangePwd(row) {
            this.pwdDialogVisible = true
            this.accountInfo = row
            if (!this.disabledObj1[this.accountInfo.userId]) {
                this.$set(this.disabledObj1,this.accountInfo.userId,false) 
            } else {
                this.$set(this.btntxtObj1, this.accountInfo.userId, this.timeObj1[this.accountInfo.userId] + "s后重新获取")
            }
        },
        handleChangePhone(row) {
            this.phoneDialogVisible = true
            this.accountInfo = row
            if (!this.disabledObj[this.accountInfo.userId]) {
                this.$set(this.disabledObj,this.accountInfo.userId,false)
            } else {
                this.$set(this.btntxtObj, this.accountInfo.userId, this.timeObj[this.accountInfo.userId] + "s后重新获取")
            }
        },
        changePhone(row) {
            setTimeout(() => {
                this.$refs.accountDialog.dialogVisible = false
            },80)
            this.phoneDialogVisible = true
            this.accountInfo = row
            if (!this.disabledObj[this.accountInfo.userId]) {
                this.$set(this.disabledObj,this.accountInfo.userId,false)
            } else {
                this.$set(this.btntxtObj, this.accountInfo.userId, this.timeObj[this.accountInfo.userId] + "s后重新获取")
            }
        },
        // 获取验证码
        getCode(num) {
            let number = "";
            if (num == 0) {
                if (this.phoneForm.phoneNumber == "") {
                    this.$message({
                        type: "warning",
                        message: "请输入新手机号",
                        offset:300
                    });
                    return;
                } else {
                    number = this.phoneForm.phoneNumber;
                }
            } else {
                number = this.accountInfo.phone;
            }
            getMessage(number).then((res) => {
                if (res.data.code == CodeMsg.CODE_1000) {
                    if (num == 0) {
                        if (!this.timeObj[this.accountInfo.userId]) {
                            this.$set(this.btntxtObj,this.accountInfo.userId, "60s后重新获取")
                            this.$set(this.timeObj,this.accountInfo.userId, 60)
                        }
                        this.$set(this.disabledObj,this.accountInfo.userId, true)
                        this.codeTime();
                    } else {
                        if (!this.timeObj1[this.accountInfo.userId]) {
                            this.$set(this.btntxtObj1,this.accountInfo.userId, "60s后重新获取")
                            this.$set(this.timeObj1,this.accountInfo.userId, 60)
                        }
                        this.$set(this.disabledObj1,this.accountInfo.userId, true)
                        this.codeTime();
                    }
                    return;
                }
                if (res.data.code == CodeMsg.CODE_1006) {
                    if (num == 0) {
                       this.$set(this.statusMsgObj,this.accountInfo.userId,"短信接口出错,请稍候再试!") 
                    } else {
                       this.$set(this.statusMsgObj1,this.accountInfo.userId,"短信接口出错,请稍候再试!") 
                    }
                    return;
                }
                if (res.data.code == CodeMsg.CODE_1001) {
                    if (num == 0) {
                        this.$set(this.statusMsgObj,this.accountInfo.userId,"发送次数超过限制")
                    } else {
                        this.$set(this.statusMsgObj1,this.accountInfo.userId,"发送次数超过限制")
                    }
                    return;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //修改密码
        editPwd() {
            this.$refs["pwdForm"].validate((val) => {
                if (val) {
                    if (this.pwdForm.newPassword == this.pwdForm.checkPassword) {
                        this.checkCode(1);
                    } else {
                        this.$message({
                            type: "warning",
                            message: this.$t("message.pwdIsDiffer"),
                            offset:300
                        });
                    }
                }
            });
        },
        //修改手机号
        editPhone() {
            this.$refs["phoneForm"].validate((val) => {
                if (val) {
                    this.checkCode(0);
                }
            });
        },
        // 校验验证码
        checkCode(num) {
            let param = {};
            if (num == 0) {
                param = {
                    phone: this.phoneForm.phoneNumber,
                    code: this.phoneForm.code,
                };
            } else {
                param = {
                    phone: this.accountInfo.phone,
                    code: this.pwdForm.code,
                };
            }
            this.throttle(() => {
                //1000ms内无论点击多少下，只会调用一次
                checkMessage(param).then((res) => {
                    if (res.data.code == CodeMsg.CODE_1000) {
                        if (num == 0) {
                            this.setPhone();
                        } else {
                            this.editInfo1();
                        }
                    } else if (res.data.code == CodeMsg.CODE_1001) {
                        this.$message({
                            type: "warning",
                            message: "验证码错误",
                            offset: 300,
                        });
                    } else if (res.data.code == CodeMsg.CODE_1003) {
                        this.$message({
                            type: "warning",
                            message: res.data.data,
                            offset: 300,
                        });
                    }
                });
            }, 2000)
        },
        // 修改密码
        editInfo1(num) {
            let roleList = []
            this.accountInfo.roleList.forEach(item => {
                roleList.push(item.roleId)
            })
            let params = {
                password: this.pwdForm.newPassword,
                userId: this.accountInfo.userId,
            };
            addPartnerAccount(2, params).then((res) => {
                if (res.data.code == 0) {
                    this.$message({
                        type: "success",
                        message: "修改密码成功",
                        offset:300
                    });
                    this.pwdDialogClose()
                    this.pwdDialogVisible = false;
                } else {
                    this.$message.error(res.data.msg)
                }
            });
        },
        // 修改手机号
        setPhone() {
            let params = {
                password: this.phoneForm.password,
                number: this.accountInfo.number,
                phone: this.phoneForm.phoneNumber,
                userId: this.accountInfo.userId,
                username: this.accountInfo.username,
            };
            editInfo(params).then((res) => {
                if (res.data.code == CodeMsg.CODE_0) {
                    this.$message({
                        type: "success",
                        message: "修改成功！",
                        offset: 300,
                    });
                    this.phoneDialogVisible = false;
                    this.phoneDialogClose()
                } else {
                    this.$message({
                        type: "warning",
                        message: res.data.msg,
                        offset: 300,
                    });
                }
            });
        },
        handleClose(done) {
            done();
        },
        //查看角色权限
        handlePermission(role, row) {
            this.roleTitle = `查看权限-${row.name}（${role.roleName}）`
            this.dialogPermissionVisible = true
            partnerRoleIdList({roleId: role.roleId}).then(res => {
                if (res.data.code == 0) {
                    this.treeDataRole = []
                    res.data.data.menuList.forEach(item => {
                        item.disabled = true
                        this.disabledLoop(item)
                    })
                    this.stateData = res.data.data.menuIdList
                    this.treeDataRole = res.data.data.menuList
                    this.dataJurisdiction = res.data.data.sysRoleDataVOList
                }
                
            })
        },
        //循环禁用权限
        disabledLoop(val) {
            if (val.children) {
                val.disabled = true
                val.children.forEach(item => {
                    item.disabled = true
                    this.disabledLoop(item)
                });
            }
        },
    },
    beforeDestroy() {
        //清除计时器
        clearInterval(this.timer)
    },
}
</script>

<style lang="scss" scoped>
.wid1{
    width: 340px;
}
.button-group{
    margin-bottom: 20px;
}
.com_wid_sty{
  width:40%;
  margin-right:30px;
}
.com_right_sty{
  margin-right:50px;
}
.com_font_sty{
  font-size:12px;
  color:#FF6600;
}
.com_color_sty{
  color:red;
}
.com_flex_sty{
  display:flex;
  justify-content:center;
  margin-top:20px;
}
.table_sty{
  color: #000;
  width: 100%;
}
.table_sty tr>th:first-child{
  width: 10%;
}
.table_sty tr>td{   
  text-align: center;
}
.data_jurisdiction{
  color: #000;
  margin:10px 0;
}
.common-contain{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
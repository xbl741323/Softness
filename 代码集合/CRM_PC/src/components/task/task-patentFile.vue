<template>
    <basic-container>
        <div
            v-loading="loading"
            :element-loading-text="promtMessage"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-form inline>
                <el-form-item label="关键字：">
                    <el-input
                        style="width:320px"
                        v-model="fileForm.keyWords"
                        placeholder="请输入专利名称/文件名关键字/精准申请号"
                    />
                </el-form-item>
                <el-form-item label="匹配状态：">
                    <el-select v-model="fileForm.status">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下证日：">
                    <el-date-picker
                    style="width:360px"
                    v-model="fileForm.uploadTime"
                    :unlink-panels="true"
                    type="daterange"
                    format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束时间"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="button-group">
                <el-button type="primary" :disabled="selectedList.length == 0" @click="filterTaskAuthority(2, isManage) ? handleDowloadBatch() : $notAuthorized()">批量下载</el-button>
                <el-button type="primary" :disabled="selectedList.length == 0" @click="filterTaskAuthority(3, isManage) ? handleDeleteBatch() : $notAuthorized()">批量删除</el-button>
                <el-button type="primary" @click="filterTaskAuthority(5) ? handleShowUpload() : $notAuthorized()" v-if="!isManage">上传文件</el-button>
            </div>
            <avue-crud
                ref="crud"
                class="batch-choose"
                :page.sync="page"
                :data="tableData"
                :option="tableOption"
                @size-change="sizeChange"
                @selection-change="selectionChange"
                @current-change="currentChange"
                @on-load="getList"
            >
                <template slot="fileName" slot-scope="scope">
                    <div class="fileName-class" @mouseenter="handleMouseenter(scope.row)" @mouseleave="handleMouseleave(scope.row)" v-if="scope.row.options != 1">
                        <div class="common_edit_table">
                            <span>{{ scope.row.fileName }}</span>
                            <span :class="['match-style',scope.row.status ? 'already-match':'non-match']">{{scope.row.status ? '已匹配':'未匹配'}}</span>
                        </div>
                        <div v-show="scope.row.show">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="下载"
                                placement="top-end"
                            >
                                <i class="el-icon-download" @click="handleDowload(scope.row)" v-if="filterTaskAuthority(2, isManage)"></i>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="删除"
                                placement="top-end"
                            >
                                <i class="el-icon-delete" @click="handleDelete([scope.row.id])" v-if="filterTaskAuthority(3, isManage)"></i>
                            </el-tooltip>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="重命名"
                                placement="top-end"
                            >
                                <i class="el-icon-edit" @click="editContent(scope.row)" v-if="filterTaskAuthority(4, isManage)"></i>
                            </el-tooltip>
                        </div>
                    </div>
                    <div v-if="scope.row.options == 1">
                        <input
                            type="text"
                            class="common_edit_box"
                            v-model="fileName"
                            v-focus
                            @blur="cancle(scope.row)"
                        />
                        <span class="common_suffix">{{'.' + scope.row.fileName.split(".")[scope.row.fileName.split(".").length - 1]}}</span>
                        <el-button
                            icon="el-icon-check"
                            :disabled="fileName.length < 1"
                            @click="handleEdit(scope.row)"
                        ></el-button>
                        <el-button
                            icon="el-icon-close"
                            @click="cancle(scope.row)"
                        ></el-button>
                    </div>
                </template>
                <template slot="applyTime" slot-scope="scope">
                    {{ scope.row.applyTime || '-' }}
                </template>
                <template slot="passTime" slot-scope="scope">
                    {{ scope.row.passTime || '-' }}
                </template>
                <template slot="patentType" slot-scope="scope">
                    {{ scope.row.patentType | filterPatentType }}
                </template>
                <template slot="createByName" slot-scope="scope">
                    <el-tooltip effect="dark" :content="'工号：' + empNo + ' 部门：' + deptName" placement="top">
                        <span @mouseover="showUserInfo(scope.row.createBy)">{{ scope.row.createByName }}</span>
                    </el-tooltip>
                </template>
                <template slot="sourceNo" slot-scope="scope">
                    <el-tooltip effect="dark" placement="top" :disabled="!scope.row.sourceNo">
                        <div slot="content">
                            {{'关联编号：' + scope.row.sourceNo}}
                            <i class="el-icon-document-copy" @click="handleCopy(scope.row.sourceNo)"></i>
                            <br/>
                            {{'关联名称：'+ scope.row.sourceName}}
                        </div>
                       <span>{{ scope.row.sourceNo ? scope.row.sourceNo : '-' }}</span>
                    </el-tooltip>
                </template>
            </avue-crud>
            <!-- 上传弹窗 -->
            <el-dialog
                v-if="dialogVisible"
                title="上传文件"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                center
            >
                <el-form>
                    <el-form-item label="文件类型：" required>
                        <el-select v-model="materialType" disabled>
                            <el-option
                            v-for="item in fileOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-upload
                            :disabled="fileList.length == 1"
                            class="upload-demo"
                            action
                            ref="upload"
                            :file-list="fileList"
                            :limit="1"
                            :accept="acceptList"
                            :auto-upload="false"
                            :on-change="OnChange"
                            :show-file-list="false"
                        >
                            <el-button size="small" type="primary" :disabled="fileList.length == 1">选择本地文件</el-button>
                            <div slot="tip" class="el-upload__tip">仅支持zip格式，最小单位压缩包包含一个pdf文件和一个配套的list文件，否则会无法进行客户和任务的匹配</div>
                        </el-upload>
                        <el-tooltip effect="dark" placement="top-start">
                            <div slot="content">
                                上传前请先确认已导入相应案件的
                                <br/>
                                申请号到任务中，否则，上传的文
                                <br/>
                                件/证书将无法匹配到
                            </div>
                            <span class="wenhao">?</span>
                        </el-tooltip>
                        <div v-for="(item, index) in fileList" :key="item.name" class="fileList-class">
                            <span>{{item.name}}</span>
                            <i class="el-icon-close icon-class" @click="deleteFile(index)"></i>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleUpload" :disabled="fileList.length == 0" v-preventReClick>确定</el-button>
                    <el-button @click="handleClose">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>

<script>
import { tableOption, manageOption} from "@/const/crud/documentLibrary/patentFile.js";
import { mapGetters } from "vuex";
import { paterntFileList, deleteFile, renameFile, importFile } from "@/api/task/index";
import JSZip from 'jszip';
export default {
    props: {
        isManage: {
            type: Boolean
        }
    },
    data() {
        return {
            loading: false,
            promtMessage: "",
            tableOption: tableOption,
            tableData: [],
            selectedList: [],
            dialogVisible: false,
            suffix: "",
            fileName: "",
            linkUrl: process.env.VUE_APP_IMAGE_BASEURL,
            fileList: [],
            acceptList: ".zip",
            materialType: 6,
            fileOptions: [
                {
                    value: 1,
                    label: "案件材料",
                },
                {
                    value: 2,
                    label: "受理通知书",
                },
                {
                    value: 3,
                    label: "受理缴费文件",
                },
                {
                    value: 4,
                    label: "授权通知书",
                },
                {
                    value: 5,
                    label: "授权缴费文件",
                },
                {
                    value: 6,
                    label: "证书",
                },
                {
                    value: 7,
                    label: "中间文件",
                },
            ],
            fileForm: {
                keyWords: "",
                status: null,
                uploadTime: "",
            },
            options: [],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 20, // 每页显示多少条
                pageSizes:[5,8,10,20,30,50,100]
            },
        }
    },
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    },
    filters: {
        filterPatentType(val) {
            switch(Number(val)) {
                case 0:
                    return "发明"
                
                case 1:
                    return "实用"
                
                case 2:
                    return "外观"
            }
        }
    },
    computed: {
        ...mapGetters(["permissions"])
    },
    created() {
        if(sessionStorage.getItem(`${this.$route.path}`)){
            let keepParams =JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
            this.fileForm.keyWords = keepParams.keyword
            this.fileForm.status = keepParams.status
            this.fileForm.uploadTime = keepParams.time
        }
        let options1 = [{
                value: null,
                label: "全部",
            },{
                value: 0,
                label: "未匹配",
            },{
                value: 1,
                label: "已匹配",
            }]
        let options2 = [{
                value: 0,
                label: "未匹配",
            },{
                value: 1,
                label: "已匹配",
            }]
        this.tableOption = this.isManage ? manageOption : tableOption
        this.options = this.isManage ? options1 : options2
        this.fileForm.status = this.isManage ? null : 0
    },
    methods: {
        handleCopy(val) {
            let copyInput = document.createElement('input');
            document.body.appendChild(copyInput);
            copyInput.setAttribute('value', val);
            copyInput.select();
            document.execCommand("Copy");
            this.$message.success("关联编号已复制！");
            copyInput.remove();
        },
        filterTaskAuthority(type, isManage) {
            const permissions = this.permissions;
            if (isManage) {
                switch (type) {
                    case 1:
                        return permissions.bt_patent_file_page; //列表查看
                    case 2:
                        return permissions.bt_patent_file_download; //下载文件
                    case 3:
                        return permissions.bt_patent_file_delete; //删除文件
                    case 4:
                        return permissions.bt_patent_file_edit; //重命名
                    default:
                        return false;
                }
            } else {
                switch (type) {
                    case 1:
                        return permissions.bt_my_patent_file_page; //列表查看
                    case 2:
                        return permissions.bt_my_patent_file_download; //下载文件
                    case 3:
                        return permissions.bt_my_patent_file_delete; //删除文件
                    case 4:
                        return permissions.bt_my_patent_file_edit; //重命名
                    case 5:
                        return permissions.bt_my_patent_file_upload; //文件上传
                    default:
                        return false;
                }
            }
        },
        handleMouseenter(val) {
            this.$set(val, "show", true)
        },
        handleMouseleave(val) {
            this.$set(val, "show", false)
        },
        handleSearch() {
            this.page.currentPage = 1
            this.$refs.crud.toggleSelection()
            this.getList()
        },
        handleReset() {
            this.fileForm = {
                keyWords: "",
                uploadTime: "",
            }
            this.fileForm.status = this.isManage ? null : 0
            this.getList()
        },
        editContent(val) {
            this.$set(val, "options", 1)
            this.fileName = val.fileName.split(".").slice(0, -1).join(".")
            this.suffix = val.fileName.split(".")[val.fileName.split(".").length - 1];
        },
        handleEdit(val) {
            let params = {
                id: val.id,
                fileName: this.fileName + "." + this.suffix
            }
            renameFile(params, this.isManage).then(res => {
                if (res.data.code == 0) {
                    this.$message.success("修改成功！")
                    this.getList()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        cancle(val) {
            //防止失焦在click前触发
            setTimeout(() => {
                this.$set(val, "options", null)
            }, 200);
        },
        handleDowloadBatch() {
            const zip = new JSZip();
            this.selectedList.forEach((item, i) => {
                const url = this.linkUrl + item.fileUrl;
                fetch(url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        // 根据文件名和文件内容创建一个新的文件对象
                        const fileName = url.substring(url.lastIndexOf('/') + 1);
                        zip.file(fileName, blob);

                        // 最后一个文件下载完成后，将压缩包下载到本地
                        if (i === this.selectedList.length - 1) {
                            zip.generateAsync({ type: 'blob' }).then((content) => {
                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(content);
                                link.download = '专利文件.zip'; // 文件名
                                document.body.appendChild(link);
                                link.click();
                                this.$message.success("下载成功！")
                                this.$refs.crud.toggleSelection()
                            });
                        }
                    }).catch((err) => console.error(err));
            })
        },
        handleDowload(val) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", this.linkUrl + val.fileUrl, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (xhr.status === 200) {
                    // 获取响应中的Blob对象
                    const blob = xhr.response;
                    // 创建一个隐藏的 <a> 元素
                    const link = document.createElement("a");
                    link.style.display = "none";
                    // 创建一个包含文件名的Blob对象
                    const blobWithFileName = new Blob([blob], {
                        type: "application/octet-stream"
                    });
                    const blobUrl = window.URL.createObjectURL(blobWithFileName);
                    // 设置下载文件的URL和文件名
                    link.href = blobUrl;
                    link.download = val.fileName;
                    // 将 <a> 元素添加到页面中
                    document.body.appendChild(link);
                    // 触发点击事件，开始下载
                    link.click();
                    // 清理 <a> 元素和URL对象
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                    this.$message.success("下载成功！")
                }
            };
            xhr.send();
        },
        handleDeleteBatch() {
            let list = []
            this.selectedList.forEach(item => {
                list.push(item.id)
            })
            this.handleDelete(list)
        },
        handleDelete(list) {
            this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFile(list, this.isManage).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success("删除成功！")
                        this.$refs.crud.toggleSelection()
                        this.getList()
                    }
                })
            }).catch(() => {       
            });
        },
        
        handleShowUpload() {
            this.dialogVisible = true
        },
        handleUpload() {
            let formData = new FormData();
            formData.append('file', this.fileList[0].raw);
            formData.append('materialType', this.materialType);
            importFile(formData).then(res => {
                if (res.data.code == 0) {
                    this.$message.success("上传成功！")
                    this.getList()
                    this.$refs.crud.toggleSelection()
                    this.handleClose()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleClose() {
            this.dialogVisible = false
            this.fileList = []
        },
        sizeChange(val) {
            this.page.pageSize = val
            this.getList()
        },
        selectionChange(val) {
            this.selectedList = JSON.parse(JSON.stringify(val))
        },
        currentChange(val) {
            this.page.currentPage = val
            this.getList()
        },
        getList() {
            let params = {
                keyword: this.fileForm.keyWords,
                status: this.fileForm.status,
                startTime: this.fileForm.uploadTime ? this.$moment(this.fileForm.uploadTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                endTime: this.fileForm.uploadTime ? this.$moment(this.fileForm.uploadTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                pageSize: this.page.pageSize,
                pageNo: this.page.currentPage,
            }
            paterntFileList(params, this.isManage).then(res => {
                if (res.data.code == 0) {
                    params.time = this.fileForm.uploadTime
                    sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(params))
                    this.tableData = res.data.data.records
                    this.page.total = res.data.data.total
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        OnChange(file, fileList) {
            this.fileList = fileList
        },
        deleteFile(i) {
            this.fileList.splice(i, 1)
        },
    }
}
</script>

<style scoped>
.match-style{
    margin-left: 12px;
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
}
.non-match{
    background:coral;
}
.already-match{
    background: mediumseagreen;
}
.button-group{
    margin-bottom: 15px;
}
.el-upload__tip{
    line-height: 16px;
}
.icon-class{
    margin-left: 15px;
    margin-top: 5px;
    cursor: pointer;
}
.fileName-class{
    display: flex;
    justify-content: space-between;
}
.common_edit_table {
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
.item{
    margin: 0 5px;
    cursor: pointer;
}
.common_edit_box{
    width: 250px;
    line-height: 25px;
    margin-right: 3px;
    border: 1px solid #eee;
    padding: 7px 15px;
}
.common_suffix{
    margin-right: 3px;  
}
.fileList-class{
    margin-top: 10px;
}
.wenhao{
    display: inline-block;
    border: 1px solid #777;
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 14px;
    border-radius: 10px;
    position: absolute;
    top: 0px;
    left: 107px;
    font-size: 10px;
    color: #777;
}
</style>
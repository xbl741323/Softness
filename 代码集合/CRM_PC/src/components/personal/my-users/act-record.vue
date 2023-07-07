<template>
  <div class="act_records">
    <!-- 我的用户活动记录列表 -->
    <div class="handle-classify">
      <el-radio-group v-model="actType" @change="changeType">
        <el-radio-button :label="0">用户跟进({{ recordInfo.followUp }})</el-radio-button>
        <el-radio-button class="radio_sty" :label="1">用户编辑({{ recordInfo.distributionOrTransfer }})</el-radio-button>
      </el-radio-group>
    </div>
    <el-form
      v-model="filters"
      class="form_sty"
      inline
      @keyup.enter.native="getAllList()"
      v-if="actType == 0">
      <el-form-item label="关键字：" label-width="100px">
        <el-input
          style="width: 300px"
          placeholder="请输入操作人姓名或活动内容关键字"
          v-model="filters.kerWords">
        </el-input>
      </el-form-item>
      <el-form-item label="操作时间：" label-width="100px">
        <el-date-picker
          v-model="filters.activeTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" style="margin-left: 10px" @click="getAllList">搜索</el-button>
      <el-button style="margin-left: 10px" @click="reset">重置</el-button>
    </el-form>
    <!-- 列表 -->
    <el-button
      v-if="actType == 0"
      type="primary"
      style="margin-left: 20px"
      @click="NewFollowUp">用户跟进</el-button>
    <div class="table-distance" v-if="actType == 0">
      <el-table :data="dataList" border style="width: 93%">
        <el-table-column prop="gmtCreate" label="创建时间" width="150px">
        </el-table-column>
        <el-table-column prop="operateEmpName" label="操作人" width="150px">
          <template slot-scope="scope">
            <div class="disbale_content">
              <el-tooltip effect="dark" :content=" '工号：' + scope.row.operateEmpNo + ' 部门：' + scope.row.operateEmpDeptName" placement="right">
                <span>{{ scope.row.operateEmpName }}</span>
              </el-tooltip>
              <img v-if="scope.row.operateEmpLockFlag !== null && scope.row.operateEmpLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt=""/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template slot-scope="scope">
            <div class="content_sty" v-if="scope.row.activityType == 0">
              <ul class="li_sty">
                <li>跟进方式：{{ scope.row.followTypeName }}</li>
                <li>跟进内容：{{ scope.row.followContent }}</li>
                <li v-if="scope.row.nextFollowTime != null">
                  下次跟进时间：{{ scope.row.nextFollowTime }}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="clueFile" label="附件">
          <template slot-scope="scope">
            <li v-if="scope.row.clueFile.length !== 0" class="file_over">
              <div
                v-for="(item, index) in scope.row.clueFile"
                :key="index"
                class="span_sty">
                <el-tooltip
                  effect="dark"
                  :content="item.clueFileName"
                  placement="right">
                  <span class="dow_sty" @click="previewPdf(item)">{{  item.clueFileName }}</span>
                </el-tooltip>
              </div>
            </li>
          </template>
        </el-table-column>
        <el-table-column prop="gmtModifed" label="更新时间" width="150">
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.activityType == 0"
              class="operate"
              @click="editFollow(scope.row)">编辑</el-button>
            <span v-else class="operateSpan">--</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="total > 20"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        :total="total"
        style="float: right; margin-top: 20px; margin-right: 80px">
      </el-pagination>
    </div>
    <user-allot v-if="actType == 1" :type="0" :id="this.id"></user-allot>
    <!-- 跟进操作弹框 -->
    <el-dialog :visible.sync="followVisible" title="用户跟进" width="40%">
      <follow-operate
        :key="+new Date()"
        :visible.sync="followVisible"
        @changeVisible="changeVisible"
        :createType="0"
        :userInfo="userData"/>
    </el-dialog>
    <!-- 编辑跟进操作弹框 -->
    <el-dialog :visible.sync="editVisible" title="用户跟进" width="40%">
      <el-form
        :visible.sync="editVisible"
        :model="addForm"
        ref="addForm"
        inline
        :rules="rules"
        label-width="100px">
        <el-form-item label="跟进方式：" prop="followType">
          <el-select v-model="addForm.followType">
            <el-option
              v-for="item in followStyleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容：" prop="followContent">
          <el-input
            class="content"
            maxlength="500"
            rows="8"
            show-word-limit
            v-model="addForm.followContent"
            type="textarea"
            clearable>
          </el-input>
        </el-form-item>
        <div>
          <el-form-item label="附件：" prop="file">
            <el-upload
              class="upload-demo"
              action
              ref="upload"
              :file-list="fileList"
              :before-close="cancel"
              :on-remove="handleRemove"
              multiple
              :limit="5"
              :on-exceed="handleExceed"
              :before-remove="beforeRemove"
              :on-change="OnChange"
              :auto-upload="false">
              <el-button size="small" type="primary">选择本地文件</el-button>
              <span style="color: #888; margin-left: 10px">当前限制选择5个文件</span>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="下次跟进："
            prop="followNext"
            style="display: flex">
            <el-date-picker
              align="right"
              v-model="addForm.followNext"
              type="date"
              :picker-options="expireTimeOption"
              placeholder="下次跟进时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="btn-footer">
        <el-button type="primary" @click="setInfo()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span>
        <img class="pre_sty" :src="imgBaseUrl + clueFileUrl" alt="加载失败" />
      </span>
    </el-dialog>

    <el-dialog :visible="showDoc == true || showPdf == true || showVideo == true || previewImg == true"
      :show-close="true"
      :width="'80%'"
      class="dialog-div-pre-style"
      :before-close="closePreviewClick"
      center>
      <div v-if="previewImg == true">
        <img class="pre_sty" :src="previewFileUrl" alt="" />
      </div>
      <div v-if="showDoc == true" class="dialog-body-content-base-style">
        <iframe frameborder="0" :src="previewFileUrl" width="100%"> </iframe>
      </div>
      <div
        v-else-if="showPdf == true"
        class="dialog-body-content-base-style"
        style="justify-content: center; align-items: center">
        <object :data="previewFileUrl" style="width: 100%; height: 100%" />
      </div>
      <div
        v-else-if="showVideo == true"
        class="dialog-body-content-base-style"
        style="justify-content: center; align-items: center">
        <video-player
          class="video-player vjs-custom-skin"
          ref="positiveVideoPlayer"
          :playsinline="true"
          :options="positivePlayerOptions">
        </video-player>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getActList, downFile } from "@/api/admin/user";
import {
  getFollowup,
  comFollowup,
  comNewFollowup,
} from "@/api/personal/myusers";
import userAllot from "@/components/user/user-allot";
import * as CodeMsg from "@/api/common/CodeChange"
import followOperate from "@/components/personal/my-users/follow-up";
export default {
  props: ["id", "userData"],
  components: { followOperate, userAllot },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      showDoc: false,
      showPdf: false,
      showVideo: false,
      previewImg: false,
      previewFileUrl: "",
      fileUrl: "",
      images: [],
      clueFileUrl: "",
      imgBaseUrl: process.env.NODE_ENV === "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
      recordInfo: {},
      fileList: [],
      dialogVisible: false,
      addForm: {
        followType: "",
        file: "",
        followContent: "",
        followTypeName: "",
        followNext: "",
      },
      rowId: "",
      rules: {
        followType: [
          { required: true, message: "请选择线跟进方式", trigger: "change" },
        ],
        followContent: [
          { required: true, message: "请选择跟进内容", trigger: "blur" },
        ],
      },
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      followStyleList: [],
      recordInfo: {},
      followVisible: false,
      editVisible: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      actType: 0,
      filters: {
        kerWords: "",
        activeTime: null,
      },
      dataList: [],
    };
  },
  methods: {
    reset() {
      this.filters.kerWords = "";
      this.filters.activeTime = null;
      this.getAllList();
    },
    // 附件图片预览
    previewPdf(row) {
      let type = this.iconByType(row);
      this.fileUrl = row.clueFileUrl;
      this.previewFileUrl = this.imgBaseUrl + row.clueFileUrl;
      if (type.indexOf("pdf") != -1) {
        window.open(this.previewFileUrl);
      } else if (
        type.indexOf("jpg") != -1 ||
        type.indexOf("png") != -1 ||
        type.indexOf("jpeg") != -1
      ) {
        this.previewImg = true;
      } else {
        this.downFile(row);
      }
    },
    iconByType(row) {
      return row.clueFileName.substring(
        row.clueFileName.lastIndexOf(".") + 1,
        row.clueFileName.length
      );
    },
    closePreviewClick() {
      if (this.showDoc == true) {
        this.showDoc = false;
      } else if (this.showPdf == true) {
        this.showPdf = false;
      } else if (this.showVideo == true) {
        this.showVideo = false;
      } else if (this.previewImg == true) {
        this.previewImg = false;
      }
    },
    downFile(file) {
      let params = {
        filename: file.clueFileName,
        url: file.clueFileUrl,
      };
      downFile(params).then((res) => {
        console.log(res, "blob");
        let blob = new Blob([res.data]);
        console.log(blob, "blob3");
        let objectUrl = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = objectUrl;
        a.download = file.clueFileName;
        a.click();
      });
    },
    //up-loade操作
    OnChange(file, fileList) {
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        this.$message.error(file.name + "已经存在!");
        fileList.pop();
      }
      this.fileList = fileList;
      let names = [];
      for (let i = 0; i < this.fileList.length; i++) {
        names.push({ name: fileList[i].name });
        if (this.fileList[i].size) {
          var isLt2M = this.fileList[i].size / 1024 / 1024 < 20;
          if (!isLt2M) {
            this.$message({
              message: "上传文件大小不能超过 20MB!",
              type: "warning",
              offset: 300,
            });
            this.fileList.splice(this.fileList.indexOf(this.fileList[i]), 1);
          }
        }
        if (
          this.fileList[i].name.substring(
            0,
            this.fileList[i].name.lastIndexOf(".")
          ).length > 32
        ) {
          this.$message({
            message: "文件名不能超过32字",
            type: "warning",
            offset: 300,
          });
          this.fileList.splice(this.fileList.indexOf(this.fileList[i]), 1);
        }
      }
      this.fileName = this.unique(names);
      this.tempraoryList = []; //置空临时数组
      for (let i = 0; i < this.fileList.length; i++) {
        this.tempraoryList.push(
          //添加临时文件列表
          {
            name: this.fileList[i].name,
            options: null,
            uid: this.fileList[i].uid,
          }
        );
      }
    },
    unique(names) {
      const res = new Map();
      return names.filter(
        (names) => !res.has(names.name) && res.set(names.name, 1)
      );
    },
    //附件
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        cancelButtonClass: "btn-custom-cancel",
      });
    },
    handleRemove(file, fileList) {
      let index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择5个文件`);
    },
    cancel() {
      this.fileList = [];
      this.addForm = {
        followType: "",
        file: "",
        followContent: "",
        followTypeName: "",
        followNext: "",
      };
      this.$refs["addForm"].resetFields();
      this.editVisible = false;
    },
    setInfo() {
      this.followStyleList.forEach((item) => {
        if (item.id == this.addForm.followType) {
          this.addForm.followTypeName = item.name;
        }
      });
      this.$refs["addForm"].validate((val) => {
        var fileIdList = [];
        let params = new FormData();
        if (val) {
          if (this.fileList.length > 0) {
            this.fileList.forEach((file) => {
              console.log();
              if (file.raw) {
                //本地上传文件
                params.append("files", file.raw, file.name);
              } else {
                //后端返回文件
                fileIdList.push(file.id);
              }
            });
            params.append("fileIdList", fileIdList);
          }
          if (this.addForm.followNext) {
            params.append(
              "nextFollowTime",
              this.$moment(this.addForm.followNext).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
          params.append("id", this.rowId);
          params.append("mobilephone", this.userData.accountNo);
          params.append("activityType", 0);
          params.append("userType", 1);
          params.append("followTypeId", this.addForm.followType);
          params.append("followTypeName", this.addForm.followTypeName);
          params.append("followContent", this.addForm.followContent);
          comNewFollowup(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "跟进成功",
                offset: 300,
              });
            } else {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
            }
            this.fileList = [];
            this.changeVisible();
          });
        }
      });
    },
    getDropData() {
      //获取下拉框数据
      let number = "15ea644a8fa2470b933e303dbc7fe19e";
      getFollowup(number)
        .then((res) => {
          this.followStyleList = res.data.data[0].options;
          console.log(this.followStyleList, "followup2");
        })
        .catch((err) => {
          return err;
        });
    },
    //跟进取消按钮
    changeVisible() {
      this.followVisible = false;
      this.editVisible = false;
      this.getAllList();
    },
    //跟进按钮操作
    NewFollowUp() {
      this.followVisible = true;
    },
    //编辑按钮
    editFollow(row) {
      this.fileList = [];
      this.editVisible = true;
      this.rowId = row.id;
      this.addForm.followType = row.followTypeId;
      this.addForm.followContent = row.followContent;
      this.addForm.followNext = row.nextFollowTime;
      row.clueFile.forEach((item, i) => {
        this.fileList.push(item);
        this.$set(this.fileList[i], "name", item.clueFileName);
      });
    },
    addClue() {
      this.dialogVisible = true;
    },
    changeType() {
      if (this.actType == 0) {
        this.getAllList();
      }
    },
    getAllList() {
      this.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        userType: 1,
        userId: this.$route.query.id,
        size: this.pageSize,
        current: this.currentPage,
        activityType: 0,
        keywords: this.filters.kerWords.trim(),
        startTime:
          this.filters.activeTime == null
            ? ""
            : this.$moment(this.filters.activeTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
        endTime:
          this.filters.activeTime == null
            ? ""
            : this.$moment(this.filters.activeTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
      };
      getActList(params).then((res) => {
        this.recordInfo = res.data.data;
        this.dataList = res.data.data.list.records;
        this.total = res.data.data.list.total;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
  },
  mounted() {
    this.getList();
    this.getDropData();
  },
};
</script>

<style scoped>
.dialog-body-content-base-style {
  height: 650px;
  width: 100%;
}
.btn-footer {
  text-align: right;
}
.operate-fram {
  width: 100%;
}
.contact {
  display: flex;
}
.operate {
  border: none;
  background: none;
  text-align: center;
  color: #409eff;
}
.operateSpan {
  display: block;
  text-align: center;
  color: #409eff;
}

.act_records {
  padding-bottom: 80px;
}
.form_sty {
  margin-top: 20px;
}
.radio_sty {
  margin-left: 20px;
  border-left: 1px solid #dcdfe6;
}
.button_sty {
  display: flex;
  width: 100%;
  justify-content: center;
}
.li_sty,
li {
  list-style: none;
  font-size: 12px !important;
}
.content_sty {
  display: flex;
  justify-content: space-between;
}
.dow_sty {
  margin-left: 10px;
  color: #409eff;
  cursor: pointer;
}
.content {
  width: 500px;
}
.btn-footer {
  text-align: right;
}
.pre_sty {
  width: 100%;
}
.handle-classify {
  margin: 0 0 20px 30px;
}
.table-distance {
  margin: 10px 0px 20px 20px;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
</style>
<style>
.act_records .el-textarea__inner {
  height: 150px;
  overflow-y: auto;
}
</style>

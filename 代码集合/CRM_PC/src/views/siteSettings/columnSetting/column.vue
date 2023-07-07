<template>
  <div class="banner">
    <div class="banner_head">
      <div>
        <h3 style="font-weight:normal;font-size:16px;margin-top:10px;">栏目设置（关于卧涛）</h3>
        <el-button
          size="small"
          type="primary"
          style="width:120px;margin-bottom:20px;"
          @click="showColumn"
        >添加栏目</el-button>
        <span style="margin-left:10px;font-size:14px;">栏目名称限制在2-6个字（2-12）个字符,栏目最多可显示15条；</span>
      </div>
    </div>
    <!-- +新增操作的dialog -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      center
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="columnInfo" ref="columnInfo" :rules="rules">
        <el-form-item label="栏目名称：" label-width="110px" prop="name">
          <el-input
            v-model="columnInfo.name"
            style="width:80%;"
            placeholder="2-6个字"
            @input="checkName"
          ></el-input>
        </el-form-item>
        <el-form-item label="栏目类型：" label-width="110px" prop="type">
          <el-radio v-model="columnInfo.type" label="0">图文内容(只能显示一篇文章）</el-radio>
          <el-radio v-model="columnInfo.type" label="1">文章列表(可以显示多篇文章）</el-radio>
        </el-form-item>
        <el-form-item label="显示状态：" label-width="110px" prop="status">
          <el-radio-group v-model="columnInfo.status">
            <el-radio label="1">显示</el-radio>
            <el-radio label="2">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top:-40px;">
        <el-button
          @click="operateColumn"
          style="margin-right:40px;margin-left:40px;width:100px;"
          type="primary"
        >确 定</el-button>
        <el-button @click="dialogFormVisible = false" style="width:100px;">取 消</el-button>
      </div>
    </el-dialog>
    <!-- table -->
    <el-table border :data="columnList" ref="columnList" highlight-current-row style="width:100%">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="栏目名称" align="center" width="260">
        <template slot-scope="scope">
          <span
            style="cursor:pointer;"
            @click="showInput(scope.row)"
            @mouseenter="showIndex = scope.$index"
            @mouseleave="showIndex = 9999"
            v-if="scope.row.showStatus == false"
          >{{ scope.row.name }}</span>
          <i class="el-icon-edit" style="margin-left:1px;" v-if="scope.$index == showIndex"></i>
          <el-input
            size="mini"
            v-if="showStatus == true&&showId == scope.row.id"
            v-model="scope.row.name"
            @input="checkNameById"
            style="width:150px;"
          ></el-input>
          <span style="margin-left:10px;" v-if="showStatus == true&&showId == scope.row.id">
            <el-button type="success" icon="el-icon-check" circle @click="submitUpdate(scope.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-close"
              circle
              @click="showStatus = false,scope.row.showStatus = false,getList()"
            ></el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="type" :formatter="columnFilter" label="栏目类型" align="center"></el-table-column>
      <el-table-column prop="createUser" label="创建人" align="center">
      <template slot-scope="scope">
      <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUser }}</span>
      </el-tooltip>
      </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.statusBoolean"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <!-- +编辑操作的dialog -->
          <el-dialog
            :title="title"
            :visible.sync="dialogFormVisible2"
            center
            width="30%"
            :close-on-click-modal="false"
          >
            <el-form :model="columnInfo" ref="columnInfo" :rules="rules">
              <el-form-item label="栏目名称：" label-width="110px" prop="name">
                <el-input
                  v-model="columnInfo.name"
                  style="width:80%;"
                  placeholder="2-6个字"
                  @input="checkNameById"
                ></el-input>
              </el-form-item>
              <el-form-item label="栏目类型：" label-width="110px" prop="type">
                <el-radio @change="changeType" v-model="columnInfo.type" :label="0">图文内容(只能显示一篇文章）</el-radio>
                <el-radio @change="changeType" v-model="columnInfo.type" :label="1">文章列表(可以显示多篇文章）</el-radio>
              </el-form-item>
              <el-form-item label="显示状态：" label-width="110px" prop="status">
                <el-radio-group v-model="columnInfo.status">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="2">不显示</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div slot="footer" style="margin-top:-40px;">
              <el-button
                @click="operateColumn"
                style="margin-right:40px;margin-left:40px;width:100px;"
                type="primary"
              >确 定</el-button>
              <el-button @click="dialogFormVisible2 = false" style="width:100px;">取 消</el-button>
            </div>
          </el-dialog>
          <!-- +编辑操作的dialog -->
          <span style="margin-right:20px;width:60px;display:inline-block;">
            <i
              class="el-icon-sort-down"
              style="font-size:22px;cursor:pointer;color:#409eff;"
              id="down"
              v-if="scope.$index!=(total-(currentPage-1)*pageSize-1)"
              @click="handleMoveDown(scope.$index,scope.row)"
            ></i>
            <i
              class="el-icon-sort-up"
              style="font-size:22px;cursor:pointer;color:#409eff;"
              id="up"
              v-if="!(currentPage==1&&scope.$index==0)"
              @click="handleMoveUp(scope.$index,scope.row)"
            ></i>
          </span>
          <el-button
            size="mini"
            type="text"
            @click="showEdit(scope.$index, scope.row)"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="deleteColumn(scope.$index, scope.row)"
            type="text"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total,sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[5, 8, 10, 20, 30,50,100]"
      style="float:right;margin-top:20px;margin-right:20px;"
    ></el-pagination>
  </div>
</template>


<script>
import {
  addColumn,
  editColumn,
  deleteColumn,
  getColumnList,
  moveColumn,
  checkName
} from "@/api/siteSettings/column";
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  data() {
    return {
      soleParams: {},
      showStatus: false,
      showId: "",
      showIndex: 9999,
      bannerVos: [],
      title: "",
      total: 40,
      pageSize: 20,
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      endRow: "",
      switchStatus: false,
      columnInfo: {
        name: "",
        type: "0",
        status: "1"
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入栏目名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择栏目类型",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择显示状态",
            trigger: "blur"
          }
        ]
      },
      columnList: []
    };
  },
  methods: {
    changeType(val){
      console.log(val,this.columnInfo.type,"old")
      if(val==0){
        this.$confirm("从列表类栏目改为图文类栏目，如有多篇文章状态为显示，将只保留显示排序第一篇的文章，是否确定更改？", "提示", {
          confirmButtonText: this.$t("button.confirm"),
          cancelButtonText: this.$t("button.cancel"),
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {
          this.columnInfo.type = 0
        }).catch(() => {
          this.columnInfo.type = 1
        });
      }
    },
    columnFilter(row){
      return row.type==1?"文章列表":"图文内容"
    },
    handleSizeChange(val){
    this.currentPage = 1
    this.pageSize = val
    this.getList()
    },
    getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    checkNameById(val) {
      let params = {
        name: val,
        id: this.showId
      };
      checkName(params).then(res => {
        if (res.data.code == CodeMsg.CODE_2000) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
        }
      });
    },
    checkName(val) {
      console.log(val, "输出栏目名称");
      let params = {
        name: val
      };
      checkName(params).then(res => {
        if (res.data.code == CodeMsg.CODE_2000) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
        }
      });
    },
    showInput(row) {
      row.showStatus = true;
      this.showId = row.id;
      this.showStatus = true;
      this.showIndex = 9999;
    },
    //点击修改栏目名称
    submitUpdate(row) {
      this.columnInfo.name = row.name;
      this.columnInfo.id = row.id;
      this.editColumn(0);
    },
    // 上移
    handleMoveUp(index, row) {
      var that = this;
      if (index >= 0) {
        // 获取当前点击的上一条数据
        const upDate = that.columnList[index - 1];
        if (this.columnList) {
          // 移除上一条数据
          that.columnList.splice(index - 1, 1);
          // 把上一条数据插入当前点击的位置
          that.columnList.splice(index, 0, upDate);
          setTimeout(this.bannerSort(0, row.id, row.sort), 500);
        }
      }
    },
    // 下移
    handleMoveDown(index, row) {
      var that = this;
      const downDate = that.columnList[index + 1];
      that.columnList.splice(index + 1, 1);
      that.columnList.splice(index, 0, downDate);
      setTimeout(this.bannerSort(1, row.id, row.sort), 500);
    },
    bannerSort(num, moveId, sort) {
      this.param = {
        moveToken: num, //0 上移 1下移,
        id: moveId,
        sort: sort
      };
      moveColumn(this.param).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "操作成功！"
          });
          this.getList();
        }
      });
    },
    switchChange(row) {
      console.log(row);
      this.columnInfo.name = row.name;
      this.columnInfo.type = row.type;
      this.columnInfo.id = row.id;
      this.columnInfo.status = row.statusBoolean == false ? 2 : 1;
      this.title = "编辑";
      this.editColumn(1);
    },
    operateColumn() {
      this.$refs["columnInfo"].validate(val => {
        if (val) {
          if (this.title == "添加") {
            let params = {
              name: this.columnInfo.name,
              status: this.columnInfo.status,
              type: this.columnInfo.type
            };
            this.addData(params);
          } else {
            this.editColumn(2);
          }
        }
      });
    },
    addData(params) {
      var fontSize = this.getByteLen(this.columnInfo.name);
      if (fontSize <= 12) {
        addColumn(params).then(res => {
          if (res.data.code == CodeMsg.CODE_1000) {
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.dialogFormVisible = false;
            this.getList();
          } else if (res.data.code == CodeMsg.CODE_2000) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
          } else if (res.data.code == CodeMsg.CODE_2001) {
            this.$message({
              type: "warning",
              message: "栏目名称不能为空"
            });
          } else if (res.data.code == CodeMsg.CODE_2004) {
            this.$message({
              type: "warning",
              message: "栏目名称应限制在2-6个字"
            });
          } else if (res.data.code == CodeMsg.CODE_2008) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
          } else if (res.data.code == CodeMsg.CODE_2009) {
            this.$message({
              type: "warning",
              message: res.data.data
            });
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "字符范围应控制在2-12个字符范围内"
        });
      }
    },
    editColumn(val) {
      console.log(val);
      var fontSize = this.getByteLen(this.columnInfo.name);
      console.log(fontSize, "输出字符数");
      if (fontSize <= 12) {
        this.soleParams = {};
        if (val == 0) {
          this.soleParams = {
            name: this.columnInfo.name,
            id: this.columnInfo.id
          };
        } else if (val == 1) {
          this.soleParams = {
            status: this.columnInfo.status,
            id: this.columnInfo.id
          };
        } else if (val == 2) {
          this.soleParams = {
            name: this.columnInfo.name,
            status: this.columnInfo.status,
            type: this.columnInfo.type,
            id: this.columnInfo.id
          };
        }
        this.updateData();
      } else {
        this.$message({
          type: "warning",
          message: "字符范围应控制在2-12个字符范围内"
        });
      }
    },
    updateData() {
      editColumn(this.soleParams).then(res => {
        if (res.data.code == CodeMsg.CODE_1000) {
          this.$message({
            type: "success",
            message: "修改成功！"
          });
          this.dialogFormVisible2 = false;
          this.getList();
          this.showStatus = false;
        } else if (res.data.code == CodeMsg.CODE_2000) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
          this.dialogFormVisible = false;
          this.getList();
        } else if (res.data.code == CodeMsg.CODE_2004) {
          this.$message({
            type: "warning",
            message: "栏目名称应限制在2-6个字"
          });
        } else if (res.data.code == CodeMsg.CODE_2008) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
          this.getList();
        } else if (res.data.code == CodeMsg.CODE_2009) {
          this.$message({
            type: "warning",
            message: res.data.data
          });
        }
      });
    },
    getList() {
      let params = {
        size: this.pageSize,
        start: this.currentPage
      };
      getColumnList(params).then(res => {
        this.columnList = res.data.data.list;
        this.total = res.data.data.total;
        this.endRow = res.data.data.size;
        this.columnList.forEach(item => {
          item.showStatus = false;
        });
      });
    },
    showColumn() {
      this.title = "添加";
      this.dialogFormVisible = true;
      this.columnInfo.name = "";
      this.columnInfo.status = "1";
      this.columnInfo.type = "0";
    },
    showEdit(index, row) {
      this.title = "编辑";
      this.dialogFormVisible2 = true;
      this.columnInfo.name = row.name;
      this.columnInfo.type = row.type;
      this.showId = row.id;
      this.columnInfo.id = row.id;
      this.columnInfo.status = row.statusBoolean == false ? 2 : 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    deleteColumn(index, row) {
      this.$confirm(this.$t("label.confirmDelete"), this.$t("message.tips"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          deleteColumn(Number(row.id)).then(res => {
            if (res.data.code == CodeMsg.CODE_1000) {
              this.$message({
                type: "success",
                message: "删除成功！",
                duration: 2000
              });
            }
            this.getList();
          });
        })
        .catch(() => {
          this.getList();
        });
    },
    updateBanner() {},
    getStatus() {},
    changeImage() {}
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.banner {
  padding-top: 20px;
  padding-left: 30px;
  padding-bottom: 100px;
  background: #fff;
}
.banner_img {
  display: inline-block;
  height: 110px;
  width: 200px;
}
.banner_head {
  display: flex;
  align-items: center;
}
ul,
li {
  list-style: none;
}
li {
  font-size: 14px;
  color: #666666;
}
.el-image-viewer__close {
  background: rgba(225, 225, 225, 1);
}
#up:hover {
  color: #409eff;
}
#down:hover {
  color: #409eff;
}
.lune_banner {
  display: flex;
  flex-direction: column;
  margin-left: -40px;
}
</style>
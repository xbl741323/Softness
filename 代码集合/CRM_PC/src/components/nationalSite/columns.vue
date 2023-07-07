<template>
  <div>
    <el-form
      :model="columnsForm"
      :rules="rules"
      ref="columnsForm"
      label-width="140px">
      <el-form-item label="栏目名称：" prop="name">
        <el-input
          v-model="columnsForm.name"
          @blur="getTwoNameList"
          placeholder="2~20个字"
          style="width: 200px" :disabled="!isAdd&&syType==4"></el-input>
      </el-form-item>
      <el-form-item label="是否有二级导航：" prop="isTwo">
        <el-radio-group v-model="columnsForm.isTwo" :disabled="!isAdd&&syType==4" @change="handleChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <el-button v-if="columnsForm.isTwo == 1" type="primary" style="margin-left: 30px;" @click="addTwoNav">添加二级导航</el-button>
      </el-form-item>
      <el-form-item label="栏目类型：" prop="type" v-if="columnsForm.isTwo == 0">
        <el-radio-group
          :disabled="!isAdd&&syType==4"
          v-model="columnsForm.type"
          style="display: flex; justify-content: space-between">
          <div
            class="columns-type"
            v-for="(item, index) in typeImg"
            :key="index">
            <img style="width: 60px; margin-bottom: 10px" :src="require('@/assets/images/js-wotao/' + item.img + '.png')"/>
            <el-radio :label="index">{{ item.title }}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <div v-if="columnsForm.type !== 0 && columnsForm.isTwo == 0">
        <el-form-item label="网页标题：" prop="title">
          <el-input
            type="text"
            v-model="columnsForm.title"
            maxlength="40"
            show-word-limit
            style="width: 66%"></el-input>
        </el-form-item>
        <el-form-item label="meta关键字：" prop="metakeyword">
          <el-input
            type="text"
            v-model="columnsForm.metakeyword"
            maxlength="40"
            show-word-limit
            style="width: 66%"></el-input>
        </el-form-item>
        <el-form-item label="meta描述：" prop="meta">
          <el-input
            type="textarea"
            :rows="5"
            v-model="columnsForm.meta"
            maxlength="200"
            show-word-limit
            style="width: 66%"></el-input>
        </el-form-item>
      </div>
      <template v-if="columnsForm.isTwo == 1">
        <div v-for="(item, index) in columnsForm.childrenColumnVoList" :key="index">
          <el-form-item :label="'二级导航名称' + (Number(index) + 1) + '：'" :prop="'childrenColumnVoList.' + index + '.name'" :rules="rules.twoNavName">
            <el-input style="width: 200px" placeholder="请输入二级导航名称" v-model="item.name" @blur="getTwoNameList"></el-input>
            <span v-if="index != 0" class="subtractNav" @click="substractNav(index)">-</span>
          </el-form-item>
          <el-form-item label="栏目类型：" prop="type">
            <el-radio-group
              v-model="item.type"
              :disabled="!isAdd&&syType==4"
              @change="thisType = item.type, thisTypeIndex = index"
              style="display: flex; justify-content: space-between">
              <div
                class="columns-type"
                v-for="(item1, index1) in typeImg"
                :key="index1">
                <img style="width: 60px; margin-bottom: 10px" :src="require('@/assets/images/js-wotao/' + item1.img + '.png')"/>
                <el-radio :label="index1">{{ item1.title }}</el-radio>
              </div>
            </el-radio-group>
          </el-form-item>
          <div v-if="item.type !== 0">
            <el-form-item label="网页标题：" :prop="'childrenColumnVoList.' + index + '.title'" :rules="rules.title">
              <el-input
                type="text"
                v-model="item.title"
                maxlength="40"
                show-word-limit
                style="width: 66%"></el-input>
            </el-form-item>
            <el-form-item label="meta关键字：" :prop="'childrenColumnVoList.' + index + '.metakeyword'" :rules="rules.metakeyword">
              <el-input
                type="text"
                v-model="item.metakeyword"
                maxlength="40"
                show-word-limit
                style="width: 66%"></el-input>
            </el-form-item>
            <el-form-item label="meta描述：" :prop="'childrenColumnVoList.' + index + '.meta'" :rules="rules.meta">
              <el-input
                type="textarea"
                :rows="5"
                v-model="item.meta"
                maxlength="200"
                show-word-limit
                style="width: 66%"></el-input>
            </el-form-item>
          </div>
        </div>
      </template>
      <el-form-item label="显示状态：" prop="status">
        <el-radio-group v-model="columnsForm.status" :disabled="!isAdd&&syType==4">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="columns-btn">
        <el-button
          size="medium"
          type="primary"
          @click="submitForm('columnsForm')">确定</el-button>
        <el-button
          size="medium"
          style="margin-left: 60px"
          @click="resetForm('columnsForm')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  checkName,
  addColumns,
  getcolumn,
  checkUpdateName,
  editColumns,
} from "@/api/js-wotao-b/columns";
import * as CodeMsg from "@/api/common/CodeChange"
export default {
  props:{
    substationId:{
      required: true
    },
    columnId:{
      required: true
    },
    syType:{
      required: true
    },
    isAdd:{
      required: true
    }
  },
  data() {
    var checkColumnName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入栏目名称"));
      } else {
        if (this.columnId) {
          let params = {
            id: this.columnId,
            name: value,
            substationId: this.substationId,
          };
          checkUpdateName(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              callback();
            } else {
              callback(new Error("此名称已存在，请重新输入"));
            }
          });
        } else {
          checkName({ name: value, substationId: this.substationId }).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              callback();
            } else {
              callback(new Error("此名称已存在，请重新输入"));
            }
          });
        }
      }
    };
    var checkNavName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入二级导航名称"));
      } else {
        let count = 0
        count = this.twoNameList.filter(val => {
          return val == value
        }).length
        if (count > 1) {
          return callback(new Error("此名称已存在，请重新输入"));
        }
        if (rule.field.split('.')[1] <= this.twoIdList.length - 1) {
          let params = {
            id: this.twoIdList[rule.field.split('.')[1]].id,
            name: value,
            substationId: this.substationId,
          };
          checkUpdateName(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              callback();
            } else {
              callback(new Error("此名称已存在，请重新输入"));
            }
          });
        } else {
          checkName({ name: value, substationId: this.substationId }).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              callback();
            } else {
              callback(new Error("此名称已存在，请重新输入"));
            }
          });
        }
      }
    };
    return {
      hasChirldren: false,
      twoIdList: [],
      twoNameList: [],
      optionList: [],
      thisType: [],
      thisTypeIndex: null,
      typeImg: [
        { img: "tuwen_content", title: "图文内容(只能显示一篇文章)" },
        { img: "wenzhang_list", title: "文章列表(可以显示多篇文章)" },
        { img: "tuwen_list", title: "图文列表(可以显示多篇文章)" },
        { img: "tupian_list", title: "图片列表(可以显示多篇文章)" },
      ],
      columnsForm: {
        name: "",
        isTwo: 0,
        type: 0,
        status: 0,
        childrenColumnVoList: [
          {
            isTwo: 0,
            name: '',
            type: 0,
            title: '',
            metakeyword: '',
            meta: '',
            status: 0,
            substationId: null
          }
        ],
      },
      rules: {
        name: [
          { required: true, validator: checkColumnName, trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
        ],
        twoNavName: [
          { required: true, validator: checkNavName, trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        isTwo: [{ required: true, message: "请选择", trigger: "change" }],
        type: [{ required: true, message: "请选择", trigger: "change" }],
        title: [{ required: true, message: "请输入网页标题", trigger: "blur" }],
        metakeyword: [
          { required: true, message: "请输入meta关键字", trigger: "blur" },
        ],
        meta: [{ required: true, message: "请输入meta描述", trigger: "blur" }],
        status: [{ required: true, message: "请选择", trigger: "change" }],
      },
    };
  },
  watch: {
    'columnsForm.type': {
      handler: function(newValue, oldValue) {
        if (newValue == 0) {
          this.$confirm('从列表类栏目改为图文类栏目，如有多篇文章状态为显示，将只保留显示排序第一篇的文章，是否确定更改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.columnsForm.type = 0
          }).catch(() => {     
            this.columnsForm.type = oldValue
          });
        }
      },
    },
    thisType: {
      handler: function(newValue, oldValue) {
        if (newValue == 0) {
          this.$confirm('从列表类栏目改为图文类栏目，如有多篇文章状态为显示，将只保留显示排序第一篇的文章，是否确定更改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.columnsForm.childrenColumnVoList[this.thisTypeIndex].type = 0
            this.thisType = 0
          }).catch(() => {
            this.columnsForm.childrenColumnVoList[this.thisTypeIndex].type = oldValue
            this.thisType = oldValue
          });
        }
      }
    },
  },
  methods: {
    getTwoNameList() {
      this.twoNameList = [this.columnsForm.name]
      this.columnsForm.childrenColumnVoList.forEach(item => {
        this.twoNameList.push(item.name)
      })
    },
    handleChange() {
      if (this.columnsForm.isTwo == 1 && this.columnsForm.childrenColumnVoList.length == 0) {
        this.columnsForm.childrenColumnVoList.push({
          name: '',
          type: 0,
          title: '',
          isTwo: 0,
          metakeyword: '',
          meta: '',
          status: 0,
          substationId: this.substationId,
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.columnsForm);
          params.substationId = this.substationId
          params.childrenColumnVoList.forEach(item => {
            item.substationId = this.substationId
          })
          if (this.columnId) {
            editColumns(Object.assign({ id: this.columnId }, params)).then(
              (res) => {
                if (res.data.code == CodeMsg.CODE_1000) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                    offset: 300,
                  });
                  this.$refs[formName].resetFields();
                  this.$emit("closeForm");
                }
              }
            );
          } else {
            addColumns(params).then((res) => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  message: "添加成功",
                  type: "success",
                  offset: 300,
                });
                this.$refs[formName].resetFields();
                this.$emit("closeForm");
                this.$emit("changeNav", true);
              }
            });
          }
        } else {
          this.$message({
            message: "表单信息填写有误，请检查",
            type: "error",
            offset: 300,
          });
        }
      });
    },
    //添加二级导航
    addTwoNav() {
      this.columnsForm.childrenColumnVoList.push({
        name: '',
        type: 0,
        title: '',
        isTwo: 0,
        status: 0,
        metakeyword: '',
        meta: '',
        substationId: this.substationId,
      })
    },
    //删除二级导航
    substractNav(index) {
      this.columnsForm.childrenColumnVoList.splice(index, 1)
      this.twoIdList.splice(index, 1)
      this.getTwoNameList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("closeForm");
    },
    getData() {
      if (this.columnId) {
        getcolumn(this.columnId).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.columnsForm = res.data.data;
            let list = res.data.data.childrenColumnVoList
            list.forEach(item => {
              this.twoIdList.push({id: item.id})
            });
          }
        });
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.columns-btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.columns-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.subtractNav{
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 1px solid #DCDFE6;
  text-align: center;
  line-height: 23px;
  margin-left: 20px;
  cursor: pointer;
}
</style>
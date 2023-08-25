<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学生名字" prop="firstName">
        <el-input
          v-model="queryParams.firstName"
          placeholder="请输入学生名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓氏" prop="lastName">
        <el-input
          v-model="queryParams.lastName"
          placeholder="请输入学生姓氏"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出生日期" prop="dateOfBirth">
        <el-date-picker clearable
          v-model="queryParams.dateOfBirth"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出生日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="家庭地址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入家庭地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入电子邮件"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国籍" prop="nationality">
        <el-input
          v-model="queryParams.nationality"
          placeholder="请输入国籍"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监护人姓名" prop="guardianName">
        <el-input
          v-model="queryParams.guardianName"
          placeholder="请输入监护人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监护人联系电话" prop="guardianPhoneNumber">
        <el-input
          v-model="queryParams.guardianPhoneNumber"
          placeholder="请输入监护人联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入学日期" prop="admissionDate">
        <el-date-picker clearable
          v-model="queryParams.admissionDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择入学日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="毕业日期" prop="graduationDate">
        <el-date-picker clearable
          v-model="queryParams.graduationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择毕业日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属院系" prop="department">
        <el-input
          v-model="queryParams.department"
          placeholder="请输入所属院系"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属专业" prop="major">
        <el-input
          v-model="queryParams.major"
          placeholder="请输入所属专业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学术导师" prop="academicAdvisor">
        <el-input
          v-model="queryParams.academicAdvisor"
          placeholder="请输入学术导师"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="宿舍号" prop="dormitoryNumber">
        <el-input
          v-model="queryParams.dormitoryNumber"
          placeholder="请输入宿舍号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人姓名" prop="emergencyContactName">
        <el-input
          v-model="queryParams.emergencyContactName"
          placeholder="请输入紧急联系人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人电话" prop="emergencyContactNumber">
        <el-input
          v-model="queryParams.emergencyContactNumber"
          placeholder="请输入紧急联系人电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:students:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:students:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:students:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:students:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生ID" align="center" prop="studentId" />
      <el-table-column label="学生名字" align="center" prop="firstName" />
      <el-table-column label="学生姓氏" align="center" prop="lastName" />
      <el-table-column label="学生性别" align="center" prop="gender" />
      <el-table-column label="出生日期" align="center" prop="dateOfBirth" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateOfBirth, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭地址" align="center" prop="address" />
      <el-table-column label="联系电话" align="center" prop="phoneNumber" />
      <el-table-column label="电子邮件" align="center" prop="email" />
      <el-table-column label="国籍" align="center" prop="nationality" />
      <el-table-column label="监护人姓名" align="center" prop="guardianName" />
      <el-table-column label="监护人联系电话" align="center" prop="guardianPhoneNumber" />
      <el-table-column label="入学日期" align="center" prop="admissionDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.admissionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毕业日期" align="center" prop="graduationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.graduationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属院系" align="center" prop="department" />
      <el-table-column label="所属专业" align="center" prop="major" />
      <el-table-column label="班级名称" align="center" prop="className" />
      <el-table-column label="学籍状态" align="center" prop="enrollmentStatus" />
      <el-table-column label="学术导师" align="center" prop="academicAdvisor" />
      <el-table-column label="宿舍号" align="center" prop="dormitoryNumber" />
      <el-table-column label="紧急联系人姓名" align="center" prop="emergencyContactName" />
      <el-table-column label="紧急联系人电话" align="center" prop="emergencyContactNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:students:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:students:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学生对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生名字" prop="firstName">
          <el-input v-model="form.firstName" placeholder="请输入学生名字" />
        </el-form-item>
        <el-form-item label="学生姓氏" prop="lastName">
          <el-input v-model="form.lastName" placeholder="请输入学生姓氏" />
        </el-form-item>
        <el-form-item label="出生日期" prop="dateOfBirth">
          <el-date-picker clearable
            v-model="form.dateOfBirth"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮件" />
        </el-form-item>
        <el-form-item label="国籍" prop="nationality">
          <el-input v-model="form.nationality" placeholder="请输入国籍" />
        </el-form-item>
        <el-form-item label="监护人姓名" prop="guardianName">
          <el-input v-model="form.guardianName" placeholder="请输入监护人姓名" />
        </el-form-item>
        <el-form-item label="监护人联系电话" prop="guardianPhoneNumber">
          <el-input v-model="form.guardianPhoneNumber" placeholder="请输入监护人联系电话" />
        </el-form-item>
        <el-form-item label="入学日期" prop="admissionDate">
          <el-date-picker clearable
            v-model="form.admissionDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入学日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="毕业日期" prop="graduationDate">
          <el-date-picker clearable
            v-model="form.graduationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择毕业日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属院系" prop="department">
          <el-input v-model="form.department" placeholder="请输入所属院系" />
        </el-form-item>
        <el-form-item label="所属专业" prop="major">
          <el-input v-model="form.major" placeholder="请输入所属专业" />
        </el-form-item>
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="学术导师" prop="academicAdvisor">
          <el-input v-model="form.academicAdvisor" placeholder="请输入学术导师" />
        </el-form-item>
        <el-form-item label="宿舍号" prop="dormitoryNumber">
          <el-input v-model="form.dormitoryNumber" placeholder="请输入宿舍号" />
        </el-form-item>
        <el-form-item label="紧急联系人姓名" prop="emergencyContactName">
          <el-input v-model="form.emergencyContactName" placeholder="请输入紧急联系人姓名" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyContactNumber">
          <el-input v-model="form.emergencyContactNumber" placeholder="请输入紧急联系人电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStudents, getStudents, delStudents, addStudents, updateStudents } from "@/api/system/students";

export default {
  name: "Students",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学生表格数据
      studentsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        firstName: null,
        lastName: null,
        gender: null,
        dateOfBirth: null,
        address: null,
        phoneNumber: null,
        email: null,
        nationality: null,
        guardianName: null,
        guardianPhoneNumber: null,
        admissionDate: null,
        graduationDate: null,
        department: null,
        major: null,
        className: null,
        enrollmentStatus: null,
        academicAdvisor: null,
        dormitoryNumber: null,
        emergencyContactName: null,
        emergencyContactNumber: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        firstName: [
          { required: true, message: "学生名字不能为空", trigger: "blur" }
        ],
        lastName: [
          { required: true, message: "学生姓氏不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学生列表 */
    getList() {
      this.loading = true;
      listStudents(this.queryParams).then(response => {
        this.studentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        studentId: null,
        firstName: null,
        lastName: null,
        gender: null,
        dateOfBirth: null,
        address: null,
        phoneNumber: null,
        email: null,
        nationality: null,
        guardianName: null,
        guardianPhoneNumber: null,
        admissionDate: null,
        graduationDate: null,
        department: null,
        major: null,
        className: null,
        enrollmentStatus: null,
        academicAdvisor: null,
        dormitoryNumber: null,
        emergencyContactName: null,
        emergencyContactNumber: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.studentId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const studentId = row.studentId || this.ids
      getStudents(studentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.studentId != null) {
            updateStudents(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudents(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const studentIds = row.studentId || this.ids;
      this.$modal.confirm('是否确认删除学生编号为"' + studentIds + '"的数据项？').then(function() {
        return delStudents(studentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/students/export', {
        ...this.queryParams
      }, `students_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

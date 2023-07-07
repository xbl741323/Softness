<template>
  <div id="app">
    <router-view
      :key="$route.query.time ? $route.path + $route.query.time : ''"
    />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    this.$router.beforeEach((to, from, next) => {
      next();
    });
  },
  methods: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
.btn-custom-cancel {
  float: right;
  margin-left: 20px !important;
}
.w-e-menu {
  z-index: 10 !important;
}
.w-e-text-container {
  z-index: 8 !important;
}
.notice-file .el-form-item .el-upload-list li {
  display: flex !important;
}
.notice-file .el-form-item .el-upload-list li .el-icon-close {
  position: relative !important;
  top: 0 !important;
  right: 0 !important;
  line-height: 25px;
}
.notice-file
  .el-form-item
  .el-upload-list
  li
  .el-upload-list__item-status-label {
  position: relative !important;
  top: 0 !important;
  right: 0 !important;
  line-height: 25px;
}
.check-item {
  display: block !important;
  margin: 10px 0;
  width: 100% !important;
}
.tinymce-editor {
  margin-top: -22px;
}
.el-table >>> .width-row {
  width: 400px !important;
}
.el-table td.width-row {
  width: 400px !important;
}
.el-date-range-picker__header button {
  padding: 0 6px !important;
  margin-top: 0 !important;
  line-height: 30px !important;
}
.el-date-picker__header button {
  padding: 0 6px !important;
  margin-top: 0 !important;
  line-height: 30px !important;
}
.set_policy_project {
  background: #fff;
  width: 100%;
  padding: 20px 30px 100px 30px;
}
.user_tab .el-tabs__nav {
  margin-left: 50px !important;
}
.edit_box .el-button--default {
  padding: 4px !important;
}
.el-select__caret .el-input__icon .el-icon-circle-close {
  display: none !important;
}
.el-tag--small {
  height: auto !important;
}
.batch-choose .avue-crud__tip {
  display: none !important; //列表多选框已选择多少项不显示
}
.avue-crud__right {
  //显隐上移
  z-index: 9999 !important;
}
.batch-handle {
  margin: 10px 0;
}
.handle-txt {
  font-size: 14px;
  color: #606266;
}
.batch-handle .handle-txt:first-child {
  margin-right: 20px;
}
.batch-handle b {
  color: #409eff;
  font-weight: 800;
  padding: 0 4px;
}
.el-input__inner {
  padding: 0 !important;
}
.el-textarea__inner {
  padding-left: 0 !important;
}
.el-input--prefix .el-input__inner {
  padding-left: 30px !important;
}
.top-fixed {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 9998 !important;
}
.top-distance {
  margin-top: 80px !important;
}
.top-absolute {
  position: absolute !important;
}
.new-page {
  width: 60% !important;
  margin-left: 20% !important;
  padding-bottom: 30px;
}
.limit-file {
  margin-left: 10px;
  color: red;
}
.left-space {
  margin-right: 10px;
}
.full-page {
  width: 98% !important;
  margin-left: 1% !important;
  padding-bottom: 30px;
}
.tox-fullscreen {
  margin-top: 70px !important;
}
.el-message {
  z-index: 9999 !important;
}
.avue-header {
  z-index: 1;
  position: relative;
}
.el-notification {
  position: fixed;
  top: 5% !important;
  left: 50% !important;
  transform: translate(0%, 50%) !important;
}

.el-notification.right {
  top: 5% !important;
  left: 50% !important;
  transform: translate(0%, 50%) !important;
}

.el-notification.left {
  top: 5% !important;
  left: 50% !important;
  transform: translate(0%, 50%) !important;
}

.el-cascader__search-input {
  margin-left: 1px !important;
}
.avue-crud {
  margin: 0 0 0 2px !important;
}
.emp_disabled {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 3px;
}
.state-right {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.el-card {
  border: none !important;
}
.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: green;
  position: relative;
  top: -1px;
  left: -4px;
}
.margin0-p {
  margin: 0 !important;
}
.keywords-width {
  width: 420px;
}
.circleBlue {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  background: #36a6fe;
  margin-top: 4px;
  margin-right: 7px;
}
.circle {
  width: 6px;
  height: 6px;
  float: left;
  border-radius: 50%;
  margin-top: 4px;
}
.circle-warning {
  background: #e6a23c;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
i {
  font-style: normal;
}
.fee-item .el-form-item--mini.el-form-item {
  margin: 0 !important;
}
.refund-flag {
  width: 20px;
  height: 20px;
  background: #36a6fe;
  line-height: 20px;
  border-radius: 50%;
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
}
.myMessage {
  width: 50% !important;
}
.myMessage .el-message__icon {
  display: none;
}
.table-row .cell {
  overflow: visible !important;
}
.table-row .el-form-item {
  margin-bottom: 28px !important;
}
</style>

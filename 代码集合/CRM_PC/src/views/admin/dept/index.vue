`<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <!-- class="app-container calendar-list-container" -->
  <div>
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleChange">
        <el-tab-pane label="部门管理" name="1">
          <dept v-if="activeName == 1" />
        </el-tab-pane>
        <el-tab-pane label="岗位管理" name="2">
          <post v-if="activeName == 2" />
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import dept from "@/components/admin/dept";
import post from "@/components/admin/post";

export default {
  components: {
    dept,
    post,
  },
  data() {
    return {
      activeName: sessionStorage.getItem("deptActiveName")
        ? sessionStorage.getItem("deptActiveName")
        : "1",
    };
  },
  methods: {
    handleChange() {
      sessionStorage.setItem("deptActiveName", this.activeName);
    },
  },
};
</script>


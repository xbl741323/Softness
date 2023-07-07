<template>
  <div class="banner">
    <div class="banner_head">
      <div>
        <el-form :model="filters" style="display:flex;" :inline="true" @submit.native.prevent>
          <el-form-item :label="$t('label.keywords')">
            <el-input
              v-model="filters.keyWords"
              @keyup.enter.native="getAllList"
              :placeholder="$t('input.keywords')"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('label.location')+'：'" style="margin-left:20px;">
            <el-select v-model="filters.location" style="width:120px;">
              <el-option label="全部" :value="null"></el-option>
              <el-option :label="item.name" v-for="(item,index) in tabList" :key="index" :value="item.bannerType"></el-option>
            </el-select>
          </el-form-item>
          <el-button
            size="small"
            type="primary"
            style="width:80px;margin-bottom:20px;margin-left:10px;"
            @click="getAllList"
          >{{ $t('button.search') }}</el-button>
        </el-form>
      </div>
    </div>
    <el-table border :data="bannerList" ref="imgList" highlight-current-row style="width:100%">
      <el-table-column type="index" :label="$t('label.sortNumber')" align="center"></el-table-column>
      <el-table-column prop="number" :label="$t('label.editNumber')" align="center"></el-table-column>
      <el-table-column prop="name" :label="$t('label.location')" align="center"></el-table-column>
      <el-table-column prop="title" :label="$t('table.title')" align="center"></el-table-column>
      <el-table-column :label="$t('label.img')" align="center">
        <template slot-scope="scope">
          <div>
            <el-image
              style="width: 200px; height: 110px;cursor:pointer;"
              :src="imgBaseUrl+scope.row.photoUrl"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="history" :label="$t('label.historyRecords')" align="center" width="300">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.jsPolicyOperateList" :key="index">
            <div>
              <span>{{ item.createUser }}</span>
              <span>{{ item.createTime }}</span>
              <span style="margin-left:4px;">{{ item.operateType }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :total="total"
      style="float:right;margin-top:20px;margin-right:20px;"
    ></el-pagination>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange"
import { getBannerRecords } from "@/api/js-wotao-b/banner";
export default {
  props: ["deviceType",'tabList',"substationId"],
  data() {
    return {
      imgBaseUrl:"",
      total: 0,
      pageSize: 10,
      currentPage: 1,
      filters: {
        location: null,
        keyWords: ""
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      bannerCount: 4,
      switchStatus: false,
      bannerInfo: {},
      bannerList: [],
      params:{},
    };
  },
  methods: {
    getAllList() {
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList(val);
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    getList() {
        this.params = {
          keyword: this.filters.keyWords.trim(),
          type: this.filters.location,
          size: this.pageSize,
          start: this.currentPage
        };     
      getBannerRecords(this.params).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          this.bannerList = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    }
  },
  mounted() {
    this.switch()
    this.getList();
  }
};
</script>

<style>
.banner {
  padding-top: 20px;
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

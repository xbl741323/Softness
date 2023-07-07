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
            <el-select v-if="deviceType=='pc'" v-model="filters.location" style="width:120px;">
              <el-option :label="$t('status.all')" :value="null"></el-option>
              <el-option :label="$t('message.firstPage')" :value="4"></el-option>
              <el-option :label="$t('title.noticeMessage')" :value="0"></el-option>
              <el-option :label="$t('title.policy')" :value="1"></el-option>
              <el-option :label="$t('title.trouble')" :value="2"></el-option>
              <el-option :label="$t('title.project')" :value="3"></el-option>
              <el-option :label="$t('title.aboutWt')" :value="5"></el-option>
              <el-option label="知识产权" :value="6"></el-option>
              <el-option label="行业资讯" :value="10"></el-option>
              <el-option label="技术成果" :value="11"></el-option>
              <el-option label="技术需求" :value="12"></el-option>
            </el-select>
            <el-select v-else v-model="filters.location" style="width:120px;">
              <el-option :label="$t('status.all')" :value="null"></el-option>
              <el-option :label="$t('message.firstPage')" :value="7"></el-option>
              <el-option label="知识产权" :value="8"></el-option>
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
      <el-table-column prop="bannerType" :label="$t('label.location')" align="center"></el-table-column>
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
          <div v-for="(item,index) in scope.row.operate" :key="index">
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
import { getBannerRecords } from "@/api/siteSettings/banner";
export default {
  props: ["deviceType"],
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
      if(this.deviceType=='pc'){
        this.params = {
          keyword: this.filters.keyWords.trim(),
          type: this.filters.location,
          size: this.pageSize,
          start: this.currentPage
        };
      } else {
        this.params = {
          keyword: this.filters.keyWords.trim(),
          type: this.filters.location,
          size: this.pageSize,
          start: this.currentPage,
          app:'app',
        };
      }      
      getBannerRecords(this.params).then(res => {
        if(res.data.code == CodeMsg.CODE_1000){
          this.bannerList = res.data.data.list;
          this.total = res.data.data.count;
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

<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item
        v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
        :index="item[pathKey]"
        :key="item[labelKey]"
        :class="{ 'is-active': vaildAvtive(item) }"
        @click="open(item)">
        <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{ item[labelKey] }}</span>
      </el-menu-item>
      <el-submenu v-if="!validatenull(item[childrenKey]) && vaildRoles(item)" :index="item[pathKey]" :key="item[labelKey]">
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title" :class="{ 'el-menu--display': collapse && first }">{{ item[labelKey] }}</span>
        </template>
        <template v-for="(child, cindex) in item[childrenKey]">
          <el-menu-item
            v-if="validatenull(child[childrenKey]) && child.type == 0"
            :index="child[pathKey]"
            :class="{ 'is-active': vaildAvtive(child) }"
            :key="child[nameKey]"
            @click="open(child)">
            <i :class="child[iconKey]"></i>
            <span slot="title">{{ child[labelKey] }}</span>
          </el-menu-item>
          <sidebar-item  v-if="!validatenull(child[childrenKey])" :menu="[child]" :key="cindex" :props="props" :screen="screen" :collapse="collapse"/>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
import Vue from 'vue'
export default {
  name: "SidebarItem",
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  data() {
    return {
      config: config,
      bandgeCount: 0,
      consultCount: 0,
      pendingNum: 0,
      PMPendingNums: {},
      approvalCount: 0,
      lastTime: 0,
    };
  },
  computed: {
    ...mapGetters(["roles", "tagList"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },
    nameKey() {
      return this.props.name || this.config.propsDefault.name;
    },
  },
  methods: {
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item) {
      if (sessionStorage.getItem(`${item.path}`)) {
        let keepParams = JSON.parse(sessionStorage.getItem(`${item.path}`));
        if (keepParams.detail) {
          keepParams.detail.path = "";
          keepParams.detail.query = {};
          sessionStorage.setItem(`${item.path}`, JSON.stringify(keepParams));
        }
      }
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router
        .push({
          path: this.$router.$avueRouter.getPath({
            name: item[this.labelKey],
            src: item[this.pathKey],
          }),
          query: item.query,
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.badeg_item {
  margin-left: 5px;
}
</style>


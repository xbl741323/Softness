<template>
  <el-menu default-active="/goods/Goods" :collapse="collapsed" collapse-transition :router='true' unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
     <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
      <div class="logobox-title">
    </div>
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
import { menu } from '../api/userMG'
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: [],
      routePath:''
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.routePath = this.$route.path
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'icon-cat-skuQuery',
          menunIndex: '1',
          menuname: '产品管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 1,
              icon: 'icon-cat-skuQuery',
              menunIndex: '1',
              menuname: '产品信息管理',
              hasThird: 'N',
              url: 'goods/Goods',
              menus: null
            }
          ]
        },
        {
          menuid: 2,
          icon: 'icon-cus-manage',
          menunIndex: '2',
          menuname: '账户管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-cus-manage',
              menunIndex: '2',
              menuname: '账户信息管理',
              hasThird: 'N',
              url: 'system/user',
              menus: null
            },
          ]
        },
      ],
    }
    this.allmenu = res.data
    // 监听
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}
.logoimg {
  height: 40px;
}
.logobox-title{
  /* font-size: 14px; */
  height: 50px;
}
</style>
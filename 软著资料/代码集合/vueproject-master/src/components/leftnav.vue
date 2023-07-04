/**
* 左边菜单
*/ 
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <!-- <i class="iconfont" :class="chmenu.icon"></i> -->
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
          menuid: 23,
          icon: 'li-icon-xiangmuguanli',
          menuname: '首页',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 5,
              icon: 'icon-order-manage',
              menuname: '工作台',
              hasThird: 'N',
              url: '/home/index',
              menus: null
            }
          ]
        },
        {
          menuid: 1,
          icon: 'li-icon-xiangmuguanli',
          menuname: '3D地图管理模块',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '3D医院建筑和内部结构管理',
              hasThird: 'N',
              url: 'goods/Goods5',
              menus: null
            },
            {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '3D路径和指示牌管理',
              hasThird: 'N',
              url: 'goods/Goods1',
              menus: null
            },
            {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '3D贴图和颜色表示管理',
              hasThird: 'N',
              url: 'goods/Goods2',
              menus: null
            },
             {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '3D空间环境和设施管理',
              hasThird: 'N',
              url: 'goods/Goods2',
              menus: null
            },
             {
              menuid: 2,
              icon: 'icon-cat-skuQuery',
              menuname: '3D场景模拟管理',
              hasThird: 'N',
              url: 'goods/Goods',
              menus: null
            }
          ]
        },
        {
          menuid: 33,
          icon: 'li-icon-xiangmuguanli',
          menuname: '3D导航管理模块',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '目的地选择界面管理',
              hasThird: 'N',
              url: 'pay/Order',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '路径规划和导航路线管理',
              hasThird: 'N',
              url: 'pay/Order1',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '导航指示和语音导航管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '路径选择和优化管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '实时定位和位置显示管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
          ]
        },
         {
          menuid: 33,
          icon: 'li-icon-xiangmuguanli',
          menuname: '语音交互管理模块',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '语音识别管理',
              hasThird: 'N',
              url: 'pay/Order99',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '自然语言理解管理',
              hasThird: 'N',
              url: 'pay/Order1',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '问题回答管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '指导和建议管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
            {
              menuid: 34,
              icon: 'icon-order-manage',
              menuname: '请求操作和服务管理',
              hasThird: 'N',
              url: 'pay/Order2',
              menus: null
            },
          ]
        },
        {
          menuid: 150,
          icon: 'li-icon-xiangmuguanli',
          menuname: '医院信息管理模块',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '医院信息管理',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            },
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '科室信息管理',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            },
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '医生信息管理',
              hasThird: 'N',
              url: 'pay/Order',
              menus: null
            },
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '服务指南信息管理',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            },
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '就医指南信息管理',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            }
          ]
        },
        {
          menuid: 128,
          icon: 'li-icon-xiangmuguanli',
          menuname: '数据统计与分析模块',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 129,
              icon: 'icon-provider-manage',
              menuname: '用户行为分析管理',
              hasThird: 'N',
              url: 'machine/MachineConfig',
              menus: null
            },
            {
              menuid: 175,
              icon: 'icon-provider-manage',
              menuname: '数据可视化管理',
              hasThird: 'N',
              url: 'pay/Config',
              menus: null
            }
          ]
        },
        {
          menuid: 71,
          icon: 'li-icon-xiangmuguanli',
          menuname: '系统管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 72,
              icon: 'icon-cus-manage',
              menuname: '用户管理',
              hasThird: 'N',
              url: 'system/user',
              menus: null
            },
            {
              menuid: 73,
              icon: 'icon-news-manage',
              menuname: '角色管理',
              hasThird: 'N',
              url: 'system/Role',
              menus: null
            },
            {
              menuid: 76,
              icon: 'icon-cms-manage',
              menuname: '权限管理',
              hasThird: 'N',
              url: 'system/Permission',
              menus: null
            },
            {
              menuid: 75,
              icon: 'icon-promotion-manage',
              menuname: '流程管理',
              hasThird: 'N',
              url: 'system/Variable',
              menus: null
            },
            {
              menuid: 174,
              icon: 'icon-cms-manage',
              menuname: '菜单管理',
              hasThird: 'N',
              url: 'system/Module',
              menus: null
            },
          ]
        },
        {
          menuid: 150,
          icon: 'li-icon-xiangmuguanli',
          menuname: '日志管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 159,
              icon: 'icon-provider-manage',
              menuname: '系统操作日志',
              hasThird: 'N',
              url: 'charts/statistics',
              menus: null
            }
          ]
        },
      ],
      msg: 'success'
    }
          this.allmenu = res.data
    
    // menu(localStorage.getItem('logintoken'))
    //   .then(res => {
    //     console.log(JSON.stringify(res))
    //     if (res.success) {
    //       this.allmenu = res.data
    //     } else {
    //       this.$message.error(res.msg)
    //       return false
    //     }
    //   })
    //   .catch(err => {
    //     this.$message.error('菜单加载失败，请稍后再试！')
    //   })
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
</style>
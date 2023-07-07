import { getEmpInfo } from "@/api/project/wtClass";
import Vue from 'vue'

export const mixin = {
  data() {
    return {
      empNo: '',
      deptName: '',
      currentAccountInfo: {},
      tooltipContent: '',
      hidden: false,//是否隐藏tooltip
      currentPermissionsList: [],//当前登陆人权限集合
    }
  },
  computed: {
    checkTaskPermissions() {
      return (listType, apiInfo, permissionsType) => {//listType-'personal'-我的  apiInfo-接口权限信息 permissionsType-权限类型
        const taskPermissionsOfMy = {
          permissionsOfPage: 'bt_page_my_task',
          permissionsOfAllot: 'bt_allot_my_task',
          permissionsOfEdit: 'bt_edit_my_task',
          permissionsOfDetail: 'bt_get_my_task',
          permissionsOfCustomer: 'bt_get_transaction_my',
          permissionsOfOrderDetail: 'bt_sys_order_detail_product_my'
        }
        if (listType == 'personal') {
          return this.currentPermissionsList.some(item => item == taskPermissionsOfMy[permissionsType]);
        } else {
          return this.currentPermissionsList.some(item => item == apiInfo[permissionsType]);
        }
      }
    },
  },
  created() {
    if (sessionStorage.getItem('pigx-userInfo')) {
      const user = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content;
      Vue.delete(user, 'authorities');
      this.currentAccountInfo = user;
    }
  },
  mounted() {
    if (sessionStorage.getItem('pigx-permissions')) {
      this.currentPermissionsList = Object.keys(JSON.parse(sessionStorage.getItem('pigx-permissions')).content);
    }
  },
  methods: {
    //使用方式 @mouseover="showUserInfo(row.empId)" 
    showUserInfo(id) {//员工显示工号、部门名称
      if (id && Number(id) != 0) {
        getEmpInfo(id).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            const { deptName, number, partnerDeptName, isPartner } = res.data.data;
            if (isPartner) {
              this.tooltipContent = '工号：' + number + ' 合作机构：' + partnerDeptName;
            } else {
              this.tooltipContent = '工号：' + number + ' 部门：' + deptName;
            }
            this.empNo = number;
            this.deptName = isPartner ? partnerDeptName : deptName;
            if (this.currentAccountInfo.isPartner) {
              this.hidden = true;
            }
          }
        })
      }
    },
    filterState(str, list, key) {
      let r = list.filter(item => {
        return item.title == str
      })
      if (r.length == 0) {
        return false
      } else {
        return this.currentPermissionsList.some(el => el == r[0].Privilege[key])
      }
    }
  }
}
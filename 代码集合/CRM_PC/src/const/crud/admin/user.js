/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
import { getDetails } from '@/api/admin/user'


var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan:40,
  menuBtn: true,
  emptyBtn: false,
  searchShow: false,
  searchBtn: false,
  resetBtn: false,
  refreshBtn: false,
  editBtn: false,
  delBtn: false,
  addBtn: false,
  menuWidth: 180,
  enter: true,
  align: 'center',
  dialogClickModal: false,
  column: [
    {
      fixed: true,
      label: '关键词',
      addDisplay: false,
      editDisplay: false,
      searchSpan: 7,
      prop: 'keyword',
      // search: true,
      searchPlaceholder: "请输入姓名关键字、工号、用户名、昵称或手机号",
      span: 6,
      hide: true
    },
    {
      fixed: true,
      label: '工号',
      addDisplay: true,
      editDisplay: false,
      prop: 'number',
      slot: true,
      overHidden:true,
      width: 150,
      span: 10,
      rules: [{
        required: true,
        trigger: 'blur',
        message: '请填写工号,填入后不可修改',
      }],
    }, {
      fixed: true,
      label: 'id',
      prop: 'userId',
      span: 10,
      hide: true,
      editDisabled: true,
      addDisplay: false,
      editDisplay: false
    },
    {
      label: '密码',
      prop: 'password',
      type: 'password',
      hide: true,
      editDisabled: true,
      editDisplay: true,
      addDisplay: true,
      span: 10,
      rules: [{
        required: true,
        min: 6,
        max: 20,
        message: '请输入6~16位字母/数字/符号（至少两种）组合密码',
        pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
        trigger: 'change'
      }]
    },
    {
      fixed: true,
      label: '姓名',
      prop: 'empName',
      slot: true,
      span: 10,
      rules: [{
        required: true,
        message: '不超过10个字符',
        max: 10,
        // pattern: /^[\u4e00-\u9fa5]{0,10}$/,不超过十个汉字
        trigger: 'blur'
      }],
    },
    {
      label: '确认密码',
      prop: 'password1',
      type: 'password',
      hide: true,
      editDisplay: false,
      addDisplay: true,
      span: 10,
      rules: [{
        required: true,
        min: 6,
        max: 20,
        message: '请输入6~16位字母/数字/符号（至少两种）组合密码',
        pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
        trigger: 'blur'
      }]
    },
    // {
    //   fixed: true,
    //   label: '用户名',
    //   prop: 'username',
    //   searchSpan: 5,
    //   searchPlaceholder: "请输入用户名",
    //   editDisabled: true,
    //   editDisplay: true,
    //   slot: true,
    //   span: 10,
    //   rules: [
    //     {
    //       required: true,
    //       message: '请输入用户名(不超过15个字符)(字母或字母后加数字)',
    //       pattern: /^[a-zA-Z]\w{0,14}$/g,
    //       max: 15,
    //     },
    //     { validator: validateUsername, trigger: 'blur' }
    //   ]
    // },
    {
      fixed: true,
      label: '昵称',
      overHidden: true,
      prop: 'nickname',
      hide: true,
      editDisabled: false,
      editDisplay: false,
      overHidden:true,
      rules: [
        {
          required: false,
          message: '请输入昵称(不超过10个字符)',
          max: 10,
        }
      ],
      span: 10,
    },
    {
      label: '性别',
      editDisplay: false,
      prop: 'empGender',
      type: 'radio',
      slot: true,
      border: true,
      span: 10,
      rules: [{
        required: true,
        message: '请选择性别',
        trigger: 'blur'
      }],
      dicData: [{
        label: '男',
        value: '1'
      }, {
        label: '女',
        value: '0'
      }]
    },
    {
      fixed: true,
      editDisabled: true,
      label: '手机号',
      prop: 'phone',
      span: 10,
      rules: [{
        required: true,
        min: 11,
        max: 11,
        message: '请输入手机号',
        pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
        trigger: 'blur'
      }]
    },
    {
      fixed: true,
      label: '组织部门',
      prop: 'deptId',
      searchSpan: 5,
      searchslot: true,
      // search: true,
      formslot: true,
      slot: true,
      span: 10,
      dataType: "number",
      rules: [{
        required: true,
        message: '请选择部门',
        trigger: 'change'
      }]
    },
    {
      fixed: true,
      type:'select',
      label: '岗位等级',
      prop: 'stationId',
      hide: true,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择岗位等级',
        trigger: 'blur'
      }]
    },
    {
      fixed: true,
      label: '职位',
      prop: 'positionId',
      formslot: true,
      headerslot: true,
      width: 250,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择职位',
        trigger: 'blur'
      }]
    },
    {
      fixed: true,
      label: '职级',
      prop: 'positionRankName',
      formslot: true,
      width: 150,
      span: 10,
      slot: true,
      hide: true,
      rules: [{
        required: true,
        message: '请选择职级',
        trigger: 'blur'
      }]
    },
    // {
    //   fixed: true,
    //   label: '员工状态',
    //   prop: 'status',
    //   formslot: true,
    //   width:150,
    //   slot: true,
    //   span: 10,
    //   rules: [{
    //     required: true,
    //     message: '请选择员工状态',
    //     trigger: 'blur'
    //   }],
    // },
    {
      fixed: true,
      label: '证件类型',
      prop: 'credentialsType',
      formslot: true,
      hide: true,
      width:150,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择证件类型',
        trigger: 'blur'
      }],
    },
    {
      fixed: true,
      editDisabled: true,
      label: '证件号码',
      prop: 'credentialsNumber',
      hide: true,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        min: 18,
        max: 18,
        message: '请输入正确的证件号码',
        pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        trigger: 'blur'
      }]
    },
    {
      fixed: true,
      label: '查重部门',
      prop: 'businessGroupId',
      formslot: true,
      hide: true,
      width:150,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择查重部门',
        trigger: 'blur'
      }]
    },
    {
      fixed: true,
      label: '角色',
      prop: 'role',
      formslot: true,
      addDisplay: false,
      width:150,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择角色',
        trigger: 'blur'
      }]
    },
    {
      label: '账号状态',
      editDisplay: false,
      prop: 'lockFlag',
      type: 'radio',
      searchPlaceholder: "请选择帐号状态",
      slot: true,
      searchSpan: 4,
      span: 6,
      addDisplay: false,
      // search: true,
      border: true,
      rules: [{
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }],
      dicData: [
        {
          label: '全部',
          value: null
        }, {
          label: '正常',
          value: '0'
        },
        {
          label: '禁用',
          value: '9'
        }
      ]
    },
    {
      label: '员工状态',
      editDisplay: false,
      prop: 'status',
      type: 'radio',
      searchPlaceholder: "请选择员工状态",
      slot: true,
      searchSpan: 4,
      span: 10,
      addDisplay: true,
      // search: true,
      border: true,
      rules: [{
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }],
      dicData: [
        {
          label: '全部',
          value: ''
        }, {
          label: '试用',
          value: '1'
        },
        {
          label: '正式',
          value: '2'
        },
        {
          label: '实习',
          value: '3'
        }
      ]
    },
    {
      label: '公众号',
      editDisplay: false,
      addDisplay: false,
      prop: 'wx',
      type: 'select',
      searchSpan: 4,
      slot: true,
      // search: true,
      span: 6,
      border: true,
      rules: [{
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }],
      dicData: [{
        label: '全部',
        value: ''
      }, {
        label: '已关注',
        value: '1'
      }, {
        label: '未关注',
        value: '0'
      }]
    }, {
      width: 140,
      label: '添加时间',
      prop: 'createTime',
      type: 'datetime',
      hide: true,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisplay: false,
      addDisplay: false,
      span: 10
    },
    {
      width: 120,
      label: '入职时间',
      prop: 'entryTime',
      type: 'datetime',
      formslot: true,
      searchSpan: 7,
      searchslot: true,
      // search: true,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      editDisplay: false,
      addDisplay: true,
      rules: [{
        required: true,
        message: '请选择入职时间',
        trigger: 'blur'
      }],
      span: 10
    },
    {
      width: 120,
      label: '转正日期',
      prop: 'regularTime',
      type: 'datetime',
      hide: true,
      formslot: true,
      searchSpan: 7,
      searchslot: false,
      search: false,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      editDisplay: false,
      addDisplay: true,
      span: 10
    },
    {
      width: 120,
      label: '出生日期',
      prop: 'birthday',
      type: 'datetime',
      hide: true,
      formslot: true,
      searchSpan: 7,
      searchslot: false,
      search: false,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      editDisplay: false,
      disabled: true,
      addDisplay: true,
      rules: [{
        required: true,
        message: '请选择出生时间',
        trigger: 'blur'
      }],
      span: 10
    },
    {
      type:'select',
      fixed: true,
      label: '学历',
      prop: 'educationId',
      formslot: true,
      hide: true,
      width:150,
      span: 10,
      slot: true,
      rules: [{
        required: true,
        message: '请选择学历',
        trigger: 'blur'
      }],
    },
  ]
}
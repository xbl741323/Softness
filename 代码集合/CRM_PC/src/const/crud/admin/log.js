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
export const tableOption = {
  border: true,
  stripe: false,
  menuAlign: 'center',
  header:false,
  menu:false,
  align: 'center',
  refreshBtn: false,
  columnBtn:false,
  showClomnuBtn: false,
  enter: true,
  searchMenuSpan: 4,
  addBtn: false,
  emptyBtn:false,
  editBtn: false,
  viewBtn: true,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
  {
    label: '关键字',
    prop: 'keywords',
    searchPlaceholder:"请输入标题或操作人用户名",
    search:true,
    hide: true,
  },
  {
    label: '创建时间',
    prop: 'createTimes',
    type:'datetime',
    searchSpan:8,
    searchRange:true,
    search:true,
    hide: true,
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    label: '标题',
    prop: 'title',
  },
  {
    label: '请求参数',
    prop: 'requestParam',
    slot: true,
    overHidden: true
  },
  {
    label: '响应参数',
    prop: 'responseParam',
    slot: true,
    overHidden: true
  },
  {
    label: '操作人',
    prop: 'createBy'
  }
  ],
}

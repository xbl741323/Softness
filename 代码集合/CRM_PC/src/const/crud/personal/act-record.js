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
    stripe: true,
    menuAlign: 'center',
    menuWidth: 150,
    align: 'center',
    refreshBtn: true,
    showClomnuBtn: false,
    searchSize: 'mini',
    searchMenuSpan: 6,
    viewBtn:true,
    addBtn:false,
    header:false,
    props: {
      label: 'label',
      value: 'value'
    },
    column: [
      {
        width: 150,
        label: '创建时间',
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }, {
      label: '操作人',
      prop: 'remoteAddr'
    },{
      label: '活动类型',
      prop: 'createBy'
    }, {
      width: 80,
      label: '内容',
      prop: 'time'
    }, ]
  }
  
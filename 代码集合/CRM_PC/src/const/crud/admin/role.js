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
import { rule } from "@/util/validateRules";
export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: false,
    menuAlign: 'center',
    searchMenuSpan: 3.1,
    editBtn: false,
    header: false,
    delBtn: false,
    align: 'center',
    enter:true,
    menuWidth:290,
    addBtn: false,
    viewBtn: false,
    dialogClickModal: false,
    column: [
        {
            label: '关键词',
            prop: 'key',
            searchPlaceholder:"请输入角色名称关键词搜索",
            search:true,
            addBtn:false,
            searchMenuSpan:2,
            editDisplay: false,
            addDisplay: false,
            searchslot:true,
            hide:true
        },
        {
            label:'角色类型',
            prop:'isPartner',
            search:true,
            addBtn:false,
            searchMenuSpan:2,
            editDisplay: false,
            addDisplay: false,
            searchslot:true,
            hide:true,
            slot: true,
        },
        {
            label: '角色名称',
            prop: 'roleName',
            width: 230,
            slot:true,
            rules: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
            ]
        },
        {
            label: '角色类型',
            prop: 'isPartner',
            width: 200,
            slot: true,
            type: 'radio',
            editDisabled: true,
            dicData:[
                {
                    label: '内部角色',
                    value: 0
                },
                {
                    label:'合作机构',
                    value: 1
                }
            ],
            rules:[
                {required: true, message:'请选择角色类型', trigger:'change'}
            ]
        },
        {
            label: '角色标识',
            prop: 'roleCode',
            hide: true,
            editDisabled: true,
            rules: [
            { required: true, message: '角色标识不能为空', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
            { validator: rule.validatorKey, trigger: 'blur'}
            ]
        },
        // {
        //     label: '数据权限',
        //     prop: 'dsType',
        //     type: 'select',
        //     editDisplay: false,
        //     addDisplay: false,
        //     rules: [
        //     { required: true, message: '请选择数据权限类型', trigger: 'blur'}
        //     ],
        //     dicData: [{
        //         label: '全部',
        //         value: 0
        //     }, {
        //         label: '自定义',
        //         value: 1
        //     }, {
        //         label: '本级及子级',
        //         value: 2
        //     }, {
        //         label: '本级',
        //         value: 3
        //     }]
        // }, 
    {
        label: '角色描述',
        prop: 'roleDesc',
        overHidden: true,
        type: 'textarea',
        row: true,
        minRows: 2,
        rules: [
        { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
        ]
    }, {
        label: '',
        prop: 'dsScope',
        addBtn:false,
        formslot: true,
        editDisplay: false,
        addDisplay: false,
        showClomnu: false,
        hide: true
    }, {
        label: '创建时间',
        prop: 'createTime',
        type: 'datetime',
        addBtn:false,
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        editDisplay: false,
        width: 180,
        addDisplay: false
    },{
        label:"使用人数",
        prop: 'userCount',
        addBtn:false,
        slot:true,
        editDisplay: false,
        addDisplay: false,
        width: 100,
    }]
}


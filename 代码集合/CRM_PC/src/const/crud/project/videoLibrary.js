export const videoOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 150,
  border: true,
  column: [
    {
      label: '视频编号',
      prop: 'videoNo',
      width: 140,
      overHidden: true
    },
    {
      label: '视频预览',
      prop: 'videoPreview',
      width: 160,
      overHidden: true
    },
    {
      label: '视频标题',
      prop: 'videoName',
      width: 350,
      overHidden: true,
      slot: true
    },
    {
      label: '视频时长',
      prop: 'videoTime',
      overHidden: true,
      slot: true
    },
    {
      label: '专业分类',
      prop: 'professionalType',
      overHidden: true,
      slot: true
    },
    {
      label: '关联课程',
      prop: 'relateClassCount',
      overHidden: true,
      slot: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      overHidden: true,
      search: false,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '更新时间',
      prop: 'updateTime',
      type: 'datetime',
      overHidden: true,
      search: false,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  ]
}

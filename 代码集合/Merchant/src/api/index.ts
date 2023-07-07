import request from '@/utils/request'

// 获取数据-仅测试使用
export function getListColumn(params: any) {
  return request({
    url: '/hfxl/column/listColumn',
    method: 'get',
    params: params
  });
}
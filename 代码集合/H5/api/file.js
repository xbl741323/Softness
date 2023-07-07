  import request from '@/utils/request'
  
  // 卧涛文档列表es搜索
  export function esPageFile(data) {
    return request({
      url: '/esDoc/esPageDoc',
      method: 'post',
      data: data
    });
  };


  // 卧涛文档文档详情
 export function getDocDetail(id) {
    return request({
      url: `/doc/getDoc?id=${id}`,
      method: 'get',
    });
  };


  // 卧涛文档文档预览
 export function previewDoc(data) {
    return request({
      url: `/doc/preview`,
      method: 'post',
      data: data
    });
  };
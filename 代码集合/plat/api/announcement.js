import request from '@/plugins/request'

// 资讯广场首页-卧涛文档按浏览量排序
export function pageDoc(data){
    return request({
        url:'/doc/pageDoc',
        method:'post',
        data: data
    })
}

// 资讯广场-是否已收藏
export function getCollectStatus(data){
    return request({
        url:'/info/collect/isCollected',
        method:'post',
        data: data
    })
}
// 资讯广场-添加收藏
export function addCollect(data){
    return request({
        url:'/info/collect/add',
        method:'post',
        data: data
    })
}
// 资讯广场-取消收藏
export function deleteCollect(data){
    return request({
        url:'/info/collect/delBatch',
        method:'delete',
        data: data
    })
}
// 个人中心-我的收藏
export function getMyCollectList(data){
    return request({
        url:'/info/collect/page',
        method:'post',
        data: data
    })
}
// 资讯广场通知公告上一篇下一篇
export function getPreAndNext(id){
    return request({
        url:'/policy/getPreAndNext/'+id,
        method:'get',
    })
}

export function getArtcleDetail(obj){
    return request({
        url:'/policy/detail?number='+obj.number+'&type='+obj.type+'&token='+obj.screen,
        method:'GET'
    })
}
// 获取行业资讯详情
export function getIndustryDetail(number){
    return request({
        url:'/industryWeb/getDetail/'+number,
        method:'GET'
    })
}
// 获取通知公告详情
export function getNoticeDetail(obj){
    return request({
        url:`/policy/detailByNumber?number=${obj.number}&type=${obj.type}&id=${obj.id}`,
        method:'GET'
    })
}

// 推荐产品
export function recommendProducts(params){
    return request({
        url:'/product/spu/listRecommendedProducts?spuIds=' + params.spuIds,
        method:'GET',
    })
}

// export function downloadFile(data){
//     return request({
//         url:'/file/download?url='+data,
//         method:'get'
//     })
// }

export function downloadFile(params){
    return request({
        url:'/file/downloadPc?url=' + params.url + "&filename=" + params.filename,
        method:'get',
        responseType: "blob"
    })
}

export function getAttributionList(data){
    return request({
        url:'/drop/getValue/'+data,
        method:'GET'
    })
}

export function getAreaList(data){
    return request({
        url:'/policy/selection/'+data,
        methos:'GET'
    })
}

export function getAnnounceList(data){
    return request({
        url:'/policy/list',
        method:'post',
        data:data
    })
}

export function getFileList(data){
    return request({
        url:'/file/list',
        method:'post',
        data:data
    })
}

export function collection(obj){
    return request({
        url:'/collection/add',
        method:'post',
        data:obj
    })
}

export function delCollect(obj){
    return request({
        url:'/collection/delColl',
        method:'post',
        data:obj
    })
}


export function views(obj){
    return request({
        url:'/policy/pageviews/'+obj,
        method:'put',
    })
}

export function addColl(obj){
    return request({
        url:'/collection/addCollection',
        method:'post',
        data:obj
    })
}

export function cancelCollect(obj){
    return request({
        url:'/collection/cancelCollection',
        method:'post',
        data:obj
    })
}

// 地区重构
export function getNewArea(){
    return request({
        url:'/tcRegion/tree',
        methos:'GET'
    })
}


// 资讯广场通知公告二级栏目es搜索
export function esPagePolicy(data) {
    return request({
      url: '/esPolicy/esPagePolicy',
      method: 'post',
      data: data
    });
  };


  // 资讯广场行业资讯二级栏目es搜索
export function esPageIndustry(data) {
    return request({
      url: '/esIndustryInfo/esPageIndustryInfo',
      method: 'post',
      data: data
    });
  };


    // 资讯广场首页-行业资讯-按照浏览量排序
export function pageTmIndustry(data) {
    return request({
      url: '/industryWeb/pageTmIndustryInfoOrderByViews',
      method: 'post',
      data: data
    });
  };

  // 卧涛文档列表es搜索
  export function esPageFile(data) {
    return request({
      url: '/esDoc/esPageDoc',
      method: 'post',
      data: data
    });
  };

  // 卧涛文档文档下载
 export function downloadDoc(data) {
    return request({
      url: `/doc/download?id=${data.id}&userId=${data.userId}`,
      method: 'get',
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

  // 资讯广场es搜索
  export function pagePolicyGlobal(data) {
    return request({
      url: '/esPolicy/pagePolicyGlobal',
      method: 'post',
      data: data
    });
  };

  // 技术成果全局搜索
  export function esYgAchievement(data) {
    return request({
      url: '/esYgAchievement/pageGlobal',
      method: 'post',
      data: data
    });
  };

  // 技术需求全局搜索
  export function esYgRequirement(data) {
    return request({
      url: '/esYgRequirement/pageGlobal',
      method: 'post',
      data: data
    });
  };


  // 根据关键字获取全局搜索数量
  export function searchGlobalCount(data) {
    return request({
      url: '/esSearch/searchGlobalCount',
      method: 'get',
      params: data
    });
  };

// 获取资讯广场筛选项
export function getSelection(type) {
    return request({
        url: '/policy/selectionByType/' + type,
        method: 'get',
    });
};

// 获取侧边热点列表数据
export function getSideHotPolicy(param) {
    return request({
        url: '/policy/getSideHotPolicy',
        method: 'get',
        params: param
    });
};

// 获取行业资讯侧边热点列表数据
export function getIndustrySide() {
    return request({
        url: '/policy/getIndustrySideHotPolicy?type=10',
        method: 'get',
    });
};

//保存卧涛文档订单 
export function saveFileOrder(data) {
    return request({
        url: '/tmFileOrder/saveTmFileOrder',
        method: 'post',
        data: data
    });
};

//微信支付
export function wapPayAli(id) {
    return request({
        url: `/tmFileOrder/tradePage?tmFileOrderId=${id}`,
        method: 'post',
    });
};

//支付宝支付 
export function wapPayWx(id) {
    return request({
        url: `/tmFileOrder/wapPayWx?tmFileOrderId=${id}`,
        method: 'post',
    });
};
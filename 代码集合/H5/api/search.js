import request from '~/utils/request'

export function globalSearch(params){
    return request({
        url:'/search',
        method:'GET',
        params: params
    })
}

//获取省份
export function switchProvincePC() {
    return request({
        url: '/area/switchProvincePC'
    })
}

//全局搜索服务产品搜索/产品列表
export function pageGlobalSpu(param) {
    return request({
      url: '/product/spu/pageGlobalSpu' ,
      method: 'post',
      data: param
    });
};

// 全局搜索-政策广场
export function getPolicySquare(param) {
    return request({
      url: '/esPolicy/pagePolicyGlobal' ,
      method: 'post',
      data: param
    });
};

// 全局搜索-技术成果
export function getTechResult(param) {
    return request({
      url: '/esYgAchievement/pageGlobal' ,
      method: 'post',
      data: param
    });
};

// 全局搜索-技术需求
export function getTechRequire(param) {
    return request({
      url: '/esYgRequirement/pageGlobal' ,
      method: 'post',
      data: param
    });
};
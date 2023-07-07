import request from '@/router/axios'

//业绩指标-等级指标
export function pageKpGradeIndex(data){
    return request({
      url: '/admin/gradeKpi/pageKpGradeIndex',
      method: 'post',
      data: data,
    })
}

//业绩指标-单项指标
export function pageKpIndex(data){
    return request({
      url: '/admin/kpi/pageKpIndex',
      method: 'post',
      data: data,
    })
}

//财务指标
export function pageFinancialIndex(data){
  return request({
    url: '/admin/financial/pageFinancialIndex',
    method: 'post',
    data: data,
  })
}

//行政指标
export function pageAdministrativeIndex(data){
  return request({
    url: '/admin/adm/pageAdministrativeIndex',
    method: 'post',
    data: data,
  })
}

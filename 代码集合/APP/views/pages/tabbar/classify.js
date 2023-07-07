import React, { useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, FlatList, View, Dimensions, Image, TextInput, SafeAreaView, TouchableWithoutFeedback, ScrollView, StatusBar, ImageBackground } from 'react-native'
import * as CodeMsg from "../../utils/common/codeMsg";
import dp2px from '../../utils/common/dp2px';
import { getProTab, getProductList, getAttributeList, getProjectAttribute } from '../../api/product'
import ProItem from '../../components/classify/proItem'
import ComStatusBar from '../../components/common/comStatusBar';
import NoData from '../../components/common/noData';

export default function Classify(props) {
  const { route, navigation } = props
  const proRef = useRef(null)
  const [pageNo, setPageNo] = useState(1) // 分页
  const [pageSize] = useState(20) // 页数
  const [total, setTotal] = useState(0) // 产品总数
  const [reachStatus, setReachStatus] = useState(false) // 是否触底
  const [locationName, setLocationName] = useState('安徽') // 定位省名称
  const [locationId, setLocationId] = useState(340000) // 定位省id
  const [tabIndex, setTabIndex] = useState(0) // 左侧tab栏index
  const [optionIndex, setOptionIndex] = useState(0) // option数据下标
  const [filterIndex, setFilterIndex] = useState(0) // filter栏index
  const [openFilter, setOpenFilter] = useState(false) // 遮罩显示状态
  const [categoryId, setCategoryId] = useState(1) // 产品类型id
  const [childProId, setChildProId] = useState(2)
  const [proList, setProList] = useState([]) // 产品列表
  const [tabList, setTabList] = useState([]) // 左侧tab栏数据
  const [childPro, setChildPro] = useState([]) // 知识产权子分类列表
  const [filterList, setFilterList] = useState([]) // filter栏数据
  const [optionList, setOptionList] = useState([]) // filter子option数据
  const [areaList, setAreaList] = useState([]) // 项目申报地区数据
  const [selection, setSelection] = useState([]) // 项目申报归口数据

  // 关闭遮罩层
  const hideModel = () => {
    setOpenFilter(false)
  }

  // 修改tab栏index
  const changeTab = (index) => {
    setPageNo(0)
    setFilterIndex(0)
    setChildProId(2)
    setTabIndex(index)
    setCategoryId(Number(tabList[index].id))
    if (categoryId != Number(tabList[index].id)) {
      proRef.current.scrollToOffset({ animated: true, y: 0 });
    }
    hideModel()
  }

  // 修改option选项id
  const changeOption = (item, index) => {
    if (categoryId == 2) {
      item == null ? setChildProId(2) : setChildProId(Number(item.id))
    } else {
      setChildProId(2)
    }
    setPageNo(0)
    setOptionIndex(index)
    filterList[filterIndex].selectChildId = item == null ? '' : item.id
    filterList[filterIndex].attributeName = item == null ? filterList[filterIndex].defaultName : item.categoryName
    setFilterList([...filterList])
    hideModel()
    proRef.current.scrollToOffset({ animated: true, y: 0 });
  }

  // 修改filter栏index
  const changeFilter = (index) => {
    setOpenFilter(true)
    setFilterIndex(index)
    if (categoryId == 2) {
      setOptionList([...childPro])
    } else if (categoryId == 1) {
      setProjectVal(index)
    } else {
      let r = []
      setOptionList([...r])
    }
  }

  // 项目申报属性赋值
  const setProjectVal = (index) => {
    // 回显地区option数据
    if (index == 0) {
      let r = areaList.filter(item => {
        return item.value == locationId
      })
      let optionList = r.length > 0 ? r[0].children : []
      optionList.forEach(item => {
        item.id = item.value
        item.categoryName = item.label
      })
      let filterResult = locationId == 100000 ? optionList.slice(0, 1) : optionList
      setOptionList([...filterResult])
    }
    // 回显归口option数据
    if (index == 1) {
      let r = selection
      r.forEach(item => {
        item.categoryName = item.name
      })
      setOptionList([...r])
    }
  }

  // 筛选地区
  const filterArea = () => {
    let filterList = []
    let r = areaList.filter(item => {
      return item.value == locationId
    })
    if (r.length > 0) {
      r[0].children.forEach(item => {
        filterList.push(item.value)
      })
    }
    return filterList
  }

  // 获取产品列表数据
  const getProData = () => {
    let attribute = []
    filterList.forEach(item => {
      if ((item.id && (item.id == 1)) || (item.id && (item.id == 2) && item.selectChildId != '')) {
        attribute.push({
          attributeId: item.id,
          attributeValueList: item.selectChildId == '' ? [...new Set(["100001"].concat(filterArea()))] : [item.selectChildId]
        })
      }
    })
    let params = {
      categoryId: categoryId,
      pageNo: pageNo,
      pageSize: pageSize,
      status: "1",
    }
    if (categoryId == 2) {
      params.categoryId = childProId
    }
    if (categoryId == 1) {
      // params.generateAttributeList = attribute.length > 0 ? attribute : [{
      //   attributeId: 1,
      //   attributeValueList: [...new Set(["100001"].concat(filterArea()))]
      // }]
    }
    getProductList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let oldList = proList
        let records = res.data.records
        let r = reachStatus ? oldList.concat(records) : records
        setProList([...r])
        setTotal(res.data.total)
        setReachStatus(false)
      }
    })
  }

  // 获取产品分类数据
  const getTab = () => {
    let params = {
      parentId: 0,
    }
    getProTab(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data.filter(item => {
          return item.id == 2
        })
        setChildPro([...result[0].child])
        setTabList([...res.data])
      }
    })
  }

  // 获取类目产品属性信息
  const getAttributeData = () => {
    let params = {
      categoryIds: [categoryId]
    }
    getAttributeList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        if (result.length > 0) {
          result.forEach(item => {
            item.selectChildId = ""
            item.isAttr = true // isAttr：true-是属性 false-是二级分类
            item.defaultName = item.attributeName
          })
          setFilterList([...result])
        } else {
          if (categoryId == 2) {
            let r = [{
              selectChildId: "",
              isAttr: false,
              defaultName: "分类",
              attributeName: "分类"
            }]
            setFilterList([...r])
          } else {
            let r = []
            setFilterList([...r])
          }
        }
      }
    })
  }

  // 获取项目申报属性信息
  const getProAttribute = () => {
    getProjectAttribute().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        setAreaList([...r.area])
        setSelection([...r.selection[0].options])
      }
    })
  }

  // 触底函数
  const getReachList = () => {
    if (proList.length < total) {
      setReachStatus(true)
      setPageNo(pageNo + 1)
    }
  }

  // 接收参数赋值
  const setDefaultVal = () => {
    if (route.params && route.params.index) {
      proRef.current.scrollToOffset({ animated: false, y: 0 });
      setTabIndex(route.params.index)
      setCategoryId(route.params.id)
      setPageNo(1)
    } else {
      setTabIndex(0)
      setCategoryId(1)
    }
  }

  // 监听categoryId钩子函数
  // useEffect(() => {
  //   getAttributeData()
  //   getProData()
  // }, [categoryId])

  // 监听route钩子函数
  // useEffect(() => {
  //   setDefaultVal()
  // }, [route])

  // 监听optionIndex、pageNo钩子函数
  // useEffect(() => {
  //   if (tabList.length != 0) {
  //     getProData()
  //   }
  // }, [optionIndex, pageNo])

  // 获取tabList、proAttribute钩子函数
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getTab()
  //     getProAttribute()
  //   }, [])
  // )

  // 产品item
  const renderItem = ({ item }) => (
    <ProItem proInfo={item} navigation={navigation} ></ProItem>
  )

  // 产品列表尾部组件
  const renderFoot = () => (
    <View style={styles.rightFoot}></View>
  )

  return (
    <NoData />
    // <View>
    //   <ComStatusBar />
    //   <SafeAreaView>
    //     <View style={styles.mainContain}>
    //       <View style={styles.searchContain}>
    //         <View style={styles.searchLeft}>
    //           <Text style={styles.locationText}>{locationName}</Text>
    //           <Image style={styles.searchImg} source={require('../../images/classify/icon-pointer.png')}></Image>
    //           <Text style={styles.langSty}></Text>
    //           <TextInput
    //             style={styles.searchInput}
    //             underlineColorAndroid="transparent"
    //             autoCapitalize="none"
    //             textAlignVertical='center'
    //             placeholderTextColor='#B4B4B4'
    //             placeholder="搜索你想要的内容">
    //           </TextInput>
    //         </View>
    //         <Text style={styles.searchBtn}>搜索</Text>
    //       </View>
    //       <View style={styles.proContain}>
    //         <View style={styles.proLeftContain}>
    //           {
    //             tabList.map((item, index) => {
    //               return (
    //                 <TouchableWithoutFeedback key={index} onPress={(e) => changeTab(index, e)}>
    //                   <View style={[styles.tabItem, tabIndex == index ? styles.activeTabItem : '']}>
    //                     <View style={[styles.tabPointer, tabIndex == index ? styles.activeTab : '']}></View>
    //                     <Text style={[styles.tabText, tabIndex == index ? styles.activeTabText : '']}>{item.categoryName}</Text>
    //                   </View>
    //                 </TouchableWithoutFeedback>
    //               )
    //             })
    //           }
    //         </View>
    //         <View style={styles.proRightContain}>
    //           {
    //             filterList.length > 0 ?
    //               (
    //                 <View style={styles.filterContain}>
    //                   <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
    //                     {
    //                       filterList.map((item, index) => {
    //                         return (
    //                           <TouchableWithoutFeedback key={index} onPress={(e) => changeFilter(index, e)}>
    //                             <View key={index} style={[styles.filterItem, (filterIndex == index) && (openFilter) || item.selectChildId != '' ? styles.activeFilterItem : '']}>
    //                               <Text style={[styles.filterText, (filterIndex == index) && (openFilter) || item.selectChildId != '' ? styles.activeFilterText : '']}>{item.attributeName}</Text>
    //                               <Image style={styles.filterImg} source={(filterIndex == index) && (openFilter) || item.selectChildId != '' ? require('../../images/classify/icon-active.png') : require('../../images/classify/icon-normal.png')}></Image>
    //                             </View>
    //                           </TouchableWithoutFeedback>
    //                         )
    //                       })
    //                     }
    //                   </ScrollView>
    //                 </View>
    //               ) : ''
    //           }
    //           {openFilter ?
    //             <View style={styles.optionContain}>
    //               <TouchableWithoutFeedback onPress={(e) => changeOption(null, 0, e)}>
    //                 <View>
    //                   <Text style={[styles.optionItem, filterList[filterIndex].selectChildId == '' ? styles.activeOptionItem : '']}>全部</Text>
    //                 </View>
    //               </TouchableWithoutFeedback>
    //               {
    //                 optionList.map((item, index) => {
    //                   return (
    //                     <TouchableWithoutFeedback onPress={(e) => changeOption(item, index + 1, e)} key={index}>
    //                       <View>
    //                         <Text style={[styles.optionItem, filterList[filterIndex].selectChildId == item.id ? styles.activeOptionItem : '']}>{item.categoryName}</Text>
    //                       </View>
    //                     </TouchableWithoutFeedback>
    //                   )
    //                 })
    //               }
    //             </View>
    //             : ''}
    //           {
    //             openFilter ? (
    //               <TouchableWithoutFeedback onPress={(e) => hideModel(e)}>
    //                 <View style={styles.hideModel}></View>
    //               </TouchableWithoutFeedback>
    //             ) : ''
    //           }
    //           <FlatList // 产品列表
    //             ref={proRef}
    //             data={proList}
    //             renderItem={renderItem}
    //             keyExtractor={(item, index) => index}
    //             ListFooterComponent={renderFoot}
    //             showsVerticalScrollIndicator={false}
    //             onEndReached={(e) => getReachList(e)}
    //             onEndReachedThreshold={0}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //   </SafeAreaView>
    // </View>
  )
}

const styles = StyleSheet.create({
  mainContain: {
    position: 'relative',
    backgroundColor: '#FFFFFF'
  },
  searchContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: dp2px(40),
    marginTop: dp2px(15),
    marginBottom: dp2px(10)
  },
  searchLeft: {
    width: dp2px(302),
    height: dp2px(40),
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
    borderWidth: dp2px(1),
    borderColor: '#36A6FE',
    borderRadius: dp2px(9)
  },
  searchImg: {
    width: dp2px(16),
    height: dp2px(16)
  },
  searchInput: {
    width: dp2px(190),
    fontSize: dp2px(14),
    paddingVertical: 0,
    color: '#747474',
  },
  searchBtn: {
    marginLeft: dp2px(11),
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
  },
  locationText: {
    width: dp2px(50),
    color: '#333333',
    fontSize: dp2px(15),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: dp2px(15)
  },
  langSty: {
    width: dp2px(1),
    height: dp2px(20),
    backgroundColor: '#E4E4E4',
    marginLeft: dp2px(6),
    marginRight: dp2px(10)
  },
  proContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  proLeftContain: {
    width: dp2px(110),
    backgroundColor: '#F4F6F8'
  },
  tabItem: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: dp2px(44),
    backgroundColor: "#F4F6F8"
  },
  activeTabItem: {
    backgroundColor: "#ffffff"
  },
  tabPointer: {
    position: 'absolute',
    left: 0,
    width: dp2px(4),
    height: dp2px(16),
    backgroundColor: '#F4F6F8',
    borderTopRightRadius: dp2px(4),
    borderBottomRightRadius: dp2px(4)
  },
  activeTab: {
    backgroundColor: "#36a6fe"
  },
  tabText: {
    color: "#333333",
    fontSize: dp2px(14)
  },
  activeTabText: {
    fontWeight: 'bold',
    fontSize: dp2px(16)
  },
  proRightContain: {
    position: 'relative',
    width: dp2px(265),
    paddingLeft: dp2px(7),
    paddingBottom: dp2px(120),
    height: Dimensions.get('window').height
  },
  rightFoot: {
    height: dp2px(50)
  },
  filterContain: {
    width: dp2px(265),
    height: dp2px(44),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterItem: {
    height: dp2px(28),
    backgroundColor: '#F4F6F8',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dp2px(15),
    marginRight: dp2px(16),
    borderRadius: dp2px(8)
  },
  activeFilterItem: {
    backgroundColor: '#DEEFFF'
  },
  filterText: {
    color: '#B4B4B4',
    fontSize: dp2px(12),
    marginRight: dp2px(6)
  },
  activeFilterText: {
    color: '#36A6FE',
    fontWeight: 'bold'
  },
  filterImg: {
    width: dp2px(10),
    height: dp2px(10),
  },
  optionContain: {
    position: 'absolute',
    top: dp2px(44),
    width: dp2px(265),
    paddingLeft: dp2px(7),
    paddingBottom: dp2px(40),
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    zIndex: 100
  },
  optionItem: {
    color: '#555555',
    fontSize: dp2px(12),
    marginRight: dp2px(10),
    marginBottom: dp2px(12)
  },
  activeOptionItem: {
    color: '#36A6FE'
  },
  hideModel: {
    position: 'absolute',
    width: dp2px(265),
    height: Dimensions.get('window').height,
    top: dp2px(44),
    left: -dp2px(0),
    backgroundColor: '#000000',
    opacity: 0.3,
    zIndex: 50
  }
})

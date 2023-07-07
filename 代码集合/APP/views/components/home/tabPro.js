import React, { useEffect, useState, useImperativeHandle } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import * as CodeMsg from "../../utils/common/codeMsg";
import * as envCofig from "../../utils/envConfig"
import * as proFilter from "../../utils/filter/product"
import { getProTab, getProductList } from '../../api/product'

export default function TabPro({ proRef, props }) {

  // 父组件调用子组件钩子函数
  useImperativeHandle(proRef, () => ({
    getReachList: () => {
      if (proList.length < total) {
        setReachStatus(true)
        setPageNo(pageNo + 1)
      }
      console.log('触底了')
    },
    changeTab: (index) => {
      setReachStatus(false)
      setPageNo(1)
      setTabIndex(index)
      setCategoryId(Number(tabList[index].id))
    }
  }));
  const [reachStatus, setReachStatus] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [categoryId, setCategoryId] = useState(1)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [tabList, setTabList] = useState([])
  const [proList, setProList] = useState([])

  // 跳转到产品详情
  const toDetail = (item) => {
    // let navigation = props.navigation
    // let params = {
    //   id: item.id
    // }
    // navigation.navigate('ProDetail', params)
  }

  // tab切换
  // const changeTab = (index) => {

  // }

  // 获取产品数据
  const getProData = () => {
    let params = {
      categoryId: categoryId,
      pageNo: pageNo,
      pageSize: pageSize,
      status: "1",
    }
    getProductList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let oldList = proList
        let records = res.data.records
        let r = reachStatus == true ? oldList.concat(records) : records
        setProList([...r])
        setTotal(res.data.total)
        setReachStatus(false)
      }
    })
  }

  // 获取产品分类tab数据
  const getTab = () => {
    let params = {
      parentId: 0,
    }
    getProTab(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        setTabList([...res.data])
      }
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (tabList.length == 0) {
        getTab()
      }
      getProData()
    }, [categoryId, pageNo])
  )

  return (
    <View style={[styles.tabContain, reachStatus ? styles.activeTabSty : '', proList.length < 5 ? styles.activeBottomSty : '']}>
      {/* <ScrollView style={styles.tabScrollSty} horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.tabSty}>
          {
            tabList.map((item, index) => {
              return (
                <TouchableWithoutFeedback onPress={(e) => changeTab(index, e)} key={index}>
                  <View style={[styles.tabItem, index == 0 ? styles.tabItemMarginRight : '']}>
                    <Text style={[styles.tabItemText, index == tabIndex ? styles.activeItemText : '']}>{item.categoryName}</Text>
                    <View style={[styles.tabItemLine, index == tabIndex ? styles.activeLine : '']}></View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </ScrollView> */}
      <View style={styles.proList}>
        {
          proList.map((item, index) => {
            return (
              <TouchableWithoutFeedback onPress={(e) => toDetail(item, e)} key={index}>
                <View style={styles.proItem}>
                  <Image resizeMode='stretch' style={styles.proCover} source={{ uri: envCofig.CDN_BASE_URL + item.imageUrl }}></Image>
                  <Text numberOfLines={1} style={styles.proItemTitle}>{item.spuTitle}</Text>
                  <Text numberOfLines={1} style={styles.proItemDesc}>{item.spuSlogan}</Text>
                  {
                    item.isOnline ? (
                      <Text numberOfLines={1} style={styles.proItemPrice}>
                        <Text>
                          ￥{proFilter.fixClassPrice(item.spuMinAmount)}元
                        </Text>
                        <Text>
                          {
                            proFilter.fixClassPrice(item.spuMinAmount) != proFilter.fixClassPrice(item.spuMaxAmount) ? '起' : ''
                          }
                        </Text>
                      </Text>
                    ) : (<Text numberOfLines={1} style={styles.proItemPrice}>
                      面议
                    </Text>)
                  }
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </View>
      {
        reachStatus ? (
          <View style={styles.loadingSty}>
            <Text style={styles.loadingTextSty}>加载中</Text>
          </View>
        ) : ''
      }
    </View>
  )
}

const styles = StyleSheet.create({
  /**
  * tab产品
  */
  tabContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: dp2px(0),
  },
  activeBottomSty: {
    paddingBottom: dp2px(300),
  },
  activeTabSty: {
    paddingBottom: dp2px(10),
  },
  tabScrollSty: {
    width: dp2px(351),
  },
  tabSty: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp2px(10)
  },
  tabItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dp2px(15),
  },
  tabItemMarginRight: {
    marginLeft: 0
  },
  tabItemText: {
    color: '#B7B4B4',
    fontSize: dp2px(14),
    marginBottom: dp2px(4)
  },
  tabItemLine: {
    width: dp2px(14),
    height: dp2px(4),
    backgroundColor: '#F5F7FB',
    borderRadius: dp2px(2)
  },
  activeItemText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: dp2px(16)
  },
  activeLine: {
    backgroundColor: '#2065F4',
  },
  proList: {
    width: dp2px(351),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  proItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: dp2px(173),
    backgroundColor: '#ffffff',
    paddingBottom: dp2px(10),
    borderRadius: dp2px(10),
    marginBottom: dp2px(10)
  },
  proCover: {
    marginTop: dp2px(6),
    width: dp2px(161),
    height: dp2px(113),
    borderTopLeftRadius: dp2px(10),
    borderTopRightRadius: dp2px(10),
    marginBottom: dp2px(6)
  },
  proItemTitle: {
    width: dp2px(161),
    color: '#555555',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginBottom: dp2px(4)
  },
  proItemDesc: {
    width: dp2px(161),
    color: '#B7B4B4',
    fontSize: dp2px(12),
    marginBottom: dp2px(10)
  },
  proItemPrice: {
    width: dp2px(161),
    color: '#FA7A42',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  loadingSty: {
    marginBottom: dp2px(10),
  },
  loadingTextSty: {
    fontSize: dp2px(12),
    color: '#B7B4B4'
  }
})

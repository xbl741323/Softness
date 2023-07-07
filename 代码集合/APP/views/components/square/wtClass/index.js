import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import CourseItem from './courseItem'
import * as CodeMsg from "../../../utils/common/codeMsg";
import * as envCofig from "../../../utils/envConfig"
import LinearGradient from 'react-native-linear-gradient';
import {
  getSVideoList,
  getClassList,
  getPlateList,
  getPlateRelateClass
} from '../../../api/wtClass'

export default function WtClass({ props }) {
  const [bannerUrl] = useState(require('../../../images/square/wtClass/banner.png'))
  const [shortList, setShortList] = useState([]) // 短视频
  const [freeList, setFreeList] = useState([]) // 完全免费
  const [vipFreeList, setVipFreeList] = useState([]) // VIP免费
  const [soloFeeList, setSoloFeeListt] = useState([]) // 单独收费
  const [classTabList, setClassTabList] = useState([])  // 课程板块tab
  const [tabClassArr, setTabClassArr] = useState([]) // 板块关联课程
  const [tabIndex, setTabIndex] = useState(0)

  const changeTab = (index) => {
    setTabIndex(index)
  }

  // 获取课程列表
  const getClassData = (type) => {
    let params = {
      pageSize: type == 1 ? 4 : type == 2 ? 3 : 6,
      pageNo: 1,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: type, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassList(params).then(res => {
      if (res.data.code == CodeMsg.CODE_0) {
        let list = res.data.data.records
        filterClassData(type, list)
      }
    })
  }

  // 针对不同类型课程列表赋值
  const filterClassData = (type, list) => {
    if (type == 1) { // 1-完全免费
      setFreeList([...list])
    }
    if (type == 2) { // 2-vip免费
      setVipFreeList([...list])
    }
    if (type == 3) { // 3-单独收费
      setSoloFeeListt([...list])
    }
  }

  // 获取短视频列表
  const getShortList = () => {
    let params = {
      pageSize: 10,
      pageNo: 1
    }
    getSVideoList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        setShortList([...res.data.records])
      }
    })
  }

  // 获取板块关联课程列表数据
  const getPlateRelateData = (plateId) => {
    let params = {
      pageSize: 1000,
      pageNo: 1,
      baseShowState: 1,
      tradingChargeType: 2,
      plateId: plateId,
      getTrySeeSectionNumber: true,
    }
    getPlateRelateClass(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        setTabClassArr([...res.data.records])
      }
    })
  }

  // 获取板块列表数据
  const getPlateData = () => {
    getPlateList().then(res => {
      if (res.code == CodeMsg.CODE_0 && res.data.length > 0) {
        setClassTabList([...res.data])
      }
    })
  }

  // 跳转到课程详情
  const toCourseDetail = (id) => {
    props.navigation.navigate('CourseDetail', { id: id })
  }

  // 跳转到短视频页面
  const toShortVideo = (index) => {
    props.navigation.navigate('ShortVideo', { index: index })
  }

  useEffect(() => {
    if (classTabList.length > 0) {
      getPlateRelateData(classTabList[tabIndex].id)
    }
  }, [tabIndex])

  useEffect(() => {
    if (classTabList.length != 0) {
      getPlateRelateData(classTabList[tabIndex].id)
    }
  }, [classTabList])

  useFocusEffect(
    React.useCallback(() => {
      getPlateData()
      getShortList()
      getClassData(1)
      getClassData(2)
      getClassData(3)
    }, [])
  )

  return (
    <View style={styles.classContain}>
      {/* banner区域 */}
      <Image resizeMode='stretch' style={styles.classBanner} source={bannerUrl}></Image>
      {/* 短视频区域 */}
      <View style={styles.comContain}>
        <Text style={styles.comLang}></Text>
        <Text style={styles.comTitle}>短视频</Text>
      </View>
      <View style={styles.shortContain}>
        <ScrollView style={styles.tabScrollSty} horizontal={true} showsHorizontalScrollIndicator={false}>
          {
            shortList.map((item, index) => {
              return (
                <TouchableWithoutFeedback key={index} onPress={(e) => toShortVideo(index, e)} style={[styles.shortItem, index == 0 ? styles.activeShortItem : '']}>
                  <View style={[styles.shortItem, index == 0 ? styles.activeShortItem : '']}>
                    <Image resizeMode='stretch' style={styles.shortCover} source={{ uri: envCofig.CDN_BASE_URL + item.coverPicUrl }}></Image>
                    <View style={styles.shortTimeContain}>
                      <Image style={styles.shortTimeCover} source={require('../../../images/home/icon-pointer.png')}></Image>
                      <Text style={styles.shortTimeVal}>{item.videoTime}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </ScrollView>
      </View>
      {/* 免费专区 */}
      {
        freeList.length > 0 ? (
          <View style={styles.comContain}>
            <Text style={styles.comLang}></Text>
            <Text style={styles.comTitle}>免费专区</Text>
          </View>
        ) : ''
      }
      {/* 课程列表 */}
      {
        freeList.length > 0 ? (
          <View style={styles.allFreeContain}>
            {
              freeList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={(e) => toCourseDetail(item.id, e)} style={styles.allFreeItem}>
                    <View style={styles.allFreeItem}>
                      <Image style={styles.allFreeCover} source={{ uri: envCofig.CDN_BASE_URL + item.baseCoverUrl }}></Image>
                      <Text style={styles.allFreeTitle} numberOfLines={1}>{item.baseTitle}</Text>
                      <Text style={styles.allFreeDesc} numberOfLines={1}>{item.baseSlogan}</Text>
                      <Text style={styles.allFreePrice}>免费</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
        ) : ''
      }
      {/* VIP免费专区 */}
      <View style={styles.comContain}>
        <Text style={styles.comLang}></Text>
        <Text style={styles.comTitle}>VIP免费专区</Text>
      </View>
      <LinearGradient colors={['#5a9ef7fb', '#FFFFFF', '#FFFFFF']} style={styles.rightBg}>
        <View style={styles.proRight}>
          <Image resizeMode='stretch' style={styles.rightTop} source={require('../../../images/home/class-bg.png')}></Image>
          <View style={styles.rightBottom}>
            {
              vipFreeList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={(e) => toCourseDetail(item.id, e)} style={[styles.classItem]}>
                    <View style={[styles.classItem, index < 2 ? styles.classItemBorder : '']}>
                      <Text style={styles.classIcon}>荐</Text>
                      <Text numberOfLines={1} style={styles.classText}>{item.baseTitle}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
        </View>
      </LinearGradient>
      {/* tab课程 */}
      {
        classTabList.length > 0 ? (
          <View style={styles.tabScrollContain}>
            <ScrollView style={styles.tabScrollSty} horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.tabSty}>
                {
                  classTabList.map((item, index) => {
                    return (
                      <TouchableWithoutFeedback onPress={(e) => changeTab(index, e)} key={index}>
                        <View style={[styles.tabItem, index == 0 ? styles.tabItemMarginRight : '']}>
                          <Text style={[styles.tabItemText, index == tabIndex ? styles.activeItemText : '']}>{item.plateName}</Text>
                          <View style={[styles.tabItemLine, index == tabIndex ? styles.activeLine : '']}></View>
                        </View>
                      </TouchableWithoutFeedback>
                    )
                  })
                }
              </View>
            </ScrollView>
            {/* 课程列表 */}
            <View style={styles.tabClassList}>
              {
                tabClassArr.map((item, index) => {
                  return <CourseItem key={index} props={props} courseInfo={item} />
                })
              }
            </View>
          </View>
        ) : ''
      }
      {/* VIP免费专区 */}
      {
        soloFeeList.length > 0 ? (
          <View style={[styles.comContain, styles.soloFee]}>
            <Text style={styles.comLang}></Text>
            <Text style={styles.comTitle}>精品课程</Text>
          </View>
        ) : ''
      }
      {/* 课程列表 */}
      {
        soloFeeList.length > 0 ? (
          <View style={styles.tabClassList}>
            {
              soloFeeList.map((item, index) => {
                return <CourseItem key={index} props={props} courseInfo={item} />
              })
            }
          </View>
        ) : ''
      }
    </View>
  )
}

const styles = StyleSheet.create({
  classContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: dp2px(102)
  },
  classBanner: {
    width: dp2px(351),
    height: dp2px(179),
    marginTop: dp2px(11),
    marginBottom: dp2px(31)
  },
  // 短视频区域
  shortContain: {
    width: dp2px(350),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp2px(12),
    marginBottom: dp2px(25)
  },
  tabScrollSty: {
    width: dp2px(350),
  },
  shortItem: {
    marginLeft: dp2px(12),
    position: 'relative'
  },
  activeShortItem: {
    marginLeft: 0
  },
  shortCover: {
    width: dp2px(104),
    height: dp2px(185),
    borderRadius: dp2px(4),
  },
  shortTimeContain: {
    position: 'absolute',
    height: dp2px(20),
    paddingHorizontal: dp2px(10),
    right: dp2px(4),
    bottom: dp2px(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: dp2px(10),
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  shortTimeCover: {
    width: dp2px(10),
    height: dp2px(10),
    marginRight: dp2px(2)
  },
  shortTimeVal: {
    fontSize: dp2px(12),
    color: '#F5F7FB'
  },
  // 公共区域
  comContain: {
    width: dp2px(350),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  comLang: {
    width: dp2px(5),
    height: dp2px(20),
    backgroundColor: '#33A7FF'
  },
  comTitle: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginLeft: dp2px(7)
  },
  rightBg: {
    width: dp2px(350),
    borderRadius: dp2px(10),
    marginTop: dp2px(10)
  },
  proRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: dp2px(350),
    borderRadius: dp2px(10),
  },
  rightTop: {
    width: dp2px(335),
    height: dp2px(175),
    borderTopRightRadius: dp2px(10),
    borderTopLeftRadius: dp2px(10),
    marginTop: dp2px(8)
  },
  rightBottom: {
    backgroundColor: '#ffffff'
  },
  classItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  classItemBorder: {
    borderBottomWidth: dp2px(1),
    borderColor: '#E3E3E3'
  },
  classIcon: {
    width: dp2px(20),
    height: dp2px(20),
    lineHeight: dp2px(20),
    textAlign: 'center',
    borderRadius: dp2px(4),
    marginRight: dp2px(5),
    marginLeft: dp2px(0),
    backgroundColor: '#ebf6ff',
    borderColor: '#0a76f1',
    borderWidth: dp2px(1),
    fontSize: dp2px(12),
    color: '#0a76f1'
  },
  classText: {
    width: dp2px(300),
    height: dp2px(40),
    lineHeight: dp2px(40),
    color: '#555555',
    fontSize: dp2px(14),
    marginLeft: dp2px(4),
  },
  // 课堂tab
  tabScrollContain: {
    width: dp2px(350),
    marginTop: dp2px(24)
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
  freeTabClassList: {
    backgroundColor: '#ffffff',
    padding: dp2px(10),
    paddingBottom: 0,
    borderRadius: dp2px(4),
    marginBottom: dp2px(15)
  },
  tabClassList: {
    backgroundColor: '#ffffff',
    padding: dp2px(10),
    paddingBottom: 0,
    borderRadius: dp2px(4)
  },
  soloFee: {
    marginTop: dp2px(15),
    marginBottom: dp2px(10)
  },
  allFreeContain: {
    width: dp2px(351),
    backgroundColor: '#ffffff',
    paddingHorizontal: dp2px(17),
    paddingTop: dp2px(15),
    borderRadius: dp2px(6),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: dp2px(15),
    marginBottom: dp2px(20)
  },
  allFreeItem: {
    width: dp2px(150),
    marginBottom: dp2px(12),
    backgroundColor: '#FAFCFF',
    borderRadius: dp2px(6),
    paddingBottom: dp2px(4)
  },
  allFreeCover: {
    width: dp2px(150),
    height: dp2px(107),
    borderTopLeftRadius: dp2px(6),
    borderTopRightRadius: dp2px(6),
  },
  allFreeTitle: {
    marginLeft: dp2px(4),
    color: '#333333',
    fontSize: dp2px(13),
    fontWeight: 'bold',
    marginTop: dp2px(6)
  },
  allFreeDesc: {
    marginLeft: dp2px(4),
    color: '#CDCDCD',
    fontSize: dp2px(12),
    marginTop: dp2px(4),
    marginBottom: dp2px(4)
  },
  allFreePrice: {
    marginLeft: dp2px(4),
    color: '#FC8A2A',
    fontSize: dp2px(13),
    fontWeight: 'bold',
  },
})

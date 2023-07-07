import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import * as CodeMsg from "../../utils/common/codeMsg";
import * as envCofig from "../../utils/envConfig"
import LinearGradient from 'react-native-linear-gradient';
import { getClassList, getSVideoList } from '../../api/wtClass'

export default function WtClass({ props }) {

  const [courseList, setCourseList] = useState([])
  const [shortList, setShortList] = useState([])

  // 获取课程列表
  const getClassData = (type) => {
    let params = {
      pageSize: 2,
      pageNo: 1,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: type, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassList(params).then(res => {
      if (res.data.code == CodeMsg.CODE_0) {
        let list = res.data.data.records
        setCourseList([...list])
      }
    })
  }

  // 获取短视频列表
  const getShortList = () => {
    let params = {
      pageSize: 1,
      pageNo: 1
    }
    getSVideoList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        console.log(res,'短视频')
        setShortList([...res.data.records])
      }
    })
  }

  // 跳转到课程详情
  const toCourseDetail = (id) => {
    // props.navigation.navigate('CourseDetail', { id: id })
  }

  // 跳转到卧涛课堂二级首页
  const toWtClass = () => {
    // props.navigation.navigate('Square')
  }

  // 跳转到短视频页面
  const toShortVideo = () => {
    // props.navigation.navigate('ShortVideo')
  }

  useFocusEffect(
    React.useCallback(() => {
      getClassData(2)
      getShortList()
    }, [])
  )

  return (
    <View style={styles.classContain}>
      <View style={styles.serviceText}>
        <Text style={styles.bigText}>卧涛课堂</Text>
        <TouchableWithoutFeedback onPress={(e) => toWtClass(e)}>
          <View style={styles.rightContain}>
            <Text style={styles.smallText}>更多</Text>
            <View style={styles.rightPointer}></View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.proContain}>
        {
          shortList.length > 0 ? (
            <TouchableWithoutFeedback onPress={(e) => toShortVideo(e)} style={styles.proLeft}>
              <ImageBackground borderRadius={10} style={styles.proLeft} source={{ uri: envCofig.CDN_BASE_URL + shortList[0].coverPicUrl }}>
                <View style={styles.playIcon}>
                  <Image style={styles.playImg} source={require('../../images/home/icon-pointer.png')}></Image>
                  <Text style={styles.playTime}>{shortList[0].videoTime}</Text>
                </View>
              </ImageBackground>
            </TouchableWithoutFeedback>
          ) : ''
        }

        <LinearGradient colors={['#5a9ef7fb', '#FFFFFF', '#FFFFFF']} style={styles.rightBg}>
          <View style={styles.proRight}>
            <Image style={styles.rightTop} source={require('../../images/home/class-bg.png')}></Image>
            <View style={styles.rightBottom}>
              {
                courseList.map((item, index) => {
                  return (
                    <TouchableWithoutFeedback key={index} onPress={(e) => toCourseDetail(item.id, e)} style={[styles.classItem]}>
                      <View style={[styles.classItem, index < 1 ? styles.classItemBorder : '']}>
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  /**
  * 卧涛课堂
  */
  classContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: dp2px(18)
  },
  serviceText: {
    width: dp2px(351),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp2px(10)
  },
  bigText: {
    color: '#333333',
    fontSize: dp2px(16),
    fontWeight: 'bold',
    marginRight: dp2px(8)
  },
  smallText: {
    color: '#BCBCBC',
    fontSize: dp2px(13),
  },
  rightContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightPointer: {
    width: dp2px(7),
    height: dp2px(7),
    borderTopWidth: dp2px(1),
    borderRightWidth: dp2px(1),
    borderColor: '#BCBCBC',
    transform: [{
      rotate: '45deg'
    }]
  },
  proContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: dp2px(351),
    height: dp2px(190),
  },
  proLeft: {
    position: 'relative',
    width: dp2px(108),
    height: dp2px(190),
    borderRadius: dp2px(10)
  },
  playIcon: {
    position: 'absolute',
    right: dp2px(14),
    bottom: dp2px(14),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playImg: {
    width: dp2px(10),
    height: dp2px(10),
    marginRight: dp2px(2)
  },
  playTime: {
    color: "#ffffff",
    fontSize: dp2px(12)
  },
  rightBg: {
    width: dp2px(232),
    height: dp2px(190),
    borderRadius: dp2px(10),
  },
  proRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: dp2px(232),
    height: dp2px(190),
    borderRadius: dp2px(10),
  },
  rightTop: {
    width: dp2px(225),
    height: dp2px(111),
    borderTopRightRadius: dp2px(10),
    borderTopLeftRadius: dp2px(10),
    marginTop: dp2px(4)
  },
  rightBottom: {
    backgroundColor: '#ffffff'
  },
  classItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: dp2px(36),
  },
  classItemBorder: {
    borderBottomWidth: dp2px(1),
    borderColor: '#E3E3E3'
  },
  classIcon: {
    width: dp2px(18),
    height: dp2px(18),
    lineHeight: dp2px(18),
    textAlign: 'center',
    marginLeft: dp2px(2),
    borderRadius: dp2px(4),
    backgroundColor: '#ebf6ff',
    borderColor: '#0a76f1',
    borderWidth: dp2px(1),
    fontSize: dp2px(12),
    color: '#0a76f1'
  },
  classText: {
    width: dp2px(203),
    height: dp2px(20),
    lineHeight: dp2px(20),
    color: '#555555',
    fontSize: dp2px(14),
    marginLeft: dp2px(4)
  }
})

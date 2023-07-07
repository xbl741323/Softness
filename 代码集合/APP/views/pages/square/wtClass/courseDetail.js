import React, { useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Platform, StyleSheet, Dimensions, Text, View, Image, TouchableWithoutFeedback, ScrollView, SafeAreaView, ImageBackground } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import RenderHtml from 'react-native-render-html';
import DeviceInfo from 'react-native-device-info'
import * as CodeMsg from "../../../utils/common/codeMsg";
import * as envCofig from "../../../utils/envConfig"
import Storage from '../../../utils/common/storage'
import { throttle } from '../../../utils/common/utils'
import Toast from 'react-native-root-toast'
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { useSelector, useDispatch } from 'react-redux'
import {
  getClassDetail,
  getClassTree,
  addClass,
  cancelClass,
  getCollectStatus,
  getVideoUrl,
  freeCourseStudy,
  recordStudyProgress,
  addPlayNum,
  addBrowseNum
} from '../../../api/wtClass'

export default function CourseDetail(props) {
  const { route } = props
  const videoRef = useRef(null)
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState(null)
  const [modelType, setModelType] = useState('')
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])
  const [tabIndex, setTabIndex] = useState(0)
  const [tabList, setTabList] = useState(['课程介绍', '课程目录'])
  const [courseId, setCourseId] = useState(null) // 产品id
  const [courseInfo, setCourseInfo] = useState({}) // 课程详情对象
  const [courseNum, setCourseNum] = useState(0) // 课程节数
  const [catalogueList, setCatalogueList] = useState([]) // 章节目录树
  const [chapterChild, setChapterChild] = useState({}) // 子章节对象
  const [showVideo, setShowVideo] = useState(false) // 控制视频显隐
  const [videoUrl, setVideoUrl] = useState('') // 视频url
  const [isPlayVideo, setIsPlayVideo] = useState(false) // 控制调用一次
  const [isCollect, setIsCollect] = useState(false) // 是否收藏
  const [vipInfo, setVipInfo] = useState(null) // vipInfo对象数据
  const [vipFree, setVipFree] = useState(false) // 是否购买了课堂会员且在有效期内+当前课程是否是vip免费
  const [isVip, setIsVip] = useState(false) // 是否购买了课堂会员
  const [isPaused, setIsPaused] = useState(false) // 控制视频是否暂停
  const [fullStatus, setFullStatus] = useState(false) // 全屏状态

  // tab栏修改
  const changeTab = (index) => {
    setTabIndex(index)
  }

  // 富文本图片前缀处理
  const filterImg = (val) => {
    if (val) {
      let r = val.replace(/\/\/static.wotao.com/g, "https://static.wotao.com")
      return r
    } else {
      return ''
    }
  }

  // 跳转到首页
  const toHome = () => {
    let navigation = props.navigation
    navigation.navigate('Home')
  }

  // 切换主章节
  const changeCatalogue = (index) => {
    catalogueList[index].showChildren = !catalogueList[index].showChildren
    setCatalogueList([...catalogueList])
  }

  // 课程id赋值
  const setDefaultVal = () => {
    if (route.params && route.params.id) {
      setCourseId(route.params.id)
      getDetailData(route.params.id)
    }
  }

  // 获取课程详情
  const getDetailData = (id) => {
    let params = {
      id: id
    }
    getClassDetail(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        console.log(res.data, '详情数据')
        setCourseInfo({ ...res.data })
        getTree(res.data)
        addBrowseNumData(id)
        getCollectData(id)
        getVipInfo()
      }
    })
  }

  // 树结构
  const getTree = (courseInfo) => {
    let params = {
      classId: courseInfo.id
    }
    getClassTree(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let catalogueList = res.data
        let courseNum = 0
        catalogueList.forEach((item, index) => {
          item.showChildren = index == 0 ? true : false
          courseNum = courseNum + item.child.length
          item.child.forEach((cItem) => {
            cItem.showVideo = false
          })
        })
        setCatalogueList([...catalogueList])
        setCourseNum(courseNum)
        if (courseInfo.latestWatchSection && Number(courseInfo.latestWatchSection) != 0) {
          // 跳转到上一次播放记录
          skipToSeek(courseInfo, catalogueList)
        }
      }
    })
  }

  // 跳转到上一次的播放位置
  const skipToSeek = (courseInfo, catalogueList) => {
    let pId = '' // 父章节id
    let playVideoId = ''
    let chooseItem;
    catalogueList.forEach((pItem) => {
      pItem.child.forEach(cItem => {
        if (cItem.id == courseInfo.latestWatchSection) {
          chooseItem = cItem
          cItem.showVideo = true
          pId = cItem.parentId
          playVideoId = cItem.playVideoId
          setChapterChild({ ...cItem })
        }
      })
    })
    catalogueList.forEach((pItem) => {
      if (pItem.id == pId) {
        pItem.showChildren = true
      } else {
        pItem.showChildren = false
      }
      setCatalogueList([...catalogueList])
    })
    setShowVideo(true)
    setTabIndex(1)
    // 调用获取视频url信息
    getVideoData(playVideoId, 0, courseInfo.id, chooseItem)
  }

  // 计算课程进度
  const fixClassPercent = (val) => {
    return parseInt(val * 100)
  }

  // 子章节切换
  const changeChildCatalogue = (info) => {
    console.log(info, 'info')
    let result = info
    if (courseInfo.tradingChargeType == 1 && !courseInfo.subscribed) {
      Toast.show('请先报名，再进行观看！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
      return false
    }
    setChapterChild({ ...result })
    catalogueList.forEach(item => {
      if (item.id == result.parentId) {
        item.child.forEach(cItem => {
          cItem.showVideo = cItem.id == result.id ? true : false
        })
      } else {
        item.child.forEach(cItem => {
          cItem.showVideo = false
        })
      }
    })
    setCatalogueList([...catalogueList])
    getVideoInfo(info)
  }

  // 计算视频总时间
  const fixTotalTime = (videoTime) => {
    let list = videoTime.split(":");
    let hour = Number(list[0]);
    let minute = Number(list[1]);
    let second = Number(list[2]);
    let totalTime = hour * 3600 + minute * 60 + second;
    return totalTime
  }

  // 获取对应子章节视频信息
  const getVideoInfo = (info) => {
    if (courseInfo.subscribed || courseInfo.tradingChargeType == 1) {
      // 调用获取视频url信息
      getVideoData(info.playVideoId, 0, courseId, info)
      setShowVideo(info.videoId == 0 ? false : true)
    } else {
      if (info.trySeeState == 1) {
        if (info.videoId == 0) {
          Toast.show('该章节还未上传视频，请看看其他章节吧~', {
            position: Toast.positions.CENTER,
            duration: 1000,
            textStyle: {
              fontSize: dp2px(12)
            },
          })
        } else {
          let videoTime = fixTotalTime(info.trySeeTime)
          // 调用获取视频url信息-待对接
          getVideoData(info.playVideoId, videoTime, courseId, info)
        }
        // 展示video状态
        setShowVideo(info.videoId == 0 ? false : true)
      }
    }
  }

  // 添加播放记录
  const addPlayNumData = (courseId) => {
    let params = {
      courseId: courseId
    }
    addPlayNum(params).then(res => { })
  }

  // 添加浏览记录
  const addBrowseNumData = (courseId) => {
    let params = {
      courseId: courseId
    }
    addBrowseNum(params).then(res => { })
  }

  // 获取视频url
  const getVideoData = (videoId, seconds, courseId, chapterChild) => {
    let params = new FormData()
    params.append('videoId', videoId)
    params.append('courseId', courseId)
    if (seconds > 0) {
      params.append('seconds', seconds) // 单位 -> s（秒）
    }
    getVideoUrl(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = JSON.parse(res.data)
        if (!isPlayVideo) {
          // 只调用一次
          addPlayNumData(courseId)
        }
        setIsPlayVideo(true)
        if (Platform.OS == 'ios') {
          setVideoUrl('')
        }
        setVideoUrl(r.playInfoList[0].playURL)
      }
    })
  }

  // 设置学习记录-防抖操作
  const throttleCourseRecords = throttle((seconds, completedStatus) => {
    setCourseRecords(seconds, completedStatus)
  }, 2000)

  // 设置学习记录
  const setCourseRecords = (seconds, completedStatus) => {
    let params = {
      courseId: courseInfo.id,
      sectionId: chapterChild.id,
      playVideoId: chapterChild.playVideoId,
      seconds: seconds,
      completed: completedStatus
    }
    // 只有已订阅状态的课程才调用记录课程进度接口
    if (courseInfo.subscribed) {
      recordStudyProgress(params).then(res => { })
    }
  }

  // 触发频率 250ms 一次
  const bindtimeupdate = (e) => {
    let {
      currentTime,
      seekableDuration
    } = e
    if (Number(seekableDuration) - Number(currentTime) < 1) {
      setCourseRecords(parseInt(currentTime), 1)
    } else {
      parseInt(currentTime) > 0 ? throttleCourseRecords(parseInt(currentTime), 0) : ''
    }
  }

  // 获取收藏状态
  const getCollectData = (courseId) => {
    if (userInfo != null) {
      let params = {
        classId: courseId
      }
      getCollectStatus(params).then(res => {
        if (res.code == 0) {
          setIsCollect(res.data)
        }
      })
    }
  }

  // 添加收藏
  const addCollectData = () => {
    if (userInfo != null) {
      let params = {
        classId: courseId
      }
      addClass(params).then(res => {
        if (res.code == 0) {
          Toast.show('收藏成功！', {
            position: Toast.positions.CENTER,
            duration: 1000,
            textStyle: {
              fontSize: dp2px(12)
            },
          })
          getCollectData(courseId)
        }
      })
    } else {
      Toast.show('请先登录，再进行操作！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
    }
  }

  // 取消收藏
  const cancelCollectData = () => {
    if (userInfo != null) {
      let params = {
        classId: courseId
      }
      cancelClass(params).then(res => {
        if (res.code == 0) {
          Toast.show('取消成功！', {
            position: Toast.positions.CENTER,
            duration: 1000,
            textStyle: {
              fontSize: dp2px(12)
            },
          })
          getCollectData(courseId)
        }
      })
    } else {
      Toast.show('请先登录，再进行操作！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
    }
  }

  // 完全免费报名
  const buyFreeCourse = () => {
    let params = {
      courseId: courseId
    }
    freeCourseStudy(params).then(res => {
      if (res.code == 0) {
        setTimeout(() => {
          Toast.show('报名成功！', {
            position: Toast.positions.CENTER,
            duration: 1000,
            textStyle: {
              fontSize: dp2px(12)
            },
          })
        }, 200)
        getDetailData()
        setTabIndex(1)
      }
    })
  }

  //立即下单
  const buyNow = () => {
    Toast.show('待跳转到下单页面！', {
      position: Toast.positions.CENTER,
      duration: 1000,
      textStyle: {
        fontSize: dp2px(12)
      },
    })
  }

  // 购买vip会员
  const buyVip = () => {
    Toast.show('待跳转到购买vip会员页面！', {
      position: Toast.positions.CENTER,
      duration: 1000,
      textStyle: {
        fontSize: dp2px(12)
      },
    })
  }

  //计算vip费用（待对接）
  const computePrice = () => {
    if (vipInfo != null) {
      let vipDate = new Date(vipInfo.vipExpireDate); // 到期时间
      let useful = new Date().getTime() <= new Date(vipDate).getTime() + 24 * 60 * 60 * 1000 - 1 ? true : false;
      if (courseInfo.tradingChargeType == 2 && useful) {
        setVipFree(true)
        this.setData({
          vipFree: true
        })
      }
      if (useful) {
        setIsVip(true)
      }
    }
  }

  // 获取用户viv信息
  const getVipInfo = async () => {
    try {
      const value = await Storage.getItem('vipInfo')
      if (value != null) {
        setVipInfo({ ...value })
      }
    } catch (e) {
      // error reading value
    }
  }

  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '用户信息')
      }
    } catch (e) {
      // error reading value
    }
  }

  // 监听vipInfo钩子函数
  useEffect(() => {
    if (vipInfo != null) {
      computePrice()
    }
  }, [vipInfo])

  // 监听route钩子函数
  useEffect(() => {
    setDefaultVal()
  }, [route])

  // 监听route钩子函数
  useEffect(() => {
    if (fullStatus) {
      Orientation.lockToLandscapeLeft()
    } else {
      Orientation.lockToPortrait();
    }
  }, [fullStatus])

  // 监听ios手机型号
  useEffect(() => {
    if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
      let arr = DeviceInfo.getModel().slice(7).split(' ')
      setModelType(arr.length > 0 ? arr[0] : '')
    }
  }, [modelType])

  useFocusEffect(
    React.useCallback(() => {
      getUserData()
    }, [])
  )

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={0}>
        <View style={styles.courseContain}>
          {/* 封面/视频区域 */}
          {
            showVideo && videoUrl !== '' ? (
              <Video
                ref={videoRef}
                fullscreen={Platform.OS == 'ios' ? true : false}
                onProgress={bindtimeupdate}
                progressUpdateInterval={2000}
                ignoreSilentSwitch="ignore"
                paused={Platform.OS == 'ios' ? isPaused : false}
                posterResizeMode='stretch'
                resizeMode='stretch'
                poster={envCofig.CDN_BASE_URL + courseInfo.baseCoverUrl}
                controls={Platform.OS == 'ios' ? true : true}
                style={styles.courseCover}
                source={{ uri: videoUrl }}
                repeat={Platform.OS == 'ios' ? true : false}
                onFullscreenPlayerWillPresent={(e) => {
                  console.log(e, '开始全屏前')
                  setFullStatus(true)
                }}
                onFullscreenPlayerWillDismiss={(e) => {
                  console.log(e, '退出全屏前')
                  setFullStatus(false)
                }}
                onLoad={(e) => {
                  if (chapterChild.seconds != null && videoRef != null && videoRef.current && videoRef.current.seek) {
                    videoRef.current.seek(Number(chapterChild.seconds))
                  }
                }}
                onEnd={(e) => {
                  setIsPaused(true)
                }}>
              </Video>
            ) : (
              <Image resizeMode='stretch' style={styles.courseCover} source={{ uri: envCofig.CDN_BASE_URL + courseInfo.baseCoverUrl }}></Image>
            )
          }
          {/* tab栏切换区域 */}
          <View style={styles.tabContain}>
            {
              tabList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback onPress={(e) => changeTab(index, e)} key={index} style={styles.tabItem}>
                    <View style={styles.tabItem}>
                      <Text style={[styles.tabItemTitle, tabIndex == index ? styles.activeTabTitle : '']}>{item}</Text>
                      <Text style={[styles.tabItemBorder, tabIndex == index ? styles.activeTabBorder : '']}></Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>

          {/* 课程介绍和课程目录区域 */}
          {
            tabIndex == 0 ?
              // 课程介绍区域
              (
                <View style={styles.courseIntro}>
                  <View style={styles.courseTitleContain}>
                    <Text style={styles.courseLeftTitle}>{courseInfo.baseTitle}</Text>
                    <Text style={styles.courseRightTitle}>共{courseNum}节</Text>
                  </View>
                  <Text style={styles.courseDesc}>
                    {courseInfo.baseSlogan}
                  </Text>
                  {
                    courseInfo.tradingChargeType == 1 ? (
                      <Text style={styles.freeLabel}>免费课程</Text>
                    ) : (
                      <View style={styles.coursePriceContain}>
                        {
                          courseInfo.tradingChargeType != 1 ? (
                            <View style={styles.priceLeftContain}>
                              <Text style={styles.priceLeftLabel}>￥</Text>
                              <Text style={styles.priceLeftVal}>{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingCurrentPrice + courseInfo.tradingThirdFee) : courseInfo.tradingCurrentPrice}</Text>
                              <Text style={styles.priceLeftText}>元</Text>
                            </View>) : ''
                        }
                        {
                          courseInfo.tradingChargeType != 1 ? (
                            <Text style={styles.previousPriceContain}>
                              ￥{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingOriginalPrice + courseInfo.tradingThirdFee) : courseInfo.tradingOriginalPrice}元
                            </Text>
                          ) : ''
                        }
                        {
                          courseInfo.tradingChargeType != 1 ? (
                            <View style={styles.rightTitleLabel}>
                              {
                                (courseInfo.tradingChargeType == 2) || (courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ? (
                                  <Text style={styles.labelLeftSty}>VIP</Text>
                                ) : ''
                              }
                              {
                                courseInfo.tradingChargeType == 2 ? (<Text style={styles.labelRightSty}>免费</Text>) : ''
                              }
                              {
                                (courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ? (
                                  <Text style={styles.labelRightSty}>{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingVipPrice + courseInfo.tradingThirdFee) : courseInfo.tradingVipPrice}元</Text>
                                ) : ''
                              }
                            </View>
                          ) : ''
                        }
                      </View>
                    )
                  }
                  {
                    !isVip ? (
                      <View style={styles.vipContain}>
                        <ImageBackground style={styles.vipLeftBg} source={require('../../../images/square/wtClass/vip-bg.png')}>
                          <Text style={styles.vipLabel}>课堂会员</Text>
                          <Text style={styles.vipLang}></Text>
                          {
                            (courseInfo.tradingChargeType == 2) || (courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ? (
                              <Text style={styles.vipVal}>VIP</Text>
                            ) : ''
                          }
                          {
                            courseInfo.tradingChargeType == 2 ? (<Text style={styles.vipVal}>免费</Text>) : ''
                          }
                          {
                            (courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ? (
                              <Text style={styles.vipVal}>{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingVipPrice + courseInfo.tradingThirdFee) : courseInfo.tradingVipPrice}元</Text>
                            ) : ''
                          }
                        </ImageBackground>
                        <TouchableWithoutFeedback onPress={(e) => buyVip(e)} >
                          <View style={styles.openVipContain}>
                            <Text style={styles.openVip}>开通VIP</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    ) : ''
                  }

                  {/* 文本框内容区域 */}
                  <View style={[styles.courseContent, isVip ? styles.isVipTop : '']}>
                    <View style={styles.contentLabel}>
                      <View style={styles.courseCircle}></View>
                      <Text style={styles.circleTitle}>课程简介</Text>
                    </View>
                    <View style={styles.renderSty}>
                      <RenderHtml
                        contentWidth={Dimensions.get('window').width - dp2px(24)}
                        imagesMaxWidth={Dimensions.get('window').width}
                        source={{ html: filterImg(courseInfo.instruction) }}
                        tagsStyles={{
                          p: {
                            margin: 0,
                          },
                          span: {
                            marginBottom: 5
                          },
                        }}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                // 课程目录区域
                <View style={styles.courseCatalogue}>
                  {
                    catalogueList.map((item, index) => {
                      return (
                        <TouchableWithoutFeedback key={index} onPress={(e) => changeCatalogue(index, e)}>
                          <View key={index} style={styles.catalogueItem}>
                            <View style={styles.catalogueItemTitleContain}>
                              <View style={styles.catalogueItemLeftContain}>
                                <Text style={styles.itemLeftIndex}>第{index + 1}章</Text>
                                <Text style={styles.itemLeftTitle}>{item.sectionName}</Text>
                              </View>
                              <Image style={[styles.pointerSty, item.showChildren ? styles.activePointerSty : '']} source={require('../../../images/square/wtClass/pointer.png')}></Image>
                            </View>
                            {
                              item.showChildren ? (
                                <View style={styles.catalogueChildContain}>
                                  {
                                    item.child.map((cItem, cIndex) => {
                                      return (
                                        <TouchableWithoutFeedback onPress={(e) => changeChildCatalogue(cItem, e)} key={cIndex} style={styles.catalogueChildItem}>
                                          <View style={styles.catalogueChildItem}>
                                            <View style={styles.childLeftContain}>
                                              <Image style={styles.childLeftImg} source={require('../../../images/square/wtClass/play-icon.png')}></Image>
                                              <Text numberOfLines={1} style={[styles.childLeftName, cItem.showVideo ? styles.activeSeeColor : '']}>{cItem.sectionName}</Text>
                                            </View>
                                            {
                                              courseInfo.subscribed && courseInfo.subscribed == true ? (
                                                <View style={styles.childRightSeeContain}>
                                                  { // 显示观看进度
                                                    cItem.percent ? (
                                                      <Text style={[styles.achievesSee, cItem.showVideo ? styles.activeSeeColor : '']}>{cItem.percent == 1 ? '已看完' : fixClassPercent(cItem.percent) + '%'}</Text>
                                                    ) : ''

                                                  }
                                                </View>
                                              ) : (
                                                <View style={styles.childRightContain}>
                                                  {
                                                    cItem.trySeeState == 1 ? (
                                                      <Text style={styles.childRightTry}>可试看</Text>
                                                    ) : (
                                                      <Image style={styles.childRightImg} source={require('../../../images/square/wtClass/lock.png')}></Image>
                                                    )
                                                  }
                                                </View>
                                              )
                                            }

                                          </View>
                                        </TouchableWithoutFeedback>
                                      )
                                    })
                                  }
                                </View>
                              ) : ''
                            }
                          </View>
                        </TouchableWithoutFeedback>
                      )
                    })
                  }
                </View>
              )
          }
        </View >
      </ScrollView>
      {/* 按钮区域 */}
      <View style={[styles.btnContain, Platform.OS == 'ios' ? {
        alignItems: 'flex-start',
        height: dp2px(iosList.includes(modelType) ? 65 : 60),
        bottom: dp2px(iosList.includes(modelType) ? -30 : 0),
        paddingTop: dp2px(8)
      } : '']}>
        <View style={[styles.btnLeftContain, Platform.OS == 'ios' ? styles.iosBtnLeftContain : '']}>
          <TouchableWithoutFeedback onPress={(e) => toHome(e)} style={styles.btnLeftItem}>
            <View style={styles.btnLeftItem}>
              <Image resizeMode='contain' style={styles.btnLeftImg} source={require('../../../images/classify/icon-home.png')}></Image>
              <Text style={styles.btnLeftText}>首页</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback style={styles.btnLeftItem}>
            <View style={styles.btnLeftItem}>
              <Image resizeMode='contain' style={styles.btnLeftImg} source={require('../../../images/classify/icon-ask.png')}></Image>
              <Text style={styles.btnLeftText}>客服</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.btnRightContain}>
          {
            isCollect ? (
              <TouchableWithoutFeedback onPress={(e) => cancelCollectData(e)}>
                <View style={[styles.btnRightItem, styles.lightBg]}>
                  <Text style={styles.btnRightText}>取消收藏</Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={(e) => addCollectData(e)}>
                <View style={[styles.btnRightItem, styles.lightBg]}>
                  <Text style={styles.btnRightText}>加入收藏</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
          {
            courseInfo.tradingChargeType == 1 ? (
              <TouchableWithoutFeedback onPress={(e) => buyFreeCourse(e)}>
                <View style={[styles.btnRightItem, styles.strongBg]}>
                  <Text style={styles.btnRightText}>立即报名</Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={(e) => buyNow(e)}>
                <View style={[styles.btnRightItem, styles.strongBg]}>
                  <Text style={styles.btnRightText}>{vipFree ? '0元订阅' : '立即下单'}</Text>
                </View>
              </TouchableWithoutFeedback>
            )
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  courseContain: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: Dimensions.get('window').height,
    backgroundColor: '#F5F7FB',
    paddingBottom: dp2px(Platform.OS == 'android' ? 60 : 70)
  },
  courseCover: {
    width: Dimensions.get('window').width,
    height: dp2px(210),
  },
  // tab栏切换区域
  tabContain: {
    width: Dimensions.get('window').width,
    height: dp2px(37),
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: dp2px(1),
    borderBottomWidth: dp2px(1),
    borderBottomColor: '#E3E3E3'
  },
  tabItem: {
    position: 'relative',
    display: 'flex',
    height: dp2px(37),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabItemTitle: {
    color: '#555555',
    fontSize: dp2px(14)
  },
  activeTabTitle: {
    color: '#4388FE',
    fontWeight: 'bold',
  },
  tabItemBorder: {
    position: 'absolute',
    bottom: 0,
    width: dp2px(26),
    height: dp2px(3),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(1)
  },
  activeTabBorder: {
    backgroundColor: '#4388FE',
  },
  // 课程介绍区域
  courseIntro: {
    backgroundColor: '#FFFFFF',
    paddingBottom: dp2px(20)
  },
  courseTitleContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: dp2px(17),
    paddingHorizontal: dp2px(14),
  },
  courseLeftTitle: {
    color: '#333333',
    fontSize: dp2px(15),
    fontWeight: 'bold'
  },
  courseRightTitle: {
    height: dp2px(22),
    lineHeight: dp2px(22),
    borderColor: '#4388fe',
    borderWidth: dp2px(1),
    fontSize: dp2px(13),
    color: '#4388FE',
    borderRadius: dp2px(4),
    paddingHorizontal: dp2px(8),
    backgroundColor: '#e8f1ff'
  },
  courseDesc: {
    paddingHorizontal: dp2px(14),
    marginTop: dp2px(8),
    color: '#888888',
    fontSize: dp2px(14),
  },
  freeLabel: {
    width: dp2px(60),
    backgroundColor: '#418EFF',
    color: '#FFFFFF',
    borderRadius: dp2px(4),
    fontSize: dp2px(12),
    textAlign: 'center',
    paddingVertical: dp2px(2),
    marginLeft: dp2px(14),
    marginTop: dp2px(10)
  },
  coursePriceContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dp2px(14),
    marginTop: dp2px(4),
  },
  priceLeftContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: dp2px(6)
  },
  previousPriceContain: {
    color: '#C3C3C3',
    fontSize: dp2px(12),
    textDecorationLine: 'line-through',
    marginLeft: dp2px(2),
    marginRight: dp2px(8)
  },
  priceLeftLabel: {
    fontSize: dp2px(15),
    color: '#FA7A42',
    fontWeight: 'bold'
  },
  priceLeftVal: {
    fontSize: dp2px(20),
    color: '#FA7A42',
    fontWeight: 'bold',
    paddingBottom: dp2px(2)
  },
  priceLeftText: {
    fontSize: dp2px(15),
    color: '#FA7A42',
    fontWeight: 'bold'
  },
  rightTitleLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFCA95',
    borderTopLeftRadius: dp2px(2),
    borderBottomLeftRadius: dp2px(2)
  },
  labelLeftSty: {
    fontSize: dp2px(10),
    color: '#663E05',
    backgroundColor: '#EFCA95',
    paddingHorizontal: dp2px(4),
    paddingTop: dp2px(2),
    paddingBottom: dp2px(1),
    borderTopLeftRadius: dp2px(2),
    borderBottomLeftRadius: dp2px(2)
  },
  labelRightSty: {
    fontSize: dp2px(10),
    color: '#FFFFFF',
    backgroundColor: '#663E05',
    paddingHorizontal: dp2px(4),
    paddingTop: dp2px(2),
    paddingBottom: dp2px(1),
    borderRadius: dp2px(2)
  },
  vipContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: dp2px(14),
    marginTop: dp2px(10)
  },
  vipLeftBg: {
    width: dp2px(240),
    height: dp2px(44),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  vipLabel: {
    color: '#FFFFFF',
    fontSize: dp2px(14),
    marginLeft: dp2px(12),
    fontWeight: 'bold'
  },
  vipLang: {
    width: dp2px(2),
    height: dp2px(10),
    backgroundColor: "#FFFFFF",
    marginLeft: dp2px(8),
    marginRight: dp2px(8),
  },
  vipVal: {
    color: '#FFFFFF',
    fontSize: dp2px(13),
    fontWeight: 'bold'
  },
  openVipContain: {
    backgroundColor: '#EDC88C',
    borderTopRightRadius: dp2px(10),
    borderBottomRightRadius: dp2px(10),
  },
  openVip: {
    width: dp2px(100),
    height: dp2px(44),
    lineHeight: dp2px(44),
    textAlign: 'center',
    color: '#885200',
    fontSize: dp2px(15),
    fontWeight: 'bold'
  },
  courseContent: {
    borderTopWidth: dp2px(1),
    borderColor: '#F5F7FB',
    marginTop: dp2px(21)
  },
  isVipTop: {
    marginTop: dp2px(10)
  },
  contentLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dp2px(12),
    marginTop: dp2px(10),
    marginBottom: dp2px(12)
  },
  courseCircle: {
    width: dp2px(10),
    height: dp2px(10),
    borderRadius: dp2px(10),
    backgroundColor: '#418EFF',
    marginRight: dp2px(6)
  },
  circleTitle: {
    color: '#333333',
    fontSize: dp2px(15)
  },
  renderSty: {
    paddingHorizontal: dp2px(14)
  },
  // 课程目录区域
  courseCatalogue: {
    paddingBottom: dp2px(60)
  },
  catalogueItem: {
    marginTop: dp2px(25),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  catalogueItemTitleContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dp2px(14),
    marginBottom: dp2px(16)
  },
  catalogueItemLeftContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemLeftIndex: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginRight: dp2px(8)
  },
  itemLeftTitle: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  pointerSty: {
    width: dp2px(15),
    height: dp2px(15)
  },
  activePointerSty: {
    transform: [{
      rotate: '180deg'
    }]
  },
  catalogueChildContain: {
    paddingHorizontal: dp2px(14),
    backgroundColor: '#ffffff'
  },
  catalogueChildItem: {
    height: dp2px(40),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  childLeftContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  childLeftImg: {
    width: dp2px(18),
    height: dp2px(18),
    marginRight: dp2px(4)
  },
  childLeftName: {
    width: dp2px(260),
    color: '#333333',
    fontSize: dp2px(13)
  },
  childRightImg: {
    width: dp2px(16),
    height: dp2px(16)
  },
  childRightContain: {
    width: dp2px(60),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  childRightSeeContain: {
    width: dp2px(60),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  childRightTry: {
    width: dp2px(56),
    height: dp2px(21),
    textAlign: 'center',
    lineHeight: dp2px(21),
    borderWidth: dp2px(1),
    borderColor: '#4388FE',
    color: '#4388FE',
    borderRadius: dp2px(5)
  },
  achievesSee: {
    color: '#333333',
    fontSize: dp2px(13)
  },
  activeSeeColor: {
    color: '#0082fc'
  },
  // 底部按钮
  btnContain: {
    width: Dimensions.get('window').width,
    height: dp2px(49),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: dp2px(12),
    borderTopWidth: dp2px(1),
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  btnLeftContain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: dp2px(4)
  },
  iosBtnLeftContain: {
    alignItems: 'flex-start',
  },
  btnLeftItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnLeftImg: {
    width: dp2px(19),
    height: dp2px(19),
    marginBottom: dp2px(3)
  },
  btnLeftText: {
    color: '#555555',
    fontSize: dp2px(13)
  },
  btnRightContain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp2px(4)
  },
  btnRightItem: {
    height: dp2px(35),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0082FC',
  },
  lightBg: {
    backgroundColor: '#3DA1FF',
    borderTopLeftRadius: dp2px(18),
    borderBottomLeftRadius: dp2px(18)
  },
  strongBg: {
    backgroundColor: '#0082FC',
    borderTopRightRadius: dp2px(18),
    borderBottomRightRadius: dp2px(18)
  },
  btnRightText: {
    color: '#FFFFFF',
    fontSize: dp2px(12),
  },
})

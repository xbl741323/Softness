import React, { useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback, FlatList } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import * as CodeMsg from "../../../utils/common/codeMsg";
import * as envCofig from "../../../utils/envConfig"
import {
  getSVideoList,
  getShortVideoUrl
} from "../../../api/wtClass"
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';

export default function ShortVideo(props) {
  const { route } = props
  const videoRef = useRef(null)
  const [pageNo, setPageNo] = useState(1) // 分页
  const [reachStatus, setReachStatus] = useState(false) // 是否触底
  const [videoList, setVideoList] = useState([]) // 短视频列表
  const [videoUrl, setVideoUrl] = useState('') // 当前播放的视频url
  const [videoIndex, setVideoIndex] = useState(0) // 视频数组下标
  const [refreshIndex, setRefreshIndex] = useState(0) // 视频数组下标（仅用于刷新接口）
  const [paused, setPaused] = useState(false) // 视频是否暂停
  const [sliderVal, setSliderVal] = useState(0) // 进度条值
  const [totalTime, setTotalTime] = useState(0) // 视频总时长
  const [showPointer, setShowPointer] = useState(false) // 控制显示展开/关闭
  const [total, setTotal] = useState(0) // 视频总数
  const VIEWABILITY_CONFIG = {
    minimumViewTime: 300,
    viewAreaCoveragePercentThreshold: 10,
    waitForInteraction: true,
  };
  const flatRef = useRef((item) => {
    if (item.viewableItems.length > 0) {
      let index = item.viewableItems[0].index
      setVideoIndex(index)
      setRefreshIndex(index)
    }
  })

  // 获取短视频列表
  const getShortList = (videoIndex) => {
    let params = {
      pageSize: 10,
      pageNo: pageNo
    }
    getSVideoList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let oldVideoList = videoList
        let records = res.data.records
        let r = reachStatus ? oldVideoList.concat(records) : records
        setVideoList([...r])
        !reachStatus ? getVideoData(r[videoIndex].playVideoId) : ''
        setTotal(res.data.total)
        setReachStatus(false)
      }
    })
  }

  // 获取视频url
  const getVideoData = (playVideoId) => {
    let params = {
      videoId: playVideoId
    }
    getShortVideoUrl(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = JSON.parse(res.data)
        setVideoUrl(r.playInfoList[0].playURL)
      }
    })
  }

  // 设置进度条和播放时间的变化，sliderValue用来同步步进器
  const changeProgress = (e) => {
    setSliderVal(e.currentTime)
  }

  const changeLoad = (e) => {
    setTotalTime(e.duration)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.videoItemContain}>
        {
          videoIndex == index && videoUrl != '' ?
            <TouchableWithoutFeedback onPress={() => {
              setPaused(!paused)
            }}>
              <Video
                ref={videoRef}
                pagingEnabled={true}
                ignoreSilentSwitch="ignore"
                paused={videoIndex == index ? paused : true}
                posterResizeMode='contain'
                resizeMode='contain'
                poster={envCofig.CDN_BASE_URL + item.coverPicUrl}
                controls={false}
                style={styles.videoItem}
                source={{ uri: videoUrl }}
                onProgress={(e) => changeProgress(e)}
                onLoad={changeLoad}
                repeat={true}>
              </Video>
            </TouchableWithoutFeedback> : <Image resizeMode='contain' style={styles.videoItem} source={{ uri: envCofig.CDN_BASE_URL + item.coverPicUrl }}></Image>
        }
        {
          videoIndex == index && paused ? (
            <TouchableWithoutFeedback onPress={() => {
              setPaused(!paused)
            }}>
              <View style={styles.playContain}>
                <Image style={styles.playIcon} source={require('../../../images/square/wtClass/play.png')}></Image>
              </View>
            </TouchableWithoutFeedback>
          ) : ''
        }
        {
          videoIndex == index ?
            <View style={styles.videoInfoContain}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text numberOfLines={showPointer ? 0 : 3} style={styles.videoDesc}>{item.description}</Text>
              {
                item.description.length > 90 ? (
                  <TouchableWithoutFeedback onPress={() => {
                    setShowPointer(!showPointer)
                  }}>
                    <View style={styles.showPointerContain}>
                      <Text style={styles.pointerText}>{showPointer ? '收起' : '展开'}</Text>
                      <Text style={[styles.pointerBorder, showPointer ? styles.activeBorder : '']}></Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : ''
              }
              <Slider
                style={styles.sliderContain}
                value={sliderVal}
                minimumValue={0}
                maximumValue={totalTime}
                minimumTrackTintColor="#4CA6FC"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor='#4CA6FC'
                onSlidingStart={() => {
                  setPaused(true)
                }}
                onSlidingComplete={(value) => {
                  setSliderVal(Number(value))
                  videoRef.current.seek(Number(value));
                  setPaused(false)
                }}
              />
            </View> : ''
        }
      </View >
    )
  }

  // 课程id赋值
  const setDefaultVal = () => {
    if (route.params && route.params.index) {
      setVideoIndex(route.params.index)
      getShortList(route.params.index)
    } else {
      getShortList(0)
    }
  }

  // 触底加载
  const getReachList = (e) => {
    if (videoList.length < total) {
      setReachStatus(true)
      setPageNo(pageNo + 1)
    }
  }

  // 监听pageNo钩子函数
  useEffect(() => {
    if (videoList.length != 0) {
      getShortList(videoIndex)
    }
  }, [pageNo])

  // 监听route钩子函数
  useEffect(() => {
    setDefaultVal()
  }, [route])

  useEffect(() => {
    if (videoList.length > 0) {
      setSliderVal(0)
      setPaused(false)
      setShowPointer(false)
    }
  }, [videoIndex])

  useEffect(() => {
    if (videoList.length > 0) {
      getVideoData(videoList[videoIndex].playVideoId)
    }
  }, [refreshIndex])

  return (
    <View style={styles.videoContain}>
      <FlatList
        data={videoList}
        renderItem={renderItem}
        horizontal={false}
        pagingEnabled={true}
        keyExtractor={(item, index) => index.toString()}
        viewabilityConfig={VIEWABILITY_CONFIG}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={flatRef.current}
        onEndReached={(e) => getReachList(e)}
        onEndReachedThreshold={0}
        initialScrollIndex={videoIndex}
        getItemLayout={(data, index) => (
          { length: Dimensions.get('window').height, offset: Dimensions.get('window').height * index, index }
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  videoContain: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  videoItemContain: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#000000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'flex-start'
  },
  videoItem: {
    backgroundColor: '#000000',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (16 / 9),
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'flex-start'
  },
  videoInfoContain: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom: dp2px(70),
    paddingHorizontal: dp2px(12),
    zIndex: 999,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: dp2px(14),
    marginBottom: dp2px(4)
  },
  videoDesc: {
    color: '#ffffff',
    fontSize: dp2px(12),
  },
  sliderContain: {
    width: dp2px(350),
    height: dp2px(40)
  },
  playContain: {
    width: dp2px(50),
    height: dp2px(50),
    borderRadius: dp2px(50),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - dp2px(100),
    left: Dimensions.get('window').width / 2 - dp2px(30),
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999
  },
  playIcon: {
    width: 30,
    height: 30,
    marginLeft: dp2px(4)
  },
  showPointerContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp2px(4)
  },
  pointerText: {
    color: '#ffffff',
    fontSize: dp2px(12),
    marginRight: dp2px(4)
  },
  pointerBorder: {
    width: dp2px(8),
    height: dp2px(8),
    borderTopWidth: dp2px(1),
    borderRightWidth: dp2px(1),
    borderColor: '#ffffff',
    transform: [
      {
        rotate: '135deg'
      }
    ]
  },
  activeBorder: {
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  }
})

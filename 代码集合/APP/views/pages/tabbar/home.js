import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, StatusBar, ImageBackground, Platform, findNodeHandle, UIManager } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import SelectedServices from '../../components/home/selectedServices'
import AskBox from '../../components/home/askBox'
import EightPro from '../../components/home/eightPro'
import FixedSearch from '../../components/home/fixedSearch'
import SearchBg from '../../components/home/searchBg'
import WtClass from '../../components/home/wtClass'
import TabPro from '../../components/home/tabPro'
import TabBar from '../../components/home/tabBar'
import ComStatusBar from '../../components/common/comStatusBar';
import DeviceInfo from 'react-native-device-info'

export default function Home(props) {
  const proRef = useRef()
  const tabRef = useRef()
  const scrollRef = useRef()
  const [showHead, setShowHead] = useState(false)
  const [fixStatus, setFixStatus] = useState(false)
  const [modelType, setModelType] = useState('')
  const [resetY, setResetY] = useState(0)
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])

  useEffect(() => {
    if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
      let arr = DeviceInfo.getModel().slice(7).split(' ')
      setModelType(arr.length > 0 ? arr[0] : '')
    }
  }, [modelType])

  useEffect(() => {
    // console.log(process.env.NODE_ENV, "输出当前环境配置")
  }, [showHead])

  // 触底判断
  const reachBottom = (event) => {
    // const offSetY = event.nativeEvent.contentOffset.y; // 获取滑动的距离
    // const contentSizeHeight = event.nativeEvent.contentSize.height; // scrollView  contentSize 高度
    // const oriageScrollHeight = event.nativeEvent.layoutMeasurement.height; // scrollView高度
    // if (offSetY + oriageScrollHeight >= contentSizeHeight - 0) {}
    proRef.current.getReachList()
  };

  const onScroll = (event) => {
    const offSetY = event.nativeEvent.contentOffset.y;
    offSetY > dp2px(80) ? setShowHead(true) : setShowHead(false)
    offSetY > (resetY - dp2px(40)) ? setFixStatus(true) : setFixStatus(false)
  }

  const changeTab = (index) => {
    proRef.current.changeTab(index)
    scrollRef.current.scrollTo({ animated: false, y: (resetY - dp2px(80)) });
  }

  const showMainScroll = (e) => {
    if (e && resetY == 0) {
      setResetY(e.nativeEvent.layout.y)
    }
  }

  return (
    <View>
      {/* 状态栏 */}
      <ComStatusBar />
      <SafeAreaView>
        <View style={styles.mainContain}>
          <FixedSearch showHead={showHead}></FixedSearch>
          <ScrollView ref={scrollRef} stickyHeaderIndices={[5]} onScroll={(e) => onScroll(e)} scrollEventThrottle={0} showsVerticalScrollIndicator={false} onScrollEndDrag={(e) => reachBottom(e)}>

            {/* 搜索/背景图区域 */}
            <SearchBg></SearchBg>

            {/* 八大产品区域 */}
            <EightPro props={props}></EightPro>

            {/* 咨询框表单 */}
            <AskBox></AskBox>

            {/* 精选服务 */}
            <SelectedServices props={props}></SelectedServices>

            {/* 卧涛课堂 */}
            <WtClass props={props}></WtClass>

            {/* tab产品切换标题栏 */}
            <TabBar tabRef={tabRef} fixStatus={fixStatus} changeTab={changeTab}></TabBar>

            {/* tab产品 */}
            <View onLayout={(e) => showMainScroll(e)}>
              <TabPro proRef={proRef} props={props}></TabPro>
            </View>

          </ScrollView>
          <Image style={[styles.askSty, Platform.OS == 'ios' ? {
            bottom: dp2px(iosList.includes(modelType) ? 150 : 90)
          } : '']} source={require('../../images/home/icon-ask.png')}></Image>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContain: {
    position: 'relative',
    backgroundColor: '#F5F7FB',
  },
  askSty: {
    position: 'absolute',
    bottom: dp2px(50),
    right: dp2px(8),
    width: dp2px(54),
    height: dp2px(50)
  }
})

import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, View, ScrollView, TouchableWithoutFeedback, SafeAreaView, Platform } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import ComStatusBar from '../../components/common/comStatusBar';
import Policy from '../../components/square/policy/index'
import WtClass from '../../components/square/wtClass/index'
import DeviceInfo from 'react-native-device-info'
import NoData from '../../components/common/noData';

export default function Square(props) {

  const [tabList] = useState(['通知公告', '卧涛课堂'])
  const [tabIndex, setTabIndex] = useState(1)
  const [modelType, setModelType] = useState('')
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])

  // useEffect(() => {
  //   if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
  //     let arr = DeviceInfo.getModel().slice(7).split(' ')
  //     setModelType(arr.length > 0 ? arr[0] : '')
  //   }
  // }, [modelType])

  // 修改tab栏index
  const changeTab = (index) => {
    setTabIndex(index)
  }

  return (
    <NoData />
    // <View>
    //   <ComStatusBar />
    //   <SafeAreaView>
    //     <View style={[
    //       styles.squareContain, {
    //         paddingBottom: dp2px(Platform.OS == 'android' ? 45 : iosList.includes(modelType) ? 160 : 110)
    //       }
    //     ]}>
    //       {/* tab切换 */}
    //       <View style={styles.tabContain}>
    //         {
    //           tabList.map((item, index) => {
    //             return (
    //               <TouchableWithoutFeedback onPress={(e) => changeTab(index, e)} key={index} style={styles.tabItem}>
    //                 <View style={styles.tabItem}>
    //                   <Text style={[styles.tabItemTitle, tabIndex == index ? styles.activeTabTitle : '']}>{item}</Text>
    //                   <View style={[styles.tabItemBorder, tabIndex == index ? styles.activeTabBorder : '']}></View>
    //                 </View>
    //               </TouchableWithoutFeedback>
    //             )
    //           })
    //         }
    //       </View>
    //       {/* 0-通知公告  1-卧涛课堂*/}
    //       <ScrollView stickyHeaderIndices={[]} scrollEventThrottle={0} showsVerticalScrollIndicator={false}>
    //         {
    //           tabIndex == 0 ? <Policy /> : <WtClass props={props} />
    //         }
    //       </ScrollView>
    //     </View>
    //   </SafeAreaView>
    // </View>
  )
}

const styles = StyleSheet.create({
  squareContain: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabContain: {
    width: Dimensions.get('window').width,
    height: dp2px(45),
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabItem: {
    position: 'relative',
    display: 'flex',
    height: dp2px(45),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabItemTitle: {
    color: '#888888',
    fontSize: dp2px(14)
  },
  activeTabTitle: {
    color: '#36A6FE',
    fontWeight: 'bold',
  },
  tabItemBorder: {
    position: 'absolute',
    bottom: 0,
    width: dp2px(26),
    height: dp2px(4),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(2)
  },
  activeTabBorder: {
    backgroundColor: '#36a6fe',
  }
})

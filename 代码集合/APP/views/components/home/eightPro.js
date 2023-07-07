import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback, TextInput, SafeAreaView, ScrollView, StatusBar, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';

export default function EightPro({ props }) {
  const [eightPro, setEightPro] = useState([
    {
      title: '项目申报',
      imgUrl: require('../../images/home/eight-xmsb.png'),
      tabIndex: 0,
      id: 1,
    },
    {
      title: '知识产权',
      imgUrl: require('../../images/home/eight-zscq.png'),
      tabIndex: 1,
      id: 2,
    },
    {
      title: '工商财税',
      imgUrl: require('../../images/home/eight-gszc.png'),
      tabIndex: 2,
      id: 7,
    },
    {
      title: '融资上市',
      imgUrl: require('../../images/home/eight-rzss.png'),
      tabIndex: 3,
      id: 9,
    },
    {
      title: '法律服务',
      imgUrl: require('../../images/home/eight-flfw.png'),
      tabIndex: 4,
      id: 10,
    },
    {
      title: '软件开发',
      imgUrl: require('../../images/home/eight-rjkf.png'),
      tabIndex: 5,
      id: 11,
    },
    {
      title: '卧涛课堂',
      imgUrl: require('../../images/home/eight-wtkt.png'),
      tabIndex: 0,
      id: 1,
    },
    {
      title: '更多服务',
      imgUrl: require('../../images/home/eight-more.png'),
      tabIndex: 0,
      id: 1,
    },
  ])

  const toClassify = (index) => {
    // let navigation = props.navigation
    // let params = {
    //   index: eightPro[index].tabIndex,
    //   id: eightPro[index].id
    // }
    // navigation.navigate(index == 6 ? 'Square' : 'Classify', params)
  }

  return (
    <View style={styles.eightProContain}>
      {
        eightPro.map((item, index) => {
          return (
            <TouchableWithoutFeedback key={index} onPress={(e) => toClassify(index, e)}>
              <View style={styles.eightProItem}>
                <Image style={styles.proImage} source={item.imgUrl} />
                <Text style={styles.proText}>{item.title}</Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })
      }
    </View>
  )
}

const styles = StyleSheet.create({
  /**
  * 八大产品区域
  */
  eightProContain: {
    height: dp2px(240),
    position: 'absolute',
    top: dp2px(169),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    paddingTop: dp2px(24),
    borderTopRightRadius: dp2px(20),
    borderTopLeftRadius: dp2px(20),
    paddingBottom: dp2px(4)
  },
  eightProItem: {
    width: Dimensions.get('window').width / 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dp2px(28)
  },
  proImage: {
    width: dp2px(44),
    height: dp2px(44),
    marginBottom: dp2px(6)
  },
  proText: {
    color: '#333333',
    fontSize: dp2px(12),
    fontWeight: 'bold'
  },
})

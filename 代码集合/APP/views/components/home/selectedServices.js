import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';

export default function SelectedServices({ props }) {
  const [proTwo] = useState([
    {
      title: "高新技术企业认定",
      desc: "资金补助、减税、招投标加分等",
      bgUrl: require('../../images/home/blue-bg.png'),
      id: 7020
    },
    {
      title: "发明专利申请",
      desc: "真技术，高价值",
      bgUrl: require('../../images/home/yellow-bg.png'),
      id: 1
    }
  ])

  const [proFour] = useState([
    {
      title: "商标注册",
      desc: "全程跟进，专业高效",
      id: 9
    },
    {
      title: "网站建设",
      desc: "高端定制，精心设计",
      id: 501
    },
    {
      title: "公司注册",
      desc: "专业顾问团队、咨询指导",
      id: 301
    },
    {
      title: "科技成果评价",
      desc: "权威科技成果评价机构",
      id: 7069
    }
  ])

  // 跳转到产品详情
  const toDetail = (item) => {
    // let navigation = props.navigation
    // let params = {
    //   id: item.id
    // }
    // navigation.navigate('ProDetail', params)
  }

  return (
    <View style={styles.serviceContain}>
      <View style={styles.serviceText}>
        <Text style={styles.bigText}>精选服务</Text>
        <Text style={styles.smallText}>帮您高效搞定需求</Text>
      </View>
      <View style={styles.proContain}>
        <View style={styles.twoPro}>
          {
            proTwo.map((item, index) => {
              return (
                <TouchableWithoutFeedback onPress={(e) => toDetail(item, e)} key={index} style={styles.twoProItem}>
                  <ImageBackground borderRadius={10} style={styles.twoProItem} source={item.bgUrl}>
                    <Text style={styles.twoProItemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.twoProItemDesc} numberOfLines={1}>{item.desc}</Text>
                    <View style={styles.twoProItemBtnContain}>
                      <Text style={styles.twoProItemBtn}>立即办理</Text>
                    </View>
                  </ImageBackground>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
        <View style={styles.fourPro}>
          {
            proFour.map((item, index) => {
              return (
                <TouchableWithoutFeedback onPress={(e) => toDetail(item, e)} key={index} style={styles.fourProItem}>
                  <View style={styles.fourProItem}>
                    <Text style={styles.fourProItemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.fourProItemDesc} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.fourProIconContain}>
                      <Image style={styles.fourProIcon} source={require('../../images/home/right-pointer.png')}></Image>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  /**
  * 精选服务区域
  */
  serviceContain: {
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
    color: '#3C97FE',
    fontSize: dp2px(13),
  },
  proContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: dp2px(351),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(10),
    height: dp2px(216)
  },
  twoPro: {
    width: dp2px(329),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp2px(16)
  },
  twoProItem: {
    width: dp2px(162),
    height: dp2px(100),
    backgroundColor: 'lightblue',
    borderRadius: dp2px(10),
    paddingLeft: dp2px(10)
  },
  twoProItemTitle: {
    width: dp2px(140),
    color: '#005497',
    fontSize: dp2px(13),
    fontWeight: 'bold',
    marginTop: dp2px(9),
    marginBottom: dp2px(4)
  },
  twoProItemDesc: {
    width: dp2px(150),
    color: '#005497',
    fontSize: dp2px(12),
    marginBottom: dp2px(15)
  },
  twoProItemBtnContain: {
    width: dp2px(70),
    height: dp2px(24),
    backgroundColor: '#36A6FE',
    borderRadius: dp2px(12),
  },
  twoProItemBtn: {
    lineHeight: dp2px(24),
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: dp2px(12)
  },
  fourPro: {
    width: dp2px(329),
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp2px(8)
  },
  fourProItem: {
    width: dp2px(79),
    marginRight: dp2px(4),
    backgroundColor: '#F5F7FB',
    borderRadius: dp2px(8),
    paddingLeft: dp2px(3.5),
    paddingBottom: dp2px(4)
  },
  fourProItemTitle: {
    color: '#005497',
    fontSize: dp2px(12),
    fontWeight: 'bold',
    marginTop: dp2px(8),
    marginBottom: dp2px(4)
  },
  fourProItemDesc: {
    color: '#005497',
    fontSize: dp2px(10),
  },
  fourProIconContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: dp2px(4)
  },
  fourProIcon: {
    width: dp2px(16),
    height: dp2px(16),
    marginRight: dp2px(4),
  }
})

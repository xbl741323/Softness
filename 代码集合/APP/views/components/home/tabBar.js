import React, { useEffect, useState, useImperativeHandle } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import * as CodeMsg from "../../utils/common/codeMsg";
import * as envCofig from "../../utils/envConfig"
import * as proFilter from "../../utils/filter/product"
import { getProTab, getProductList } from '../../api/product'

export default function TabBar({ changeTab, fixStatus }) {
  const [tabIndex, setTabIndex] = useState(0)
  const [tabList, setTabList] = useState([])

  // tab切换
  const changeTabIndex = (index) => {
    setTabIndex(index)
    changeTab(index)
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
    }, [])
  )

  return (
    <View style={[styles.tabContain, fixStatus ? styles.activeTabSty : '']}>
      <ScrollView style={styles.tabScrollSty} horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.tabSty}>
          {
            tabList.map((item, index) => {
              return (
                <TouchableWithoutFeedback onPress={(e) => changeTabIndex(index, e)} key={index}>
                  <View style={[styles.tabItem, index == 0 ? styles.tabItemMarginRight : '']}>
                    <Text style={[styles.tabItemText, index == tabIndex ? styles.activeItemText : '']}>{item.categoryName}</Text>
                    <View style={[styles.tabItemLine, index == tabIndex ? styles.activeLine : '']}></View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: dp2px(18),
    paddingTop: dp2px(10),
    backgroundColor: '#F5F7FB',
  },
  activeTabSty: {
    marginTop: dp2px(60),
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
})
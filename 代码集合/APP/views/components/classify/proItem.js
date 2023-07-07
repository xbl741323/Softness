import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, TouchableWithoutFeedback, ScrollView, StatusBar, ImageBackground } from 'react-native'
import * as envCofig from "../../utils/envConfig"
import * as proFilter from "../../utils/filter/product"
import dp2px from '../../utils/common/dp2px';

export default function ProItem(props) {

  const { proInfo } = props

  // 跳转到产品详情
  const toDetail = () => {
    let navigation = props.navigation
    let params = {
      id: proInfo.id
    }
    navigation.navigate('ProDetail', params)
  }

  return (
    <TouchableWithoutFeedback onPress={(e) => toDetail(e)}>
      <View style={styles.proContain}>
        <Image resizeMode='stretch' style={styles.proCover} source={{ uri: envCofig.CDN_BASE_URL + proInfo.imageUrl }}></Image>
        <View style={styles.proInfoContain}>
          <Text style={styles.proTitle} numberOfLines={2}>{proInfo.spuTitle}</Text>
          {
            proInfo.isOnline ? (
              <Text numberOfLines={1} style={styles.proDesc}>
                <Text>
                  ￥{proFilter.fixClassPrice(proInfo.spuMinAmount)}
                </Text>
                <Text>
                  {proFilter.fixClassPrice(proInfo.spuMinAmount) != proFilter.fixClassPrice(proInfo.spuMaxAmount) ? '起' : ''}
                </Text>
              </Text>
            ) : (<Text numberOfLines={1} style={styles.proDesc}>
              面议
            </Text>)
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  proContain: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: dp2px(12)
  },
  proCover: {
    width: dp2px(81),
    height: dp2px(58),
    borderRadius: dp2px(4)
  },
  proInfoContain: {
    width: dp2px(160),
    marginLeft: dp2px(7),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  proTitle: {
    color: '#333333',
    fontSize: dp2px(13),
    lineHeight: dp2px(19),
    fontWeight: 'bold'
  },
  proDesc: {
    marginBottom: dp2px(5),
    color: '#FF6D27',
    fontSize: dp2px(12)
  }
})

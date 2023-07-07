import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, StatusBar, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';

export default function FixedSearch({ showHead }) {
  const [locationName, setLocationName] = useState('全国')

  return (
    <View style={[styles.headerContain, showHead ? styles.activeBg : '']}>
      <View style={styles.searchContain}>
        <Text style={styles.locationText}>{locationName}</Text>
        <Image style={styles.locationPointer} source={require('../../images/home/xiala-icon.png')}></Image>
        <Text style={styles.langSty}></Text>
        <View style={styles.locationInputContain}>
          <Image style={styles.locationInputImg} source={require('../../images/home/sousuo-icon.png')}></Image>
          <TextInput
            style={styles.locationInput}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            textAlignVertical='center'
            placeholderTextColor='#B4B4B4'
            placeholder="高新技术企业">
          </TextInput>
        </View>
        <View style={styles.locationBtn}>
          <Text style={styles.locationBtnText}>搜索</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  /**
   * 搜索框区域
   */
  headerContain: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 89, 174, 0)',
    width: Dimensions.get('window').width,
    zIndex: 999
  },
  activeBg: {
    backgroundColor: 'rgba(19, 89, 174, 1)',
  },
  searchContain: {
    width: dp2px(351),
    marginTop: dp2px(12),
    marginBottom: dp2px(12),
    display: 'flex',
    height: dp2px(37),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: dp2px(19)
  },
  locationText: {
    width: dp2px(45),
    maxWidth: dp2px(60),
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: dp2px(16),
  },
  locationPointer: {
    width: dp2px(14),
    height: dp2px(15),
    marginRight: dp2px(4),
  },
  langSty: {
    width: dp2px(1),
    height: dp2px(14),
    backgroundColor: '#C0C0C0',
    marginRight: dp2px(6),
  },
  locationInputContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: dp2px(200),
    height: dp2px(32),
  },
  locationInputImg: {
    width: dp2px(16),
    height: dp2px(17),
    marginRight: dp2px(6),
  },
  locationInput: {
    width: dp2px(165),
    paddingVertical: 0,
    color: '#B4B4B4',
    fontSize: dp2px(14),
  },
  locationBtn: {
    width: dp2px(61),
    height: dp2px(33),
    backgroundColor: '#36A6FE',
    borderTopRightRadius: dp2px(17),
    borderTopLeftRadius: dp2px(6),
    borderBottomRightRadius: dp2px(17),
    borderBottomLeftRadius: dp2px(6),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dp2px(1),
    marginRight: dp2px(1),
  },
  locationBtnText: {
    color: '#FFFFFF',
    fontSize: dp2px(13)
  },
})

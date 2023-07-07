import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, StatusBar, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';

export default function SearchBg() {

  return (
    <ImageBackground
      style={styles.headerBg}
      source={require('../../images/home/bg.png')}>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  /**
   * 搜索/背景图区域
   */
  headerBg: {
    width: Dimensions.get('window').width,
    height: dp2px(195),
  }
})

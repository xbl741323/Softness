import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'
import dp2px from '../../utils/common/dp2px';

export default function NoData() {
  return (
    <View style={styles.containSty}>
      <Image style={styles.imgSty} source={require('../../images/common/no-data.png')}></Image>
      <Text style={styles.titleSty}>系统维护中</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  containSty: {
    height: Dimensions.get('window').height * 0.75,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imgSty: {
    width: dp2px(210),
    height: dp2px(128)
  },
  titleSty: {
    color: '#555555',
    fontSize: dp2px(15),
  }
})
import React, { useEffect, useState } from 'react'
import { StyleSheet, Platform, View, StatusBar } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import DeviceInfo from 'react-native-device-info'

export default function ComStatusBar() {
  const [modelType, setModelType] = useState('')
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])

  useEffect(() => {
    if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
      let arr = DeviceInfo.getModel().slice(7).split(' ')
      setModelType(arr.length > 0 ? arr[0] : '')
      console.log(modelType, 'modelType')
    }
  }, [modelType])

  return (
    <View>
      {
        Platform.OS == 'android' ? (
          <StatusBar backgroundColor='#0B4488' />
        ) : (
          <View style={[styles.statusBar, {
            height: dp2px(iosList.includes(modelType) ? 58 : 33),
          }]}>
            <StatusBar backgroundColor='#0B4488' barStyle={'light-content'} />
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#0B4488'
  }
})

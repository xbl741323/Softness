import React, { useEffect, useState } from 'react'
import { Platform, Image, StyleSheet, View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../pages/tabbar/home"
import Classify from "../pages/tabbar/classify"
import Square from "../pages/tabbar/square"
import Personal from "../pages/tabbar/personal"
import dp2px from '../utils/common/dp2px';
import DeviceInfo from 'react-native-device-info'

export default function Tabs(props) {
  const Tab = createBottomTabNavigator();
  const [modelType, setModelType] = useState('')
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])

  useEffect(() => {
    if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
      let arr = DeviceInfo.getModel().slice(7).split(' ')
      setModelType(arr.length > 0 ? arr[0] : '')
    }
  }, [modelType])

  // 获取tabbar切换图标数据
  const getTab = (route, focused) => {
    let info = {
      coverUrl: "",
      name: "",
    }
    switch (route.name) {
      case 'Home':
        info.coverUrl = focused ? require('../images/tabbar/home_active.png') : require('../images/tabbar/home.png');
        info.name = '首页'
        break;
      case 'Classify':
        info.coverUrl = focused ? require('../images/tabbar/service_active.png') : require('../images/tabbar/service.png');
        info.name = '服务'
        break;
      case 'Square':
        info.coverUrl = focused ? require('../images/tabbar/policy_active.png') : require('../images/tabbar/policy.png');
        info.name = '广场'
        break;
      case 'Personal':
        info.coverUrl = focused ? require('../images/tabbar/personal_active.png') : require('../images/tabbar/personal.png');
        info.name = '我的'
        break;
    }
    return info
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return <View style={[styles.tabContain, Platform.OS == 'ios' ? {
            height: dp2px(iosList.includes(modelType) ? 65 : 50),
            justifyContent: 'flex-end'
          } : '']}>
            <Image style={route.name == 'Home' && focused ? styles.bigLogo : styles.tinyLogo} source={getTab(route, focused).coverUrl} />
            {
              focused && route.name == 'Home' ? '' : <Text style={[styles.defaultText, focused ? styles.activeText : '']}>{getTab(route, focused).name}</Text>
            }
          </ View>
        },
        tabBarActiveTintColor: '#36A6FE',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          height: Platform.OS == 'android' ? dp2px(50) : dp2px(iosList.includes(modelType) ? 65 : 50),
        },
        tabBarLabelStyle: {
          fontSize: (route.name == 'Home') ? 0 : 0
        },
        headerShown: false
      })}>
      <Tab.Screen name="Home" component={Home} options={{ title: "" }} />
      <Tab.Screen name="Classify" component={Classify} options={{ title: "" }} />
      <Tab.Screen name="Square" component={Square} options={{ title: "" }} />
      <Tab.Screen name="Personal" component={Personal} options={{ title: "" }} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: dp2px(24),
    height: dp2px(24)
  },
  bigLogo: {
    width: dp2px(36),
    height: dp2px(36)
  },
  tabContain: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  defaultText: {
    fontSize: dp2px(10),
    color: '#999999',
    marginTop: dp2px(2)
  },
  activeText: {
    color: '#36A6FE'
  }
})

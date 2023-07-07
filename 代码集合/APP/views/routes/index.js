/**
 * 配置路由信息
 */
import React from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import Tabs from "./tabs"
import Login from "../pages/personal/login/login"
import Register from "../pages/personal/login/register"
import WxBind from "../pages/personal/login/wxBind"
import FindPwd from "../pages/personal/accountSet/findPwd"
import AccountSet from "../pages/personal/accountSet/accountSet"
import AccountInfo from "../pages/personal/accountSet/accountInfo"
import ModifyPwd from "../pages/personal/accountSet/modifyPwd"
import ModifyPhone from "../pages/personal/accountSet/modifyPhone"
import ModifyAuthInfo from "../pages/personal/accountSet/modifyAuthInfo"
import Setting from "../pages/personal/setting/setting"
import ProDetail from "../pages/product/proDetail"
import CourseDetail from "../pages/square/wtClass/courseDetail"
import ShortVideo from "../pages/square/wtClass/shortVideo"
import PrivacyProtection from "../pages/agreement/privacyProtection"
import UserRegistration from "../pages/agreement/userRegistration"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import dp2px from '../utils/common/dp2px';

export default function Index() {
  const Stack = createNativeStackNavigator();

  const goBack = (navigation) => {
    navigation.goBack()
  }

  // 配置导航头返回键样式
  const screenOptions = (navigation, title) => {
    return {
      title: title,
      headerShown: true,
      headerStyle: {
        backgroundColor: '#497AFF',
      },
      headerTitleStyle: {
        fontSize: dp2px(14)
      },
      headerLeft: (() => {
        return (
          <TouchableWithoutFeedback onPress={(e) => goBack(navigation, e)}>
            <View style={styles.contain}>
              <View style={styles.pointerSty}></View>
            </View>
          </TouchableWithoutFeedback>
        )
      }),
      headerTintColor: '#ffffff'
    }
  }

  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={({ navigation }) => screenOptions(navigation, '登录')} />
      <Stack.Screen name="Register" component={Register} options={({ navigation }) => screenOptions(navigation, '注册')} />
      <Stack.Screen name="WxBind" component={WxBind} options={({ navigation }) => screenOptions(navigation, '微信绑定')} />
      <Stack.Screen name="AccountSet" component={AccountSet} options={({ navigation }) => screenOptions(navigation, '账号设置')} />
      <Stack.Screen name="AccountInfo" component={AccountInfo} options={({ navigation }) => screenOptions(navigation, '账号信息')} />
      <Stack.Screen name="FindPwd" component={FindPwd} options={({ navigation }) => screenOptions(navigation, '修改登录密码')} />
      <Stack.Screen name="ModifyPwd" component={ModifyPwd} options={({ navigation }) => screenOptions(navigation, '修改密码')} />
      <Stack.Screen name="ModifyPhone" component={ModifyPhone} options={({ navigation }) => screenOptions(navigation, '修改手机号')} />
      <Stack.Screen name="Setting" component={Setting} options={({ navigation }) => screenOptions(navigation, '设置')} />
      <Stack.Screen name="ModifyAuthInfo" component={ModifyAuthInfo} options={({ navigation }) => screenOptions(navigation, '授权人信息修改')} />
      <Stack.Screen name="ProDetail" component={ProDetail} options={({ navigation }) => screenOptions(navigation, '产品详情')} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} options={({ navigation }) => screenOptions(navigation, '课程详情')} />
      <Stack.Screen name="ShortVideo" component={ShortVideo} options={({ navigation }) => screenOptions(navigation, '短视频')} />
      <Stack.Screen name="UserRegistration" component={UserRegistration} options={({ navigation }) => screenOptions(navigation, '用户注册协议')} />
      <Stack.Screen name="PrivacyProtection" component={PrivacyProtection} options={({ navigation }) => screenOptions(navigation, '隐私保护声明')} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  contain: {
    paddingVertical: dp2px(12),
    paddingLeft: dp2px(5),
  },
  pointerSty: {
    width: dp2px(12),
    height: dp2px(12),
    borderTopWidth: dp2px(1),
    borderTopColor: '#FFFFFF',
    borderLeftWidth: dp2px(1),
    borderLeftColor: '#FFFFFF',
    marginRight: dp2px(20),
    transform: [{ rotate: '-45deg' }]
  }
})


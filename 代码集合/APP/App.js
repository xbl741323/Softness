import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Index from "./views/routes/index"
import { store } from './views/redux/store'
import { Provider } from 'react-redux'
import { ModalPortal } from 'react-native-modals';
import * as WeChat from 'react-native-wechat-lib';
import SplashScreen from 'react-native-splash-screen'

export default class App extends React.Component {

  componentDidMount() {
    WeChat.registerApp('wx7656a00115b2e874', 'universalLink');
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500)
  }

  render() {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <Index />
          <ModalPortal />
        </Provider>
      </NavigationContainer>
    )
  }
}
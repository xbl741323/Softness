import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from '../redux/reducers/userInfo'

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
})
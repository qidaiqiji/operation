import { query as queryUsers, reqAuth } from '@/services/user';
import Router from 'umi/router';
import { notification } from 'antd';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *autoLogin(_, { call, put }) {
    //   try {
    //     const user = yield call(reqAuth);
    //     yield put({
    //       type: 'updatePageReducer',
    //       payload: {
    //         ...user.data,
    //         currentUser: user.data,
    //       },
    //     });
    //   } catch (error) {
    //     yield put(routerRedux.push('/user/login'));
    //   }
    // },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

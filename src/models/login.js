import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { reqLogin, reqAuth } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import Router from 'umi/router';
export default {
  namespace: 'login',
  state: {
    currentUser: {},
    isLogin: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const user = yield call(reqLogin, { ...payload });
        localStorage.setItem('token', user.data.access_token);
        yield put({
          type: 'updatePageReducer',
          payload: {
            currentUser: user.data,
            isLogin: true,
          },
        });
        Router.push('/dashboard/analysis');
      } catch (err) {
        console.log(err);
      }
    },
    *autoLogin({ payload }, { put, call, select }) {
      const { pathname } = payload;
      try {
        const user = yield call(reqAuth);
        if (+user.code === 0) {
          if (pathname === '/') {
            Router.push('/dashboard');
          } else {
            Router.push(pathname);
          }
        }
        yield put({
          type: 'updatePageReducer',
          payload: {
            currentUser: user.data,
            isLogin: true,
          },
        });
      } catch (error) {
        Router.push('/user');
      }
    },

    *logout(_, { put }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          status: false,
          isLogin: false,
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

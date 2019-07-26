import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import {
  reqViewActInfo,
  reqViewList,
  reqGoodsActList,
  updateGroupNumb,
} from '../services/activityDetails';

export default {

  namespace: 'createCoupons',

  state: {
    indateType:false
  },

  reducers: {
    getStateResolved(state, action) {
      return { ...state, ...action.payload };
    },
    unmountReducer() {
        return {
            indateType:false
        };
      },
  },

  effects: {

    *getMsg({ payload }, { call, put }) {
      yield put({ type: 'getStateResolved' });
    },
    *createMsg({ payload }, { call, put }){
        yield put({ type: 'getStateResolved' });
    },
  },

};
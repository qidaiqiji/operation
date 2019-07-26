import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
// import {} from '../services/aTypeModel';

export default {
  namespace: 'bTypeModel',

  state: {

  },
  effects: {

  },
  reducers: {
    updatePageReducer(state, { payload }) {
      return { ...state, ...payload };
    },
    unmountReducer() {
      return {
        
      };
    },
  }
    
};

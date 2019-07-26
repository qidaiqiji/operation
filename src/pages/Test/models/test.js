import { test } from '@/services/api';


export default {

  namespace: 'test',

  state: {
    test:[],
      one:1,
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        console.log('test',payload)
      const data =  yield call(test,{...payload})
      console.log(data)
      yield put({ type: 'save',data});
    },
  },

  subscriptions: {
  //  init({dispatch}){
  //     dispatch({ });
  //  }
  },

};
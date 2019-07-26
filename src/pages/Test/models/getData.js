export default {

  namespace: 'getData',

  state: {
      data:[{data1:2222}]
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'save' });
    },
  },

  subscriptions: {

  },

};
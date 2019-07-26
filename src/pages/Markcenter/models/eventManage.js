import { reqList, reqConfig, reqOperation } from '../services/eventManage';
import { notification } from 'antd';
export default {
  namespace: 'eventManage',
  state: {
    id: '',
    currentPage: 1,
    pageSize: '40',
    type: '',
    startAt: '',
    endAt: '',
    name: '',
    actStatus: '',
    goodsSn: '',
    keyword: '',
    createStartTime: '',
    createEndTime: '',
    goodsList: [],
    total: 0,
    comStatusMap: [],
    typeMap: {},
    showOperationModal: false,
    operationId: '',
    submitLoading: false,
    actStatusMap:{}
  },
  effects: {
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
        },
      });
      const {
        id,
        currentPage,
        pageSize,
        type,
        startAt,
        endAt,
        name,
        actStatus,
        goodsSn,
        keyword,
        createStartTime,
        createEndTime,
      } = yield select(state => state.eventManage);
      try {
        const res = yield call(reqList, {
          id,
          currentPage,
          pageSize,
          type,
          startAt,
          endAt,
          name,
          actStatus,
          goodsSn,
          keyword,
          createStartTime,
          createEndTime,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            goodsList: res.data.list,
            total: res.data.totalCount,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *getConfig({ payload }, { put, call }) {
      try {
        const config = yield call(reqConfig);
        yield put({
          type: 'updatePageReducer',
          payload: {
            typeMap: config.data.typeMap,
            actStatusMap: config.data.actStatusMap,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *confirmOperation({ payload }, { put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          submitLoading: true,
        },
      });
      const { operationId, reqUrl } = yield select(state => state.eventManage);
      try {
        const res = yield call(reqOperation, reqUrl, { id: operationId });
        notification.success({
          message: res.msg,
        });
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...payload,
            submitLoading: false,
          },
        });
        yield put({
          type: 'getList',
        });
      } catch (err) {
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...payload,
            submitLoading: false,
          },
        });
        console.log(err);
      }
    },
  },
  reducers: {
    updatePageReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        id: '',
        currentPage: 1,
        pageSize: 40,
        type: '',
        startAt: '',
        endAt: '',
        name: '',
        actStatus: '',
        goodsSn: '',
        keyword: '454545',
        createStartTime: '',
        createEndTime: '',
        goodsList: [],
        total: 0,
        comStatusMap: [],
        typeMap: {},
        showOperationModal: false,
        operationId: '',
        submitLoading: false,
      };
    },
  },
};

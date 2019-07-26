import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import {
  reqViewActInfo,
  reqViewList,
  reqGoodsActList,
  updateGroupNumb,
  unsetGoodsActShow,
  setGoodsActShow,
} from '../services/activityDetails';
import {
  reqList,
  creatActivity,
  askActMes,
  askActGoodDetail,
  reqExcelInfo,
  updataActivity,
  reqConfig,
  creatPinTuan,
  reqCompositionList,
  reqGroupShopView,
  updateGroupShop,
  createMiaoShaGoods,
  updateGoodsAct,
  createPinTuanGoods,
  reqGroupShopList,
  //隔离上面的方法
  deleteGroupShop,
  reqDeleteActGoods,
  setGroupShopHot,
  unsetGroupShopHot,
  setGoodsActHot,
  unsetGoodsActHot,

} from '../services/markcenter';
console.log;
export default {
  namespace: 'activityDetails',

  state: {
    activityInfo: {
      name: '',
      guideText: '',
      startAt: '',
      endAt: '',
      preAt: '',
      desc: '',
      actStatus: {
        status: '',
        color: '',
      },
      id: '',
      compositionActivityList: [],
    },
    actGoodsList: [],
    totalCount: '',
    currentPage: 1,
    pageSize: 10,
    activityId: '',
    type: '',
    keywords: '',
    isHot: '',
    saveSorter: {},
    fullNum: '',
    goingNum: '',
    actGoodsId: '',
    isShowAddGroupModal: false,
    addPinTuanNumb: 1,
  },

  reducers: {
    getStateResolved(state, { payload }) {
      return { ...state, ...payload };
    },
    unmountReducer() {
      return {
        activityInfo: {
          name: '',
          guideText: '',
          startAt: '',
          endAt: '',
          preAt: '',
          desc: '',
          actStatus: {
            status: '',
            color: '',
          },
          id: '',
          compositionActivityList: [],
        },
        actGoodsList: [],
        totalCount: '',
        currentPage: 1,
        pageSize: 10,
        activityId: '',
        type: '',
        keywords: '',
        isHot: '',
        saveSorter: {},
        fullNum: '',
        goingNum: '',
        actGoodsId: '',
        isShowAddGroupModal: false,
        addPinTuanNumb: 1,
      };
    },
  },
  effects: {
    *getDetailMsg({ payload }, { call, put, all, select }) {
      const { type } = yield select(state => state.activityDetails);
      try {
        let res = {};
        if (type == 3) {
          res = yield all([
            call(reqViewActInfo, { ...payload }),
            call(reqViewList, { ...payload }),
          ]);
        } else {
          res = yield all([
            call(reqViewActInfo, { ...payload }),
            call(reqGoodsActList, { ...payload }),
          ]);
        }
        console.log(res);
        yield put({
          type: 'getStateResolved',
          payload: {
            activityInfo: res[0] ? res[0].data.activityInfo : null,
            ...res[1].data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *getGoodsList({ payload }, { call, put, select }) {
      const { type } = yield select(state => state.activityDetails);
      yield put({
        type: 'getStateResolved',
        payload: {
          actGoodsList:[]
        },
      });
      try {
        let res = {};
        if (type == 3) {
          res = yield call(reqViewList, { ...payload });
        } else {
          res = yield call(reqGoodsActList, { ...payload });
        }

        console.log(res);
        yield put({
          type: 'getStateResolved',
          payload: {
            ...payload,
            ...res.data,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *deleteGoodsItem({ payload }, { call, put, select }) {
      const { actGoodsId } = payload;
      const { actGoodsList } = yield select(state => state.activityDetails);
      try {
        yield put({
          type: 'reqDeleteGoods',
          payload: {
            ...payload,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *reqDeleteGoods({ payload }, { call, put, select }) {
      const {
        type,
        keywords,
        activityId,
        pageSize,
        isHot,
        currentPage,
        sortColumn,
        order,
      } = yield select(state => state.activityDetails);
      try {
        let res = {};
        if (type == 3) {
          res = yield call(deleteGroupShop, { ...payload });
        } else {
          res = yield call(reqDeleteActGoods, { ...payload });
        }
        yield put({
          type: 'getGoodsList',
          payload: {
            keywords,
            activityId,
            pageSize,
            isHot,
            currentPage,
            sortColumn,
            order,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *setIsHotGoodsItem({ payload }, { call, put, select }) {
      const {
        type,
        keywords,
        activityId,
        pageSize,
        isHot,
        currentPage,
        sortColumn,
        order,
      } = yield select(state => state.activityDetails);
      console.log(payload);
      const { actGoodsId, isSetHot } = payload;
      try {
        let res = {};
        if (type == 3) {
          if (!!isSetHot) {
            res = yield call(unsetGroupShopHot, { actGoodsId });
          } else {
            res = yield call(setGroupShopHot, { actGoodsId });
          }
        } else {
          if (!!isSetHot) {
            res = yield call(unsetGoodsActHot, { actGoodsId });
          } else {
            res = yield call(setGoodsActHot, { actGoodsId });
          }
        }
        yield put({
          type: 'getGoodsList',
          payload: {
            keywords,
            activityId,
            pageSize,
            isHot,
            currentPage,
            sortColumn,
            order,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *setIsShowGoodsItem({ payload }, { call, put, select }) {
      const {
        type,
        keywords,
        activityId,
        pageSize,
        isHot,
        currentPage,
        sortColumn,
        order,
      } = yield select(state => state.activityDetails);
      console.log(payload);
      const { actGoodsId, isSetShow } = payload;
      try {
        let res = {};
          if (!!isSetShow) {
            res = yield call(unsetGoodsActShow, { actGoodsId });
          } else {
            res = yield call(setGoodsActShow, { actGoodsId });
          }
        yield put({
          type: 'getGoodsList',
          payload: {
            keywords,
            activityId,
            pageSize,
            isHot,
            currentPage,
            sortColumn,
            order,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    *updatePinTuanNumb({ payload }, { call, put, select }) {
      const {
        keywords,
        activityId,
        pageSize,
        isHot,
        currentPage,
        sortColumn,
        order,
      } = yield select(state => state.activityDetails);

      try {
        const res = yield call(updateGroupNumb, { ...payload });
        yield put({
          type: 'getGoodsList',
          payload: {
            keywords,
            activityId,
            pageSize,
            isHot,
            currentPage,
            sortColumn,
            order,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  subscriptions: {},
};

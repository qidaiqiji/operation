import { activityGoodsList,  activityconfig,} from '../services/activitySummary';
export default {
  namespace: 'activitySummary',
  state: {
    activityList: [],
    actGoodsList: [],
    totalCount: 0,
    pageSize: 10,
    page: 1,
    publishStatusMap: {},
    type: '',
    keywords: '',
    status:'',
    rowKeys:[0],
  },
  effects: {
    *activityconfig({ payload }, { put, call, select }) {
      const config = yield call(activityconfig);
      yield put({
        type: 'updateActivity',
        payload: {
          publishStatusMap:config.data.goodsStatusMap,
        },
      });
    },
    * getConfig({
      payload
    }, { put, call, select }) {
      yield put({
        type: 'updateActivity',
        payload: {
          ...payload
        },
      });
      const {
        status,
        keywords,
        type,
        page,
        pageSize,
      } = yield select(state => state.activitySummary);
      try {
        const config = yield call(activityGoodsList, {
          keywords,
          type,
          page,
          pageSize,
          status,
        });
        config.data.actGoodsList.forEach((element, index) => {
          if (page == 1) {
            element.key = index + 1;
          } else {
            element.key = Number(page) * 10 + (index + 1);

          }

        });
        yield put({
          type: 'updateActivity',
          payload: {
            actGoodsList: config.data.actGoodsList,
            totalCount: config.data.totalCount,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
    * unfoldData({ payload }, {put, select }) {
      console.log(payload,'1')
     let eleIndex =0;
      let {
        activityList,
        actGoodsList,
        rowKeys,
      } = yield select(state => state.activitySummary);
      if (payload.expanded) {
        console.log('2')
        actGoodsList.forEach((element, index) => {
          if (payload.index == element.goodsId) {
            console.log('3')
            element.activityList.forEach((ele ) => {
              ele.key = eleIndex+1;
              activityList.push(ele)
            })
            rowKeys[0]=element.key;
          }
        });

      } else {
        console.log('4')
        eleIndex = 0;
        activityList = [];
        rowKeys=[0];
      }
     console.log(rowKeys,'5')
      yield put({
        type: 'updateActivity',
        payload: {
          activityList,
          rowKeys,
        },
      });
    },
  },
  reducers: {
    updateActivity(state, {
      payload
    }) {
      console.log(payload.rowKeys,'5555555')
      return {
        ...state,
        ...payload,
      };
    },
  },
}

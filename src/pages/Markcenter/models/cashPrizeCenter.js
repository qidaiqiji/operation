import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import {
    reqList,
} from '../services/cashPrizeCenter';
export default {
    namespace: 'cashPrizeCenter',
    state: {
        currentPage: 1,
        total: 40,
        list:[],
        tableLoading:false,
        pageSize:50,
        selectedRowIds:[],
        totalselectedRows:[],
    },

    effects: {
        *getList() {
            yield put({
                type: 'getListResolved',
                payload: {
                    ...payload,
                },
            });
            const {
                currentPage,
            } = yield select(state => state.cashPrizeCenter);
            try {
                const res = yield call(reqList, {
                    currentPage,              
                });

                yield put({
                    type: 'getListResolved',
                    payload: {
                        // goodsList: res.data.goods,
                        // total: res.data.total,
                        // isLoading: false,
                    },
                });
            } catch (error) {
                console.log(error);
            }
        },
        *unmount(_, { put }) {
            yield put({
                type: 'unmountReducer',
            });
        },

    },

    reducers: {
        updatePageRducer(state, { payload }) {
            console.log('payload', payload);
            return {
                ...state,
                ...payload,
            };
        },
        unmountReducer() {
            return {

            };
        },
    },
};

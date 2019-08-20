import { message, Notification } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqList, reqConfim, reqConfig } from '../services/activityPageList';

export default {
    namespace: 'activityPageList',

    state: {
        activityList: [],
        name: '',
        isOnAct: '',
        type: '',
        startAt: '',
        endAt: '',
        createTimeStart: '',
        createTimeEnd: '',
        currentPage: 1,
        pageSize: 40,
        operateTypeText: '',
        operateId: '',
        operateUrl: '',
        total:0,
        isOnActMap:{},
        typeMap:{},
        loading:false

    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload,
                    loading:true,
                }
            })
            const { name, isOnAct, type, startAt, endAt, createTimeStart, createTimeEnd, currentPage, pageSize } = yield select(state => state.activityPageList);
            try {
                const res = yield call(reqList, { name, isOnAct, type, startAt, endAt, createTimeStart, createTimeEnd, currentPage, pageSize });
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        activityList:res.data.list,
                        total:res.data.totalCount,
                        loading:false
                    }
                })
            } catch (err) {
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        loading:false
                    }
                })
                console.log(err)
            }
        },
        *getConfig({}, { put, call}) {
            try {
                const res = yield call(reqConfig);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                       ...res.data
                    }
                })
            } catch (err) {
                console.log(err)

            }
        },
        *confirmOperate({ payload }, { put, call, select }) {
            const { operateTypeText, operateId, operateUrl } = yield select(state => state.activityPageList);
            try {
                const res = yield call(reqConfim, operateUrl, { pageId: operateId });
                Notification.success({
                    message: res.msg
                })
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        showModal:false
                    }
                })
                yield put({
                    type:'getList'
                })

            } catch (err) {
                console.log(err)

            }
        }

    },
    reducers: {
        updatePageReducer(state, { payload }) {
            return { ...state, ...payload };
        },
        unmountReducer() {
            return {
                activityList: [],
                name: '',
                isOnAct: '',
                type: '',
                startAt: '',
                endAt: '',
                createTimeStart: '',
                createTimeEnd: '',
                currentPage: 1,
                pageSize: 40,
                operateTypeText: '',
                operateId: '',
                operateUrl: '',
                total:0,
                isOnActMap:{},
                typeMap:{},
                loading:false

            };
        },
    }

};

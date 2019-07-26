import { message, Notification } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqList, reqConfim } from '../services/activityPageList';

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

    },
    effects: {
        *getList({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload,
                }
            })
            const { name, isOnAct, type, startAt, endAt, createTimeStart, createTimeEnd } = yield select(state => state.activityPageList);
            console.log("111")
            try {
                const res = yield call(reqList, { name, isOnAct, type, startAt, endAt, createTimeStart, createTimeEnd });
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        //   activityList:res.data
                    }
                })
            } catch (err) {
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
            const { operateTypeText, operateId, operateUrl, } = yield select(state => state.activityPageList);
            try {
                const res = yield call(reqConfim, operateUrl, { id: operateId });
                Notification.success({
                    message: res.msg
                })

            } catch (err) {

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

            };
        },
    }

};

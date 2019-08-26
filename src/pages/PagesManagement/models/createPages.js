import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqSubmit, reqInfo, reqCorrect } from '../services/createPages';

export default {
    namespace: 'createPages',

    state: {
        name: "",
        onPlatform: ['onPC','onApplet'],
        remark: "",
        startAt: '',
        endAt: '',
        pageId: ''

    },
    effects: {
        *getDetail({ payload }, { put, call, select }) {
            try {
                const res = yield call(reqInfo, { ...payload })
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res.data,
                        ...payload,
                    }
                })

            } catch (err) {

            }

        },
        *submitInfo({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload
                }
            })
            const { startAt, endAt, pageId, name, onPlatform, remark, copy, edit, type } = yield select(state => state.createPages);
            try {
                const res = yield call(+edit ? reqCorrect : reqSubmit, pageId ? { name, onPlatform, remark, startAt, endAt, type, pageId } : { name, onPlatform, remark, startAt, endAt, type });
                type==1?router.push(`/pages-management/a-type-model/${type}/${res.data.id}/${edit}/${copy}`):router.push(`/pages-management/b-type-model/${type}/${res.data.id}/${edit}/${copy}`);    
            } catch (err) {
                console.log(err)
            }
        }
    },
    reducers: {
        updatePageReducer(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        unmountReducer() {
            return {
                name: "",
                onPlatform: ['onPC','onApplet'],
                remark: "",
                startAt: '',
                endAt: '',
                pageId: ''
            };
        },
    }

};

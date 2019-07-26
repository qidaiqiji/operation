import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqSubmit } from '../services/createPages';

export default {
    namespace: 'createPages',

    state: {
        name: "",
        onPlatform: '1',
        remark:"",
        startAt: moment().format('YYYY-MM-DD-ss'),
        endAt: moment().format('YYYY-MM-DD-ss')

    },
    effects: {
        *submitInfo({ payload }, { put, call, select }) {
            const { name, onPlatform, remark } = payload;
            const { startAt, endAt } = yield select(state => state.createPages);
            try {
                const res = yield call(reqSubmit, { name, onPlatform, remark, startAt, endAt });
                router.push(`/pages-management/a-type-model/${res.data.id}`)
            } catch (err) {

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
                onPlatform: '1',
                remark: "",
                startAt: "",
                endAt: ""

            };
        },
    }

};

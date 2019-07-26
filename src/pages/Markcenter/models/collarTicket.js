import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import {

  reqConfig,
} from '../services/collarTicket';
export default {
  namespace: 'collarTicket',
  state: {
    fileList: [],
    basicInfo: {},
    loading: false,
    files: [],
    activeKey: '1',
    ticketList: [],
    currentPage: '',
    countId: 0,
    previewVisible: false,
  },

  effects: {
    *onchangeAddTicket(_, { put, select }) {
      const { ticketList, newTicket, countId } = yield select(state => state.collarTicket);
      console.log('ticketList555', ticketList);
      yield put({
        type: 'updatePageRducer',
        payload: {
          ticketList: ticketList.concat({ id: countId + 1, tcode: '', jiang: '', stock: 0, }),
          countId: countId + 1,
        }
      });
    },
    *onchangeticketList({ payload }, { put, select }) {
      const { idDelete } = payload;
      const { ticketList } = yield select(state => state.collarTicket);
      console.log('idDelete', idDelete);
      let ticketListFliter = ticketList.filter(item => {
       return !(item.id == idDelete)
      })
      console.log('ticketListFliter', ticketListFliter);
      // ticketList.map((item)=>{     
      // if(item.id==idDelete){
      //     item.id=index;
      //   }

      //   // console.log(index);
      // })
      yield put({
        type: 'updatePageRducer',
        payload: {
          ticketList: ticketListFliter,
        }
      });
    },
    *unmount(_, { put }) {
      yield put({
        type: 'unmountReducer',
      });
    },
    // *updatePage({ payload }, { put }) {
    //   const { fileList } = payload;
    //   console.log('fileList666',fileList);
    //   if(fileList.thumbUrl==undefined){

    //     yield put({
    //       type: 'updatePageRducer',
    //     });
    //     yield put({
    //       type: 'updatePage',
    //       payload:{
    //         fileList,
    //       }
    //     });
    //   }else{
    //     yield put({
    //       type: 'updatePageRducer',
    //     });
    //   }


    // },
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

import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import {reqList} from '../services/aTypeModel';

export default {
  namespace: 'aTypeModel',

  state: {
    pcInfo:{
      isShowTrade:1,
      bgColor:"#fff",
      bgType:1,
      bgImg:"",
      guideText:"",
      articleId:"",
      banner:"",
      bannerLink:"",
      seo:"",
      desc:"",
      jsonInfo:[
        {
          type:1,
          goodsIdList:[]
        },
        {
          type:2,
          adList:[]
        },
      ]
    },
    xcxInfo:{
      isShowTrade:0,
      bgColor:"#fff",
      bgType:1,
      bgImg:"",
      guideText:"",
      articleId:"",
      banner:"",
      bannerLink:"",
      desc:"",
      jsonInfo:[
        {
          type:1,
          goodsIdList:[]
        },
        {
          type:2,
          adList:[]
        },
      ]
    },
    showGoodsModal:false,
    goodsList:[],
    currentIndex:'',
    activeKey:"pc",
  },
  effects: {
    *getList({ payload },{ put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload
        }
      })
      const { currentIndex, pcInfo } = yield select(state=>state.aTypeModel);
      
      try{
        const res = yield call(reqList);
        let goodsList = res.data.goods;
        pcInfo.jsonInfo[currentIndex].goodsIdList.map(item=>{
          goodsList.map(good=>{
            if(item.goodsId == good.goodsId) {
              good.disabled = true
            }
          })
        })
        yield put({
          type:'updatePageReducer',
          payload:{
            goodsList
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    // 保存的时候提交数据
    *submitInfo({ payload },{ put, call, select }) {
        yield put({
          type:'updatePageReducer',
          payload:{
            ...payload
          }
        })
        const { xcxInfo, pcInfo } = yield select(state=>state.aTypeModel);

        function checkIsSelected(data) {
          // if(data.)

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
        pcInfo:{
          isShowTrade:1,
          bgColor:"#fff",
          bgType:1,
          bgImg:"",
          guideText:"",
          articleId:"",
          banner:"",
          bannerLink:"",
          seo:"",
          desc:"",
          jsonInfo:[
            {
              type:1,
              goodsIdList:[]
            },
            {
              type:2,
              adList:[]
            },
          ]
        },
        showGoodsModal:false,
        goodsList:[],
        activeKey:"pc",
        
      };
    },
  }
    
};

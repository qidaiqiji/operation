import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqList, reqCreateSubmit, reqDetail, reqEditSubmit, reqConfig } from '../services/bTypeModel';
export default {
  namespace: 'bTypeModel',
  state: {
    pcInfo: {
      isShowTrade: 0,
      bgColor: "#dd3450",
      bgType: 1,
      bgImg: "",
      guideText: "",
      articleId: "",
      banner: "",
      bannerLink: "",
      seo: "",
      desc: "",
      jsonInfo: [
        {
          type: 1,
          goodsList: [],
          plus: true,
        },
        {
          type: 2,
          adList: [],
          plus: true,
        },
      ]
    },
    xcxInfo: {
      isShowTrade: 0,
      bgColor: "#dd3450",
      bgType: 1,
      bgImg: "",
      guideText: "",
      articleId: "",
      banner: "",
      bannerLink: "",
      desc: "",
      jsonInfo: [
        {
          type: 1,
          goodsList: [],
          plus: true,
        },
        {
          type: 2,
          adList: [],
          plus: true,
        },
      ]
    },
    showGoodsModal: false,
    goodsList: [],
    currentIndex: '',
    activeKey: "",
    onPlatform: [],
    currentPage: 1,
    pageSize: 10,
    showXcx: false,
    showPc: false,
    showConfirmModal: false,
    // 商品列表
    goodsSn: '',
    brandName: '',
    keywords: '',
    status: '',
    catId: '',
    edit:false,
    goodsStatusMap:{},
    categoryMap:{},
  },
  effects: {
    *getDetail({ payload }, { put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          cardLoading:true,
        }
      })
      try {
        const res = yield call(reqDetail, { ...payload });
        let pcInfo = res.data.pcInfo;
        let xcxInfo = res.data.xcxInfo;
        if(!pcInfo) {
          pcInfo={}
          pcInfo.desc = res.data.name;
          pcInfo.bgColor = '#dd3450';
        }
        if(!xcxInfo) {
          xcxInfo={}
          xcxInfo.bgColor = '#dd3450';
        }
        let tempPcInfo = pcInfo;
        let tempXcxInfo = xcxInfo;
        const onPlatform = res.data.onPlatform;
        let activeKey = "";
        let showPc = false;
        let showXcx = false;
        if (onPlatform.length < 2) {
          activeKey = onPlatform[0];
          if (onPlatform[0] == "onPC") {
            showPc = true;
            showXcx = false;
          } else {
            showPc = false;
            showXcx = true;
          }
        } else {
          showPc = true;
          showXcx = true;
        }
        activeKey = onPlatform.length == 2 ? "onPC" : activeKey;
        function checkHasJsonInfo(data) {
          if(data == []) {
            data = {}
          }
          data.isShowTrade=data.isShowTrade?data.isShowTrade:0;
          data.bgType=data.bgType?data.bgType:1;
          if(!data.jsonInfo) {
            data.jsonInfo = [];
          }
          let hasGoodsList = data.jsonInfo.some(item => item.type == 1);
          let hasAds = data.jsonInfo.some(item => item.type == 2);
          if (!hasGoodsList) {
            data.jsonInfo.push(
              {
                type: 1,
                goodsList: [],
                plus: true,
                isShowTitle:1,
                bgColor: "#dd3450",
              },
            )
          }
          if (!hasAds) {
            data.jsonInfo.push(
              {
                type: 2,
                adList: [],
                plus: true,
                isShowTitle:1,
                bgColor: "#dd3450",
              }
            )
          }
          return data;
        }
        checkHasJsonInfo(tempPcInfo);
        checkHasJsonInfo(tempXcxInfo);
        yield put({
          type: 'updatePageReducer',
          payload: {
            ...res.data,
            pcInfo: tempPcInfo,
            xcxInfo: tempXcxInfo,
            activeKey,
            showXcx,
            showPc,
            cardLoading:false,
          }
        })

      } catch (err) {
        yield put({
          type: 'updatePageReducer',
          payload: {
            cardLoading:false,
          }
        })
        console.log(err)
      }
    },
    *getConfig({ payload },{ put, call, select }) {
      try{
        const res = yield call(reqConfig);
        yield put({
          type:'updatePageReducer',
          payload:{
            goodsStatusMap:res.data.goodsStatusMap,
            categoryMap:res.data.categoryMap,
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    *getList({ payload }, { put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload
        }
      })
      const {
        currentIndex,
        pcInfo,
        xcxInfo,
        activeKey,
        currentPage,
        pageSize,
        keywords,
        brandName,
        status,
        catId,
        goodsSn,
      } = yield select(state => state.bTypeModel);
      try {
        const res = yield call(reqList, { currentPage, pageSize, keywords, brandName, status, catId, goodsSn });
        let goodsList = res.data.goods;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        tempInfoType.jsonInfo[currentIndex].goodsList.map(item => {
          goodsList.map(good => {
            if (item.goodsId == good.goodsId) {
              good.disabled = true
            }
          })
        })
        yield put({
          type: 'updatePageReducer',
          payload: {
            goodsList,
            total: res.data.total
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 保存的时候提交数据
    *submitInfo(_, { put, call, select }) {
      const { xcxInfo, pcInfo, activeKey, pageId, edit, showPc, showXcx } = yield select(state => state.bTypeModel);
      let temPcInfo = JSON.parse(JSON.stringify(pcInfo));
      let temxcxInfo = JSON.parse(JSON.stringify(xcxInfo));
      function checkIsSelected(data) {
        if(data == []) {
          data = {}
        }
        data.isCheckedGuide = data.isCheckedGuide?1:0;
        data.isCheckedBanner = data.isCheckedBanner?1:0;
        if (!data.isCheckedBanner) {
          data.banner = "";
          data.bannerLink = "";
        } 
        if (!data.isCheckedGuide) {
          data.guideText = "";
          data.articleId = "";
        }
        data.jsonInfo&&data.jsonInfo.map(item=>{
          item.isChecked=item.isChecked?1:0;
        })
        data.jsonInfo = data.jsonInfo&&data.jsonInfo.filter(item => {
          return item.isChecked == 1
        })
        return data;
      }
      let pcResult = checkIsSelected(temPcInfo);
      let xcxResult = checkIsSelected(temxcxInfo);
      function getIdList(data) {
        data.jsonInfo&&data.jsonInfo.map(item => {
          if (item.type == 1) {
            item.goodsIdList = [];
            item.goodsList.map(goods => {
              item.goodsIdList.push(goods.goodsId)
            })
          }
          if(item.titleImg == ""){
            item.titleImg = 0;
          }
          delete item.goodsList
        })
        return data;
      }
      getIdList(pcResult);
      getIdList(xcxResult);
      let finalPayload = {};
      if (showPc&&!showXcx) {
        finalPayload = { pcInfo: { ...pcResult }, pageId:+pageId, xcxInfo: [] }
      } else if (!showPc&&showXcx) {
        finalPayload = { pcInfo: [], pageId:+pageId, xcxInfo: { ...xcxResult } }
      } else{
        finalPayload = { pcInfo: { ...pcResult }, pageId:+pageId, xcxInfo: { ...xcxResult } }
      }
      console.log("finalPayload",finalPayload)
      if (+edit) {
        try {
          const res = yield call(reqEditSubmit, { ...finalPayload });
          if (res.code == 0) {
            router.push("/pages-management/activity-page-list")
          }
        } catch (err) {
          console.log("err", err)
        }
      } else {
        try {
          const res = yield call(reqCreateSubmit, { ...finalPayload });
          if (res.code == 0) {
            router.push("/pages-management/activity-page-list")
          }
        } catch (err) {
          console.log("err", err)
        }
      }

    },
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
        pcInfo: {
          isShowTrade: 0,
          bgColor: "",
          bgType: 1,
          bgImg: "",
          guideText: "",
          articleId: "",
          banner: "",
          bannerLink: "",
          seo: "",
          desc: "",
          jsonInfo: [
            {
              type: 1,
              goodsList: [],
              plus: true,
            },
            {
              type: 2,
              adList: [],
              plus: true,
            },
          ]
        },
        xcxInfo: {
          isShowTrade: 0,
          bgColor: "",
          bgType: 1,
          bgImg: "",
          guideText: "",
          articleId: "",
          banner: "",
          bannerLink: "",
          desc: "",
          jsonInfo: [
            {
              type: 1,
              goodsList: [],
              plus: true,
            },
            {
              type: 2,
              adList: [],
              plus: true,
            },
          ]
        },
        showGoodsModal: false,
        goodsList: [],
        currentIndex: '',
        activeKey: "",
        onPlatform: [],
        currentPage: 1,
        pageSize: 10,
        showXcx: false,
        showPc: false,
        showConfirmModal: false,
        // 商品列表
        goodsSn: '',
        brandName: '',
        keywords: '',
        status: '',
        catId: '',
        edit:false,
        goodsStatusMap:{},
        categoryMap:{},
        // cardLoading:false,
      };
    },
  }

}

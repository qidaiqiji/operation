import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { reqList, reqCreateSubmit, reqDetail, reqEditSubmit, reqConfig, reqCouponList, reqActList } from '../services/aTypeModel';
export default {
  namespace: 'aTypeModel',
  state: {
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
    // 优惠券列表
    createTimeStart: '',
    createTimeEnd: '',
    goodsRange: '',
    takeType: '',
    actStatus: '',
    publishStatus: '',
    couponCurPage: 1,
    couponPageSize: 10,
    // 特卖专场参数
    name: '',
    actCurPage: 1,
    actPageSize: 10,
    edit: false,
    goodsStatusMap: {},
    categoryMap: {},
    showConponModal: false,
    couponList: [],
    showPromotionModal: false,
    actPageList: [],
    tempModuleList: [],
    totalCount: 0,
  },
  effects: {
    *getDetail({ payload }, { put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload,
          cardLoading: true,
        }
      })
      try {
        const res = yield call(reqDetail, { ...payload });
        let pcInfo = res.data.pcInfo;
        let xcxInfo = res.data.xcxInfo;
        pcInfo.desc = res.data.name;
        pcInfo.bgColor = pcInfo.bgColor ? pcInfo.bgColor : '#dd3450';
        xcxInfo.bgColor = xcxInfo.bgColor ? xcxInfo.bgColor : '#dd3450';
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
          if (data == []) {
            data = {}
          }
          data.isShowTrade = data.isShowTrade ? data.isShowTrade : 0;
          data.bgType = data.bgType ? data.bgType : 1;
          data.allGoods = data.allGoods ? data.allGoods : { isShowTitle: 1, bgColor: '#dd3450' };
          data.adviceGoods = data.adviceGoods ? data.adviceGoods : { goodsList: [], isShowTitle: 1, bgColor: '#dd3450' };
          data.rightNav = data.rightNav ? data.rightNav : { ad: {}, moduleList: [] };
          if (!data.jsonInfo) {
            data.jsonInfo = [];
          }
          let hasGoodsList = data.jsonInfo.some(item => item.type == 1);
          let hasAds = data.jsonInfo.some(item => item.type == 2);
          let hasCoupon = data.jsonInfo.some(item => item.type == 3);
          let hasSecond = data.jsonInfo.some(item => item.type == 4);
          let hasPromotion = data.jsonInfo.some(item => item.type == 5);
          let hasJuHuaSuan = data.jsonInfo.some(item => item.type == 6);
          let hasPackage = data.jsonInfo.some(item => item.type == 7);
          let hasFullBack = data.jsonInfo.some(item => item.type == 8);
          if (!hasGoodsList) {
            data.jsonInfo.push(
              {
                type: 1,
                goodsList: [],
                plus: true,
                isShowTitle: 1,
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
                isShowTitle: 1,
                bgColor: "#dd3450",
              }
            )
          }
          // if (!hasCoupon) {
          //   data.jsonInfo.push(
          //     {
          //       type: 3,
          //       couponList: [],
          //       plus: true,
          //       isShowTitle: 1,
          //       bgColor: "#dd3450",
          //     }
          //   )
          // }
          if (!hasSecond) {
            data.jsonInfo.push(
              {
                type: 4,
                goodsList: [],
                isShowTitle: 1,
                bgColor: "#dd3450",
              }
            )
          }
          if (!hasPromotion) {
            data.jsonInfo.push(
              {
                type: 5,
                actPageList: [],
                isShowTitle: 1,
                bgColor: "#dd3450",
              }
            )
          }
          if (!hasJuHuaSuan) {
            data.jsonInfo.push(
              {
                type: 6,
                goodsList: [],
                isShowTitle: 1,
                bgColor: "#dd3450",
              }
            )
          }
          if (!hasPackage) {
            data.jsonInfo.push(
              {
                type: 7,
                goodsList: [],
                isShowTitle: 1,
                bgColor: "#dd3450",
              }
            )
          }
          if (!hasFullBack) {
            data.jsonInfo.push(
              {
                type: 8,
                goodsList: [],
                isShowTitle: 1,
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
            onPlatform: res.data.onPlatform,
            pcInfo: tempPcInfo,
            xcxInfo: tempXcxInfo,
            activeKey,
            showXcx,
            showPc,
            cardLoading: false,
          }
        })

      } catch (err) {
        yield put({
          type: 'updatePageReducer',
          payload: {
            cardLoading: false,
          }
        })
        console.log(err)
      }
    },
    *getConfig({ payload }, { put, call, select }) {
      try {
        const res = yield call(reqConfig);
        yield put({
          type: 'updatePageReducer',
          payload: {
            goodsStatusMap: res.data.goodsStatusMap,
            categoryMap: res.data.categoryMap,
          }
        })
      } catch (err) {
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
      } = yield select(state => state.aTypeModel);
      try {
        const res = yield call(reqList, { currentPage, pageSize, keywords, brandName, status, catId, goodsSn });
        let goodsList = res.data.goods;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        if (currentIndex != null) {
          tempInfoType.jsonInfo[currentIndex].goodsList.map(item => {
            goodsList.map(good => {
              if (item.goodsId == good.goodsId) {
                good.disabled = true
              }
            })
          })
        } else {
          tempInfoType.adviceGoods.goodsList.map(item => {
            goodsList.map(good => {
              if (item.goodsId == good.goodsId) {
                good.disabled = true
              }
            })
          })
        }
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
    // 获取优惠券列表
    *getCouponList({ payload }, { put, call, select }) {
      yield put({
        type: 'updatePageReducer',
        payload: {
          ...payload
        }
      })
      const {
        keywords,
        createTimeStart,
        createTimeEnd,
        goodsRange,
        takeType,
        actStatus,
        publishStatus,
        couponCurPage,
        couponPageSize,
      } = yield select(state => state.aTypeModel);
      try {
        const res = yield call(reqCouponList, {
          currentPage: couponCurPage,
          pageSize: couponPageSize,
          keywords,
          createTimeStart,
          createTimeEnd,
          goodsRange,
          takeType,
          actStatus,
          publishStatus
        });
        // let goodsList = res.data.goods;
        // let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        // if (currentIndex != null) {
        //   tempInfoType.jsonInfo[currentIndex].couponList.map(item => {
        //     goodsList.map(good => {
        //       if (item.goodsId == good.goodsId) {
        //         good.disabled = true
        //       }
        //     })
        //   })
        // } else {
        //   tempInfoType.adviceGoods.goodsList.map(item => {
        //     goodsList.map(good => {
        //       if (item.goodsId == good.goodsId) {
        //         good.disabled = true
        //       }
        //     })
        //   })
        // }
        yield put({
          type: 'updatePageReducer',
          payload: {
            // goodsList,
            // total: res.data.total
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 获取特卖专场列表
    *getActList({ payload }, { put, call, select }) {
      yield put({
        type:'updatePageReducer',
        payload:{
          ...payload,
        }
      })
      const {
        name,
        currentPage,
        pageSize,
        currentIndex,
        activeKey,
        pcInfo,
        xcxInfo,
      } = yield select(state => state.aTypeModel);
      try {
        const res = yield call(reqActList, {
          name,
          currentPage,
          pageSize,
        });
        let actPageList = res.data.actPageList;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        tempInfoType.jsonInfo[currentIndex].actPageList.map(item => {
          actPageList.map(act => {
            if (item.id == act.id) {
              act.disabled = true
            }
          })
        })
        yield put({
          type: 'updatePageReducer',
          payload: {
            actPageList,
            totalCount: res.data.totalCount
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 保存的时候提交数据
    *submitInfo(_, { put, call, select }) {
      const { xcxInfo, pcInfo, activeKey, pageId, edit, showPc, showXcx } = yield select(state => state.aTypeModel);
      let temPcInfo = JSON.parse(JSON.stringify(pcInfo));
      let temxcxInfo = JSON.parse(JSON.stringify(xcxInfo));
      function checkIsSelected(data) {
        if (data == []) {
          data = {}
        }
        data.isCheckedGuide = data.isCheckedGuide ? 1 : 0;
        data.isCheckedBanner = data.isCheckedBanner ? 1 : 0;
        if (!data.isCheckedBanner) {
          data.banner = "";
          data.bannerLink = "";
        }
        if (!data.isCheckedGuide) {
          data.guideText = "";
          data.articleId = "";
        }
        data.allGoods.isChecked = data.allGoods.isChecked ? 1 : 0;
        data.adviceGoods.isChecked = data.adviceGoods.isChecked ? 1 : 0;
        data.rightNav.isChecked = data.rightNav.isChecked ? 1 : 0;
        data.rightNav.moduleList.map(item => {
          item.isChecked = item.isChecked ? 1 : 0;
        })
        data.rightNav.ad.img = data.rightNav.ad.img ? data.rightNav.ad.img : 0;
        data.jsonInfo && data.jsonInfo.map(item => {
          item.isChecked = item.isChecked ? 1 : 0;
        })
        data.jsonInfo = data.jsonInfo && data.jsonInfo.filter(item => {
          return item.isChecked == 1
        })
        data.jsonInfo.map((item,index)=>{
          item.linkId=`div${index+1}`
        })
        data.rightNav.moduleList.map((item,index)=>{
          item.linkId=`div${index+1}`
        })
        return data;
      }
      let xcxResult = [];
      let pcResult = [];
      if (showPc && !showXcx) {
        pcResult = checkIsSelected(temPcInfo);
      } else if (showXcx && !showPc) {
        xcxResult = checkIsSelected(temxcxInfo);
      } else {
        pcResult = checkIsSelected(temPcInfo);
        xcxResult = checkIsSelected(temxcxInfo);
      }
      function getInfoList(data) {
        data.adviceGoods.goodsInfoList = [];
        data.adviceGoods.goodsList.map(item => (
          data.adviceGoods.goodsInfoList.push({ goodsId: item.goodsId, sortOrder: item.sortOrder?item.sortOrder:0 })
        ))
        delete data.adviceGoods.goodsList;
        if(data.allGoods.titleImg == ""){
          data.allGoods.titleImg = 0;
        }
        if(data.banner == ""){
          data.banner = 0;
        }
        if(data.bgImg == ""){
          data.bgImg = 0;
        }

        data.jsonInfo && data.jsonInfo.map(item => {
          if (item.type == 1 || item.type == 4 || item.type == 6 || item.type == 7 || item.type == 8) {
            item.goodsInfoList = [];
            item.goodsList.map(goods => {
              item.goodsInfoList.push({ goodsId: goods.goodsId, sortOrder: goods.sortOrder?goods.sortOrder:0 })
            })
            delete item.goodsList;
          }
          if (item.titleImg == "") {
            item.titleImg = 0;
          }
          if (item.type == 5) {
            item.actPageIdList = [];
            item.actPageList.map(act => {
              item.actPageIdList.push(act.id)
            })
            delete item.actPageList
          }
        })
        return data;
      }
      if (showPc && !showXcx) {
        getInfoList(pcResult);
      } else if (showXcx && !showPc) {
        getInfoList(xcxResult);
      } else {
        getInfoList(pcResult);
        getInfoList(xcxResult);
      }
      let finalPayload = {};
      if (showPc && !showXcx) {
        finalPayload = { pcInfo: { ...pcResult }, pageId: +pageId, xcxInfo: [] }
      } else if (!showPc && showXcx) {
        finalPayload = { pcInfo: [], pageId: +pageId, xcxInfo: { ...xcxResult } }
      } else {
        finalPayload = { pcInfo: { ...pcResult }, pageId: +pageId, xcxInfo: { ...xcxResult } }
      }
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
        // 优惠券列表
        createTimeStart: '',
        createTimeEnd: '',
        goodsRange: '',
        takeType: '',
        actStatus: '',
        publishStatus: '',
        couponCurPage: 1,
        couponPageSize: 10,
        // 特卖专场参数
        name: '',
        actCurPage: 1,
        actPageSize: 10,
        edit: false,
        goodsStatusMap: {},
        categoryMap: {},
        showConponModal: false,
        couponList: [],
        showPromotionModal: false,
        actPageList: [],
        tempModuleList: [],
        totalCount: 0,
      };
    },
  }

}

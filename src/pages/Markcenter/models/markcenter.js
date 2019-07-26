import { routerRedux } from 'dva/router';
import { message } from 'antd';
import router from 'umi/router';
import moment from 'moment';
// import { fakeSubmitForm } from '@/services/api';
import {
  reqDeleteActGoods,
  reqList,
  creatActivity,
  askActMes,
  askActGoodDetail,
  reqExcelInfo,
  updataActivity,
  reqConfig,
  creatPinTuan,
  reqCompositionList,
  reqGroupShopView,
  updateGroupShop,
  createMiaoShaGoods,
  reqGoodsActView,
  updateGoodsAct,
  createPinTuanGoods,
  reqGroupShopList,
  deleteGroupShop,
} from '../services/markcenter';
export default {
  namespace: 'markcenter',

  state: {
    isVisibleGoodsModal: false,
    basicInfo: {
      startAt: '',
      endAt: '',
      activityIdList: [],
      guideText: '',
      name: '',
      preAt: '',
      remark: '',
    },
    goodsList: [],
    selectedRowIds: [],
    selectedRows: [],
    totalselectedRows: [],
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    previewVisible: false,
    fileList: [],
    isLoading: true,
    previewImage: '',
    previewIconImage: '',
    isVisibleIconImgModal: false,
    isVisibleWarningModal: false,
    activeKey: '1',
    hasChosedGoods: [],
    keywords: '',
    goodsSn: '',
    isOnlyOnSale: 1,
    status: '',
    currentPage: 1,
    pageSize: 10,
    brandName: '',
    isZhiFa: '',
    hasChosedGoodscopy: '',
    conflictList:[],
    catId: '',
    id: '',
    // activityPeriod: '',
    activityStartTime: '',
    activityEndTime: '',
    timeLength: '',
    // actGoodsList: '',
    activityName: '',
    isVisibleSureXiajia: false,
    deleteId: '',
    total: '',
    currentGoodsIdUploadImg: '',
    joinType: '',
    goodsStatusMap: {},
    categoryMap: {},
    type: '',
    fileListIcon: [],
    imgs: [],
    isVisibleBannerImgModal: false,
    isVisibleExcelInfoModal: false,
    activityList: [],
    //这个字段是活动列表里复制功能定义的字段
    copy: '',
    isShowOverlayAct: false,
  },

  effects: {
    *getList({ payload }, { call, put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const {
        keywords,
        currentPage,
        pageSize,
        brandName,
        catId,
        isZhiFa,
        goodsSn,
        id,
        // isOnlyOnSale,
        status,
      } = yield select(state => state.markcenter);
      try {
        const res = yield call(reqList, {
          keywords,
          currentPage,
          pageSize,
          catId,
          isZhiFa,
          goodsSn,
          // isOnlyOnSale,
          status,
          brandName,
          activityId: id,
        });
        console.log(res, 'getList');
        let getAddGoodsList = res.data.goods
       let conflictList= getAddGoodsList.filter(item=>item.conflictList.length>0)
       console.log(conflictList,'conflictList')
        yield put({
          type: 'getListResolved',
          payload: {
            goodsList: res.data.goods,
            total: res.data.total,
            isLoading: false,
            conflictList
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *getConfig({ payload }, { call, put, select }) {
      try {
        const res = yield call(reqConfig, {});
          const { goodsStatusMap, categoryMap } = res.data && res.data;
        // const goodsStatusMap = { 0: '已下架', 1: '在售中' };
        // const categoryMap = { 796: '洗护沐', 797: '彩妆' };
        yield put({
          type: 'getListResolved',
          payload: {
            goodsStatusMap,
            categoryMap,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *changeClear({ payload }, { put }) {
      yield put({
        type: 'getListResolved',
        payload: {
          goodsSn: '',
          keywords: '',
          brandName: '',
          isZhiFa: '',
          status: '',
          catId: '',
        },
      });
      yield put({
        type: 'getList',
      });
    },
    *getGoodsListIcon({ payload }, { call, put, select }) {
      const { imgs, fileList } = payload;
      console.log(imgs, fileList, '3333');
      yield put({
        type: 'getListResolved',
        payload: {
          imgs,
          fileList,
        },
      });
    },
    *getGoodsListPicture({ payload }, { call, put, select }) {
      const { isVisibleIconImgModal } = payload;
      const {
        imgs,
        fileList,
        currentGoodsIdUploadImg,
        joinType,
        hasChosedGoods,
        totalselectedRows,
      } = yield select(state => state.markcenter);
      if (imgs != undefined && imgs.length != 0) {
        if (joinType == 'waitforJion') {
          totalselectedRows.map(item => {
            if (item.goodsId == currentGoodsIdUploadImg) {
              if (fileList.length == 0) {
                item.icon = '';
                item.iconUrl = '';
              } else {
                item.icon = imgs[0].imgId;
                item.iconUrl = imgs[0].url;
              }
            }
          });
        } else if (joinType == 'hasJoin') {
          hasChosedGoods.map(item => {
            if (item.goodsId == currentGoodsIdUploadImg) {
              if (fileList.length == 0) {
                item.icon = '';
                item.iconUrl = '';
              } else {
                item.icon = imgs[0].imgId;
                item.iconUrl = imgs[0].url;
              }
            }
          });
        }
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
            hasChosedGoods,
            isVisibleIconImgModal,
            fileList: [],
          },
        });
      } else {
        yield put({
          type: 'getListResolved',
          payload: {
            isVisibleIconImgModal,
            fileList: [],
          },
        });
      }
    },
    //删除商品图片
    *getListBannerDelete({ payload }, { call, put, select }) {
      console.log('jinxing dianji l ');
      const { currentDeleteId, joinType } = payload;
      const { hasChosedGoods, totalselectedRows, activeKey } = yield select(
        state => state.markcenter
      );
      if (activeKey == '1') {
        totalselectedRows.map(item => {
          if (item.goodsId == currentDeleteId) {
            item.showBanner = '';
            item.showBannerUrl = '';
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
            currentDeleteId: '',
          },
        });
      } else {
        hasChosedGoods.map(item => {
          if (item.goodsId == currentDeleteId) {
            item.showBanner = '';
            item.showBannerUrl = '';
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            hasChosedGoods,
            currentDeleteId: '',
          },
        });
      }
    },
    *getListIconDelete({ payload }, { call, put, select }) {
      const { currentDeleteId, joinType } = payload;
      const { hasChosedGoods, totalselectedRows } = yield select(state => state.markcenter);
      if (joinType == 'waitforJion') {
        totalselectedRows.map(item => {
          if (item.goodsId == currentDeleteId) {
            item.iconId = '';
            item.iconUrl = '';
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      }
      if (joinType == 'hasJoin') {
        hasChosedGoods.map(item => {
          if ((item.goodsId = currentDeleteId)) {
            item.iconId = '';
            item.iconUrl = '';
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            hasChosedGoods,
          },
        });
      }
    },
    *getExcelInfo({ payload }, { call, put, select }) {
      try {
        const res = yield call(reqExcelInfo, {});
      } catch (error) {
        console.log(error);
      }
    },
    *getExcelInfoModal({ payload }, { call, put, select }) {
      const { totalExcelChose } = payload;
      const { totalselectedRows } = yield select(state => state.markcenter);
      totalselectedRows.push(...totalExcelChose);
      // 去除excel和列表数据id重复的值
      let result = new Map();
      for (let i = 0; i < totalselectedRows.length; i++) {
        const row = totalselectedRows[i];
        if (!result.has([row.goodsId])) {
          result.set(row.goodsId, row);
        }
      }
      result = [...result.values()];
      // 去除excel和列表数据参数不一样的冲突
      result.map(item => {
        item.goodsNo = item.goodsNo || item.goodsSn;
        item.img = item.img || item.goodsImg;
        item.canUseNum = item.canUseNum || item.availableStock;
      });
      result.map(item => {
        if (item.actPrice != '') {
          item.actPriceDiscount = (
            (10 * parseFloat(item.actPrice)) /
            parseFloat(item.marketPrice)
          ).toFixed(2);
          item.actPriceReduce = (parseFloat(item.shopPrice) - parseFloat(item.actPrice)).toFixed(2);
        }
        item.isShow = 1
      });
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows: result,
          fileList: [],
        },
      });
    },
    // 将活动主图放入商品数组
    *getGoodsListPictureBanner({ payload }, { call, put, select }) {
      const { isVisibleBannerImgModal } = payload;
      const {
        imgs,
        currentGoodsIdUploadImg,
        joinType,
        hasChosedGoods,
        totalselectedRows,
        activeKey,
      } = yield select(state => state.markcenter);
      // if (imgs != undefined && imgs.length != 0) {
      //   if (activeKey == '1') {
      //     totalselectedRows.map(item => {
      //       if (item.goodsId == currentGoodsIdUploadImg) {
      //         item.showBanner = imgs[0].imgId;
      //         item.showBannerUrl = imgs[0].url;
      //       }
      //     });
      //   } else{
      //     hasChosedGoods.map(item => {
      //       if (item.goodsId == currentGoodsIdUploadImg) {
      //         item.showBanner = imgs[0].imgId;
      //         item.showBannerUrl = imgs[0].url;
      //       }
      //     });
      //   }
      //   yield put({
      //     type: 'getListResolved',
      //     payload: {
      //       totalselectedRows,
      //       hasChosedGoods,
      //       isVisibleBannerImgModal,
      //       fileList: [],
      //     },
      //   });
      // } else {
      if (activeKey == '1') {
        totalselectedRows.map(item => {
          if (item.goodsId == currentGoodsIdUploadImg) {
            item.showBanner = imgs[0].imgId;
            item.showBannerUrl = imgs[0].url;
          }
        });
      } else {
        hasChosedGoods.map(item => {
          if (item.goodsId == currentGoodsIdUploadImg) {
            item.showBanner = imgs[0].imgId;
            item.showBannerUrl = imgs[0].url;
          }
        });
      }
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
          hasChosedGoods,
          isVisibleBannerImgModal,
          fileList: [],
        },
      });
      // }
    },
    *getGoodsBannerPicture({ payload }, { call, put, select }) {
      const { imgs, currentGoodsIdUploadImg, joinType, isuploading } = payload;
      const { hasChosedGoods, totalselectedRows } = yield select(state => state.markcenter);

      if (joinType == 'waitforJion') {
        totalselectedRows.map(item => {
          if ((item.goodsId = currentGoodsIdUploadImg)) {
            item.showBanner = imgs.imgId;
            item.showBannerUrl = imgs[0].url;
            item.fileList = imgs;
          }
        });
      } else if (joinType == 'hasJoin') {
        hasChosedGoods.map(item => {
          if ((item.goodsId = currentGoodsIdUploadImg)) {
            item.showBanner = imgs.imgId;
            item.showBannerUrl = imgs.url;
            item.fileList = imgs;
          }
        });
      }
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
          hasChosedGoods,
        },
      });
    },
    *getListResolvedImg({ payload }, { call, put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
    },
    // 添加活动商品第三步
    *getActivityGoodsDetail({ payload }, { call, put, select }) {
      const { type, oldId, activityId } = payload;
      const { hasChosedGoods ,conflictList} = yield select(state => state.markcenter);
      try {
        let res = {};
        if (type == 3) {
          console.log('进入的是这里1');
          res = yield call(reqGroupShopList, {
            type,
            activityId: oldId ? oldId : activityId,
          });
        } else {
          console.log('进入的是这里2');
          res = yield call(askActGoodDetail, {
            type,
            activityId: oldId ? oldId : activityId,
          });
        }
        console.log(res, 'getActivityGoodsDetail');
        let goodsList = res.data.actGoodsList;
        let goodsListcopy = JSON.parse(JSON.stringify(res.data.actGoodsList));
        let dataListName = '';
        if (!!oldId) {
          dataListName = 'totalselectedRows';
        } else {
          dataListName = 'hasChosedGoods';
        }
        // let goodsListfilter = JSON.parse(JSON.stringify(res.data.actGoodsList));
        // 拷贝一份goodsListcopy，做已下架的可以下商品列表里再次添加，
        goodsList.map(item => {
          item.actPriceDiscount = (
            (10 * parseFloat(item.actPrice)) /
            parseFloat(item.marketPrice)
          ).toFixed(2);
          item.actPriceReduce = (parseFloat(item.shopPrice) - parseFloat(item.actPrice)).toFixed(2);
        });
        goodsListcopy = goodsListcopy.filter((item, index) => {
            return item.isOnAct == 1
        });
        yield put({
          type: 'getListResolved',
          payload: {
            // activityPeriod: res.data.activityPeriod,
            activityStartTime: res.data.activityStartTime,
            activityEndTime: res.data.activityEndTime,
            timeLength: res.data.timeLength,
            [dataListName]: goodsList,
            hasChosedGoodscopy: goodsListcopy,
            activityName: res.data.activityName,
            id: payload.activityId,
            type: payload.type,
            oldId: payload.oldId,
          },
        });
      } catch (erro) {
        console.log(erro);
      }
    },
    *getActivityDetail({ payload }, { call, put, select }) {
      const { activityId, type, copy } = payload;
      console.log(type);
      try {
        let res = {};
        if (type == 3) {
          res = yield call(reqGroupShopView, {
            activityId,
          });
        } else {
          res = yield call(reqGoodsActView, {
            activityId,
          });
        }
        yield put({
          type: 'getListResolved',
          payload: {
            basicInfo: res.data && res.data.activityInfo,
            activityStartTime: res.data && res.data.activityInfo.startAt,
            ...payload,
          },
        });
      } catch (erro) {
        console.log(erro);
      }
    },
    *getCompositionList({ payload }, { call, put, select }) {
      try {
        const res = yield call(reqCompositionList, {
          ...payload,
        });
        yield put({
          type: 'getListResolved',
          payload: {
            activityList: res.data,
          },
        });
      } catch (erro) {
        console.log(erro);
      }
    },

    //第一步新增活动
    *getActivityId({ payload }, { call, put, select }) {
      const { basicInfo } = payload;
      const { type, activityId, copy } = yield select(state => state.markcenter);
      basicInfo.startAt = moment(basicInfo.rangeTimePicker[0]).format('YYYY-MM-DD HH:mm:ss');
      basicInfo.endAt = moment(basicInfo.rangeTimePicker[1]).format('YYYY-MM-DD HH:mm:ss');
      console.log(basicInfo, 'basicInfo');
      basicInfo.type = type;
      delete basicInfo.rangeTimePicker;
      if (!!copy) {
        console.log('进入了复制项');
        let res = {};
        if (type == 3) {
          console.log('Jinru l 拼团');
          res = yield call(creatPinTuan, {
            ...basicInfo,
          });
        } else {
          res = yield call(creatActivity, {
            ...basicInfo,
          });
        }
        if (res.code == 0) {
          router.push(`/markCenter/step-form/confirm/${type}/${res.data.id}/${activityId}`);
        }
      } else {
        console.log('进入了正常项');
        if (activityId != undefined) {
          basicInfo.id = activityId;
          let res = {};
          if (type == 3) {
            res = yield call(updateGroupShop, {
              ...basicInfo,
            });
          } else {
            res = yield call(updateGoodsAct, {
              ...basicInfo,
            });
          }
          if (res.code == 0) {
            router.push(`/markCenter/step-form/confirm/${type}/${activityId}`);
          }
        } else {
          let res = {};
          if (type == 3) {
            res = yield call(creatPinTuan, {
              ...basicInfo,
            });
          } else {
            res = yield call(creatActivity, {
              ...basicInfo,
            });
          }
          yield put({
            type: 'getListResolved',
            payload: {
              id: res.data.id,
            },
          });
          if (res.code == 0) {
            router.push(`/markCenter/step-form/confirm/${type}/${res.data.id}`);
          }
        }
      }
    },
    // 第二步确认添加商品
    *createActiveGoods({ payload }, { call, put, select }) {
      console.log('chaungjian');
      const { type, id } = yield select(state => state.markcenter);
      try {
        if (type == 3) {
          const res = yield call(createPinTuanGoods, {
            ...payload,
          });
          if (res.code == 0) {
            router.push(`/markCenter/step-form/over/${type}/${id}`);
          }
        } else {
          const res = yield call(createMiaoShaGoods, {
            ...payload,
          });
          if (res.code == 0) {
            router.push(`/markCenter/step-form/over/${type}/${id}`);
          }
        }
        console.log(id, 'activityId');
      } catch (erro) {
        console.log(erro);
      }
    },
    *changeInputValue({ payload }, { put, select }) {
      const { keyName, keyValue, goodsIdChanged, addOrUpdate } = payload;
      const { totalselectedRows, hasChosedGoods } = yield select(state => state.markcenter);
      if (addOrUpdate == 'add') {
        totalselectedRows.map(item => {
          if (item.goodsId == goodsIdChanged) {
            item[keyName] = keyValue;
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      } else if (addOrUpdate == 'update') {
        hasChosedGoods.map(item => {
          if (item.goodsId == goodsIdChanged) {
            item[keyName] = keyValue;
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            hasChosedGoods,
          },
        });
      }
    },
    *changeInputValueLimit({ payload }, { put, select }) {
      const { keyName, keyValue, goodsIdChanged, addOrUpdate } = payload;
      const { totalselectedRows, hasChosedGoods } = yield select(state => state.markcenter);
      if (addOrUpdate == 'add') {
        totalselectedRows.map(item => {
          if (item.goodsId == goodsIdChanged) {
            if (keyValue <= item.canUseNum) {
              item[keyName] = keyValue;
            } else {
              message.warning('数量均不可大于可用库存！');
              item[keyName] = item.canUseNum;
            }
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      } else if (addOrUpdate == 'update') {
        hasChosedGoods.map(item => {
          if (item.goodsId == goodsIdChanged) {
            if (keyValue <= item.availableStock) {
              item[keyName] = keyValue;
            } else {
              message.warning('数量均不可大于可用库存！');
              item[keyName] = item.availableStock;
            }
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            hasChosedGoods,
          },
        });
      }
    },
    *changePrice({ payload }, { put, select }) {
      const { keyName, keyValue, goodsIdChanged, addOrUpdate } = payload;
      const { totalselectedRows, hasChosedGoods } = yield select(state => state.markcenter);

      (addOrUpdate == 'add' ? totalselectedRows : hasChosedGoods).map(item => {
        // item.marketPrice零售价，shopPrice平台价，actPriceDiscount折扣，
        if (item.goodsId == goodsIdChanged) {
          if (keyValue == '') {
            item.actPrice = '';
            item.actPriceDiscount = '';
            item.actPriceReduce = '';
          } else {
            let BASE_MULTIPLE = 10
            if (keyName == 'actPriceDiscount') {
              item.actPrice = (parseFloat(item.marketPrice) * (parseFloat(keyValue)/BASE_MULTIPLE)).toFixed(
                2
              );
              item.actPriceDiscount = parseFloat(keyValue);
              item.actPriceReduce = (
                parseFloat(item.shopPrice) - parseFloat(item.actPrice)
              ).toFixed(2);
            } else if (keyName == 'actPriceReduce') {
              item.actPrice = (parseFloat(item.shopPrice) - parseFloat(keyValue)).toFixed(2);
              item.actPriceDiscount = (
                (BASE_MULTIPLE * parseFloat(item.actPrice)) /
                parseFloat(item.marketPrice)
              ).toFixed(2);
              item.actPriceReduce = parseFloat(keyValue).toFixed(2);
            } else if (keyName == 'actPrice') {
              item.actPrice = parseFloat(keyValue).toFixed(2);
              item.actPriceDiscount = (
                (BASE_MULTIPLE * parseFloat(item.actPrice)) /
                parseFloat(item.marketPrice)
              ).toFixed(2);
              item.actPriceReduce = (
                parseFloat(item.shopPrice) - parseFloat(item.actPrice)
              ).toFixed(2);
            }
          }
        }
      });
      console.log(totalselectedRows,'totalselectedRows',hasChosedGoods,'hasChosedGoods')
      if (addOrUpdate == 'add') {
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      } else {
        yield put({
          type: 'getListResolved',
          payload: {
            hasChosedGoods,
          },
        });
      }
    },

    *checkGoodsActivity({ payload }, { call, put, select }) {
      const { totalselectedRows, isVisibleWarningModal } = yield select(state => state.markcenter);
      // let listIsOk = false;
      // 先暂时注释掉
      let listIsOk = totalselectedRows.some(item => {
        return (
          item.goodsTitle == '' ||
          item.desc == '' ||
          item.actPrice == '' ||
          item.limitNum == '' ||
          item.matchNum == ''
        );
      });
      if (listIsOk != true) {
        yield put({
          type: 'getListResolved',
          payload: {
            isVisibleWarningModal: true,
          },
        });
      } else {
        message.warning('请完善必填信息');
      }
    },
    //删除商品操作
    *changeTotalSelectGoods({ payload }, { put, select, call }) {
      const { deleteChosedGoodsId } = payload;
      const { totalselectedRows, activeKey, hasChosedGoods, type } = yield select(
        state => state.markcenter
      );
      if (activeKey == 1) {
        totalselectedRows.map((item, index, self) => {
          if (item.goodsId == deleteChosedGoodsId) {
            self.splice(index, 1);
          }
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      } else {
        let actGoodsId = '';
        hasChosedGoods.map((item, index, self) => {
          if (item.goodsId == deleteChosedGoodsId) {
            self.splice(index, 1);
            actGoodsId = item.actGoodsId;
          }
        });
        yield put({
          type: 'reqDeleteGoods',
          payload: {
            actGoodsId: actGoodsId,
          },
        });
        yield put({
          type: 'getListResolved',
          payload: {
            totalselectedRows,
          },
        });
      }
    },
    *reqDeleteGoods({ payload }, { call, put, select }) {
      const { type } = yield select(state => state.markcenter);
      try {
        if (type == 3) {
          const res = yield call(deleteGroupShop, { ...payload });
        } else {
          const res = yield call(reqDeleteActGoods, { ...payload });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // *changeHasJoinGoods({ payload }, { call, put, select }) {
    //   const { id, deleteId, type } = yield select(state => state.markcenter);
    //   try {
    //     const res = yield call(reqDeleteActGoods, {
    //       actId: deleteId,
    //     });
    //     if (res.msg == '删除成功') {
    //       yield put({
    //         type: 'getActivityGoodsDetail',
    //         payload: {
    //           activityId: id,
    //           type,
    //         },
    //       });
    //       yield put({
    //         type: 'getListResolved',
    //         payload: {
    //           activeKey: 2,
    //           isVisibleSureXiajia: false,
    //         },
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    *changeProvideRows({ payload }, { put, select }) {
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const { selectedRowIds, selectedRows } = payload;
      const { totalselectedRows } = yield select(state => state.markcenter);
      let temp_selectedRows = selectedRows.map(item=>{
        item.isShow = 1
        return item
      })
      totalselectedRows.push(...temp_selectedRows);
      // totalselectedRows.map(item => {
      //   item.goodsTitle = '';
      //   item.desc = '';
      //   item.actPriceDiscount = '';
      //   item.actPriceReduce = '';
      //   item.actPrice = '';
      //   item.limitNum = '';
      //   item.matchNum = '';
      //   item.isHot = false;
      //   item.sortOrder = '';
      //   item.startNum = '';
      //   item.numberPerBox = '';
      //   item.buyByBox = '';
      // });
      yield put({
        type: 'getListResolved',
        payload: {
          totalselectedRows,
          selectedRowIds: [],
          selectedRows: [],
          // selectedRowIds,
          // selectedRows,
        },
      });
    },

    // 确定发布
    *changeActivity({ payload }, { call, put, select }) {
      console.log('888');
      yield put({
        type: 'getListResolved',
        payload: {
          ...payload,
        },
      });
      const { totalselectedRows, id, hasChosedGoods, type } = yield select(
        state => state.markcenter
      );
      try {
        const res = yield call(updataActivity, {
          addItems: totalselectedRows,
          activityId: id,
          updateItems: hasChosedGoods,
        });
        if (res.code == 0) {
          router.push(`/markCenter/step-form/over/${type}/${id}`);
        }
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
    getListResolved(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    unmountReducer() {
      return {
        isVisibleGoodsModal: false,
        basicInfo: {
          startAt: '',
          endAt: '',
          activityIdList: [],
          guideText: '',
          name: '',
          preAt: '',
          remark: '',
        },
        goodsList: [],
        selectedRowIds: [],
        selectedRows: [],
        totalselectedRows: [],
        days: '',
        hours: '',
        minutes: '',
        seconds: '',
        previewVisible: false,
        fileList: [],
        previewImage: '',
        previewIconImage: '',
        isVisibleIconImgModal: false,
        isVisibleWarningModal: false,
        activeKey: '1',
        hasChosedGoods: [],
        conflictList:[],
        id: '',
        activityPeriod: '',
        timeLength: '',
        activityName: '',
        activityStartTime: '',
        fileListIcon: [],
        activityEndTime: '',
        isVisibleSureXiajia: false,
        deleteId: '',
        total: '',
        currentPage: 1,
        pageSize: 10,
        currentGoodsIdUploadImg: '',
        isLoading: true,
        joinType: '',
        goodsStatusMap: {},
        categoryMap: {},
        type: '',
        imgs: [],
        isVisibleBannerImgModal: false,
        isVisibleExcelInfoModal: false,
        activityList: [],
        //这个字段是活动列表里复制功能定义的字段
        copy: '',
        isShowOverlayAct: false,
      };
    },
  },
};

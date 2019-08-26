import { message,Notification } from 'antd';
import router from 'umi/router';
import { reqList, reqPageConfig, reqCreate, reqDetail, reqConfig } from '../services/homePage';
import uniqBy from 'lodash/uniqBy';

export default {
    namespace: 'homePage',

    state: {
        goodsStatusMap: {},
        categoryMap: {},
        diamondItemMap: {},
        firstClassCatMap: {},

        infoDetail: {
            baseInfo: {

            },
            // PC导航栏
            navInfo: [
                {
                    title: "",
                    sortOrder: "",
                    link: "",
                }
            ],
            //Pc左侧分栏
            leftCategory: [
                {
                    mainCategory: {
                        title: "",
                        catId: "",
                        sortOrder: "",
                    },
                    childCategory: [
                        {
                            title: "",
                            link: "",
                            sortOrder: "",
                            isShow: 1,
                        }
                    ]
                }
            ],
            diamondInfo: [],
            porcelainInfo: [{
                isShowBtn: false,
            }],
            channelInfo: {
                pcNum: "3",
                xcxNum: "3",
                info: [
                    {
                        goodsList: []
                    }

                ]
            },
            actPageInfo: {
                pcNum: "3",
                xcxNum: "3"
            },
            goodsCollectInfo: {
                pcNum: "3",
                xcxNum: "3"
            }
        },
        keywords: "",
        brandName: "",
        currentPage: 1,
        pageSize: 10,
        status: "",
        goodsList: [],
        showGoodsModal: false,
        isShowUploadSucaiModal: false,
        cardLoading: false,
    },
    effects: {
        *getDetail({ payload }, { put, call, select }) {
            yield put({
                type:'updatePageReducer',
                payload:{
                    cardLoading:true
                }
            })
            try {
                const res = yield call(reqDetail)
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        infoDetail: res.data,
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

            }
        },
        *onChangeValue({ payload }, { put, select }) {
            const { allValue } = payload;
            const { infoDetail } = yield select(state => state.homePage);
            let tempAllValue = JSON.parse(JSON.stringify(allValue));
            let tempInfoDetail = JSON.parse(JSON.stringify(infoDetail));
            function reSortValue(info) {
                Object.keys(info).map(item => {
                    if (info[item].constructor == Object) {
                        Object.keys(info[item]).map(subItem => {
                            if (info[item][subItem].constructor == Array) {
                                tempAllValue[item][subItem].map((perItem, index) => {
                                    tempAllValue[item][subItem][index] = { ...info[item][subItem][index], ...perItem }
                                })
                            } else {
                                tempAllValue[item] = { ...info[item], ...tempAllValue[item] }
                            }
                        })
                    } else if (item == "diamondInfo" || item == "porcelainInfo") {
                        info[item].map((subItme, index) => {
                            tempAllValue[item][index] = { ...subItme, ...tempAllValue[item][index] }
                        })
                    }
                })
                return tempAllValue;
            }
            reSortValue(infoDetail)
            yield put({
                type: 'updatePageReducer',
                payload: {
                    infoDetail: tempAllValue
                }
            })

        },
        *getList({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload
                }
            })
            const { keywords, brandName, currentPage, pageSize, status, infoDetail, currentIndex } = yield select(state => state.homePage)
            try {
                const res = yield call(reqList, { keywords, brandName, currentPage, pageSize, status });
                let goodsList = res.data.goods;
                infoDetail.channelInfo.info[currentIndex].goodsList.map(item => {
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
                        total: res.data.total,
                    }
                })
            } catch (err) {
                console.log(err)
            }
        },
        *getConfig({ payload }, { put, call, select, all }) {
            try {
                const [res, config] = yield all([call(reqPageConfig), call(reqConfig)]);
                yield put({
                    type: 'updatePageReducer',
                    payload: {
                        ...res.data,
                        goodsStatusMap: config.data.goodsStatusMap,
                        categoryMap: config.data.categoryMap,
                    }
                })
            } catch (err) {
                console.log(err)
            }
        },
        *submitInfo({ payload }, { put, call, select }) {
            yield put({
                type: 'updatePageReducer',
                payload: {
                    ...payload
                }
            })
            const { infoDetail, edit } = yield select(state => state.homePage);
            let tempInfoDetail = JSON.parse(JSON.stringify(infoDetail));
            infoDetail.diamondInfo.map(item => {
                item.img = item.img == "" || item.img == undefined ? 0 : item.img;
                item.id = item.id == "" ? 0 : item.id;
            })
            let tempArray = infoDetail.diamondInfo.filter(item => item.id);
            let tempDiamondInfo = uniqBy(tempArray, 'id');
            if (tempDiamondInfo.length < tempArray.length) {
                message.error("金刚区标题不能重复");
                return;
            }
            infoDetail.channelInfo.info.map(item => {
                item.goodsIdList = [];
                item.goodsList.map(subItem => {
                    item.goodsIdList.push(subItem.goodsId)
                })
                delete item.goodsList
            })
            infoDetail.porcelainInfo.map(item => {
                delete item.isShowBtn
            })
            delete infoDetail.baseInfo.logoUrl;
            try {
                const res = yield call(reqCreate, { ...infoDetail });
                if(res.code == 0){
                    Notification.success({
                        message:res.msg
                    })
                    router.push("/pages-management/create-card")
                }
            } catch (err) {
                console.log(err)
                yield put({
                    type:'updatePageReducer',
                    payload:{
                        infoDetail:tempInfoDetail
                    }
                })
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
                goodsStatusMap: {},
                categoryMap: {},
                diamondItemMap: {},
                firstClassCatMap: {},
                infoDetail: {
                    baseInfo: {

                    },
                    // PC导航栏
                    navInfo: [
                        {
                            title: "",
                            sortOrder: "",
                            link: "",
                        }
                    ],
                    //Pc左侧分栏
                    leftCategory: [
                        {
                            mainCategory: {
                                title: "",
                                catId: "",
                                sortOrder: "",
                            },
                            childCategory: [
                                {
                                    title: "",
                                    link: "",
                                    sortOrder: "",
                                    isShow: 1,
                                }
                            ]
                        }
                    ],
                    diamondInfo: [],
                    porcelainInfo: [{
                        isShowBtn: false,
                    }],
                    channelInfo: {
                        pcNum: "3",
                        xcxNum: "3",
                        info: [
                            {
                                goodsList: []
                            }

                        ]
                    },
                    actPageInfo: {
                        pcNum: "3",
                        xcxNum: "3"
                    },
                    goodsCollectInfo: {
                        pcNum: "3",
                        xcxNum: "3"
                    }
                },
                keywords: "",
                brandName: "",
                currentPage: 1,
                pageSize: 10,
                status: "",
                goodsList: [],
                showGoodsModal: false,
                isShowUploadSucaiModal: false,
                cardLoading: false,
            };
        },
    }

};

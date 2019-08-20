import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Input, Button, Table, Pagination, Select, Form, Tabs, Modal, message } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CommonPart from './ACommonPart';
import AddGoodsModal from '@/components/AddGoodsModal';
import AddCouponModal from '@/components/AddCouponModal';
import AddActModal from './AddActModal';
import globalStyles from '@/global.less';
import ManualUpload from '@/components/ManualUpload';
import PostPicture from '@/components/PostPicture';
@connect(({ aTypeModel, loading, resourcePool }) => ({
    aTypeModel,
    resourcePool,
    loading: loading.effects['aTypeModel/getList'],
}))
class ATypeModel extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const { type, id, copy, edit, oldId } = this.props.match.params;
        dispatch({
            type: 'aTypeModel/getDetail',
            payload: {
                pageId: id,
                edit,
                copy,
                type,
                getDetailId:oldId
                
            }
        })
        dispatch({
            type: 'aTypeModel/getConfig',
        })
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/unmountReducer',
        })
    }
    handleAdd = (type, currentIndex, reset, e) => {
        e.stopPropagation();
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        function addItem(type, data) {
            if (type == 1) {
                data.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    goodsList: [],
                    isShowTitle: 1,
                    bgColor: '#dd3450'
                })
            } else if (type == 2) {
                data.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    adList: [],
                    isShowTitle: 1,
                    bgColor: '#dd3450'
                })
            }
        }
        if (activeKey == "onPC") {
            addItem(type, pcInfo);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                }
            })
        } else {
            addItem(type, xcxInfo)
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo,
                }
            })
        }
        reset();
    }
    handleReduce = (currentIndex, reset, e) => {
        e.stopPropagation();
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        if (activeKey == "onPC") {
            pcInfo.jsonInfo.splice(currentIndex, 1);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                }
            })
        } else {
            xcxInfo.jsonInfo.splice(currentIndex, 1);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo,
                }
            })
        }
        reset();
    }
    handleShowItem = (type, currentIndex) => {
        const { dispatch } = this.props;
        const payload = {
            currentIndex,
            currentPage: 1,
            pageSize: 10,
        }
        switch (type) {
            case 'goods':
                dispatch({
                    type: 'aTypeModel/getList',
                    payload: {
                        ...payload,
                        keywords: "",
                        brandName: "",
                        status: "",
                        catId: "",
                        goodsSn: "",
                        showGoodsModal: true,

                    }
                })
                break;
            case 'coupon':
                dispatch({
                    type: 'aTypeModel/getCouponList',
                    payload: {
                        ...payload,
                        showConponModal:true,
                    }
                })
                break;
            case 'act':
                dispatch({
                    type: 'aTypeModel/getActList',
                    payload: {
                        ...payload,
                        name:"",
                        showPromotionModal:true,

                    }
                })
                break;
        }
    }
    handleAddItems = (type, selectedRows) => {
        const { dispatch, aTypeModel } = this.props;
        const { currentIndex, pcInfo, xcxInfo, activeKey } = aTypeModel;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        if (currentIndex != null) {
            switch (type) {
                case 'goods':
                    tempInfoType.jsonInfo[currentIndex].goodsList.push(...selectedRows);
                    break;
                case 'coupon':
                    tempInfoType.jsonInfo[currentIndex].couponList.push(...selectedRows);
                    break;
                case 'act':
                    tempInfoType.jsonInfo[currentIndex].actPageList.push(...selectedRows);
                    break;
            }
        } else {
            // 如果没传Index，说明是商品推荐
            tempInfoType.adviceGoods.goodsList.push(...selectedRows);
        }
        if (activeKey == "onPC") {
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    showGoodsModal: false,
                    showConponModal: false,
                    showPromotionModal: false,
                    pcInfo: tempInfoType,
                }
            })
        } else {
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    showGoodsModal: false,
                    showConponModal: false,
                    showPromotionModal: false,
                    xcxInfo: tempInfoType,
                }
            })
        }
    }
    handleCloseModal = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                [type]: false,
            }
        })
    }
    handleDelete = (currentIndex, goodsId) => {
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo
        if (currentIndex != null) {
            tempInfoType.jsonInfo[currentIndex].goodsList.map((item, index) => {
                if (goodsId === item.goodsId) {
                    tempInfoType.jsonInfo[currentIndex].goodsList.splice(index, 1)
                }
            })
        } else {
            tempInfoType.adviceGoods.goodsList.map((item, index) => {
                if (goodsId === item.goodsId) {
                    tempInfoType.adviceGoods.goodsList.splice(index, 1)
                }
            })
        }
        if (activeKey == "onPC") {
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo: tempInfoType,
                }
            })
        } else {
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo: tempInfoType,
                }
            })
        }
    }
    handleSubmit = () => {
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        const tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        let extraLength = tempInfoType.rightNav.moduleList.some(item=>item.newTitle&&item.newTitle.length>4)
        if(extraLength) {
            message.warning("右侧导航标题最长4字");
            return;
        }
        dispatch({
            type: 'aTypeModel/submitInfo',
        })
    }
    handleUpload = (type, currentIndex, file) => {
        const { status, response } = file.file;
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        function upload(info) {
            switch (type) {
                case 'bgImg':
                    info['bgImg'] = response.data.imgs[0].imgId;
                    info['bgImgUrl'] = response.data.imgs[0].url;
                    break;
                case "banner":
                    info['banner'] = response.data.imgs[0].imgId;
                    break;
                case 'titleImg':
                    if (currentIndex != null) {
                        info.jsonInfo[currentIndex]['titleImg'] = response.data.imgs[0].imgId;
                        info.jsonInfo[currentIndex]['titleImgUrl'] = response.data.imgs[0].url;
                        break
                    } else {
                        info.allGoods['titleImg'] = response.data.imgs[0].imgId;
                        info.allGoods['titleImgUrl'] = response.data.imgs[0].url;
                        break
                    }
                case 'adList':
                    info.jsonInfo[currentIndex]['adList'].push({ ad: response.data.imgs[0].imgId, adUrl: response.data.imgs[0].url });
                    break;
                case 'navImg':
                    info.rightNav.ad.img = response.data.imgs[0].imgId;
                    info.rightNav.ad.imgUrl = response.data.imgs[0].url;
                    break;
            }
        }
        if (status === 'done') {
            if (activeKey == "onPC") {
                upload(pcInfo)
                dispatch({
                    type: 'aTypeModel/updatePageReducer',
                    payload: {
                        pcInfo,
                    },
                });
            } else {
                upload(xcxInfo)
                dispatch({
                    type: 'aTypeModel/updatePageReducer',
                    payload: {
                        xcxInfo
                    },
                });
            }
        } else if (status === 'error') {
            message.error({
                message: '上传文件失败，请稍候重试',
            });
        }
    }
    handleRemove = (imgType, currentIndex, imgIndex) => {
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        function remove(info) {
            switch (imgType) {
                case 'bgImg':
                    info['bgImg'] = '';
                    info['bgImgUrl'] = '';
                    break;
                case "banner":
                    info['banner'] = '';
                    info['bannerLink'] = '';
                    info['bannerUrl'] = '';
                    break;
                case 'titleImg':
                    if (currentIndex != null) {
                        info.jsonInfo[currentIndex]['titleImg'] = '';
                        info.jsonInfo[currentIndex]['titleImgUrl'] = '';
                    } else {
                        info.allGoods.titleImg = '';
                        info.allGoods.titleImgUrl = '';
                    }
                    break;
                case 'adList':
                    info.jsonInfo[currentIndex]['adList'].splice(imgIndex, 1);
                    break;
                case 'navImg':
                    info.rightNav.ad['img'] = '';
                    info.rightNav.ad['imgUrl'] = '';
                    break;
            }
        }
        if (activeKey == "onPC") {
            remove(pcInfo)
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            remove(xcxInfo)
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    handleChangeTabs = (activeKey) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                activeKey,
            }
        })
    }
    handleChangeColor = (currentIndex, type, e) => {
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        if (activeKey == "onPC") {
            if (currentIndex) {
                pcInfo.jsonInfo[currentIndex].bgColor = e.target.value;
            } else {
                if(type=="backGround"){
                    pcInfo.bgColor = e.target.value;
                }else{
                    pcInfo.allGoods.bgColor = e.target.value;
                }
                
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            if (currentIndex) {
                xcxInfo.jsonInfo[currentIndex].bgColor = e.target.value;
            } else {
                if(type=="backGround"){
                    xcxInfo.bgColor = e.target.value;
                }else{
                    xcxInfo.allGoods.bgColor = e.target.value;
                }
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    handleResourceUpload = (imgType, choseNum, currentIndex) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                isShowUploadSucaiModal: true,
                choseNum,
                imgType,
                currentIndex,
            }
        })
    }
    handleConfirmSelectPic = () => {
        const { dispatch, resourcePool, aTypeModel } = this.props;
        const { selectedPictureList } = resourcePool;
        const { imgType, activeKey, currentIndex, pcInfo, xcxInfo } = aTypeModel;
        function resourceUpload(info) {
            const tempImgResult = [];
            const adList = [];
            selectedPictureList.map(item => {
                tempImgResult.push({ imgId: item.imgId, url: item.url })
                adList.push({ ad: item.imgId, adUrl: item.url })
            })
            switch (imgType) {
                case 'bgImg':
                    info['bgImg'] = tempImgResult[0].imgId;
                    info['bgImgUrl'] = tempImgResult[0].url;
                    break;
                case "banner":
                    info['banner'] = tempImgResult[0].imgId;
                    info['bannerUrl'] = tempImgResult[0].url;
                    break;
                case 'titleImg':
                    if (currentIndex != null) {
                        info.jsonInfo[currentIndex]['titleImg'] = tempImgResult[0].imgId;
                        info.jsonInfo[currentIndex]['titleImgUrl'] = tempImgResult[0].url;
                        break
                    } else {
                        info.allGoods['titleImg'] = tempImgResult[0].imgId;
                        info.allGoods['titleImgUrl'] = tempImgResult[0].url;
                        break
                    }
                case 'adList':
                    info.jsonInfo[currentIndex]['adList'].push(...adList);
                    break;
                case 'navImg':
                    info.rightNav.ad.img = tempImgResult[0].imgId;;
                    info.rightNav.ad.imgUrl = tempImgResult[0].url;;
                    break
            }
            return info;
        }
        if (activeKey == "onPC") {
            resourceUpload(pcInfo);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    isShowUploadSucaiModal: false,
                    pcInfo
                }
            })
        } else {
            resourceUpload(xcxInfo);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    isShowUploadSucaiModal: false,
                    xcxInfo
                }
            })
        }
        dispatch({
            type: 'resourcePool/clearChosedList',
        })
    }
    handlePreview = (imgUrl) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                previewModal: true,
                imgUrl,
            }
        })
    }
    handleChangeOrder = (type, index, reset, e) => {
        e.stopPropagation();
        const { dispatch, aTypeModel } = this.props;
        const { xcxInfo, activeKey, pcInfo, } = aTypeModel;
        function changeItem(arr, index, newIndex, type) {
            if (type == "forward" && index == 0) {
                message.error("已经是第一个了");
                return;
            } else if (type == "back" && index == arr.length - 1) {
                message.error("已经是最后一个了");
                return;
            }
            arr[index] = arr.splice(newIndex, 1, arr[index])[0];
            return arr;
        }

        if (activeKey == "onPC") {
            if (type == "forward") {
                changeItem(pcInfo.jsonInfo, index, index - 1, type);
            } else {
                changeItem(pcInfo.jsonInfo, index, index + 1, type);
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            if (type == "forward") {
                changeItem(xcxInfo.jsonInfo, index, index - 1, type);
            } else {
                changeItem(xcxInfo.jsonInfo, index, index + 1, type);
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
        reset();
    }
    handleChangeValue = (allValue) => {
        let tempAllValue = JSON.parse(JSON.stringify(allValue));
        const { dispatch, aTypeModel } = this.props;
        const { activeKey, xcxInfo, pcInfo } = aTypeModel;
        let tempPcInfo = JSON.parse(JSON.stringify(pcInfo));
        let tempXcxInfo = JSON.parse(JSON.stringify(xcxInfo));
        function reSortValue(info, tempinfo) {
            Object.keys(info).map(item => {
                if (info[item].constructor == Object) {
                    Object.keys(info[item]).map(subItem => {
                        if (info[item][subItem].constructor == Object) {
                            tempAllValue[item][subItem] = { ...info[item][subItem], ...tempAllValue[item][subItem] }
                        } else {
                            tempAllValue[item] = { ...info[item], ...tempAllValue[item]}
                        }
                    })
                }
                if (!Object.keys(tempAllValue).includes(item)) {
                    tempAllValue[item] = info[item]
                }
            })
            tempAllValue.jsonInfo.map((item, index) => {
                tempAllValue.jsonInfo[index] = Object.assign(info.jsonInfo[index], item);
            })
            tempAllValue.jsonInfo.map((item, index) => {
                if (item.type == 2) {
                    item.adList.map((ad, adIndex) => {
                        tempAllValue.jsonInfo[index]['adList'][adIndex] = Object.assign(tempinfo.jsonInfo[index]['adList'][adIndex], ad);
                    })
                }
            })
            let tempModuleList = [];
            tempAllValue.jsonInfo.map((item, index) => {
                if (item.isChecked && item.type != 3) {
                    tempModuleList.push({
                        title: item.title,
                        type: item.type,
                        index,
                    })
                }
            })
            tempinfo.rightNav.moduleList.map(item => {
                tempModuleList.map((moduleItem, curIndex) => {
                    if (moduleItem.index == item.index) {
                        tempModuleList[curIndex] = { ...item, ...tempModuleList[curIndex] };
                    }
                })
            })
            tempAllValue.rightNav.moduleList = tempModuleList;
            return tempAllValue;
        }
        if (activeKey == "onPC") {
            let tempAllValue = reSortValue(pcInfo, tempPcInfo)
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo: tempAllValue,
                }
            })
        } else {
            let tempAllValue = reSortValue(xcxInfo, tempXcxInfo);
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo: tempAllValue,
                }
            })
        }
    }
    handleChangeList = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                ...payload
            }
        })
    }
    handleBack = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/updatePageReducer',
            payload: {
                showConfirmModal: true
            }
        })
    }
    handleConfirmBack = () => {
        const { aTypeModel } = this.props;
        const { pageId, copy, edit, type } = aTypeModel;
        router.push(`/pages-management/create-pages/${type}/${pageId}/${1}/${0}`)
    }
    handleSearchList = (type, payload) => {
        const { dispatch } = this.props;

        switch (type) {
            case 'goods':
                dispatch({
                    type: 'aTypeModel/getList',
                    payload: payload.currentPage ? { ...payload } : { ...payload, currentPage: 1 }
                })
                break;
            case 'coupon':
                dispatch({
                    type: 'aTypeModel/getCouponList',
                    payload: payload.currentPage ? { ...payload } : { ...payload, currentPage: 1 }
                })
                break;
            case 'act':
                dispatch({
                    type: 'aTypeModel/getActList',
                    payload: payload.currentPage ? { ...payload } : { ...payload, currentPage: 1 }
                })
                break;
        }
    }
    handleChanegActiveKey = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'aTypeModel/getList',
            payload: {
                ...payload
            }
        })
    }
    handleUploadFile = (currentIndex, file) => {
        const { status, response } = file.file;
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        if (status == "done") {
            if (activeKey == "onPC") {
                if (currentIndex != null) {
                    pcInfo.jsonInfo[currentIndex].goodsList = response.data;
                } else {
                    pcInfo.adviceGoods.goodsList = response.data;
                }
                dispatch({
                    type: 'aTypeModel/updatePageReducer',
                    payload: {
                        pcInfo
                    }
                })
            } else {
                if (currentIndex != null) {
                    xcxInfo.jsonInfo[currentIndex].goodsList = response.data;
                } else {
                    xcxInfo.adviceGoods.goodsList = response.data;
                }
                dispatch({
                    type: 'aTypeModel/updatePageReducer',
                    payload: {
                        xcxInfo
                    }
                })
            }
        }
    }
    handleDeleteTag = (type, currentIndex, tagIndex) => {
        const { dispatch, aTypeModel } = this.props;
        const { xcxInfo, pcInfo, activeKey } = aTypeModel;
        if (activeKey == "onPC") {
            if (type == "act") {
                pcInfo.jsonInfo[currentIndex].actPageList.splice(tagIndex, 1)
            } else if (type == "coupon") {
                pcInfo.jsonInfo[currentIndex].couponIdList.splice(tagIndex, 1)
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            if (type == "act") {
                xcxInfo.jsonInfo[currentIndex].actPageList.splice(tagIndex, 1)
            } else if (type == "coupon") {
                xcxInfo.jsonInfo[currentIndex].couponIdList.splice(tagIndex, 1)
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    handleChangeTableValue = (currentIndex, recordIndex, e) => {
        const { dispatch, aTypeModel } = this.props;
        const { xcxInfo, pcInfo, activeKey } = aTypeModel;
        if (activeKey == "onPC") {
            if (currentIndex != null) {
                pcInfo.jsonInfo[currentIndex].goodsList[recordIndex].sortOrder = +e.target.value;
            } else {
                pcInfo.adviceGoods.goodsList[recordIndex].sortOrder = +e.target.value;
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            if (currentIndex != null) {
                xcxInfo.jsonInfo[currentIndex].goodsList[recordIndex].sortOrder = +e.target.value;
            } else {
                xcxInfo.adviceGoods.goodsList[recordIndex].sortOrder = +e.target.value;
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    handleChangeTitleValue = (titleIndex, type, e) => {
        const { dispatch, aTypeModel } = this.props;
        const { xcxInfo, pcInfo, activeKey } = aTypeModel;
        if (activeKey == "onPC") {
            if (type == "input") {
                pcInfo.rightNav.moduleList[titleIndex].newTitle = e.target.value;
            } else {
                pcInfo.rightNav.moduleList[titleIndex].isChecked = e.target.checked;
            }

            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                }
            })
        } else {
            if (type == "input") {
                xcxInfo.rightNav.moduleList[titleIndex].newTitle = e.target.value;
            } else {
                xcxInfo.rightNav.moduleList[titleIndex].isChecked = e.target.checked;
            }
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    render() {
        const {
            loading,
            aTypeModel: {
                pcInfo,
                showGoodsModal,
                goodsList,
                xcxInfo,
                isShowUploadSucaiModal,
                choseNum,
                previewModal,
                imgUrl,
                activeKey,
                currentPage,
                pageSize,
                total,
                showPc,
                showXcx,
                showConfirmModal,
                goodsStatusMap,
                categoryMap,
                cardLoading,
                showConponModal,
                couponList,
                showPromotionModal,
                actPageList,
                totalCount,
            },
        } = this.props;
        return (
            <PageHeaderWrapper
                title="A级活动页面"
            >
                <Card loading={cardLoading}>
                    <Tabs onChange={this.handleChangeTabs} defaultActiveKey={"onPC"} activeKey={activeKey}>
                        {
                            showPc && <Tabs.TabPane tab="PC端" key="onPC">
                                <CommonPart
                                    data={pcInfo}
                                    type="pc"
                                    addItem={this.handleAdd}
                                    reduceItem={this.handleReduce}
                                    onShow={this.handleShowItem}
                                    onDelete={this.handleDelete}
                                    onSubmit={this.handleSubmit}
                                    onUpload={this.handleUpload}
                                    onRemoveImg={this.handleRemove}
                                    onChangeColor={this.handleChangeColor}
                                    onResourceUpload={this.handleResourceUpload}
                                    onPreview={this.handlePreview}
                                    onChangeOrder={this.handleChangeOrder}
                                    onValueChange={this.handleChangeValue}
                                    onForward={this.handleForward}
                                    onBack={this.handleBack}
                                    onChangeKey={this.handleChanegActiveKey}
                                    uploadFile={this.handleUploadFile}
                                    onDeleteTag={this.handleDeleteTag}
                                    onChangeTableValue={this.handleChangeTableValue}
                                    onChangeTitleValue={this.handleChangeTitleValue}
                                />
                            </Tabs.TabPane>
                        }
                        {
                            showXcx && <Tabs.TabPane tab="小程序" key="onApplet">
                                <CommonPart
                                    data={xcxInfo}
                                    type="xcx"
                                    addItem={this.handleAdd}
                                    reduceItem={this.handleReduce}
                                    onShow={this.handleShowItem}
                                    onDelete={this.handleDelete}
                                    onSubmit={this.handleSubmit}
                                    onUpload={this.handleUpload}
                                    onRemoveImg={this.handleRemove}
                                    onChangeColor={this.handleChangeColor}
                                    onResourceUpload={this.handleResourceUpload}
                                    onPreview={this.handlePreview}
                                    onForward={this.handleForward}
                                    onChangeOrder={this.handleChangeOrder}
                                    onValueChange={this.handleChangeValue}
                                    onBack={this.handleBack}
                                    onChangeKey={this.handleChanegActiveKey}
                                    uploadFile={this.handleUploadFile}
                                    onDeleteTag={this.handleDeleteTag}
                                    onChangeTableValue={this.handleChangeTableValue}
                                    onChangeTitleValue={this.handleChangeTitleValue}
                                />
                            </Tabs.TabPane>
                        }
                    </Tabs>
                </Card>
                <AddGoodsModal
                    visible={showGoodsModal}
                    dataSource={goodsList}
                    onOk={this.handleAddItems.bind(this, 'goods')}
                    onClose={this.handleCloseModal.bind(this, 'showGoodsModal')}
                    loading={loading}
                    onChange={this.handleChangeList}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    total={total}
                    onSearch={this.handleSearchList.bind(this, 'goods')}
                    config={{
                        goodsStatusMap,
                        categoryMap
                    }}
                />
                <AddCouponModal
                    visible={showConponModal}
                    dataSource={couponList}
                    onChange={this.handleChangeList}
                    onSearch={this.handleSearchList.bind(this, 'coupon')}
                    onOk={this.handleAddItems.bind(this, 'coupon')}
                    onClose={this.handleCloseModal.bind(this, 'showConponModal')}
                />
                <AddActModal
                    visible={showPromotionModal}
                    onChange={this.handleChangeList}
                    onSearch={this.handleSearchList.bind(this, 'act')}
                    onOk={this.handleAddItems.bind(this, 'act')}
                    onClose={this.handleCloseModal.bind(this, 'showPromotionModal')}
                    dataSource={actPageList}
                    total={totalCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                />
                <PostPicture
                    config={{
                        visible: isShowUploadSucaiModal,
                        confirm: this.handleConfirmSelectPic.bind(this),
                        cancel: this.handleCloseModal.bind(this, 'isShowUploadSucaiModal'),
                        choseNum: choseNum
                    }}
                ></PostPicture>
                <Modal
                    visible={previewModal}
                    onCancel={this.handleCloseModal.bind(this, 'previewModal')}
                    footer={null}
                >
                    <img src={imgUrl} style={{ width: '100%', height: '100%' }} />
                </Modal>
                <Modal
                    visible={showConfirmModal}
                    title="提示"
                    onOk={this.handleConfirmBack}
                    onCancel={this.handleCloseModal.bind(this, 'showConfirmModal')}
                >
                    <p>请确认是否返回上一步？</p>
                    <p>返回后当前页面编辑的内容将会被清空</p>
                </Modal>

            </PageHeaderWrapper>
        )
    }
}
export default ATypeModel;

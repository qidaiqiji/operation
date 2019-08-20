import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Row, Input, Button, Table, Pagination, Select, Form, Tabs, Modal, message } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CommonPart from './bCommonPart';
import AddGoodsModal from '@/components/AddGoodsModal';
import globalStyles from '@/global.less';
import ManualUpload from '@/components/ManualUpload';
import PostPicture from '@/components/PostPicture';
@connect(({ bTypeModel, loading, resourcePool }) => ({
    bTypeModel,
    resourcePool,
    loading: loading.effects['bTypeModel/getList'],
}))
class BTypeModel extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const { id, copy, edit, oldId } = this.props.match.params;
        dispatch({
            type: 'bTypeModel/getDetail',
            payload: {
                pageId: id,
                edit,
                copy,
                getDetailId:oldId
            }
        })
        dispatch({
            type: 'bTypeModel/getConfig',
        })
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/unmountReducer',
        })
    }
    handleAdd = (type, currentIndex, reset) => {
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey} = bTypeModel;
        if (activeKey == "onPC") {
            if(type==1){
                pcInfo.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    goodsList: [],
                    isShowTitle:1,
                    bgColor:'#dd3450'
                })
            }else{
                pcInfo.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    adList: [],
                    isShowTitle:1,
                    bgColor:'#dd3450'
                })
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                }
            })
        } else {
            if(type==1){
                xcxInfo.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    goodsList: [],
                    isShowTitle:1,
                    bgColor:'#dd3450'
                })
            }else{
                xcxInfo.jsonInfo.splice(currentIndex + 1, 0, {
                    type,
                    adList: [],
                    isShowTitle:1,
                    bgColor:'#dd3450'
                })
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo,
                }
            })
        }
        reset();
    }
    handleReduce = (currentIndex, reset) => {
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if (activeKey == "onPC") {
            pcInfo.jsonInfo.splice(currentIndex, 1);
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                }
            })
        } else {
            xcxInfo.jsonInfo.splice(currentIndex, 1);
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo,
                }
            })
        }
        reset();
    }
    handleShowItem = (visible, currentIndex) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/getList',
            payload: {
                showGoodsModal: visible,
                currentIndex,
                currentPage:1,
            }
        })
    }
    handleAddGoods = (selectedRows, selectedRowIds) => {
        const { dispatch, bTypeModel } = this.props;
        const { currentIndex, pcInfo, xcxInfo, activeKey } = bTypeModel;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo;
        tempInfoType.jsonInfo[currentIndex].goodsList.push(...selectedRows);
        // tempInfoType.jsonInfo[currentIndex].goodsList.map((item, index) => {
        //     item.operateId = `${currentIndex}-${index}`
        // })
        if (activeKey == "onPC") {
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    showGoodsModal: false,
                    pcInfo: tempInfoType,
                }
            })
        } else {
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    showGoodsModal: false,
                    xcxInfo: tempInfoType,
                }
            })
        }
    }
    handleCloseModal = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/updatePageReducer',
            payload: {
                [type]: false,
            }
        })
    }
    handleDelete = (currentIndex, goodsId) => {
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        let tempInfoType = activeKey == "onPC" ? pcInfo : xcxInfo
        tempInfoType.jsonInfo[currentIndex].goodsList.map((item,index)=>{
            if(item.goodsId == goodsId) {
                tempInfoType.jsonInfo[currentIndex].goodsList.splice(index, 1);
            }
        })
        if (activeKey == "onPC") {
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo: tempInfoType,
                }
            })
        } else {
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo: tempInfoType,
                }
            })
        }
    }
    handleSubmit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/submitInfo',
        })
    }
    handleUpload = (type, currentIndex, file) => {
        const { status, response } = file.file;
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if (status === 'done') {
            if (activeKey == "onPC") {
                switch (type) {
                    case 'bgImg':
                        pcInfo['bgImg'] = response.data.imgs[0].imgId;
                        pcInfo['bgImgUrl'] = response.data.imgs[0].url;
                        break;
                    case "banner":
                        pcInfo['banner'] = response.data.imgs[0].imgId;
                        break;
                    case 'titleImg':
                        pcInfo.jsonInfo[currentIndex]['titleImg'] = response.data.imgs[0].imgId;
                        pcInfo.jsonInfo[currentIndex]['titleImgUrl'] = response.data.imgs[0].url;
                        break
                    case 'adList':
                        pcInfo.jsonInfo[currentIndex]['adList'].push({ ad: response.data.imgs[0].imgId, adUrl: response.data.imgs[0].url });
                        break
                }
                dispatch({
                    type: 'bTypeModel/updatePageReducer',
                    payload: {
                        pcInfo,

                    },
                });
            } else {
                switch (type) {
                    case 'bgImg':
                        xcxInfo['bgImg'] = response.data.imgs[0].imgId;
                        xcxInfo['bgImgUrl'] = response.data.imgs[0].url;
                        break;
                    case "banner":
                        xcxInfo['banner'] = response.data.imgs[0].imgId;
                        break;
                    case 'titleImg':
                        xcxInfo.jsonInfo[currentIndex]['titleImg'] = response.data.imgs[0].imgId;
                        xcxInfo.jsonInfo[currentIndex]['titleImgUrl'] = response.data.imgs[0].url;
                        break
                    case 'adList':
                        xcxInfo.jsonInfo[currentIndex]['adList'].push({ ad: response.data.imgs[0].imgId, adUrl: response.data.imgs[0].url });
                        break
                }
                dispatch({
                    type: 'bTypeModel/updatePageReducer',
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
    handleRemove = (imgType, currentIndex, imgIndex,reset) => {
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if (activeKey == "onPC") {
            switch (imgType) {
                case 'bgImg':
                    pcInfo['bgImg'] = '';
                    pcInfo['bgImgUrl'] = '';
                    break;
                case "banner":
                    pcInfo['banner'] = '';
                    pcInfo['bannerLink'] = '';
                    pcInfo['bannerUrl'] = '';
                    break;
                case 'titleImg':
                    pcInfo.jsonInfo[currentIndex]['titleImg'] = '';
                    pcInfo.jsonInfo[currentIndex]['titleImgUrl'] = '';
                    break
                case 'adList':
                    pcInfo.jsonInfo[currentIndex]['adList'].splice(imgIndex, 1);
                    break
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            switch (imgType) {
                case 'bgImg':
                    xcxInfo['bgImg'] = '';
                    xcxInfo['bgImgUrl'] = '';
                    break;
                case "banner":
                    xcxInfo['banner'] = '';
                    xcxInfo['bannerLink'] = '';
                    pcInfo['bannerUrl'] = '';
                    break;
                case 'titleImg':
                    xcxInfo.jsonInfo[currentIndex]['titleImg'] = '';
                    xcxInfo.jsonInfo[currentIndex]['titleImgUrl'] = '';
                    break
                case 'adList':
                    xcxInfo.jsonInfo[currentIndex]['adList'].splice(imgIndex, 1);
                    break
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
        reset();
    }
    handleChangeTabs = (activeKey) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/updatePageReducer',
            payload: {
                activeKey,
            }
        })
    }
    handleChangeColor = (currentIndex, e) => {
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if (activeKey == "onPC") {
            if (currentIndex) {
                pcInfo.jsonInfo[currentIndex].bgColor = e.target.value;
            } else {
                pcInfo.bgColor = e.target.value;
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo
                }
            })
        } else {
            if (currentIndex) {
                xcxInfo.jsonInfo[currentIndex].bgColor = e.target.value;
            } else {
                xcxInfo.bgColor = e.target.value;
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
    }
    handleResourceUpload = (imgType, choseNum, currentIndex) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bTypeModel/updatePageReducer',
            payload: {
                isShowUploadSucaiModal: true,
                choseNum,
                imgType,
                currentIndex,
            }
        })
    }
    handleConfirmSelectPic = () => {
        const { dispatch, resourcePool, bTypeModel } = this.props;
        const { selectedPictureList } = resourcePool;
        const { imgType, activeKey, currentIndex, pcInfo, xcxInfo } = bTypeModel;
        const tempImgResult = [];
        const adList = [];
        selectedPictureList.map(item => {
            tempImgResult.push({ imgId: item.imgId, url: item.url })
            adList.push({ad:item.imgId,adUrl:item.url})
        })
        if (activeKey == "onPC") {
            switch (imgType) {
                case 'bgImg':
                    pcInfo['bgImg'] = tempImgResult[0].imgId;
                    pcInfo['bgImgUrl'] = tempImgResult[0].url;
                    break;
                case "banner":
                    pcInfo['banner'] = tempImgResult[0].imgId;
                    pcInfo['bannerUrl'] = tempImgResult[0].url;
                    break;
                case 'titleImg':
                    pcInfo.jsonInfo[currentIndex]['titleImg'] = tempImgResult[0].imgId;
                    pcInfo.jsonInfo[currentIndex]['titleImgUrl'] = tempImgResult[0].url;
                    break
                case 'adList':
                    pcInfo.jsonInfo[currentIndex]['adList'].push(...adList);
                    break
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    isShowUploadSucaiModal: false,
                    pcInfo
                }
            })
        } else {
            switch (imgType) {
                case 'bgImg':
                    xcxInfo['bgImg'] = tempImgResult[0].imgId;
                    xcxInfo['bgImgUrl'] = tempImgResult[0].url;
                    break;
                case "banner":
                    xcxInfo['banner'] = tempImgResult[0].imgId;
                    xcxInfo['bannerUrl'] = tempImgResult[0].url;
                    break;
                case 'titleImg':
                    xcxInfo.jsonInfo[currentIndex]['titleImg'] = tempImgResult[0].imgId;
                    xcxInfo.jsonInfo[currentIndex]['titleImgUrl'] = tempImgResult[0].url;
                    break
                case 'adList':
                    xcxInfo.jsonInfo[currentIndex]['adList'].push(...adList);
                    break
            }
            dispatch({
                type: 'bTypeModel/updatePageReducer',
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
            type: 'bTypeModel/updatePageReducer',
            payload: {
                previewModal: true,
                imgUrl,
            }
        })

    }
    handleChangeOrder = (type, index, reset) => {
        const { dispatch, bTypeModel } = this.props;
        const { xcxInfo, activeKey, pcInfo, } = bTypeModel;
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
                type: 'bTypeModel/updatePageReducer',
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
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo
                }
            })
        }
        reset();
    }
    handleChangeValue = (allValue) => {
        let tempAllValue = JSON.parse(JSON.stringify(allValue))
        const { dispatch, bTypeModel } = this.props;
        const { activeKey, xcxInfo, pcInfo } = bTypeModel;
        let tempPcInfo = JSON.parse(JSON.stringify(pcInfo));
        let tempXcxInfo = JSON.parse(JSON.stringify(xcxInfo));
        if (activeKey == "onPC") {
            Object.keys(pcInfo).map(item => {
                if (!Object.keys(tempAllValue).includes(item)) {
                    tempAllValue[item] = pcInfo[item]
                }
            })
            tempAllValue.jsonInfo.map((item, index) => {
                tempAllValue.jsonInfo[index] = Object.assign(pcInfo.jsonInfo[index],tempAllValue.jsonInfo[index]);
            })
            tempAllValue.jsonInfo.map((item, index) => {
                if(item.type==2) {
                    item.adList.map((ad,adIndex)=>{
                        tempAllValue.jsonInfo[index]['adList'][adIndex] = Object.assign(tempPcInfo.jsonInfo[index]['adList'][adIndex],ad);
                    })
                }
            })
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    pcInfo: tempAllValue,
                }
            })
        } else {
            Object.keys(xcxInfo).map(item => {
                if (!Object.keys(tempAllValue).includes(item)) {
                    tempAllValue[item] = xcxInfo[item]
                }
            })
            tempAllValue.jsonInfo.map((item, index) => {
                tempAllValue.jsonInfo[index] = Object.assign(xcxInfo.jsonInfo[index],tempAllValue.jsonInfo[index]);
            })
            tempAllValue.jsonInfo.map((item, index) => {
                if(item.type==2) {
                    item.adList.map((ad,adIndex)=>{
                        tempAllValue.jsonInfo[index]['adList'][adIndex] = Object.assign(tempXcxInfo.jsonInfo[index]['adList'][adIndex],ad);
                    })
                }
            })
            dispatch({
                type: 'bTypeModel/updatePageReducer',
                payload: {
                    xcxInfo: tempAllValue,
                } 
            })
        }
    }
    handleChange=(currentIndex,type,e)=>{
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if(activeKey == "onPC") {
            xcxInfo.jsonInfo[currentIndex][type]
            dispatch({
                type:'bTypeModel/getList',
                payload:{
                    
                }
            })
        }
    }
    handleChangeList=(payload)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'bTypeModel/updatePageReducer',
            payload:{
                ...payload
            }
        })
    }
    handleBack=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'bTypeModel/updatePageReducer',
            payload:{
                showConfirmModal:true
            }
        })
    }
    handleConfirmBack=()=>{
        const { bTypeModel } = this.props;
        const { pageId,copy,edit } = bTypeModel;
        router.push(`/pages-management/create-pages/2/${pageId}/${0}/${0}`)
    }
    handleSearchList=(payload)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'bTypeModel/getList',
            payload:{
                ...payload,
            }
        })
    }
    handleChanegActiveKey=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'bTypeModel/getList',
            payload:{
                ...payload
            }
        })
    }
    handleUploadFile=(currentIndex,file)=>{
        const { status, response } = file.file;
        const { dispatch, bTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = bTypeModel;
        if(status == "done") {
            if(activeKey == "onPC") {
                pcInfo.jsonInfo[currentIndex].goodsList = response.data;
                dispatch({
                    type:'bTypeModel/updatePageReducer',
                    payload:{
                        pcInfo
                    }
                })
            }else{
                xcxInfo.jsonInfo[currentIndex].goodsList = response.data;
                dispatch({
                    type:'bTypeModel/updatePageReducer',
                    payload:{
                        xcxInfo
                    }
                })
            }
        }

    }
    render() {
        const {
            loading,
            bTypeModel: {
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
            },
        } = this.props;
        return (
            <PageHeaderWrapper
            title="B级活动页面"
            >
                <Card loading={cardLoading}>
                    <Tabs onChange={this.handleChangeTabs} defaultActiveKey={activeKey}>
                        {
                            showPc&& <Tabs.TabPane tab="PC端" key="onPC">
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
                                />
                            </Tabs.TabPane>
                        }
                        {
                            showXcx&&<Tabs.TabPane tab="小程序" key="onApplet">
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
                            />
                        </Tabs.TabPane>
                        }
                    </Tabs>
                </Card>
                <AddGoodsModal
                    visible={showGoodsModal}
                    dataSource={goodsList}
                    onOk={this.handleAddGoods}
                    onClose={this.handleCloseModal.bind(this, 'showGoodsModal')}
                    loading={loading}
                    onChange={this.handleChangeList}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    total={total}
                    onSearch={this.handleSearchList}
                    config={{
                        goodsStatusMap,
                        categoryMap
                    }}
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
                onCancel={this.handleCloseModal.bind(this,'showConfirmModal')}
                >
                    <p>请确认是否返回上一步？</p>
                    <p>返回后当前页面数据将会被清空</p>
                </Modal>
            </PageHeaderWrapper>
        )
    }
}
export default BTypeModel;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, Table, Pagination, Select, Form, Tabs } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CommonPart from '../Components/CommonPart';
import AddGoodsModal from '@/components/AddGoodsModal';
import globalStyles from '@/global.less';
import ManualUpload from '@/components/ManualUpload';
@connect(({aTypeModel,loading}) => ({
    aTypeModel,
    loading: loading.effects['aTypeModel/getList'],
}))
class ATypeModel extends PureComponent {
    handleAdd = (type,currentIndex,values,reset)=>{
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo } = aTypeModel;
        const tempData = JSON.parse(JSON.stringify(pcInfo));
        const tempList = tempData.jsonInfo;
        Object.keys(tempData).map(item=>{
            if(!Object.keys(values).includes(item)) {
                values[item] = tempData[item]
            }
        })
        values.jsonInfo.map((info,index)=>{
            values.jsonInfo[index] = Object.assign(values.jsonInfo[index],tempList[index]);
        })
        if(type==1) {
            values.jsonInfo.splice(currentIndex+1,0,{
                type,
                goodsIdList:[]
            })
        }else{
            values.jsonInfo.splice(currentIndex+1,0,{
                type,
                adList:[]
            })
        }
        
        dispatch({
            type:'aTypeModel/updatePageReducer',
            payload:{
                pcInfo:values,
            }
        })
        reset();
    }
    handleShowItem=(visible,currentIndex)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'aTypeModel/getList',
            payload:{
                showGoodsModal:visible,
                currentIndex,
            }
        })
    }
    handleAddGoods=(selectedRows, selectedRowIds)=>{
        const { dispatch, aTypeModel } = this.props;
        const { currentIndex, pcInfo } = aTypeModel;
        pcInfo.jsonInfo[currentIndex].goodsIdList.push(...selectedRows);
        pcInfo.jsonInfo[currentIndex].goodsIdList.map((item,index)=>{
            item.operateId = `${currentIndex}-${index}`
        })
        dispatch({
            type:'aTypeModel/updatePageReducer',
            payload:{
                showGoodsModal:false,
                pcInfo,
            }
        })
        

    }
    handleCloseModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'aTypeModel/updatePageReducer',
            payload:{
                showGoodsModal:false,
            }
        })
    }
    handleDelete=(currentIndex,index)=>{
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo } = aTypeModel;
        pcInfo.jsonInfo[currentIndex].goodsIdList.splice(index,1);
        dispatch({
            type:'aTypeModel/updatePageReducer',
            payload:{
                pcInfo,
            }
        })
        
    }
    handleSubmit=(values,type)=>{
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo } = aTypeModel;
        if(type == "pc") {
            dispatch({
                type:'aTypeModel/submitInfo',
                payload:{
                    pcInfo:values,
                    type
                }
            })
        }else{
            dispatch({
                type:'aTypeModel/submitInfo',
                payload:{
                    xcxInfo:values,
                    type
                }
            })
        }

    }
    handleChangeItem=(pcInfo)=>{
        // const { dispatch } = this.props;
        // dispatch({
        //     type:'aTypeModel/updatePageReducer',
        //     payload:{
        //         pcInfo,
        //     }
        // })
    }
    // handleShowUploadModal=()=>{
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type:'aTypeModel/updatePageReducer',
    //         payload:{
    //             showUploadModal:true,
    //         }
    //     })
    // }
    handleUpload=(type,currentIndex,file)=>{
        const { status, response } = file.file;
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo,xcxInfo, activeKey } = aTypeModel;
        if (status === 'done') {
            if(activeKey == "pc") {
                switch(type) {
                    case 'bgImg':
                        pcInfo['bgImg'] = response.data.imgs[0].imgId;
                        pcInfo['bgImgUrl'] = response.data.imgs[0].url;
                    break;
                    case "banner":
                        pcInfo['banner'] = response.data.imgs[0].imgId;
                        pcInfo['bannerUrl'] = response.data.imgs[0].url;
                    break;
                    case 'titleImg':
                        pcInfo.jsonInfo[currentIndex]['titleImg'] = response.data.imgs[0].imgId;
                        pcInfo.jsonInfo[currentIndex]['titleImgUrl'] = response.data.imgs[0].url;
                    break
                    case 'adList':
                        pcInfo.jsonInfo[currentIndex]['adList'].push({ad:response.data.imgs[0].imgId,adUrl:response.data.imgs[0].url});
                    break
                }
                dispatch({
                    type: 'aTypeModel/updatePageReducer',
                    payload: {
                        pcInfo,
                    },
                });
            }
        } else if (status === 'error') {
        message.error({
            message: '上传文件失败，请稍候重试',
        });
        }
    }
    handleRemove=(type)=>{
        const { dispatch, aTypeModel } = this.props;
        const { pcInfo, xcxInfo, activeKey } = aTypeModel;
        if(activeKey == "pc") {
            pcInfo[type] = "";
            dispatch({
                type: 'aTypeModel/updatePageReducer',
                payload: {
                    pcInfo,
                },
            });
        }

    }
    handleChangeTabs=(activeKey)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'aTypeModel/updatePageReducer',
            payload:{
                activeKey,
            }
        })

    }
    render() {
        const {
            loading,
            aTypeModel: {
                pcInfo,
                showGoodsModal,
                goodsList,
                xcxInfo,
                showUploadModal,

            }
        } = this.props;
        const pcLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        }
        return (
            <PageHeaderWrapper
            >
                <Card>
                    <Tabs defaultActiveKey="pc" onChange={this.handleChangeTabs}>
                        <Tabs.TabPane tab="PC端" key="pc">
                            <CommonPart 
                            data={pcInfo} 
                            addItem = {this.handleAdd}
                            onShow={this.handleShowItem}
                            onDelete={this.handleDelete}
                            type="pc"
                            onSubmit={this.handleSubmit}
                            onUpload={this.handleUpload}
                            onRemove={this.handleRemove}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="小程序" key="xcx">
                            <CommonPart 
                            data={xcxInfo}
                            type="xcx"
                            addItem = {this.handleAdd}
                            onShow={this.handleShowItem}
                            onDelete={this.handleDelete}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
                <AddGoodsModal 
                visible={showGoodsModal}
                dataSource = {goodsList}
                onOk={this.handleAddGoods}
                onClose={this.handleCloseModal}
                loading={loading}
                />
                {/* <Modal
                visible={showUploadModal}
                >
                    <ManualUpload />
                </Modal> */}
            </PageHeaderWrapper>
        )
    }
}
export default ATypeModel;

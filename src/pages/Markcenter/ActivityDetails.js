import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { Button, Card, Table, Row, Col, Select, Input, Popconfirm, Modal } from 'antd';

import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
import globalStyles from '@/global.less';
console.log(uuid,uuid.v4())
const { Search } = Input;
const { Option } = Select;

const typeMap={'0':'否','1':'是'}
@connect(({ activityDetails, loading }) => ({
  activityDetails,
  loading: loading.effects['activityDetails/getDetailMsg'],
}))
class ActivityDetails extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { activityDetails, dispatch } = this.props;
    const {
      keywords,
      activityId,
      pageSize,
      isHot,
      currentPage,
      sortColumn,
      order,
    } = activityDetails;
    dispatch({
      type: 'activityDetails/getStateResolved',
      payload: {
        activityId: this.props.match.params.id,
        type:this.props.match.params.type,
      },
    })
    dispatch({
      type: 'activityDetails/getDetailMsg',
      payload: {
        activityId: this.props.match.params.id,
        keywords,
        pageSize,
        isHot,
        currentPage,
        sortColumn,
        order,
      },
    });
  }
  editActDetail=()=>{
    const {activityDetails} = this.props
    const {activityId,type} = activityDetails
    router.push(`/markCenter/step-form/info/${type}/${activityId}`);
  }
// 是否主推
changeHotValues(isHot, actGoodsId) {
  const { dispatch } = this.props;
  dispatch({
    type: 'activityDetails/setIsHotGoodsItem',
    payload: {
      isSetHot:isHot,
      actGoodsId
    },
  })
}
changeShowValues(isShow,actGoodsId){
  const { dispatch } = this.props;
  dispatch({
    type: 'activityDetails/setIsShowGoodsItem',
    payload: {
      isSetShow:isShow,
      actGoodsId
    },
  })
}
// 新增拼团
isShowAddGroup(fullNum,goingNum,actGoodsId){
  console.log(fullNum,goingNum,actGoodsId)
  const { dispatch } = this.props;
  dispatch({
    type: 'activityDetails/getStateResolved',
    payload: {
      fullNum,
      goingNum,
      actGoodsId,
      isShowAddGroupModal:true,
    },
  })
}
// 弹窗改变拼团数
onChangePinTuanNumb(type,addPinTuanNumb,e){
  console.log(type,addPinTuanNumb,e)
  const {activityDetails,dispatch} =this.props
  if(type =='reduce'&&addPinTuanNumb ==1){
    return false
  }
  let getNowValue = ''
  if(type == 'reduce'){
    getNowValue = +addPinTuanNumb>1?+addPinTuanNumb-1:1;
    
  }else if(type == 'add'){

    getNowValue =+addPinTuanNumb+1
    console.log(getNowValue,typeof(addPinTuanNumb))
  }else{
       const { value } = e.target;
   const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
   if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {

    getNowValue = value

  }
  }
  console.log(getNowValue)
  dispatch({
    type: 'activityDetails/getStateResolved',
    payload: {
      addPinTuanNumb:+getNowValue
    },
  })

};
//取消新增拼团
handleCancel(type){
  if(type=='isShowAddGroupModal'){
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetails/getStateResolved',
      payload: {
        fullNum:'',
        goingNum:'',
        actGoodsId:'',
        isShowAddGroupModal:false,
      },
    })
  }
}
// 确定新增拼团
handleAddGroupOk=()=>{
  const { dispatch,activityDetails } = this.props;
  const {actGoodsId,addPinTuanNumb} = activityDetails
  dispatch({
    type: 'activityDetails/updatePinTuanNumb',
    payload: {
      actGoodsId,
      addNum:addPinTuanNumb
    },
  });
  dispatch({
    type: 'activityDetails/getStateResolved',
    payload: {
      fullNum:'',
      goingNum:'',
      actGoodsId:'',
      isShowAddGroupModal:false,
    },
  })
}
  // 删除商品
  handleDelete(actGoodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetails/deleteGoodsItem',
      payload: {
        actGoodsId,
      },
    });
  }
  handleChange = (pagination, filters, sorter,currentDataSource,e) => {
    console.log('Various parameters', pagination, filters, sorter,e);
      const {current,pageSize, } = pagination
      const { dispatch,activityDetails } = this.props;
      const { keywords,activityId,isHot} = activityDetails
      let sortColumn =''
      let orderTag =''
      // if(JSON.stringify(saveSorter) != '{}'&&JSON.stringify(sorter) == '{}'){
      //   dispatch({
      //     type: 'activityDetails/getGoodsList',
      //     payload: {
      //       keywords,
      //       activityId,
      //       isHot,
      //       pageSize,
      //       currentPage:current,
      //     },
      //   });
      // }
      if(JSON.stringify(sorter) != '{}'){
        const {columnKey,order} = sorter
        if(columnKey=='sortOrder'){
          sortColumn = 'sort_order'
        }else if( columnKey=='alreadyNum'){
          sortColumn = 'sale_count'
        }else if( columnKey== 'limitNum'){
          sortColumn = 'limit_num'
        }
        orderTag = order == "descend"?'DESC':''
      }
      dispatch({
        type: 'activityDetails/getGoodsList',
        payload: {
          keywords,
          activityId,
          pageSize,
          isHot,
          currentPage:current,
          sortColumn,
          order:orderTag
        },
      });

    
  };  
  // handleChangeCurrentPage=(currentpage,pageSize)=>{
  //   console.log(currentpage,pageSize,'currentpage,pageSizepage')
  // }
  handleChangePageSize=(currentpage,pageSize)=>{
    console.log(currentpage,pageSize,'currentpage,pageSize')
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'activityDetails/getStateResolved',
    //   payload: {
    //     currentpage: 1,
    //   },
    // });
  }
  handleChangeSiftItem = (type, e) => {
    console.log(type,e)
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetails/getStateResolved',
      payload: {
        [type]: e.target.value,
      },
    });
  };
  handleSearchKeywords=()=>{
    const { dispatch,activityDetails } = this.props;
    const { keywords,activityId,isHot,pageSize,  } = activityDetails
    dispatch({
      type: 'activityDetails/getGoodsList',
      payload: {
        keywords,
        activityId,
        isHot,
        pageSize, 
        currentPage:1
      },
    });
  }
  handleSelectSiftItem = (type, e) => {
    console.log(type,e)
    const { dispatch,activityDetails } = this.props;
    const { keywords,activityId,pageSize,  } = activityDetails
    dispatch({
      type: 'activityDetails/getGoodsList',
      payload: {
        keywords,
        activityId,
        pageSize, 
        currentPage:1,
        [type]: e,
      },
    });
  };
  
  

  componentWillUnmount(){
    
    const { dispatch } = this.props;
    dispatch({
      type: 'activityDetails/unmountReducer',
    });
  }
  render() {
    const {
      activityDetails: { activityInfo, actGoodsList, totalCount, currentPage, pageSize, keywords, isHot,type,isShowAddGroupModal,addPinTuanNumb,fullNum ,goingNum},
      loading,
    } = this.props;
    console.log(this.props,actGoodsList)
    
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => index+1,
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品状态',
        dataIndex: 'goodsStatus',
        key: 'goodsStatus',
      },
      {
        title: '平台价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
      },
      {
        title: '可用库存',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '成团人数',
        dataIndex: 'fullNum',
        key: 'fullNum',
      },
      {
        title: '拼团价',
        dataIndex: 'actPrice',
        key: 'actPrice',
      },
      {
        title: '已拼数量',
        dataIndex: 'alreadyNum',
        key: 'alreadyNum',
        sorter: true,
      },
      {
        title: '折扣',
        dataIndex: 'discount',
        key: 'discount',
      },
      {
        title: '减价',
        dataIndex: 'savePrice',
        key: 'savePrice',
      },
      {
        title: '促销价',
        dataIndex: 'actPrice',
        key: 'actPrice',
      },
      {
        title: '促销数量',
        dataIndex: 'matchNum',
        key: 'matchNum',
      },
      {
        title: '限购数量',
        dataIndex: 'limitNum',
        key: 'limitNum',
        sorter: true,
      },
      {
        title: '活动已售数量',
        dataIndex: 'alreadyNum',
        key: 'alreadyNum',
        sorter: true,
        // render: name => `${name.first} ${name.last}`,
      },
      {
        title: '排序值',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        sorter: true,
        // render: name => `${name.first} ${name.last}`,
      },
      {
        title: '是否主推',
        dataIndex: 'isHot',
        key: 'isHot',
        render:isHot=>isHot?'是':'否'
      },
      {
        title: '是否显示',
        dataIndex: 'isShow',
        key: 'isShow',
        render:isShow=>isShow?'是':'否'
      },
      {
        title: '正在拼团数',
        dataIndex: 'goingNum',
        key: 'goingNum',
      },
      {
        title: '操作',
        dataIndex: 'actionList',
        key: 'actionList',
        width: '120px',
        render: (actionList, record, index) =>([
        <div style={{color:'#1890ff'}} onClick={this.changeHotValues.bind(this, record.isHot, record.actGoodsId)}>{record.isHot?'取消主推':'设置主推'}</div>,
        type == 3 ?null:<div style={{color:'#1890ff'}} onClick={this.changeShowValues.bind(this, record.isShow, record.actGoodsId)}>{record.isShow?'设置为不显示':'设置为显示'}</div>,
      type == 3 ?<div style={{color:'#1890ff'}} onClick={this.isShowAddGroup.bind(this, record.fullNum, record.goingNum, record.actGoodsId)}>新增拼团</div>:null,
        <div style={{color:'#1890ff'}}>          
        <Popconfirm
        title="确定删除该商品？"
        okText="确定"
        cancelText="取消"
        onConfirm={this.handleDelete.bind(this, record.actGoodsId)}
      >
        <a href="#">删除</a>
      </Popconfirm></div>])
        ,
      },
    ];

    let columnsPinT = columns.filter(item=>item.title !=='折扣'&&item.title !=='减价'&&item.title!=='促销价'&&item.title!=='促销数量'&&item.title!=='活动已售数量'&&item.title!=='是否显示')
    let columnsCom = columns.filter(item=>item.title !=='成团人数'&&item.title!=='拼团价'&&item.title !=='已拼数量'&&item.title !=='正在拼团数')

    return (
      <div>
        <PageHeaderWrapper title="活动详情页">
          <Card style={{ width: '100%', marginBottom: '40px' }} bordered={false} loading={loading}>
            <div className={styles.detailMsg}>
              <div className={styles.topMsg}>
                <div className={styles.topMsg_left}>
                  <div>{activityInfo.name}</div>
                  <div style={{ color: activityInfo.actStatus.color }}>
                    {activityInfo.actStatus.status}
                  </div>
                </div>
                <div className={styles.topMsg_right}>
                  <Button onClick={this.editActDetail}>编辑活动</Button>
                </div>
              </div>
              <div className={styles.BottomMsg}>
                <div>
                  <div>
                    活动时间：{activityInfo.startAt} 至 {activityInfo.endAt}
                  </div>
                  <div>预热开始时间：{activityInfo.preAt}</div>
                </div>
                <div>
                  <div>宣传导语：{activityInfo.guideText}</div>
                  <div>
                    允许叠加的活动：
                    {activityInfo.compositionActivityList.length > 0
                      ? activityInfo.compositionActivityList.map(item => <span>item</span>)
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} className={styles.detailRow}>
              <Col md={14} sm={24}>
                <div className={styles.tableTitle}>活动商品</div>
              </Col>
              <Col md={10} sm={24}>
                活动类型：
                <Select
                  className={globalStyles['select-sift']}
                    onChange={this.handleSelectSiftItem.bind(this, 'isHot')}
                  placeholder="请选择"
                >
                  <Option value={'-1'}>全部</Option>
                  {Object.keys(typeMap).map(type => {
                return <Option value={type} key={type}>{typeMap[type]}</Option>;
              })}
                </Select>
                <Search
                  className={globalStyles['input-sift']}
                  placeholder="请输入商品名称"
                  onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
                  onSearch={this.handleSearchKeywords}
                />
              </Col>
            </Row>
            <Table
              bordered
              columns={type ==3?columnsPinT:columnsCom}
              rowKey={record => record.uuid=uuid.v4()}
              dataSource={actGoodsList}
              loading={loading}
              pagination={{
                total:totalCount,
                current: currentPage,
                pageSize,
                showSizeChanger: true,
                // onChange: this.handleChangeCurrentPage,
                onShowSizeChange: this.handleChangePageSize,
              }}
              onChange={this.handleChange}
            />
          </Card>
          <Modal
          width={600}
          height={500}
          title="新增拼团"
          visible={isShowAddGroupModal}
          onCancel={this.handleCancel.bind(this, 'isShowAddGroupModal')}
          onOk={this.handleAddGroupOk.bind(this)}
        >
          <p>成团人数： {fullNum}</p>
          <p>正在拼团数： {goingNum}</p>
          <div className={styles.isShowAddGroupModal}>新增拼团数：
          <div className={styles.adderSubtractor}>
            <div className={styles.adderSubtractor_} onClick={this.onChangePinTuanNumb.bind(this,'reduce',addPinTuanNumb)} >-</div>
            <Input value={addPinTuanNumb} onChange={this.onChangePinTuanNumb.bind(this,'',addPinTuanNumb)}></Input>
            <div className={styles.adderSubtractor_} onClick={this.onChangePinTuanNumb.bind(this,'add',addPinTuanNumb)}>+</div>
            </div>
            </div>
        </Modal>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default ActivityDetails;

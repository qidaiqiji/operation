import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import icon from '../../../public/icons/icon.png';
import { Button, Icon, Card, Row, Col, Table, Input, Select, DatePicker, Modal } from 'antd';
import styles from './index.less';
import globalStyles from '@/global.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(({ eventManage, loading }) => ({
  eventManage,
  tableLoading: loading.effects['eventManage/getList'],
}))
class EventManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/getList',
    });
    dispatch({
      type: 'eventManage/getConfig',
    });
  }
  handleChangeSiftItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        [type]: e.target.value,
      },
    });
  };
  handleSelectSiftItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        [type]: e,
      },
    });
  };
  handleChangeCurrentPage = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/getList',
      payload: {
        currentPage: value,
      },
    });
  };
  handleCancelOperation() {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        showOperationModal: false,
      },
    });
  }
  handleChangePageSize = (page, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/getList',
      payload: {
        pageSize,
      },
    });
  };
  handleChangeActivityTime = (data, dataString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        startAt: dataString[0],
        endAt: dataString[1],
      },
    });
  };
  handleChangeCreateTime = (data, dataString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        createStartTime: dataString[0],
        createEndTime: dataString[1],
      },
    });
  };
  handleConfirmSearch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/getList',
      payload: {
        currentPage: 1,
      },
    });
  };
  handleShowOperationModal = (operationId, reqUrl, operationName) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        showOperationModal: true,
        operationId,
        reqUrl,
        operationName,
      },
    });
  };
  handleConfirmOperation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/confirmOperation',
      payload: {
        showOperationModal: false,
      },
    });
  };
  handleCancelOperation = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventManage/updatePageReducer',
      payload: {
        showOperationModal: false,
      },
    });
  };
  handleClearAll = () => {
    const { dispatch, eventManage } = this.props;
    const {
      id,
      type,
      startAt,
      endAt,
      name,
      actStatus,
      goodsSn,
      keyword,
      createStartTime,
      createEndTime,
    } = eventManage;
    dispatch({
      type: 'eventManage/getList',
      payload: {
        id: '',
        type: '',
        startAt: '',
        endAt: '',
        name: '',
        actStatus: '',
        goodsSn: '',
        keyword: '',
        createStartTime: '',
        createEndTime: '',
        pageSize: 20,
      },
    });
  };

  render() {
    const {
      tableLoading,
      eventManage: {
        goodsList,
        id,
        type,
        startAt,
        endAt,
        name,
        actStatus,
        goodsSn,
        keyword,
        createStartTime,
        createEndTime,
        total,
        typeMap,
        comStatusMap,
        currentPage,
        pageSize,
        showOperationModal,
        operationName,
        submitLoading,
        actStatusMap,
      },
    } = this.props;
    const columns = [
      {
        title: '活动ID/活动名称',
        key: 'id',
        dataIndex: 'id',
        width: 300,
        render: (id, record) => {
          return (
            <div>
              <p style={{ margin: 0 }}>
                活动ID：
                <Link to={`/markCenter/activityDetails/${record.type}/${record.id}`}>{id}</Link>
              </p>
              <p style={{ margin: 0 }}>
                活动名称：
                <Link to={`/markCenter/activityDetails/${record.type}/${record.id}`}>
                  {record.name}
                </Link>
              </p>
            </div>
          );
        },
      },
      {
        title: '活动类型',
        key: 'type',
        dataIndex: 'type',
        render: type => {
          return <span>{typeMap[type]}</span>;
        },
      },
      {
        title: '活动时间',
        key: 'startAt',
        dataIndex: 'startAt',
        render: (startAt, record) => {
          return (
            <div>
              <p>{startAt}</p>
              <p>{record.endAt}</p>
            </div>
          );
        },
      },
      {
        title: '预热开始时间',
        key: 'preAt',
        dataIndex: 'preAt',
      },
      {
        title: '创建时间',
        key: 'createAt',
        dataIndex: 'createAt',
      },
      {
        title: '活动状态',
        key: 'actStatus',
        dataIndex: 'actStatus',
        render: (actStatus, record) => {
          return <span style={{ color: actStatus.color }}>{actStatus.status}</span>;
        },
      },
      {
        title: '发布状态',
        key: 'publishStatus',
        dataIndex: 'publishStatus',
        render: (publishStatus, record) => {
          return <span style={{ color: publishStatus.color }}>{publishStatus.status}</span>;
        },
      },
      {
        title: '活动备注',
        key: 'remark',
        dataIndex: 'remark',
      },
      // {
      //   title: '活动规则',
      //   key: 'desc',
      //   dataIndex: 'desc',
      // },
      {
        title: '操作',
        key: 'actionList',
        dataIndex: 'actionList',
        width: 200,
        render: (actionList, record) => {
          return actionList.map(item => (
            <span style={{ display: 'inline-block', margin: '0 10px' }}>
              {item.type == 2 ? (
                <a
                  onClick={this.handleShowOperationModal.bind(this, record.id, item.url, item.name)}
                >
                  {item.name}
                </a>
              ) : item.name == '复制' ? (
                <Link to={`${item.url}/${record.type}/${record.id}/2`
                  
                //   {
                //   pathname: `/${item.url}/${record.type}/${record.id}`,
                //   state: { copy: true }
                // }
              }>{item.name}</Link>
              ) : (
                <Link to={`/${item.url}/${record.type}/${record.id}`}>{item.name}</Link>
              )}
            </span>
          ));
        },
      },
    ];
    return (
      <PageHeaderWrapper title="活动管理">
        <Card bordered={false}>
          <Row>
            <Search
              value={id}
              className={globalStyles['input-sift']}
              placeholder="请输入活动ID"
              onChange={this.handleChangeSiftItem.bind(this, 'id')}
            />
            <Search
              value={name}
              className={globalStyles['input-sift']}
              placeholder="请输入活动名称"
              onChange={this.handleChangeSiftItem.bind(this, 'name')}
            />
            活动类型：
            <Select
              value={type}
              className={globalStyles['select-sift']}
              onChange={this.handleSelectSiftItem.bind(this, 'type')}
              placeholder="请选择"
            >
              <Option value={''}>全部</Option>
              {Object.keys(typeMap).map(type => {
                return <Option value={type}>{typeMap[type]}</Option>;
              })}
            </Select>
            活动状态：
            <Select
              value={actStatus}
              className={globalStyles['select-sift']}
              onChange={this.handleSelectSiftItem.bind(this, 'actStatus')}
              placeholder="请选择"
            >
              <Option value={''}>全部</Option>
              {Object.keys(actStatusMap).map(type => {
                return <Option value={type}>{actStatusMap[type]}</Option>;
              })}
            </Select>
          </Row>
          <Row style={{ marginBottom: 20 }}>
            <Search
              value={goodsSn}
              className={globalStyles['input-sift']}
              placeholder="请输入商品条码"
              onChange={this.handleChangeSiftItem.bind(this, 'goodsSn')}
            />
            <Search
              value={keyword}
              className={globalStyles['input-sift']}
              placeholder="请输入商品名称"
              onChange={this.handleChangeSiftItem.bind(this, 'keyword')}
            />
            活动时间：
            <RangePicker
              className={globalStyles['select-sift']}
              onChange={this.handleChangeActivityTime}
            />
            创建时间：
            <RangePicker
              className={globalStyles['select-sift']}
              onChange={this.handleChangeCreateTime}
            />
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleConfirmSearch}>
              查询
            </Button> 
            <Button style={{ marginLeft: 20 }} onClick={this.handleClearAll}>
              重置
            </Button>
          </Row>
          <Table
            bordered
            columns={columns}
            dataSource={goodsList}
            rowKey={record => record.id}
            loading={tableLoading}
            pagination={{
              total,
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              onChange: this.handleChangeCurrentPage,
              onShowSizeChange: this.handleChangePageSize,
            }}
          />
        </Card>
        <Modal
          title="确认"
          visible={showOperationModal}
          onOk={this.handleConfirmOperation}
          onCancel={this.handleCancelOperation.bind(this)}
          confirmLoading={submitLoading}
        >
          {`请确认是否${operationName}该活动?`}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default EventManage;

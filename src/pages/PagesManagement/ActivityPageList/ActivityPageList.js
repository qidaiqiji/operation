import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, DatePicker, Radio, Col, Table, Select, Modal } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import globalStyles from '@/global.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
@connect(({ activityPageList, loading }) => ({
    activityPageList,
}))
class ActivityPageList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
        })
        dispatch({
            type: 'activityPageList/getConfig',
        })
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/unmountReducer',
        })
    }
    handleChangeActivityTime = (data, dataString) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
            payload: {
                startAt: dataString[0],
                endAt: dataString[1],
                currentPage: 1
            },
        });
    };
    handleChangeCreateTime = (data, dataString) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
            payload: {
                createTimeStart: dataString[0],
                createTimeEnd: dataString[1],
                currentPage: 1
            },
        });
    };
    handleSearchItem = (type, e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
            payload: {
                [type]: e,
                currentPage: 1,
            },
        });
    }
    handleShowModal=(operateId, record)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/updatePageReducer',
            payload: {
                showModal: true,
                operateTypeText:record.name,
                operateId,
                operateUrl:record.url,
            },
        });

    }
    handleConfirmOperate=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/confirmOperate',
        });
    }
    render() {
        const {
            activityPageList: {
                activityList,
                operateTypeText,


            }
        } = this.props;
        const columns=[
            {
                title: '序号',
                key: '',
                dataIndex: '',
                render: (_,record,index) => {
                  return <span>{index+1}</span>;
                },
            },
            {
                title: '页面名称',
                key: '',
                dataIndex: '',
            },
            {
                title: '有效时间',
                key: '',
                dataIndex: '',
            },
            {
                title: '模板名称',
                key: '',
                dataIndex: '',
            },{
                title: 'PC页面链接',
                key: '',
                dataIndex: '',
            },
            {
                title: '小程序页面链接',
                key: '',
                dataIndex: '',
            },
            {
                title: '备注',
                key: '',
                dataIndex: '',
            },
            {
                title: '创建时间',
                key: '',
                dataIndex: '',
            },
            {
                title: '状态',
                key: '',
                dataIndex: '',
            },
            {
                title: '操作',
                key: '',
                dataIndex: '',
                render:(_,record)=>{
                    return <div>
                    {
                        record.actionList.map(item=>(
                            item.type==1?<Link to={`${item.url}/${record.id}`}>{item.name}</Link>:<span onClick={this.handleShowModal.bind(this,record.id,item)}>{item.name}</span>
                        ))
                    }
                    </div>
                }
            },

        ]
        return (
            <PageHeaderWrapper
                title="创建"
            >
                <Card>
                    <Row>
                        <Input.Search
                            className={globalStyles['input-sift']}
                            placeholder="请输入页面名称"
                            onSearch={this.handleSearchItem.bind(this, 'name')}
                        />
                        <Select
                            className={globalStyles['select-sift']}
                            onChange={this.handleSearchItem.bind(this, 'isOnAct')}
                            placeholder="请选择是否启用"
                            allowClear
                            dropdownMatchSelectWidth={false}

                        >
                            <Select.Option value={''}>全部</Select.Option>
                            {/* {Object.keys(actStatusMap).map(type => {
                            return <Option value={type}>{actStatusMap[type]}</Option>;
                        })} */}
                        </Select>
                        <Select
                            className={globalStyles['select-sift']}
                            onChange={this.handleSearchItem.bind(this, 'type')}
                            placeholder="模板名称"
                            allowClear
                            dropdownMatchSelectWidth={false}
                        >
                            <Select.Option value={''}>全部</Select.Option>
                            {/* {Object.keys(actStatusMap).map(type => {
                            return <Option value={type}>{actStatusMap[type]}</Option>;
                        })} */}
                        </Select>
                        有效时间：
                        <RangePicker
                            className={globalStyles['select-sift']}
                            onChange={this.handleChangeActivityTime}
                        />
                        创建时间：
                        <RangePicker
                            className={globalStyles['select-sift']}
                            onChange={this.handleChangeCreateTime}
                        />
                    </Row>
                    <Table
                    columns={columns}
                    dataSource={activityList}
                     />
                </Card>
                <Modal title="确认"
                onOk={this.handleConfirmOperate}
                >
                    <p>请确认是否{operateTypeText}</p>
                </Modal>
            </PageHeaderWrapper>
        )
    }
}
export default ActivityPageList;

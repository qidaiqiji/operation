import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, DatePicker, Radio, Col, Table, Select, Modal } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import Link from 'umi/link';
import globalStyles from '@/global.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
@connect(({ activityPageList }) => ({
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
    handleShowModal = (operateId, record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/updatePageReducer',
            payload: {
                showModal: true,
                operateTypeText: record.name,
                operateId,
                operateUrl: record.url,
            },
        });

    }
    handleConfirmOperate = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/confirmOperate',
        });
    }
    handleCloseModal = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/updatePageReducer',
            payload: {
                showModal: false
            }
        });
    }
    // 换页
    handleChangeCurPage = (currentPage) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
            payload: {
                currentPage
            }
        });

    }
    // 切换每页行数
    handleChangePageSize(_, pageSize) {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityPageList/getList',
            payload: {
                pageSize,
                currentPage: 1
            }
        });
    }
    render() {
        const {
            activityPageList: {
                activityList,
                operateTypeText,
                total,
                showModal,
                typeMap,
                isOnActMap,
                pageSize,
                currentPage,
                loading
            }
        } = this.props;
        const columns = [
            {
                title: '序号',
                key: '',
                dataIndex: '',
                render: (_, record, index) => {
                    return <span>{index + 1}</span>;
                },
            },
            {
                title: '页面名称',
                key: 'name',
                dataIndex: 'name',
                width: 150
            },
            {
                title: '有效时间',
                key: 'startAt',
                dataIndex: 'startAt',
                render: (startAt, record) => {
                    return <div>
                        <p>{startAt}</p>
                        <p>{record.endAt}</p>
                    </div>
                }
            },
            {
                title: '模板名称',
                key: 'typeName',
                dataIndex: 'typeName',
            }, {
                title: 'PC页面链接',
                key: 'pcLink',
                dataIndex: 'pcLink',
                render: (pcLink) => {
                    return <div style={{ width: 200, wordBreak: 'break-all' }}>{pcLink}</div>
                }
            },
            {
                title: '小程序页面链接',
                key: 'xcxLink',
                dataIndex: 'xcxLink',
                render: (xcxLink) => {
                    return <div style={{ width: 200, wordBreak: 'break-all' }}>{xcxLink}</div>
                }
            },
            {
                title: '备注',
                key: 'remark',
                dataIndex: 'remark',
                width: 150
            },
            {
                title: '创建时间',
                key: 'createAt',
                dataIndex: 'createAt',
            },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                render: (status) => {
                    return <span style={{ color: status == "禁用" && '#666' }}>{status}</span>
                }
            },
            {
                title: '操作',
                key: '',
                dataIndex: '',
                render: (_, record) => {
                    
                    return <div>
                        {
                            record.actionList.map(item => {
                                if (item.type == 1) {
                                    const CopyLink = record.typeName.indexOf('A')>-1?`/${item.url}/1/${record.pageId}/0/1`:`/${item.url}/2/${record.pageId}/0/1`;
                                    const EditLink = record.typeName.indexOf('A')>-1?`/${item.url}/1/${record.pageId}/1/0`:`/${item.url}/2/${record.pageId}/1/0`
                                    if (item.name == "复制") {
                                        // 第一个是编辑，第二个是复制
                                        return <Link to={CopyLink}><span style={{ marginRight: 10 }}>{item.name}</span></Link>
                                    } else if (item.name == "编辑") {
                                        return <Link to={EditLink}><span style={{ marginRight: 10 }}>{item.name}</span></Link>
                                    }
                                } else {
                                    return <span onClick={this.handleShowModal.bind(this, record.pageId, item)}
                                        style={{ marginRight: 10, cursor: "pointer", color: item.name == "禁用" ? "red" : item.name == "启用" && "green" }}
                                    >
                                        {item.name}</span>
                                }
                            })
                        }
                    </div>
                }
            },

        ]
        return (
            <PageHeaderWrapper
                title="活动页面列表"
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
                            {Object.keys(isOnActMap).map(type => {
                                return <Select.Option value={type}>{isOnActMap[type]}</Select.Option>;
                            })}
                        </Select>
                        <Select
                            className={globalStyles['select-sift']}
                            onChange={this.handleSearchItem.bind(this, 'type')}
                            placeholder="模板名称"
                            allowClear
                            dropdownMatchSelectWidth={false}
                        >
                            <Select.Option value={''}>全部</Select.Option>
                            {Object.keys(typeMap).map(type => {
                                return <Select.Option value={type}>{typeMap[type]}</Select.Option>;
                            })}
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
                        bordered
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            onShowSizeChange: this.handleChangePageSize.bind(this),
                            onChange: this.handleChangeCurPage.bind(this),
                        }}
                    />
                </Card>
                <Modal title="确认"
                    visible={showModal}
                    onOk={this.handleConfirmOperate}
                    onCancel={this.handleCloseModal}
                >
                    <p>请确认是否{operateTypeText}</p>
                </Modal>
            </PageHeaderWrapper>
        )
    }
}
export default ActivityPageList;

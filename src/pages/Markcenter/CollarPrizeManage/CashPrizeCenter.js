import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
    Form,
    Input,
    Button,
    Alert,
    Divider,
    Modal,
    Radio,
    Select,
    Upload,
    Table,
    Icon,
    Affix,
    Tabs,
    Card,
    Checkbox,
    DatePicker,
    Tooltip,
} from 'antd';
import { getUrl } from '../../../utils/request';
import globalStyles from '@/global.less';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
// import styles from './style.less';
const { TextArea, Search } = Input;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
@connect(state => ({
    cashPrizeCenter: state.cashPrizeCenter,
}))
@Form.create()
class CashPrizeCenter extends React.PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
    }
    // componentWillUnmount() {
    //     // const { dispatch } = this.props;
    //     // dispatch({
    //     //   type: 'collarTicket/unmount',
    //     // });
    // }
    handleChangeCurrentPage = value => {
        const { dispatch } = this.props;
        dispatch({
            type: 'cashPrizeCenter/getList',
            payload: {
                currentPage: value,
            },
        });
    };
    handleChangePageSize = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'cashPrizeCenter/getList',
            payload: {
                pageSize,
            },
        });
    };
    render() {
        const {
            // form,
            // data,
            dispatch,
            cashPrizeCenter: {
                total,
                currentPage,
                list,
                tableLoading,
                pageSize,
                selectedRowIds,
                totalselectedRows,
            },
        } = this.props;
        const columns = [
            {
                title: '中奖时间',
                key: 'id',
                dataIndex: 'id',
                width: 300,
                
            },
            {
                title: '中奖状态',
                key: 'type',
                dataIndex: 'type',
            },
            {
                title: '活动类型',
                key: 'startAt',
                dataIndex: 'startAt',
                // render: (startAt, record) => {
                //     return (
                //         <div>
                //             <p>{startAt}</p>
                //             <p>{record.endAt}</p>
                //         </div>
                //     );
                // },
            },
            {
                title: '奖品类型',
                key: 'createAt',
                dataIndex: 'createAt',
            },
            {
                title: '中奖客户名',
                key: 'status',
                dataIndex: 'status',
                // render: (status, record) => {
                //     return <span style={{ color: record.statusColor }}>{status}</span>;
                // },
            },
            {
                title: '中奖客户手机号',
                key: 'remark',
                dataIndex: 'remark',
            },
            {
                title: '操作',
                key: 'actionList',
                dataIndex: 'actionList',
                width: 200,
               
            },
        ];
        // const onPrev = () => {
        //     // router.push(`/collarTicket/step-form/info/${type}/${id}`);
        //     router.push(`/collarTicket/step-form/info`);
        // };
        return (
            <PageHeaderWrapper
                title="兑奖中心"
            // tabActiveKey={location.pathname}
            // content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。"
            >
                <Card bordered={false}>
                    <span>活动类型：</span>
                    <Select
                        // value={}
                        className={globalStyles['select-sift']}
                        //   onChange={this.handleSelectSiftItem.bind(this, 'type')}
                        placeholder="请选择"
                    >
                        <Option value={''}>全部</Option>
                        {/* {Object.keys(typeMap).map(type => {
                            return <Option value={type}>{typeMap[type]}</Option>;
                        })} */}
                    </Select>
                    <span>中奖状态：</span>
                    <Select
                        value={status}
                        className={globalStyles['select-sift']}
                        // onChange={this.handleSelectSiftItem.bind(this, 'status')}
                        placeholder="请选择"
                    >
                        <Option value={''}>全部</Option>
                        {/* {comStatusMap.map(status => {
                            return <Option value={status}>{status}</Option>;
                        })} */}
                    </Select>
                    <Search
                        value={name}
                        className={globalStyles['input-sift']}
                        placeholder="领奖手机号"
                    // onChange={this.handleChangeSiftItem.bind(this, 'name')}
                    />
                    <span>中奖时间：</span>
                    <RangePicker
                    // className={globalStyles['select-sift']}
                    // onChange={this.handleChangeCreateTime}
                    />
                    <Button style={{margin:'0 10px'}} type='primary'>导出</Button>
                    <div>
                        <Button type='primary'>一键派奖</Button>
                    </div>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={list}
                        rowKey={record => record.id}
                        loading={tableLoading}
                        pagination={{
                            total,
                            current: currentPage,
                            pageSize,
                            showSizeChanger: true,
                            // onChange: this.handleChangeCurrentPage,
                            // onShowSizeChange: this.handleChangePageSize,
                        }}
                        rowSelection={{
                            selectedRowKeys: selectedRowIds,
                            // onChange: this.handleSelectRows.bind(this),
                            // getCheckboxProps: record => ({
                            //     disabled: totalselectedRows.some((goodsInfo) => {
                            //         return +record.goodsId === +goodsInfo.goodsId;
                            //     }),
                            // }),
                        }}
                    />
                </Card>
            </PageHeaderWrapper>

        );
    }
}

export default CashPrizeCenter;

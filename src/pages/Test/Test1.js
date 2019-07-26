import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, Table, Pagination, Select } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import globalStyles from '@/global.less';
import collect from '@/pages/Markcenter/activitySummary.less';
@connect(state => ({
    activityData: state.activitySummary,
}))
class ActivitySummary extends PureComponent {
    // 生命周期
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/getConfig',
        });
    }
   
    //   调用的方法
    tradeNameBarcode = (value, event) => {
        console.log(value, event, '5555');
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/getConfig',
            payload: {
                keywords: value,
            }
        })
    };
    activityId = (value) => {
        console.log(value, event, '5555');
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/updateActivity',
            payload: {
                activityId: value,
            }
        })
    }
    clickExpand = (expanded, record) => {
        const { dispatch } = this.props;
        console.log(expanded)
        dispatch({
            type: 'activitySummary/unfoldData',
            payload: {
                index: record.goodsId,
                expanded: expanded
            },
        });
    }
    onShowSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/updateActivity',
            payload: {
                pageSize,
            },
        });
    }
    onChange = (page, iii) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/updateActivity',
            payload: {
                page,
            },
        });
    }
    render() {
        const {
            activityData: {
                activityList,
                actGoodsList,
                nameBarcode,
                pageSize,
                totalCount,
                typeMap,
                page,
            }
        } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '主图',
                dataIndex: 'goodsImg',
                key: 'goodsImg',
            },
            {
                title: '条码',
                dataIndex: 'goodsSn',
                key: 'goodsSn',
            }, {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
            }, {
                title: '商品状态',
                dataIndex: 'goodsStatus',
                key: 'goodsStatus',
            }, {
                title: '可用库存',
                dataIndex: 'availableStock',
                key: 'availableStock',
            }, {
                title: '平台价',
                dataIndex: 'shopPrice',
                key: 'shopPrice',
            },
        ];
        const prompt = (
            <div>
                <span className={collect.title}>商品活动汇总表</span>
                <span>只展示针对商品的活动：限时特供、巨划算、拼团、单品直降、商品满减、满赠、贵宾活动；</span>
            </div>
        );
        const expandedRowRender = () => {
            console.log(activityList, '++返回的数据++++++');
            const columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '活动类型',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: '活动名称',
                    dataIndex: 'name',
                    key: 'name',
                }, {
                    title: '活动价',
                    dataIndex: 'actPrice',
                    key: 'actPrice',
                }, {
                    title: '活动已售数量',
                    dataIndex: 'saleCount',
                    key: 'saleCount',
                }, {
                    title: '活动时间',
                    dataIndex: 'activityTime',
                    key: 'activityTime',
                }, {
                    title: '创建时间',
                    dataIndex: 'createAt',
                    key: 'createAt',
                }, {
                    title: '活动状态',
                    dataIndex: 'actStatus.status',
                    key: 'actStatus.status',
                }, , {
                    title: '活动备注',
                    dataIndex: 'remark',
                    key: 'remark',
                }
            ];
            return <Table columns={columns} dataSource={activityList} pagination={false} />;
        }
        const isSearch = (value, event) => {
            console.log(value, event)
        }
        return (
            <PageHeaderWrapper

                prompt={prompt}
            >
                <Card>
                    <Row>
                        <Search placeholder="请输入商品名称/条码" className={globalStyles['input-sift']} onSearch={this.tradeNameBarcode.bind(this)} />
                        <Search placeholder="请输入活动ID/名称" className={globalStyles['input-sift']} onSearch={this.activityId.bind(this)} />
                        商品状态：
                        <Select placeholder="请选择" className={globalStyles['input-sift']} >
                            <Option value={''}>全部</Option>

                        </Select>
                        <Button type="primary">查询</Button>
                        <Button style={{ marginLeft: 20 }}>重置</Button>
                    </Row>
                    <Row>
                        <Table bordered={true} expandedRowRender={expandedRowRender} dataSource={actGoodsList} columns={columns} pagination={false} onExpand={this.clickExpand.bind(this)} />
                        <Pagination
                            total={totalCount}
                            showTotal={total => `总共${total}个结果`}
                            current={page}
                            pageSize={pageSize}
                            showSizeChanger={true}
                            onChange={this.onChange.bind(this)}
                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                        ></Pagination>
                    </Row>
                </Card>
            </PageHeaderWrapper>
        )
    }
}


ActivitySummary.propTypes = {};

export default ActivitySummary;

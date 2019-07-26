import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, Table, Pagination, Select } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import globalStyles from '@/global.less';
import collect from './activitySummary.less';
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
        dispatch({
            type:'activitySummary/activityconfig',
        })
       
    }

    //   调用的方法
    tradeNameBarcode = (value, event) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/getConfig',
            payload: {
                keywords: value,
            }
        })
    };
    clickExpand = (expanded, record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/unfoldData',
            payload: {
                index: record.goodsId,
                expanded: expanded
            },
        });
    }
    onShowSizeChange = (current, size) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/getConfig',
            payload: {
                pageSize:size,
                page:1,
            },
        });
    }
    isSelect = (value, option) => {
        const { dispatch } = this.props
        dispatch({
            type: 'activitySummary/getConfig',
            payload: {
                status: value,
            }
        })
    }
    isChange = (e)=>{
        const { dispatch } = this.props
        dispatch({
            type: 'activitySummary/updateActivity',
            payload: {
                keywords: e.target.value,
            }
        })
    }
    isSearch = (e)=>{
        const { dispatch } = this.props
        dispatch({
            type: 'activitySummary/getConfig',
            payload: {
                keywords: e,
            }
        })
    }
    changePagination = (page, iii) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'activitySummary/getConfig',
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
                pageSize,
                totalCount,
                page,
                publishStatusMap,
                keywords,
                rowKeys,
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
                render: (text, record) => {
                    return <img className={collect.thumImg} src={text} alt="" />
                }
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
                <span className={collect.promptLess}>只展示针对商品的活动：限时特供、巨划算、拼团、单品直降、商品满减、满赠、贵宾活动；</span>
            </div>
        );
        const expandedRowRender = () => {
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
                    dataIndex: 'startAt',
                    key: 'startAt',
                    render: (text, record) => {
                        return <div>
                            <p>{text}</p>
                            <p>{record.endAt}</p>
                        </div>
                    }
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
        return (
            <PageHeaderWrapper

                prompt={prompt}
            >
                <Card>
                    <Row>
                        <Search value={keywords}  
                        placeholder="请输入商品名称/条码" 
                        className={globalStyles['input-sift']} 
                        onSearch={this.isSearch}
                        onChange={this.isChange.bind(this)}
                         />
                        商品状态：
                        <Select placeholder="请选择" className={globalStyles['input-sift']} onChange={this.isSelect.bind(this)}>
                            <Option value={''}>全部</Option>
                            {Object.keys(publishStatusMap).map(type => {
                                return <Option value={type} key={type}>{publishStatusMap[type]}</Option>;
                            })}
                        </Select>
                    </Row>
                    <Row>
                        <Table bordered={true}  expandedRowRender={expandedRowRender} dataSource={actGoodsList} columns={columns} pagination={false} onExpand={this.clickExpand.bind(this)}  />
                        <div className={collect.pagination}>
                            <Pagination
                                total={totalCount}
                                showTotal={total => `总共${total}个结果`}
                                current={page}
                                pageSize={pageSize}
                                showSizeChanger={true}
                                onChange={this.changePagination.bind(this)}
                                onShowSizeChange={this.onShowSizeChange.bind(this)}
                            ></Pagination>
                        </div>
                    </Row>
                </Card>
            </PageHeaderWrapper>
        )
    }
}


// ActivitySummary.propTypes = {};

export default ActivitySummary;

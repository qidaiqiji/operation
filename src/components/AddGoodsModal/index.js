import React, { PureComponent, Fragment, Component } from 'react';
import { Input, Table, Modal, Select, Button, Row, Col, Message } from 'antd';
import moment from 'moment';
import globalStyles from '@/global.less'

class AddGoodsModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedRowIds:[],
            selectedRows:[]
        }
    }
    handleChangeItem=(type,e)=>{
        this.props.onChange({[type]:e.target.value})
    }
    handleSearchItem=(type,e)=>{
        this.props.onSearch({[type]:e})
    }
    handleSelectRows=(selectedRowIds,selectedRows)=>{
        this.setState({
            selectedRowIds,
            selectedRows,
        })
    }
    handleChangeCurPage=(currentPage)=>{
        this.props.onSearch({currentPage})

    }
    handleChangePageSize=(_,pageSize)=>{
        this.props.onSearch({pageSize})
    }
    confirmAdd=(selectedRows)=>{
        this.setState({
            selectedRowIds:[],
            selectedRows:[]
        })
        if(selectedRows.length == 0) {
            Message.error("请选择商品");
            return;
        }
        this.props.onOk(selectedRows)
        this.props.onClose()
    }
    render() {
        const {
            visible,
            onClose,
            onOk,
            dataSource,
            disabled,
            loading,
            currentPage,
            pageSize,
            total,
            config
        } = this.props;
        const columns = [
            {
                title: '主图',
                key: 'img',
                dataIndex: 'img',
                render:(img)=>{
                    return <img src={img} style={{width:40,height:40}}/>
                }
            },
            {
                title: '商品名称/条码',
                key: 'goodsName',
                dataIndex: 'goodsName',
                render:(goodsName,record)=>{
                    return <span>{goodsName}/{record.goodsSn}</span>
                }
            },
            {
                title: '商品状态',
                key: 'goodsStatus',
                dataIndex: 'goodsStatus',
            },
            {
                title: '可用库存',
                key: 'availableStock',
                dataIndex: 'availableStock',
            },
            {
                title: '平台价',
                key: 'shopPrice',
                dataIndex: 'shopPrice',
            },
            {
                title: '零售价',
                key: 'marketPrice',
                dataIndex: 'marketPrice',
            },
            // {
            //     title: '交叉不冲突的活动',
            //     key: 'noConflictList',
            //     dataIndex: 'noConflictList',
            //     render:(noConflictList)=>{
            //         return noConflictList.map(item=>(
            //             <span>{item}</span>
            //         ))
            //     }
            // },
            // {
            //     title: '冲突的活动',
            //     key: 'conflictList',
            //     dataIndex: 'conflictList',
            //     render:(conflictList)=>{
            //         return conflictList.map(item=>(
            //             <span>{item}</span>
            //         ))
            //     }
            // },
        ]
        return <Fragment>
            <Modal
                title={
                    <Row>
                        <Col span={20}>添加商品</Col>
                        <Col span={4}>
                            <Button type="primary" style={{ marginRight: 20 }} onClick={this.confirmAdd.bind(this,this.state.selectedRows)}>确定</Button>
                            <Button onClick={onClose}>取消</Button>
                        </Col>
                    </Row>
                }
                footer={null}
                visible={visible}
                width={1500}
                onCancel={onClose}
            >
                <Row style={{margin:'10px 0'}}>
                    <Input.Search
                    placeholder="请输入商品条码"
                    className={globalStyles['input-sift']} 
                    allowClear
                    onChange={this.handleChangeItem.bind(this,'goodsSn')}
                    onSearch={this.handleSearchItem.bind(this,'goodsSn')}
                    />
                    <Input.Search
                    placeholder="请输入商品名称"
                    className={globalStyles['input-sift']} 
                    allowClear
                    onChange={this.handleChangeItem.bind(this,'keywords')}
                    onSearch={this.handleSearchItem.bind(this,'keywords')}
                    />
                    <Input.Search
                    placeholder="请输入品牌名称"
                    className={globalStyles['input-sift']} 
                    allowClear
                    onChange={this.handleChangeItem.bind(this,'brandName')}
                    onSearch={this.handleSearchItem.bind(this,'brandName')}
                    />
                    商品状态：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'status')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    >
                        {
                            Object.keys(config.goodsStatusMap).map(item=>{
                                return <Select.Option value={item}>{config.goodsStatusMap[item]}</Select.Option>
                            })
                        }
                    </Select>
                    商品分类：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'catId')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    >
                        {
                            Object.keys(config.categoryMap).map(item=>{
                                return <Select.Option value={item}>{config.categoryMap[item]}</Select.Option>
                            })
                        }
                    </Select>
                </Row>
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    rowKey={row=>row.goodsId}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total,
                        onChange: this.handleChangeCurPage.bind(this),
                        onShowSizeChange: this.handleChangePageSize.bind(this),
                        showSizeChanger: true,
                    }}
                    rowSelection={{
                        selectedRowKeys: this.state.selectedRowIds,
                        onChange: this.handleSelectRows.bind(this),
                        getCheckboxProps: record => ({
                            disabled:record.disabled
                        }),
                    }}
                >
                </Table>
            </Modal>
        </Fragment>
    }
}
export default AddGoodsModal;
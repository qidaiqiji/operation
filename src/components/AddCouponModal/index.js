import React, { PureComponent, Fragment, Component } from 'react';
import { Input, Table, Modal, Select, Button, Row, Col, Message, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import globalStyles from '@/global.less'
class AddCouponModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedRowIds:[],
            selectedRows:[]
        }
        
    }
    handleSelectRows=(selectedRowIds,selectedRows)=>{
        this.setState({
            selectedRowIds,
            selectedRows,
        })
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
    handleChangeDate=(data,dataString)=>{
        this.props.onSearch({
            createAtStart:dataString[0],
            createAtEnd: dataString[1],
        })
    }
    handleChangeItem=(type,e)=>{
        this.props.onChange({[type]:e.target.value})
    }
    handleSearchItem=(type,e)=>{
        this.props.onSearch({[type]:e})
    }
    render() {
        const {
            visible,
            onClose,
            onOk,
            dataSource,
            disabled,
            loading,
        } = this.props;
        const columns = [
            {
                title: '优惠券ID',
                key: 'activityId',
                dataIndex: 'activityId',
            },
            {
                title: '优惠券名称',
                key: 'activityName',
                dataIndex: 'activityName',
            },
            {
                title: '面额/使用条件',
                key: 'cut',
                dataIndex: 'cut',
                render:(cut,record)=>{
                    return <span>{`${cut}/${record.above}`}</span>
                }
            },
            {
                title: '有效时间',
                key: 'validStart',
                dataIndex: 'validStart',
                width:200,
                render:(validStart,record)=>{
                    return <div>
                        <div>{validStart}</div>
                        <div>{record.validEnd}</div>
                    </div>
                }
            },
            {
                title: '商品范围',
                key: 'goodsRange',
                dataIndex: 'goodsRange',
            },
            {
                title: '发放方式',
                key: 'takeType',
                dataIndex: 'takeType',
            },
            {
                title: '发行总量',
                key: 'total',
                dataIndex: 'total',
            },
            {
                title: '已领取数量',
                key: 'takeNum',
                dataIndex: 'takeNum',
            },
            {
                title: '剩余未领数量',
                key: 'lastNum',
                dataIndex: 'lastNum',
            },
            {
                title: '已使用数量',
                key: 'useNum',
                dataIndex: 'useNum',
            },
            {
                title: '每人限领量',
                key: 'limit',
                dataIndex: 'limit',
            },
            {
                title: '活动状态',
                key: 'actStatus',
                dataIndex: 'actStatus',
            },
            {
                title: '发布状态',
                key: 'publishStatus',
                dataIndex: 'publishStatus',
            },
        ]
        return <Fragment>
            <Modal
                title={
                    <Row>
                        <Col span={20}>添加优惠券</Col>
                        <Col span={4}>
                            <Button type="primary" style={{ marginRight: 20 }}
                             onClick={this.confirmAdd.bind(this,this.state.selectedRows)}
                             >确定</Button>
                            <Button 
                            onClick={onClose}
                            >取消</Button>
                        </Col>
                    </Row>
                }
                footer={null}
                visible={visible}
                width={1500}
                // onCancel={onClose}
            >
                <Row style={{margin:'10px 0'}}>
                    <Input.Search
                    placeholder="请输入优惠券ID/名称"
                    className={globalStyles['input-sift']} 
                    allowClear
                    onChange={this.handleChangeItem.bind(this,'couponId')}
                    onSearch={this.handleSearchItem.bind(this,'couponId')}
                    />
                    有效时间：
                    <RangePicker
                    onChange={this.handleChangeDate}
                     />
                </Row>
                <Row>
                    商品范围：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'goodsRange')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                    发放方式：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'takeType')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                    活动状态：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'actStatus')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                    发布状态：
                    <Select
                    placeholder="请选择"
                    className={globalStyles['input-sift']} 
                    onChange={this.handleSearchItem.bind(this,'publishStatus')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                </Row>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    loading={loading}
                    rowKey={row=>row.activityId}
                    pagination={{
                        // current: currentPage,
                        // pageSize,
                        // total,
                        // onChange: this.handleChangeCurPage.bind(this),
                        // onShowSizeChange: this.handleChangePageSize.bind(this),
                        // showSizeChanger: true,
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
export default AddCouponModal;
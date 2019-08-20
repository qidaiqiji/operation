import React, { PureComponent, Fragment, Component } from 'react';
import { Input, Table, Modal, Select, Button, Row, Col, Message } from 'antd';
import moment from 'moment';
import globalStyles from '@/global.less'

class AddActModal extends Component {
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
            Message.error("请选择特卖专场");
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
                title: '特卖专场名称',
                key: 'name',
                dataIndex: 'name',
            },
            {
                title: '开始时间',
                key: 'startAt',
                dataIndex: 'startAt',
            },
            {
                title: '结束时间',
                key: 'endAt',
                dataIndex: 'endAt',
            },
        ]
        return <Fragment>
            <Modal
                title={
                    <Row>
                        <Col span={20}>添加特卖专场</Col>
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
                    placeholder="请输入特卖专场名称"
                    className={globalStyles['input-sift']} 
                    allowClear
                    onChange={this.handleChangeItem.bind(this,'name')}
                    onSearch={this.handleSearchItem.bind(this,'name')}
                    />
                </Row>
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    rowKey={row=>row.id}
                    total={total}
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
export default AddActModal;
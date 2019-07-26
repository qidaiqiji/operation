import React from 'react';
import { connect } from 'dva';
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
  Checkbox,
  Tooltip,
} from 'antd';
import { getUrl } from '../../../utils/request';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
const { TextArea, Search } = Input;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@connect(({ collarTicket, loading }) => ({
  submitting: loading.effects['collarTicket/submitStepForm'],
  data: collarTicket.step,
  collarTicket: collarTicket,
}))
@Form.create()
class Confirm extends React.PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    // console.log('this.props.match.params',this.props.match.params);
    // if (this.props.match.params.id != '') {
    //   dispatch({
    //     type: 'collarTicket/getActivityGoodsDetail',
    //     payload: {
    //       activityId: this.props.match.params.id,
    //       type: this.props.match.params.type,
    //     },
    //   });
    // }
    // dispatch({
    //   type: 'collarTicket/getConfig',
    //   payload: {},
    // });
  }
  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'collarTicket/unmount',
    // });
  }
  handlePublishTicket() {
    console.log('fabu');
    router.push('/markcenter/collar-ticket/over');
  }
  handleDeleteColumn(id) {
    const { dispatch, collarTicket } = this.props;
    const { ticketList } = collarTicket;
    // const index = ticketList.findIndex(element => element.id === id);
    // ticketList.splice(index, 1);
    console.log('ticketList111', ticketList);
    dispatch({
      type: 'collarTicket/onchangeticketList',
      payload: {
        idDelete: id,
      },
    });
  }
  handleAddTicket() {
    const { dispatch } = this.props;
    console.log('hhh');
    dispatch({
      type: 'collarTicket/onchangeAddTicket',
      // payload: {
      //   ticketList,
      // },
    });
  }
  render() {
    const {
      form,
      data,
      dispatch,
      collarTicket: {
        activeKey,
        ticketList,
        currentPage,
      },
    } = this.props;
    const { getFieldDecorator, validateFields } = form;

    const onPrev = () => {
      // router.push(`/collarTicket/step-form/info/${type}/${id}`);
      router.push(`/collarTicket/step-form/info`);
    };
    const columns = [
      {
        dataIndex: 'operation',
        key: 'operation',
        width: 80,
        align: 'center',
        render: (_, record) => (
          // console.log('record',record)
          record.isExtraRow ? null : (
            <Icon type="minus"
              style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }}
              onClick={this.handleDeleteColumn.bind(this, record.id)}
            />
          )

        ),
      },
      {
        title: 'ID序号',
        dataIndex: 'id',
        key: 'id',
        render: (_, record) => {
          if (record.isExtraRow && isNaN(record.id)) {
            return <Button type='primary' onClick={this.handleAddTicket.bind(this)}>
              {record.id}
            </Button>
          } else {
            return <span>{record.id}</span>
          }
        },
      },
      {
        title: '口令码',
        dataIndex: 'tcode',
        key: 'tcode',
        render: (_, record) => (
          record.isExtraRow ? null : <Input type="text" placeholder='填写口令' />
        ),
      },
      {
        title: '中奖奖品',
        dataIndex: 'jiang',
        key: 'jiang',
        render: (_, record) => {
          return record.isExtraRow ? '' : (
            < div >
              <Checkbox>  </Checkbox> <span>送优惠券</span>
              <Select
                showSearch
                placeholder="选择优惠券"
                style={{ width: 115, margin: '0 12px' }}
                // optionFilterProp="children"
                // filterOption={(input, option) => {
                //   return option.props.children.indexOf(input) >= 0;
                // }}
                style={{ width: 200 }}
              // value={brandList[brandId]}
              // onChange={this.handleSelected.bind(this)}
              >
                {/* {Object.keys(brandList).map(key => (
                  <Select.Option value={key}>{brandList[key]}</Select.Option>
                ))} */}
                <Select.Option value='1'>满一百减50</Select.Option>
                <Select.Option value='2'>满一百减30</Select.Option>
              </Select>
            </ div >
          )
        },
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        // align: 'center',
        render: (_, record) => {
          return record.isExtraRow ? '' : (<div><Input style={{ width: '200px', marginRight: '10px' }} type="number" placeholder='请填写库存张数' /><span  >张</span></div>)
        },
      },
    ];
    return (
      <div>
        <Tabs
          defaultActiveKey={activeKey}
        // onChange={this.changeTabKey.bind(this)}
        >
          <TabPane tab="优惠配置" key="1">
            <Table
              bordered
              // loading={isTableLoading}
              dataSource={ticketList.concat({ id: '新增奖品', isExtraRow: true })}
              columns={columns}
            // onChange={this.handleOnTableChange}
            // pagination={{
            //   current: currentPage,w
            //   // pageSize,
            //   // onShowSizeChange: this.handleChangePageSize,
            //   // onChange: this.handleChangeCurPage,
            //   showSizeChanger: true,
            //   // pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
            //   total,
            // }}
            pagination={false}
            />
          </TabPane>
        </Tabs>
        <div className={styles.fixedBottom}>
          <div>
            <Button onClick={onPrev}>返回修改活动信息</Button>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={this.handlePublishTicket.bind(this)}
            >
              确定发布
            </Button>
          </div>
        </div>

      </div>
    );
  }
}

export default Confirm;

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Divider, Table } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ collarTicket }) => ({
  // data: markcenter.basicInfo,
  collarTicket: collarTicket,
}))

class Over extends React.PureComponent {
  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   if (this.props.match.params.id != '') {
  //     dispatch({
  //       type: 'collarTicket/',
  //       payload: {
  //         activityId: this.props.match.params.id,
  //         type: this.props.match.params.type,
  //       },
  //     });
  //   }
  // }
  // handleGoList() {
  //   router.push(`/collarTicket/event-manage`);
  // }
  render() {
    const {
      //  data ,
      collarTicket: {

        id,
        type,
        ticketList
      },
    } = this.props;
    const onFinish = () => {
      // router.push(`/markCenter/step-form/confirm/${type}/${id}`);
      router.push(`/markCenter/step-form/confirm`);

    };
    const columns = [
      {
        title: 'ID序号',
        dataIndex: 'id',
        key: 'id',

      },
      {
        title: '口令码',
        dataIndex: 'tcode',
        key: 'tcode',
      },
      {
        title: '中奖奖品',
        dataIndex: 'jiang',
        key: 'jiang',
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        // align: 'center',
      },
    ];

    return (
      <div>
        <p className={styles.tab}>
          <span>已创建的口令券</span>
        </p>
        <Divider style={{ margin: '0px 0 20px' }} />
        <Table
          bordered
          // loading={isTableLoading}
          dataSource={ticketList}
          columns={columns}
          // onChange={this.handleOnTableChange}
          // pagination={{
          //   current: currentPage,
          //   // pageSize,
          //   // onShowSizeChange: this.handleChangePageSize,
          //   // onChange: this.handleChangeCurPage,
          //   showSizeChanger: true,
          //   // pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
          //   total,
          // }}
          pagination={false}
        />
        <div className={styles.fixedBottom}>
          <div>
            <Button onClick={onFinish}>修改活动</Button>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
            // onClick={this.handleGoList.bind(this)}
            >
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Over;

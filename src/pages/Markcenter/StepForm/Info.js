import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Checkbox,
  DatePicker,
  TimePicker,
  Row,
  Col,
} from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

// @connect(({ markcenter }) => ({
//   data: markcenter.step,
// }))
@connect(({ markcenter }) => ({
  markcenter: markcenter,
}))
@Form.create()
class Info extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    console.log('this.props.match.params', this.props.match.params, this.props);
    if (this.props.match.params.id != undefined) {
      console.log('jinru l ');
      dispatch({
        type: 'markcenter/getActivityDetail',
        payload: {
          activityId: this.props.match.params.id,
          type: this.props.match.params.type,
          copy: this.props.match.params.copy,
        },
      });
    }else{
      dispatch({
        type: 'markcenter/getListResolved',
        payload: {
          activityId: this.props.match.params.id,
          type: this.props.match.params.type,
          copy: this.props.match.params.copy,
        },
      });
    }


  }
  handleChangeRangePicker = (_, b) => {
    const { dispatch, markcenter } = this.props;
    const { basicInfo, activityStartTime } = markcenter;

    // if(Date.getTime(basicInfo.preAt)>(Date.getTime(b[0])){
    //   basicInfo['preAt'] = b[0]
    // }else if(basicInfo.preAt==''){
    //   basicInfo['preAt'] = b[0]
    // }
    basicInfo['preAt'] = b[0];

    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        isShowOverlayAct: b.every(item => !!item) ? true : false,
        basicInfo,
        activityStartTime: b[0],
      },
    });
    dispatch({
      type:'markcenter/getCompositionList',
      payload:{
        startTime:b[0],
        endTime:b[1]
      }
    })
  };
  disabledDate = current => {
    // Can not select days before today and today
    const { dispatch, markcenter } = this.props;
    const { activityStartTime } = markcenter;
    return current && current > moment(activityStartTime).endOf('day');
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/unmount',
    });
  }
  render() {
    const {
      markcenter: { basicInfo, activityList, isShowOverlayAct, activityStartTime },
      form,
      dispatch,
      // data
    } = this.props;
    console.log(this.props);
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        values['preAt'] = moment(values['preAt']).format('YYYY-MM-DD HH:mm:ss');
        if (!err) {
          dispatch({
            type: 'markcenter/getActivityId',
            payload: {
              basicInfo: values,
            },
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          {/* <Form.Item {...formItemLayout} label="促销范围">
            {getFieldDecorator('onPlatform', {
              initialValue: basicInfo.onPlatform,
            })(
              <Checkbox.Group style={{ width: '100%', lineHeight: '40px', height: '40px' }}>
                <Row>
                  <Col span={8}>
                    <Checkbox value="onApplet">小程序</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="onPC">PC商城</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item> */}
          <Form.Item {...formItemLayout} label="活动名称">
            {getFieldDecorator('name', {
              initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<Input placeholder="请输入活动名称，最多不能超过10个字" id="error" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="活动时间">
            {getFieldDecorator('rangeTimePicker', {
              rules: [{ type: 'array', required: true, message: '请选择时间' }],
              initialValue:
                basicInfo && basicInfo.startAt != ''
                  ? [moment(basicInfo.startAt), moment(basicInfo.endAt)]
                  : [],
            })(
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.handleChangeRangePicker}
              />
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="预热开始时间">
            {getFieldDecorator('preAt', {
              rules: [{ required: true, message: '请选择时间' }],
              initialValue: basicInfo && basicInfo.preAt ? moment(basicInfo.preAt) : null,
            })(
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={this.disabledDate} disabled={!isShowOverlayAct}/>
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="宣传导语">
            {getFieldDecorator('guideText', {
              initialValue: basicInfo && basicInfo.guideText,
              rules: [{ max: 12, message: '最多不能超过12个字' }],
            })(<Input placeholder="请输入宣传导语，最多可输入12个字" />)}
          </Form.Item>
          {/* <Form.Item {...formItemLayout} label="活动规则">
            {getFieldDecorator('desc', {
              initialValue: basicInfo.desc,
              rules: [{ required: true, message: '请输入活动规则' }],
            })(<Input placeholder="请输入活动规则，设置后仅在小程序端展示" />)}
          </Form.Item> */}
          {isShowOverlayAct ? (
            <Form.Item {...formItemLayout} label="允许叠加的活动">
              {getFieldDecorator('activityIdList', {
                initialValue: basicInfo && basicInfo.activityIdList,
              })(
                <Checkbox.Group style={{ width: '100%', lineHeight: '40px', marginLeft: '20px' }}>
                  <Row>
                    {activityList.length > 0
                      ? activityList.map((item, index) =>
                          index === 0 ? (
                            <Col span={20} key={index}>
                              <Checkbox value={item.activityId}>{item.name}</Checkbox>
                            </Col>
                          ) : (
                            <Col span={10} key={index}>
                              <Checkbox value={item.activityId}>{item.name}</Checkbox>
                            </Col>
                          )
                        )
                      : null}
                  </Row>
                </Checkbox.Group>
              )}
            </Form.Item>
          ) : null}

          <Form.Item {...formItemLayout} label="活动备注">
            {getFieldDecorator('remark', {
              initialValue: basicInfo && basicInfo.remark,
              // rules: [{ required: true, message: '请输入活动备注' }],
            })(<Input placeholder="仅供运营做相关活动信息的备注，不会显示在用户界面上" />)}
          </Form.Item>
          <div className={styles.fixedBottom}>
            <Form.Item>
              <Button type="primary" onClick={onValidateForm}>
                下一步
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default Info;

import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Steps, Icon, Spin, Form, Input, Radio, Checkbox, Select, DatePicker, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './style.less';
const { TextArea, Search } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
};
const formItemLayoutMin = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
@connect(({ createCoupons, loading }) => ({
  createCoupons,
}))
@Form.create()
class CreateCoupons extends Component{





  changeIndateType=(e)=>{
    const { dispatch } = this.props
        dispatch({
          type:'createCoupons/getStateResolved',
          payload:{
            indateType:e.target.value =='2'?true:false
          }
        })
    
  console.log(e) 
}
  

  render(){

    const {
      createCoupons: { indateType },
      form,
      dispatch,
      // data
    } = this.props;
    console.log(this.props);
    const { getFieldDecorator, validateFields } = form;
    // const onValidateForm = () => {
    //   validateFields((err, values) => {
    //     values['preAt'] = moment(values['preAt']).format('YYYY-MM-DD HH:mm:ss');
    //     if (!err) {
    //       dispatch({
    //         type: 'markcenter/getActivityId',
    //         payload: {
    //           basicInfo: values,
    //         },
    //       });
    //     }
    //   });
    // };
   return (
    <PageHeaderWrapper
    title='创建优惠券'
  >
    <Card bordered={false}>
      <div>
        <div>基础内容</div>
 
      <Form.Item {...formItemLayout} label="领取方式">
            {getFieldDecorator('name12', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(  <Radio.Group>
              {
                 Object.entries({"1":"自主领取","2":"直接发放"}).map(item=>
                  <Radio value={item[0]}>{item[1]}</Radio>
                  )
              }
            </Radio.Group>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="优惠券名称">
            {getFieldDecorator('name2', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<Input placeholder="请输入活动名称，最多不能超过10个字" id="error" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="允许叠加的活动">
              {getFieldDecorator('activityIdList', {
                // initialValue: basicInfo && basicInfo.activityIdList,
              })(
                <Checkbox.Group style={{ width: '100%', lineHeight: '40px', marginLeft: '20px' }}>
                  <Row>
                    {/* {activityList.length > 0
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
                      : null} */}
                                                  <Col span={10} >
                              <Checkbox value={1}>1</Checkbox>
                            </Col>
                            <Col span={10}>
                              <Checkbox value={2}>2</Checkbox>
                            </Col>
                  </Row>
                </Checkbox.Group>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="活动备注">
            {getFieldDecorator('remark', {
              // initialValue: basicInfo && basicInfo.remark,
              // rules: [{ required: true, message: '请输入活动备注' }],
            })(<TextArea rows={3} placeholder="仅供运营做相关活动信息的备注，不会显示在用户界面上" />)}
          </Form.Item>

      </div>
      <div>
            <div>基础信息</div>
            <Form.Item {...formItemLayout} label="优惠券面值">
            {getFieldDecorator('name', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<p style={{display:'flex'}}><Input placeholder="请输入活动名称，最多不能超过10个字"/><span style={{marginLeft:'20px'}}> 元</span></p>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="使用条件：满">
            {getFieldDecorator('name', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<p style={{display:'flex'}}><Input placeholder="请输入活动名称，最多不能超过10个字"/><span style={{minWidth:'100px',marginLeft:'20px'}}>元可用</span></p>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="发放时间">
            {getFieldDecorator('rangeTimePicker', {
              rules: [{ type: 'array', required: true, message: '请选择时间' }],
              // initialValue:
              //   basicInfo && basicInfo.startAt != ''
              //     ? [moment(basicInfo.startAt), moment(basicInfo.endAt)]
              //     : [],
            })(
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.handleChangeRangePicker}
              />
            )}
          </Form.Item>

              <Row>
                <Col span={6}>
                <Form.Item {...formItemLayoutMin} label="发放数量">
            {getFieldDecorator('name', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
              ],
            })(<p style={{display:'flex'}}><Input placeholder="0"/><span style={{marginLeft:'20px'}}>张</span></p>)}
          </Form.Item>
                </Col>
                <Col span={6}>
                <Form.Item {...formItemLayoutMin} label="每人领取">
            {getFieldDecorator('name', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
              ],
            })(<p style={{display:'flex'}}><Input placeholder="0"/><span style={{marginLeft:'20px'}}>张</span></p>)}
          </Form.Item>
                </Col>
                <Col span={2}>
                <Icon type="warning" theme="filled" twoToneColor="#eb2f96" style={{color:'#ff3366',fontSize:'30px'}} />
                <span>0 表示不限制</span>
                </Col>
              </Row>
              <Form.Item {...formItemLayout} label="有效期类型">
            {getFieldDecorator('name1', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(  <Radio.Group onChange={this.changeIndateType}>
              {
                 Object.entries({"1":"自主领取","2":"直接发放"}).map(item=>
                  <Radio value={item[0]}>{item[1]}</Radio>
                  )
              }
            </Radio.Group>)}
          </Form.Item>
            {
              indateType?(
                <Form.Item {...formItemLayout} label="有效时间">
                {getFieldDecorator('name', {
                  // initialValue: basicInfo && basicInfo.name,
                  rules: [
                    { required: true, message: '请输入活动名称' },
                    { max: 10, message: '最多不能超过10个字' },
                  ],
                })(<p style={{display:'flex'}}>领取成功起，<Input placeholder="0"/><span style={{marginLeft:'20px'}}>天过期</span></p>)}
              </Form.Item>
              ):(
                <Form.Item {...formItemLayout} label="有效时间">
                {getFieldDecorator('rangeTimePicker', {
                  rules: [{ type: 'array', required: true, message: '请选择时间' }],
                  // initialValue:
                  //   basicInfo && basicInfo.startAt != ''
                  //     ? [moment(basicInfo.startAt), moment(basicInfo.endAt)]
                  //     : [],
                })(
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.handleChangeRangePicker}
                  />
                )}
              </Form.Item>
              )
            }
        

          <Form.Item {...formItemLayout} label="活动名称">
            {getFieldDecorator('name', {
              // initialValue: basicInfo && basicInfo.name,
              rules: [
                { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<Input placeholder="请输入活动名称，最多不能超过10个字" id="error" />)}
          </Form.Item>
      </div>
    </Card>
</PageHeaderWrapper>
     );
   }
};


export default CreateCoupons;
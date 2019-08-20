import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, Form, DatePicker, Checkbox , Col } from 'antd';
const { RangePicker } = DatePicker;
import moment from 'moment';
import globalStyles from '@/global.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
@Form.create()
@connect(({ createPages }) => ({
    createPages,
}))
class CreatePages extends PureComponent {
    componentDidMount(){
        const { dispatch } = this.props;
        const { type, id, copy, edit } = this.props.match.params;
        if(id){
            dispatch({
                type:'createPages/getDetail',
                payload:{
                    pageId:id,
                    copy,
                    edit,
                    type,
                    oldId:copy?id:0
                }
            })
        }else{
            dispatch({
                type:'createPages/updatePageReducer',
                payload:{
                    type,
                    edit:0,
                    copy:0,
                }
            })
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type:'createPages/unmountReducer',
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type:'createPages/submitInfo',
                    payload:{
                       ...values
                    }
                })
            }
        });
    }
    handleChangeDate=(date,dateString)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'createPages/updatePageReducer',
            payload:{
                startAt:moment(dateString[0]).format('YYYY-MM-DD HH:mm:ss'),
                endAt:moment(dateString[1]).format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    }
    render() {
        const {
            form,
            createPages: {
                name, 
                onPlatform, 
                remark, 
                startAt, 
                endAt
            }
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 7,
            },
        }
        return (
            <PageHeaderWrapper
                title="创建基础信息"
            >
                <Card>
                    <Row><b>基础信息</b></Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={10} push={2}>
                                <Form.Item>
                                    {getFieldDecorator('onPlatform', {
                                        initialValue:onPlatform,
                                    })(
                                        <Checkbox.Group>
                                            <Checkbox value={"onPC"}>PC端</Checkbox >
                                            <Checkbox value={"onApplet"}>小程序</Checkbox >
                                        </Checkbox.Group>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="页面名称"  {...formItemLayout}>
                            {getFieldDecorator('name', {
                                initialValue:name,
                                rules: [
                                    {
                                        max: 6,
                                        message: "最多输入6个汉字"
                                    },
                                    {
                                        required: true,
                                        message: "请输入页面名称"
                                    }
                                ]
                            })(
                                <Input placeholder="请输入页面名称，最多可输入6个汉字" />
                            )}
                        </Form.Item>
                        <Form.Item label="有效时间" {...formItemLayout}>
                            {getFieldDecorator('date', {
                                initialValue:startAt?[moment(startAt), moment(endAt)]:[],
                                rules: [
                                    {
                                        required: true,
                                        message: "请选择有效时间"
                                    }
                                ]
                            })(
                                <RangePicker 
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                                onChange={this.handleChangeDate}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="备注" {...formItemLayout}>
                            {getFieldDecorator('remark', {
                                initialValue:remark,
                                rules: [
                                    {
                                        whitespace: true,
                                        message: "不可输入空格"
                                    }
                                ]
                            })(
                                <Input.TextArea
                                    rows={5}
                                />
                            )}
                        </Form.Item>
                        <div className={globalStyles.fixedBottom}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{marginLeft:40}}>
                                    下一步
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        )
    }
}
export default CreatePages;

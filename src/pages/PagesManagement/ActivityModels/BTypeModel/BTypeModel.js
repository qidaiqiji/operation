import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Button, Table, Pagination, Select, Form, Tabs } from 'antd';
const { Search } = Input;
const { Option } = Select;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CommonPart from '../Components/CommonPart';
import globalStyles from '@/global.less';
@connect(state => ({
    bTypeModel: state.bTypeModel,
}))
class BTypeModel extends PureComponent {
    render() {
        const {
            bTypeModel: {


            }
        } = this.props;
        const pcLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 18,
            },
        }
        class PCPart extends PureComponent {
            handleSubmit = (e) => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                  if (!err) {
                    console.log("values",values)
                  }
                });
              }
            render() {
                const { form } = this.props;
                const { getFieldDecorator } = form;
                return (
                    <Form onSubmit={this.handleSubmit}>
                        <CommonPart getFieldDecorator={getFieldDecorator} />
                        
                    </Form>
                )
            }

        }
        PCPart = Form.create()(PCPart)
        return (
            <PageHeaderWrapper
            >
                <Card>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="PC端" key="1">
                            <CommonPart type="1"/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="小程序" key="2">
                            <CommonPart type="2"/>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </PageHeaderWrapper>
        )
    }
}
export default BTypeModel;

import { Row, Col,Form, Input } from 'antd';
function PCandWXNum({ data, keyWords, getFieldDecorator, disabled=true }) {
    const pcAndWXNumLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    }
    return <Row>
        <Col span={8}>
            <Form.Item label="PC展示数量" {...pcAndWXNumLayout}>
                {getFieldDecorator(`${keyWords}.pcNum`, {
                    initialValue: data.pcNum,
                    rules: [
                        { required: true, message: '请输入PC展示数量' }
                    ]
                })(
                    <Input disabled={disabled}/>
                )}
            </Form.Item>
        </Col>
        <Col span={8}>
            <Form.Item label="小程序展示数量" {...pcAndWXNumLayout}>
                {getFieldDecorator(`${keyWords}.xcxNum`, {
                    initialValue: data.xcxNum,
                    rules: [
                        { required: true, message: '请输入小程序展示数量' }
                    ]
                })(
                    <Input disabled={disabled}/>
                )}
            </Form.Item>
        </Col>
    </Row>
}
export default PCandWXNum;
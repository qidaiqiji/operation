import React, { Fragment } from 'react';
import cloneDeep from 'lodash/cloneDeep';
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
  Upload,
  Row,
  Icon,
  Modal,
  message,
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
@connect(state => ({
  collarTicket: state.collarTicket,
}))
@Form.create()
// const imgDivComponent = React.createClass({
//   render: function () {
//     return <div>
//      <img src={this.props.fileList.thumbUrl} alt=""/>
//     </div>
//   }
// });
// ReactDOM.render(
//   <imgDivComponent/>,
//   document.getElementById('continer')
// )
class Info extends React.PureComponent {
  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   console.log('this.props.match.params', this.props.match.params);
  //   if (this.props.match.params.id != undefined) {
  //     dispatch({
  //       type: 'collarTicket/getActivityDetail',
  //       payload: {
  //         activityId: this.props.match.params.id,
  //         type: this.props.match.params.type,

  //       },
  //     });
  //   }
  //   dispatch({
  //     type: 'collarTicket/getListResolved',
  //     payload: {
  //       type: this.props.match.params.type,
  //       activityId: this.props.match.params.id,

  //     },
  //   });
  // }
  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'collarTicket/unmount',
  //   });
  // }
  render() {
    const {
      collarTicket: {
        fileList,
        loading,
        files,
        // thumbUrl,
        previewVisible,
      },
      form,
      dispatch,
      // data
    } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'collarTicket/updatePageRducer',
            payload: {
              basicInfo: values,
            },
          });
        }
        router.push('/markcenter/collar-ticket/confirm');

      });
    };
    const uploadButton = (
      <div className={styles.upButton}>
        <Icon style={{ fontSize: '40px' }} type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传活动背景</div>
      </div>
    );

    const props = {
      onRemove: (file) => {
        const { dispatch } = this.props;
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        dispatch({
          type: 'collarTicket/updatePageRducer',
          payload: {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: (file) => {
        const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
        const isLt15M = file.size / 1024 / 1024 < 0.5;
        if (!isLt15M) {
          message.error('文件大小超出500k');
          return;
        }
        if (!isIMG) {
          message.error('请上传图片');
          return;
        }
        const { dispatch, collarTicket } = this.props;
        const { files, imgUrl } = collarTicket;
        const basicInfo = this.props.form.getFieldsValue();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          file.thumbUrl = e.target.result;
          const { dispatch } = this.props;
          const { fileList,basicInfo,previewVisible } = collarTicket;
          dispatch({
            type: 'collarTicket/updatePageRducer',
            payload: {
              fileList: [...fileList,file],
              basicInfo,
              previewVisible: true,
            }
          })
        };
        // files.push(file);
        // console.log('files2', files);

        // let count = [];
        // files.map((item, index) => {
        //   if (item.status === "removed") {
        //     files.splice(index, 1);
        //   }
        //   if (file.name === item.name) {
        //     count.push(index);
        //     if (count.length > 1) {
        //       message.error("文件已存在!");
        //       files.splice(index, 1);
        //       return;
        //     }
        //     console.log("count", count)
        //   }
        // })
        return false;
      },
      fileList: fileList,
      listType: "picture",
      multiple: true,
    }

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} >
          <Form.Item {...formItemLayout} label="活动名称"
          >
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                // { required: true, message: '请输入活动名称' },
                { max: 10, message: '最多不能超过10个字' },
              ],
            })(<Input placeholder="请输入活动名称，最多不能超过10个字" id="error" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="活动时间">
            {getFieldDecorator('rangeTimePicker', {
              rules: [{ type: 'array', required: true, message: '请选择时间' }],
              // initialValue: basicInfo.startAt != '' ? [moment(basicInfo.startAt), moment(basicInfo.endAt)] : '',
            })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </Form.Item>
          {/* <Form.Item {...formItemLayout} label="活动规则">
            {getFieldDecorator('desc', {
              initialValue: 'basicInfo.desc',
              rules: [{ required: true, message: '请输入活动规则' }],
            })(<Input placeholder="请输入活动规则，设置后仅在小程序端展示" />)}
          </Form.Item> */}
          <Form.Item {...formItemLayout} label="活动备注">
            {getFieldDecorator('remark', {
              initialValue: 'basicInfo.remark',
              // rules: [{ required: true, message: '请输入活动备注' }],
            })(<Input placeholder="仅供运营做相关活动信息的备注，不会显示在用户界面上" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="兑换次数">
            <Row gutter={8}>
              <Col span={13}>
                {getFieldDecorator('remark', {
                  initialValue: 0,
                  // rules: [{ required: true, message: '请输入活动备注' }],
                })(<div><span style={{ textAlign: 'center', display: 'inline-block', width: '80px', height: '32px', lineHeight: '32px', background: '#F2F2F2' }}>每人可兑换</span><Input style={{ width: '100px' }} type='number' placeholder="请输入" /></div>)}
              </Col>
              <Col span={10}>
                {getFieldDecorator('select', {
                  initialValue: '次/活动全程',
                  // rules: [{ required: true, message: '请输入活动备注' }],
                })(<Select placeholder="Please select a country">
                  <Option value="china">次/活动全程</Option>
                  <Option value="usa">次/每日</Option>
                </Select>)}
              </Col>
            </Row>
          </Form.Item>
          <div style={{ verticalAlign: 'top' }}>
            <span style={{ marginLeft: '30px', display: 'inline-block', height: '150px' }}>活动背景：</span>
            <div className={styles.uploadBox}>
              <Upload
                listType="picture-card"
                {...props}
              >
                {/* {console.log(fileList,'fileList')}{console.log(fileList.thumbUrl,'fileListimg')} */}
                {/* {fileList.map(item=>{
              <img src={item.thumbUrl} alt=""/>
            })} */}
                {fileList.length > 0 ? '' : uploadButton}

              </Upload>
              <p style={{ marginBottom: '5px' }}>750*1334像素，支持PNG、JPG格式，小于500KB</p>
            </div>
            {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          {console.log(fileList,'yyy')}
          <img alt="example" style={{ width: '100%' }} src={fileList.thumbUrl} />
        </Modal> */}
            {/* {fileList.map(item => {
              <img className={styles.imgBox} style={{ width: '111px', display: 'block' }} src={item.imgUrl} alt="" />
            })} */}

          </div>
          <div className={styles.fixedBottom} id='continer'>
            <Form.Item>
              <Button type="primary" onClick={onValidateForm}>
                下一步
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fragment >
    );
  }
}

export default Info;

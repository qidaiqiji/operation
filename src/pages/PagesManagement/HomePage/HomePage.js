import React, { Fragement } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Table, Row, Col, Select, Input, Popconfirm, Modal, Form, Radio, Icon, Upload, AutoComplete } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ManualUpload from '@/components/ManualUpload';
import AddGoodsModal from '@/components/AddGoodsModal';
import PostPicture from '@/components/PostPicture';
import PCandWXNum from './PCandWXNum';
import ImgBox from './ImgBox';
import UploadBox from './UploadBox';
import globalStyles from '@/global.less';
import styles from "./index.less";

const { Search } = Input;
const { Option } = Select;
const colorMap = [
  {
    color: '#dd3450',
    name: '赤红',
  },
  {
    color: '#f75632',
    name: '绯红',
  },
  {
    color: '#7fb80e',
    name: '诺绿',
  },
  {
    color: '#00a6ac',
    name: '浅葱',
  },
  {
    color: '#f9872b',
    name: '琥珀',
  }, {
    color: '#9814ef',
    name: '江户紫',
  },
  {
    color: '#0a985d',
    name: '绿青',
  },
  {
    color: '#eb1e7c',
    name: '牡丹',
  },
  {
    color: '#00b4ff',
    name: '群青',
  },
  {
    color: '#eb951b',
    name: '镉黄',
  },
  {
    color: '#FF3366',
    name: '迪瓦粉',
  },
]
@connect(({ loading, homePage, resourcePool }) => ({
  homePage,
  loading: loading.effects['homePage/getList'],
  resourcePool
}))
@Form.create({
  onValuesChange(props, changedValue, allValue) {
    const { dispatch } = props;
    const { resetFields } = props.form;
    resetFields()
    dispatch({
      type: 'homePage/onChangeValue',
      payload: {
        allValue,
      }
    })
  }
})
class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/getDetail'
    })
    dispatch({
      type: 'homePage/getConfig'
    })
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/unmountReducer'
    })
  }
  handleUpload = (currentIndex, file) => {
    const { dispatch, homePage } = this.props;
    const { status, response } = file.file;
    const { infoDetail } = homePage;
    if (status == "done") {
      if (currentIndex != null) {
        infoDetail.diamondInfo[currentIndex].img = response.data.imgs[0].imgId;
        infoDetail.diamondInfo[currentIndex].imgUrl = response.data.imgs[0].url;
      } else {
        infoDetail.baseInfo.logo = response.data.imgs[0].imgId;
        infoDetail.baseInfo.logoUrl = response.data.imgs[0].url;
      }
    }
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleCloseModal = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        [type]: false
      }
    })
  }
  handleSearchList = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/getList',
      payload: {
        ...payload
      }
    })
  }
  handleShowModal = (currentIndex) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/getList',
      payload: {
        showGoodsModal: true,
        currentIndex,
      }
    })
  }
  handleAddGoods = (selectedRows, selectedRowIds) => {
    const { dispatch, homePage } = this.props;
    const { currentIndex, infoDetail } = homePage;
    infoDetail.channelInfo.info[currentIndex].goodsList.push(...selectedRows);
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail,
      }
    })
  }
  handleResourceUpload = (choseNum, currentIndex) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        isShowUploadSucaiModal: true,
        choseNum,
        currentIndex,
      }
    })
  }
  handleConfirmSelectPic = () => {
    const { dispatch, resourcePool, homePage } = this.props;
    const { selectedPictureList } = resourcePool;
    const { currentIndex, infoDetail } = homePage;
    if (currentIndex != null) {
      infoDetail.diamondInfo[currentIndex].img = selectedPictureList[0].imgId;
      infoDetail.diamondInfo[currentIndex].imgUrl = selectedPictureList[0].url;
    } else {
      infoDetail.baseInfo.logo = selectedPictureList[0].imgId;
      infoDetail.baseInfo.logoUrl = selectedPictureList[0].url;
    }
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail,
        isShowUploadSucaiModal: false
      }
    })
    dispatch({
      type: 'resourcePool/clearChosedList',
    })
  }
  handleDeleteImg = (type, currentIndex, subIndex) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    if (currentIndex != null) {
      if (type == "goods") {
        infoDetail.channelInfo.info[currentIndex].goodsList.splice(subIndex, 1)
      } else {
        infoDetail.diamondInfo[currentIndex].img = "";
        infoDetail.diamondInfo[currentIndex].imgUrl = "";
      }
    } else {
      infoDetail.baseInfo.logo = "";
      infoDetail.baseInfo.logoUrl = "";
    }
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail,
      }
    })
  }
  handleAddItem = (type, currentIndex, reset) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    if (type == "nav") {
      infoDetail.navInfo.push({
        title: "",
        sortOrder: "",
        link: "",
      })
    } else {
      infoDetail.leftCategory[currentIndex].childCategory.push({
        title: "",
        link: "",
        sortOrder: "",
        isShow: 1,
      })
    }
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail,
      }
    })
    reset();
  }
  handleReduceItem = (type, currentIndex, subIndex, reset) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    if (type == "nav") {
      infoDetail.navInfo.splice(currentIndex, 1)
    } else {
      infoDetail.leftCategory[currentIndex].childCategory.splice(subIndex, 1)
    }
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail,
      }
    })
    reset();
  }
  handleChangeColor = (e) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    infoDetail.baseInfo.color = e.target.value;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleAddPcLeft = () => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    infoDetail.leftCategory.push({
      mainCategory: {},
      childCategory: [{
        title: "",
        link: "",
        sortOrder: "",
        isShow: 1,
      }]
    })
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleDeleteItem = (index) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    infoDetail.leftCategory.splice(index, 1);
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'homePage/submitInfo',
        })
      }
    });
  }
  handleTriggerShowBtn = (index) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    infoDetail.porcelainInfo[index].isShowBtn = !infoDetail.porcelainInfo[index].isShowBtn;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleChangeSelectType = (index, type) => {
    const { dispatch, homePage } = this.props;
    const { infoDetail } = homePage;
    infoDetail.porcelainInfo[index].type = type;
    infoDetail.porcelainInfo[index].isShowBtn = false;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        infoDetail
      }
    })
  }
  handleChangeList = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/updatePageReducer',
      payload: {
        ...payload
      }
    })
  }
  handleSearchList = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/getList',
      payload: {
        ...payload,
      }
    })
  }
  render() {
    const {
      form,
      loading,
      homePage: {
        infoDetail,
        goodsList,
        showGoodsModal,
        goodsStatusMap,
        categoryMap,
        total,
        pageSize,
        currentPage,
        isShowUploadSucaiModal,
        choseNum,
        diamondItemMap,
        firstClassCatMap,
        cardLoading
      }
    } = this.props;
    console.log("ddd",infoDetail)
    const { getFieldDecorator, resetFields } = form;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 10,
      },
    };
    return (
      <div>
        <PageHeaderWrapper title="首页配置">
          <Card bordered loading={cardLoading}>
            <Form onSubmit={this.handleSubmit}>
              <Row className={styles.title}>基本配置</Row>
              <Card bordered>
                <Row>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="全局背景色">
                      {getFieldDecorator('baseInfo.color', {
                        initialValue: infoDetail.baseInfo.color,
                        rules: [
                          {
                            required: true,
                            message: "请选择全局背景色",
                          },
                        ],
                      })(
                        <AutoComplete
                          dataSource={colorMap.map(item => (
                            <Select.Option
                              value={item.color}
                              style={{ background: item.color }}
                            >
                              {item.color}
                            </Select.Option>
                          ))}
                        >
                          <Input
                            value={infoDetail.baseInfo.color}
                            onBlur={this.handleChangeColor.bind(this)}
                          />
                        </AutoComplete>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="SEO关键字">
                      {getFieldDecorator(`baseInfo.keywords`, {
                        initialValue: infoDetail.baseInfo.keywords,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div style={{ marginLeft: 10, float: 'left' }} >
                      <span>LOGO图片：</span>
                    </div>
                    {
                      infoDetail.baseInfo.logo && <ImgBox src={infoDetail.baseInfo.logoUrl} onDeleteImg={this.handleDeleteImg.bind(this, 'logo')} />
                    }
                    {
                      !infoDetail.baseInfo.logo && <UploadBox
                        onUpload={this.handleUpload}
                        onResourceUpload={this.handleResourceUpload}
                      />
                    }
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formItemLayout} label="页面描述">
                      {getFieldDecorator(`baseInfo.desc`, {
                        initialValue: infoDetail.baseInfo.desc,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Row className={styles.title}>PC导航栏</Row>
              <Card bordered>
                {
                  infoDetail.navInfo.map((item, index) => (
                    <PcPart
                      navInfoItem={item}
                      index={index}
                      onAddItem={this.handleAddItem}
                      onReduceItem={this.handleReduceItem}
                      getFieldDecorator={getFieldDecorator}
                      resetFields={resetFields}
                    />
                  ))
                }
              </Card>
              <Row className={styles.title} type="flex" justify="space-between">
                <Col span={2}>PC左侧分类</Col>
                <Col span={1}><Button onClick={this.handleAddPcLeft}>新增</Button></Col>
              </Row>
              {
                infoDetail.leftCategory.map((item, index) => (
                  <PcLeft
                    data={item}
                    index={index}
                    onAddItem={this.handleAddItem}
                    onReduceItem={this.handleReduceItem}
                    getFieldDecorator={getFieldDecorator}
                    resetFields={resetFields}
                    firstClassCatMap={firstClassCatMap}
                    deleteItem={this.handleDeleteItem}
                  />
                ))
              }
              <Row className={styles.title}>金刚区</Row>
              <div className={styles.card}>
                {
                  infoDetail.diamondInfo.map((item, index) => (
                    <IconArea data={item} index={index}
                      onUpload={this.handleUpload}
                      onResourceUpload={this.handleResourceUpload}
                      onDeleteImg={this.handleDeleteImg.bind(this, "iconArea")}
                      getFieldDecorator={getFieldDecorator}
                      diamondItemMap={diamondItemMap}
                    />
                  ))
                }
              </div>
              {/* 瓷片区 */}
              <Row className={styles.title}>瓷片区</Row>
              <div className={styles.card}>
                {
                  infoDetail.porcelainInfo.map((item, index) => (
                    <StaticArea
                      data={item}
                      index={index}
                      getFieldDecorator={getFieldDecorator}
                      triggerShowBtn={this.handleTriggerShowBtn}
                      selectType={this.handleChangeSelectType}
                    />
                  ))
                }
              </div>
              <Row className={styles.title}>精选频道</Row>
              <Card>
                <SelectChanel data={infoDetail.channelInfo}
                  onShowModal={this.handleShowModal}
                  getFieldDecorator={getFieldDecorator}
                  onDeleteImg={this.handleDeleteImg.bind(this, 'goods')}
                />
              </Card>
              <Row className={styles.title}>特卖专场</Row>
              <Card>
                <PCandWXNum
                  data={infoDetail.actPageInfo}
                  keyWords="actPageInfo"
                  getFieldDecorator={getFieldDecorator}
                  disabled={false}
                />
              </Card>
              <Row className={styles.title}>选品专辑</Row>
              <Card>
                <PCandWXNum data={infoDetail.goodsCollectInfo} keyWords="goodsCollectInfo" getFieldDecorator={getFieldDecorator} />
              </Card>
              <div className={globalStyles.fixedBottom}>
                <Form.Item>
                  <Button>上一步</Button>
                  <Button type="primary" style={{ margin: '0 10px' }}>预览</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
          <AddGoodsModal
            visible={showGoodsModal}
            dataSource={goodsList}
            onOk={this.handleAddGoods}
            onClose={this.handleCloseModal.bind(this, 'showGoodsModal')}
            loading={loading}
            onChange={this.handleChangeList}
            pageSize={pageSize}
            currentPage={currentPage}
            total={total}
            onSearch={this.handleSearchList}
            config={{
              goodsStatusMap,
              categoryMap
            }}
          />
          <PostPicture
            config={{
              visible: isShowUploadSucaiModal,
              confirm: this.handleConfirmSelectPic.bind(this),
              cancel: this.handleCloseModal.bind(this, 'isShowUploadSucaiModal'),
              choseNum: choseNum
            }}
          ></PostPicture>
        </PageHeaderWrapper>
      </div>
    );
  }
}
// PC导航栏
function PcPart({ navInfoItem, index, onAddItem, onReduceItem, getFieldDecorator, resetFields }) {
  const pcLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  }
  return <Row>
    <Col span={5}>
      <Form.Item label="标题" {...pcLayout}>
        {getFieldDecorator(`navInfo[${index}].title`, {
          initialValue: navInfoItem.title,
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={5}>
      <Form.Item label="排序值" {...pcLayout}>
        {getFieldDecorator(`navInfo[${index}].sortOrder`, {
          initialValue: navInfoItem.sortOrder,
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={5}>
      <Form.Item label="链接" {...pcLayout}>
        {getFieldDecorator(`navInfo[${index}].link`, {
          initialValue: navInfoItem.link,
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={2}>
      {
        index == 0 ? <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={onAddItem.bind(this, 'nav', null, resetFields)}></Button> :
          <Button style={{ marginLeft: 10 }} shape="circle" icon="minus" onClick={onReduceItem.bind(this, 'nav', index, null, resetFields)}></Button>
      }

    </Col>
  </Row>
}
// PC左侧分类
function PcLeft({ data, index, onAddItem, onReduceItem, getFieldDecorator, resetFields, firstClassCatMap, deleteItem }) {
  const pcLeftLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  }
  return <div className={styles.box}>
    <Row style={{ borderBottom: '1px dashed #e8e8e8' }} align="middle" type="flex">
      <Col span={5}>
        <Form.Item label="标题" {...pcLeftLayout}>
          {getFieldDecorator(`leftCategory[${index}].mainCategory.title`, {
            initialValue: data.mainCategory.title,
            rules: [
              { required: true, message: '请输入标题' },
            ],
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="绑定分类" {...pcLeftLayout}>
          {getFieldDecorator(`leftCategory[${index}].mainCategory.catId`, {
            initialValue: '' + data.mainCategory.catId,
            rules: [
              { required: true, message: '请选择绑定分类' },
            ],
          })(
            <Select>
              {
                Object.keys(firstClassCatMap).map(item => (
                  <Select.Option
                    value={item}
                  >
                    {firstClassCatMap[item]}
                  </Select.Option>
                ))
              }
            </Select>
          )}
        </Form.Item>
      </Col>
      <Col span={5}>
        <Form.Item label="排序值" {...pcLeftLayout}>
          {getFieldDecorator(`leftCategory[${index}].mainCategory.sortOrder`, {
            initialValue: data.mainCategory.sortOrder,
          })(<Input />)}
        </Form.Item>
      </Col>
      {
        index != 0 && <Col span={2} push={7}>
          <div onClick={deleteItem.bind(this, index)} style={{ color: 'red', cursor: 'pointer' }} >删除</div>
        </Col>
      }
    </Row>
    {
      data.childCategory.map((item, subIndex) => (
        <PcLeftDetail
          getFieldDecorator={getFieldDecorator}
          resetFields={resetFields}
          data={item}
          index={index}
          subIndex={subIndex}
          onAddItem={onAddItem}
          onReduceItem={onReduceItem}
        />
      ))

    }
  </div>

}
function PcLeftDetail({ data, index, subIndex, onAddItem, onReduceItem, getFieldDecorator, resetFields }) {
  const pcLeftLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  }
  return <Row style={{ marginTop: 10 }}>
    <Col span={5}>
      <Form.Item label="标题" {...pcLeftLayout}>
        {getFieldDecorator(`leftCategory[${index}].childCategory[${subIndex}].title`, {
          initialValue: data.title,
          rules: [
            { required: true, message: '请输入标题' },
          ],
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={5}>
      <Form.Item label="链接" {...pcLeftLayout}>
        {getFieldDecorator(`leftCategory[${index}].childCategory[${subIndex}].link`, {
          initialValue: data.link,
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={5}>
      <Form.Item label="排序值" {...pcLeftLayout}>
        {getFieldDecorator(`leftCategory[${index}].childCategory[${subIndex}].sortOrder`, {
          initialValue: data.sortOrder,
        })(<Input />)}
      </Form.Item>
    </Col>
    <Col span={5}>
      <Form.Item label="是否启用" {...pcLeftLayout}>
        {getFieldDecorator(`leftCategory[${index}].childCategory[${subIndex}].isShow`, {
          initialValue: data.isShow,
        })(<Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>)}
      </Form.Item>
    </Col>
    <Col span={2}>
      {
        subIndex == 0 ? <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={onAddItem.bind(this, 'leftNav', index, resetFields)}></Button> :
          <Button style={{ marginLeft: 10 }} shape="circle" icon="minus" onClick={onReduceItem.bind(this, 'leftNav', index, subIndex, resetFields)}></Button>

      }
    </Col>
  </Row>
}
// 金刚区
function IconArea({ data, index, onUpload, onResourceUpload, onDeleteImg, getFieldDecorator, diamondItemMap }) {
  const iconAreaLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
  return <div className={styles.cardItem}>
    <Row>
      <div style={{ marginLeft: 10, float: 'left' }} >
        <span>图片：</span>
      </div>
      {data.imgUrl && <ImgBox src={data.imgUrl} onDeleteImg={onDeleteImg} index={index} />}
      {!data.imgUrl && <UploadBox index={index} onUpload={onUpload} onResourceUpload={onResourceUpload} />}
    </Row>
    <Form.Item label="标题" {...iconAreaLayout}>
      {getFieldDecorator(`diamondInfo[${index}].id`, {
        initialValue: "" + data.id
      })(
        <Select>
          <Select.Option value="">请选择</Select.Option>
          {
            Object.keys(diamondItemMap).map(item => (
              <Select.Option value={item}>{diamondItemMap[item]}</Select.Option>
            ))
          }
        </Select>
      )}
    </Form.Item>
  </div>
}
function StaticArea({ data, index, getFieldDecorator, triggerShowBtn, selectType }) {
  let title = "";
  title = index == 0 && "限时秒杀" || index == 1 && "巨划算" || index == 2 && "品牌套餐" || index == 3 && "超值满赠" || index == 4 && "小美拼团" || index == 5 && "红盒子新品";
  const iconAreaLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
  return <Card style={{ width: '33.3%' }}>
    <Row type="flex" align="middle">
      <Col span={4} style={{ marginBottom: 26 }}>{title}</Col>
      <Col span={20}>
        <Form.Item label="副标题" {...iconAreaLayout}>
          {getFieldDecorator(`porcelainInfo[${index}].title`, {
            initialValue: data.title,
            rules: [
              { required: true, message: '请输入副标题' }
            ]
          })(
            <Input 
            style={{ width: 250 }}
            placeholder="建议副标题为6个汉字"
            />
          )}
        </Form.Item>
      </Col>
    </Row>
    <Row>
      <Col span={20} push={4}>
        <div className={styles.container}>
          <div className={styles.staticBox}>
            <div className={styles.firstStaticBox} onClick={triggerShowBtn.bind(this, index)}>{data.type == 1 ? "按默认规则" : "按模块排序"}</div>
            {
              data.isShowBtn && <div className={styles.staticBtn}>
                <Button type="primary" size="small" style={{ marginBottom: 2 }} onClick={selectType.bind(this, index, 1)}>按默认规则</Button>
                <Button type="primary" size="small" onClick={selectType.bind(this, index, 2)}>按模块排序</Button>
              </div>
            }
          </div>
          <div className={styles.staticItem}>按模块排序</div>
          <div className={styles.staticItem}>按模块排序</div>
        </div>
      </Col>
    </Row>
  </Card>
}
function SelectChanel({ data, onShowModal, getFieldDecorator, onDeleteImg }) {
  return <div>
    <PCandWXNum keyWords="channelInfo" data={data} getFieldDecorator={getFieldDecorator}/>
    <div style={{ borderBottom: '1px dashed #e8e8e8' }}></div>
    <Row style={{ marginTop: 20 }} className={styles.goodsBox}>
      {
        data.info.map((item, index) => (
          <GoodsDetail data={item} index={index} onShowModal={onShowModal} getFieldDecorator={getFieldDecorator} onDeleteImg={onDeleteImg} />
        ))
      }
    </Row>
  </div>
}
function GoodsDetail({ data, index, onShowModal, getFieldDecorator, onDeleteImg }) {
  const goodsLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    }
  }
  return <div className={styles.goodsItem}>
    {/* <Col span={8}> */}
    <Form.Item label="标题" {...goodsLayout}>
      {getFieldDecorator(`channelInfo.info[${index}].title`, {
        initialValue: data.title,
        rules: [
          { required: true, message: '请输入标题' }
        ]
      })(
        <Input />
      )}
    </Form.Item>
    <Form.Item label="副标题" {...goodsLayout}>
      {getFieldDecorator(`channelInfo.info[${index}].subtitle`, {
        initialValue: data.subtitle,
        rules: [
          { required: true, message: '请输入副标题' }
        ]
      })(
        <Input />
      )}
    </Form.Item>
    <Form.Item label="pc链接" {...goodsLayout}>
      {getFieldDecorator(`channelInfo.info[${index}].pcLink`, {
        initialValue: data.pcLink,
        rules: [
          { required: true, message: '请输入pc链接' }
        ]
      })(
        <Input />
      )}
    </Form.Item>
    <Form.Item label="小程序路由" {...goodsLayout}>
      {getFieldDecorator(`channelInfo.info[${index}].xcxLink`, {
        initialValue: data.xcxLink,
        rules: [
          { required: true, message: '请输入小程序路由' }
        ]
      })(
        <Input />
      )}
    </Form.Item>
    <Form.Item label="商品" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      {
        data.goodsList && data.goodsList.map((item, subIndex) => {
          return <ImgBox src={item.img} index={index} onDeleteImg={onDeleteImg} subIndex={subIndex} />
        })
      }
      <div className={styles.addGoods} onClick={onShowModal.bind(this, index)}>
        <p><Icon type="plus" /><span>添加商品</span></p>
      </div>
    </Form.Item>
    {/* </Col> */}
  </div>
}
export default HomePage;

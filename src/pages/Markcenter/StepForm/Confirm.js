import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Switch,
  InputNumber,
  Popconfirm,
  DatePicker,
  message,
} from 'antd';
import { getUrl } from '../../../utils/request';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
const { TextArea, Search } = Input;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};
@connect(({ markcenter, loading }) => ({
  submitting: loading.effects['markcenter/submitStepForm'],
  data: markcenter.step,
  markcenter: markcenter,
}))
@Form.create()
class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangeSwitch: false,
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    if (this.props.match.params.id != '' && this.props.match.params.oldId != '') {
      dispatch({
        type: 'markcenter/getActivityGoodsDetail',
        payload: {
          activityId: this.props.match.params.id,
          type: this.props.match.params.type,
          oldId: this.props.match.params.oldId,
        },
      });
    } else if (this.props.match.params.id != '' && this.props.match.params.oldId == undefined) {
      dispatch({
        type: 'markcenter/getActivityGoodsDetail',
        payload: {
          activityId: this.props.match.params.id,
          type: this.props.match.params.type,
        },
      });
    }

    dispatch({
      type: 'markcenter/getConfig',
      payload: {},
    });
  }
  shouldComponentUpdate(nextProps, nextState){
      return nextProps
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/unmount',
    });
  }
  handleAddGoods(e) {
    const { markcenter, dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        [e]: true,
      },
    });
    dispatch({
      type: 'markcenter/getList',
    });
  }
  // handleInputChangedLimit(inputName, goodsIdChanged, addOrUpdate, e) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'markcenter/changeInputValueLimit',
  //     payload: {
  //       keyName: inputName,
  //       keyValue: e.target.value,
  //       goodsIdChanged,
  //       addOrUpdate,
  //     },
  //   });
  // }
  // addOrUpdate判断是新添加的商品列表还是已参加活动的列表
  // handleInputChanged(inputName, goodsIdChanged, addOrUpdate, e) {
  //   const { dispatch } = this.props;
  //   if (inputName == 'isHot' || inputName == 'buyByBox') {
  //     dispatch({
  //       type: 'markcenter/changeInputValue',
  //       payload: {
  //         keyName: inputName,
  //         keyValue: e.target.checked,
  //         goodsIdChanged,
  //         addOrUpdate,
  //       },
  //     });
  //   } else {
  //     dispatch({
  //       type: 'markcenter/changeInputValue',
  //       payload: {
  //         keyName: inputName,
  //         keyValue: e.target.value,
  //         goodsIdChanged,
  //         addOrUpdate,
  //       },
  //     });
  //   }
  // }
  handleExcelInfoModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        isVisibleExcelInfoModal: true,
      },
    });
  }
  handleSearchGoodsName() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleClear() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/changeClear',
    });
  }
  handleChangeGoodsName(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  handleSearchSelectChange(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getList',
      payload: {
        [type]: e,
        currentPage: 1,
      },
    });
  }
  handleDelete(deleteChosedGoodsId) {
    const { markcenter, dispatch } = this.props;
    dispatch({
      type: 'markcenter/changeTotalSelectGoods',
      payload: {
        deleteChosedGoodsId,
      },
    });
  }
  handleDeleteHasJoinGoods() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/changeHasJoinGoods',
      payload: {
        // actId: deleteId,
      },
    });
  }

  handleVisibleXiajiaModal(deleteId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        deleteId,
        isVisibleSureXiajia: true,
      },
    });
  }
  handleChangeCurPage(currentPage) {
    const { dispatch, publishContent } = this.props;
    dispatch({
      type: 'markcenter/getList',
      payload: {
        currentPage,
      },
    });
  }
  handleChangePageSize(_, pageSize) {
    const { dispatch, publishContent } = this.props;
    dispatch({
      type: 'markcenter/getList',
      payload: {
        pageSize,
        currentPage: 1,
      },
    });
  }
  // addOrUpdate判断是新添加的商品列表还是已参加活动的列表
  handlePriceChanged(inputName, item,index, e) {


    const { dispatch,markcenter,form } = this.props;
    form.resetFields([`[${index}].actPrice`,`[${index}].actPriceReduce`,`[${index}].actPriceDiscount`])
    const {activeKey } = markcenter
    dispatch({
      type: 'markcenter/changePrice',
      payload: {
        keyName: inputName,
        keyValue: e.target.value,
        goodsIdChanged:item.goodsId,
        addOrUpdate:activeKey==1?'add':'update',
      },
    });
  }
  uploadImg(goodsId, joinType, pictureType) {
    const { dispatch } = this.props;
    let modalType = dispatch({
      type: 'markcenter/getListResolvedImg',
      payload: {
        currentGoodsIdUploadImg: goodsId,
        joinType,
        [pictureType]: true,
      },
    });
  }
  handelDeteleBanner(goodsId, joinType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListBannerDelete',
      payload: {
        currentDeleteId: goodsId,
        joinType,
      },
    });
  }
  handelDeteleIcon(goodsId, joinType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListIconDelete',
      payload: {
        currentDeleteId: goodsId,
        joinType,
      },
    });
  }
  handlePreview(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        previewImage: e.url || e.thumbUrl,
        previewVisible: true,
      },
    });
  }

  handleChangeImgSingle(e) {
    const { dispatch } = this.props;
    if (e.file.status === 'uploading') {
      dispatch({
        type: 'markcenter/getListResolved',
        payload: {
          fileList: e.fileList,
        },
      });
    }
    if (e.file.status === 'done') {
      if (!!e.file) {
        dispatch({
          type: 'markcenter/getGoodsListIcon',
          payload: {
            imgs: e.file.response.data.imgs,
            fileList: e.fileList,
          },
        });
      }
    }
  }
  handleChangeExcelInfoModal(e) {
    const { dispatch } = this.props;
    if (e.file.status === 'done') {
      dispatch({
        type: 'markcenter/getExcelInfoModal',
        payload: {
          totalExcelChose: e.file.response.data,
          fileList: e.fileList,
        },
      });
    }
  }
  handleRemove(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getGoodsListIcon',
      payload: {
        fileList: [],
      },
    });
  }
  // handleGoodGetIcon(e) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'markcenter/getGoodsListPicture',
  //     payload: {
  //       isVisibleIconImgModal: false,
  //     },
  //   });
  // }
  // 点击确定上传活动主题
  handleGoodGetBannerIcon() {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getGoodsListPictureBanner',
      payload: {
        isVisibleBannerImgModal: false,
      },
    });
  }
  // handleChangeImgshowBanner(goodsId, joinType, e) {
  //   const { dispatch } = this.props;
  //   if (e.file.status === 'uploading') {
  //     dispatch({
  //       type: 'markcenter/getListResolved',
  //       payload: {
  //         fileList: e.file.fileList,
  //       },
  //     });
  //   }
  //   if (e.file.status === 'done') {
  //     dispatch({
  //       type: 'markcenter/getGoodsBannerPicture',
  //       payload: {
  //         isuploading: false,
  //         currentGoodsIdUploadImg: goodsId,
  //         joinType,
  //         imgs: e.file.response.data.imgs,
  //       },
  //     });
  //   }
  // }
  // 选择勾选商品
  handleSelectRows(selectedRowIds, selectedRows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        selectedRowIds,
        selectedRows,
      },
    });
  }
  // 存取当前被激活tab的key
  changeTabKey(key) {
    const { dispatch, valueOnway } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        activeKey: key,
      },
    });
  }
  // 关闭弹框并跟新被选中商品
  handleChoselModal() {
    const { dispatch } = this.props;
    const { selectedRowIds, selectedRows } = this.props.markcenter;
    dispatch({
      type: 'markcenter/changeProvideRows',
      payload: {
        isVisibleGoodsModal: false,
        selectedRowIds,
        selectedRows,
      },
    });
  }
  // 关闭弹框
  handleCancel(e) {
    const { markcenter, dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        [e]: false,
      },
    });
  }
  // 发货形式选择
  handleSearchChange(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'markcenter/getList',
      payload: {
        [type]: e.target.value,
        currentPage: 1,
      },
    });
  }

  changeValues(value, index, name, activeKey) {
    const { markcenter, dispatch, form } = this.props;

    const { totalselectedRows, hasChosedGoods } = markcenter;
    let dataList = [];
    let dataName = '';
    if (activeKey == 1) {
      dataList = totalselectedRows;
      dataName = 'totalselectedRows';
    } else {
      dataList = hasChosedGoods;
      dataName = 'hasChosedGoods';
    }
    let TotalRows = dataList.map((item, itemIndex) => {
      if (itemIndex == index) {
        item[name] = !!value == false ? 1 : 0;
      }
      return item;
    });
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        [dataName]: TotalRows,
      },
    });

  }
  isMainPush(isHot, index) {}

  handleSubmit(actionType) {
    const {
      markcenter: { basicInfo, totalselectedRows, id, hasChosedGoods, type },
      form,
      dispatch,
      // data
    } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;
    validateFieldsAndScroll((err, values) => {
      if (JSON.stringify(values) == '{}') {
        message.info('请添加商品');
        return false;
      }
      let addItems = [];
      let updateItems = [];
      Object.keys(values).forEach(index => {
        var reg = RegExp(/1-/);
        if (index.match(reg)) {
          totalselectedRows.forEach(item => {
            let inx = index.replace('1-', '');
            if (item.goodsId == inx) {
              values[index].showBanner = item.showBanner;
              values[index].buyByBox = !!values[index].buyByBox ? 1 : 0;
              if (type == 3) {
                values[index]['addEndTime'] = moment(values[index]['addEndTime']).format(
                  'YYYY-MM-DD HH:mm:ss'
                );
                values[index]['addStartTime'] = moment(values[index]['addStartTime']).format(
                  'YYYY-MM-DD HH:mm:ss'
                );
              }
            }
          });
          addItems.push(values[index]);
        }
      });
      if (hasChosedGoods.length > 0 && id) {
        Object.keys(values).forEach(valInx => {
          var reg = RegExp(/2-/);
          if (valInx.match(reg)) {
            hasChosedGoods.forEach(item => {
              let inx = valInx.replace('2-', '');
              if (item.goodsId == inx) {
                values[valInx].showBanner = item.showBanner;
                values[valInx].buyByBox = !!values[valInx].buyByBox ? 1 : 0;
                if (type == 3) {
                  values[valInx]['addEndTime'] = moment(values[valInx]['addEndTime']).format(
                    'YYYY-MM-DD HH:mm:ss'
                  );
                  values[valInx]['addStartTime'] = moment(values[valInx]['addStartTime']).format(
                    'YYYY-MM-DD HH:mm:ss'
                  );
                }
              }
            });
            updateItems.push(values[valInx]);
          }
        });
      }
        if (!err) {
          dispatch({
            type: 'markcenter/createActiveGoods',
            payload: {
              activityId: id,
              actionType,
              addItems,
              updateItems,
            },
          });
        }
    });
  }
  // handlePublishMiaosha() {
  //   const { markcenter, dispatch } = this.props;
  //   // const { isVisibleWarningModal } = markcenter;
  //   dispatch({
  //     type: 'markcenter/checkGoodsActivity',
  //     // payload: {
  //     //   isVisibleWarningModal: true,
  //     // }
  //   });
  // }
  // 确定发布
  handlePupopTip=()=>{
    const {dispatch } = this.props;
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        isVisibleWarningModal: true,
      },
    });
  }
  handlePublishModalOk() {
    const { markcenter, dispatch } = this.props;
    // const { isVisibleWarningModal, totalselectedRows } = markcenter;
    this.handleSubmit('2')
    dispatch({
      type: 'markcenter/getListResolved',
      payload: {
        isVisibleWarningModal: false,
      },
    });
  }
  handleValidator(e, rule, val, callback) {
    // console.log(rule, val, callback,e)
    if (val >= +e) {
      callback('拼团价小于平台价');
    }
    callback();
  }
  render() {
    const {
      form,
      data,
      dispatch,
      submitting,
      markcenter: {
        isVisibleGoodsModal,
        basicInfo,
        goodsList,
        totalselectedRows,
        selectedRowIds,
        previewVisible,
        fileList,
        previewImage,
        isVisibleIconImgModal,
        previewIconImage,
        isVisibleWarningModal,
        isVisibleBannerImgModal,
        activeKey,
        hasChosedGoods,
        keywords,
        goodsSn,
        isOnlyOnSale,
        status,
        currentPage,
        pageSize,
        fileListIcon,
        brandName,
        deleteId,
        isZhiFa,
        hasChosedGoodscopy,
        isLoading,
        isVisibleSureXiajia,
        catId,
        id,
        goodsStatusMap,
        categoryMap,
        isVisibleExcelInfoModal,
        total,
        type,
        conflictList,
      },
    } = this.props;
    const { isChangeSwitch } = this.state;
    const { getFieldDecorator, validateFields } = form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传本地图片</div>
      </div>
    );
    const uploadButtonWen = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传本地表格</div>
      </div>
    );
    const onPrev = () => {
      router.push(`/markcenter/step-form/info/${type}/${id}`);
    };
    const columnsModal = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (src, record) => (
          <img src={record.img} alt={record.goodsName} style={{ width: 55, height: 55 }} />
        ),
      },
      {
        title: '商品名称/条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        render: (src, record) => (
          <p>
            {record.goodsName}
            <p style={{ color: '#999' }}>商品条码：{record.goodsSn}</p>
          </p>
        ),
      },
      {
        title: '商品状态',
        dataIndex: 'goodsStatus',
        key: 'goodsStatus',
      },
      {
        title: '可用库存',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '平台价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
      },
      {
        title: '零售价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
      },
      {
        title: '交叉不冲突的活动',
        dataIndex: 'noConflictList',
        key: 'noConflictList',
        render: (noConflictList, record, index) => noConflictList.map(item => <span>{item}</span>),
      },
      {
        title: '冲突的活动',
        dataIndex: 'conflictList',
        key: 'conflictList',
        render: (conflictList, record, index) => conflictList.map(item => <span>{item}</span>),
      },
    ];

    const goodsItemMsg = (item, index, tag) => {
      const { markcenter, dispatch, form } = this.props;
      const { getFieldDecorator, validateFields } = form;
      const {
        totalselectedRows,
        hasChosedGoods,
        activeKey,
        type,
        id,
        activityStartTime,
        activityEndTime,
      } = markcenter;
      let Index = `${tag}-${item.goodsId}`;

      return (
        <div className={styles.goodsItems} key={Index}>
          <div className={styles.goodsdetail}>
            <div className={styles.left}>
              <div>
                <img src={item.img} alt="" />
                <div>
                  <h5>{item.goodsName}</h5>
                  <p>
                    条码：<span>{item.goodsSn}</span>
                  </p>
                </div>
              </div>
              <Form.Item>
                {getFieldDecorator(`[${Index}].goodsId`, {
                  initialValue: item.goodsId,
                })}
              </Form.Item>
              {tag == 2 ? (
                <Form.Item>
                  {getFieldDecorator(`[${Index}].actGoodsId`, {
                    initialValue: item.actGoodsId,
                  })}
                </Form.Item>
              ) : null}
              <div className={styles.clearfix}>
                <div>
                  <p>商品状态</p>
                  <b>{item.goodsStatus}</b>
                </div>
                <div>
                  <p>平台价</p>
                  <b>{item.shopPrice}</b>
                </div>
                <div>
                  <p>零售价</p>
                  <b>{item.marketPrice}</b>
                </div>
                <div>
                  <p>可用库存</p>
                  <b>{item.availableStock}</b>
                </div>
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.uploadbox}>
                {/* {item.iconUrl != '' && item.iconUrl != undefined ? (
                  <div className={styles.iconA}>
                    <img src={item.iconUrl} alt="ivon" />
                    <div>
                      <Icon
                        type="delete"
                        style={{ fontSize: '12px', color: '#fff' }}
                        onClick={this.handelDeteleIcon.bind(this, item.goodsId, 'waitforJion')}
                        title="删除标识"
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )} */}
                {item.showBanner != '' && item.showBanner != undefined ? (
                  <div onClick={this.handelDeteleBanner.bind(this, item.goodsId, 'waitforJion')}>
                    <img src={item.showBannerUrl} />
                    <div>
                      <Icon
                        type="delete"
                        style={{ fontSize: '30px', color: '#fff' }}
                        title="删除主图"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.itemThumb}
                    style={{ textAlign: 'center', paddingTop: '20px' }}
                    onClick={this.uploadImg.bind(
                      this,
                      item.goodsId,
                      'waitforJion',
                      'isVisibleBannerImgModal'
                    )}
                  >
                    <Icon type="plus" style={{ fontSize: '60px' }} />
                    <p>上传活动主图</p>
                  </div>
                )}
              </div>

              <div>
                <div className={styles.activityMessage} style={{ position: 'relative' }}>
                  <Form.Item {...formItemLayout} label="活动标题">
                    {getFieldDecorator(`[${Index}].goodsTitle`, {
                      initialValue: item.goodsTitle ? item.goodsTitle : item.goodsName,
                      rules: [
                        { required: true, message: '请输入活动标题' },
                        { max: 50, message: '最多可输入50个字' },
                      ],
                    })(<Input placeholder="请输入活动标题" />)}
                  </Form.Item>
                  <Form.Item {...formItemLayout} label="活动卖点">
                    {getFieldDecorator(`[${Index}].desc`, {
                      initialValue: item.desc,
                      rules: [
                        { required: true, message: '请输入活动卖点' },
                        { max: 50, message: '最多可输入50个字' },
                      ],
                    })(<Input placeholder="请输入活动卖点" />)}
                  </Form.Item>
                </div>
                <div className={styles.activityMessageBottom}>
                  {type == 3 ? (
                    <div>
                      <Form.Item label="成团人数">
                        {getFieldDecorator(`[${Index}].fullNum`, {
                          initialValue: item.fullNum,
                          rules: [{ required: true, message: '成团人数2·5', pattern: /^[2-5]+$/ }],
                        })(<Input placeholder="0" />)}
                      </Form.Item>

                      <Form.Item label="拼团价">
                        {getFieldDecorator(`[${Index}].actPrice`, {
                          initialValue: item.actPrice?item.actPrice:'',
                          rules: [
                            { required: true, message: '输入价格' },
                            { validator: this.handleValidator.bind(this, item.shopPrice) },
                          ],
                        })(<Input placeholder="0" />)}
                      </Form.Item>
                    </div>
                  ) : (
                    <div>
                      <Form.Item label="折扣">
                        {getFieldDecorator(`[${Index}].actPriceDiscount`, {
                          initialValue: item.actPriceDiscount,
                          rules: [{ required: true, message: '请填写折扣' },
                        ],
                        })(<Input placeholder="0" onChange={this.handlePriceChanged.bind(this,
                        'actPriceDiscount', item,Index)}/>)}
                      </Form.Item>

                      <Form.Item label="减价">
                        {getFieldDecorator(`[${Index}].actPriceReduce`, {
                          initialValue: item.actPriceReduce,
                          rules: [{ required: true, message: '请填写减价' }],
                        })(<Input placeholder="0"  onChange={this.handlePriceChanged.bind(this,
                          'actPriceReduce', item,Index)}/>)}
                      </Form.Item>

                      <Form.Item label="促销价">
                        {getFieldDecorator(`[${Index}].actPrice`, {
                          initialValue: item.actPrice,
                          rules: [{ required: true, message: '请填写价格' }],
                        })(<Input placeholder="0"  onChange={this.handlePriceChanged.bind(this,
                          'actPrice', item,Index)} />)}
                      </Form.Item>
                      <Form.Item label="促销数量">
                        {getFieldDecorator(`[${Index}].matchNum`, {
                          initialValue: item.matchNum,
                        })(<Input placeholder="0" />)}
                      </Form.Item>
                    </div>
                  )}
                  <div>
                    <Form.Item label="限购数量">
                      {getFieldDecorator(`[${Index}].limitNum`, {
                        initialValue: item.limitNum,
                      })(<Input placeholder="默认不限" />)}
                    </Form.Item>

                    <Form.Item label="起批量">
                      {getFieldDecorator(`[${Index}].startNum`, {
                        initialValue: item.startNum,
                      })(<Input placeholder="0" />)}
                    </Form.Item>

                    <Form.Item label="按箱购买">
                      {getFieldDecorator(`[${Index}].buyByBox`, {
                        initialValue: !!item.buyByBox,
                      })(
                        <Switch
                          checked={!!item.buyByBox}
                          onChange={this.changeValues.bind(
                            this,
                            item.buyByBox,
                            index,
                            'buyByBox',
                            activeKey
                          )}
                        />
                      )}
                    </Form.Item>

                    {item.buyByBox ? (
                      <Form.Item label="逻辑箱规">
                        {getFieldDecorator(`[${Index}].numberPerBox`, {
                          initialValue: item.numberPerBox,
                          rules: [{ required: true, message: '1' }],
                        })(<Input placeholder="1" />)}
                      </Form.Item>
                    ) : null}
                  </div>
                </div>
              </div>
              {/* {item.actPrice > item.shopPrice ? (
              <div
                style={{ position: 'absolute', bottom: '-88px', color: 'green' }}
              >
                温馨提示：填写的促销价高于平台价
              </div>
            ) : (
              ''
            )} */}
            </div>
            <div className={styles.right}>
              <Form.Item>
                {getFieldDecorator(`[${Index}].isHot`, {
                  initialValue: item.isHot,
                })(
                  <span
                    onClick={this.changeValues.bind(this, item.isHot, index, 'isHot', activeKey)}
                  >
                    {' '}
                    {item.isHot ? '取消主推' : '设置主推'}
                  </span>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`[${Index}].isShow`, {
                  initialValue: item.isShow,
                })(
                  <span
                    onClick={this.changeValues.bind(this, item.isShow, index, 'isShow', activeKey)}
                  >
                    {' '}
                    { item.isShow ? '设置为不显示' : '设置为显示' }
                  </span>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator(`[${Index}].sortOrder`, {
                  initialValue: item.sortOrder,
                })(<Input placeholder="排序值" />)}
              </Form.Item>

              <Popconfirm
                title="确定删除该商品？"
                okText="确定"
                cancelText="取消"
                onConfirm={this.handleDelete.bind(this, item.goodsId)}
              >
                <a href="#">删除</a>
              </Popconfirm>
            </div>
          </div>
          {type == 3 ? (
            <div className={styles.goodsItemBottom}>
              <div className={styles.itemBotLeft}>
                <div>金手指</div>
                <div>
                  <div>正在拼团数:</div>
                  <div>
                    低于
                    <Form.Item>
                      {getFieldDecorator(`[${Index}].supplyGoingNum`, {
                        initialValue: item.supplyGoingNum ? item.supplyGoingNum : 1,
                      })(<Input />)}
                    </Form.Item>
                    个，
                  </div>
                  <div>
                    系统随机补
                    <Form.Item>
                      {getFieldDecorator(`[${Index}].supplyNum`, {
                        initialValue: item.supplyNum ? item.supplyNum : 2,
                        rules: [{ message: '只能大于1的整数', pattern: /^[2-9]+$/ }],
                      })(<Input />)}
                    </Form.Item>
                    个；
                  </div>
                </div>
              </div>
              <div className={styles.itemBotRight}>
                <div>已拼数量：</div>
                <div>
                  <Form.Item>
                    {getFieldDecorator(`[${Index}].addStartTime`, {
                      initialValue: item.addStartTime
                        ? moment(item.addStartTime)
                        : moment(activityStartTime),
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                  </Form.Item>{' '}
                  至
                  <Form.Item>
                    {getFieldDecorator(`[${Index}].addEndTime`, {
                      initialValue: item.addEndTime
                        ? moment(item.addEndTime)
                        : moment(activityEndTime),
                    })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                  </Form.Item>
                </div>
                <div>
                  累计增加数量
                  <Form.Item>
                    {getFieldDecorator(`[${Index}].addNum`, {
                      initialValue: item.addNum,
                    })(<Input />)}
                  </Form.Item>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    };
    // this.getButton(activeKey)
    return (
      <div>
        <Form layout="horizontal">
          <Tabs
            defaultActiveKey={activeKey}
            onChange={this.changeTabKey.bind(this)}
            tabBarExtraContent={
              <div>
                <Upload
                  action={type==3?`${getUrl(API_ENV)}/operate/group-shopping/import`:`${getUrl(API_ENV)}/operate/goods-activity/import`}
                  headers={{
                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                  }}
                  onChange={this.handleChangeExcelInfoModal.bind(this)}
                  data={{
                    activityId:this.props.match.params.id
                  }}
                >
                  <Tooltip placement="topRight" title="仅支持条码和促销价导入" arrowPointAtCenter>
                    <Button>
                      <Icon type="upload" /> 批量导入
                    </Button>
                  </Tooltip>
                </Upload>
              </div>
            }
          >
            <TabPane tab="添加商品" key="1">
              <div className={styles.content}>
                {totalselectedRows &&
                  totalselectedRows.map((item, index) => {
                    return goodsItemMsg(item, index, '1');
                  })}

                <p
                  style={{ margin: '20px 0' }}
                  onClick={this.handleAddGoods.bind(this, 'isVisibleGoodsModal')}
                >
                  {' '}
                  + 添加活动商品
                </p>
              </div>
            </TabPane>
            {id ? (
              <TabPane tab="已参加活动的商品" key="2">
                <div className={styles.content}>
                  {hasChosedGoods &&
                    hasChosedGoods.map((item, index) => {
                      return goodsItemMsg(item, index, '2');
                    })}
                </div>
              </TabPane>
            ) : (
              ''
            )}
          </Tabs>
        </Form>
        {/* <Modal
          title="提示"
          visible={isVisibleSureXiajia}
          onCancel={this.handleCancel.bind(this, 'isVisibleSureXiajia')}
          onOk={this.handleDeleteHasJoinGoods.bind(this)}
        >
          <div>下架后商品不可重新上架，只可重新添加该活动商品，请谨慎操作！</div>
        </Modal> */}
        <div className={styles.fixedBottom}>
          <div>
            <Button onClick={onPrev}>上一步</Button>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={this.handleSubmit.bind(this, '1')}
            >
              保存
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={this.handlePupopTip.bind(this, '2')}
            >
              确定发布
            </Button>
          </div>
        </div>
        <Modal
          width={1600}
          visible={isVisibleGoodsModal}
          footer={null}
          onCancel={this.handleCancel.bind(this, 'isVisibleGoodsModal')}
        >
          <div
            style={{
              borderBottom: '1px solid #ddd',
              paddingBottom: '3px',
              height: '40px',
              marginBottom: '10px',
            }}
          >
            <b style={{ fontSize: '16px', lineHeight: '40px' }}>添加商品</b>
            <div style={{ position: 'absolute', width: '150px', right: '50px', top: '24px' }}>
              <Button
                style={{ marginRight: '20px' }}
                onClick={this.handleCancel.bind(this, 'isVisibleGoodsModal')}
              >
                取消
              </Button>
              <Button onClick={this.handleChoselModal.bind(this)} type="primary">
                确定
              </Button>
            </div>
          </div>
          <Search
            placeholder="请输入商品条码"
            value={goodsSn}
            onChange={this.handleChangeGoodsName.bind(this, 'goodsSn')}
            onSearch={this.handleSearchGoodsName.bind(this)}
            style={{ width: 200, marginRight: '10px' }}
          />
          <Search
            placeholder="请输入商品名称"
            value={keywords}
            onChange={this.handleChangeGoodsName.bind(this, 'keywords')}
            onSearch={this.handleSearchGoodsName.bind(this)}
            style={{ width: 200, marginRight: '10px' }}
          />
          <Search
            placeholder="请输入品牌"
            value={brandName}
            onChange={this.handleChangeGoodsName.bind(this, 'brandName')}
            onSearch={this.handleSearchGoodsName.bind(this)}
            style={{ width: 200, marginRight: '20px' }}
          />
          {/* <Radio.Group value={isZhiFa} onChange={this.handleSearchChange.bind(this, 'isZhiFa')}>
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="1">直发</Radio.Button>
            <Radio.Button value="2">代发</Radio.Button>
          </Radio.Group> */}
          <Button
            type="primary"
            onClick={this.handleClear.bind(this)}
            style={{ marginLeft: '20px' }}
          >
            清空
          </Button>
          <div style={{ margin: '20px 0' }}>
            <span>商品状态：</span>
            <Select
              showSearch
              placeholder="请选择"
              style={{ width: 200, margin: '0 12px' }}
              value={goodsStatusMap[status]}
              onChange={this.handleSearchSelectChange.bind(this, 'status')}
            >
              <Select.Option value={''}>全部</Select.Option>
              {Object.keys(goodsStatusMap).map((key, index) => (
                <Select.Option value={key} key={index}>
                  {goodsStatusMap[key]}
                </Select.Option>
              ))}
            </Select>
            <span style={{ marginLeft: '20px' }}>商品分类：</span>
            <Select
              showSearch
              placeholder="请选择"
              style={{ width: 200, margin: '0 12px' }}
              value={categoryMap[catId]}
              onChange={this.handleSearchSelectChange.bind(this, 'catId')}
            >
              <Select.Option value={''}>全部</Select.Option>
              {Object.keys(categoryMap).map((key, index) => (
                <Select.Option value={key} key={index}>
                  {categoryMap[key]}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Table
            columns={columnsModal}
            dataSource={goodsList}
            rowKey={goodsList => goodsList.goodsId && goodsList.goodsId}
            bordered
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              onChange: this.handleChangeCurPage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showSizeChanger: true,
            }}
            rowSelection={{
              selectedRowKeys: selectedRowIds,
              onChange: this.handleSelectRows.bind(this),
              getCheckboxProps: record => ({
                disabled: [...totalselectedRows, ...hasChosedGoodscopy,...conflictList].some(goodsInfo => {
                  return +record.goodsId === +goodsInfo.goodsId;
                }),
              }),
            }}
          />
        </Modal>
        <Modal
          width={600}
          height={236}
          title="上传活动主图"
          visible={isVisibleBannerImgModal}
          onCancel={this.handleCancel.bind(this, 'isVisibleBannerImgModal')}
          onOk={this.handleGoodGetBannerIcon.bind(this, 'isVisibleBannerImgModal')}
        >
          <span style={{ height: '100px', display: 'inline-block' }}>上传活动主图:</span>
          <Upload
            action={`${getUrl(API_ENV)}/content/img-resource/create`}
            headers={{
              authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
            }}
            onRemove={this.handleRemove.bind(this)}
            className={styles.iconUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview.bind(this)}
            onChange={this.handleChangeImgSingle.bind(this)}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel.bind(this, 'previewVisible')}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Modal>

        {/* <Modal
          width={600}
          height={236}
          title="活动标识"
          visible={isVisibleIconImgModal}
          onCancel={this.handleCancel.bind(this, 'isVisibleIconImgModal')}
          onOk={this.handleGoodGetIcon.bind(this, 'isVisibleIconImgModal')}
        >
          <span style={{ height: '100px', display: 'inline-block' }}>活动标识：</span>
          <Upload
            action={`${getUrl(API_ENV)}/content/img-resource/create`}
            headers={{
              authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
            }}
            onRemove={this.handleRemove.bind(this)}
            className={styles.iconUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview.bind(this)}
            onChange={this.handleChangeImgSingle.bind(this)}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel.bind(this, 'previewVisible')}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Modal> */}
        <Modal
          width={600}
          height={436}
          visible={isVisibleWarningModal}
          onCancel={this.handleCancel.bind(this, 'isVisibleWarningModal')}
          onOk={this.handlePublishModalOk.bind(this)}
        >
          <Icon
            type="exclamation-circle"
            style={{ fontSize: '20px', color: '#facc14', marginRight: '10px' }}
          />
          <span>重要！请确定活动发布的信息！</span>
          <p>
            <span style={{ color: 'red' }}>用户即可参与活动</span>，你还要继续吗？
          </p>
        </Modal>
      </div>
    );
  }
}

export default Confirm;

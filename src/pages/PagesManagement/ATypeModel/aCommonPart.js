import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, Card, Row, Col, Affix, Radio, Form, Input, Collapse, Checkbox, Select, Table, Modal, Upload, AutoComplete, message } from 'antd';
import globalStyles from '@/global.less';
import styles from './index.less';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { getUrl } from '@/utils/request';
import arrayMove from 'array-move';
const MyContext = React.createContext({
    type: 'pc',
    id: '',
    getFieldDecorator: null,
    data: {},
    addItem: () => { }
});
const colorMap = [
    {
        color: '透明',
    },
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
const columns = [
    {
        title: '序号',
        dataIndex: 'name',
        key: 'name',
        render: (_, record, index) => {
            return <span>{index + 1}</span>
        }
    },
    {
        title: '主图',
        key: 'img',
        dataIndex: 'img',
        render: (_,record) => {
            return <img src={record.img||record.goodsImg} style={{ width: 40, height: 40 }} />
        }
    },
    {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
    },
    {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
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
        title: '零售价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
    },
    {
        title: '平台价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
    },
];
const beforeUpload = (file) => {
    const isExcel = file.type.indexOf("sheet") > 0 || file.type.indexOf("excel") > 0
    if (!isExcel) {
        message.error("请上传excel格式的文件");
    }
    return isExcel;

}
@Form.create({
    onValuesChange(props, change, allValue) {
        props.onValueChange(allValue);
    },
})
class CommonPart extends PureComponent {
    constructor(props) {
        super(props);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { data } = this.props;
        let tempData = JSON.parse(JSON.stringify(data));
        const tempList = tempData.jsonInfo;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.keys(tempData).map(item => {
                    if (!Object.keys(values).includes(item)) {
                        values[item] = tempData[item]
                    }
                })
                tempList.map((info, index) => {
                    values.jsonInfo[index] = Object.assign(values.jsonInfo[index], tempList[index]);
                })
                this.props.onSubmit()
            }
        });
    }
    render() {
        const { form, type, id, data, addItem, reduceItem, onShow, onDelete, onUpload, onRemoveImg, onChangeColor,
            onResourceUpload, onPreview, onChangeOrder, onBack, onChangeKey, uploadFile, onDeleteTag, onChangeTableValue, onChangeTitleValue
        } = this.props;
        const { getFieldDecorator, getFieldsValue, resetFields } = form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} >
                    <MyContext.Provider value={{ type, getFieldDecorator,  onChangeColor, onRemoveImg, onPreview, onResourceUpload, onUpload }}>
                        <Header data={data}/>
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, onChangeKey }}>
                        <ActivityTips data={data} />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, onRemoveImg, onPreview, onChangeKey, onResourceUpload, onUpload }}>
                        <Banner data={data} />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, onRemoveImg, onPreview, onChangeKey, onResourceUpload, uploadFile, onShow, onUpload }}>
                        <GoodsSuggest data={data} onChangeTableValue={onChangeTableValue} onDelete={onDelete} type={type}/>
                    </MyContext.Provider>
                    <MyContext.Provider
                        value={{
                            getFieldDecorator, data,
                            onShow, getFieldsValue, resetFields,
                            onChangeColor, onRemoveImg,
                            onPreview,
                            onChangeKey,
                            onUpload,
                            onResourceUpload,
                            uploadFile,
                            onChangeOrder,
                            addItem,
                            reduceItem,
                            onDeleteTag
                        }}>
                        {/* 商品列表，秒杀，巨划算，套餐，满赠共用一个组件 */}
                        {
                            data.jsonInfo.map((item, index) => {
                                if (item.type)
                                    return <div>
                                        {
                                            item.type == 1 || item.type == 4 || item.type == 6 || item.type == 7 || item.type == 8 ? <GoodsCommon
                                                item={item}
                                                index={index}
                                                onDelete={onDelete}
                                                onChangeTableValue={onChangeTableValue}
                                                type={type}
                                            /> : null
                                        }
                                        {
                                            item.type == 2 && <AdsPart
                                                item={item}
                                                index={index}
                                                type={type}
                                            />
                                        }
                                        {
                                            item.type == 3 && <CouponList
                                                item={item}
                                                index={index}
                                                type={type}
                                            // onDelete={onDelete}
                                            />
                                        }
                                        {
                                            item.type == 5 && <ActList
                                                item={item}
                                                index={index}
                                                onDelete={onDelete}
                                                type={type}
                                            />
                                        }
                                    </div>
                            })
                        }
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, onRemoveImg, onPreview, onChangeKey, onResourceUpload, onChangeColor, onUpload, onResourceUpload }}>
                        <AllGoods data={data} />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, onRemoveImg, onPreview, onChangeKey, onResourceUpload, onChangeColor, onUpload, onResourceUpload, onChangeTitleValue }}>
                        <NavBar data={data} />
                    </MyContext.Provider>
                    <div className={globalStyles.fixedBottom}>
                        <Form.Item>
                            <Button onClick={onBack}>
                                上一步
                            </Button>
                            <Button type="primary" style={{ margin: '0 10px' }}>
                                预览
                        </Button>
                            <Button type="primary" htmlType="submit">
                                保存
                        </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        )
    }
}
export default CommonPart;
function Header({ data }) {
    const headerLayout = {
        labelCol: {
            span: 4
        },
        wrapperCol: {
            span: 14
        },
    };
    return (
        <MyContext.Consumer>
            {({ type, getFieldDecorator, onChangeColor }) => {
                return (
                    <div>
                        <Row>
                            <Col span={12}>
                                <Form.Item {...headerLayout} label="交易信息">
                                    {getFieldDecorator('isShowTrade', {
                                        initialValue: data.isShowTrade,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择交易信息",
                                            },
                                        ],
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>显示</Radio>
                                            <Radio value={0}>不显示</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </Col>
                            {
                                type == "pc" && <Col span={12}>
                                    <Form.Item {...headerLayout} label="SEO关键字">
                                        {getFieldDecorator('seo', {
                                            initialValue: data.seo,
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item {...headerLayout} label=" 全局背景色">
                                    {getFieldDecorator('bgColor', {
                                        initialValue: data.bgColor,
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
                                                value={data.bgColor}
                                                onBlur={onChangeColor.bind(this, null, 'backGround')}
                                            />
                                        </AutoComplete>
                                    )}
                                </Form.Item>
                            </Col>
                            {
                                type == "pc" && <Col span={12}>
                                    <Form.Item {...headerLayout} label="页面描述">
                                        {getFieldDecorator('desc', {
                                            initialValue: data.desc,
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item {...headerLayout} label="全局背景图">
                                    {getFieldDecorator('bgType', {
                                        initialValue: data.bgType,
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>平铺</Radio>
                                            <Radio value={2}>拉伸（宽度自适应，高度等比缩放）</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 20 }}>
                            <Col push={1}>
                                {
                                    data.bgImg ?
                                        <ImgBox src={data.bgImgUrl}
                                            imgType="bgImg"
                                            showLinkBox={false}
                                        /> : null
                                }
                                {
                                    data.bgImg ? null : <UploadBox imgType="bgImg" count={1} />
                                }
                            </Col>
                        </Row>
                    </div>
                )
            }}
        </MyContext.Consumer>
    )
}
// 活动攻略
function ActivityTips({ data }) {
    const radioGroup = [
        {
            value: 1,
            text: "常规样式"
        }
    ]
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator }) => {
                return (
                    <Row>
                        <Collapse expandIconPosition="right"
                        >
                            <Collapse.Panel
                                key="1"
                                header={<Row type="flex" align="middle">
                                    <Col span={21}>
                                        <CollapseTitle
                                            titleName="活动攻略"
                                            keyWords='guideText'
                                            selectType="isCheckedGuide"
                                            title={data.guideText}
                                            isChecked={data.isCheckedGuide}
                                            radioGroup={radioGroup}
                                            radioKeyWords='guideTextStyleType'
                                            radioCheckedValue={data.guideTextStyleType}
                                        />
                                    </Col>
                                </Row>
                                }
                            >
                                <Col span={12}>
                                    <Form.Item label="文章ID" labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} >
                                        {getFieldDecorator('articleId', {
                                            initialValue: data.articleId,
                                            rules: [
                                                {
                                                    required: data.isCheckedGuide,
                                                    message: "请输入文章ID",
                                                }
                                            ]
                                        })(
                                            <Input placeholder="请输入ID" />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Collapse.Panel>
                        </Collapse>
                    </Row>
                )
            }}
        </MyContext.Consumer>
    )
}
// banner
function Banner({ data }) {
    const radioGroup = [
        {
            value: 1,
            text: "常规banner样式"
        }
    ]
    return (
        <MyContext.Consumer>
            {() => (
                <Row>
                    <Collapse expandIconPosition="right"
                    >
                        <Collapse.Panel
                            key="2"
                            header={<Row type="flex" align="middle">
                                <Col span={21}>
                                    <CollapseTitle
                                        titleName="banner"
                                        showInput={false}
                                        selectType="isCheckedBanner"
                                        isChecked={data.isCheckedBanner}
                                        radioGroup={radioGroup}
                                        radioKeyWords='bannerStyleType'
                                        radioCheckedValue={data.bannerStyleType}
                                    />
                                </Col></Row>
                            }
                        >
                            <Row>
                                <Col push={1}>
                                    {
                                        data.banner ? <ImgBox
                                            src={data.bannerUrl}
                                            imgType="banner"
                                            linkKeyWords="bannerLink"
                                            initialValue={data.bannerLink}
                                        /> : null
                                    }
                                    {
                                        data.banner ? null : <UploadBox imgType="banner" count={1} />
                                    }
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </Row>
            )}
        </MyContext.Consumer>
    )
}
// 商品推荐
function GoodsSuggest({ data, onChangeTableValue, onDelete }) {
    const radioGroup = [
        {
            value: 1,
            text: "样式一 "
        }
    ]
    return <Row>
        <Collapse expandIconPosition="right"
        >
            <Collapse.Panel
                header={<Row type="flex" align="middle">
                    <Col span={21}>
                        <CollapseTitle
                            titleName="商品推荐"
                            showInput={false}
                            selectType={`adviceGoods.isChecked`}
                            radioGroup={radioGroup}
                            radioKeyWords='adviceGoods.styleType'
                            radioCheckedValue={data.adviceGoods.styleType}
                            isChecked={data.adviceGoods.isChecked}
                        />
                    </Col>
                </Row>}
            >
                <AddGoods dataSource={data.adviceGoods.goodsList} onChangeTableValue={onChangeTableValue} onDelete={onDelete} />
            </Collapse.Panel>
        </Collapse>
    </Row>
}
// 优惠券
function CouponList({ item, index }) {
    const radioGroup = [
        {
            value: 1,
            text: "三栏样式 "
        },
        {
            value: 2,
            text: "图片样式 "
        }
    ]
    return <MyContext.Consumer>
        {({ onShow }) => (
            <Row>
                <Collapse expandIconPosition="right"
                >
                    <Collapse.Panel
                        key={`1-${index}`}
                        header={<Row type="flex" align="middle">
                            <Col span={21}>
                                <CollapseTitle
                                    titleName="优惠券"
                                    styleText="四栏样式"
                                    keyWords={`jsonInfo[${index}].title`}
                                    selectType={`jsonInfo[${index}].isChecked`}
                                    radioKeyWords={`jsonInfo[${index}].styleType`}
                                    title={item.title}
                                    radioGroup={radioGroup}
                                    radioCheckedValue={item.styleType}
                                    isChecked={item.isChecked}
                                />
                            </Col>
                            <IconFunction type={item.type} index={index} data={item} />
                        </Row>}
                    >
                        <CommonInfo data={item} index={index} />
                        <Row style={{ marginTop: 10 }}>
                            <span style={{ color: "red", marginRight: 10 }}>*</span>优惠券：
                            <Button type="primary" onClick={onShow.bind(this, 'coupon', index)}>添加优惠券</Button>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col push={1}>
                                {/* <div className={styles.nameBox}>
                                当时的时间混分巨兽
                                <span className={styles.closeIcon}>
                                    <Icon type="close-circle" theme="filled"/>
                                </span>
                            </div> */}
                                {/* <div className={styles.couponBox}>
                                <div className={styles.nameBox}>
                                    当时的时间混分巨兽
                                    <span className={styles.closeIcon}>
                                        <Icon type="close-circle" theme="filled"/>
                                    </span>
                                </div>
                                <div className={styles.couponContent}>
                                    <p><Icon type="warning" theme="filled" style={{color:"red"}}/>请上传优惠券未领取图</p>
                                    <UploadBox />
                                </div>
                            </div> */}
                            </Col>
                        </Row>
                    </Collapse.Panel>
                </Collapse>
            </Row>
        )}
    </MyContext.Consumer>
}
// 特卖专场
function ActList({ item, index, type }) {
    const radioGroup = [
        {
            value: 1,
            text: type=="pc"?"两栏样式":"一栏样式"
        },
    ]
    return <MyContext.Consumer>
        {({ onShow, onDeleteTag }) => (
            <Row>
                <Collapse expandIconPosition="right"
                >
                    <Collapse.Panel
                        key={`1-${index}`}
                        header={<Row type="flex" align="middle">
                            <Col span={21}>
                                <CollapseTitle
                                    titleName="特卖专场"
                                    keyWords={`jsonInfo[${index}].title`}
                                    selectType={`jsonInfo[${index}].isChecked`}
                                    title={item.title}
                                    isChecked={item.isChecked}
                                    radioGroup={radioGroup}
                                    radioCheckedValue={item.styleType}
                                    radioKeyWords={`jsonInfo[${index}].styleType`}
                                />
                            </Col>
                            <IconFunction type={item.type} index={index} data={item} />
                        </Row>}
                    >
                        <CommonInfo data={item} index={index} />
                        <Row style={{ marginTop: 10 }}>
                            <span style={{ color: "red", marginRight: 10 }}>*</span>特卖专场：
                            <Button type="primary" onClick={onShow.bind(this, 'act', index)}>绑定特卖专场</Button>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col push={1}>
                                {
                                    item.actPageList.map((item, tagIndex) => (
                                        <div className={styles.nameBox} key={item.id}>
                                            {item.name}
                                            <span className={styles.closeIcon} onClick={onDeleteTag.bind(this, 'act', index, tagIndex)}>
                                                <Icon type="close-circle" theme="filled" />
                                            </span>
                                        </div>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Collapse.Panel>
                </Collapse>
            </Row>

        )}
    </MyContext.Consumer>
}
// 商品列表
function GoodsCommon({ item, index, onDelete, onChangeTableValue, type }) {
    let titleName = "";
    let showAddOrMinus = false;
    let radioGroup = [
        {
            value: 1,
            text: type=="pc"?"六栏样式":"三栏样式"
        },
    ]
    if (item.type == 1) {
        titleName = "商品列表";
        showAddOrMinus = true;
        radioGroup=type=="pc"?[
            {
                value: 1,
                text: "四栏样式 "
            }
        ]:[
            {
                value: 1,
                text: "两栏样式 "
            },
            {
                value: 2,
                text: "三栏样式 "
            },
        ]
    } else if (item.type == 4) {
        titleName = "限时秒杀"
        radioGroup=[
            {
                value: 1,
                text: "1+4样式 "
            },
        ]
    } else if (item.type == 6) {
        titleName = "巨划算"
    } else if (item.type == 7) {
        titleName = "套餐"
    } else if (item.type == 8) {
        titleName = "满赠"
    }
    return <Row>
        <Collapse expandIconPosition="right"
        >
            <Collapse.Panel
                key={`1-${index}`}
                header={<Row type="flex" align="middle">
                    <Col span={21}>
                        <CollapseTitle
                            titleName={titleName}
                            keyWords={`jsonInfo[${index}].title`}
                            selectType={`jsonInfo[${index}].isChecked`}
                            title={item.title}
                            radioGroup={radioGroup}
                            radioCheckedValue={item.styleType}
                            radioKeyWords={`jsonInfo[${index}].styleType`}
                            isChecked={item.isChecked}
                        />
                    </Col>
                    <IconFunction type={item.type} index={index} data={item} showAddOrMinus={showAddOrMinus}/>
                </Row>}
            >
                <CommonInfo data={item} index={index} />
                <AddGoods dataSource={item.goodsList} index={index} onDelete={onDelete} onChangeTableValue={onChangeTableValue} />
            </Collapse.Panel>
        </Collapse>
    </Row>
}
// 广告位
function AdsPart({ item, index }) {
    const radioGroup = [
        {
            value: 1,
            text: "常规样式 "
        },
    ]
    return <Row>
        <Collapse expandIconPosition="right"
        >
            <Collapse.Panel
                key={`1-${index}`}
                header={<Row type="flex" align="middle">
                    <Col span={21}>
                        <CollapseTitle
                            titleName="广告位"
                            styleText="四栏样式"
                            keyWords={`jsonInfo[${index}].title`}
                            selectType={`jsonInfo[${index}].isChecked`}
                            title={item.title}
                            isChecked={item.isChecked}
                            radioGroup={radioGroup}
                            radioCheckedValue={item.styleType}
                            radioKeyWords={`jsonInfo[${index}].styleType`}
                        />
                    </Col>
                    <IconFunction type={item.type} index={index} data={item} showAddOrMinus={true}/>
                </Row>
                }
            >
                <CommonInfo data={item} index={index} />
                <Row style={{marginTop:10}}>
                    <div style={{ marginLeft: 10, float: 'left' }} >
                        <span>广告图片：</span>
                    </div>
                    {
                        item.adList && item.adList.length > 0 && item.adList.map((img, imgIndex) => (
                            <ImgBox src={img.adUrl} imgType="adList"
                                index={index}
                                imgIndex={imgIndex}
                                linkKeyWords={`jsonInfo[${index}].adList[${imgIndex}].adLink`}
                                initialValue={img.adLink}
                            />
                        ))
                    }
                    <UploadBox imgType="adList" count={100} index={index} />
                </Row>
            </Collapse.Panel>
        </Collapse>
    </Row>
}
// 全部商品
function AllGoods({ data }) {
    const radioGroup = [
        {
            value: 1,
            text: "常规样式 "
        },
    ]
    return <Row>
        <Collapse expandIconPosition="right"
        >
            <Collapse.Panel
                header={<Row type="flex" align="middle">
                    <Col span={21}>
                        <CollapseTitle
                            titleName="全部商品"
                            keyWords='allGoods.title'
                            title={data.allGoods.title}
                            isChecked={data.allGoods.isChecked}
                            selectType='allGoods.isChecked'
                            radioGroup={radioGroup}
                            radioCheckedValue={data.allGoods.styleType}
                            radioKeyWords='allGoods.styleType'
                        />
                    </Col>
                </Row>}
            >
                <CommonInfo data={data.allGoods}
                    isShowTitle='allGoods.isShowTitle'
                    subTitle='allGoods.subTitle'
                    bgColor='allGoods.bgColor'
                    titleImgLink='allGoods.titleImgLink'
                    type="allGoods"
                />
            </Collapse.Panel>
        </Collapse>
    </Row>
}
// 右边导航
function NavBar({ data }) {
    const radioGroup = [
        {
            value: 1,
            text: "样式一 "
        },
    ]
    return <MyContext.Consumer>
        {({ onChangeTitleValue }) => (
            <Row>
                <Collapse expandIconPosition="right"
                >
                    <Collapse.Panel
                        header={<Row type="flex" align="middle">
                            <Col span={21}>
                                <CollapseTitle
                                    titleName="右边导航"
                                    showInput={false}
                                    radioGroup={radioGroup}
                                    radioCheckedValue={data.rightNav.styleType}
                                    radioKeyWords='rightNav.styleType'
                                    selectType={`rightNav.isChecked`}
                                    isChecked={data.rightNav.isChecked}
                                />
                            </Col>
                        </Row>}
                    >
                        <Row>
                            <Col span={10}>
                                <div style={{ marginLeft: 10, float: 'left' }} >
                                    <span>广告图片：</span>
                                </div>
                                {
                                    data.rightNav.ad && data.rightNav.ad['img'] ? <ImgBox
                                        src={data.rightNav.ad.imgUrl}
                                        imgType="navImg"
                                        linkKeyWords={'rightNav.ad.link'}
                                        initialValue={data.rightNav.ad && data.rightNav.ad.link}
                                    /> : null
                                }
                                {
                                    data.rightNav.ad && data.rightNav['ad']['img'] ? null : <UploadBox imgType="navImg" count={1} />
                                }
                            </Col>
                            <Col span={14}>
                                {
                                    data.rightNav.moduleList.map((item, index) => (
                                        <Row style={{ marginBottom: 10 }} className={styles.titleBox}>
                                            <Col span={8}>
                                                <Checkbox 
                                                onChange={onChangeTitleValue.bind(this, index, 'check')}
                                                checked={item.isChecked}
                                                >{item.title}</Checkbox>
                                            </Col>
                                            <Col>
                                                <Input
                                                    style={{ width: 400 }}
                                                    onChange={onChangeTitleValue.bind(this, index, 'input')}
                                                    value={item.newTitle}
                                                />
                                            </Col>
                                        </Row>
                                    ))
                                }
                            </Col>
                        </Row>
                    </Collapse.Panel>
                </Collapse>
            </Row>
        )}
    </MyContext.Consumer>

}
function CollapseTitle({ titleName, radioKeyWords = 'styleType', radioCheckedValue = 1, keyWords = "title", showInput = true, selectType = "type", title = "", isChecked, radioGroup = [] }) {
    return (
        <MyContext.Consumer >
            {({ getFieldDecorator }) => (
                <Row type="flex" align="middle" onClick={(e) => { e.stopPropagation() }}>
                    <Col span={2}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            {getFieldDecorator(selectType, {
                                valuePropName: 'checked',
                                initialValue: isChecked,
                            })(
                                <Checkbox><b>{titleName}</b></Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        {
                            showInput && <Form.Item style={{ marginBottom: 0 }}>
                                {getFieldDecorator(keyWords, {
                                    initialValue: title,
                                    rules: [
                                        {
                                            required: isChecked,
                                            message: "请输入标题"
                                        },
                                        {
                                            max: 10,
                                            message: "最长十个汉字"
                                        }
                                    ]
                                })(
                                    <Input
                                        placeholder="请输入标题，10个汉字，必填"
                                        style={{ width: 400 }}
                                    />
                                )}
                            </Form.Item>
                        }
                    </Col>
                    <Form.Item style={{ marginBottom: 0 }}>
                        {getFieldDecorator(radioKeyWords, {
                            initialValue: radioCheckedValue,
                            rules: [
                                {
                                    required: true,
                                },
                            ]
                        })(
                            <Radio.Group>
                                {
                                    radioGroup.map(item => (
                                        <Radio value={item.value}>{item.text}</Radio>
                                    ))
                                }
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Row>
            )}
        </MyContext.Consumer>
    )
}
function ImgBox({ src, imgType, index, imgIndex, linkKeyWords, initialValue, showLinkBox = true }) {
    return <MyContext.Consumer >
        {({ onRemoveImg, onPreview, getFieldDecorator }) => (
            <div className={styles.imgWrap}>
                <div className={styles.imgBox} style={{ float: imgType == "adList" ? "left" : "" }}>
                    <img src={src} />
                    <div className={styles.imgCover}>
                        <Icon type="eye" onClick={onPreview.bind(this, src)} />
                        <Icon type="delete" onClick={onRemoveImg.bind(this, imgType, index, imgIndex)} />
                    </div>
                </div>
                {
                    showLinkBox && <Form.Item style={{ marginBottom: 0 }}>
                        {getFieldDecorator(linkKeyWords, {
                            initialValue: initialValue,
                        })(
                            <Input
                                placeholder="跳转链接，非必填"
                                style={{ width: 200 }}
                            />
                        )}
                    </Form.Item>
                }
            </div>
        )}
    </MyContext.Consumer>
}
function CommonInfo({ data = null, index = null,
    isShowTitle = `jsonInfo[${index}].isShowTitle`,
    subTitle = `jsonInfo[${index}].subTitle`,
    bgColor = `jsonInfo[${index}].bgColor`,
    titleImgLink = `jsonInfo[${index}].titleImgLink`,
    type=""
}) {
    const layout = {
        labelCol: {
            span: 3
        },
        wrapperCol: {
            span: 10
        }
    }
    return <MyContext.Consumer>
        {({ getFieldDecorator, onChangeColor }) => (
            <div>
                <Row>
                    <Col span={6}>
                        <Form.Item label="正/副标题" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                            {getFieldDecorator(isShowTitle, {
                                initialValue: data.isShowTitle,
                                rules: [
                                    {
                                        required: data.isChecked,
                                        message: "请选择"
                                    }
                                ]
                            })(
                                <Radio.Group>
                                    <Radio value={1}>显示</Radio>
                                    <Radio value={0}>不显示</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="副标题" {...layout}>
                            {getFieldDecorator(subTitle, {
                                initialValue: data.subTitle,
                                rules: [
                                    {
                                        max: 20,
                                        message: "最多20个汉字"
                                    },
                                ]
                            })(
                                <Input
                                    placeholder="请输入副标题，20个汉字"
                                    style={{ width: 400 }}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="背景色" {...layout}>
                            {getFieldDecorator(bgColor, {
                                initialValue: data.bgColor,
                                rules: [
                                    {
                                        required: data.isChecked,
                                        message: "请选择背景色"
                                    }
                                ]
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
                                        onBlur={onChangeColor.bind(this, index, type)}
                                    />
                                </AutoComplete>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <div style={{ marginLeft: 10, float: 'left' }} >
                        <span>标题图：</span>
                    </div>
                    {
                        data.titleImg ? <ImgBox
                            src={data.titleImgUrl}
                            imgType="titleImg"
                            index={index}
                            linkKeyWords={titleImgLink}
                            initialValue={data.titleImgLink}
                        /> : null
                    }
                    {
                        data.titleImg ? null : <UploadBox imgType="titleImg" count={1} index={index} />
                    }
                </Row>

            </div>
        )}
    </MyContext.Consumer>
}
function AddGoods({ dataSource = [], index = null, onDelete, onChangeTableValue }) {
    const extraColumns = [
        {
            title: '排序值',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            render: (sortOrder, record, recordIndex) => {
                return <Input
                    onChange={onChangeTableValue.bind(this, index, recordIndex)}
                    value={sortOrder}
                />
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (_, record, recordIndex) => {
                return <span style={{ color: '#2F54EB', cursor: 'pointer' }} onClick={onDelete.bind(this, index, record.goodsId)}>删除</span>
            }
        },
    ]
    return <MyContext.Consumer>
        {({ onShow, uploadFile }) => (
            <div>
                <Row>
                    <Col span={20}>
                        <Form.Item label="商品配置" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                            <Radio checked>指定商品</Radio>
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Upload
                            style={{ display: 'inline-block' }}
                            action={`${getUrl(API_ENV)}/operate/activity-page/import`}
                            onChange={uploadFile.bind(this, index)}
                            beforeUpload={beforeUpload}
                            headers={{
                                authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                            }}
                        >
                            <Button icon="download">批量导入</Button>
                        </Upload>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={onShow.bind(this, 'goods', index)}>添加商品</Button>
                    </Col>
                </Row>
                <Table
                    bordered
                    columns={[...columns, ...extraColumns]}
                    dataSource={dataSource}
                    rowKey={record => record.goodsId}
                />
            </div>
        )}
    </MyContext.Consumer>
}
function UploadBox({ imgType, count, index = null }) {
    return <MyContext.Consumer>
        {({ onResourceUpload, onUpload }) => (
            <div className={styles.uploadBox}>
                <Upload
                    action={`${getUrl(API_ENV)}/content/img-resource/create`}
                    listType="picture-card"
                    onChange={onUpload.bind(this, imgType, index)}
                    headers={{
                        authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                    showUploadList={false}
                >
                    <div className={styles.btnBox}>
                        <div>
                            <Button size="small">从本地上传</Button>
                        </div>
                    </div>
                </Upload>
                <div className={styles.btn} onClick={onResourceUpload.bind(this, imgType, count, index)}>
                    <p>从素材库上传</p>
                </div>
            </div>
        )}
    </MyContext.Consumer>
}
function IconFunction({ type, index, data, showAddOrMinus=false }) {
    return <MyContext.Consumer>
        {({ onChangeOrder, reduceItem, addItem, resetFields }) => (
            <Col span={3}>
                <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-up"
                    onClick={onChangeOrder.bind(this, 'forward', index, resetFields)}
                ></Button>
                <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-down"
                    onClick={onChangeOrder.bind(this, 'back', index, resetFields)}
                ></Button>
                {
                    showAddOrMinus?(data.plus?
                        <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={addItem.bind(this, type, index, resetFields)}></Button> :
                        <Button style={{ marginLeft: 10 }} shape="circle" icon="minus"
                            onClick={reduceItem.bind(this, index, resetFields)}
                        ></Button>):""
                }
            </Col>
        )}
    </MyContext.Consumer>
}
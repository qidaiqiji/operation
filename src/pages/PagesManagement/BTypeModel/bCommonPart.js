import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, Card, Row, Col, Affix, Radio, Form, Input, Collapse, Checkbox, Select, Table, Modal, Upload, AutoComplete, message } from 'antd';
import globalStyles from '@/global.less';
import styles from './index.less';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import ManualUpload from '@/components/ManualUpload';
import AddGoodsModal from '@/components/AddGoodsModal';
import { getUrl } from '@/utils/request';
import arrayMove from 'array-move';
const MyContext = React.createContext({
    type: 'pc',
    id: '',
    getFieldDecorator: null,
    data: {},
    addItem: () => { }
});
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
        const { form, type,
            id, data, addItem, reduceItem, onShow, onDelete, onUpload, onRemoveImg, onChangeColor,
            onResourceUpload, onPreview,
            onChangeOrder,
            onBack,
            onChangeKey,
            uploadFile,
        } = this.props;
        const { getFieldDecorator, getFieldsValue, resetFields } = form;
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
        return (
            <div>
                <Form onSubmit={this.handleSubmit} >
                    <MyContext.Provider value={{ getFieldDecorator, type, data, colorMap, onChangeColor, onRemoveImg, onPreview }}>
                        <Header onUpload={onUpload} onResourceUpload={onResourceUpload} />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ type, getFieldDecorator, data, colorMap, onChangeKey }}>
                        <ActivityTips />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, data, onRemoveImg, onPreview, onChangeKey }}>
                        <Banner onUpload={onUpload} onResourceUpload={onResourceUpload} />
                    </MyContext.Provider>
                    {
                        data.jsonInfo.map((item, index) => {
                            return item.type == 1 ?
                                <MyContext.Provider
                                    value={{
                                        type,
                                        getFieldDecorator, data,
                                        onShow, getFieldsValue, resetFields,
                                        colorMap, onChangeColor, onRemoveImg,
                                        onPreview,
                                        onChangeKey
                                    }}>
                                    <GoodsList
                                        item={item}
                                        index={index}
                                        onDelete={onDelete}
                                        onUpload={onUpload}
                                        addItem={addItem}
                                        reduceItem={reduceItem}
                                        onResourceUpload={onResourceUpload}
                                        onChangeOrder={onChangeOrder}
                                        uploadFile={uploadFile}
                                    />
                                </MyContext.Provider> :
                                <MyContext.Provider
                                    value={{
                                        getFieldDecorator, data, getFieldsValue, resetFields, colorMap,
                                        onChangeColor, onRemoveImg, onPreview,
                                        onChangeKey
                                    }}>
                                    <AdsPart
                                        item={item}
                                        index={index}
                                        onUpload={onUpload}
                                        addItem={addItem}
                                        reduceItem={reduceItem}
                                        onResourceUpload={onResourceUpload}
                                        onChangeOrder={onChangeOrder}
                                    />
                                </MyContext.Provider>
                        })
                    }

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
function Header({ onUpload, onResourceUpload }) {
    const handleOnUpload = (file) => {
        onUpload("bgImg", null, file)
    }
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
            {({ type, getFieldDecorator, data, colorMap, onChangeColor, onRemoveImg }) => {
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
                                            // value={data.bgColor}
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
                                                onBlur={onChangeColor.bind(this, null)}
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
                                    data.bgImgUrl ?
                                        <ImgBox src={data.bgImgUrl}
                                            imgType="bgImg"
                                            showLinkBox={false}
                                        // linkKeyWords={}
                                        /> : null
                                }
                                {
                                    data.bgImg ? null : <div className={styles.uploadBox}>
                                        <Upload
                                            action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                            listType="picture-card"
                                            onChange={handleOnUpload}
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
                                        <div className={styles.btn} onClick={onResourceUpload.bind(this, 'bgImg', 1, null)}>
                                            <p>从素材库上传</p>
                                        </div>
                                    </div>
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
function ActivityTips() {
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, data }) => {
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
                                            styleText="常规样式"
                                            keyWords={'guideText'}
                                            selectType="isCheckedGuide"
                                            initialValue={data.guideText}
                                            isChecked={data.isCheckedGuide}
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
function Banner({ onUpload, onResourceUpload }) {
    const handleOnUpload = (file) => {
        onUpload("banner", null, file)
    }
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, data }) => (
                <Row>
                    <Collapse expandIconPosition="right"
                    >
                        <Collapse.Panel
                            key="2"
                            header={<Row type="flex" align="middle">
                                <Col span={21}>
                                    <CollapseTitle
                                        titleName="banner"
                                        styleText="常规banner样式"
                                        showInput={false}
                                        selectType="isCheckedBanner"
                                        isChecked={data.isCheckedBanner}
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
                                        data.banner ? null : <div className={styles.uploadBox}>
                                            <Upload
                                                action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                                listType="picture-card"
                                                onChange={handleOnUpload}
                                                headers={{
                                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                                }}
                                                showUploadList={false}
                                            >
                                                {
                                                    <div className={styles.btnBox}>
                                                        <div>
                                                            <Button size="small">从本地上传</Button>
                                                        </div>
                                                    </div>
                                                }
                                            </Upload>
                                            <div className={styles.btn} onClick={onResourceUpload.bind(this, 'banner', 1, null)}>
                                                <p>从素材库上传</p>
                                            </div>
                                        </div>
                                    }
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col>
                                    <Form.Item>
                                        {getFieldDecorator('bannerLink', {
                                            initialValue: data.bannerLink,
                                        })(
                                            <Input
                                                placeholder="跳转链接，非必填"
                                                style={{ width: 400 }}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row> */}

                        </Collapse.Panel>
                    </Collapse>
                </Row>
            )}
        </MyContext.Consumer>
    )

}
// 商品列表
function GoodsList({ item, index, onDelete, onUpload, addItem, reduceItem, onResourceUpload, onChangeOrder, uploadFile }) {
    const handleOnUpload = (file) => {
        onUpload("titleImg", index, file)
    }
    const handleAddItem = (type, resetFields, e) => {
        e.stopPropagation()
        addItem(type, index, resetFields)
    }
    const handleReduceItem = (resetFields, e) => {
        e.stopPropagation()
        reduceItem(index, resetFields)
    }
    // 上移动
    const handleChangeOrder = (type, resetFields, e) => {
        e.stopPropagation();
        onChangeOrder(type, index, resetFields)
    }
    // 
    const beforeUpload = (file) => {
        const isExcel = file.type.indexOf("sheet") > 0 || file.type.indexOf("excel") > 0
        if (!isExcel) {
            message.error("请上传excel格式的文件");
        }
        return isExcel;

    }
    const layout = {
        labelCol: {
            span: 3
        },
        wrapperCol: {
            span: 10
        }
    }
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
            render: (img) => {
                return <img src={img} style={{ width: 40, height: 40 }} />
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
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (_, record, recordIndex) => {
                return <span style={{ color: '#2F54EB', cursor: 'pointer' }} onClick={onDelete.bind(this, index, record.goodsId)}>删除</span>
            }
        },
    ]
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, onShow, getFieldsValue, resetFields, colorMap, onChangeColor, onRemoveImg }) => {
                const values = getFieldsValue();
                return <Row>
                    <Collapse expandIconPosition="right"
                    // activeKey={item.isChecked?[`1-${index}`]:null}
                    >
                        <Collapse.Panel
                            key={`1-${index}`}
                            header={<Row type="flex" align="middle">
                                <Col span={21}>
                                    <CollapseTitle
                                        titleName="商品列表"
                                        styleText="四栏样式"
                                        keyWords={`jsonInfo[${index}].title`}
                                        selectType={`jsonInfo[${index}].isChecked`}
                                        initialValue={item.title}
                                        isChecked={item.isChecked}
                                    />
                                </Col>
                                <Col span={1}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-up"
                                        onClick={handleChangeOrder.bind(this, 'forward', resetFields)}></Button>
                                </Col>
                                <Col span={1}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-down"
                                        onClick={handleChangeOrder.bind(this, 'back', resetFields)}
                                    ></Button>
                                </Col>
                                <Col span={1}>
                                    {
                                        item.plus ?
                                            <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={handleAddItem.bind(this, 1, resetFields)}></Button> :
                                            <Button style={{ marginLeft: 10 }} shape="circle" icon="minus"
                                                onClick={handleReduceItem.bind(this, resetFields)}
                                            ></Button>
                                    }
                                </Col>
                            </Row>}

                        >
                            <Row>
                                <Col span={6}>
                                    <Form.Item label="正/副标题" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                                        {getFieldDecorator(`jsonInfo[${index}].isShowTitle`, {
                                            initialValue: item.isShowTitle,
                                            rules: [
                                                {
                                                    required: item.isChecked,
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
                                        {getFieldDecorator(`jsonInfo[${index}].subTitle`, {
                                            initialValue: item.subTitle,
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
                                        {getFieldDecorator(`jsonInfo[${index}].bgColor`, {
                                            initialValue: item.bgColor,
                                            rules: [
                                                {
                                                    required: item.isChecked,
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
                                                        {/* {`${item.name}(${item.color})`} */}
                                                        {item.color}
                                                    </Select.Option>
                                                ))}
                                            >
                                                <Input
                                                    onBlur={onChangeColor.bind(this, index)}
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
                                    item.titleImg ? <ImgBox
                                        src={item.titleImgUrl}
                                        imgType="titleImg"
                                        index={index}
                                        linkKeyWords={`jsonInfo[${index}].titleImgLink`}
                                        initialValue={item.titleImgLink}
                                        showLinkBox={false}
                                    /> : null
                                }
                                {
                                    item.titleImg ? null : <div className={styles.uploadBox}>
                                        <Upload
                                            action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                            listType="picture-card"
                                            onChange={handleOnUpload}
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
                                        <div className={styles.btn} onClick={onResourceUpload.bind(this, 'titleImg', 1, index)}>
                                            <p>从素材库上传</p>
                                        </div>
                                    </div>
                                }
                            </Row>
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
                                    <Button type="primary" onClick={onShow.bind(this, true, index)}>添加商品</Button>
                                </Col>
                            </Row>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={item.goodsList}
                                rowKey={record => record.goodsId}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </Row>
            }}
        </MyContext.Consumer>
    )

}
// 广告位
function AdsPart({ item, index, onUpload, addItem, reduceItem, onResourceUpload, onChangeOrder }) {
    const handleAddItem = (type, resetFields, e) => {
        e.stopPropagation()
        addItem(type, index, resetFields)
    }
    const handleReduceItem = (resetFields, e) => {
        e.stopPropagation()
        reduceItem(index, resetFields)
    }
    const handleOnUpload = (file) => {
        onUpload("titleImg", index, file)
    }
    const handleOnUploadAds = (file) => {
        onUpload("adList", index, file)
    }
    const handleChangeOrder = (type, resetFields, e) => {
        e.stopPropagation();
        onChangeOrder(type, index, resetFields)
    }
    const layout = {
        labelCol: {
            span: 3
        },
        wrapperCol: {
            span: 10
        }
    }
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, getFieldsValue, resetFields, colorMap, onChangeColor }) => {
                const values = getFieldsValue();
                return <Row>
                    <Collapse expandIconPosition="right"
                    //  activeKey={item.isChecked?[`1-${index}`]:null}
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
                                        initialValue={item.title}
                                        isChecked={item.isChecked}
                                    />
                                </Col>
                                <Col span={1}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-up"
                                        onClick={handleChangeOrder.bind(this, 'forward', resetFields)}></Button>
                                </Col>
                                <Col span={1}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="arrow-down"
                                        onClick={handleChangeOrder.bind(this, 'back', resetFields)}
                                    ></Button>
                                </Col>
                                <Col span={1}>
                                    {
                                        item.plus ?
                                            <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={handleAddItem.bind(this, 2, resetFields)}></Button> :
                                            <Button style={{ marginLeft: 10 }} shape="circle" icon="minus"
                                                onClick={handleReduceItem.bind(this, resetFields)}
                                            ></Button>
                                    }

                                </Col>
                            </Row>
                            }
                        >
                            <Row>
                                <Col span={6}>
                                    <Form.Item label="正/副标题" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }}>
                                        {getFieldDecorator(`jsonInfo[${index}].isShowTitle`, {
                                            initialValue: item.isShowTitle,
                                            rules: [
                                                {
                                                    required: item.isChecked,
                                                    message: "请选择"
                                                }
                                            ]
                                        })(
                                            <Radio.Group
                                            >
                                                <Radio value={1}>显示</Radio>
                                                <Radio value={0}>不显示</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="副标题" {...layout}>
                                        {getFieldDecorator(`jsonInfo[${index}].subTitle`, {
                                            initialValue: item.subTitle,
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
                                        {getFieldDecorator(`jsonInfo[${index}].bgColor`, {
                                            initialValue: item.bgColor,
                                            rules: [
                                                {
                                                    required: item.isChecked,
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
                                                        {/* {`${item.name}(${item.color})`} */}
                                                        {item.color}
                                                    </Select.Option>
                                                ))}
                                            >
                                                <Input
                                                    onBlur={onChangeColor.bind(this, index)}
                                                />
                                            </AutoComplete>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <div style={{ marginLeft: 10, float: 'left' }} >
                                    <span>标题图：</span>
                                </div>
                                {
                                    item.titleImg ? <ImgBox
                                        src={item.titleImgUrl}
                                        imgType="titleImg"
                                        index={index}
                                        linkKeyWords={`jsonInfo[${index}].titleImgUrl`}
                                        initialValue={item.titleImgUrl}
                                        showLinkBox={false}
                                    /> : null
                                }
                                {
                                    item.titleImg ? null : <div className={styles.uploadBox}>
                                        <Upload
                                            action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                            listType="picture-card"
                                            onChange={handleOnUpload}
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
                                        <div className={styles.btn} onClick={onResourceUpload.bind(this, 'titleImg', 1, index)}>
                                            <p>从素材库上传</p>
                                        </div>
                                    </div>
                                }
                            </Row>
                            <Row>
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
                                <div className={styles.uploadBox}>
                                    <Upload
                                        action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                        listType="picture-card"
                                        onChange={handleOnUploadAds}
                                        headers={{
                                            authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                        }}
                                        multiple={true}
                                        showUploadList={false}
                                    >
                                        <div className={styles.btnBox}>
                                            <div>
                                                <Button size="small">从本地上传</Button>
                                            </div>
                                        </div>
                                    </Upload>
                                    <div className={styles.btn} onClick={onResourceUpload.bind(this, 'adList', 100, index)}>
                                        <p>从素材库上传</p>
                                    </div>
                                </div>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </Row>
            }}
        </MyContext.Consumer>
    )
}
function CollapseTitle({ titleName, styleText, keyWords = "title", showInput = true, selectType = "type", initialValue = "", isChecked }) {
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
                                    initialValue: initialValue,
                                    rules: [
                                        {
                                            required: isChecked,
                                            message: "请输入标题"
                                        },
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
                        <Radio checked>{styleText}</Radio>
                    </Form.Item>
                </Row>
            )}
        </MyContext.Consumer>
    )
}
function ImgBox({ src, imgType, index, imgIndex, linkKeyWords, initialValue, showLinkBox = true }) {
    return <MyContext.Consumer >
        {({ onRemoveImg, onPreview, getFieldDecorator, resetFields }) => (
            <div className={styles.imgWrap}>
                <div className={styles.imgBox} style={{ float: imgType == "adList" ? "left" : "" }}>
                    <img src={src} />
                    <div className={styles.imgCover}>
                        <Icon type="eye" onClick={onPreview.bind(this, src)} />
                        <Icon type="delete" onClick={onRemoveImg.bind(this, imgType, index, imgIndex, resetFields)} />
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
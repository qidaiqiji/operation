import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, Card, Row, Col, Affix, Radio, Form, Input, Collapse, Checkbox, Select, Table, Modal, Upload } from 'antd';
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
@Form.create()
class CommonPart extends PureComponent {
    constructor(props) {
        super(props);
    }
    onUploadChange = (files) => {

    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { data } = this.props;
        let tempData = JSON.parse(JSON.stringify(data));
        const tempList = tempData.jsonInfo;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Object.keys(tempData).map(item=>{
                    if(!Object.keys(values).includes(item)) {
                        values[item] = tempData[item]
                    }
                })
                values.jsonInfo.map((info, index) => {
                    values.jsonInfo[index] = Object.assign(values.jsonInfo[index], tempList[index]);
                })
                this.props.onSubmit(values,this.props.type)
            }
        });
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        console.log("xxx",oldIndex, newIndex)
        if(oldIndex == newIndex) {
            return
        }else{
            arrayMove(this.props.data.jsonInfo, oldIndex, newIndex)
            console.log("this.props.data.jsonInfo",this.props.data.jsonInfo)
            // this.setState(({itemList}) => ({
            //     itemList: arrayMove(itemList, oldIndex, newIndex),
            // }));
            // this.setState(({itemList}) => {
            //     console.log("imgg",itemList)
            // });
        }
    };

    render() {
        const { form, type, id, data, addItem, onShow, onDelete, onUpload, onRemove } = this.props;
        const { getFieldDecorator, getFieldsValue, resetFields } = form;
        // const SortableList = SortableContainer(({ itemList }) => {
        //     return <div>
        //         {
        //             itemList.map((item, index) => (
        //                 <MyContext.Provider value={{ type, getFieldDecorator, data, addItem, onShow, getFieldsValue }}>
        //                     <SortableItem type={item.type} index={index} key={1 - `${index}`} item={item} index={index}/>
        //                 </MyContext.Provider>
        //             ))
        //         }
        //     </div>
        // });
        // const SortableItem = SortableElement(({ type, item, index }) => {
        //     if(type == 1) {
        //         return <GoodsList item={item} index={index} onDelete={onDelete} onUpload={onUpload} />
        //     }else if(type==2){
        //         return <AdsPart item={item} index={index} onUpload={onUpload} />
        //     }
        // });
        return (
            <div>
                <Form onSubmit={this.handleSubmit} >
                    <MyContext.Provider value={{ getFieldDecorator, type, data }}>
                        <Header onUpload={onUpload} onRemove={onRemove} />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ type, getFieldDecorator, data }}>
                        <ActivityTips />
                    </MyContext.Provider>
                    <MyContext.Provider value={{ getFieldDecorator, data }}>
                        <Banner onUpload={onUpload} onRemove={onRemove} />
                    </MyContext.Provider>
                    {/* <SortableList itemList={data.jsonInfo} onSortEnd={this.onSortEnd} /> */}
                    {
                        data.jsonInfo.map((item, index) => {
                            return item.type == 1 ?
                                <MyContext.Provider value={{ type, getFieldDecorator, data, addItem, onShow, getFieldsValue, resetFields }}>
                                    <GoodsList item={item} index={index} onDelete={onDelete} onUpload={onUpload} />
                                </MyContext.Provider> :
                                <MyContext.Provider value={{ getFieldDecorator, data, addItem, getFieldsValue, resetFields }}>
                                    <AdsPart item={item} index={index} onUpload={onUpload} />
                                </MyContext.Provider>
                        })
                    }
                   
                    <div className={globalStyles.fixedBottom}>
                        <Form.Item>
                            <Button>
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
function Header({ onUpload, onRemove }) {
    const handleOnUpload = (file) => {
        onUpload("bgImg", null, file)
    }
    const handleRemove = () => {
        onRemove("bgImg")
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
            {({ type, getFieldDecorator, data }) => (
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
                        <Col span={12}>
                            <Form.Item {...headerLayout} label="SEO关键字">
                                {getFieldDecorator('seo', {
                                    initialValue: data.seo,
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Col>
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
                                    <Input />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...headerLayout} label="页面描述">
                                {getFieldDecorator('desc', {
                                    initialValue: data.desc,
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Col>
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
                                data.bgImgUrl ? <ImgBox url={data.bgImgUrl} /> : null
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
                                        className={styles.noShow}
                                        // onRemove={handleRemove}
                                        multiple={false}
                                    >
                                        <div className={styles.btnBox}>
                                            <div>
                                                <Button size="small">从本地上传</Button>
                                            </div>
                                        </div>
                                    </Upload>
                                    <div>
                                        <p>从素材库上传</p>
                                    </div>
                                </div>
                            }
                            {/* <div className={styles.uploadBox} style={{width:120,height:120}}>
                                <div>
                                   
                                </div>
                                <div>
                                    
                                </div>
                            </div> */}
                        </Col>

                    </Row>
                </div>

            )}
        </MyContext.Consumer>
    )
}
// 活动攻略
function ActivityTips() {
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, data }) => (
                <Row>
                    <Collapse expandIconPosition="right">

                        <Collapse.Panel
                            header={<Row type="flex" align="middle">
                                <Col span={22}>
                                    <CollapseTitle
                                        titleName="活动攻略"
                                        styleText="常规样式"
                                        keyWords={'guideText'}
                                        selectType="tipsChecked"
                                        initialValue={data.guideText}
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
                                                required: true,
                                                message: "请输入文章ID"
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
            )}
        </MyContext.Consumer>
    )
}
// banner
function Banner({ onUpload, onRemove }) {
    const handleOnUpload = (file) => {
        onUpload("banner", null, file)
    }
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, data }) => (
                <Row>
                    <Collapse expandIconPosition="right">
                        <Collapse.Panel
                            header={<Row type="flex" align="middle">
                                <Col span={22}>
                                    <CollapseTitle
                                        titleName="banner"
                                        styleText="常规banner样式"
                                        showInput={false}
                                        selectType="bannerChecked"
                                    />
                                </Col></Row>
                            }
                        >
                            <Row>
                                <Col push={1}>
                                    {
                                        data.bannerUrl ? <ImgBox url={data.bannerUrl} /> : null
                                    }
                                    {
                                        data.banner ? null : <div className={styles.uploadBox}>
                                            <Upload
                                                action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                                listType="picture-card"
                                                className={styles.noShow}
                                                onChange={handleOnUpload}
                                                headers={{
                                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                                }}
                                                multiple={false}
                                            // onRemove={handleRemove}
                                            >
                                                {
                                                    <div className={styles.btnBox}>
                                                        <div>
                                                            <Button size="small">从本地上传</Button>
                                                        </div>
                                                    </div>
                                                }
                                            </Upload>
                                            <div>
                                                <p>从素材库上传</p>
                                            </div>
                                        </div>
                                    }

                                </Col>

                            </Row>
                            <Row>
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
                            </Row>

                        </Collapse.Panel>
                    </Collapse>
                </Row>
            )}
        </MyContext.Consumer>
    )

}
// 商品列表
function GoodsList({ item, index, onDelete, onUpload }) {
    const handleOnUpload = (file) => {
        onUpload("titleImg", index, file)
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
                return <span style={{ color: '#2F54EB', cursor: 'pointer' }} onClick={onDelete.bind(this, index, recordIndex)}>删除</span>
            }
        },
    ]
    return (
        <MyContext.Consumer>
            {({ getFieldDecorator, addItem, onShow, getFieldsValue, resetFields }) => {
                const values = getFieldsValue();
                return <Row>
                    <Collapse expandIconPosition="right">
                        <Collapse.Panel
                            header={<Row type="flex" align="middle">
                                <Col span={22}>
                                    <CollapseTitle
                                        titleName="商品列表"
                                        styleText="四栏样式"
                                        keyWords={`jsonInfo[${index}].title`}
                                        selectType={`jsonInfo[${index}].goodsChecked`}
                                        initialValue={item.title}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={addItem.bind(this, "1", index, values, resetFields)}></Button>
                                </Col>
                            </Row>}

                        >
                            <Row>
                                <Col span={6}>
                                    <Form.Item label="标题" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                                        {getFieldDecorator(`jsonInfo[${index}].isShowTitle`, {
                                            initialValue: item.isShowTitle,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择"
                                                }
                                            ]
                                        })(
                                            <Radio.Group>
                                                <Radio value={0}>显示</Radio>
                                                <Radio value={1}>不显示</Radio>
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
                                                }
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
                                                    required: true,
                                                    message: "请选择背景色"
                                                }
                                            ]
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Item label="标题图" labelCol={{ span: 1 }} wrapperCol={{ span: 22 }}>
                                        {
                                            item.titleImgUrl ? <ImgBox /> : null
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
                                                    className={styles.noShow}
                                                    multiple={false}
                                                // onRemove={handleRemove}
                                                >
                                                    <div className={styles.btnBox}>
                                                        <div>
                                                            <Button size="small">从本地上传</Button>
                                                        </div>
                                                    </div>
                                                </Upload>
                                                <div>
                                                    <p>从素材库上传</p>
                                                </div>
                                            </div>
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20}>
                                    <Form.Item label="商品配置" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                        {/* {getFieldDecorator('f', {
                                        rules: [
                                            {
                                                required: true,
                                            }
                                        ]
                                    })( */}
                                        <Radio checked>指定商品</Radio>
                                        {/* )} */}
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Button icon="upload" style={{ marginRight: 10 }}>批量导入</Button>
                                    <Button type="primary" onClick={onShow.bind(this, true, index)}>添加商品</Button>
                                </Col>
                            </Row>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={item.goodsIdList}
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
function AdsPart({ item, index, onUpload }) {
    const handleOnUpload = (file) => {
        onUpload("titleImg", index, file)
    }
    const handleOnUploadAds = (file) => {
        onUpload("adList", index, file)
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
            {({ getFieldDecorator, addItem, getFieldsValue, resetFields }) => {
                const values = getFieldsValue();
                return <Row>
                    <Collapse expandIconPosition="right">
                        <Collapse.Panel
                            header={<Row type="flex" align="middle">
                                <Col span={22}>
                                    <CollapseTitle
                                        titleName="广告位"
                                        styleText="四栏样式"
                                        keyWords={`jsonInfo[${index}].title`}
                                        selectType={`jsonInfo[${index}].adsChecked`}
                                        initialValue={item.title}
                                    />
                                </Col>
                                <Col span={2}>
                                    <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={addItem.bind(this, "2", index, values,resetFields)}></Button>
                                </Col>
                            </Row>
                            }
                        >
                            <Row>
                                <Col span={6}>
                                    <Form.Item label="标题" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                                        {getFieldDecorator(`jsonInfo[${index}].isShowTitle`, {
                                            initialValue: item.isShowTitle,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: "请选择"
                                                }
                                            ]
                                        })(
                                            <Radio.Group>
                                                <Radio value={0}>显示</Radio>
                                                <Radio value={1}>不显示</Radio>
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
                                                }
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
                                                    required: true,
                                                    message: "请选择背景色"
                                                }
                                            ]
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Item label="标题图" labelCol={{ span: 1 }} wrapperCol={{ span: 22 }}>
                                    {
                                        item.titleImgUrl ? <ImgBox /> : null
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
                                                className={styles.noShow}
                                                multiple={false}
                                            // onRemove={handleRemove}
                                            >
                                                <div className={styles.btnBox}>
                                                    <div>
                                                        <Button size="small">从本地上传</Button>
                                                    </div>
                                                </div>
                                            </Upload>
                                            <div>
                                                <p>从素材库上传</p>
                                            </div>
                                        </div>
                                    }
                                </Form.Item>
                            </Row>
                            <Row>
                                <Form.Item label="广告图片" labelCol={{ span: 1 }} wrapperCol={{ span: 22 }}>
                                    {
                                        item.adList.length > 0 && item.adList.map(img => (
                                            <ImgBox url={img.adUrl} />
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
                                            className={styles.noShow}
                                            multiple={true}
                                        // onRemove={handleRemove}
                                        >
                                            <div className={styles.btnBox}>
                                                <div>
                                                    <Button size="small">从本地上传</Button>
                                                </div>
                                            </div>
                                        </Upload>
                                        <div>
                                            <p>从素材库上传</p>
                                        </div>
                                    </div>
                                </Form.Item>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </Row>
            }}
        </MyContext.Consumer>
    )

}

function CollapseTitle({ titleName, styleText, keyWords = "title", showInput = true, selectType = "type", initialValue = "" }) {
    return (
        <MyContext.Consumer >
            {({ getFieldDecorator }) => (
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            {getFieldDecorator(selectType, {
                            })(
                                <Checkbox ><b>{titleName}</b></Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        {
                            showInput && <Form.Item style={{ marginBottom: 0 }}>
                                {getFieldDecorator(keyWords, {
                                    initialValue: initialValue,
                                    rules: [
                                        {
                                            required: true,
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
                        {/* {getFieldDecorator('f', {
                        })(
                            
                        )} */}
                        <Radio checked>{styleText}</Radio>
                    </Form.Item>
                </Row>
            )}
        </MyContext.Consumer>
    )

}
function ImgBox(url) {
    return <div className={styles.imgBox}>
        <img src={url} />
    </div>

}
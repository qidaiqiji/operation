import React, { PureComponent } from 'react';
import classNames from 'classnames';
// import styles from './index.less';
import { Modal, Input, Select, Row, Pagination } from 'antd';
import { connect } from 'dva';
import icon from '../../../public/icon_selected.png';
const { Search } = Input;
import styles from './PostPicture.less';
const Option = Select.Option;
@connect(state => ({
    resourcePool: state.resourcePool,
}))
export default class PostPicture extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getConfig',
        });
        // dispatch({
        //     type: 'resourcePool/getList',
        // });
    }
    handleTriggerSelect = (imgId) => {
        const { dispatch, resourcePool, config } = this.props;
        const { imgList } = resourcePool;
        let hasChoseNum = 0;
        const isHasbeenChoseArray = imgList.filter(item => {
            return item.isSelect == true && +item.imgId === +imgId
        })
        let isHasbeenChose=isHasbeenChoseArray.length!=0;
        if (isHasbeenChose) {
            imgList.some(item => {
                if (+item.imgId === +imgId) {
                    item.isSelect = !item.isSelect;
                }
            })
        } else {
            imgList.map(item => {
                if (item.isSelect == true) {
                    hasChoseNum++
                }

            })
            if (config.choseNum > hasChoseNum) {
                imgList.map(item => {
                    if (+item.imgId === +imgId) {
                        item.isSelect = !item.isSelect;
                    }
                })
            } else {
                console.log("11")
                return;
            }
        }
        let selectedPictureList = imgList.filter(item => {
            return item.isSelect === true;
        })
        console.log("selectedPictureList",selectedPictureList)
        dispatch({
            type: 'resourcePool/updatePageReducer',
            payload: {
                imgList,
                selectedPictureList,
            }
        });
    }
    handleChangeGalleryId = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getImgList',
            payload: {
                galleryId: e,
                page: 1,
            }
        });
    }
    onChangeCurPage(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getImgList',
            payload: {
                page: e,
            }
        });

    }
    handleSearchByName = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'resourcePool/getImgList',
            payload: {
                imgTitle: e,
            }
        });
    }
    render() {
        const { config } = this.props;
        const {
            resourcePool: {
                imgList,
                imgGalleries,
                page,
                totalImg,
                pageSize,
                galleryId,
            } } = this.props;
        return (
            <Modal
                visible={config.visible}
                title="素材库上传"
                style={{ height: 800, overflow: 'auto', paddingBottom: 0 }}
                width={1200}
                onOk={config.confirm}
                onCancel={config.cancel}
            >
                <Row>
                    选择相册：
                <Select
                        className={styles['select-sift']}
                        value={imgGalleries[galleryId]}
                        onChange={this.handleChangeGalleryId.bind(this)}
                    >
                        {Object.keys(imgGalleries).map((galleryId) => {
                            return <Select.Option value={galleryId}>{imgGalleries[galleryId]}</Select.Option>;
                        })}

                    </Select>
                    <Search
                        placeholder="请输入照片名称"
                        className={styles['input-sift']}
                        onSearch={this.handleSearchByName}
                    />

                </Row>
                <Row style={{ marginTop: 10 }}>
                    <div className={styles.container}>
                        {
                            imgList.map(item => {
                                return (
                                    <div className={styles.imgBox} onClick={this.handleTriggerSelect.bind(this, item.imgId)}>
                                        <img src={item.url} className={item.isSelect ? styles.active : ''} alt="图片"></img>
                                        {
                                            item.isSelect ? <a className={styles.selected}><img src={icon}></img></a> : ''
                                        }
                                        <div >
                                            {item.title}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Row>
                <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                    {totalImg > 0 ? (
                        <Pagination
                            defaultCurrent={1}
                            total={totalImg}
                            pageSize={pageSize}
                            current={page}

                            onChange={this.onChangeCurPage.bind(this)}
                        />) : ''}
                </div>
            </Modal>
        )
    }
} 
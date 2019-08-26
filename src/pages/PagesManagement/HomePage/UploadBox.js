import styles from "./index.less";
import { Upload, Button } from 'antd';
import { getUrl } from '../../../utils/request';
function UploadBox({ index = null, onUpload, onResourceUpload }) {
  return <div className={styles.uploadBox}>
    <Upload
      action={`${getUrl(API_ENV)}/content/img-resource/create`}
      listType="picture-card"
      onChange={onUpload.bind(this, index)}
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
    <div onClick={onResourceUpload.bind(this, 1, index)}>
      <p>从素材库上传</p>
    </div>
  </div>
}
export default UploadBox;
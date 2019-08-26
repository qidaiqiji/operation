import styles from "./index.less";
import { Icon } from 'antd';
function ImgBox({ src = "", onDeleteImg, index = null, subIndex=null }) {
    return <div className={styles.imgWrap}>
      <div className={styles.imgBox}>
        <img src={src} />
        <div className={styles.imgCover}>
          <Icon type="eye" />
          <Icon type="delete" onClick={onDeleteImg.bind(this, index, subIndex)} />
        </div>
      </div>
    </div>
  }
  export default ImgBox;
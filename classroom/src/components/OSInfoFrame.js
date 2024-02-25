import ClassroomFrame from "./ClassroomFrame";
import styles from "./styles/OSInfoFrame.module.css";

const OSInfoFrame = () => {
  return (
    <section className={styles.oSInfoFrame}>
      <ClassroomFrame />
      <div className={styles.nestedFramesContainer}>
        <div className={styles.adelineLearningText}>
          <div className={styles.plagiarismCheckerLabel}>
            <b className={styles.adelineLearningTechnical}>
              Adeline learning technical writing
            </b>
          </div>
          <div className={styles.lineElement} />
        </div>
        <div className={styles.ellipseShape}>
          <div className={styles.logoUploadContainer} />
          <div className={styles.uploadLogo}>
            <img
              className={styles.vectorSymbolIcon}
              alt=""
              src="/vector-1.svg"
            />
            <div className={styles.uploadWrapper}>
              <b className={styles.upload}>Upload</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OSInfoFrame;

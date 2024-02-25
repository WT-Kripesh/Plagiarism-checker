import styles from "./styles/FrameComponent.module.css";

const FrameComponent = () => {
  return (
    <header className={styles.titleBarParent}>
      <img className={styles.titleBarIcon} alt="" src="/title-bar.svg" />
      <b className={styles.plagiarismChecker}>Plagiarism Checker</b>
      <div className={styles.homeParent}>
        <b className={styles.home}>Home</b>
        <div className={styles.accountLabel}>
          <b className={styles.account}>Account</b>
        </div>
        <img
          className={styles.vectorLineIcon}
          loading="eager"
          alt=""
          src="/vector.svg"
        />
      </div>
    </header>
  );
};

export default FrameComponent;

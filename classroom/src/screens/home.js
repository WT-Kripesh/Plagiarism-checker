import FrameComponent from "../components/FrameComponent";
import OSInfoFrame from "../components/OSInfoFrame";
import styles from "./styles/home.css";

const Home = () => {
  return (
    <div className={styles.desktop1}>
      <div className={styles.settingsLogo} />
      <FrameComponent />
      <main className={styles.mainMenuFrame}>
        <OSInfoFrame />
        <div className={styles.cautionSignFrame}>
          <div className={styles.cheatingPlagiarismText}>
            <img
              className={styles.nicepngCautionSignPng97105Icon}
              loading="eager"
              alt="Caution"
              src="/nicepng-cautionsignpng-971052-1@2x.png"
            />
            <div className={styles.cheatingPlagiarismLabel}>
              <b className={styles.cheatingPlagiarismContainer}>
                <span>
                  <p
                    className={styles.cheatingPlagiarism}
                  >{`Cheating & Plagiarism hamper `}</p>
                  <p className={styles.yourLearningCapabilities}>
                    your learning capabilities.
                  </p>
                </span>
              </b>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

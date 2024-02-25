import { useMemo } from "react";
import styles from "./styles/ClassroomFrame.module.css";

const ClassroomFrame = ({ propWidth, propMinWidth, propAlignSelf }) => {
  const classroomFrameStyle = useMemo(() => {
    return {
      width: propWidth,
      minWidth: propMinWidth,
      alignSelf: propAlignSelf,
    };
  }, [propWidth, propMinWidth, propAlignSelf]);

  return (
    <div className={styles.classroomFrame} style={classroomFrameStyle}>
      <div className={styles.frameOS}>
        <div className={styles.roomLabel}>
          <b className={styles.classrooms}>classrooms</b>
        </div>
        <div className={styles.graphicsFrame}>
          <div className={styles.lineSeparator} />
          <input
            className={styles.highlight}
            placeholder="Artificial Intelligence"
            type="text"
          />
        </div>
        <div className={styles.cautionFrame}>
          <b className={styles.computerGraphics}>Computer Graphics</b>
        </div>
      </div>
      <b className={styles.embeddedSystems}>Embedded Systems</b>
      <b className={styles.operatingSystems}>Operating Systems</b>
    </div>
  );
};

export default ClassroomFrame;

import styles from "./profile-sky-details.module.css";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const constellationStars: Star[] = [
  { x: 28, y: 106, size: 2.5, opacity: 0.56 },
  { x: 61, y: 70, size: 3.5, opacity: 0.82 },
  { x: 93, y: 82, size: 2, opacity: 0.52 },
  { x: 126, y: 47, size: 2.5, opacity: 0.64 },
  { x: 164, y: 58, size: 4, opacity: 0.86 },
  { x: 184, y: 27, size: 2, opacity: 0.57 },
  { x: 50, y: 36, size: 2, opacity: 0.51 },
];

const moonStars: Star[] = [
  { x: 37, y: 48, size: 2, opacity: 0.52 },
  { x: 63, y: 90, size: 3, opacity: 0.76 },
  { x: 146, y: 73, size: 3.5, opacity: 0.81 },
  { x: 170, y: 39, size: 2, opacity: 0.54 },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [1, 6],
];

function Stars({ points }: { points: Star[] }) {
  return (
    <div className={styles.stars}>
      {points.map(({ x, y, size, opacity }) => (
        <span
          key={x}
          className={styles.star}
          style={{ left: x, top: y, width: size, height: size, opacity }}
        />
      ))}
    </div>
  );
}

export function ProfileSkyDetails() {
  return (
    <>
      <div aria-hidden="true" className={`${styles.skyDetail} ${styles.constellation}`}>
        <div className={styles.skyPlane}>
          <span className={styles.detailGlow} />
          <div className={styles.links}>
            {links.map(([from, to]) => {
              const start = constellationStars[from];
              const end = constellationStars[to];
              const dx = end.x - start.x;
              const dy = end.y - start.y;

              return (
                <span
                  key={`${from}-${to}`}
                  className={styles.link}
                  style={{
                    left: start.x,
                    top: start.y,
                    width: Math.hypot(dx, dy),
                    transform: `rotate(${Math.atan2(dy, dx)}rad)`,
                  }}
                />
              );
            })}
          </div>
          <Stars points={constellationStars} />
        </div>
      </div>
      <div aria-hidden="true" className={`${styles.skyDetail} ${styles.moonScene}`}>
        <div className={styles.skyPlane}>
          <span className={styles.detailGlow} />
          <span className={styles.moon} />
          <Stars points={moonStars} />
        </div>
      </div>
    </>
  );
}

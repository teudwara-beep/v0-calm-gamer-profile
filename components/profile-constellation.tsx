import styles from "./profile-constellation.module.css";

const stars = [
  { x: 28, y: 106, size: 2.5, opacity: 0.56 },
  { x: 61, y: 70, size: 3.5, opacity: 0.82 },
  { x: 93, y: 82, size: 2, opacity: 0.52 },
  { x: 126, y: 47, size: 2.5, opacity: 0.64 },
  { x: 164, y: 58, size: 4, opacity: 0.86 },
  { x: 184, y: 27, size: 2, opacity: 0.57 },
  { x: 50, y: 36, size: 2, opacity: 0.51 },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [1, 6],
];

export function ProfileConstellation() {
  return (
    <div aria-hidden="true" className={styles.constellation}>
      <div className={styles.links}>
        {links.map(([from, to]) => {
          const start = stars[from];
          const end = stars[to];
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
      <div className={styles.stars}>
        {stars.map(({ x, y, size, opacity }) => (
          <span
            key={x}
            className={styles.star}
            style={{ left: x, top: y, width: size, height: size, opacity }}
          />
        ))}
      </div>
    </div>
  );
}

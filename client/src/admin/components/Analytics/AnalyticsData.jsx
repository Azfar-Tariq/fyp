export const cameraData = {
  1: [80, 120, 100, 150, 90, 110, 70, 100, 130],
  2: [90, 130, 110, 160, 100, 120, 80, 110, 140],
  3: [100, 140, 120, 170, 110, 130, 90, 120, 150],
};

export const getCameraData = (cameraId) => {
  if (cameraData[cameraId]) {
    return cameraData[cameraId];
  } else {
    return Array.from(
      { length: 9 },
      () => Math.floor(Math.random() * 150) + 50
    );
  }
};

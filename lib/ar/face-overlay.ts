export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface JewelryPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// Key landmark indices for face mesh
export const LANDMARK_INDICES = {
  // Ear landmarks
  LEFT_EAR: 234,
  RIGHT_EAR: 454,
  // Jawline landmarks
  JAW_START: 172,
  JAW_END: 397,
  // Collarbone approximation
  LEFT_SHOULDER: 2,
  RIGHT_SHOULDER: 5,
};

export function getEarPosition(
  landmarks: Landmark[],
  isLeft: boolean
): JewelryPosition | null {
  if (!landmarks || landmarks.length < 468) return null;

  const earIndex = isLeft ? LANDMARK_INDICES.LEFT_EAR : LANDMARK_INDICES.RIGHT_EAR;
  const ear = landmarks[earIndex];

  if (!ear) return null;

  // Calculate earring position relative to ear landmark
  const size = 0.05; // Relative size
  return {
    x: ear.x - size / 2,
    y: ear.y - size / 2,
    width: size,
    height: size,
    rotation: 0,
  };
}

export function getNecklacePosition(
  landmarks: Landmark[]
): JewelryPosition | null {
  if (!landmarks || landmarks.length < 468) return null;

  // Use jawline landmarks to position necklace
  const jawStart = landmarks[LANDMARK_INDICES.JAW_START];
  const jawEnd = landmarks[LANDMARK_INDICES.JAW_END];

  if (!jawStart || !jawEnd) return null;

  // Calculate center point below jawline
  const centerX = (jawStart.x + jawEnd.x) / 2;
  const centerY = Math.max(jawStart.y, jawEnd.y) + 0.1; // Below jawline

  const width = Math.abs(jawEnd.x - jawStart.x) * 1.2;
  const height = 0.08;

  return {
    x: centerX - width / 2,
    y: centerY,
    width,
    height,
    rotation: 0,
  };
}

export function drawJewelryOnCanvas(
  ctx: CanvasRenderingContext2D,
  position: JewelryPosition,
  jewelryImage: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): void {
  const x = position.x * canvasWidth;
  const y = position.y * canvasHeight;
  const width = position.width * canvasWidth;
  const height = position.height * canvasHeight;

  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(position.rotation);
  ctx.drawImage(jewelryImage, -width / 2, -height / 2, width, height);
  ctx.restore();
}


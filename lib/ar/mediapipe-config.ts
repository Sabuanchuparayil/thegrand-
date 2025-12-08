import { loadFaceMesh } from "./mediapipe-loader";

export interface MediaPipeConfig {
  maxNumFaces: number;
  refineLandmarks: boolean;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

export const defaultConfig: MediaPipeConfig = {
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

export async function createFaceMesh(
  onResults: (results: any) => void,
  config: MediaPipeConfig = defaultConfig
): Promise<any> {
  // Load FaceMesh at runtime to avoid build-time import issues
  const FaceMeshClass = await loadFaceMesh();

  const faceMesh = new FaceMeshClass({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    },
  });

  faceMesh.setOptions({
    maxNumFaces: config.maxNumFaces,
    refineLandmarks: config.refineLandmarks,
    minDetectionConfidence: config.minDetectionConfidence,
    minTrackingConfidence: config.minTrackingConfidence,
  });

  faceMesh.onResults(onResults);

  return faceMesh;
}

export async function startCamera(
  videoElement: HTMLVideoElement,
  faceMesh: any
): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
  });

  videoElement.srcObject = stream;
  videoElement.play();

  const processFrame = async () => {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      await faceMesh.send({ image: videoElement });
    }
    requestAnimationFrame(processFrame);
  };

  videoElement.addEventListener("loadedmetadata", () => {
    processFrame();
  });
}


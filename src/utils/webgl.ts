export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl');

    return Boolean(gl && typeof WebGLRenderingContext !== 'undefined');
  } catch {
    return false;
  }
}

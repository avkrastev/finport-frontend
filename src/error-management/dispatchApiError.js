export default function dispatchApiError(options) {
  const errorEvent = new CustomEvent('ast-error', { detail: options });
  window.dispatchEvent(errorEvent);
}

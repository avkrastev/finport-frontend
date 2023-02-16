export default function clearApiError() {
  const errorEvent = new CustomEvent('clear-ast-error');
  window.dispatchEvent(errorEvent);
}

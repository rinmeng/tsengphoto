/**
 * Scrolls the window to the top of the page with smooth animation
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/**
 * Scrolls to a specific element with smooth animation
 * @param elementId - The ID of the element to scroll to
 */
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

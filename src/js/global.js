/**
 * Global JavaScript - Runs on all pages
 * Add site-wide functionality here
 */

console.log('→ Global JS initialized');

// Example: Smooth scroll for anchor links
/*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
*/

// Example: Add active state to nav based on current page
/*
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});
*/

// Export functions if other modules need them
export function initGlobal() {
  console.log('Global functions ready');
}

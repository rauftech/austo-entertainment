/**
 * About page specific JavaScript
 */

console.log('→ About page JS initialized');

// Example: About page animations
/*
const aboutSections = document.querySelectorAll('.about-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });

aboutSections.forEach(section => observer.observe(section));
*/

// Example: Team member modal
/*
document.querySelectorAll('.team-member').forEach(member => {
  member.addEventListener('click', () => {
    const modal = document.querySelector('.team-modal');
    const name = member.dataset.name;
    const bio = member.dataset.bio;
    
    modal.querySelector('.modal-name').textContent = name;
    modal.querySelector('.modal-bio').textContent = bio;
    modal.classList.add('active');
  });
});
*/

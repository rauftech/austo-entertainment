export const cleanGSAP = () => {
  const triggers = ScrollTrigger.getAll();
  triggers.forEach((trigger) => trigger.kill());

  ScrollTrigger.refresh();
  window.dispatchEvent(new Event('resize'));

  console.log(`→ Cleaned up ${triggers.length} ScrollTriggers`);
};

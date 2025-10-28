const cleanGSAP = () => {
  ScrollTrigger.getAll().forEach((t) => t.kill(false));
  ScrollTrigger.refresh();
  window.dispatchEvent(new Event('resize'));
};

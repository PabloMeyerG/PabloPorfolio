(() => {
  const backBtn = document.querySelector('.backbtn');

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '../../index.html#projects';
  };

  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') goBack();
  });
})();

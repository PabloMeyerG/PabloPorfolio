(() => {
  const closeBtn = document.getElementById('projectClose');

  const goBack = () => {
    // back si vienes del index, fallback si entras directo
    if (window.history.length > 1) window.history.back();
    else window.location.href = '../../index.html#projects';
  };

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') goBack();
  });
})();

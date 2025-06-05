document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.href;
    if (href && href !== window.location.href && document.startViewTransition) {
      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = href;
      });
    }
  });
});
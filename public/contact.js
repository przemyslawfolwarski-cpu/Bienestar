(() => {
  'use strict';
  const button = document.querySelector('.copy-number');
  if (!button) return;
  const controls = button.closest('.copy-controls');
  const status = controls.querySelector('.copy-status');
  const phone = document.querySelector('.contact-copy a[href^="tel:"]');
  controls.hidden = false;

  function legacyCopy(text) {
    if (typeof document.execCommand !== 'function') return false;
    const field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.setAttribute('aria-hidden', 'true');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px;';
    document.body.appendChild(field);
    let copied = false;
    try {
      field.select();
      field.setSelectionRange(0, text.length);
      copied = document.execCommand('copy');
    } catch (_) {
      copied = false;
    } finally {
      field.remove();
      try { button.focus({preventScroll: true}); } catch (_) { button.focus(); }
    }
    return copied;
  }

  button.addEventListener('click', async () => {
    const number = button.dataset.number;
    let copied = false;
    try {
      // Called directly from the user's tap, including Safari's activation window.
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(number);
        copied = true;
      } else {
        copied = legacyCopy(number);
      }
    } catch (_) {
      copied = legacyCopy(number);
    }
    status.textContent = copied ? button.dataset.success : button.dataset.fallback;
    if (!copied && phone) {
      // Leave the public phone number available for native selection/copy.
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(phone);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
})();

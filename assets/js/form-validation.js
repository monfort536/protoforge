'use strict';

(() => {
  const fieldSelector = 'input, select, textarea';
  const isField = field => field?.matches?.(fieldSelector) && field.form &&
    !field.disabled && !field.readOnly && !['hidden', 'submit', 'button', 'reset'].includes(field.type);
  const isDigits = field => field.type === 'tel' || field.type === 'number';
  const isName = field => field.autocomplete === 'name';
  const fields = form => [...form.querySelectorAll(fieldSelector)].filter(isField);
  const ownMessages = new WeakMap();

  function errorFor(field) {
    const value = field.value;
    const trimmed = value.trim();
    if (field.validity.badInput) return 'Enter numbers only (0–9).';
    if (field.required && !trimmed) return field.type === 'file' ? 'Choose a model file.' : 'This field is required.';
    if (!trimmed && !value) return '';
    if (isName(field)) {
      const name = trimmed.normalize('NFC');
      if (!/^\p{L}[\p{L}\p{M}]*(?: +\p{L}[\p{L}\p{M}]*)*$/u.test(name)) {
        return 'Use letters and spaces only for your name.';
      }
      if ((name.match(/\p{L}/gu) || []).length < 3) return 'Your name must contain at least 3 letters.';
    }
    if (field.type === 'email') {
      const parts = trimmed.split('@');
      const local = parts[0];
      const domain = parts[1] || '';
      const labels = domain.split('.');
      const validDomain = labels.length >= 2 && labels.every(label =>
        /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label));
      if (field.validity.typeMismatch || parts.length !== 2 || local.length > 64 ||
          local.startsWith('.') || local.endsWith('.') || local.includes('..') ||
          !validDomain || !/^[a-z]{2,63}$/i.test(labels.at(-1))) {
        return 'Enter a valid email address, such as name@example.com.';
      }
    }
    if (isDigits(field)) {
      if (!/^[0-9]+$/.test(value)) return 'Enter numbers only (0–9), without spaces or symbols.';
      if (field.type === 'number') {
        const number = Number(value);
        if (!Number.isSafeInteger(number)) return 'Enter a valid whole number.';
        if (field.min !== '' && number < Number(field.min)) return `Enter a number of at least ${field.min}.`;
        if (field.max !== '' && number > Number(field.max)) return `Enter a number no greater than ${field.max}.`;
      }
    }
    if (field.minLength > 0 && value.length < field.minLength) return `Use at least ${field.minLength} characters.`;
    if (field.maxLength > 0 && value.length > field.maxLength) return `Use no more than ${field.maxLength} characters.`;
    if (field.id === 'confirm-password' && value !== field.form.querySelector('#password')?.value) {
      return 'The passwords do not match.';
    }
    return field.validity.valid ? '' : field.validationMessage;
  }

  function showError(field, message) {
    const id = `${field.id || field.name}-error`;
    let error = document.getElementById(id);
    if (!error && message) {
      error = document.createElement('span');
      error.id = id;
      error.className = 'field-error';
      error.setAttribute('aria-live', 'polite');
      const anchor = field.closest('.password-wrap') || field;
      anchor.insertAdjacentElement('afterend', error);
      const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      descriptions.add(id);
      field.setAttribute('aria-describedby', [...descriptions].join(' '));
    }
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validateField(field, show = true) {
    // Preserve errors set by other features, such as model-file validation.
    if (field.validity.customError && field.validationMessage !== ownMessages.get(field)) {
      if (show) showError(field, field.validationMessage);
      return false;
    }
    field.setCustomValidity('');
    const message = errorFor(field);
    field.setCustomValidity(message);
    ownMessages.set(field, message);
    if (show) showError(field, message);
    return !message;
  }

  function normalize(field) {
    if (isName(field) || field.type === 'email') field.value = field.value.trim();
  }

  function validateForm(form) {
    let firstInvalid;
    for (const field of fields(form)) {
      normalize(field);
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    }
    firstInvalid?.focus();
    return !firstInvalid;
  }

  // Keep native HTML constraints as a fallback; use inline feedback with JS.
  document.querySelectorAll('form').forEach(form => { form.noValidate = true; });
  document.addEventListener('submit', event => {
    if (!validateForm(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('blur', event => {
    if (!isField(event.target)) return;
    normalize(event.target);
    validateField(event.target);
  }, true);
  document.addEventListener('input', event => {
    const field = event.target;
    if (!isField(field) || event.isComposing) return;
    validateField(field, field.hasAttribute('aria-invalid'));
    if (field.id === 'password') {
      const confirmation = field.form.querySelector('#confirm-password');
      if (confirmation?.value) validateField(confirmation);
    }
  }, true);
  document.addEventListener('change', event => {
    if (isField(event.target)) validateField(event.target);
  }, true);

  // Reject non-digit typing and paste without silently changing a phone number.
  document.addEventListener('beforeinput', event => {
    if (isField(event.target) && isDigits(event.target) && event.data && /[^0-9]/.test(event.data)) event.preventDefault();
  });
  document.addEventListener('keydown', event => {
    if (isField(event.target) && isDigits(event.target) && !event.ctrlKey && !event.metaKey &&
        !event.altKey && event.key.length === 1 && /[^0-9]/.test(event.key)) event.preventDefault();
  });
  document.addEventListener('paste', event => {
    if (isField(event.target) && isDigits(event.target) && /[^0-9]/.test(event.clipboardData.getData('text'))) {
      event.preventDefault();
      showError(event.target, 'Paste numbers only (0–9), without spaces or symbols.');
    }
  });
  document.addEventListener('reset', event => {
    for (const field of fields(event.target)) {
      field.setCustomValidity('');
      ownMessages.delete(field);
      showError(field, '');
    }
  }, true);

  window.ProtoForgeValidation = { validateField, validateForm };
})();

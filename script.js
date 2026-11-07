(() => {
  const root = document.documentElement;
  const languageButtons = document.querySelectorAll('[data-language]');
  const translatedElements = Array.from(document.querySelectorAll('[data-roman][data-ur]'), element => ({
    element,
    text: { en: element.textContent, roman: element.dataset.roman, ur: element.dataset.ur },
  }));
  const languages = {
    en: { lang: 'en', dir: 'ltr', navigation: 'Main navigation', selector: 'Site language' },
    roman: { lang: 'ur-Latn', dir: 'ltr', navigation: 'Bunyadi menu', selector: 'Website ki zuban' },
    ur: { lang: 'ur', dir: 'rtl', navigation: 'مرکزی مینو', selector: 'ویب سائٹ کی زبان' },
  };
  const navigation = document.querySelector('#site-nav');
  const languageSelector = document.querySelector('.languages');
  const menuButton = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  const mobile = window.matchMedia('(max-width: 760px)');
  const storageKey = 'rrw-lang';

  function setLanguage(key) {
    const { lang, dir, navigation: label, selector } = languages[key];
    root.lang = lang;
    root.dir = dir;
    navigation.setAttribute('aria-label', label);
    languageSelector.setAttribute('aria-label', selector);
    translatedElements.forEach(({ element, text }) => {
      element.textContent = text[key];
    });
    languageButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === key));
    });
  }

  let preferredLanguage = 'en';
  try {
    const saved = localStorage.getItem(storageKey);
    if (Object.hasOwn(languages, saved)) preferredLanguage = saved;
  } catch {
    // Language switching still works when storage is unavailable.
  }

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.language;
      setLanguage(key);
      try {
        localStorage.setItem(storageKey, key);
      } catch {
        // The current page still uses the selected language.
      }
    });
  });

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
  }

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') === 'false');
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!mobile.matches || !link) return;

    setMenu(false);
    const section = document.getElementById(link.hash.slice(1));
    if (section) {
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });

  mobile.addEventListener('change', () => setMenu(false));

  setLanguage(preferredLanguage);
  menuButton.hidden = false;
  root.classList.add('js');
})();

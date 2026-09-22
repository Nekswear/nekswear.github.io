/**
 * script.js — Vanilla JS функциональность лендинга
 * Включает: плавный скролл, мобильное меню, IntersectionObserver, валидацию формы
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ===================================================================
     1. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРНЫМ ССЫЛКАМ (JS Fallback)
     =================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Сворачиваем мобильное меню при клике на ссылку, если оно открыто
        const nav = document.querySelector('.header__nav');
        const burger = document.querySelector('.header__burger');
        if (nav && nav.classList.contains('header__nav--active')) {
          closeMobileMenu(nav, burger);
        }

        // Плавная прокрутка
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Устанавливаем фокус на целевой элемент для доступности (a11y)
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  /* ===================================================================
     2. МОБИЛЬНОЕ МЕНЮ-БУРГЕР
     =================================================================== */
  const burgerBtn = document.querySelector('.header__burger');
  const navMenu = document.querySelector('.header__nav');

  function openMobileMenu(nav, burger) {
    nav.classList.add('header__nav--active');
    burger.classList.add('header__burger--active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    document.body.style.overflow = 'hidden'; // Блокируем скролл фона
  }

  function closeMobileMenu(nav, burger) {
    nav.classList.remove('header__nav--active');
    burger.classList.remove('header__burger--active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = ''; // Возвращаем скролл
  }

  if (burgerBtn && navMenu) {
    // Переключение по клику на бургер
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu(navMenu, burgerBtn);
      } else {
        openMobileMenu(navMenu, burgerBtn);
      }
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
      const isMenuOpen = navMenu.classList.contains('header__nav--active');
      if (isMenuOpen && !navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        closeMobileMenu(navMenu, burgerBtn);
      }
    });

    // Закрытие по нажатию клавиши Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('header__nav--active')) {
        closeMobileMenu(navMenu, burgerBtn);
        burgerBtn.focus(); // Возвращаем фокус на кнопку бургера
      }
    });
  }

  // Сброс состояния меню при изменении размера окна (поворот экрана / ресайз)
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && navMenu.classList.contains('header__nav--active')) {
        closeMobileMenu(navMenu, burgerBtn);
      }
    });

  /* ===================================================================
     3. INTERSECTION OBSERVER (Анимация появления при скролле)
     =================================================================== */
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          observer.unobserve(entry.target); // Прекращаем наблюдение после анимации
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback для устаревших браузеров
    fadeElements.forEach(el => el.classList.add('fade-in--visible'));
  }

});
/* =========================================================
   DUSUN KLUMUTAN — VILLAGE PROFILE WEBSITE
   Vanilla JavaScript — All interactive features
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. LOADING SCREEN ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
    }, 500);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(function () {
    loadingScreen.classList.add('hidden');
  }, 2500);

  /* ---------- 2. SCROLL PROGRESS BAR ---------- */
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ---------- 3. NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById('navbar');
  function updateNavbarState() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---------- 4. BACK TO TOP BUTTON ---------- */
  const backToTopBtn = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- COMBINED SCROLL HANDLER (perf-friendly) ---------- */
  let scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavbarState();
        updateBackToTop();
        updateActiveNavLink();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });
  // Initial state
  updateScrollProgress();
  updateNavbarState();
  updateBackToTop();

  /* ---------- 5. MOBILE HAMBURGER MENU ---------- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navbarNav = document.getElementById('navbar-nav');
  hamburgerBtn.addEventListener('click', function () {
    const isOpen = navbarNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navbarNav.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 6. ACTIVE NAV LINK ON SCROLL ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.dataset.section === currentSectionId) {
        link.classList.add('active-link');
      }
    });
  }

  /* ---------- 7. DARK MODE TOGGLE ---------- */
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = darkModeToggle.querySelector('i');

  function setDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    darkModeIcon.className = enabled ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // Default to light mode each session (no persistent storage dependency)
  let darkModeEnabled = false;
  setDarkMode(darkModeEnabled);

  darkModeToggle.addEventListener('click', function () {
    darkModeEnabled = !darkModeEnabled;
    setDarkMode(darkModeEnabled);
  });

  /* ---------- 8. REVEAL ON SCROLL (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- 9. TYPING EFFECT (HERO) ---------- */
  const typingTextEl = document.getElementById('typing-text');
  const typingPhrases = [
    'Harmoni Alam dan Budaya',
    'Gotong Royong, Maju Bersama',
    'Lestari Tradisi, Siap Berinovasi'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = typingPhrases[phraseIndex];

    if (!isDeleting) {
      typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      }
    }

    setTimeout(typeLoop, isDeleting ? 45 : 90);
  }
  typeLoop();

  /* ---------- 10. ANIMATED STATISTICS COUNTERS ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateStats() {
    statNumbers.forEach(function (statEl) {
      const target = parseInt(statEl.dataset.target, 10);
      let current = 0;
      const duration = 1500;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;

      const counter = setInterval(function () {
        current += increment;
        if (current >= target) {
          statEl.textContent = target.toLocaleString('id-ID');
          clearInterval(counter);
        } else {
          statEl.textContent = Math.floor(current).toLocaleString('id-ID');
        }
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ---------- 11. GALLERY LIGHTBOX ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const imgSrc = galleryItems[index].dataset.img;
    const imgAlt = galleryItems[index].querySelector('img').alt;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* ---------- 12. TESTIMONIAL SLIDER ---------- */
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDotsWrap = document.getElementById('testimonial-dots');
  let testimonialIndex = 0;
  let testimonialAutoTimer = null;

  testimonialCards.forEach(function (_, index) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Tampilkan testimoni ' + (index + 1));
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', function () {
      goToTestimonial(index);
      resetTestimonialAuto();
    });
    testimonialDotsWrap.appendChild(dot);
  });

  const testimonialDots = testimonialDotsWrap.querySelectorAll('button');

  function goToTestimonial(index) {
    testimonialIndex = index;
    testimonialTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
    testimonialDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    goToTestimonial(testimonialIndex);
  }

  function resetTestimonialAuto() {
    clearInterval(testimonialAutoTimer);
    testimonialAutoTimer = setInterval(nextTestimonial, 6000);
  }

  if (testimonialCards.length > 0) {
    resetTestimonialAuto();
  }

  /* ---------- 13. FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other items (single-open accordion)
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 14. CONTACT FORM (frontend only) ---------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      formSuccess.style.color = '#C0392B';
      formSuccess.textContent = 'Mohon lengkapi semua kolom dengan benar.';
      return;
    }

    formSuccess.style.color = '#1B8A4A';
    formSuccess.textContent = 'Terima kasih! Pesan Anda telah berhasil dikirim (simulasi front-end).';
    contactForm.reset();

    setTimeout(function () {
      formSuccess.textContent = '';
    }, 5000);
  });

  /* ---------- 15. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 16. FOOTER CURRENT YEAR ---------- */
  document.getElementById('current-year').textContent = new Date().getFullYear();

});

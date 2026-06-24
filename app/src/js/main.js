import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import '../styles/main.css';

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   LENIS SMOOTH SCROLL
   ============================================ */
let lenis;

export function initLenis() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

export function getLenis() {
  return lenis;
}

/* ============================================
   PAGE LOADER
   ============================================ */
export function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  const minLoadTime = 2000;
  const startTime = Date.now();

  const hideLoader = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadTime - elapsed);

    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
        initHeroAnimations();
      }, 800);
    }, remaining);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
}

/* ============================================
   NAVIGATION
   ============================================ */
export function initNavigation() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      nav.classList.add('glass-nav');
      nav.style.height = '64px';
    } else {
      nav.classList.remove('glass-nav');
      nav.style.height = '80px';
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.menu-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Search overlay
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      searchOverlay.querySelector('input')?.focus();
    });
  }

  if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
export function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right')
      .forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px',
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
export function initCustomCursor() {
  if (window.innerWidth < 1024) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animate = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  // Expand on interactive elements
  const interactives = document.querySelectorAll('a, button, .tilt-card, .masonry-item, .diagram-point, .calendar-day:not(.disabled)');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
}

/* ============================================
   HERO SLIDER
   ============================================ */
let heroInterval;

export function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const progressBar = document.querySelector('.hero-progress');
  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  const goToSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;

    // Reset progress bar
    if (progressBar) {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // trigger reflow
      progressBar.style.animation = 'progressFill 5s linear infinite';
    }

    // Animate text
    animateHeroText(slides[index]);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % totalSlides);
  };

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(heroInterval);
      goToSlide(i);
      heroInterval = setInterval(nextSlide, 5000);
    });
  });

  // Start auto-advance
  heroInterval = setInterval(nextSlide, 5000);

  // Initial slide
  goToSlide(0);
}

function animateHeroText(slide) {
  const headline = slide.querySelector('.hero-headline');
  const subhead = slide.querySelector('.hero-subhead');
  const ctas = slide.querySelector('.hero-ctas');

  if (headline) {
    gsap.fromTo(headline,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
    );
  }
  if (subhead) {
    gsap.fromTo(subhead,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power3.out' }
    );
  }
  if (ctas) {
    gsap.fromTo(ctas,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.9, ease: 'power3.out' }
    );
  }
}

function initHeroAnimations() {
  // Trigger initial hero text animation
  const firstSlide = document.querySelector('.hero-slide');
  if (firstSlide) {
    animateHeroText(firstSlide);
  }
}

/* ============================================
   HORIZONTAL DRAG SCROLL
   ============================================ */
export function initDragScroll() {
  const containers = document.querySelectorAll('.drag-scroll');

  containers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let rafId;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      velocity = 0;
      cancelAnimationFrame(rafId);
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.style.cursor = 'grab';
      applyMomentum();
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.style.cursor = 'grab';
      applyMomentum();
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      velocity = walk - (container.scrollLeft - scrollLeft);
      container.scrollLeft = scrollLeft - walk;
    });

    function applyMomentum() {
      if (Math.abs(velocity) < 0.5) return;
      container.scrollLeft -= velocity;
      velocity *= 0.95;
      rafId = requestAnimationFrame(applyMomentum);
    }

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.5;
      container.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });
  });
}

/* ============================================
   3D TILT CARDS
   ============================================ */
export function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      card.style.boxShadow = '0 20px 60px rgba(107,33,168,0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.boxShadow = '0 4px 20px rgba(30,27,75,0.06)';
    });
  });
}

/* ============================================
   TESTIMONIAL CAROUSEL
   ============================================ */
export function initTestimonialCarousel() {
  const container = document.querySelector('.testimonial-carousel');
  if (!container) return;

  const slides = container.querySelectorAll('.testimonial-slide');
  const dots = container.querySelectorAll('.testimonial-dot');
  const prevBtn = container.querySelector('.testimonial-prev');
  const nextBtn = container.querySelector('.testimonial-next');

  if (!slides.length) return;

  let current = 0;
  let autoInterval;

  const goTo = (index) => {
    slides.forEach((slide, i) => {
      gsap.to(slide, {
        opacity: i === index ? 1 : 0,
        scale: i === index ? 1 : 0.95,
        duration: 0.6,
        ease: 'power2.inOut',
      });
      slide.style.pointerEvents = i === index ? 'all' : 'none';
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    current = index;
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  const startAuto = () => {
    autoInterval = setInterval(next, 6000);
  };

  const resetAuto = () => {
    clearInterval(autoInterval);
    startAuto();
  };

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(autoInterval));
  container.addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();
}

/* ============================================
   TIMELINE
   ============================================ */
export function initTimeline() {
  const timeline = document.querySelector('.timeline-container');
  if (!timeline) return;

  const fill = timeline.querySelector('.timeline-fill');
  const steps = timeline.querySelectorAll('.timeline-step');

  if (fill) {
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 80%',
      end: 'bottom 50%',
      scrub: true,
      onUpdate: (self) => {
        fill.style.height = (self.progress * 100) + '%';
      },
    });
  }

  steps.forEach((step, i) => {
    const isLeft = i % 2 === 0;
    gsap.fromTo(step, {
      opacity: 0,
      x: isLeft ? -40 : 40,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
export function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const chevron = item.querySelector('.faq-chevron');

    question?.addEventListener('click', () => {
      const isOpen = answer?.classList.contains('open');

      // Close all others
      items.forEach(other => {
        other.querySelector('.faq-answer')?.classList.remove('open');
        other.querySelector('.faq-chevron')?.classList.remove('rotated');
      });

      // Toggle current
      if (!isOpen) {
        answer?.classList.add('open');
        chevron?.classList.add('rotated');
      }
    });
  });
}

/* ============================================
   BOOKING CALENDAR
   ============================================ */
export function initCalendar() {
  const calendarEl = document.querySelector('.booking-calendar');
  if (!calendarEl) return;

  const grid = calendarEl.querySelector('.calendar-grid-body');
  const monthLabel = calendarEl.querySelector('.calendar-month-label');
  const prevBtn = calendarEl.querySelector('.calendar-prev');
  const nextBtn = calendarEl.querySelector('.calendar-next');
  const timeSlots = calendarEl.querySelector('.time-slots');
  const bookingButtons = calendarEl.querySelector('.booking-buttons');

  if (!grid) return;

  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Mock available dates (some blocked)
  const blockedDates = new Set();
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    // Randomly block ~20% of dates
    if (Math.random() < 0.2) {
      blockedDates.add(d.toDateString());
    }
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (monthLabel) {
      monthLabel.textContent = new Date(year, month).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }

    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = day;

      const dateStr = new Date(year, month, day).toDateString();
      const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isBlocked = blockedDates.has(dateStr);
      const isSelected = selectedDate?.toDateString() === dateStr;
      const isToday = today.toDateString() === dateStr;

      if (isPast || isBlocked) {
        cell.classList.add('disabled');
      }
      if (isToday) cell.classList.add('today');
      if (isSelected) cell.classList.add('selected');
      if (!isPast && !isBlocked) cell.classList.add('has-slots');

      if (!isPast && !isBlocked) {
        cell.addEventListener('click', () => {
          selectedDate = new Date(year, month, day);
          selectedTime = null;
          renderCalendar();
          showTimeSlots();
        });
      }

      grid.appendChild(cell);
    }
  };

  const showTimeSlots = () => {
    if (!timeSlots) return;
    timeSlots.style.display = 'block';
    timeSlots.style.opacity = '0';
    gsap.to(timeSlots, { opacity: 1, y: 0, duration: 0.3 });

    const buttons = timeSlots.querySelectorAll('.time-slot-btn');
    buttons.forEach(btn => {
      btn.classList.remove('active');
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTime = btn.textContent;
        if (bookingButtons) {
          bookingButtons.style.display = 'flex';
          gsap.fromTo(bookingButtons, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    });
  };

  prevBtn?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

/* ============================================
   LIGHTBOX
   ============================================ */
export function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const triggers = document.querySelectorAll('[data-lightbox]');

  if (!triggers.length) return;

  const images = Array.from(triggers).map(t => t.getAttribute('data-lightbox'));
  let currentIndex = 0;

  const open = (index) => {
    currentIndex = index;
    if (lightboxImg) lightboxImg.src = images[index];
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${images.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const next = () => open((currentIndex + 1) % images.length);
  const prev = () => open((currentIndex - 1 + images.length) % images.length);

  triggers.forEach((trigger, i) => {
    trigger.addEventListener('click', () => open(i));
  });

  lightbox.querySelector('.lightbox-close')?.addEventListener('click', close);
  lightbox.querySelector('.lightbox-next')?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  lightbox.querySelector('.lightbox-prev')?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}

/* ============================================
   NEWSLETTER
   ============================================ */
export function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const success = form.querySelector('.newsletter-success');

      if (input?.value) {
        gsap.to(form, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          onComplete: () => {
            form.style.display = 'none';
            if (success) {
              success.style.display = 'block';
              gsap.fromTo(success, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }
          },
        });
      }
    });
  });
}

/* ============================================
   PRODUCT FILTER
   ============================================ */
export function initProductFilter() {
  const filterContainers = document.querySelectorAll('.product-filter-container');

  filterContainers.forEach(container => {
    const filters = container.querySelectorAll('.filter-pill');
    const items = container.querySelectorAll('.filterable-item');

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.dataset.filter;

        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        items.forEach(item => {
          const itemCategory = item.dataset.category;
          if (category === 'all' || itemCategory === category) {
            gsap.to(item, { opacity: 1, duration: 0.3, display: '' });
          } else {
            gsap.to(item, { opacity: 0, duration: 0.3, onComplete: () => { item.style.display = 'none'; } });
          }
        });
      });
    });
  });
}

/* ============================================
   MASONRY FILTER
   ============================================ */
export function initMasonryFilter() {
  const container = document.querySelector('.masonry-filter-container');
  if (!container) return;

  const filters = container.querySelectorAll('.filter-pill');
  const items = container.querySelectorAll('.masonry-filterable');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'block';
          gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3 });
        } else {
          gsap.to(item, { opacity: 0, scale: 0.95, duration: 0.3, onComplete: () => { item.style.display = 'none'; } });
        }
      });
    });
  });
}

/* ============================================
   BODY DIAGRAM
   ============================================ */
export function initBodyDiagram() {
  const diagram = document.querySelector('.body-diagram');
  if (!diagram) return;

  const points = diagram.querySelectorAll('.diagram-point');
  const sidebar = document.querySelector('.measurement-sidebar');
  const checkboxes = document.querySelectorAll('.measurement-check input');
  const completionMsg = document.querySelector('.measurement-completion');

  const measurementData = {
    bust: { name: 'Bust Measurement', text: 'Wrap the measuring tape around the fullest part of your bust, keeping the tape parallel to the floor. The tape should be snug but not tight. Breathe normally and ensure the tape doesn\'t slip down your back. Record this measurement in inches.' },
    waist: { name: 'Waist Measurement', text: 'Measure around your natural waistline — the narrowest part of your torso, typically just above your belly button. Keep the tape snug and parallel to the floor. Don\'t suck in your stomach; measure in a relaxed state.' },
    hips: { name: 'Hip Measurement', text: 'Stand with your feet together and measure around the fullest part of your hips and buttocks. This is usually 7-9 inches below your waistline. Keep the tape parallel to the floor and snug.' },
    shoulder: { name: 'Shoulder Width', text: 'Measure from the edge of one shoulder bone (where your arm meets your shoulder) across your upper back to the edge of the other shoulder bone. The tape should follow the natural curve of your upper back.' },
    arm: { name: 'Arm Length', text: 'Bend your arm slightly. Measure from the edge of your shoulder bone down to your wrist bone, following the outside of your arm. Keep your arm relaxed at your side for the most accurate measurement.' },
    height: { name: 'Height', text: 'Stand straight against a wall without shoes. Make a small mark at the top of your head. Measure from the floor to this mark. Alternatively, have someone measure you with a tape measure from the top of your head to the floor.' },
  };

  points.forEach(point => {
    point.addEventListener('click', () => {
      points.forEach(p => p.classList.remove('active'));
      point.classList.add('active');

      const key = point.dataset.measurement;
      const data = measurementData[key];

      if (sidebar && data) {
        gsap.to(sidebar, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            sidebar.querySelector('.ms-title').textContent = data.name;
            sidebar.querySelector('.ms-text').textContent = data.text;
            gsap.to(sidebar, { opacity: 1, duration: 0.2, delay: 0.1 });
          },
        });
      }
    });
  });

  // Checklist
  const checkCompletion = () => {
    const checked = Array.from(checkboxes).filter(cb => cb.checked);
    if (checked.length >= 6 && completionMsg) {
      completionMsg.style.display = 'block';
      gsap.fromTo(completionMsg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', checkCompletion);
  });
}

/* ============================================
   WHATSAPP BUTTON
   ============================================ */
export function initWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const message = encodeURIComponent("Hi! I'm interested in your fashion collection. Can you help me?");
    window.open(`https://wa.me/2348034567890?text=${message}`, '_blank');
  });
}

/* ============================================
   INITIALIZE ALL
   ============================================ */
export function initApp() {
  initLenis();
  initPageLoader();
  initNavigation();
  initScrollReveal();
  initCustomCursor();
  initHeroSlider();
  initDragScroll();
  initTiltCards();
  initTestimonialCarousel();
  initTimeline();
  initFAQ();
  initCalendar();
  initLightbox();
  initNewsletter();
  initProductFilter();
  initMasonryFilter();
  initBodyDiagram();
  initWhatsApp();
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

/* ============================================
   STRANDS THEORY — GSAP Animations & Canvas
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  const preloaderTl = gsap.timeline();

  window.addEventListener('load', () => {
    preloaderTl
      .to(preloader, {
        opacity: 0,
        duration: 0.6,
        delay: 1.8,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.style.visibility = 'hidden';
          preloader.style.pointerEvents = 'none';
          // Recalculate scroll positions after preloader is gone
          ScrollTrigger.refresh();
          // Trigger hero entrance after preloader
          heroEntrance();
        }
      });
  });

  // Fallback
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      ScrollTrigger.refresh();
      heroEntrance();
    }
  }, 3000);

  // ── Hero Entrance Animation ──
  let heroPlayed = false;

  // Immediately hide hero elements so GSAP can animate them in
  gsap.set('.hero-subtitle, .hero-line, .hero-desc, .hero-actions .btn, .hero-scroll', {
    opacity: 0,
    y: 30,
  });

  function heroEntrance() {
    if (heroPlayed) return;
    heroPlayed = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-subtitle', {
      y: 0,
      opacity: 1,
      duration: 1,
    })
      .to('.hero-line', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
      }, '-=0.6')
      .to('.hero-desc', {
        y: 0,
        opacity: 1,
        duration: 0.8,
      }, '-=0.6')
      .to('.hero-actions .btn', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
      }, '-=0.4')
      .to('.hero-scroll', {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.2');
  }

  // ── Navigation Scroll Effect ──
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      if (self.scroll() > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });

  // ── Mobile Navigation Toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── GSAP Scroll Reveal Animations ──
  // Using explicit gsap.set() + gsap.to() pattern to avoid immediateRender issues

  // Section tags — slide in from left (skip sections with custom animations)
  gsap.utils.toArray('.section-tag').forEach(tag => {
    if (tag.closest('.story, .treatment, .experience')) return;
    gsap.set(tag, { x: -40, opacity: 0 });
    gsap.to(tag, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: tag,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Section titles — reveal up (skip sections with custom animations)
  gsap.utils.toArray('.section-title').forEach(title => {
    if (title.closest('.story, .treatment, .experience')) return;
    gsap.set(title, { y: 60, opacity: 0 });
    gsap.to(title, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Section subtitles
  gsap.utils.toArray('.section-subtitle').forEach(sub => {
    gsap.set(sub, { y: 30, opacity: 0 });
    gsap.to(sub, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sub,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Story section — proper timeline: tag, title, text, stats + image
  const storyImage = document.querySelector('.story-visual');
  const storyContent = document.querySelector('.story-content');
  if (storyImage && storyContent) {
    gsap.set(storyImage, { x: -80, opacity: 0 });
    gsap.to(storyImage, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.story-grid',
        start: 'top 75%',
      }
    });

    const storyTag = storyContent.querySelector('.section-tag');
    const storyTitle = storyContent.querySelector('.section-title');
    const storyTexts = storyContent.querySelectorAll('.story-text');
    const storyStats = storyContent.querySelector('.story-stats');

    // Set initial states
    if (storyTag) gsap.set(storyTag, { x: -40, opacity: 0 });
    if (storyTitle) gsap.set(storyTitle, { y: 40, opacity: 0 });
    if (storyTexts.length) gsap.set(storyTexts, { y: 30, opacity: 0 });
    if (storyStats) gsap.set(storyStats, { y: 30, opacity: 0 });

    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.story-grid',
        start: 'top 75%',
      }
    });

    if (storyTag) {
      storyTl.to(storyTag, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
    if (storyTitle) {
      storyTl.to(storyTitle, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3');
    }
    if (storyTexts.length) {
      storyTl.to(storyTexts, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      }, '-=0.3');
    }
    if (storyStats) {
      storyTl.to(storyStats, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.3');
    }
  }

  // Story image accent — subtle float
  const storyAccent = document.querySelector('.story-image-accent');
  if (storyAccent) {
    gsap.to(storyAccent, {
      y: -10,
      x: 5,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  // Philosophy cards — stagger in from bottom
  const philCards = gsap.utils.toArray('.philosophy-card');
  if (philCards.length) {
    gsap.set(philCards, { y: 80, opacity: 0 });
    gsap.to(philCards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.philosophy-grid',
        start: 'top 80%',
      }
    });
  }

  // Quote section — scale and fade
  const bigQuote = document.querySelector('.big-quote');
  if (bigQuote) {
    gsap.set(bigQuote, { scale: 0.9, opacity: 0 });
    gsap.to(bigQuote, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.quote-section',
        start: 'top 75%',
      }
    });
  }

  // Technique cards — stagger reveal
  const techCards = gsap.utils.toArray('.technique-card');
  if (techCards.length) {
    gsap.set(techCards, { y: 60, opacity: 0 });
    gsap.to(techCards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.techniques-grid',
        start: 'top 80%',
      }
    });
  }

  // Services extras
  const serviceExtras = gsap.utils.toArray('.service-extra');
  if (serviceExtras.length) {
    gsap.set(serviceExtras, { y: 40, opacity: 0 });
    gsap.to(serviceExtras, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-extras',
        start: 'top 85%',
      }
    });
  }

  // Treatment section — sequential: tag, title, then content
  const treatmentContent = document.querySelector('.treatment-content');
  const treatmentVisual = document.querySelector('.treatment-visual');
  if (treatmentContent && treatmentVisual) {
    const treatmentTag = treatmentContent.querySelector('.section-tag');
    const treatmentTitle = treatmentContent.querySelector('.section-title');
    const treatmentOther = treatmentContent.querySelectorAll('.treatment-text, .treatment-highlights, .btn');

    // Set initial states
    if (treatmentTag) gsap.set(treatmentTag, { x: -40, opacity: 0 });
    if (treatmentTitle) gsap.set(treatmentTitle, { y: 40, opacity: 0 });
    if (treatmentOther.length) gsap.set(treatmentOther, { y: 30, opacity: 0 });
    gsap.set(treatmentVisual, { x: 80, opacity: 0 });

    const treatmentTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.treatment-grid',
        start: 'top 75%',
      }
    });

    if (treatmentTag) {
      treatmentTl.to(treatmentTag, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
    if (treatmentTitle) {
      treatmentTl.to(treatmentTitle, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3');
    }
    if (treatmentOther.length) {
      treatmentTl.to(treatmentOther, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      }, '-=0.2');
    }

    gsap.to(treatmentVisual, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.treatment-grid',
        start: 'top 75%',
      }
    });
  }

  // Experience section — proper timeline: tag, title, intro, steps
  const expContent = document.querySelector('.experience-content');
  const expSteps = gsap.utils.toArray('.experience-step');
  if (expContent) {
    const expTag = expContent.querySelector('.section-tag');
    const expTitle = expContent.querySelector('.section-title');
    const expIntro = expContent.querySelector('.story-text');

    // Set initial states
    if (expTag) gsap.set(expTag, { x: -40, opacity: 0 });
    if (expTitle) gsap.set(expTitle, { y: 40, opacity: 0 });
    if (expIntro) gsap.set(expIntro, { y: 20, opacity: 0 });
    if (expSteps.length) gsap.set(expSteps, { x: -40, opacity: 0 });

    const expTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.experience-content',
        start: 'top 80%',
      }
    });

    if (expTag) {
      expTl.to(expTag, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
    if (expTitle) {
      expTl.to(expTitle, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3');
    }
    if (expIntro) {
      expTl.to(expIntro, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.3');
    }
    if (expSteps.length) {
      expTl.to(expSteps, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
      }, '-=0.3');
    }
  }

  // Testimonial cards — stagger from bottom
  const testimonialCards = gsap.utils.toArray('.testimonial-card');
  if (testimonialCards.length) {
    gsap.set(testimonialCards, { y: 60, opacity: 0 });
    gsap.to(testimonialCards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 80%',
      }
    });
  }

  // CTA section
  const ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    gsap.set(ctaContent.children, { y: 40, opacity: 0 });
    gsap.to(ctaContent.children, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
      }
    });
  }

  // Contact section
  const contactInfo = document.querySelector('.contact-info');
  const contactForm = document.querySelector('.contact-form-wrapper');
  if (contactInfo && contactForm) {
    gsap.set(contactInfo.children, { y: 50, opacity: 0 });
    gsap.set(contactForm, { y: 60, opacity: 0 });

    gsap.to(contactInfo.children, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
      }
    });

    gsap.to(contactForm, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 75%',
      }
    });
  }

  // Stat numbers — count up animation
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const text = stat.textContent;
    const match = text.match(/(\d+)/);
    if (match) {
      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%',
        },
        onUpdate: () => {
          stat.textContent = Math.round(obj.val) + suffix;
        }
      });
    }
  });

  // ── Parallax effects ──
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  // Parallax on quote section bg
  const quoteBg = document.querySelector('.quote-bg');
  if (quoteBg) {
    gsap.to(quoteBg, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.quote-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  // Marquee speed boost on scroll
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    gsap.to(marqueeTrack, {
      x: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.marquee',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      }
    });
  }

  // ── Active nav link highlighting ──
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.style.opacity = '0.5';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.opacity = '1';
          }
        });
      }
    });
  }, { passive: true });

  // ── Contact Form Handling ──
  const contactFormEl = document.getElementById('contactForm');
  if (contactFormEl) {
    contactFormEl.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactFormEl.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#2D6B45';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactFormEl.reset();
        }, 2500);
      }, 1200);
    });
  }

  // ── Technique Card Tilt Effect ──
  const techCardEls = document.querySelectorAll('.technique-card');
  techCardEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      gsap.to(card, {
        rotateY: x,
        rotateX: -y,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });

  // ══════════════════════════════════════════════
  // HERO CANVAS — Flowing Strand Particles
  // ══════════════════════════════════════════════

  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationId;
    let strands = [];
    let particles = [];
    let width, height;

    function resizeCanvas() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Strand class — flowing hair-like curves
    class Strand {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.length = 80 + Math.random() * 160;
        this.speed = 0.2 + Math.random() * 0.5;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        this.curve = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.05 + Math.random() * 0.15;
        this.thickness = 0.5 + Math.random() * 1.5;
        this.segments = 6 + Math.floor(Math.random() * 6);
        this.wave = Math.random() * Math.PI * 2;
        this.waveSpeed = 0.005 + Math.random() * 0.015;
        this.waveAmp = 10 + Math.random() * 30;
        // Gold-ish palette
        const colors = [
          `rgba(196, 168, 130,`,  // gold
          `rgba(196, 161, 147,`,  // dusty rose
          `rgba(212, 196, 168,`,  // gold-light
          `rgba(255, 253, 251,`,  // white
          `rgba(176, 142, 128,`,  // rose-dk
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speed;
        this.wave += this.waveSpeed;

        if (this.y + this.length < 0) {
          this.reset();
          this.y = height + this.length;
        }
      }

      draw() {
        ctx.beginPath();
        const segLen = this.length / this.segments;

        let startX = this.x + Math.sin(this.wave) * this.waveAmp;
        let startY = this.y;

        ctx.moveTo(startX, startY);

        for (let i = 1; i <= this.segments; i++) {
          const t = i / this.segments;
          const px = this.x + Math.sin(this.wave + t * 3) * this.waveAmp * (1 - t * 0.3);
          const py = this.y - segLen * i;
          const cpx = px + Math.sin(this.wave + t * 2) * this.waveAmp * 0.5;
          const cpy = py + segLen * 0.5;

          ctx.quadraticCurveTo(cpx, cpy, px, py);
        }

        ctx.strokeStyle = this.color + (this.opacity * (1 - Math.abs(this.y / height - 0.5) * 0.5)) + ')';
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Floating particle class — tiny shimmering dots
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 0.5 + Math.random() * 2;
        this.speedY = -0.1 - Math.random() * 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0;
        this.maxOpacity = 0.1 + Math.random() * 0.3;
        this.fadeIn = true;
        this.life = 200 + Math.random() * 400;
        this.age = 0;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.age++;

        if (this.fadeIn && this.opacity < this.maxOpacity) {
          this.opacity += 0.005;
        }

        if (this.age > this.life * 0.7) {
          this.opacity -= 0.003;
        }

        if (this.age > this.life || this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 196, 168, ${Math.max(0, this.opacity)})`;
        ctx.fill();
      }
    }

    // Initialize
    const strandCount = Math.min(25, Math.floor(width / 50));
    const particleCount = Math.min(40, Math.floor(width / 30));

    for (let i = 0; i < strandCount; i++) {
      strands.push(new Strand());
    }
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw strands
      strands.forEach(strand => {
        strand.update();
        strand.draw();
      });

      // Draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Pause canvas animation when hero is not visible for performance
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => cancelAnimationFrame(animationId),
      onEnterBack: () => animate(),
    });
  }

});

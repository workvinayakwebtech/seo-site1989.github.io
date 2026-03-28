// main.js - Core Logic, Fetch Data, Hydrate DOM, GSAP Animations

document.addEventListener("DOMContentLoaded", async () => {
  let siteData = {};
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not fetch data.json");
    siteData = await response.json();
  } catch (error) {
    console.error("Error loading site data:", error);
    return;
  }

  const path = window.location.pathname;
  const page = path.includes("about") ? "about"
    : path.includes("services") ? "services"
      : path.includes("contact") ? "contact"
        : "home";

  hydrateCommonElements(siteData);

  if (page === "home") hydrateHomePage(siteData);
  if (page === "about") hydrateAboutPage(siteData);
  if (page === "services") hydrateServicesPage(siteData);
  if (page === "contact") hydrateContactPage(siteData);

  initFloatingWhatsApp(siteData);
  initMobileMenu();
  lucide.createIcons(); // Initialize Lucide Icons
  initAOS(page);
});

/* =========================================
   Hydration Functions - Common
   ========================================= */
function hydrateCommonElements(data) {
  // Meta Tags
  document.title = `${data.agency.name} | ${data.agency.tagline}`;
  document.querySelector('[data-id="meta-desc"]')?.setAttribute('content', data.agency.description);

  // Global Text Replacements
  document.querySelectorAll('[data-id="agency-name"]').forEach(el => el.textContent = data.agency.name);

  // Footer Elements
  const ftName = document.querySelector('[data-id="footer-agency-name"]');
  if (ftName) ftName.textContent = data.agency.name;

  const ftTagline = document.querySelector('[data-id="footer-tagline"]');
  if (ftTagline) ftTagline.textContent = data.footer.tagline;

  const ftEmail = document.getElementById("footer-email");
  if (ftEmail) {
    ftEmail.href = `mailto:${data.agency.email}`;
    ftEmail.textContent = data.agency.email;
  }

  const ftPhone = document.getElementById("footer-phone");
  if (ftPhone) {
    ftPhone.href = `tel:${data.agency.phone}`;
    ftPhone.textContent = data.agency.phone;
  }

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  const ftCopyName = document.querySelector('[data-id="footer-copyright-name"]');
  if (ftCopyName) ftCopyName.textContent = data.agency.name;

  // Nav Links loop
  const navContainer = document.getElementById("nav-links-container");
  if (navContainer) {
    data.nav.forEach(link => {
      const a = document.createElement("a");
      a.href = link.url;
      a.textContent = link.name;
      if (window.location.pathname.includes(link.url) || (window.location.pathname.endsWith('/') && link.url === 'index.html')) {
        a.classList.add("active");
      }
      navContainer.appendChild(a);
    });
  }

  // Footer Social loop
  const socialContainer = document.getElementById("footer-social-links");
  if (socialContainer) {
    data.footer.social.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${s.url}" target="_blank">${s.name}</a>`;
      socialContainer.appendChild(li);
    });
  }

  // Footer Links loop
  const policyContainer = document.getElementById("footer-policy-links");
  if (policyContainer) {
    data.footer.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.url;
      a.textContent = l.name;
      policyContainer.appendChild(a);
      // add small separator gap if needed handled by css flex gap
    });
  }
}

function initFloatingWhatsApp(data) {
  const wa = document.createElement("a");
  wa.href = createWhatsAppLink(data.agency.whatsapp, data.contact.whatsapp_message);
  wa.className = "whatsapp-float flex items-center justify-center";
  wa.target = "_blank";
  wa.setAttribute("aria-label", "Chat on WhatsApp");
  // Using lucide icon inject mechanism manually for created elements sometimes needs parsing
  wa.innerHTML = `<i data-lucide="message-circle" style="width: 28px; height: 28px;"></i>`;
  document.body.appendChild(wa);
}

/* =========================================
   Hydration Functions - Pages
   ========================================= */
function hydrateHomePage(data) {
  const d = data.home;

  // Hero
  const heroHead = document.querySelector('[data-id="hero-headline"]');
  if (heroHead) heroHead.textContent = d.hero.headline;

  const heroSub = document.querySelector('[data-id="hero-subheadline"]');
  if (heroSub) heroSub.textContent = d.hero.subheadline;

  const heroCta = document.querySelector('[data-id="hero-cta"]');
  if (heroCta) {
    heroCta.textContent = d.hero.cta;
    heroCta.href = createWhatsAppLink(data.agency.whatsapp, `Hello! I'm interested in starting my ascent with ${data.agency.name}.`);
  }

  // Stats
  const statsContainer = document.getElementById('stats-container');
  if (statsContainer) {
    d.stats.forEach(s => {
      statsContainer.innerHTML += `
        <div class="stat-item">
          <div class="stat-number" data-target="${s.number}">0</div>
          <div class="stat-label">${s.label} ${s.suffix}</div>
        </div>
      `;
    });
  }

  // Why Us
  const whyUsContainer = document.getElementById('why-us-container');
  if (whyUsContainer) {
    let whyHTML = '';
    d.why_us.forEach((w, index) => {
      whyHTML += `
        <div class="card bg-white text-dark" data-aos="fade-up" data-aos-delay="${index * 100}">
          <h3 class="mb-sm">${w.title}</h3>
          <p class="text-muted-dark m-0">${w.description}</p>
        </div>
      `;
    });
    whyUsContainer.innerHTML = whyHTML;
  }

  // Testimonials
  const testimonialsContainer = document.getElementById('testimonials-container');
  if (testimonialsContainer) {
    let testHTML = '';
    d.testimonials.forEach((t, index) => {
      testHTML += `
        <div class="card testimonial-card bg-white text-dark" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="flex items-center justify-center mb-sm">
             <i data-lucide="quote" class="text-primary" style="width: 32px; height: 32px;"></i>
          </div>
          <p class="testimonial-quote text-dark">"${t.quote}"</p>
          <div class="testimonial-author font-bold">- ${t.author}, <span class="text-sm font-normal">${t.company}</span></div>
        </div>
      `;
    });
    testimonialsContainer.innerHTML = testHTML;
  }
}

function hydrateAboutPage(data) {
  const d = data.about;

  const story = document.getElementById("about-story");
  if (story) story.textContent = d.story;

  const mission = document.getElementById("about-mission");
  if (mission) mission.textContent = d.mission;

  const vision = document.getElementById("about-vision");
  if (vision) vision.textContent = d.vision;

  const teamContainer = document.getElementById("team-container");
  if (teamContainer) {
    let teamHTML = '';
    d.team.forEach((member, index) => {
      teamHTML += `
        <div class="card p-0" style="padding:0; overflow:hidden;" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="team-img flex items-center justify-center bg-muted" style="min-height: 200px; background: #e2e8f0;">
             <i data-lucide="user" style="width: 64px; height: 64px; opacity: 0.5;"></i>
          </div>
          <div class="team-info p-md bg-white">
            <h3 class="font-bold">${member.name}</h3>
            <div class="team-role text-primary text-sm mb-sm">${member.role}</div>
            <p class="text-sm text-muted m-0">${member.bio}</p>
          </div>
        </div>
      `;
    });
    teamContainer.innerHTML = teamHTML;
  }
}

function hydrateServicesPage(data) {
  const servicesContainer = document.getElementById("services-container");
  if (!servicesContainer) return;

  data.services.forEach((s, index) => {
    const waLink = createWhatsAppLink(data.agency.whatsapp, `Hello! I'm interested in your ${s.title} service.`);
    servicesContainer.innerHTML += `
      <div class="card service-card flex flex-col bg-white text-dark" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="service-icon mb-md text-primary bg-primary-light inline-flex p-md rounded-full shadow-sm" style="align-self: flex-start;">
           <i data-lucide="${s.icon}" style="width: 32px; height: 32px;"></i>
        </div>
        <h2 class="mb-sm text-dark">${s.title}</h2>
        <p class="mb-sm font-medium text-dark-muted">${s.short_desc}</p>
        <p class="text-sm text-muted-dark mb-md">${s.full_desc}</p>
        <ul class="mb-lg flex-grow">
          ${s.features.map(f => `<li class="flex items-center text-sm mb-xs"><i data-lucide="check" class="text-primary mr-sm" style="width: 16px;"></i> ${f}</li>`).join('')}
        </ul>
        <div class="mt-auto">
          <a href="${waLink}" target="_blank" class="btn btn-outline flex justify-center items-center w-full">Ask Details <i data-lucide="arrow-right" class="ml-sm" style="width: 16px;"></i></a>
        </div>
      </div>
    `;
  });
}

function hydrateContactPage(data) {
  const c = data.contact;

  const formHeading = document.getElementById("contact-form-heading");
  if (formHeading) formHeading.textContent = c.form_heading;

  const email = document.getElementById("contact-email");
  if (email) {
    email.href = `mailto:${data.agency.email}`;
    email.textContent = data.agency.email;
  }

  const phone = document.getElementById("contact-phone");
  if (phone) {
    phone.href = `tel:${data.agency.phone}`;
    phone.textContent = data.agency.phone;
  }

  const addr = document.getElementById("contact-address");
  if (addr) addr.textContent = data.agency.address;

  const map = document.getElementById("contact-map");
  if (map) map.src = c.map_embed;

  const faqContainer = document.getElementById("faq-container");
  if (faqContainer) {
    data.faq.forEach(f => {
      faqContainer.innerHTML += `
        <div class="faq-item bg-white p-md rounded shadow-sm mb-md text-dark cursor-pointer transition">
          <div class="faq-question flex justify-between items-center">
            <h3 class="font-bold text-md m-0">${f.question}</h3>
            <i data-lucide="chevron-down" class="faq-icon text-primary transition"></i>
          </div>
          <div class="faq-answer overflow-hidden transition" style="max-height: 0;">
            <p class="text-muted-dark text-sm mt-md m-0">${f.answer}</p>
          </div>
        </div>
      `;
    });

    // Attach FAQ Logic
    setTimeout(() => { // wait for dom inject
      const questions = document.querySelectorAll(".faq-question");
      questions.forEach(q => {
        q.addEventListener("click", () => {
          const item = q.parentElement;
          const answer = q.nextElementSibling;
          const icon = q.querySelector('.faq-icon');

          const isOpening = !item.classList.contains('active');

          // Close all others
          document.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
            other.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            other.querySelector('.faq-answer').style.maxHeight = '0px';
          });

          if (isOpening) {
            item.classList.add("active");
            icon.style.transform = "rotate(180deg)";
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
        });
      });
    }, 100);
  }

  // Attach Form logic
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const n = document.getElementById("name").value;
      const s = document.getElementById("subject").value;
      const m = document.getElementById("message").value;

      const text = `Hello ${data.agency.name}! My name is ${n}. Subject: ${s}. Message: ${m}`;
      const waLink = createWhatsAppLink(data.agency.whatsapp, text);
      window.open(waLink, '_blank');
    });
  }
}

/* =========================================
   Utilities
   ========================================= */
function createWhatsAppLink(phone, text) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      hamburger.classList.toggle("toggle");
    });
  }
}

/* =========================================
   AOS Animations & Counters
   ========================================= */
function initAOS(page) {
  if (typeof AOS === 'undefined') return;

  // Slight delay to allow DOM hydration
  setTimeout(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });

    // Vanilla JS Counter for Home Page since GSAP is removed
    if (page === "home") {
      const stats = document.querySelectorAll(".stat-number");

      const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          if (elapsedTime < duration) {
            const easeProgress = 1 - Math.pow(1 - (elapsedTime / duration), 3); // cubic ease out
            el.innerHTML = Math.round(target * easeProgress);
            requestAnimationFrame(updateCounter);
          } else {
            el.innerHTML = target;
          }
        };
        requestAnimationFrame(updateCounter);
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      stats.forEach(stat => observer.observe(stat));
    }
  }, 100);
}

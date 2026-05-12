// VidaClara — main.js

// ── NAV SCROLL ────────────────────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── SCROLL ANIMATIONS ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Apply fade-up to major blocks dynamically
const animTargets = document.querySelectorAll(
  '.service-card, .step, .testimonial, .result-card, .kiosk-text > *, .hero__trust'
);
animTargets.forEach((el, i) => {
  if (!el.classList.contains('fade-up')) {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  }
});

// ── CALENDAR (agendar.html) ───────────────────────
function initCalendar() {
  const grid = document.getElementById('calGrid');
  const monthLabel = document.getElementById('calMonth');
  if (!grid) return;

  let currentDate = new Date(2026, 4, 1); // May 2026
  let selectedDay = null;

  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  function render() {
    grid.innerHTML = '';
    monthLabel.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    const days = ['L','M','X','J','V','S','D'];
    days.forEach(d => {
      const h = document.createElement('div');
      h.className = 'cal-day-header';
      h.textContent = d;
      grid.appendChild(h);
    });
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;
    for (let i = 0; i < startOffset; i++) {
      grid.appendChild(document.createElement('div'));
    }
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate();
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      el.textContent = d;
      const thisDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        el.classList.add('cal-day--disabled');
      } else {
        if (d === 14 && currentDate.getMonth() === 4) { el.classList.add('cal-day--today'); }
        if (selectedDay === d) { el.classList.add('cal-day--selected'); }
        el.addEventListener('click', () => {
          selectedDay = d;
          updateSummaryDate(d, currentDate);
          render();
        });
      }
      grid.appendChild(el);
    }
  }

  document.getElementById('calPrev')?.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1);
    render();
  });
  document.getElementById('calNext')?.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
    render();
  });

  render();
}

// ── TIME SLOTS ────────────────────────────────────
function initTimeSlots() {
  document.querySelectorAll('.time-slot:not(.time-slot--unavailable)').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('time-slot--selected'));
      slot.classList.add('time-slot--selected');
      updateSummaryTime(slot.textContent.trim());
    });
  });
}

function updateSummaryDate(day, date) {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const d = new Date(date.getFullYear(), date.getMonth(), day);
  const el = document.getElementById('summaryDate');
  if (el) el.textContent = `${days[d.getDay()]} ${day} de ${months[date.getMonth()]}`;
}

function updateSummaryTime(time) {
  const el = document.getElementById('summaryTime');
  if (el) el.textContent = time;
}

// ── FILTER CHIPS (buscar.html) ────────────────────
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
    });
  });
}

// ── SEARCH INPUT ──────────────────────────────────
function initSearch() {
  const input = document.querySelector('.search-box input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val) {
        document.querySelectorAll('.result-card').forEach(card => {
          const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
          const sub = card.querySelector('p')?.textContent?.toLowerCase() || '';
          card.style.display = (title.includes(val.toLowerCase()) || sub.includes(val.toLowerCase())) ? '' : 'none';
        });
      }
    }
  });
}

// ── BOOKING FORM SUBMIT ───────────────────────────
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = '✓ Cita confirmada';
    btn.style.background = 'var(--c-success)';
    btn.disabled = true;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  });
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initTimeSlots();
  initFilters();
  initSearch();
  initBookingForm();
});

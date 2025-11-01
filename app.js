  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-list");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navList.classList.toggle("active");
  });

  // Close menu when any link is clicked
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navList.classList.remove("active");
    });
  });



// ----- Typed Text -----
const roles = ["AR/VR Enthusiast...","Unity Developer...","UI/UX Designer...","FullStack Developer..."];
const typedTextSpan = document.querySelector(".typed-text");
let roleIndex=0,charIndex=0,isDeleting=false;

function typeWriter(){
  const currentRole=roles[roleIndex];
  typedTextSpan.textContent=currentRole.substring(0,charIndex);
  charIndex+=isDeleting?-1:1;
  let speed=isDeleting?50:150;
  if(!isDeleting && charIndex===currentRole.length){speed=1000; isDeleting=true;}
  if(isDeleting && charIndex<0){isDeleting=false; roleIndex=(roleIndex+1)%roles.length; charIndex=0; speed=200;}
  setTimeout(typeWriter,speed);
}
document.addEventListener("DOMContentLoaded",()=>setTimeout(typeWriter,500));

// ----- Particle Network + Mouse Trails -----
const canvas=document.getElementById('particles-bg');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;

const particles=[]; const numParticles=window.innerWidth<768?60:120;
const mouse={x:null,y:null};

window.addEventListener('mousemove',e=>{mouse.x=e.x; mouse.y=e.y;});
window.addEventListener('mouseout',()=>{mouse.x=null; mouse.y=null;});

for(let i=0;i<numParticles;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    vx:(Math.random()-0.5)*0.5,
    vy:(Math.random()-0.5)*0.5,
    size:Math.random()*2+1,
    trail: []
  });
}

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let p of particles){
    p.x+=p.vx; p.y+=p.vy;

    if(p.x>canvas.width)p.x=0; if(p.x<0)p.x=canvas.width;
    if(p.y>canvas.height)p.y=0; if(p.y<0)p.y=canvas.height;

    // Mouse repel
    // if(mouse.x && mouse.y){
    //   const dx=p.x-mouse.x, dy=p.y-mouse.y;
    //   const dist=Math.hypot(dx,dy);
    //   if(dist<100){ const angle=Math.atan2(dy,dx); const force=(100-dist)/100*2;
    //     p.vx+=Math.cos(angle)*force; p.vy+=Math.sin(angle)*force;
    //   }
    // }

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle='rgba(255,204,0,0.8)';
    ctx.fill();
  }

  // Connect lines
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const p1=particles[i], p2=particles[j];
      const dist=Math.hypot(p1.x-p2.x,p1.y-p2.y);
      if(dist<120){
        ctx.strokeStyle=`rgba(255,204,0,${1-dist/120})`;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});

// ----- Scroll Parallax -----
const intro=document.querySelector('.intro');
const profile=document.querySelector('.profile-image');
window.addEventListener('scroll',()=>{
  const scrollY=window.scrollY;
  intro.style.transform=`translateY(${scrollY*0.2}px)`;
  profile.style.transform=`translateY(${scrollY*0.1}px)`;
});

// ----- Intersection Observer for fade-slide -----
const faders=document.querySelectorAll('.fade-slide');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('show');}
  });
},{threshold:0.5});
faders.forEach(fader=>observer.observe(fader));

const timelineItems = document.querySelectorAll('.timeline-item');

function revealTimeline() {
  const triggerBottom = window.innerHeight * 0.85;

  timelineItems.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < triggerBottom) {
      item.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealTimeline);
window.addEventListener('load', revealTimeline);

  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const cards = document.querySelectorAll('.certificate-card');

  let index = 0;
  const visibleCards = window.innerWidth <= 768 ? 1 : 3;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (index < cards.length - visibleCards) index++;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) index--;
    updateCarousel();
  });

  // Swipe for mobile
  let startX = 0;
  track.addEventListener('touchstart', e => (startX = e.touches[0].clientX));
  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50 && index < cards.length - visibleCards) {
      index++;
    } else if (endX - startX > 50 && index > 0) {
      index--;
    }
    updateCarousel();
  });

  // Adjust on window resize
  window.addEventListener('resize', () => {
    index = 0;
    updateCarousel();
  });

  function toggleCertificate(button) {
    const certContainer = button.nextElementSibling;
    certContainer.classList.toggle('show-cert');
    button.textContent = certContainer.classList.contains('show-cert')
      ? "Hide"
      : "View";
  }


document.addEventListener('DOMContentLoaded', () => {
  // ---------- Tilt effect (safe) ----------
  const cards = Array.from(document.querySelectorAll('.project-card') || []);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  cards.forEach(card => {
    if (!card) return;

    // Keep transform updates in RAF for performance
    let rafId = null;
    let lastTransform = '';

    const onMove = (e) => {
      // protect against missing bounding rect
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;  // slightly subtler
      const rotateY = ((x - centerX) / centerX) * -8;

      const transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

      if (transform === lastTransform) return;
      lastTransform = transform;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = transform;
      });
    };

    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        lastTransform = '';
      });
    };

    // Only attach tilt on non-touch devices to avoid interfering with touch interactions
    if (!isTouch) {
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    } else {
      // ensure transform reset on touch devices
      card.style.transform = 'none';
    }
  });


  // ---------- Filtering (safe) ----------
  // Expose the function globally so inline onclick("filterProjects(...)") works
  window.filterProjects = function(category, event) {
    // event might be undefined if called programmatically — handle both
    const clickEvent = event || window.event || {};
    const clickedEl = clickEvent.target || null;

    const allCards = Array.from(document.querySelectorAll('.project-card') || []);
    const buttons = Array.from(document.querySelectorAll('.filter-btn') || []);
    const grid = document.querySelector('.projects-grid');

    // Update active button safely
    buttons.forEach(btn => btn.classList.remove('active'));
    if (clickedEl && clickedEl.classList) clickedEl.classList.add('active');

    // Show / hide with fade and then set display to allow grid reflow
    allCards.forEach(card => {
      // if card matches or "all"
      const matches = category === 'all' || card.classList.contains(category);

      if (matches) {
        // ensure it's visible in layout
        card.style.display = 'flex';
        // start from transparent to animate in
        card.style.opacity = '0';
        card.style.transition = 'opacity 320ms ease';
        // small timeout to let display take effect then fade in
        requestAnimationFrame(() => {
          card.style.opacity = '1';
        });
      } else {
        // fade out then remove from layout
        card.style.opacity = '0';
        card.style.transition = 'opacity 320ms ease';
        // after transition hide it so grid reflows
        setTimeout(() => {
          // double-check we're still supposed to hide (user might have clicked another filter)
          if (!(category === 'all' || card.classList.contains(category))) {
            card.style.display = 'none';
          }
        }, 340);
      }
    });

    // Force a tiny grid reflow so mobile grid recalculates columns properly
    if (grid) {
      grid.style.willChange = 'auto';
      // toggle display quickly to force re-layout without visible flicker
      grid.style.display = 'none';
      // use a micro-delay then restore; this forces reflow on many mobile browsers
      setTimeout(() => {
        grid.style.display = '';
      }, 10);
    }
  };

  // Optional: ensure "All" button active state on load
  const initialAll = document.querySelector('.filter-btn.active') || document.querySelector('.filter-btn');
  if (initialAll) initialAll.classList.add('active');
});

 document.getElementById("scrollTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


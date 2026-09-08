import { useEffect, useRef, useState, useCallback } from 'react';
import { projects, categories, getProjectsByCategory } from './data';
import type { Project, Category } from './data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// ===== SCROLL MANAGER =====
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);
}

// ===== LOADER =====
function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onComplete: () => {
                onComplete();
              }
            });
          } else {
            onComplete();
          }
        }, 500);
      }
      setProgress(Math.min(Math.round(current), 100));
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loader">
      <div className="loader-title">STEALTH®</div>
      <div className="loader-text">PREPARING THE WORK</div>
      <div className="loader-count">{String(progress).padStart(2, '0')} — 100</div>
      <div style={{ width: '120px', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'rgba(255,255,255,0.6)', transition: 'width 0.1s' }} />
      </div>
    </div>
  );
}

// ===== CUSTOM CURSOR =====
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let label = '';
    let isHovering = false;
    
    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const target = e.target as HTMLElement;
      const enterEl = target.closest('[data-cursor="enter"]');
      const viewEl = target.closest('[data-cursor="view"]');
      const openEl = target.closest('[data-cursor="open"]');
      
      if (enterEl) { label = 'ENTER'; isHovering = true; }
      else if (viewEl) { label = 'VIEW'; isHovering = true; }
      else if (openEl) { label = 'OPEN'; isHovering = true; }
      else { label = ''; isHovering = false; }
      
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? '1' : '0';
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(${isHovering ? 3 : 1})`;
        cursorRef.current.style.opacity = isHovering ? '0.5' : '1';
      }
    };
    
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX}px`;
        cursorRef.current.style.top = `${cursorY}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${mouseX + 16}px`;
        labelRef.current.style.top = `${mouseY}px`;
      }
      requestAnimationFrame(animate);
    };
    animate();
    
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={labelRef} className="cursor-label" />
    </>
  );
}

// ===== NAVIGATION =====
function Navigation({ onMenuOpen, currentCategory }: { onMenuOpen: () => void; currentCategory: string }) {
  const cat = categories.find(c => c.id === currentCategory);
  const navRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: 'power2.out' });
    }
  }, []);

  return (
    <>
      <nav ref={navRef} className="nav-fixed" style={{ opacity: 0 }}>
        <div className="nav-logo" data-cursor="open">STEALTH®</div>
        <div className="nav-links">
          <a data-cursor="open" onClick={() => scrollToSection('work')}>WORK</a>
          <a data-cursor="open" onClick={() => scrollToSection('about')}>ABOUT</a>
          <a data-cursor="open" onClick={() => scrollToSection('contact')}>CONTACT</a>
          <button onClick={onMenuOpen} data-cursor="open" style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer' }}>
            MENU
          </button>
        </div>
      </nav>
      <div className="nav-indicator" style={{ transition: 'opacity 0.5s' }}>
        {cat ? `${cat.number} / ${cat.title}` : ''}
      </div>
      <div className="scroll-progress" id="scroll-progress" />
    </>
  );
}

// ===== FULLSCREEN MENU =====
function MenuOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (menuRef.current) {
      const items = menuRef.current.querySelectorAll('.menu-item');
      if (isOpen) {
        gsap.fromTo(items, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power2.out', delay: 0.2 });
      }
    }
  }, [isOpen]);

  return (
    <div className={`menu-overlay ${isOpen ? 'open' : ''}`} ref={menuRef}>
      <div className="menu-header">STEALTH® — NAVIGATION</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <span className="menu-header" style={{ marginTop: '1.5rem' }}>WORK</span>
        {categories.map(cat => (
          <a key={cat.id} className="menu-item menu-item-sub" data-cursor="open"
            onClick={() => { onClose(); scrollToSection(`cat-${cat.id}`); }}>
            {cat.number} / {cat.title}
          </a>
        ))}
        <a className="menu-item" data-cursor="open" style={{ marginTop: '1.5rem' }}
          onClick={() => { onClose(); scrollToSection('allwork'); }}>
          ALL WORK
        </a>
        <a className="menu-item" data-cursor="open"
          onClick={() => { onClose(); scrollToSection('about'); }}>
          ABOUT
        </a>
        <a className="menu-item" data-cursor="open"
          onClick={() => { onClose(); scrollToSection('contact'); }}>
          CONTACT
        </a>
      </div>
    </div>
  );
}

// ===== HERO =====
function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!heroRef.current || !titleRef.current) return;
    
    const tl = gsap.timeline({ delay: 1.2 });
    
    tl.fromTo(titleRef.current.querySelectorAll('h1'), 
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: 'power3.out' }
    );
    
    if (metaRef.current) {
      tl.fromTo(metaRef.current.children, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 0.5, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );
    }
    
    if (scrollHintRef.current) {
      tl.fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 0.4, duration: 0.6 }, '-=0.3');
    }
    
    // Scroll-based hero animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
    
    if (titleRef.current) {
      scrollTl.to(titleRef.current, { y: -100, opacity: 0, scale: 0.95, duration: 1 });
    }
    if (metaRef.current) {
      scrollTl.to(metaRef.current, { y: -50, opacity: 0, duration: 1 }, '<');
    }
    if (scrollHintRef.current) {
      scrollTl.to(scrollHintRef.current, { opacity: 0, duration: 0.5 }, '<');
    }
    if (lineRef.current) {
      scrollTl.to(lineRef.current, { width: '100%', duration: 1 }, '<');
    }
  }, []);

  return (
    <section className="hero" ref={heroRef} id="hero">
      <div ref={titleRef} style={{ position: 'absolute', top: '50%', left: '4rem', transform: 'translateY(-50%)', maxWidth: '80vw' }}>
        <h1 className="heading-xl" style={{ marginBottom: '0.5rem', opacity: 0 }}>DIGITAL EXPERIENCES</h1>
        <h1 className="heading-xl" style={{ opacity: 0 }}>BUILT TO BE ENTERED.</h1>
      </div>
      <div ref={metaRef} className="hero-meta">
        <span className="text-meta">12 PROJECTS</span>
        <span className="text-meta">05 CATEGORIES</span>
        <span className="text-meta">01 STUDIO</span>
      </div>
      <div ref={scrollHintRef} className="hero-scroll" style={{ opacity: 0 }}>SCROLL TO EXPLORE</div>
      <div ref={lineRef} className="hero-line" />
    </section>
  );
}

// ===== STATEMENT =====
function Statement() {
  const lines = ['WE DESIGN.', 'WE DEVELOP.', 'WE BUILD EXPERIENCES.', 'PEOPLE REMEMBER.'];
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const lineEls = sectionRef.current.querySelectorAll('.statement-line-inner');
    
    gsap.fromTo(lineEls, 
      { y: '100%' },
      {
        y: '0%',
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, []);

  return (
    <section className="statement-section" ref={sectionRef} id="statement">
      {lines.map((line, i) => (
        <div className="statement-line" key={i}>
          <div className="statement-line-inner">
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>{line}</h2>
          </div>
        </div>
      ))}
    </section>
  );
}

// ===== CATEGORY INDEX =====
function CategoryIndex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll('.category-list-item');
    gsap.fromTo(items,
      { x: -30, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, []);

  return (
    <section className="category-index" ref={sectionRef} id="work">
      <div className="text-meta" style={{ marginBottom: '3rem' }}>INDEX</div>
      {categories.map(cat => (
        <div key={cat.id} className="category-list-item" data-cursor="open"
          onClick={() => scrollToSection(`cat-${cat.id}`)}>
          <span className="cat-number">{cat.number}</span>
          <span className="cat-title">{cat.title}</span>
        </div>
      ))}
    </section>
  );
}

// ===== PROJECT SECTION =====
function ProjectSection({ project, index, total, category }: { 
  project: Project; index: number; total: number; category: Category 
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Intro animation
    if (introRef.current) {
      gsap.fromTo(introRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
    
    // Image clip-path reveal
    if (imageWrapperRef.current) {
      ScrollTrigger.create({
        trigger: imageWrapperRef.current,
        start: 'top 80%',
        onEnter: () => imageWrapperRef.current?.classList.add('in-view'),
        onLeaveBack: () => imageWrapperRef.current?.classList.remove('in-view'),
      });
    }
    
    // Image parallax
    if (imageRef.current) {
      const img = imageRef.current.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          }
        );
      }
    }
    
    // Details animation
    if (detailsRef.current) {
      gsap.fromTo(detailsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: detailsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }, []);

  return (
    <div className="project-section" ref={sectionRef}>
      {/* Project Intro */}
      <div className="project-intro" ref={introRef}>
        <div className="text-meta" style={{ marginBottom: '1.5rem' }}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
        <h3 className="heading-lg" style={{ color: category.palette.text, marginBottom: '1rem' }}>
          {project.title}
        </h3>
        <div className="text-small" style={{ color: category.palette.text, opacity: 0.5 }}>
          {project.type}
        </div>
      </div>
      
      {/* Project Image */}
      <div ref={imageWrapperRef} className="project-img-wrapper" style={{ height: '80vh', margin: '0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div ref={imageRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <img 
            src={project.image} 
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { 
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              setImageLoaded(true);
            }}
          />
          {!imageLoaded && (
            <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="text-meta" style={{ opacity: 0.3 }}>LOADING</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Project Details */}
      <div className="project-details" ref={detailsRef} style={{ color: category.palette.text }}>
        <div>
          <div className="text-small" style={{ opacity: 0.5, marginBottom: '0.5rem' }}>
            {project.type}
          </div>
          <div className="heading-md">{project.title}</div>
        </div>
        <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-cta" data-cursor="enter"
          style={{ color: category.palette.text, borderColor: `${category.palette.text}22` }}>
          {project.ctaText}
        </a>
      </div>
    </div>
  );
}

// ===== CATEGORY SECTION =====
function CategorySection({ category, index }: { category: Category; index: number }) {
  const catProjects = getProjectsByCategory(category.id);
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!introRef.current) return;
    
    const counter = introRef.current.querySelector('.category-counter');
    const title = introRef.current.querySelector('.cat-main-title');
    const descriptor = introRef.current.querySelector('.category-descriptor');
    const statementLines = introRef.current.querySelectorAll('.cat-statement-line');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: introRef.current,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      }
    });
    
    if (counter) tl.fromTo(counter, { y: 20, opacity: 0 }, { y: 0, opacity: 0.4, duration: 0.6, ease: 'power2.out' });
    if (title) tl.fromTo(title, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.3');
    if (descriptor) tl.fromTo(descriptor, { y: 20, opacity: 0 }, { y: 0, opacity: 0.4, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    
    statementLines.forEach((line, i) => {
      tl.fromTo(line, { y: '100%' }, { y: '0%', duration: 0.8, ease: 'power3.out' }, `-=0.4`);
    });
  }, []);

  return (
    <section 
      className="category-section" 
      id={`cat-${category.id}`}
      ref={sectionRef}
      style={{ background: category.palette.bg, color: category.palette.text }}
    >
      {/* Category Intro */}
      <div className="category-intro" ref={introRef}>
        <div className="category-counter" style={{ opacity: 0 }}>
          {category.number} / 05
        </div>
        <h2 className="heading-xl cat-main-title" style={{ color: category.palette.text, marginBottom: '1.5rem', opacity: 0 }}>
          {category.title}
        </h2>
        <div className="category-descriptor" style={{ opacity: 0 }}>
          {category.descriptor}
        </div>
        <div style={{ marginTop: '3rem' }}>
          {category.statement.map((line, i) => (
            <div key={i} style={{ overflow: 'hidden', marginBottom: '0.3rem' }}>
              <div className="cat-statement-line">
                <h3 className="heading-lg" style={{ color: category.palette.text }}>{line}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Projects */}
      {catProjects.map((project, pIdx) => (
        <ProjectSection 
          key={project.id} 
          project={project} 
          index={pIdx} 
          total={catProjects.length}
          category={category}
        />
      ))}
      
      {/* Category Transition */}
      {index < categories.length - 1 && (
        <CategoryTransition current={category} next={categories[index + 1]} />
      )}
    </section>
  );
}

// ===== CATEGORY TRANSITION =====
function CategoryTransition({ current, next }: { current: Category; next: Category }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    const children = ref.current.children;
    gsap.fromTo(children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, []);

  return (
    <div className="category-transition" ref={ref} style={{ background: `linear-gradient(to bottom, ${current.palette.bg}, ${next.palette.bg})` }}>
      <div className="text-meta" style={{ marginBottom: '1rem' }}>NEXT CHAPTER</div>
      <div className="heading-md">{next.number} / {next.title}</div>
      <a className="project-cta" style={{ marginTop: '2rem' }}
        data-cursor="open" onClick={() => scrollToSection(`cat-${next.id}`)}>
        CONTINUE →
      </a>
    </div>
  );
}

// ===== ALL WORK =====
function AllWork() {
  const [filter, setFilter] = useState('all');
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter || (filter === 'showroom' && (p.category === 'showroom' || p.category === 'dine')));

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: 'villas', label: 'VILLAS' },
    { id: 'coffee', label: 'COFFEE' },
    { id: 'nature', label: 'NATURE' },
    { id: 'cyber', label: 'CYBER' },
    { id: 'showroom', label: 'SHOWROOM & DINE' },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;
    const rows = sectionRef.current.querySelectorAll('.allwork-row');
    gsap.fromTo(rows,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }, [filter]);

  const handleRowHover = (e: React.MouseEvent, project: Project) => {
    setPreviewPos({ x: e.clientX, y: e.clientY });
    setPreviewImage(project.image);
    setPreviewVisible(true);
  };

  const handleRowMove = (e: React.MouseEvent) => {
    setPreviewPos({ x: e.clientX, y: e.clientY });
  };

  const handleRowLeave = () => {
    setPreviewVisible(false);
  };

  return (
    <section className="allwork-section" id="allwork" ref={sectionRef}>
      <h2 className="heading-lg" style={{ marginBottom: '3rem' }}>ALL WORK</h2>
      
      <div className="allwork-filters">
        {filters.map(f => (
          <button key={f.id} className={`allwork-filter ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)} data-cursor="open">
            {f.label}
          </button>
        ))}
      </div>
      
      <div>
        {filteredProjects.map((project, i) => (
          <div key={project.id} className="allwork-row" data-cursor="view"
            onMouseEnter={(e) => handleRowHover(e, project)}
            onMouseMove={handleRowMove}
            onMouseLeave={handleRowLeave}
            onClick={() => window.open(project.url, '_blank')}>
            <span className="allwork-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="allwork-title">{project.title}</span>
            <span className="allwork-category">
              {categories.find(c => c.id === project.category)?.title || project.category.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      
      {/* Preview */}
      <div className={`allwork-preview ${previewVisible ? 'visible' : ''}`}
        style={{ 
          left: `${Math.min(previewPos.x + 20, typeof window !== 'undefined' ? window.innerWidth - 350 : 1000)}px`, 
          top: `${previewPos.y - 100}px` 
        }}>
        {previewImage && <img src={previewImage} alt="" />}
      </div>
    </section>
  );
}

// ===== ABOUT =====
function About() {
  const capsRef = useRef<HTMLDivElement>(null);
  const procRef = useRef<HTMLDivElement>(null);
  const manRef = useRef<HTMLDivElement>(null);
  
  const capabilities = [
    'CREATIVE DIRECTION',
    'DIGITAL DESIGN',
    'CREATIVE DEVELOPMENT',
    'THREE.JS / WEBGL',
    'MOTION DESIGN',
    'INTERACTION',
    'EXPERIMENTAL WEB'
  ];
  
  const process = [
    '01 / THINK',
    '02 / DESIGN',
    '03 / BUILD',
    '04 / MOVE',
    '05 / RELEASE'
  ];
  
  const manifesto = [
    ['WE LIKE DIGITAL', 'TO FEEL PHYSICAL.'],
    ['WE LIKE INTERFACES', 'TO HAVE CHARACTER.'],
    ['WE LIKE WEBSITES', 'THAT LEAVE A MEMORY.']
  ];

  useEffect(() => {
    if (capsRef.current) {
      const items = capsRef.current.querySelectorAll('.capabilities-list li');
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 0.7, stagger: 0.08, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: capsRef.current, start: 'top 65%', toggleActions: 'play none none reverse' }
        }
      );
    }
    
    if (procRef.current) {
      const items = procRef.current.querySelectorAll('.process-list li');
      gsap.fromTo(items,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 0.7, stagger: 0.12, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: procRef.current, start: 'top 65%', toggleActions: 'play none none reverse' }
        }
      );
    }
    
    if (manRef.current) {
      const lines = manRef.current.querySelectorAll('.manifesto-block');
      lines.forEach((block, i) => {
        const innerLines = block.querySelectorAll('.statement-line-inner');
        gsap.fromTo(innerLines,
          { y: '100%' },
          {
            y: '0%', stagger: 0.15, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        );
      });
    }
  }, []);

  return (
    <section className="about-section" id="about">
      {/* Studio Info */}
      <div style={{ marginBottom: '6rem' }}>
        <div className="text-meta" style={{ marginBottom: '1.5rem' }}>DIGITAL EXPERIENCE STUDIO</div>
        <h2 className="heading-xl" style={{ marginBottom: '3rem' }}>STEALTH®</h2>
        <div>
          {['WE DESIGN.', 'WE DEVELOP.', 'WE MOVE.', 'WE BUILD DIGITAL EXPERIENCES', 'PEOPLE REMEMBER.'].map((line, i) => (
            <div className="statement-line" key={i}>
              <div className="statement-line-inner visible">
                <h3 className="heading-md" style={{ marginBottom: '0.3rem' }}>{line}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Capabilities */}
      <div style={{ marginBottom: '6rem' }} ref={capsRef}>
        <div className="text-meta" style={{ marginBottom: '2rem' }}>CAPABILITIES</div>
        <ul className="capabilities-list">
          {capabilities.map((cap, i) => (
            <li key={i}>{cap}</li>
          ))}
        </ul>
      </div>
      
      {/* Process */}
      <div style={{ marginBottom: '6rem' }} ref={procRef}>
        <div className="text-meta" style={{ marginBottom: '2rem' }}>APPROACH</div>
        <ul className="process-list">
          {process.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>
      
      {/* Manifesto */}
      <div ref={manRef}>
        <div className="text-meta" style={{ marginBottom: '2rem' }}>MANIFESTO</div>
        {manifesto.map((pair, i) => (
          <div className="manifesto-block" key={i} style={{ marginBottom: '2rem' }}>
            {pair.map((line, j) => (
              <div className="manifesto-line" key={j}>
                <div className="statement-line-inner">
                  <h3 className="heading-md" style={{ marginBottom: '0.2rem' }}>{line}</h3>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ===== CONTACT =====
function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%', toggleActions: 'play none none reverse' }
      }
    );
  }, []);

  return (
    <section className="contact-section" id="contact" ref={ref}>
      <div className="text-meta" style={{ marginBottom: '1.5rem' }}>STEALTH®</div>
      <h2 className="heading-xl" style={{ marginBottom: '0.5rem' }}>HAVE SOMETHING</h2>
      <h2 className="heading-xl" style={{ marginBottom: '3rem' }}>WORTH ENTERING?</h2>
      <a href="mailto:hello@stealth.studio" className="contact-cta" data-cursor="enter">
        START A PROJECT ↗
      </a>
      <div style={{ marginTop: '3rem' }}>
        <div className="text-small" style={{ opacity: 0.4, marginBottom: '1rem' }}>
          DESIGN / DEVELOPMENT / IMMERSIVE WEB / MOTION
        </div>
        <div className="text-small" style={{ opacity: 0.4 }}>
          hello@stealth.studio
        </div>
      </div>
    </section>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="footer">
      <div>
        <div style={{ fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: 500, textTransform: 'uppercase' as const, marginBottom: '0.5rem' }}>
          STEALTH®
        </div>
        <div className="text-meta" style={{ marginBottom: '0.5rem' }}>DIGITAL EXPERIENCE STUDIO</div>
        <div className="text-meta">
          12 PROJECTS &nbsp; 05 CATEGORIES &nbsp; 01 STUDIO
        </div>
        <div className="text-meta" style={{ marginTop: '0.5rem' }}>© 2026</div>
      </div>
      <button className="footer-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-cursor="open">
        BACK TO TOP ↑
      </button>
    </footer>
  );
}

// ===== SCROLL HELPER =====
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== MAIN APP =====
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('villas');
  
  useLenis();
  
  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
    document.documentElement.classList.remove('is-loading');
  }, []);

  // Track current category and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(c => document.getElementById(`cat-${c.id}`));
      const scrollY = window.scrollY + window.innerHeight / 2;
      
      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollY) {
          setCurrentCategory(categories[i].id);
          found = true;
          break;
        }
      }
      if (!found) setCurrentCategory('villas');
      
      // Update scroll progress bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      {!loaded && <Loader onComplete={handleLoadComplete} />}
      <div className="noise-overlay" />
      <CustomCursor />
      <Navigation onMenuOpen={() => setMenuOpen(true)} currentCategory={currentCategory} />
      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <main>
        <Hero />
        <Statement />
        <CategoryIndex />
        
        {categories.map((cat, i) => (
          <CategorySection key={cat.id} category={cat} index={i} />
        ))}
        
        <AllWork />
        <About />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

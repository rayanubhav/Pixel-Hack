/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimate,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*                           GLOBAL RIPPLE SYSTEM                            */
/* -------------------------------------------------------------------------- */

const GlobalRippleProvider = ({ children }) => {
  const [ripples, setRipples] = useState([]);
  const throttleTimeout = useRef(null);
  const lastRippleTime = useRef(0);

  // Creates a new water ripple at given coordinates
  const createWaterRipple = (x, y) => {
    const now = Date.now();
    // Throttle ripples to avoid too many on mobile
    if (now - lastRippleTime.current < 100) return;
    
    const newRipple = {
      id: now + Math.random(),
      x,
      y,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    lastRippleTime.current = now;

    // Cleanup ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  // Mouse move handler (desktop)
  const handleMouseMove = (event) => {
    if (!throttleTimeout.current) {
      createWaterRipple(event.clientX, event.clientY);
      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;
      }, 200); // Increased throttle for better performance
    }
  };

  // Touch handlers (mobile)
  const handleTouchStart = (event) => {
    event.preventDefault(); // Prevent default touch behavior
    const touch = event.touches[0];
    if (touch) {
      createWaterRipple(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (event) => {
    if (!throttleTimeout.current) {
      const touch = event.touches[0];
      if (touch) {
        createWaterRipple(touch.clientX, touch.clientY);
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
        }, 150);
      }
    }
  };

  // Click/tap handler
  const handleInteraction = (event) => {
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    if (x && y) {
      createWaterRipple(x, y);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onClick={handleInteraction}
      style={{ touchAction: 'auto' }} // Allow normal touch interactions
    >
      {children}
      
      {/* Global Ripple Effects */}
      {ripples.map((ripple) => (
        <React.Fragment key={ripple.id}>
          {/* Expanding outer ring */}
          <motion.span
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="fixed border border-gray-400/20 dark:border-gray-500/30 rounded-full pointer-events-none z-50"
            style={{
              width: 40,
              height: 40,
              top: ripple.y,
              left: ripple.x,
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Fading inner fill */}
          <motion.span
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed bg-gray-400/10 dark:bg-gray-500/15 rounded-full pointer-events-none z-50"
            style={{
              width: 40,
              height: 40,
              top: ripple.y,
              left: ripple.x,
              transform: "translate(-50%, -50%)",
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                   */
/* -------------------------------------------------------------------------- */

const LogoIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

const SocialIcon = ({ type, className }) => {
  const icons = {
    twitter: (
      <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    ),
    linkedin: (
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    ),
    github: (
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C7.325 16.2 6.73 15.9 6.73 15.9c-1.104-.753.083-.738.083-.738 1.22.086 1.863 1.253 1.863 1.253 1.087 1.863 2.85 1.325 3.545 1.013.11-.788.423-1.325.765-1.63-2.71-.308-5.555-1.356-5.555-6.037 0-1.334.478-2.427 1.26-3.28-.125-.308-.547-1.55.12-3.234 0 0 1.023-.328 3.35 1.25.972-.27 2.01-.405 3.045-.405s2.073.135 3.045.405c2.327-1.578 3.35-1.25 3.35-1.25.667 1.684.245 2.926.12 3.234.783.853 1.26 1.946 1.26 3.28 0 4.695-2.845 5.725-5.565 6.027.435.375.823 1.11.823 2.236 0 1.615-.015 2.915-.015 3.31 0 .32.218.695.825.57C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    )
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {icons[type]}
    </svg>
  );
};

const ArrowLeftIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*                               CORE UI PARTS                               */
/* -------------------------------------------------------------------------- */

const RippleButton = ({ children, onClick, className }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent global ripple
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple = { x, y, size, id: Date.now() };
    setRipples([...ripples, newRipple]);
    if (onClick) onClick(event);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples(ripples.slice(1)), 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <button
      className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${className}`}
      onClick={handleClick}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};

const AnimatedTitle = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  return (
    <motion.h2
      ref={ref}
      className={`text-4xl md:text-6xl font-bold text-center tracking-tight ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {text.split(' ').map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-4"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  LAYOUT                                   */
/* -------------------------------------------------------------------------- */

const Header = ({ onNavigate, isMenuOpen, setIsMenuOpen }) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const menuColor = isMenuOpen ? '#FFFFFF' : '#171717';
    animate([
      ['#top', { rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 0 : -2 }, { duration: 0.3 }],
      ['#bottom', { rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? 0 : 2 }, { duration: 0.3, at: '<' }],
      [scope.current, { color: menuColor }, { duration: 0.3, at: '<' }],
      ['#top', { backgroundColor: menuColor }, { duration: 0.3, at: '<' }],
      ['#bottom', { backgroundColor: menuColor }, { duration: 0.3, at: '<' }]
    ]);
  }, [isMenuOpen, animate]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50">
        <motion.div
          ref={scope}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('home');
          }}
          animate={{ color: isMenuOpen ? '#FFFFFF' : '#171717' }}
          transition={{ duration: 0.3 }}
        >
          <LogoIcon className="h-8 w-8" />
          <span className="text-xl font-bold">Aetherium Labs</span>
        </motion.div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="flex flex-col items-center justify-center space-y-1 z-50"
        >
          <motion.span
            animate={{ color: isMenuOpen ? '#FFFFFF' : '#171717' }}
            className="block text-xs uppercase tracking-widest"
          >
            Menu
          </motion.span>
          <div className="relative h-4 w-8 flex flex-col justify-center items-center">
            <span id="top" className="block h-0.5 w-8 bg-neutral-900 absolute" />
            <span id="bottom" className="block h-0.5 w-8 bg-neutral-900 absolute" />
          </div>
        </motion.button>
      </header>
      <FullScreenMenu onNavigate={onNavigate} isMenuOpen={isMenuOpen} />
    </>
  );
};

const FullScreenMenu = ({ onNavigate, isMenuOpen }) => {
  const menuVariants = {
    hidden: { opacity: 0, display: 'none' },
    visible: {
      opacity: 1,
      display: 'flex',
      transition: { when: 'beforeChildren', staggerChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: {
        when: 'afterChildren',
        staggerChildren: 0.1,
        staggerDirection: -1
      },
      transitionEnd: { display: 'none' }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  const navItems = [
    { page: 'home', title: 'Home' },
    { page: 'solutions', title: 'Solutions' },
    { page: 'about', title: 'About Us' },
    { page: 'contact', title: 'Contact' }
  ];

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-neutral-900 bg-opacity-95 backdrop-blur-sm z-40 flex-col items-center justify-center space-y-8"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
        >
          {navItems.map((item) => (
            <motion.div key={item.page} variants={itemVariants}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(item.page);
                }}
                className="block text-5xl md:text-6xl font-semibold text-neutral-200 hover:text-white transition-colors duration-300"
              >
                {item.title}
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="bg-neutral-900 text-neutral-400 py-12 relative z-10">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Aetherium Labs</span>
        </div>
        <div className="flex space-x-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            <SocialIcon type="twitter" className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <SocialIcon type="linkedin" className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <SocialIcon type="github" className="h-6 w-6" />
          </a>
        </div>
      </div>
      <div className="mt-8 border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Aetherium Labs. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  </footer>
);

/* -------------------------------------------------------------------------- */
/*                              PAGE COMPONENTS                               */
/* -------------------------------------------------------------------------- */

const HomePage = () => (
  <>
    <HeroSection />
    <ShowcaseSection />
    <TeamSection />
    <ContactCtaSection />
  </>
);

/* --------------------------- SOLUTIONS PAGE ------------------------------- */

const SolutionsPage = () => {
  /* ------------------------------ DATA ----------------------------------- */
  const section1 = {
    info: [
      { value: '30+', label: 'AI Models Deployed' },
      { value: '50+', label: 'Cloud Migrations' },
      { value: '100%', label: 'Client Satisfaction' }
    ],
    cards: [
      {
        id: 1,
        title: 'AI-Powered Predictive Maintenance',
        image:
          'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 2,
        title: 'Scalable E-Commerce Cloud Platform',
        image:
          'https://images.unsplash.com/photo-1580820267682-426da823b514?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  };

  const section2 = {
    info: {
      title: 'Our Core Features',
      description:
        'We deliver comprehensive solutions by combining cutting-edge technology with strategic insights.'
    },
    bigCardSlider: [
      {
        id: 1,
        title: 'Real-time Analytics Dashboard',
        image:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
        content:
          'Monitor your KPIs with a fully interactive, real-time data dashboard, providing actionable insights at a glance.'
      },
      {
        id: 2,
        title: 'Advanced Data Visualization',
        image:
          'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=1000&auto=format&fit=crop',
        content:
          'Transform complex datasets into beautiful and intuitive visualizations that tell a compelling story.'
      }
    ],
    smallCards: [
      {
        id: 3,
        title: 'Threat Detection',
        image:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 4,
        title: 'NLP APIs',
        image:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 5,
        title: 'Kubernetes',
        image:
          'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 6,
        title: 'Encryption',
        image:
          'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  };

  const section3 = {
    info: {
      title: 'Built for Performance',
      description:
        'Our solutions are optimized for speed, scalability, and reliability, ensuring a seamless user experience.'
    },
    bigCardSlider: [
      {
        id: 1,
        title: 'Global Content Delivery Network',
        image:
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
        content:
          'Deliver content to your users with lightning-fast speed, no matter where they are in the world.'
      },
      {
        id: 2,
        title: 'Automated Load Balancing',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
        content:
          'Automatically distribute traffic to ensure your application remains responsive and available, even during peak loads.'
      }
    ],
    smallCards: [
      {
        id: 3,
        title: 'CI/CD Pipelines',
        image:
          'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 4,
        title: 'Infrastructure as Code',
        image:
          'https://images.unsplash.com/photo-1604964432806-254d07c11f32?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 5,
        title: 'Real-time Monitoring',
        image:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: 6,
        title: 'Disaster Recovery',
        image:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop'
      }
    ]
  };

  /* ---------------------------- ANIM HELPERS ----------------------------- */

  const AnimatedCard = ({ children, xOffset = 0, yOffset = 0, scrollProgress, className = "", preventScale = false }) => {
    const x = useTransform(scrollProgress, [0, 0.4, 1], [xOffset, 0, 0], { clamp: true });
    const y = useTransform(scrollProgress, [0, 0.4, 1], [yOffset, 0, 0], { clamp: true });
    const scaleTransform = useTransform(scrollProgress, [0, 0.4, 1], [0.95, 1, 1], { clamp: true });
    const opacity = useTransform(scrollProgress, [0, 0.2, 0.4], [0, 0.5, 1], { clamp: true });
    
    const scale = preventScale ? 1 : scaleTransform;
    
    return (
      <motion.div 
        style={{ 
          x, 
          y, 
          scale,
          opacity,
          transformOrigin: 'center center',
          willChange: 'transform, opacity'
        }} 
        className={className}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {children}
      </motion.div>
    );
  };

  const BigCardSlider = ({ slides }) => {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      if (!isHovered) {
        const interval = setInterval(() => {
          setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [slides.length, isHovered]);

    const navigate = (direction) => {
      setIndex((prev) => (prev + direction + slides.length) % slides.length);
    };

    return (
      <div 
        className="relative h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transformOrigin: 'center center' }}
      >
        <div className="h-1/2 overflow-hidden relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={`${index}-${slides[index].id}`}
              src={slides[index].image}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.4 },
                scale: { duration: 0.6 }
              }}
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x300/171717/ffffff?text=Loading';
              }}
            />
          </AnimatePresence>
        </div>
        <div className="p-8 flex-grow flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4 transition-all duration-300 group-hover:text-3xl md:group-hover:text-4xl">
                {slides[index].title}
              </h3>
              <p className="text-base md:text-lg text-neutral-600 flex-grow transition-all duration-300 group-hover:text-lg md:group-hover:text-xl">
                {slides[index].content}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-end space-x-4 mt-8 relative z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="p-3 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 hover:scale-110"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="p-3 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 hover:scale-110"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ScrollAnimatedSection = ({ children }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start']
    });
    return (
      <section ref={ref} className="relative">
        {children(scrollYProgress)}
      </section>
    );
  };

  /* --------------------------- RENDER START ----------------------------- */

  return (
    <div className="min-h-screen bg-neutral-100 pt-32 pb-20">
      <div className="container mx-auto px-6 space-y-40">
        {/* ---------- Section 1 ---------- */}
        <ScrollAnimatedSection>
          {(scrollYProgress) => (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                {section1.info.map((item) => (
                  <div key={item.label}>
                    <p className="text-5xl font-bold text-indigo-600">{item.value}</p>
                    <p className="text-neutral-500 mt-2">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatedCard scrollProgress={scrollYProgress} xOffset={-100} yOffset={50}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-80">
                      <img
                        src={section1.cards[0].image}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/600x320/171717/ffffff?text=Loading';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{section1.cards[0].title}</h3>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard scrollProgress={scrollYProgress} xOffset={100} yOffset={50}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-80">
                      <img
                        src={section1.cards[1].image}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/600x320/171717/ffffff?text=Loading';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{section1.cards[1].title}</h3>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          )}
        </ScrollAnimatedSection>

        {/* ---------- Section 2 ---------- */}
        <ScrollAnimatedSection>
          {(scrollYProgress) => (
            <div className="relative">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">{section2.info.title}</h2>
                <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                  {section2.info.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[700px]">
                <AnimatedCard
                  scrollProgress={scrollYProgress}
                  xOffset={-100}
                  yOffset={30}
                  preventScale={true}
                >
                  <BigCardSlider slides={section2.bigCardSlider} />
                </AnimatedCard>

                <div className="grid grid-cols-2 gap-6">
                  {section2.smallCards.map((card, i) => (
                    <AnimatedCard
                      key={card.id}
                      scrollProgress={scrollYProgress}
                      xOffset={100}
                      yOffset={-30 + i * 15}
                    >
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full group relative">
                        <img
                          src={card.image}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x400/171717/ffffff?text=Loading';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <p className="text-sm md:text-base text-white font-semibold">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollAnimatedSection>

        {/* ---------- Section 3 ---------- */}
        <ScrollAnimatedSection>
          {(scrollYProgress) => (
            <div className="relative">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold">{section3.info.title}</h2>
                <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                  {section3.info.description}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[700px]">
                <div className="grid grid-cols-2 gap-6">
                  {section3.smallCards.map((card, i) => (
                    <AnimatedCard
                      key={card.id}
                      scrollProgress={scrollYProgress}
                      xOffset={-100}
                      yOffset={-30 + i * 15}
                    >
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full group relative">
                        <img
                          src={card.image}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x400/171717/ffffff?text=Loading';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <p className="text-sm md:text-base text-white font-semibold">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>

                <AnimatedCard
                  scrollProgress={scrollYProgress}
                  xOffset={100}
                  yOffset={30}
                  preventScale={true}
                >
                  <BigCardSlider slides={section3.bigCardSlider} />
                </AnimatedCard>
              </div>
            </div>
          )}
        </ScrollAnimatedSection>
      </div>
    </div>
  );
};

/* ---------------------------- ENHANCED ABOUT & CONTACT ---------------------------- */

const AboutPage = () => {
  const stats = [
    { value: '150+', label: 'Projects Completed', icon: '🚀' },
    { value: '50+', label: 'Enterprise Clients', icon: '🏢' },
    { value: '15+', label: 'Countries Served', icon: '🌍' },
    { value: '99.9%', label: 'Uptime Guaranteed', icon: '⚡' }
  ];

  const values = [
    {
      title: 'Innovation First',
      description: 'We stay ahead of technological trends to deliver cutting-edge solutions that drive your business forward.',
      icon: '💡'
    },
    {
      title: 'Client Success',
      description: 'Your success is our success. We partner with you to understand your challenges and exceed your expectations.',
      icon: '🎯'
    },
    {
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in code quality, security, and performance across all our deliverables.',
      icon: '⭐'
    },
    {
      title: 'Transparency',
      description: 'Clear communication, honest timelines, and full visibility into our development process.',
      icon: '🔍'
    }
  ];

  const milestones = [
    { year: '2018', title: 'Company Founded', description: 'Started with a vision to transform businesses through technology' },
    { year: '2019', title: 'First Enterprise Client', description: 'Landed our first Fortune 500 company partnership' },
    { year: '2021', title: 'Global Expansion', description: 'Opened offices in 3 countries and grew to 50+ team members' },
    { year: '2023', title: 'AI Innovation Lab', description: 'Launched dedicated AI research division and ML platform' },
    { year: '2025', title: 'Industry Leader', description: 'Recognized as a top technology consulting firm globally' }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedTitle text="About Aetherium Labs" className="text-neutral-800 mb-8" />
          <motion.p 
            className="text-xl md:text-2xl text-neutral-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            We are a forward-thinking technology company dedicated to transforming businesses 
            through innovative AI solutions, cloud architecture, and cutting-edge development practices.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-neutral-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                To empower businesses worldwide with transformative technology solutions that drive innovation, 
                efficiency, and sustainable growth. We believe in the power of technology to solve complex 
                challenges and create meaningful impact.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Through our expertise in AI, cloud computing, and modern development practices, we help 
                organizations navigate the digital landscape and achieve their most ambitious goals.
              </p>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Expert team with 10+ years experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Proven track record with enterprise clients
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    Cutting-edge technology stack
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                    24/7 support and maintenance
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Our Values</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every solution we build
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Our Journey</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From startup to industry leader - here's how we've grown
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="flex flex-col md:flex-row items-start md:items-center mb-12 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 md:mb-0 md:mr-8">
                  {milestone.year}
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-2">{milestone.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'AI & Machine Learning',
    'Cloud Architecture',
    'Web Development',
    'Mobile Development',
    'Data Analytics',
    'Cybersecurity',
    'DevOps & Infrastructure',
    'Consulting'
  ];

  const contactInfo = [
    {
      title: 'Email Us',
      details: 'hello@aetheriumlabs.com',
      subDetails: 'We\'ll respond within 24 hours',
      icon: '📧'
    },
    {
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon - Fri, 9AM - 6PM EST',
      icon: '📞'
    },
    {
      title: 'Visit Our Office',
      details: '123 Innovation Drive',
      subDetails: 'San Francisco, CA 94107',
      icon: '🏢'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      company: '',
      message: '',
      service: ''
    });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedTitle text="Get In Touch" className="text-neutral-800 mb-8" />
          <motion.p 
            className="text-xl md:text-2xl text-neutral-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Ready to transform your business with cutting-edge technology? 
            Let's discuss your project and explore how we can help you achieve your goals.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">{info.title}</h3>
              <p className="text-lg text-indigo-600 font-semibold mb-1">{info.details}</p>
              <p className="text-neutral-500 text-sm">{info.subDetails}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-8">Send us a message</h2>
              
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      <div>
                        <p className="font-semibold">Message sent successfully!</p>
                        <p className="text-sm">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your full name"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your company name"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-neutral-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                  } text-white`}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="lg:pl-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-neutral-800 mb-6">Let's start a conversation</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Quick Response</h4>
                    <p className="text-neutral-600">We typically respond to all inquiries within 24 hours during business days.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Free Consultation</h4>
                    <p className="text-neutral-600">Schedule a complimentary 30-minute consultation to discuss your project needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🔒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Confidential</h4>
                    <p className="text-neutral-600">Your information is secure. We can sign an NDA before discussing your project.</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-4">
                    <h4 className="font-semibold text-neutral-800 mb-2">What's your typical project timeline?</h4>
                    <p className="text-neutral-600 text-sm">Project timelines vary based on complexity, but most projects range from 8-24 weeks from start to deployment.</p>
                  </div>
                  <div className="border-b border-neutral-200 pb-4">
                    <h4 className="font-semibold text-neutral-800 mb-2">Do you work with startups?</h4>
                    <p className="text-neutral-600 text-sm">Absolutely! We work with companies of all sizes, from early-stage startups to Fortune 500 enterprises.</p>
                  </div>
                  <div className="border-b border-neutral-200 pb-4">
                    <h4 className="font-semibold text-neutral-800 mb-2">What technologies do you specialize in?</h4>
                    <p className="text-neutral-600 text-sm">We specialize in React, Node.js, Python, AWS, Azure, AI/ML, and modern DevOps practices.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              HOME SUB SECTIONS                             */
/* -------------------------------------------------------------------------- */

const HeroSection = () => {
  const heroContent = [
    {
      id: 1,
      title: 'AI Integration',
      imageUrl:
        'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Cloud Architecture',
      imageUrl:
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Data Analytics',
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Cyber Security',
      imageUrl:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
    }
  ];
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentImage = hoveredId
    ? heroContent.find((item) => item.id === hoveredId)?.imageUrl
    : null;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-100">
      <div className="text-center z-10">
        {heroContent.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <h1 className="text-6xl md:text-9xl font-extrabold text-neutral-800 hover:text-white transition-colors duration-500 cursor-pointer tracking-tighter py-2 relative">
              {item.title}
            </h1>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {currentImage && (
          <motion.div
            className="hidden md:block absolute top-0 left-0 z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 200,
              y: mousePosition.y - 300
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          >
            <div className="w-[400px] h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={currentImage}
                alt="Service"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://placehold.co/400x600/171717/ffffff?text=Error';
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

/* -------------------- SHOWCASE SECTION WITH DISABLED GLOBAL RIPPLES -------------------- */

const ShowcaseSection = () => {
  const technologies = [
    { name: 'React', logo: 'https://cdn.worldvectorlogo.com/logos/react-2.svg' },
    { name: 'Next.js', logo: 'https://cdn.worldvectorlogo.com/logos/next-js.svg' },
    { name: 'TypeScript', logo: 'https://cdn.worldvectorlogo.com/logos/typescript.svg' },
    { name: 'Framer', logo: 'https://cdn.worldvectorlogo.com/logos/framer-1.svg' },
    { name: 'Tailwind CSS', logo: 'https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg' },
    { name: 'Node.js', logo: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
    { name: 'AWS', logo: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg' }
  ];

  // Create enough duplicates for seamless loop
  const duplicatedTechnologies = [...technologies, ...technologies, ...technologies];
  
  // Motion values for position tracking
  const x = useMotionValue(0);
  const [anyCardHovered, setAnyCardHovered] = useState(false);
  
  // Animation speed - pixels per second
  const animationSpeed = 57.6; // This gives us 35 second duration for 2016px

  // Use animation frame to continuously update position
  useAnimationFrame((time, delta) => {
    if (!anyCardHovered) {
      // Continue animation from current position
      const currentX = x.get();
      const newX = currentX - (animationSpeed * delta) / 1000;
      
      // Reset position when we've moved the width of one set (seamless loop)
      if (newX <= -2016) {
        x.set(newX + 2016);
      } else {
        x.set(newX);
      }
    }
    // When anyCardHovered is true, the position stays frozen at current value
  });

  // Initialize animation
  useEffect(() => {
    x.set(0);
  }, [x]);

  // Enhanced Technology Card Component with Reliable Hover Detection
  const TechnologyCard = ({ tech, index }) => {
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [ripples, setRipples] = useState([]);
    const cardRef = useRef(null);
    
    const handleMouseEnter = (event) => {
      event.stopPropagation(); // Prevent global ripple
      setIsCardHovered(true);
      setAnyCardHovered(true);
      
      // Add centered ripple effect on hover
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = rect.width / 2 - size / 2;  // Center the ripple
      const y = rect.height / 2 - size / 2; // Center the ripple
      const newRipple = { x, y, size, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
    };
    
    const handleMouseLeave = (event) => {
      setIsCardHovered(false);
      setAnyCardHovered(false);
    };

    const handleClick = (event) => {
      event.stopPropagation(); // Prevent global ripple
      // Ensure hover state is set on click
      setIsCardHovered(true);
      setAnyCardHovered(true);
      
      // Add ripple effect on click (from touch/click position)
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (event.clientX || event.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left - size / 2;
      const y = (event.clientY || event.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top - size / 2;
      const newRipple = { x, y, size, id: Date.now() + 1 };
      setRipples(prev => [...prev, newRipple]);
    };

    const handleTouchStart = (event) => {
      event.stopPropagation(); // Prevent global ripple
      setIsCardHovered(true);
      setAnyCardHovered(true);
      
      // Add ripple effect on touch
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const touch = event.touches[0];
      const size = Math.max(rect.width, rect.height);
      const x = touch.clientX - rect.left - size / 2;
      const y = touch.clientY - rect.top - size / 2;
      const newRipple = { x, y, size, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
    };

    const handleTouchEnd = () => {
      setIsCardHovered(false);
      setAnyCardHovered(false);
    };

    const handleMouseMove = (event) => {
      event.stopPropagation(); // Prevent global ripple
    };

    // Clean up ripples
    useEffect(() => {
      if (ripples.length > 0) {
        const timer = setTimeout(() => setRipples(prev => prev.slice(1)), 600);
        return () => clearTimeout(timer);
      }
    }, [ripples]);
    
    return (
      <motion.div
        ref={cardRef}
        className="flex-shrink-0 w-64 flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm cursor-pointer relative overflow-hidden select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        role="button"
        aria-label={`${tech.name} technology`}
        initial={{ scale: 1 }}
        animate={{ 
          scale: isCardHovered ? 1.05 : 1,
          y: isCardHovered ? -8 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          duration: 0.3
        }}
        style={{
          boxShadow: isCardHovered 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          // Ensure proper pointer events
          pointerEvents: 'auto',
          // Increase hit area slightly
          padding: '2rem'
        }}
      >
        {/* Hover gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0"
          animate={{ opacity: isCardHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <motion.img
            src={tech.logo}
            alt={tech.name}
            className="h-20 w-auto object-contain transition-all duration-300"
            animate={{ 
              filter: isCardHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%)',
              scale: isCardHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/80x80/171717/ffffff?text=' + tech.name.charAt(0);
            }}
            style={{ pointerEvents: 'none' }}
          />
          <motion.p 
            className="mt-4 font-semibold text-center transition-all duration-300"
            animate={{ 
              color: isCardHovered ? '#4338ca' : '#374151',
              scale: isCardHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: 'none' }}
          >
            {tech.name}
          </motion.p>
        </div>

        {/* Focus ring for accessibility */}
        <motion.div
          className="absolute inset-0 border-2 border-indigo-500 rounded-2xl opacity-0"
          animate={{ opacity: isCardHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Ripple effects - triggered on both hover and click */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute bg-indigo-500/20 rounded-full animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              pointerEvents: 'none'
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <section 
      className="py-20 md:py-32 bg-neutral-100"
      // Disable global ripples on this entire section
      onMouseMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="container mx-auto px-6">
        <AnimatedTitle
          text="Powered by Cutting-Edge Technologies"
          className="text-neutral-800"
        />
        
        <div 
          className="mt-20 relative w-full overflow-hidden"
          // Extra prevention on the marquee container
          onMouseMove={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Gradient overlays for seamless edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            className="flex gap-8" 
            style={{ 
              x,
              willChange: 'transform'
            }}
            // Prevent global ripples on the moving container
            onMouseMove={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {duplicatedTechnologies.map((tech, index) => (
              <TechnologyCard 
                key={`${tech.name}-${index}`} 
                tech={tech} 
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Alara Vance',
      role: 'Chief Executive Officer',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Kaelen Reed',
      role: 'Chief Technology Officer',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Seraphina Li',
      role: 'Lead Product Designer',
      image:
        'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Jaxson Cole',
      role: 'Head of AI Research',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
    }
  ];
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const currentImage = hoveredId
    ? teamMembers.find((m) => m.id === hoveredId)?.image
    : null;

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedTitle text="Meet the Innovators" className="text-neutral-800" />
        <div className="mt-16">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex justify-between items-center py-8 cursor-pointer group ${
                index === 0 ? 'border-y' : 'border-b'
              } border-neutral-200`}
            >
              <h3 className="text-3xl md:text-5xl font-bold text-neutral-400 group-hover:text-neutral-800 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-lg md:text-xl text-neutral-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {currentImage && (
          <motion.div
            className="hidden md:block absolute top-0 left-0 z-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 128,
              y: mousePosition.y - 128
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl bg-neutral-200">
              <img
                src={currentImage}
                alt="Team member"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/256/171717/ffffff?text=Image';
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ContactCtaSection = () => (
  <section className="py-20 md:py-32 bg-neutral-900 text-white">
    <div className="container mx-auto px-6 text-center">
      <AnimatedTitle text="Let's Build the Future Together" className="text-white" />
      <p className="max-w-2xl mx-auto mt-6 text-lg text-neutral-300">
        Have a project in mind or just want to learn more about our work? We'd love to hear
        from you.
      </p>
      <div className="mt-10">
        <RippleButton className="bg-white text-neutral-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-neutral-200">
          Get In Touch
        </RippleButton>
      </div>
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*                             MAIN APP WRAPPER                               */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [page, setPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (newPage) => {
    if (newPage === page || isTransitioning) return;
    setIsMenuOpen(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      window.scrollTo(0, 0);
    }, 500);
  };

  const transitionVariants = {
    initial: { y: '100%', opacity: 1 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { ease: [0.43, 0.13, 0.23, 0.96], duration: 0.5 }
    },
    exit: {
      y: '-100%',
      opacity: 1,
      transition: { ease: [0.43, 0.13, 0.23, 0.96], duration: 0.5 }
    }
  };

  const pages = {
    home: <HomePage />,
    solutions: <SolutionsPage />,
    about: <AboutPage />,
    contact: <ContactPage />
  };

  return (
    <GlobalRippleProvider>
      <div className="bg-neutral-100 min-h-screen font-sans">
        <style>{`
          @keyframes ripple { to { transform: scale(4); opacity: 0; } }
          .animate-ripple { transform: scale(0); animation: ripple 600ms linear; }
          * {
            transform-origin: center center;
          }
          .will-change-transform {
            will-change: transform;
          }
          /* Focus styles for accessibility */
          *:focus-visible {
            outline: 2px solid #4338ca;
            outline-offset: 2px;
          }
          /* Mobile touch optimization */
          @media (max-width: 768px) {
            .animate-ripple {
              animation: ripple 400ms linear;
            }
          }
        `}</style>

        {/* ------------ Loader ------------ */}
        <AnimatePresence mode="wait">
          {isLoading && <Loader setIsLoading={setIsLoading} />}
        </AnimatePresence>

        {/* ------------- Pages ------------- */}
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Header
                onNavigate={handleNavigate}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
              {pages[page]}
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Transition ---------- */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 bg-neutral-800 z-[100]"
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationComplete={() => setIsTransitioning(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </GlobalRippleProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

const Loader = ({ setIsLoading }) => {
  const words = ['Innovate', 'Create', 'Elevate'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index === words.length - 1) {
      const finalTimer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(finalTimer);
    }
    const timer = setTimeout(() => setIndex((prev) => prev + 1), 1200);
    return () => clearTimeout(timer);
  }, [index, setIsLoading, words.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-900 text-white"
      exit={{ y: '-100vh', transition: { ease: 'easeInOut', duration: 1 } }}
    >
      <AnimatePresence>
        <motion.h1
          key={words[index]}
          className="text-6xl md:text-8xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
};

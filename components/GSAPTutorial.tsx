"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Zap, Activity, Lock, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pattern data structure
const PATTERNS = {
  entering: {
    label: "ENTERING",
    description: "Elements materializing from void",
    icon: "⟶",
    color: "cyan",
    variants: {
      fadeUp: {
        label: "Fade + Slide Up",
        ease: "back.out(1.7)",
        duration: 0.5,
        code: `gsap.from(".element", {
  y: 60,
  opacity: 0,
  ease: "back.out(1.7)",
  duration: 0.5
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.from(el, { y: 60, opacity: 0, ease: "back.out(1.7)", duration: 0.5 });
        }
      },
      fadeScale: {
        label: "Fade + Scale",
        ease: "back.out(1.7)",
        duration: 0.5,
        code: `gsap.from(".element", {
  scale: 0.8,
  opacity: 0,
  ease: "back.out(1.7)",
  duration: 0.5
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.from(el, { scale: 0.8, opacity: 0, ease: "back.out(1.7)", duration: 0.5 });
        }
      },
      slideRight: {
        label: "Slide from Side",
        ease: "power3.out",
        duration: 0.5,
        code: `gsap.from(".element", {
  x: -100,
  opacity: 0,
  ease: "power3.out",
  duration: 0.5
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.from(el, { x: -100, opacity: 0, ease: "power3.out", duration: 0.5 });
        }
      },
      popIn: {
        label: "Pop In (Playful)",
        ease: "elastic.out(1, 0.5)",
        duration: 0.8,
        code: `gsap.from(".element", {
  scale: 0,
  ease: "elastic.out(1, 0.5)",
  duration: 0.8
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.from(el, { scale: 0, ease: "elastic.out(1, 0.5)", duration: 0.8 });
        }
      }
    }
  },
  exiting: {
    label: "EXITING",
    description: "Elements dissolving into darkness",
    icon: "⟵",
    color: "magenta",
    variants: {
      fadeOut: {
        label: "Fade + Slide Down",
        ease: "power2.in",
        duration: 0.3,
        code: `gsap.to(".element", {
  y: 60,
  opacity: 0,
  ease: "power2.in",
  duration: 0.3
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { y: 60, opacity: 0, ease: "power2.in", duration: 0.3 });
        }
      },
      flyAway: {
        label: "Fly Away",
        ease: "power2.in / power3.in",
        duration: 0.4,
        code: `gsap.timeline()
  .to(".element", { x: -20, duration: 0.1, ease: "power2.in" })
  .to(".element", { x: 300, opacity: 0, duration: 0.3, ease: "power3.in" });`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.timeline()
            .to(el, { x: -20, duration: 0.1, ease: "power2.in" })
            .to(el, { x: 300, opacity: 0, duration: 0.3, ease: "power3.in" });
        }
      },
      scaleOut: {
        label: "Scale Out",
        ease: "power2.in",
        duration: 0.25,
        code: `gsap.to(".element", {
  scale: 0.8,
  opacity: 0,
  ease: "power2.in",
  duration: 0.25
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 0.8, opacity: 0, ease: "power2.in", duration: 0.25 });
        }
      }
    }
  },
  transform: {
    label: "TRANSFORM",
    description: "Morphing visible states",
    icon: "◈",
    color: "yellow",
    variants: {
      expand: {
        label: "Expand",
        ease: "back.inOut(1.4)",
        duration: 0.5,
        code: `gsap.to(".element", {
  scale: 1.3,
  ease: "back.inOut(1.4)",
  duration: 0.5
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 1.3, ease: "back.inOut(1.4)", duration: 0.5 });
        }
      },
      widthExpand: {
        label: "Width Expand",
        ease: "back.inOut(1.4)",
        duration: 0.5,
        code: `gsap.to(".element", {
  scaleX: 1.5,
  ease: "back.inOut(1.4)",
  duration: 0.5
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scaleX: 1.5, ease: "back.inOut(1.4)", duration: 0.5 });
        }
      },
      rotate: {
        label: "Rotate",
        ease: "back.inOut(1.7)",
        duration: 0.6,
        code: `gsap.to(".element", {
  rotation: 180,
  ease: "back.inOut(1.7)",
  duration: 0.6
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { rotation: 180, ease: "back.inOut(1.7)", duration: 0.6 });
        }
      },
      morphColor: {
        label: "Morph Color",
        ease: "power2.inOut",
        duration: 0.4,
        code: `gsap.to(".element", {
  backgroundColor: "#10b981",
  ease: "power2.inOut",
  duration: 0.4
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { backgroundColor: "#10b981", ease: "power2.inOut", duration: 0.4 });
        }
      }
    }
  },
  hover: {
    label: "HOVER",
    description: "Micro-interactions",
    icon: "◉",
    color: "green",
    variants: {
      subtle: {
        label: "Subtle",
        ease: "power2.out",
        duration: 0.2,
        code: `gsap.to(".element", {
  scale: 1.02,
  ease: "power2.out",
  duration: 0.2
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 1.02, ease: "power2.out", duration: 0.2 });
        }
      },
      playful: {
        label: "Playful",
        ease: "back.out(3)",
        duration: 0.3,
        code: `gsap.to(".element", {
  scale: 1.08,
  ease: "back.out(3)",
  duration: 0.3
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 1.08, ease: "back.out(3)", duration: 0.3 });
        }
      },
      lift: {
        label: "Lift",
        ease: "power2.out",
        duration: 0.25,
        code: `gsap.to(".element", {
  y: -8,
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  ease: "power2.out",
  duration: 0.25
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", ease: "power2.out", duration: 0.25 });
        }
      }
    }
  },
  feedback: {
    label: "FEEDBACK",
    description: "User response signals",
    icon: "⚡",
    color: "orange",
    variants: {
      shake: {
        label: "Error Shake",
        ease: "elastic.out(1, 0.3)",
        duration: 0.5,
        code: `gsap.to(".element", {
  x: 15,
  ease: "elastic.out(1, 0.3)",
  duration: 0.5,
  yoyo: true,
  repeat: 3
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { x: 15, ease: "elastic.out(1, 0.3)", duration: 0.5, yoyo: true, repeat: 3 });
        }
      },
      pulse: {
        label: "Attention Pulse",
        ease: "power2.inOut",
        duration: 0.3,
        code: `gsap.to(".element", {
  scale: 1.1,
  ease: "power2.inOut",
  duration: 0.3,
  yoyo: true,
  repeat: 1
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 1.1, ease: "power2.inOut", duration: 0.3, yoyo: true, repeat: 1 });
        }
      },
      success: {
        label: "Success Bounce",
        ease: "back.out(4) / elastic.out",
        duration: 0.8,
        code: `gsap.timeline()
  .to(".element", { scale: 1.3, ease: "back.out(4)", duration: 0.2 })
  .to(".element", { scale: 1, ease: "elastic.out(1, 0.4)", duration: 0.6 });`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.timeline()
            .to(el, { scale: 1.3, ease: "back.out(4)", duration: 0.2 })
            .to(el, { scale: 1, ease: "elastic.out(1, 0.4)", duration: 0.6 });
        }
      }
    }
  },
  continuous: {
    label: "CONTINUOUS",
    description: "Infinite motion loops",
    icon: "∞",
    color: "purple",
    variants: {
      float: {
        label: "Floating",
        ease: "sine.inOut",
        duration: 2,
        code: `gsap.to(".element", {
  y: -15,
  ease: "sine.inOut",
  duration: 2,
  yoyo: true,
  repeat: -1
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { y: -15, ease: "sine.inOut", duration: 2, yoyo: true, repeat: -1 });
        }
      },
      pulse: {
        label: "Breathing Pulse",
        ease: "sine.inOut",
        duration: 1.5,
        code: `gsap.to(".element", {
  scale: 1.05,
  opacity: 0.8,
  ease: "sine.inOut",
  duration: 1.5,
  yoyo: true,
  repeat: -1
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { scale: 1.05, opacity: 0.8, ease: "sine.inOut", duration: 1.5, yoyo: true, repeat: -1 });
        }
      },
      rotate: {
        label: "Slow Rotate",
        ease: "none",
        duration: 4,
        code: `gsap.to(".element", {
  rotation: 360,
  ease: "none",
  duration: 4,
  repeat: -1
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { rotation: 360, ease: "none", duration: 4, repeat: -1 });
        }
      }
    }
  },
  threeD: {
    label: "3D",
    description: "Perspective transforms",
    icon: "⬒",
    color: "blue",
    variants: {
      flip: {
        label: "Card Flip",
        ease: "power2.inOut",
        duration: 0.6,
        code: `gsap.to(".element", {
  rotateY: 180,
  ease: "power2.inOut",
  duration: 0.6,
  transformPerspective: 1000
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { rotateY: 180, ease: "power2.inOut", duration: 0.6, transformPerspective: 1000 });
        }
      },
      foldDown: {
        label: "Fold Down",
        ease: "power3.out",
        duration: 0.5,
        code: `gsap.from(".element", {
  rotateX: -90,
  ease: "power3.out",
  duration: 0.5,
  transformOrigin: "top center",
  transformPerspective: 800
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.from(el, {
            rotateX: -90,
            ease: "power3.out",
            duration: 0.5,
            transformOrigin: "top center",
            transformPerspective: 800
          });
        }
      },
      tilt: {
        label: "Tilt",
        ease: "power2.out",
        duration: 0.4,
        code: `gsap.to(".element", {
  rotateX: 10,
  rotateY: -10,
  ease: "power2.out",
  duration: 0.4,
  transformPerspective: 1000
});`,
        animate: (el: HTMLElement, gsap: any) => {
          gsap.to(el, { rotateX: 10, rotateY: -10, ease: "power2.out", duration: 0.4, transformPerspective: 1000 });
        }
      }
    }
  },
  stagger: {
    label: "STAGGER",
    description: "Sequential cascades",
    icon: "≡",
    color: "pink",
    variants: {
      cascade: {
        label: "Cascade Down",
        ease: "back.out(1.7)",
        duration: 0.5,
        code: `gsap.from(".items", {
  y: 40,
  opacity: 0,
  ease: "back.out(1.7)",
  duration: 0.5,
  stagger: 0.08
});`,
        isStagger: true
      },
      scaleIn: {
        label: "Scale Stagger",
        ease: "back.out(1.7)",
        duration: 0.4,
        code: `gsap.from(".items", {
  scale: 0,
  opacity: 0,
  ease: "back.out(1.7)",
  duration: 0.4,
  stagger: 0.1
});`,
        isStagger: true
      },
      wave: {
        label: "Wave Effect",
        ease: "sine.inOut",
        duration: 0.6,
        code: `gsap.to(".items", {
  y: -20,
  ease: "sine.inOut",
  duration: 0.6,
  stagger: { each: 0.1, yoyo: true, repeat: 1 }
});`,
        isStagger: true
      }
    }
  }
};

type PatternKey = keyof typeof PATTERNS;

export default function GSAPTutorial() {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('entering');
  const [selectedVariant, setSelectedVariant] = useState<string>('fadeUp');
  const [showCode, setShowCode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [yoyo, setYoyo] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const staggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load GSAP
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).gsap) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
      script.onload = () => setGsapLoaded(true);
      document.head.appendChild(script);
    } else if ((window as any).gsap) {
      setGsapLoaded(true);
    }
  }, []);

  const currentPattern = PATTERNS[selectedPattern];
  const currentVariant = currentPattern.variants[selectedVariant as keyof typeof currentPattern.variants];

  const resetBox = () => {
    if (!gsapLoaded || typeof window === 'undefined') return;
    const gsap = (window as any).gsap;

    gsap.killTweensOf(boxRef.current);
    gsap.killTweensOf(staggerRefs.current);

    gsap.set(boxRef.current, {
      x: 0, y: 0, scale: 1, scaleX: 1, rotation: 0, rotateX: 0, rotateY: 0,
      opacity: 1, backgroundColor: "#00ffff", borderRadius: "16px",
      boxShadow: "0 0 40px rgba(0, 255, 255, 0.5)", transformOrigin: "center center"
    });

    staggerRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { x: 0, y: 0, scale: 1, opacity: 1, backgroundColor: "#00ffff" });
      }
    });
  };

  const playAnimation = () => {
    if (!gsapLoaded || !currentVariant || isPlaying || typeof window === 'undefined') return;

    setIsPlaying(true);
    resetBox();

    setTimeout(() => {
      const gsap = (window as any).gsap;

      // Yoyo settings
      const yoyoSettings = yoyo ? { yoyo: true, repeat: 1 } : {};

      if (currentVariant.isStagger) {
        const els = staggerRefs.current.filter(Boolean);

        if (selectedVariant === 'cascade') {
          gsap.from(els, { y: 40, opacity: 0, ease: "back.out(1.7)", duration: 0.5, stagger: 0.08, ...yoyoSettings });
        } else if (selectedVariant === 'scaleIn') {
          gsap.from(els, { scale: 0, opacity: 0, ease: "back.out(1.7)", duration: 0.4, stagger: 0.1, ...yoyoSettings });
        } else if (selectedVariant === 'wave') {
          gsap.to(els, { y: -20, ease: "sine.inOut", duration: 0.6, stagger: { each: 0.1, yoyo: true, repeat: 1 } });
        }
      } else if (currentVariant.animate) {
        // For non-stagger animations, we need to wrap them to add yoyo
        if (yoyo) {
          const el = boxRef.current!;

          // Create a custom animation with yoyo based on variant type
          if (selectedPattern === 'entering') {
            // For entering animations, use fromTo with yoyo
            if (selectedVariant === 'fadeUp') {
              gsap.fromTo(el,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, ease: "back.out(1.7)", duration: 0.5, yoyo: true, repeat: 1 }
              );
            } else if (selectedVariant === 'fadeScale') {
              gsap.fromTo(el,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.5, yoyo: true, repeat: 1 }
              );
            } else if (selectedVariant === 'slideRight') {
              gsap.fromTo(el,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, ease: "power3.out", duration: 0.5, yoyo: true, repeat: 1 }
              );
            } else if (selectedVariant === 'popIn') {
              gsap.fromTo(el,
                { scale: 0 },
                { scale: 1, ease: "elastic.out(1, 0.5)", duration: 0.8, yoyo: true, repeat: 1 }
              );
            }
          } else if (selectedPattern === 'transform') {
            // For transform animations
            if (selectedVariant === 'expand') {
              gsap.to(el, { scale: 1.3, ease: "back.inOut(1.4)", duration: 0.5, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'widthExpand') {
              gsap.to(el, { scaleX: 1.5, ease: "back.inOut(1.4)", duration: 0.5, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'rotate') {
              gsap.to(el, { rotation: 180, ease: "back.inOut(1.7)", duration: 0.6, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'morphColor') {
              gsap.to(el, { backgroundColor: "#10b981", ease: "power2.inOut", duration: 0.4, yoyo: true, repeat: 1 });
            }
          } else if (selectedPattern === 'hover') {
            if (selectedVariant === 'subtle') {
              gsap.to(el, { scale: 1.02, ease: "power2.out", duration: 0.2, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'playful') {
              gsap.to(el, { scale: 1.08, ease: "back.out(3)", duration: 0.3, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'lift') {
              gsap.to(el, { y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", ease: "power2.out", duration: 0.25, yoyo: true, repeat: 1 });
            }
          } else if (selectedPattern === 'threeD') {
            if (selectedVariant === 'flip') {
              gsap.to(el, { rotateY: 180, ease: "power2.inOut", duration: 0.6, transformPerspective: 1000, yoyo: true, repeat: 1 });
            } else if (selectedVariant === 'foldDown') {
              gsap.fromTo(el,
                { rotateX: -90, transformOrigin: "top center", transformPerspective: 800 },
                { rotateX: 0, ease: "power3.out", duration: 0.5, yoyo: true, repeat: 1 }
              );
            } else if (selectedVariant === 'tilt') {
              gsap.to(el, { rotateX: 10, rotateY: -10, ease: "power2.out", duration: 0.4, transformPerspective: 1000, yoyo: true, repeat: 1 });
            }
          } else {
            // For other patterns, just run the regular animation with yoyo added via timeline
            currentVariant.animate(el, gsap);
          }
        } else {
          // Regular animation without yoyo
          currentVariant.animate(boxRef.current!, gsap);
        }
      }

      const duration = yoyo ? currentVariant.duration * 2000 + 500 : currentVariant.duration * 1000 + 500;
      setTimeout(() => setIsPlaying(false), duration);
    }, 50);
  };

  useEffect(() => {
    resetBox();
  }, [selectedPattern, selectedVariant, gsapLoaded]);

  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500 to-cyan-400",
    magenta: "from-fuchsia-500 to-pink-500",
    yellow: "from-yellow-400 to-amber-400",
    green: "from-emerald-400 to-teal-400",
    orange: "from-orange-500 to-rose-500",
    purple: "from-purple-500 to-violet-500",
    blue: "from-blue-500 to-indigo-500",
    pink: "from-pink-500 to-rose-400"
  };

  const glowColorMap: Record<string, string> = {
    cyan: "shadow-cyan-500/50",
    magenta: "shadow-fuchsia-500/50",
    yellow: "shadow-yellow-400/50",
    green: "shadow-emerald-400/50",
    orange: "shadow-orange-500/50",
    purple: "shadow-purple-500/50",
    blue: "shadow-blue-500/50",
    pink: "shadow-pink-500/50"
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden font-[family-name:var(--font-display)]">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10 mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />

      {/* Floating Orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Motion Laboratory</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent inline-block animate-pulse">
              GSAP
            </span>
            <br />
            <span className="text-white/90">Pattern Library</span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
            Interactive reference for mastering animation timing, easing, and motion design patterns
          </p>
        </header>

        {/* Pattern Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-12">
          {Object.entries(PATTERNS).map(([key, pattern]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedPattern(key as PatternKey);
                const firstVariant = Object.keys(pattern.variants)[0];
                setSelectedVariant(firstVariant);
              }}
              className={`
                group relative overflow-hidden rounded-xl p-4
                border-2 transition-all duration-300
                ${selectedPattern === key
                  ? `border-${pattern.color}-500 bg-gradient-to-br ${colorMap[pattern.color]} ${glowColorMap[pattern.color]} shadow-2xl scale-105`
                  : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }
              `}
            >
              <div className="relative z-10">
                <div className="text-3xl mb-2">{pattern.icon}</div>
                <div className={`text-xs font-bold tracking-wider mb-1 ${selectedPattern === key ? 'text-black' : 'text-white'}`}>
                  {pattern.label}
                </div>
              </div>
              {selectedPattern === key && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6 mb-12">
          {/* Variant Selector */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-4">Variants</h3>
              <div className="space-y-2">
                {Object.entries(currentPattern.variants).map(([key, variant]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedVariant(key)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      ${selectedVariant === key
                        ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-lg scale-105'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <div className="font-medium">{variant.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-mono text-white/60 uppercase tracking-wider mb-4">Properties</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-white/40 mb-1 font-mono">EASING</div>
                  <div className="text-sm text-cyan-400 font-mono">{currentVariant?.ease}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-1 font-mono">DURATION</div>
                  <div className="text-sm text-fuchsia-400 font-mono">{currentVariant?.duration}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Stage */}
          <div className="lg:col-span-9">
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Controls Bar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-mono text-white/80">ANIMATION STAGE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {showCode ? <Lock className="w-4 h-4" /> : 'Show Code'}
                  </Button>
                  <Button
                    variant={yoyo ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setYoyo(!yoyo)}
                    className={yoyo
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-lg shadow-purple-500/50"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  >
                    <Repeat className="w-4 h-4 mr-1" />
                    Yoyo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetBox}
                    disabled={isPlaying}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={playAnimation}
                    disabled={isPlaying || !gsapLoaded}
                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white font-bold shadow-lg shadow-cyan-500/50"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    RUN
                  </Button>
                </div>
              </div>

              {/* Animation Stage */}
              <div className="relative p-12 md:p-20 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-black/40 to-transparent">
                {/* Stage Grid */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />

                {currentVariant?.isStagger ? (
                  <div className="flex gap-6 relative z-10">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        ref={(el) => { staggerRefs.current[i] = el; }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold text-xl"
                        style={{
                          backgroundColor: '#00ffff',
                          boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)'
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    ref={boxRef}
                    className="w-32 h-32 rounded-2xl flex items-center justify-center relative z-10"
                    style={{
                      backgroundColor: '#00ffff',
                      boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)'
                    }}
                  >
                    <div className="w-12 h-12 bg-black/20 rounded-full" />
                  </div>
                )}

                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-px h-8 bg-white/20" />
                  <div className="h-px w-8 bg-white/20 -mt-4 ml-auto mr-auto" style={{ width: '32px', marginTop: '-16px', marginLeft: '-16px' }} />
                </div>
              </div>

              {/* Code Display */}
              {showCode && currentVariant?.code && (
                <div className="border-t border-white/10 bg-black/60 backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs font-mono text-white/40 ml-2">script.js</span>
                  </div>
                  <pre className="p-6 overflow-x-auto">
                    <code className="text-sm font-[family-name:var(--font-mono)] text-cyan-400 leading-relaxed">
                      {currentVariant.code}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-3xl mb-3">⟶</div>
              <h3 className="text-lg font-bold text-white mb-2">Invisible → Visible</h3>
              <code className="text-sm text-cyan-400 font-mono">back.out(1.7)</code>
              <p className="text-xs text-white/50 mt-2">Skip anticipation phase</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-fuchsia-500/10 to-transparent backdrop-blur-xl border border-fuchsia-500/20 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-3xl mb-3">◈</div>
              <h3 className="text-lg font-bold text-white mb-2">Visible → Visible</h3>
              <code className="text-sm text-fuchsia-400 font-mono">back.inOut(1.4)</code>
              <p className="text-xs text-white/50 mt-2">Show full journey</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-transparent backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-3xl mb-3">⟵</div>
              <h3 className="text-lg font-bold text-white mb-2">Visible → Invisible</h3>
              <code className="text-sm text-yellow-400 font-mono">power2.in</code>
              <p className="text-xs text-white/50 mt-2">Accelerate out</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-white/30 font-mono">
            Built with GSAP 3.12 • Motion Design System • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

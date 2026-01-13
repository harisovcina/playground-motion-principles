"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Pattern data structure
const PATTERNS = {
  entering: {
    label: "ENTERING",
    description: "Initialization sequence",
    icon: "▶",
    color: "yellow",
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
    description: "Termination sequence",
    icon: "◀",
    color: "red",
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
    description: "State modification",
    icon: "◆",
    color: "orange",
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
    description: "Interaction feedback",
    icon: "●",
    color: "steel",
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
    description: "System response",
    icon: "▲",
    color: "yellow",
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
    description: "Loop operation",
    icon: "⟲",
    color: "concrete",
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
    description: "Spatial transform",
    icon: "◧",
    color: "iron",
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
    description: "Sequential operation",
    icon: "▥",
    color: "steel",
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
  const [editableCode, setEditableCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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
  const currentVariant = currentPattern.variants[selectedVariant as keyof typeof currentPattern.variants] as any;

  const resetBox = () => {
    if (!gsapLoaded || typeof window === 'undefined') return;
    const gsap = (window as any).gsap;

    gsap.killTweensOf(boxRef.current);
    gsap.killTweensOf(staggerRefs.current);

    gsap.set(boxRef.current, {
      x: 0, y: 0, scale: 1, scaleX: 1, rotation: 0, rotateX: 0, rotateY: 0,
      opacity: 1, backgroundColor: "#ffcc00", borderRadius: "2px",
      boxShadow: "0 0 0 2px #ffcc00, 0 0 20px rgba(255, 204, 0, 0.3)", transformOrigin: "center center"
    });

    staggerRefs.current.forEach((ref) => {
      if (ref) {
        gsap.set(ref, { x: 0, y: 0, scale: 1, opacity: 1, backgroundColor: "#ffcc00" });
      }
    });
  };

  const playAnimation = () => {
    if (!gsapLoaded || !currentVariant || isPlaying || typeof window === 'undefined') return;

    setIsPlaying(true);
    resetBox();

    setTimeout(() => {
      const gsap = (window as any).gsap;

      // If code has been edited, execute the custom code
      if (editableCode && editableCode !== currentVariant.code) {
        try {
          // Replace .element with actual element reference
          let codeToExecute = editableCode
            .replace(/gsap\.(from|to|fromTo)\("\.element"/g, (match, method) => {
              if (currentVariant.isStagger) {
                return `gsap.${method}(el`;
              }
              return `gsap.${method}(el`;
            })
            .replace(/gsap\.(from|to|fromTo)\('\.element'/g, (match, method) => {
              if (currentVariant.isStagger) {
                return `gsap.${method}(el`;
              }
              return `gsap.${method}(el`;
            });

          // Create element reference
          const el = currentVariant.isStagger
            ? staggerRefs.current.filter(Boolean)
            : boxRef.current;

          // Execute the code
          eval(codeToExecute);
        } catch (error) {
          console.error('Error executing custom code:', error);
          alert('Error in custom code. Check console for details.');
        }
      } else {
        // Execute original animation
        if (currentVariant.animate) {
          currentVariant.animate(boxRef.current!, gsap);
        }
      }

      const duration = (currentVariant?.duration || 1) * 1000 + 500;
      setTimeout(() => setIsPlaying(false), duration);
    }, 50);
  };

  useEffect(() => {
    resetBox();
    // Reset editable code when variant changes
    if (currentVariant?.code) {
      setEditableCode(currentVariant.code);
      setIsEditing(false);
    }
  }, [selectedPattern, selectedVariant, gsapLoaded]);

  // Initialize editable code on first load
  useEffect(() => {
    if (currentVariant?.code && !editableCode) {
      setEditableCode(currentVariant.code);
    }
  }, [currentVariant]);

  const colorMap: Record<string, string> = {
    yellow: "bg-industrial-yellow",
    red: "bg-industrial-red",
    orange: "bg-industrial-orange",
    steel: "bg-industrial-steel",
    concrete: "bg-industrial-concrete",
    iron: "bg-industrial-iron"
  };

  const borderColorMap: Record<string, string> = {
    yellow: "border-industrial-yellow",
    red: "border-industrial-red",
    orange: "border-industrial-orange",
    steel: "border-industrial-steel",
    concrete: "border-industrial-concrete",
    iron: "border-industrial-iron"
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden font-sans">
      {/* Technical Grid Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 204, 0, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 204, 0, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Diagonal Stripes Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255, 204, 0, 0.3) 10px,
          rgba(255, 204, 0, 0.3) 12px
        )`
      }} />

      {/* Industrial Corner Markers */}
      <div className="fixed top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary opacity-40" />
      <div className="fixed top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary opacity-40" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary opacity-40" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary opacity-40" />

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12">
        {/* Header */}
        <header className="mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-3 md:px-4 py-2 border-l-4 border-primary bg-card">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-[10px] md:text-xs font-mono text-primary tracking-widest uppercase font-bold">TESTING FACILITY</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-none">
            <span className="text-primary block">
              GSAP
            </span>
            <span className="text-foreground/90 block">MOTION SYSTEM</span>
          </h1>

          <div className="border-l-2 border-muted pl-3 md:pl-4">
            <p className="text-xs md:text-base text-muted-foreground max-w-2xl uppercase tracking-wide font-mono">
              ANIMATION PATTERN REFERENCE / TIMING ANALYSIS / EASING FUNCTIONS
            </p>
          </div>
        </header>

        {/* Pattern Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8 md:mb-12">
          {Object.entries(PATTERNS).map(([key, pattern]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedPattern(key as PatternKey);
                const firstVariant = Object.keys(pattern.variants)[0];
                setSelectedVariant(firstVariant);
              }}
              className={`
                group relative overflow-hidden p-4
                border-2 transition-all duration-200
                ${selectedPattern === key
                  ? `${borderColorMap[pattern.color]} ${colorMap[pattern.color]} text-black border-4`
                  : 'border-border bg-card text-foreground hover:border-muted'
                }
              `}
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2 font-bold">{pattern.icon}</div>
                <div className="text-[10px] font-black tracking-widest leading-tight">
                  {pattern.label}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-4 mb-12">
          {/* Variant Selector */}
          <div className="lg:col-span-3">
            <div className="bg-card border-2 border-border p-4 md:p-6">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4 font-bold border-b-2 border-border pb-2">VARIANTS</h3>
              <div className="space-y-2">
                {Object.entries(currentPattern.variants).map(([key, variant]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedVariant(key)}
                    className={`
                      w-full text-left px-3 md:px-4 py-2 md:py-3 transition-all duration-100 border-l-4 font-bold uppercase tracking-wider
                      ${selectedVariant === key
                        ? 'bg-primary text-primary-foreground border-primary text-xs'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted border-transparent text-xs'
                      }
                    `}
                  >
                    <div>{variant.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Stage */}
          <div className="lg:col-span-9">
            <div className="bg-card border-2 border-border overflow-hidden">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 gap-3 border-b-2 border-border bg-secondary">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="text-[10px] md:text-xs font-mono text-foreground font-bold tracking-widest">TESTING STAGE</span>
                  </div>
                  {editableCode && editableCode !== currentVariant?.code && (
                    <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-industrial-orange/20 border-l-2 border-industrial-orange">
                      <span className="text-[9px] md:text-[10px] font-mono text-industrial-orange font-bold tracking-widest">CUSTOM CODE</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    onClick={playAnimation}
                    disabled={isPlaying || !gsapLoaded}
                    className="w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    RUN
                  </Button>
                </div>
              </div>

              {/* Animation Stage */}
              <div className="relative p-6 md:p-12 lg:p-20 min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-black/80">
                {/* Stage Grid */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 204, 0, 0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 204, 0, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }} />

                {currentVariant?.isStagger ? (
                  <div className="flex gap-3 md:gap-6 relative z-10">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        ref={(el) => { staggerRefs.current[i] = el; }}
                        className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-black font-black text-base md:text-xl border-2"
                        style={{
                          backgroundColor: '#ffcc00',
                          borderColor: '#ffcc00',
                          boxShadow: '0 0 0 2px #ffcc00, 0 0 20px rgba(255, 204, 0, 0.3)'
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    ref={boxRef}
                    className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative z-10 border-2"
                    style={{
                      backgroundColor: '#ffcc00',
                      borderColor: '#ffcc00',
                      boxShadow: '0 0 0 2px #ffcc00, 0 0 20px rgba(255, 204, 0, 0.3)'
                    }}
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-black border-2 border-black" />
                  </div>
                )}

                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-px h-12 bg-primary/40" />
                  <div className="h-px w-12 bg-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Code Display */}
              {showCode && currentVariant?.code && (
                <div className="border-t-2 border-border bg-black">
                  <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border bg-secondary">
                    <span className="text-xs font-mono text-primary font-bold tracking-widest">SCRIPT.JS</span>
                    <div className="flex gap-2">
                      {!isEditing && editableCode !== currentVariant.code && (
                        <button
                          onClick={() => {
                            setEditableCode(currentVariant.code);
                          }}
                          className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                          RESET
                        </button>
                      )}
                      {isEditing ? (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="text-xs font-mono font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                        >
                          SAVE
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                          EDIT
                        </button>
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editableCode}
                      onChange={(e) => setEditableCode(e.target.value)}
                      className="w-full p-4 md:p-6 bg-black text-primary font-mono text-xs md:text-sm leading-relaxed font-bold resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
                      spellCheck={false}
                    />
                  ) : (
                    <pre className="p-4 md:p-6 overflow-x-auto">
                      <code className="text-xs md:text-sm font-mono text-primary leading-relaxed font-bold">
                        {editableCode || currentVariant.code}
                      </code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 border-t-2 border-border pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest font-bold">
              GSAP 3.12 MOTION SYSTEM
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-widest font-bold">
              {new Date().getFullYear()} TESTING FACILITY
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

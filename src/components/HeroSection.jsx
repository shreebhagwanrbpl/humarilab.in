"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import laboratoryHeroBanner from "../components/img/laboratory_hero_banner.png";
import {
  ArrowRight,
  Boxes,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { parseMediaFromData } from "@/lib/admin-api";

export default function HeroSection({ city = "", initialData = null }) {
  const [heroContent, setHeroContent] = useState(
    initialData || {
      title: "",
      description: "",
      button1Text: "",
      button2Text: "",
    }
  );

  const [isLoading, setIsLoading] = useState(!initialData);
  const [mediaList, setMediaList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const videoRef = useRef(null);

  const SLIDE_DURATION = 3500; // 3.5 seconds per slide

  // Fetch SQLite Admin home data
  useEffect(() => {
    let isMounted = true;
    const loadHeroContent = async () => {
      try {
        const res = await fetch("/api/site-data?type=home");
        if (res.ok) {
          const json = await res.json();
          if (json?.data && isMounted) {
            const data = json.data;

            setHeroContent({
              title: data.title || "",
              description: data.description || "",
              button1Text: data.button1Text || "",
              button2Text: data.button2Text || "",
            });

            const parsedMedia = parseMediaFromData(data);
            setMediaList(parsedMedia);
          }
        }
      } catch (error) {
        console.error("Failed to load home hero content:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadHeroContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Slides array (Gracefully falls back to default local laboratory banner if no media exists)
  const slides = useMemo(() => {
    return mediaList.length > 0
      ? mediaList
      : [
        {
          id: "default-local-banner",
          type: "image",
          url: laboratoryHeroBanner,
          name: "Biomedical Laboratory",
        },
      ];
  }, [mediaList]);

  const safeCurrentSlide = currentSlide >= slides.length ? 0 : currentSlide;
  const activeMedia = slides[safeCurrentSlide] || slides[0];

  // Next / Previous slide actions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setProgress(0);
  }, []);

  // Auto-play timer (Clean interval that always cycles through all slides)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  // Smooth progress bar indicator
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const intervalTime = 40;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, intervalTime);

    return () => clearInterval(progTimer);
  }, [isPaused, slides.length, safeCurrentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (slides.length <= 1) return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length, nextSlide, prevSlide]);

  // Touch Swipe Handling for Mobile Devices
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) nextSlide();
    if (distance < -45) prevSlide();
  };

  // District / City Routing (Static destination URLs)
  const districtSlug = city
    ? city.toLowerCase().replace(/\s+/g, "-")
    : "";

  const makeLink = (path) => {
    if (!path) return "/";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return districtSlug ? `/${districtSlug}${cleanPath}` : cleanPath;
  };

  const button1Url = makeLink("/items");
  const button2Url = makeLink("/contact");

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#F8F5F2] to-[#F3ECE6] py-6 sm:py-8 lg:py-10 border-b border-[#EADBC8]/70"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero Section and Media Showcase"
    >
      {/* Subtle Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#B08968]/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#6F4E37]/8 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* ========================================================================= */}
          {/* 1. LEFT COLUMN: LARGER TYPOGRAPHY, ENLARGED DATA & SIDE-BY-SIDE BUTTONS   */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center"
          >
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 bg-[#EADBC8] text-[#6F4E37] border border-[#D6C0A8] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs mb-4 w-fit">
              <ShieldCheck size={16} className="text-[#6F4E37]" />
              <span>Biomedical Product Marketplace</span>
            </div>

            {/* Dynamic Title (Enlarged and bold) */}
            {isLoading ? (
              <div className="space-y-2.5 py-1">
                <div className="h-9 sm:h-11 bg-[#EADBC8]/60 rounded-xl animate-pulse w-[94%]" />
                <div className="h-9 sm:h-11 bg-[#EADBC8]/60 rounded-xl animate-pulse w-[75%]" />
              </div>
            ) : heroContent.title ? (
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold leading-[1.15] tracking-tight text-[#222222]">
                {heroContent.title}
                {city && (
                  <span className="block text-xl sm:text-2xl lg:text-3xl text-[#6F4E37] font-bold mt-1.5">
                    serving {city}
                  </span>
                )}
              </h1>
            ) : null}

            {/* Dynamic Description (Enlarged text) */}
            {isLoading ? (
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-[#EADBC8]/40 rounded animate-pulse w-full" />
                <div className="h-4 bg-[#EADBC8]/40 rounded animate-pulse w-[88%]" />
              </div>
            ) : heroContent.description ? (
              <p className="mt-4 text-[#4B5563] text-sm sm:text-base lg:text-[16.5px] leading-relaxed">
                {heroContent.description}
                {city
                  ? ` Availability and enquiries can be arranged for ${city}.`
                  : ""}
              </p>
            ) : null}

            {/* Dynamic Action Buttons - STRICTLY SIDE BY SIDE */}
            <div className="flex flex-row items-center gap-3.5 sm:gap-4 mt-6 w-full">
              {heroContent.button1Text && (
                <Link href={button1Url} className="shrink-0">
                  <button className="group inline-flex items-center justify-center gap-2.5 bg-[#6F4E37] hover:bg-[#4E342E] text-white px-6 sm:px-7 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md shadow-[#6F4E37]/25 transition-all duration-300 hover:scale-[1.03] active:scale-95 whitespace-nowrap">
                    <span>{heroContent.button1Text}</span>
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </Link>
              )}

              {heroContent.button2Text && (
                <Link href={button2Url} className="shrink-0">
                  <button className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base border-2 border-[#6F4E37] text-[#6F4E37] bg-white hover:bg-[#F3ECE6] shadow-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 whitespace-nowrap">
                    <span>{heroContent.button2Text}</span>
                    <Boxes size={17} />
                  </button>
                </Link>
              )}
            </div>

            {/* Feature Chips */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-7 pt-4 border-t border-[#EADBC8]/70">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6F4E37] font-bold">
                <CheckCircle2 size={16} className="text-[#6F4E37]" />
                <span>Multi-Category</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6F4E37] font-bold">
                <CheckCircle2 size={16} className="text-[#6F4E37]" />
                <span>Multi-Brand</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6F4E37] font-bold">
                <CheckCircle2 size={16} className="text-[#6F4E37]" />
                <span>B2B Sourcing</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* 2. RIGHT COLUMN: ENLARGED & PROMINENT CAROUSEL MEDIA STAGE               */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 xl:col-span-7 flex flex-col items-center w-full"
          >
            {/* The Main Enlarged Media Frame */}
            <div className="relative w-full rounded-[26px] sm:rounded-[32px] overflow-hidden border-2 border-[#EADBC8] bg-white shadow-[0_20px_50px_rgba(111,78,55,0.15)] aspect-[16/10] sm:aspect-[16/9.5] lg:aspect-[16/9] min-h-[300px] sm:min-h-[360px] lg:min-h-[390px] xl:min-h-[420px] group select-none">

              <AnimatePresence initial={false}>
                <motion.div
                  key={activeMedia?.url?.src || activeMedia?.url || safeCurrentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full bg-white flex items-center justify-center"
                >
                  {activeMedia?.type === "video" ? (
                    <video
                      ref={videoRef}
                      key={activeMedia.url}
                      src={activeMedia.url}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  ) : typeof activeMedia?.url === "string" ? (
                    <img
                      key={activeMedia.url}
                      src={activeMedia.url}
                      alt={heroContent.title || "Biomedical Healthcare Products"}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : typeof activeMedia?.url === "object" ? (
                    <Image
                      src={activeMedia.url}
                      alt={heroContent.title || "Biomedical Healthcare Products"}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#F8F5F2] via-[#EADBC8]/40 to-[#D6C0A8]/30" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Floating Top Badge on Media Frame */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#EADBC8] shadow-sm">
                {activeMedia?.type === "video" ? (
                  <>
                    <Video size={13} className="text-rose-600 animate-pulse" />
                    <span className="text-xs font-bold text-[#6F4E37]">Video Slide</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={13} className="text-[#6F4E37]" />
                    <span className="text-xs font-bold text-[#6F4E37]">Featured Product</span>
                  </>
                )}
                <span className="text-xs text-[#6B7280] font-semibold ml-1 pl-2 border-l border-[#EADBC8]">
                  {safeCurrentSlide + 1} / {slides.length}
                </span>
              </div>

              {/* Floating Frame Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#EADBC8] shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Previous Slide"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#EADBC8] shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Next Slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Bottom Integrated Progress Bar inside Frame */}
              {slides.length > 1 && (
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/10 z-20">
                  <div
                    className="h-full bg-[#6F4E37] transition-all ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Strip & Navigation Bar below Media Frame */}
            {slides.length > 1 && (
              <div className="w-full mt-3.5 flex items-center justify-between gap-3 px-1">
                {/* Thumbnails Row */}
                <div className="flex items-center gap-2.5 overflow-x-auto custom-scrollbar py-1 max-w-[75%] sm:max-w-[80%]">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Jump to slide ${idx + 1}`}
                      title={slide.name || `Slide ${idx + 1}`}
                      className={`relative shrink-0 w-14 sm:w-16 h-9 sm:h-10 rounded-xl overflow-hidden border-2 transition-all duration-300 ${safeCurrentSlide === idx
                        ? "border-[#6F4E37] ring-2 ring-[#6F4E37]/35 scale-105 shadow-sm"
                        : "border-[#EADBC8] opacity-60 hover:opacity-100"
                        }`}
                    >
                      {slide.type === "video" ? (
                        <div className="relative w-full h-full bg-[#4E342E] flex items-center justify-center text-white">
                          <video
                            src={slide.url}
                            muted
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <Video size={12} className="relative z-10 text-white" />
                        </div>
                      ) : typeof slide.url === "object" ? (
                        <Image
                          src={slide.url}
                          alt={`Thumb ${idx + 1}`}
                          fill
                          sizes="70px"
                          className="object-cover"
                        />
                      ) : (
                        <img
                          src={slide.url}
                          alt={`Thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Controls: Play/Pause & Sound */}
                <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-xl border border-[#EADBC8] shadow-xs shrink-0">
                  {/* Sound Toggle (if video) */}
                  {activeMedia?.type === "video" && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded-lg text-[#6F4E37] hover:bg-[#EADBC8] transition-colors"
                      title={isMuted ? "Unmute Video" : "Mute Video"}
                    >
                      {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-emerald-700 animate-pulse" />}
                    </button>
                  )}

                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    aria-label={isPaused ? "Play Auto-play" : "Pause Auto-play"}
                    className="p-1 rounded-lg text-[#6F4E37] hover:bg-[#EADBC8] transition-colors"
                    title={isPaused ? "Resume auto-play" : "Pause auto-play"}
                  >
                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                </div>
              </div>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
}
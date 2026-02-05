import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquareText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

type Testimonial = {
  id: string;
  role: string;
  context: string;
  quote: string;
  highlight?: string;
};

const TestimonialsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo<Testimonial[]>(
    () => [],
    []
  );

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const clamped = Math.max(0, Math.min(index, Math.max(0, items.length - 1)));
    const target = el.querySelector<HTMLElement>(`[data-testi='${items[clamped]?.id ?? ''}']`);
    target?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    setActiveIndex(clamped);
  };

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => scrollToIndex(activeIndex + 1);

  return (
    <section className="w-full py-20 md:py-24 px-4 bg-gradient-to-b from-white to-slate-50 shrink-0">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-slate-200 shadow-sm text-slate-700 font-bold text-xs uppercase tracking-wider mb-5">
            <MessageSquareText size={16} className="text-[#F36F21]" />
            <span>Trải nghiệm</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Sinh viên dùng ResMap nói gì?
          </h2>
          <p className="text-slate-500 font-medium">
            Mục này sẽ được cập nhật khi có phản hồi thực tế từ sinh viên.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur px-6 py-10 md:px-10 md:py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-orange-50 grid place-items-center text-[#F36F21]">
              <MessageSquareText size={22} />
            </div>
            <p className="text-slate-800 font-bold text-lg">Chưa có testimonials</p>
            <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
              Khi bạn có feedback (ẩn danh hoặc có tên), mình sẽ giúp thiết kế carousel này thành một khối social proof nổi bật nhưng vẫn tinh tế.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-bold text-slate-700">{activeIndex + 1}/{items.length}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 grid place-items-center transition-colors disabled:opacity-40"
                  disabled={activeIndex <= 0}
                  aria-label="Xem phản hồi trước"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 grid place-items-center transition-colors disabled:opacity-40"
                  disabled={activeIndex >= items.length - 1}
                  aria-label="Xem phản hồi tiếp theo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
            >
              {items.map((t) => (
                <article
                  key={t.id}
                  data-testi={t.id}
                  className="min-w-[86%] sm:min-w-[64%] lg:min-w-[48%] snap-center rounded-3xl border border-slate-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{t.role}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-700">{t.context}</div>
                    </div>
                    {t.highlight ? (
                      <span className="shrink-0 rounded-full bg-orange-50 text-[#F36F21] border border-orange-100 px-3 py-1 text-xs font-black">
                        {t.highlight}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-slate-800 text-base leading-relaxed font-medium">“{t.quote}”</p>
                </article>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {items.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === activeIndex ? 'w-8 bg-[#F36F21]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Chuyển tới phản hồi ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;

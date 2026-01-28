import React from 'react';
import { ArrowDown, ChevronRight, Sparkles } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { STEPS_DATA } from '../data/stepsData';

interface TopicCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon, title, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer p-6 md:p-6 lg:p-10 rounded-2xl border border-gray-200 hover:border-[#F36F21] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white text-center flex flex-col items-center justify-center gap-4 md:gap-4 h-32 md:h-40 lg:h-48">
    <div className="text-[#F36F21] transition-transform group-hover:scale-110 duration-300">
      {icon}
    </div>
    <h3 className="font-bold text-xs md:text-xs lg:text-base text-gray-800">{title}</h3>
  </div>
);

const HeroSection: React.FC<{ selectedTopic: string | null; setSelectedTopic: (topic: string) => void }> = ({ selectedTopic, setSelectedTopic }) => {
  return (
    <section className="h-auto w-full flex flex-col items-center justify-center pt-32 lg:pt-40 pb-12 px-4 relative bg-white shrink-0">
      {/* Research How-To (Overview) */}
      <div className="max-w-6xl w-full mb-14 lg:mb-16 mt-4 lg:mt-0">
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#F36F21] font-bold text-xs uppercase tracking-wider mb-5 border border-orange-100">
            <Sparkles size={16} />
            <span>Research How-To</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] text-gray-900">
            Quy trình nghiên cứu <span className="text-[#F36F21]">trong 6 bước</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-lg font-medium max-w-3xl mx-auto px-4">
            Nắm lộ trình tổng quát trước khi chọn khối ngành. Sau đó, hệ thống sẽ mở hướng dẫn chi tiết theo từng khối.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 md:gap-3 pb-2 md:pb-0">
              {STEPS_DATA.map((step) => (
                <div
                  key={step.id}
                  className="min-w-[240px] md:min-w-0 md:flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-700 group-hover:border-orange-200 group-hover:text-[#F36F21] transition-colors">
                        {step.stepNumber}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#F36F21] transition-colors">
                        Step
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#F36F21] transition-colors" />
                  </div>
                  <h3 className="font-black text-base md:text-sm lg:text-base text-slate-900 mb-2 group-hover:text-[#F36F21] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-xs lg:text-sm leading-relaxed line-clamp-3">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Major Group Selection */}
      <div className="max-w-5xl w-full text-center mb-12 lg:mb-16">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 lg:mb-10 leading-[1.1] text-gray-900">
          Bạn thuộc khối ngành nào <br />
          <span className="text-[#F36F21]">tại FPTU?</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-lg lg:text-xl font-medium px-4">
          Chọn khối ngành để mở hướng dẫn chi tiết theo 6 bước
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl w-full">
        {TOPICS.map((topic, idx) => (
          <TopicCard 
            key={idx} 
            icon={topic.icon} 
            title={topic.title}
            onClick={() => setSelectedTopic(topic.title)}
          />
        ))}
      </div>

      <div className="w-full text-center mt-12 md:mt-16 hidden md:block">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {selectedTopic ? 'Kéo xuống để xem 6 bước chi tiết' : 'Chọn khối ngành để mở 6 bước chi tiết'}
        </p>
        <div className={`animate-bounce flex justify-center ${selectedTopic ? 'text-gray-300' : 'text-gray-300 opacity-60'}`}>
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

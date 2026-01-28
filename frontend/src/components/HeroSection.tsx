import React from 'react';
import { ArrowDown } from 'lucide-react';
import { TOPICS } from '../data/topics';

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
      <div className="max-w-5xl w-full text-center mb-12 lg:mb-16 mt-4 lg:mt-0">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8 lg:mb-10 leading-[1.1] text-gray-900">
          Bạn thuộc khối ngành nào <br />
          <span className="text-[#F36F21]">tại FPTU?</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-lg lg:text-xl font-medium px-4">
          Lộ trình nghiên cứu được may đo riêng cho từng chuyên ngành
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
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Khám phá bộ research starter kit</p>
        <div className="animate-bounce flex justify-center text-gray-300">
            <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
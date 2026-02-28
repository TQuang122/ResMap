import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TOPICS } from '../data/topics';
import { STEPS_BY_TOPIC } from '../data/stepsByTopic';
import { StepFullData } from '../types';
import StepLayout from '../components/StepLayout';
import ResearchProcessIntro from '../components/ResearchProcessIntro';
import AcademicGridBackground from '../components/ui/AcademicGridBackground';
import Footer from '../components/Footer';
import ResearchSuggestionModal from '../components/research/ResearchSuggestionModal';
import AiUsageModal from '../components/research/AiUsageModal';
import ResExploreModal from '../components/research/ResExploreModal';
import ResBlueprintModal from '../components/research/ResBlueprintModal';
import PaperHunterModal from '../components/tools/PaperHunter';
import Step0ExerciseModal from '../components/research/Step0ExerciseModal';
import { ALL_LECTURERS } from '../data/lecturers';

// Modal types
type ModalType = 'resExplore' | 'researchSuggestion' | 'aiUsage' | 'paperHunter' | 'resBlueprint' | 'step0Exercise' | null;

const TopicCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({ icon, title, onClick }) => {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|$/g, '');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-testid={`topic-card-${slug}`}
      className="cursor-pointer p-6 md:p-6 lg:p-10 rounded-2xl border border-gray-200 hover:border-[#F36F21] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 bg-white text-center flex flex-col items-center justify-center gap-4 md:gap-4 lg:gap-4 h-32 md:h-40 lg:h-48 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36F21] focus-visible:ring-offset-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Chọn ${title}`}
    >
      <div className="text-[#F36F21] transition-transform group-hover:scale-110 duration-200">{icon}</div>
      <h3 className="font-bold text-xs md:text-base text-gray-800">{title}</h3>
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const ResHowToPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [stepsData, setStepsData] = useState<StepFullData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Close modal handler
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Open modal handlers
  const openResExplore = useCallback(() => {
    setActiveModal('resExplore');
  }, []);

  const openResearchSuggestion = useCallback(() => {
    setActiveModal('researchSuggestion');
  }, []);

  const openAiUsage = useCallback(() => {
    setActiveModal('aiUsage');
  }, []);

  const openPaperHunter = useCallback(() => {
    setActiveModal('paperHunter');
  }, []);

  const openResBlueprint = useCallback(() => {
    setActiveModal('resBlueprint');
  }, []);

  const openStep0Exercise = useCallback(() => {
    setActiveModal('step0Exercise');
  }, []);

  const handleTopicSelect = useCallback((topic: string) => {
    setIsLoading(true);
    const loadData = STEPS_BY_TOPIC[topic];
    if (loadData) {
      loadData().then(m => {
        setStepsData(m.STEPS_DATA);
        setTimeout(() => {
          document.getElementById('research-process-intro')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }).finally(() => setIsLoading(false));
    }
  }, []);

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      const matchingTopic = Object.keys(STEPS_BY_TOPIC).find(t => slugify(t) === topicParam);
      if (matchingTopic && STEPS_BY_TOPIC[matchingTopic]) {
        setIsLoading(true);
        STEPS_BY_TOPIC[matchingTopic]().then(m => {
          setStepsData(m.STEPS_DATA);
          setTimeout(() => {
            document.getElementById('research-process-intro')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }).finally(() => setIsLoading(false));
      }
    }
  }, [searchParams]);

  return (
    <div className="flex-1 w-full min-h-screen bg-white relative">
      <section className="pt-32 lg:pt-40 pb-12 px-4 relative z-10 bg-gradient-to-b from-gray-50 to-white">
        <AcademicGridBackground />
        <motion.div className="max-w-5xl mx-auto text-center mb-12 lg:mb-16 relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 lg:mb-8 leading-[1.1] text-gray-900">
            Bạn thuộc khối ngành nào <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-[length:400%_400%] animate-gradient-normal">tại FPTU?</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-lg lg:text-xl font-medium">Chọn khối ngành để xem hướng dẫn 7 bước</p>
        </motion.div>
        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {TOPICS.map((topic, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <TopicCard icon={topic.icon} title={topic.title} onClick={() => handleTopicSelect(topic.title)} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="text-center mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Kéo xuống để xem chi tiết</p>
          <div className="w-8 h-8 mx-auto mt-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <ArrowDown size={16} className="text-gray-400 animate-bounce" />
          </div>
        </motion.div>
      </section>
      {isLoading ? (
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-black text-gray-900 mb-8">Đang tải...</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </section>
      ) : stepsData.length > 0 ? (
        <div className="pb-20 px-4" id="research-process-intro">
          <ResearchProcessIntro />
          {stepsData.map((step) => (
            <StepLayout
              key={step.id}
              stepData={step}
              onResExploreOpen={openResExplore}
              onResearchSuggestionOpen={openResearchSuggestion}
              onAiUsageOpen={openAiUsage}
              onPaperHunterOpen={openPaperHunter}
              onResBlueprintOpen={openResBlueprint}
              onStep0ExerciseOpen={openStep0Exercise}
            />
          ))}
        </div>
      ) : null}

      {/* Modal Components */}
      <ResearchSuggestionModal isOpen={activeModal === 'researchSuggestion'} onClose={closeModal} />
      <AiUsageModal isOpen={activeModal === 'aiUsage'} onClose={closeModal} />
      <ResExploreModal isOpen={activeModal === 'resExplore'} onClose={closeModal} lecturers={ALL_LECTURERS} />
      <ResBlueprintModal isOpen={activeModal === 'resBlueprint'} onClose={closeModal} />
      <PaperHunterModal isOpen={activeModal === 'paperHunter'} onClose={closeModal} />
      <Step0ExerciseModal isOpen={activeModal === 'step0Exercise'} onClose={closeModal} topicKey={selectedTopic || ''} />
      <Footer />
    </div>
  );
};

export default ResHowToPage;

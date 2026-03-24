'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass, Mountain, Crown, Tent, Clock, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface QuizAnswer {
  [key: string]: string;
}

const ICON_MAP: Record<string, any> = {
  culture: Compass,
  nature: Mountain,
  luxury: Crown,
  adventure: Tent,
  short: Clock,
  long: Clock,
};

export function QuizEngine() {
  const { t, locale } = useLanguage();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) setQuestions(data);
      setDataLoading(false);
    }
    loadQuiz();
  }, []);

  const getRecommendation = () => {
    // Logic based on tags collected in answers
    const values = Object.values(answers);
    if (values.includes('luxury')) return t('quiz.recommendation.luxury');
    if (values.includes('nature')) return t('quiz.recommendation.nature');
    if (values.includes('short')) return t('quiz.recommendation.short');
    return t('quiz.recommendation.classic');
  };

  const handleAnswer = (tag: string) => {
    setAnswers((prev) => ({ ...prev, [step]: tag }));
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setCompleted(true), 300);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quiz',
          name,
          phone: whatsapp,
          preferences: answers,
          tourName: getRecommendation(),
          locale,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Error.');
      }
    } catch (error) {
      console.error('Quiz submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) return null;

  if (!started) {
    return (
      <section className="py-20 bg-pearl-warm uzbek-pattern relative">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-azure/10 text-azure text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('quiz.badge')}
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-dark mb-4">
              {t('quiz.title')}
            </h2>
            <p className="text-text-muted text-lg mb-8">{t('quiz.subtitle')}</p>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-4 rounded-full gold-gradient text-white font-semibold text-lg shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              {t('quiz.start')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  const currentQ = questions[step];

  return (
    <section className="py-20 bg-pearl-warm uzbek-pattern min-h-[600px] flex items-center">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          {!completed && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-text-muted mb-2 font-medium">
                <span>{step + 1} / {questions.length}</span>
                <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full gold-gradient rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-surface rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50 relative"
              >
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-text-dark mb-10 text-center leading-tight italic uppercase tracking-tighter">
                  {locale === 'ru' ? currentQ.question_ru : locale === 'uz' ? currentQ.question_uz : locale === 'es' ? (currentQ.question_es || currentQ.question) : (currentQ.question_en || currentQ.question)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(currentQ.options_js || []).map((option: any, i: number) => {
                    const Icon = ICON_MAP[option.score_tag] || Compass;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option.score_tag)}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:-translate-y-1 ${
                          answers[step] === option.score_tag
                            ? 'border-azure bg-azure/5 shadow-lg'
                            : 'border-gray-100 hover:border-azure/30 hover:shadow-md bg-white'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-azure/5 flex items-center justify-center text-azure mb-4 group-hover:scale-110 transition-transform duration-500">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-lg font-bold text-text-dark block leading-snug italic tracking-tight">
                          {locale === 'ru' ? (option.text_ru || option.text_en) : 
                           locale === 'uz' ? (option.text_uz || option.text_en) : 
                           locale === 'es' ? (option.text_es || option.text_en) : 
                           option.text_en}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-8 flex items-center gap-2 text-text-muted hover:text-azure transition-colors text-sm font-semibold uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('quiz.prev')}
                  </button>
                )}
              </motion.div>
            ) : !submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface rounded-3xl p-8 md:p-12 shadow-2xl text-center relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-text-dark mb-3">
                  {t('quiz.result.title')}
                </h3>
                <p className="text-text-muted text-lg mb-8">
                  {t('quiz.result.subtitle')}
                </p>
                
                <div className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-azure/5 border border-azure/20 text-azure font-extrabold text-xl mb-10 shadow-sm">
                  <Sparkles className="w-6 h-6 text-gold animate-bounce" />
                  {getRecommendation()}
                </div>

                <div className="space-y-4 max-w-md mx-auto p-6 md:p-10 bg-pearl-warm rounded-3xl border border-border shadow-inner">
                  <input
                    type="text"
                    placeholder={t('quiz.form.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-100 focus:border-azure focus:ring-4 focus:ring-azure/10 rounded-xl transition-all shadow-sm text-text-dark font-medium"
                    disabled={loading}
                  />
                  <input
                    type="tel"
                    placeholder={t('quiz.form.whatsapp')}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-gray-100 focus:border-azure focus:ring-4 focus:ring-azure/10 rounded-xl transition-all shadow-sm text-text-dark font-medium"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!name || !whatsapp || loading}
                    className="w-full py-5 mt-4 rounded-xl azure-gradient text-white font-bold text-lg shadow-xl hover:shadow-azure/20 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : t('quiz.result.cta')}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface rounded-3xl p-10 md:p-14 shadow-2xl text-center text-text-dark"
              >
                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8 border-2 border-green-100 shadow-inner">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-text-dark mb-4">
                  {t('quiz.result.thanks').replace('{name}', name)}
                </h3>
                <p className="text-text-muted text-lg max-w-md mx-auto leading-relaxed">
                  {t('quiz.result.contact')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

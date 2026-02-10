import React from 'react';
import useQuestionStore from '../store/useQuestionStore';
import { ProgressBar } from './ProgressBar';
import { Flame, Clock, Zap, CheckCircle } from 'lucide-react';

export const Reviser = () => {
  const { topics, streak, getProgress } = useQuestionStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const revisionQueue = topics.flatMap(t => 
    t.subTopics.flatMap(s => 
      s.questions.filter(q => q.nextRevision && new Date(q.nextRevision) <= today)
    )
  );
  const allQuestions = topics.flatMap(t => t.subTopics.flatMap(s => s.questions));
  const overallProgress = getProgress(allQuestions);

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak */}
        <div className="bg-white border border-[#F5E6CC] p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Flame className="text-[#FF8C00]" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Streak</p>
              <p className="text-2xl font-black text-gray-800">{streak} Days</p>
            </div>
          </div>
          <Zap 
            className={`${streak > 0 ? 'text-[#FF8C00] animate-pulse' : 'text-gray-200'}`} 
            size={28} 
            fill="currentColor" 
          />
        </div>
        {/* Progress */}
        <div className="bg-white border border-[#F5E6CC] p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Overall Sheet Health</p>
          <div className="flex flex-col gap-2">
             <ProgressBar percentage={overallProgress} />
             <span className="text-[11px] text-gray-500 font-medium italic">
                {overallProgress === 100 ? "Mastery Achieved! 🎉" : "Keep pushing, Prince!"}
             </span>
          </div>
        </div>
      </div>
      <div className={`p-5 rounded-2xl border-2 transition-all duration-500 ${
        revisionQueue.length > 0 
          ? 'bg-[#FFFBF0] border-[#FF8C00]/20 shadow-sm' 
          : 'bg-white border-dashed border-[#F5E6CC]'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 font-black flex items-center gap-2 text-sm uppercase tracking-tight">
            <Clock size={18} className={revisionQueue.length > 0 ? 'text-[#FF8C00]' : 'text-gray-400'} /> 
            Daily Revision Queue
          </h3>
          {revisionQueue.length > 0 ? (
            <span className="bg-[#FF8C00] text-white text-[10px] px-2.5 py-1 rounded-full font-black animate-bounce">
              {revisionQueue.length} PENDING
            </span>
          ) : (
            <span className="text-green-500 flex items-center gap-1 text-[10px] font-bold uppercase">
              <CheckCircle size={14} /> All Caught Up
            </span>
          )}
        </div>
        {revisionQueue.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {revisionQueue.map(q => (
              <div 
                key={q.id} 
                className="bg-white border border-[#F5E6CC] p-3 rounded-xl flex justify-between items-center group hover:border-[#FF8C00] hover:shadow-sm transition-all cursor-default"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-[#FF8C00] transition-colors">
                    {q.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Due for review today
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-2 py-1 bg-gray-100 text-gray-500 rounded-md font-black uppercase tracking-tighter">
                    {q.solveMethod}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4 italic">
            Your revision queue is empty. Solve new questions to build your schedule!
          </p>
        )}
      </div>
    </div>
  );
};
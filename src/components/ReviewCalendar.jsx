import React from 'react';
import useQuestionStore from '../store/useQuestionStore';
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon } from 'lucide-react';

export const ReviewCalendar = () => {
  const { topics } = useQuestionStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDates = topics.flatMap(t => 
    t.subTopics.flatMap(st => 
      st.questions.filter(q => q.nextRevision).map(q => new Date(q.nextRevision).toDateString())
    )
  );
  const upcomingReviews = topics.flatMap(t => 
    t.subTopics.flatMap(s => 
      s.questions.filter(q => q.nextRevision && new Date(q.nextRevision) > today)
    )
  ).sort((a, b) => new Date(a.nextRevision) - new Date(b.nextRevision));

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  const weekRange = `${days[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - ${days[6].toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`;

  return (
    <div className="bg-white border border-[#F5E6CC] rounded-3xl p-6 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon size={18} className="text-[#FF8C00]" />
        <h3 className="text-gray-800 font-bold">Review Question Tracker</h3>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <button className="text-gray-400 hover:text-[#FF8C00] transition-colors"><ChevronLeft size={20}/></button>
        <span className="text-sm font-bold text-gray-700">{weekRange}</span>
        <button className="text-gray-400 hover:text-[#FF8C00] transition-colors"><ChevronRight size={20}/></button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <span key={day} className="text-[10px] font-bold text-gray-400 text-center">{day}</span>
        ))}
        {days.map((date, i) => {
          const dateStr = date.toDateString();
          const isToday = dateStr === today.toDateString();
          const hasReview = reviewDates.includes(dateStr);

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`h-1 w-1 rounded-full ${hasReview ? 'bg-[#FF8C00]' : 'bg-transparent'}`} />
              <div className={`
                h-8 w-8 flex items-center justify-center rounded-full text-xs font-bold transition-all
                ${isToday ? 'bg-[#FF8C00] text-white shadow-lg shadow-orange-100' : 'text-gray-600 hover:bg-orange-50 cursor-default'}
              `}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#F5E6CC]">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Upcoming Reviser Questions</h4>
        <div className="space-y-2">
          {upcomingReviews.length > 0 ? (
            upcomingReviews.slice(0, 3).map(q => (
              <div key={q.id} className="flex justify-between items-center p-2.5 bg-[#FDFCF0]/50 border border-[#F5E6CC] rounded-xl hover:border-[#FF8C00] transition-colors">
                <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{q.title}</span>
                <span className="text-[10px] text-[#FF8C00] font-black bg-white px-2 py-0.5 rounded-md border border-orange-100">
                  {new Date(q.nextRevision).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center">
               <span className="text-xs text-gray-400 font-medium italic">No upcoming reviews found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
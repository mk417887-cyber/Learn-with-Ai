import React, { useEffect } from 'react'
import { useState } from 'react'
import { Star, RotateCcw } from 'lucide-react'


const Flashcard = ({ flashcard, onToggleStar }) => {

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
    <div
      className={`relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}
      onClick={handleFlip}
    >

      {/* Front of the card (Question) */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center gap-6 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        {/* Star Button*/}
        <div className='flex items-start justify-between'>
          <div
            className={`bg-slate-50 text-[10px] text-slate-600 rounded-full p-2 hover:bg-slate-100 transition-colors duration-200 cursor-pointer ${flashcard.isStarred ? 'bg-yellow-100' : ''}`}
          >
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(flashcard._id);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200  ${flashcard.starred ?
              'bg-linear-to-br from-emerald-400 to-teal-500'
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              }`}
          >
            <Star
              className="w-4 h-4"
              strokeWidth={2}
              fill={flashcard.isStarred ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
            {flashcard.question}
          </p>
        </div>

        {/* Flip Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Click to reveal answer</span>
        </div>
      </div>

      {/* Back of the card (Answer) */}
      <div
        className="absolute w-full h-full flex flex-col items-center justify-center gap-6 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8"
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >

        {/* Star Button */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(flashcard._id);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${flashcard.isStarred
                ? 'bg-white/30 backdrop-blur-sm text-white border border-white/40'
                : 'bg-white/20 backdrop-blur-sm text-white/70 hover:bg-white/30 hover:text-white hover:border-white/40'}  
        `}
          >
            <Star
              className="w-4 h-4 "
              strokeWidth={2}
              fill={flashcard.isStarred ? 'currentColor' : 'none'}
            />
          </button>
        </div>


        {/* Answer Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-6">
          <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
            {flashcard.answer}
          </p>
        </div>

        {/* Flip Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Click to reveal answer</span>
        </div>
      </div>

    </div>
  </div>

};

export default Flashcard;

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Lightbox = ({ image, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gold p-2 rounded-full transition-colors z-50 bg-black/40"
        aria-label="Close Lightbox"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Prev Button */}
      {hasPrev && (
        <button 
          onClick={onPrev}
          className="absolute left-4 text-white hover:text-gold p-3 rounded-full transition-colors z-50 bg-black/40"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
        <img 
          src={image.src || image.url || image} 
          alt={image.title || "Campus Gallery"} 
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
        {(image.title || image.caption || image.category) && (
          <div className="mt-4 text-center text-white max-w-2xl px-4">
            {image.category && (
              <span className="inline-block bg-gold text-navy-dark text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
                {image.category}
              </span>
            )}
            {image.title && <h4 className="text-xl font-serif font-bold text-amber-100">{image.title}</h4>}
            {image.caption && <p className="text-sm text-slate-300 mt-1">{image.caption}</p>}
          </div>
        )}
      </div>

      {/* Next Button */}
      {hasNext && (
        <button 
          onClick={onNext}
          className="absolute right-4 text-white hover:text-gold p-3 rounded-full transition-colors z-50 bg-black/40"
          aria-label="Next Image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

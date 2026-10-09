import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { Search, Calendar, ArrowRight } from 'lucide-react';

export const NewsList = () => {
  const { news } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Achievement', 'Infrastructure', 'Research', 'Academics', 'Sustainability', 'Convocation', 'Student Achievement'];

  const fullNewsList = (news && news.length > 0) ? news : [];

  const filteredNews = fullNewsList.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            INSTITUTIONAL MEDIA & PRESS
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            University News & Official Bulletins
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans">
            Stay updated with academic milestones, groundbreaking research grants, campus infrastructure inaugurations, and student achievements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Filters & Search */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy text-gold shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search news stories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-gold hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-navy text-gold text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center text-xs text-slate-400 font-serif">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-gold" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-navy group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs font-sans leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/news/${item.id}`}
                  className="inline-flex items-center text-xs font-bold text-gold hover:text-navy transition-colors uppercase tracking-wider"
                >
                  <span>READ FULL STORY</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

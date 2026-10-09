import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useData } from '../../context/DataContext';
import { Calendar, User, ArrowLeft, Share2, CheckCircle2, Bookmark } from 'lucide-react';

export const NewsDetail = () => {
  const { newsId } = useParams();
  const { news } = useData();

  const foundInContext = (news || []).find(n => n.id === newsId);

  const fallbackArticles = [
    {
      id: "news-1",
      title: "Kalpanaaa Education Ranked Top 10 Engineering Institutions Nationally",
      category: "Achievement",
      date: "August 05, 2026",
      author: "University Accreditation Desk",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200",
      summary: "Kalpanaaa Education has been bestowed with prestigious accreditation and ranked among top institutions for academic quality, research output, and 98% placement record.",
      content: [
        "Kalpanaaa Education has achieved a significant milestone by securing a position among the Top 10 Engineering & Technological Institutions in the national university rankings. The award recognizes our commitment to academic excellence, doctorate faculty mentorship, cutting-edge computing infrastructure, and outstanding graduate career outcomes.",
        "The evaluation benchmarked over 500 institutions across parameters including research citations, patent creation, international student diversity, industry laboratory partnerships, and 98% placement placement records. The Vice Chancellor expressed profound gratitude to the faculty, research scholars, and corporate partners who made this national recognition possible.",
        "Looking forward, Kalpanaaa Education is investing ₹15 Crores into expanding our Artificial Intelligence & Quantum Computing Laboratories, ensuring students continue to work on top-tier global technologies."
      ],
      highlights: [
        "Ranked among Top 10 National Engineering Institutions for 2026-2027.",
        "98% campus placement rate across Fortune 500 recruiting partners.",
        "Over 120 research papers published in IEEE and Scopus indexed journals.",
        "₹15 Crore infrastructure expansion grant approved for AI & Cloud labs."
      ]
    }
  ];

  const rawArticle = foundInContext || fallbackArticles.find(n => n.id === newsId) || fallbackArticles[0];

  // Format content as array if string
  const article = {
    ...rawArticle,
    author: rawArticle.author || 'Office of University Communications',
    content: Array.isArray(rawArticle.content)
      ? rawArticle.content
      : [rawArticle.content || rawArticle.summary],
    highlights: rawArticle.highlights || [
      "Official press announcement from Kalpanaaa Education.",
      "Verified research and academic milestone release.",
      "Published in institutional archives for session 2026-2027."
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Article Hero Banner */}
      <div className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            to="/news"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-navy uppercase tracking-wider mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 text-gold" /> Return to All Campus News
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-navy text-gold font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="flex items-center text-slate-500 font-serif">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gold" /> {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-sans">
            <div className="flex items-center space-x-2 text-slate-600">
              <User className="w-4 h-4 text-gold" />
              <span>Published by: <strong>{article.author}</strong></span>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }
              }}
              className="flex items-center text-navy font-bold hover:text-gold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" /> Share Story
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
        
        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-slate-200">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* Executive Summary Box */}
        <div className="p-6 bg-amber-50/60 border-l-4 border-gold rounded-r-2xl text-slate-800 text-sm font-serif italic leading-relaxed shadow-sm">
          "{article.summary}"
        </div>

        {/* Article Paragraphs */}
        <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-sans">
          {article.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Highlights Callout Box */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-serif font-bold text-navy flex items-center">
            <Bookmark className="w-5 h-5 text-gold mr-2" /> Key Highlights & Takeaways
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {article.highlights.map((h, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold mr-2.5 mt-0.5 flex-shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-6 border-t border-slate-200 text-center">
          <Link
            to="/news"
            className="inline-flex items-center bg-navy hover:bg-navy-light text-gold font-bold text-xs px-8 py-3.5 rounded-xl uppercase tracking-wider shadow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Explore More News & Press Releases
          </Link>
        </div>

      </div>
    </div>
  );
};

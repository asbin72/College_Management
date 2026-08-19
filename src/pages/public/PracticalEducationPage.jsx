import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PracticalEducationPage = () => {
  const specializedLabs = [
    {
      title: "NVIDIA AI & GPU Supercomputing Lab",
      desc: "High-density compute clusters equipped with NVIDIA Tensor Core GPUs for training large language models, computer vision systems, and neural networks.",
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
      specs: "24x NVIDIA GPUs &bull; 10 Gbps Interconnect &bull; PyTorch & TensorFlow Environments"
    },
    {
      title: "Bloomberg Financial Analytics Laboratory",
      desc: "Live market analytics floor featuring 24 dual-display Bloomberg terminal consoles for MBA candidates conducting financial forecasting and equity trading.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      specs: "24 Dual-Screen Bloomberg Terminals &bull; Real-time BSE/NSE/NASDAQ Feeds"
    },
    {
      title: "Autonomous Robotics & IoT Innovation Hub",
      desc: "Prototyping facility with 3D printers, laser cutters, drone testing arenas, and embedded ARM Cortex development stations.",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600",
      specs: "Industrial 3D Printers &bull; Drone Test Rig &bull; STM32 / ESP32 Hardware Stations"
    },
    {
      title: "DevOps & Cloud Engineering Sandbox",
      desc: "Isolated private cloud sandbox providing each engineering student with dedicated serverless instances, CI/CD pipelines, and container clusters.",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
      specs: "Kubernetes Clusters &bull; AWS / Azure Cloud Accounts &bull; GitLab CI/CD Runners"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-white text-slate-800 py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.25em] bg-gold/10 px-3.5 py-1.5 rounded-full">
            HANDS-ON LEARNING & PRACTICUM
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy mt-4">
            Practical Education & Research Laboratories
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-sans leading-relaxed">
            State-of-the-art supercomputing facilities, robotics workshops, and real-world industrial sandboxes empowering students to build tangible solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 font-sans">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-gold text-xs font-bold uppercase tracking-widest">EXPERIENTIAL LEARNING</span>
            <h2 className="text-3xl font-serif font-bold text-navy">Building Real-World Software, Hardware & Financial Systems</h2>
            <div className="w-12 h-1 bg-gold rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              We believe engineers and managers learn best by creating. Over 40% of student instructional hours take place in specialized laboratories, hackathons, and corporate internships.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every student completes at least two major industrial capstone projects before graduation, applying classroom concepts to build deployable systems.
            </p>
            <div className="pt-2">
              <Link
                to="/admissions/application"
                className="inline-flex items-center bg-navy hover:bg-navy-light text-gold font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider shadow"
              >
                <span>Join Kalpanaaa Education Today</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
              alt="Practical Education Laboratory"
              className="rounded-2xl shadow-lg border-4 border-slate-100 object-cover w-full h-[380px]"
            />
          </div>
        </div>

        {/* Specialized Laboratories Grid */}
        <div className="space-y-6">
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest">ADVANCED FACILITIES</span>
            <h3 className="text-2xl font-serif font-bold text-navy mt-1">Specialized Computing & Prototyping Hubs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specializedLabs.map((lab, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-gold hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="h-56 overflow-hidden">
                    <img src={lab.img} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h4 className="text-xl font-serif font-bold text-navy group-hover:text-gold transition-colors">{lab.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{lab.desc}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="p-3 bg-slate-50 border rounded-xl text-[11px] font-mono font-bold text-navy">
                    {lab.specs}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

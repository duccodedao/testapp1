
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState, UserProfile, Skill, Project, BlogPost, GalleryItem } from '../types';
import { 
  Github, Linkedin, Twitter, Facebook, Mail, ExternalLink, 
  Menu, X, Code, Briefcase, BookOpen, Image as ImageIcon, MessageSquare 
} from 'lucide-react';

const Portfolio: React.FC = () => {
  const [data, setData] = useState<AppState>({
    profile: {
      name: 'Loading...',
      role: 'Full Stack Developer',
      bio: 'Professional Portfolio under construction.',
      email: '',
      avatarUrl: 'https://picsum.photos/200',
      coverUrl: 'https://picsum.photos/1200/400',
      socials: {}
    },
    skills: [],
    projects: [],
    posts: [],
    gallery: []
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Realtime listeners for public data
    const unsubProfile = onSnapshot(collection(db, 'profile'), (snapshot) => {
      if (!snapshot.empty) {
        setData(prev => ({ ...prev, profile: snapshot.docs[0].data() as UserProfile }));
      }
    });

    const unsubSkills = onSnapshot(query(collection(db, 'skills'), where('visible', '==', true)), (snapshot) => {
      setData(prev => ({ ...prev, skills: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Skill)) }));
    });

    const unsubProjects = onSnapshot(query(collection(db, 'projects'), where('visible', '==', true)), (snapshot) => {
      setData(prev => ({ ...prev, projects: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project)) }));
    });

    const unsubPosts = onSnapshot(query(collection(db, 'posts'), where('visible', '==', true)), (snapshot) => {
      setData(prev => ({ ...prev, posts: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)) }));
    });

    const unsubGallery = onSnapshot(query(collection(db, 'gallery'), where('visible', '==', true)), (snapshot) => {
      setData(prev => ({ ...prev, gallery: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)) }));
    });

    return () => {
      unsubProfile();
      unsubSkills();
      unsubProjects();
      unsubPosts();
      unsubGallery();
    };
  }, []);

  const navLinks = [
    { name: 'About', icon: <Code size={18} />, href: '#about' },
    { name: 'Skills', icon: <Briefcase size={18} />, href: '#skills' },
    { name: 'Projects', icon: <ExternalLink size={18} />, href: '#projects' },
    { name: 'Blog', icon: <BookOpen size={18} />, href: '#blog' },
    { name: 'Gallery', icon: <ImageIcon size={18} />, href: '#gallery' },
    { name: 'Contact', icon: <MessageSquare size={18} />, href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                {data.profile.name.charAt(0)}
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">{data.profile.name}</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a href="/#/admin" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium text-sm">
                Login
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-indigo-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden glass border-b border-slate-200 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    {link.name}
                  </div>
                </a>
              ))}
              <a href="/#/admin" className="block w-full text-center mt-4 px-3 py-3 bg-indigo-600 text-white rounded-md font-medium">
                Admin Portal
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section id="about" className="relative">
          {/* Cover Photo */}
          <div className="h-64 sm:h-96 w-full overflow-hidden bg-slate-200 relative">
            <img 
              src={data.profile.coverUrl || 'https://picsum.photos/1200/400'} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 -mt-24 sm:-mt-32 relative z-10">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                    <img 
                      src={data.profile.avatarUrl || 'https://picsum.photos/400'} 
                      alt={data.profile.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-2">
                    {data.profile.name}
                  </h1>
                  <p className="text-xl text-indigo-600 font-semibold mb-6">
                    {data.profile.role}
                  </p>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-2xl">
                    {data.profile.bio}
                  </p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    {data.profile.socials.github && (
                      <a href={data.profile.socials.github} target="_blank" className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all text-slate-700">
                        <Github size={20} />
                      </a>
                    )}
                    {data.profile.socials.linkedin && (
                      <a href={data.profile.socials.linkedin} target="_blank" className="p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all text-indigo-600">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {data.profile.socials.facebook && (
                      <a href={data.profile.socials.facebook} target="_blank" className="p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all text-blue-600">
                        <Facebook size={20} />
                      </a>
                    )}
                    {data.profile.socials.twitter && (
                      <a href={data.profile.socials.twitter} target="_blank" className="p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-all text-sky-500">
                        <Twitter size={20} />
                      </a>
                    )}
                    <a href={`mailto:${data.profile.email}`} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                      <Mail size={18} />
                      Get In Touch
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Core Skills</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.skills.map((skill) => (
              <div key={skill.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-800">{skill.name}</span>
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{skill.level}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-xs text-slate-400 font-medium tracking-wide uppercase">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
              <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.projects.map((project) => (
                <div key={project.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-56 overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a href={project.link} target="_blank" className="p-4 bg-white rounded-full text-indigo-600 shadow-lg">
                        <ExternalLink size={24} />
                      </a>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-24 max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Latest Insights</h2>
              <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
            </div>
            <p className="text-slate-500 max-w-md">Thoughts, tutorials, and experiences from my professional journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.posts.map((post) => (
              <article key={post.id} className="flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all shadow-sm">
                <div className="w-full sm:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col py-2">
                  <div className="flex items-center gap-3 mb-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-400">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 hover:text-indigo-600 transition-colors cursor-pointer">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-auto">{post.content}</p>
                  <button className="mt-4 text-indigo-600 font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
                    Read More <ExternalLink size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Moments & Inspiration</h2>
              <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {data.gallery.map((item) => (
                <div key={item.id} className="relative group overflow-hidden rounded-2xl">
                  <img src={item.imageUrl} alt={item.caption} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 max-w-4xl mx-auto px-4">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 sm:p-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-700/30 rounded-full -ml-32 -mb-32"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Let's build something amazing</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
                Currently open to new projects and collaborations. Feel free to reach out to discuss your next big idea!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="bg-indigo-700/40 p-6 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                    <Mail size={24} />
                  </div>
                  <h4 className="font-bold mb-1">Email Me</h4>
                  <p className="text-indigo-100 text-sm">{data.profile.email || 'contact@example.com'}</p>
                </div>
                <div className="bg-indigo-700/40 p-6 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="font-bold mb-1">Social Chat</h4>
                  <p className="text-indigo-100 text-sm">Available on LinkedIn & Twitter</p>
                </div>
              </div>

              <form className="space-y-4 max-w-lg mx-auto">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white/20 placeholder:text-white/50 text-white"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white/20 placeholder:text-white/50 text-white"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4} 
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:bg-white/20 placeholder:text-white/50 text-white"
                ></textarea>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-extrabold shadow-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-100">
              {data.profile.name.charAt(0)}
            </div>
            <span className="font-bold text-slate-800 text-lg">{data.profile.name}</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} All Rights Reserved.</p>
          <div className="flex items-center gap-4">
             {data.profile.socials.github && <a href={data.profile.socials.github} className="text-slate-400 hover:text-indigo-600 transition-colors"><Github size={18} /></a>}
             {data.profile.socials.linkedin && <a href={data.profile.socials.linkedin} className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin size={18} /></a>}
             {data.profile.socials.twitter && <a href={data.profile.socials.twitter} className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter size={18} /></a>}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;

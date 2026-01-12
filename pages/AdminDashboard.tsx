
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, setDoc, getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, logout } from '../firebase';
import { 
  UserProfile, Skill, Project, BlogPost, GalleryItem 
} from '../types';
import { 
  LayoutDashboard, User as UserIcon, ListChecks, Briefcase, 
  FileText, Image as ImageIcon, Settings, LogOut, Plus, 
  Trash2, Save, Eye, EyeOff, Upload, ExternalLink, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

type Tab = 'dashboard' | 'profile' | 'skills' | 'projects' | 'blog' | 'gallery';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Data states
  const [profile, setProfile] = useState<UserProfile>({
    name: '', role: '', bio: '', email: '', avatarUrl: '', coverUrl: '', socials: {}
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Listen to all data in admin panel (realtime)
    const unsubProfile = onSnapshot(collection(db, 'profile'), (snap) => {
      if (!snap.empty) setProfile(snap.docs[0].data() as UserProfile);
    });
    const unsubSkills = onSnapshot(collection(db, 'skills'), (snap) => {
      setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill)));
    });
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
    });
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => {
      setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
    });

    return () => {
      unsubProfile(); unsubSkills(); unsubProjects(); unsubPosts(); unsubGallery();
    };
  }, []);

  const handleStatus = (message: string, type: 'success' | 'error' = 'success') => {
    setStatus({ message, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleFileUpload = async (file: File, folder: string) => {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const q = await getDocs(collection(db, 'profile'));
      if (q.empty) {
        await addDoc(collection(db, 'profile'), profile);
      } else {
        await updateDoc(doc(db, 'profile', q.docs[0].id), { ...profile });
      }
      handleStatus("Profile updated successfully!");
    } catch (e: any) {
      handleStatus(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    const newSkill: Omit<Skill, 'id'> = { name: 'New Skill', level: 80, category: 'Technical', visible: true };
    await addDoc(collection(db, 'skills'), newSkill);
  };

  const updateSkill = async (id: string, data: Partial<Skill>) => {
    await updateDoc(doc(db, 'skills', id), data);
  };

  const deleteItem = async (col: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, col, id));
      handleStatus("Item deleted.");
    }
  };

  const renderSidebar = () => {
    const items: { id: Tab, label: string, icon: any }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'profile', label: 'Profile Info', icon: <UserIcon size={20} /> },
      { id: 'skills', label: 'Skills', icon: <ListChecks size={20} /> },
      { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
      { id: 'blog', label: 'Blog Posts', icon: <FileText size={20} /> },
      { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    ];

    return (
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col h-full fixed left-0 top-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <span className="text-white font-bold text-lg tracking-tight">AdminPanel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6 px-4">
            <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
            <div className="text-xs">
              <p className="text-white font-medium truncate w-32">{user.displayName}</p>
              <p className="text-slate-500 truncate w-32">Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header>
              <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Overview</h1>
              <p className="text-slate-500 mt-1">Welcome back, {user.displayName}!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Skills', count: skills.length, icon: <ListChecks />, color: 'bg-blue-500' },
                { label: 'Projects', count: projects.length, icon: <Briefcase />, color: 'bg-purple-500' },
                { label: 'Blog Posts', count: posts.length, icon: <FileText />, color: 'bg-green-500' },
                { label: 'Gallery Items', count: gallery.length, icon: <ImageIcon />, color: 'bg-orange-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
                  <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">View your live portfolio</h3>
                <p className="text-indigo-100 mb-8 max-w-md">Check how your changes look to the public. The portfolio is updated instantly when you save.</p>
                <a href="/" target="_blank" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">
                  Go to Live Site <ExternalLink size={18} />
                </a>
              </div>
              <LayoutDashboard size={200} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-4xl space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Personal Information</h1>
                <p className="text-slate-500 mt-1">Update your basic bio and contact details.</p>
              </div>
              <button 
                onClick={saveProfile}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                Save Changes
              </button>
            </header>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Professional Role</label>
                  <input 
                    type="text" 
                    value={profile.role} 
                    onChange={e => setProfile({...profile, role: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Bio / Introduction</label>
                <textarea 
                  rows={4}
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Profile Avatar URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={profile.avatarUrl} 
                      onChange={e => setProfile({...profile, avatarUrl: e.target.value})}
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <label className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl cursor-pointer hover:bg-slate-200 transition-all flex items-center justify-center">
                      <Upload size={20} />
                      <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, 'avatars');
                          setProfile({...profile, avatarUrl: url});
                        }
                      }} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Cover Image URL</label>
                   <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={profile.coverUrl} 
                      onChange={e => setProfile({...profile, coverUrl: e.target.value})}
                      className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <label className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl cursor-pointer hover:bg-slate-200 transition-all flex items-center justify-center">
                      <Upload size={20} />
                      <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, 'covers');
                          setProfile({...profile, coverUrl: url});
                        }
                      }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Settings size={20} className="text-indigo-600" />
                   Social Connections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['github', 'linkedin', 'facebook', 'twitter'].map(s => (
                    <div key={s} className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s}</label>
                      <input 
                        type="text" 
                        value={(profile.socials as any)[s] || ''} 
                        onChange={e => setProfile({...profile, socials: {...profile.socials, [s]: e.target.value}})}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder={`https://${s}.com/yourname`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-8">
             <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Manage Skills</h1>
                <p className="text-slate-500 mt-1">Add or remove skills displayed in your core section.</p>
              </div>
              <button 
                onClick={addSkill}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add New Skill
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {skills.map(skill => (
                <div key={skill.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 space-y-4">
                      <input 
                        className="text-xl font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-200 focus:outline-none w-full"
                        value={skill.name}
                        onChange={e => updateSkill(skill.id, { name: e.target.value })}
                      />
                      <input 
                        className="text-sm font-medium text-indigo-500 uppercase tracking-widest bg-transparent w-full focus:outline-none"
                        value={skill.category}
                        onChange={e => updateSkill(skill.id, { category: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => updateSkill(skill.id, { visible: !skill.visible })}
                        className={`p-2 rounded-lg ${skill.visible ? 'text-green-500 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                      >
                        {skill.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteItem('skills', skill.id)}
                        className="p-2 text-red-500 bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold text-slate-600">
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={skill.level}
                      onChange={e => updateSkill(skill.id, { level: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
      case 'blog':
      case 'gallery':
        // Generic List Logic for more complex entities
        const collectionName = activeTab === 'projects' ? 'projects' : activeTab === 'blog' ? 'posts' : 'gallery';
        const items = activeTab === 'projects' ? projects : activeTab === 'blog' ? posts : gallery;
        
        return (
          <div className="space-y-8">
             <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                <p className="text-slate-500 mt-1">Control your featured content and visual media.</p>
              </div>
              <button 
                onClick={async () => {
                  let newItem: any = { visible: true };
                  if (activeTab === 'projects') newItem = { ...newItem, title: 'New Project', description: '', imageUrl: 'https://picsum.photos/800/600', link: '', tags: ['React'] };
                  if (activeTab === 'blog') newItem = { ...newItem, title: 'New Post', content: '', imageUrl: 'https://picsum.photos/800/600', category: 'Tech', date: new Date().toLocaleDateString() };
                  if (activeTab === 'gallery') newItem = { ...newItem, caption: 'Memory', imageUrl: 'https://picsum.photos/800/800' };
                  await addDoc(collection(db, collectionName), newItem);
                }}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add New {activeTab.slice(0, -1)}
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item: any) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative group">
                  <div className="h-48 relative overflow-hidden bg-slate-100">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <label className="p-3 bg-white text-indigo-600 rounded-full cursor-pointer shadow-xl">
                          <Upload size={20} />
                          <input type="file" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, collectionName);
                              await updateDoc(doc(db, collectionName, item.id), { imageUrl: url });
                            }
                          }} />
                        </label>
                        <button 
                          onClick={() => deleteItem(collectionName, item.id)}
                          className="p-3 bg-white text-red-600 rounded-full shadow-xl"
                        >
                          <Trash2 size={20} />
                        </button>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <input 
                        className="text-xl font-bold text-slate-900 bg-transparent focus:outline-none w-full"
                        value={item.title || item.caption}
                        onChange={e => updateDoc(doc(db, collectionName, item.id), { [item.title !== undefined ? 'title' : 'caption']: e.target.value })}
                        placeholder="Item Title"
                      />
                      <button 
                        onClick={() => updateDoc(doc(db, collectionName, item.id), { visible: !item.visible })}
                        className={`p-2 rounded-lg ${item.visible ? 'text-green-500 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                      >
                        {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {item.description !== undefined && (
                      <textarea 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none"
                        value={item.description}
                        onChange={e => updateDoc(doc(db, collectionName, item.id), { description: e.target.value })}
                        placeholder="Description"
                        rows={2}
                      />
                    )}
                    {item.content !== undefined && (
                      <textarea 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none"
                        value={item.content}
                        onChange={e => updateDoc(doc(db, collectionName, item.id), { content: e.target.value })}
                        placeholder="Body Content"
                        rows={4}
                      />
                    )}
                     {item.link !== undefined && (
                      <div className="flex items-center gap-3 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-xl">
                        <ExternalLink size={16} />
                        <input 
                          className="bg-transparent focus:outline-none w-full"
                          value={item.link}
                          onChange={e => updateDoc(doc(db, collectionName, item.id), { link: e.target.value })}
                          placeholder="Project URL"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {renderSidebar()}
      
      <main className="flex-1 ml-64 p-12 min-h-screen relative">
        {status && (
          <div className={`fixed top-12 right-12 z-[60] px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-12 duration-500 ${
            status.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'
          }`}>
            <p className="font-bold flex items-center gap-3">
              {status.type === 'success' ? <RefreshCw className="animate-spin-slow" size={18} /> : <Trash2 size={18} />}
              {status.message}
            </p>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;

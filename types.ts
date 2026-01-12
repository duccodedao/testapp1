
export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  avatarUrl: string;
  coverUrl: string;
  socials: {
    facebook?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  visible: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
  visible: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  category: string;
  visible: boolean;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  visible: boolean;
}

export interface AppState {
  profile: UserProfile;
  skills: Skill[];
  projects: Project[];
  posts: BlogPost[];
  gallery: GalleryItem[];
}

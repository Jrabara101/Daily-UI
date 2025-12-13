import React, { useState } from 'react';
import { ArrowLeft, Menu, Search, Heart, MessageCircle, Share2, Facebook, Twitter, Instagram, Clock, Calendar, User } from 'lucide-react';

// --- MOCK DATA ---
const POSTS = [
  {
    id: 1,
    title: "Simplicity That Makes My Life Meaningful",
    subtitle: "The cult of Common Projects",
    category: "Lifestyle",
    author: "Elena Fisher",
    date: "Oct 24, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1000",
    layout: "hero",
    theme: "light",
    content: "Minimalism isn't just about white walls and empty spaces; it's a philosophy of curated existence. In a world shouting for attention, silence becomes the ultimate luxury..."
  },
  {
    id: 2,
    title: "Larose Paris Wool Hats",
    subtitle: "The Review",
    category: "Fashion",
    author: "Marc Johnson",
    date: "Oct 22, 2023",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=800",
    layout: "split-right",
    bgColor: "bg-rose-200",
    theme: "dark-text",
    content: "There is something undeniably timeless about a well-structured wool hat. Larose Paris has managed to bridge the gap between vintage charm and modern necessity..."
  },
  {
    id: 3,
    title: "Marcus Anton",
    subtitle: "Interview",
    category: "Music",
    author: "Sarah Lee",
    date: "Oct 20, 2023",
    readTime: "8 min read",
    image: "https://www.schuhkurier.de/wp-content/uploads/2024/01/Marcus-Anton_Goldner.jpeg",
    layout: "split-left",
    bgColor: "bg-white",
    theme: "light",
    content: "Sitting down with Marcus Anton in his dimly lit Berlin studio, you immediately sense the chaotic energy that fuels his latest tracks. 'I don't make music for clarity,' he says..."
  },
  {
    id: 4,
    title: "5 New Albums That Are Playing in Our Office Right Now",
    subtitle: "Pompeya vs Hot Chip",
    category: "Playlist",
    author: "Editorial Team",
    date: "Oct 18, 2023",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    layout: "overlay",
    theme: "dark",
    content: "Music defines the rhythm of our workflow. This week, we're torn between the soothing synth-pop of Pompeya and the electric nostalgia of Hot Chip..."
  },
  {
    id: 5,
    title: "Grooming Like a Monarch",
    subtitle: "Advices",
    category: "Grooming",
    author: "James Bond",
    date: "Oct 15, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800",
    layout: "split-right",
    bgColor: "bg-yellow-200",
    theme: "dark-text",
    content: "The ritual of shaving is lost on the modern man. It has become a chore, a 30-second buzz with an electric razor. Let's reclaim the throne of the morning routine..."
  },
  {
    id: 6,
    title: "Mies and His Interiors",
    subtitle: "Design",
    category: "Architecture",
    author: "Ada Louise",
    date: "Oct 10, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    layout: "split-left",
    bgColor: "bg-white",
    theme: "light",
    content: "God is in the details, or so Mies van der Rohe famously claimed. Looking at his interior sketches, one finds a rigorous discipline that feels almost spiritual..."
  }
];

// --- COMMENTS DATA ---
const COMMENTS = [
  { id: 1, user: "Julian Casablancas", text: "This is exactly the aesthetic I've been looking for. Great read.", time: "2 hours ago", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, user: "Karen O", text: "I disagree with the point about minimalism, but the photos are stunning.", time: "5 hours ago", avatar: "https://i.pravatar.cc/150?u=2" },
];

const Header = () => (
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all duration-300">
    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Menu className="w-6 h-6 text-gray-800" />
    </button>
    <h1 className="font-serif text-2xl tracking-[0.2em] font-bold text-gray-900">BLOG</h1>
    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Search className="w-5 h-5 text-gray-800" />
    </button>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 px-6">
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
      <div>
        <h3 className="font-serif text-xl mb-4 italic">The Blog</h3>
        <p className="text-gray-400 text-sm leading-relaxed">Curated stories on lifestyle, fashion, and design. Dedicated to the aesthetics of everyday life.</p>
      </div>
      <div className="flex flex-col items-center md:items-center">
        <h3 className="font-serif text-lg mb-4 uppercase tracking-widest text-xs">Social</h3>
        <div className="flex space-x-6">
          <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
          <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end">
        <h3 className="font-serif text-lg mb-4 uppercase tracking-widest text-xs">Newsletter</h3>
        <div className="flex border-b border-gray-600 pb-2">
          <input type="email" placeholder="Your email" className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-500 text-white" />
          <button className="text-xs uppercase font-bold tracking-wider hover:text-gray-300">Send</button>
        </div>
      </div>
    </div>
    <div className="mt-12 text-center text-gray-600 text-xs uppercase tracking-widest">
      © 2024 The Blog. All Rights Reserved.
    </div>
  </footer>
);

// --- FEED COMPONENTS ---

const HeroPost = ({ post, onClick }) => (
  <div onClick={onClick} className="cursor-pointer group relative w-full h-[85vh] overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
    
    <div className="relative z-20 text-center px-6 max-w-3xl transform transition-transform duration-500 group-hover:-translate-y-2">
      <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-lg">
        {post.title.split(" ").map((word, i) => 
          word.toLowerCase() === 'that' || word.toLowerCase() === 'my' ? <span key={i} className="font-serif italic font-light">{word} </span> : <span key={i}>{word} </span>
        )}
      </h2>
      <p className="font-sans text-sm md:text-base tracking-[0.2em] text-white uppercase font-bold drop-shadow-md">
        {post.subtitle}
      </p>
    </div>
  </div>
);

const SplitPost = ({ post, onClick, reverse }) => (
  <div onClick={onClick} className={`cursor-pointer group flex flex-col md:flex-row h-auto md:h-[600px] w-full ${reverse ? 'md:flex-row-reverse' : ''}`}>
    {/* Image Side */}
    <div className="w-full md:w-1/2 h-[400px] md:h-full overflow-hidden relative">
      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
    
    {/* Content Side */}
    <div className={`w-full md:w-1/2 p-12 flex flex-col justify-center items-center text-center ${post.bgColor || 'bg-white'}`}>
      <span className="font-serif italic text-xl text-gray-600 mb-4">{post.subtitle}</span>
      <h2 className="font-sans text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-wide leading-tight">
        {post.title}
      </h2>
      <div className="w-12 h-0.5 bg-gray-900 mt-2 mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
      <span className="text-xs font-bold tracking-widest text-gray-500 uppercase border-b border-transparent group-hover:border-gray-900 transition-all pb-1">Read Story</span>
    </div>
  </div>
);

const OverlayPost = ({ post, onClick }) => (
  <div onClick={onClick} className="cursor-pointer group relative w-full h-[600px] overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 bg-gray-900/60 group-hover:bg-gray-900/50 transition-colors duration-500 z-10" />
    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
    
    <div className="relative z-20 text-center px-6 max-w-2xl">
      <h2 className="font-serif text-4xl md:text-6xl text-white mb-4 leading-tight">
        {post.title.split("New").map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && <span className="italic font-light">New</span>}
          </React.Fragment>
        ))}
      </h2>
      <p className="text-gray-200 font-sans mt-4 uppercase tracking-widest text-sm font-semibold">
        {post.subtitle}
      </p>
    </div>
  </div>
);

// --- SINGLE POST VIEW ---

const SinglePost = ({ post, onBack }) => {
  const [likes, setLikes] = useState(124);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(COMMENTS);

  const handleLike = () => {
    setLikes(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: localComments.length + 1,
      user: "You",
      text: commentText,
      time: "Just now",
      avatar: "https://i.pravatar.cc/150?u=99"
    };
    setLocalComments([newComment, ...localComments]);
    setCommentText("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white min-h-screen">
      
      {/* Article Header */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
         <button onClick={onBack} className="absolute top-6 left-6 z-30 p-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full transition-all duration-300 group">
          <ArrowLeft className="w-6 h-6" />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Back to Feed</span>
        </button>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 border border-white/40 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm rounded-sm">
              {post.category}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center space-x-6 text-sm font-medium tracking-wide">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2 opacity-75">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Sidebar (Socials & Meta) */}
        <aside className="md:col-span-2 hidden md:flex flex-col items-center space-y-8 sticky top-24 h-fit">
           <div className="flex flex-col items-center space-y-2">
              <button 
                onClick={handleLike}
                className={`p-3 rounded-full transition-all duration-300 ${liked ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400 hover:text-rose-500'}`}
              >
                <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-xs font-bold text-gray-500">{likes}</span>
           </div>
           
           <div className="w-px h-12 bg-gray-200" />
           
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-blue-500 rounded-full transition-colors">
              <Facebook className="w-5 h-5" />
           </button>
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-sky-500 rounded-full transition-colors">
              <Twitter className="w-5 h-5" />
           </button>
           <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
           </button>
        </aside>

        {/* Main Content */}
        <article className="md:col-span-8 font-serif text-lg leading-relaxed text-gray-800">
          <p className="first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] first-letter:text-gray-900 mb-8">
            {post.content}
          </p>
          <p className="mb-8">
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.
          </p>
          
          <blockquote className="my-12 pl-6 border-l-4 border-gray-900 italic text-2xl text-gray-600">
            "Design is not just what it looks like and feels like. Design is how it works. It creates culture. Culture shapes values. Values determine the future."
          </blockquote>

          <h3 className="font-sans font-bold text-2xl mt-12 mb-6 uppercase tracking-wide">The Aesthetics of Living</h3>
          <p className="mb-6">
            It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000" 
            alt="Interior Detail" 
            className="w-full h-auto my-10 rounded-sm shadow-xl"
          />

          <p className="mb-8">
            The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn't listen. She packed her seven versalia, put her initial into the belt and made herself on the way.
          </p>

          <div className="mt-16 pt-8 border-t border-gray-200">
             <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img src={`https://i.pravatar.cc/150?u=${post.author}`} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm uppercase tracking-widest text-gray-500 mb-1">Written by</h4>
                  <p className="font-serif text-xl font-bold">{post.author}</p>
                </div>
             </div>
          </div>
        </article>

        {/* Right Rail (Tags etc - Placeholder or empty for clean look) */}
        <div className="md:col-span-2 hidden md:block"></div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif text-3xl mb-10 text-center">Discussion ({localComments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-12 relative">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the conversation..." 
              className="w-full p-6 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 min-h-[120px] font-serif resize-none shadow-sm transition-shadow focus:shadow-md"
            />
            <button 
              type="submit" 
              className="absolute bottom-4 right-4 bg-gray-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Post Comment
            </button>
          </form>

          <div className="space-y-8">
            {localComments.map((comment) => (
              <div key={comment.id} className="flex space-x-4 group">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 bg-white p-6 rounded-sm border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold font-sans text-sm uppercase tracking-wider">{comment.user}</h4>
                    <span className="text-xs text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-gray-600 font-serif">{comment.text}</p>
                  <button className="text-xs font-bold text-gray-400 mt-4 hover:text-rose-500 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const BlogFeed = ({ onPostClick }) => {
  return (
    <>
      <Header />
      <main>
        {POSTS.map((post, index) => {
          if (post.layout === 'hero') {
            return <HeroPost key={post.id} post={post} onClick={() => onPostClick(post)} />;
          } else if (post.layout === 'overlay') {
            return <OverlayPost key={post.id} post={post} onClick={() => onPostClick(post)} />;
          } else {
            return (
              <SplitPost 
                key={post.id} 
                post={post} 
                onClick={() => onPostClick(post)} 
                reverse={post.layout === 'split-left'} 
              />
            );
          }
        })}
      </main>
      <Footer />
    </>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentView('post');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('feed');
    setSelectedPost(null);
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-rose-100 selection:text-rose-900">
      {currentView === 'feed' ? (
        <BlogFeed onPostClick={handlePostClick} />
      ) : (
        <SinglePost post={selectedPost} onBack={handleBack} />
      )}
    </div>
  );
}


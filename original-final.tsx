import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Terminal, 
  Code2, 
  Cpu, 
  Briefcase, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronUp, 
  Download, 
  Award, 
  Activity, 
  Send, 
  Layers,
  Brain,
  Globe,
  CheckCircle2,
  Menu,
  X,
  Smartphone,
  GraduationCap,
  Crown,
  Database,
  Server,
  Wrench,
  BookOpen,
  Info
} from 'lucide-react';

/**
 * Custom Style Injector for Pure Black & White Animations, Keyframes and Depth
 */
const CustomStyles = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes subtleGlow {
      0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.08); }
      50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.18); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-modal {
      animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .chess-glow {
      animation: subtleGlow 4s infinite ease-in-out;
    }
    /* Monochrome custom scrollbars */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(9, 9, 11, 0.9);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `}</style>
);

/**
 * ============================================================================
 * NAVBAR CHESS PIECES ANIMATED BACKGROUND COMPONENT (MONOCHROME)
 * ============================================================================
 * Renders floating enlarged chess pieces drifting gracefully across header.
 */
const NavbarChessBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId;

    const chessPieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const pieceCount = 5;
    const pieces = Array.from({ length: pieceCount }, (_, i) => ({
      symbol: chessPieces[i % chessPieces.length],
      x: Math.random() * (canvas.width || 800),
      y: (canvas.height || 64) / 2 + (Math.random() * 12 - 6),
      speed: 0.15 + Math.random() * 0.2, // Ultra-slow drift (~15-25s)
      size: 38 + Math.floor(Math.random() * 10), // Big pieces (38px-48px)
      opacity: 0.10 + Math.random() * 0.16,
      direction: i % 2 === 0 ? 1 : -1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((piece) => {
        piece.x += piece.speed * piece.direction;

        if (piece.direction === 1 && piece.x > canvas.width + 60) {
          piece.x = -60;
          piece.y = (canvas.height || 64) / 2 + (Math.random() * 12 - 6);
        } else if (piece.direction === -1 && piece.x < -60) {
          piece.x = canvas.width + 60;
          piece.y = (canvas.height || 64) / 2 + (Math.random() * 12 - 6);
        }

        ctx.font = `${piece.size}px serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${piece.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(piece.symbol, piece.x, piece.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

/**
 * ============================================================================
 * INTERACTIVE CHESSBOARD BACKGROUND CANVAS (BLACK & WHITE)
 * ============================================================================
 */
const ChessboardBackground = () => {
  const canvasRef = useRef(null);
  
  const mouseRef = useRef({ 
    x: -1000, 
    y: -1000, 
    targetX: -1000, 
    targetY: -1000, 
    isTouching: false 
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const getResponsiveTileSize = (screenWidth) => {
      if (screenWidth < 640) return 56;
      if (screenWidth < 1024) return 76;
      return 96;
    };

    let TILE_SIZE = getResponsiveTileSize(window.innerWidth);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      TILE_SIZE = getResponsiveTileSize(window.innerWidth);
    };

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isTouching = false;
    };

    const handleMouseLeave = () => {
      if (!mouseRef.current.isTouching) {
        mouseRef.current.targetX = -1000;
        mouseRef.current.targetY = -1000;
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
        mouseRef.current.isTouching = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
        mouseRef.current.isTouching = true;
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        mouseRef.current.targetX = -1000;
        mouseRef.current.targetY = -1000;
        mouseRef.current.isTouching = false;
      }, 350);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    handleResize();

    const render = () => {
      const mouse = mouseRef.current;
      
      const lerpSpeed = mouse.isTouching ? 0.22 : 0.15;
      mouse.x += (mouse.targetX - mouse.x) * lerpSpeed;
      mouse.y += (mouse.targetY - mouse.y) * lerpSpeed;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#050505'; 
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / TILE_SIZE);
      const rows = Math.ceil(height / TILE_SIZE);

      const maxGlowRadius = TILE_SIZE * 2.8;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * TILE_SIZE;
          const y = r * TILE_SIZE;
          const centerX = x + TILE_SIZE / 2;
          const centerY = y + TILE_SIZE / 2;

          const isEvenTile = (r + c) % 2 === 0;
          
          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const distance = Math.hypot(dx, dy);

          let glowIntensity = 0;
          if (distance < maxGlowRadius) {
            const normalizedDist = 1 - distance / maxGlowRadius;
            glowIntensity = Math.pow(normalizedDist, 2.2); 
          }

          // Pure Ebony & Dark Charcoal Tiles
          ctx.fillStyle = isEvenTile ? '#0a0a0a' : '#121212';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

          if (glowIntensity > 0.005) {
            // White / Silver highlights on hover
            ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity * 0.14})`;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

            ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

/**
 * ============================================================================
 * TYPEWRITER CHESS TERMINAL INTRO & INTERACTIVE CLI (MONOCHROME)
 * ============================================================================
 */
const TerminalIntro = () => {
  const [displayText, setDisplayText] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const terminalBottomRef = useRef(null);
  const inputRef = useRef(null);

  const terminalLogs = useMemo(() => [
    "> 1. e4 -- Initializing Chess Engine & Full-Stack Environment...",
    "> 2. Nf3 -- Loading IT Undergrad Data (JGEC '27) & Project Pipelines...",
    "> 3. Bb5 -- System Status: GRANDMASTER MONOCHROME THEME ACTIVE",
    "Hi, I'm Bibek -- Full-Stack Developer & AI/ML Engineer."
  ], []);

  useEffect(() => {
    if (commandIndex >= terminalLogs.length) {
      setIsFinished(true);
      return;
    }

    const currentLine = terminalLogs[commandIndex];

    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + currentLine[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      const pauseTimer = setTimeout(() => {
        setDisplayText((prev) => prev + '\n');
        setCommandIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 350);
      return () => clearTimeout(pauseTimer);
    }
  }, [charIndex, commandIndex, terminalLogs]);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, displayText]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = '';

    switch (trimmed) {
      case 'help':
        response = "CHESS CLI COMMANDS:\n • help: Display command list\n • skills: Show technical stack from CV\n • education: View JGEC & Polytechnic credentials\n • projects: List full-stack & AI projects\n • experience: View internship tenures\n • clear: Reset terminal screen";
        break;
      case 'skills':
        response = "CV TECHNICAL SKILLS:\n • Languages: Java, JavaScript, C++, C, SQL, Python\n • Frontend: React.js, HTML5, CSS3, Bootstrap, Tailwind CSS, EJS\n • Backend: Node.js, Express.js, REST APIs, JWT\n • Databases: MongoDB, Mongoose, MySQL\n • System Design: HLD, LLD, SOLID Principles, Design Patterns\n • Data Analysis: NumPy, Pandas, Matplotlib\n • Tools: Git, GitHub, Postman, Swagger/OpenAPI, Render, Vercel, Multer, KaggleHub";
        break;
      case 'education':
        response = "EDUCATION CREDENTIALS:\n 1. IT (2027) | Jalpaiguri Government Engineering College | CGPA: 8.12\n 2. EE (2024) | Rajganj Government Polytechnic | CGPA: 8.2";
        break;
      case 'projects':
        response = "CV PROJECTS:\n 1. Flight Booking Application -- Backend (Node.js, Express, MongoDB)\n 2. Crochet E-commerce Website -- Full Stack (React, Node, Express, MongoDB)\n 3. E-commerce REST API (JWT, Swagger, Render)\n 4. Sign Language to Voice Conversion System (TensorFlow, CNN, KaggleHub)";
        break;
      case 'experience':
        response = "EXPERIENCE & INTERNSHIPS:\n • Trainee & Intern @ Coding Ninjas x IITM Pravartak (Java, DSA, Full-Stack)\n • Def-Space Summer Intern @ BSERC (Defence & Space Technologies)\n • AI Intern @ SPARKIIT (Applied AI & Python Model Development)";
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      default:
        response = `chess-cli: illegal move: '${trimmed}'. Type 'help' for tactical assistance.`;
    }

    setHistory((prev) => [...prev, { command: cmd, response }]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  return (
    <div 
      className="w-full font-mono text-[11px] sm:text-xs md:text-sm bg-zinc-950/90 border border-zinc-800 rounded-lg p-3.5 sm:p-5 shadow-2xl backdrop-blur-md cursor-text relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
          <span className="text-zinc-300 text-[10px] sm:text-xs ml-1.5 font-mono truncate flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400 inline" />
            bibek@chess-grandmaster:~
          </span>
        </div>
        <div className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
          <span>♔ STOCKFISH 16.1</span>
        </div>
      </div>

      <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-2">
        <pre className="whitespace-pre-wrap break-words text-zinc-300 font-mono leading-relaxed">
          {displayText}
          {!isFinished && (
            <span className="inline-block w-1.5 h-3.5 sm:w-2 sm:h-4 bg-white ml-1 animate-pulse align-middle" />
          )}
        </pre>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1 text-zinc-300">
            <div className="flex items-center space-x-2 text-zinc-400">
              <span className="text-zinc-200">1. e4 &gt;</span>
              <span className="text-zinc-100">{item.command}</span>
            </div>
            {item.response && (
              <pre className="whitespace-pre-wrap break-words text-zinc-400 pl-3 border-l border-zinc-800 text-[11px] sm:text-xs leading-relaxed">
                {item.response}
              </pre>
            )}
          </div>
        ))}

        {isFinished && (
          <div className="flex items-center space-x-2 text-zinc-100 pt-1">
            <span className="text-white font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help'..."
              className="bg-transparent outline-none flex-1 font-mono text-zinc-100 text-[11px] sm:text-xs placeholder-zinc-600"
            />
          </div>
        )}
        <div ref={terminalBottomRef} />
      </div>

      {isFinished && (
        <div className="mt-3 pt-2.5 border-t border-zinc-800 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-zinc-400 font-mono self-center mr-1">TACTICS:</span>
          {['help', 'skills', 'education', 'projects', 'experience', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={(e) => {
                e.stopPropagation();
                executeCommand(cmd);
              }}
              className="text-[10px] font-mono bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-2 py-0.5 rounded transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * MAIN PORTFOLIO COMPONENT (PURE BLACK & WHITE)
 * ============================================================================
 */
export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [activeSkillCategory, setActiveSkillCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [profilePieceIdx, setProfilePieceIdx] = useState(0);

  const profilePieces = useMemo(() => [
    { symbol: '♔', name: 'GRANDMASTER_DEV.NODE', tag: 'KING // LEADER', elo: 'ELO 2400+ ACTIVE', detail: 'IT (2027) | JGEC' },
    { symbol: '♕', name: 'FULLSTACK_QUEEN.NODE', tag: 'QUEEN // POWER', elo: 'REST APIs & REACT', detail: 'Node.js & MongoDB' },
    { symbol: '♞', name: 'TACTICAL_KNIGHT.NODE', tag: 'KNIGHT // MOBILITY', elo: 'DSA & JAVA EXPERT', detail: 'Coding Ninjas Intern' },
    { symbol: '♖', name: 'FORTRESS_ROOK.NODE', tag: 'ROOK // DEFENCE', elo: 'DEF-SPACE 2026', detail: 'BSERC Technology' },
    { symbol: '♗', name: 'VISION_BISHOP.NODE', tag: 'BISHOP // AI CORE', elo: 'PYTHON & CNN', detail: 'SPARKIIT AI Intern' },
  ], []);

  const cycleProfilePiece = () => {
    const nextIdx = (profilePieceIdx + 1) % profilePieces.length;
    setProfilePieceIdx(nextIdx);
    triggerToast(`Tactical Role Switched: ${profilePieces[nextIdx].tag}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  const handleCopy = (textToCopy, label) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      triggerToast(`Copied ${label} to clipboard!`);
    } else {
      triggerToast(`${label}: ${textToCopy}`);
    }
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      triggerToast("Message transmitted successfully!");
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Education Details from CV
  const educationList = [
    {
      degree: 'IT (2027)',
      institution: 'JALPAIGURI GOVERNMENT ENGINEERING COLLEGE',
      cgpa: '8.12',
      piece: '♔',
      status: 'Current B.Tech Undergrad'
    },
    {
      degree: 'EE (2024)',
      institution: 'RAJGANJ GOVERNMENT POLYTECHNIC',
      cgpa: '8.2',
      piece: '♕',
      status: 'Diploma Graduate'
    }
  ];

  // Experience Details from CV
  const experiences = [
    {
      role: 'Trainee & Intern',
      organization: 'Coding Ninjas x IITM Pravartak',
      period: 'Recent',
      location: 'Hybrid',
      piece: '♞',
      technologies: ['Java', 'Data Structures & Algorithms', 'Full-Stack Web Dev', 'Problem Solving'],
      description: [
        'Completed structured training in Java, Data Structures and Algorithms, and Full-Stack Web Development.',
        'Engineered optimized algorithmic solutions and built scalable web application modules.'
      ]
    },
    {
      role: 'Def-Space Summer Intern',
      organization: 'Bharat Space Education Research Centre (BSERC)',
      period: 'Def-Space 2026',
      location: '120-Hour Program',
      piece: '♖',
      technologies: ['Defence Tech', 'Space Technologies', 'Systems Engineering'],
      description: [
        'Completed the 120-hour Def-Space Summer Internship 2026.',
        'Gained in-depth programme exposure to cutting-edge Defence and Space technologies.'
      ]
    },
    {
      role: 'Artificial Intelligence Intern',
      organization: 'SPARKIIT',
      period: '3-Month Internship',
      location: 'Applied AI',
      piece: '♗',
      technologies: ['Python', 'Applied AI', 'Model Development', 'Machine Learning'],
      description: [
        'Completed a three-month intensive internship focused on applied artificial intelligence.',
        'Engineered Python-based AI model development pipelines and predictive routines.'
      ]
    }
  ];

  // Projects Details from CV
  const projects = [
    {
      id: 'flight-booking-backend',
      title: 'Flight Booking Application -- Backend',
      category: 'Backend & APIs',
      period: 'Featured',
      piece: '♕',
      description: 'Developing a backend application for user authentication, flight management, booking, passenger details, and cancellation requests.',
      highlights: [
        'Following a layered architecture using controllers, services, repositories, models, and routes.',
        'Using MongoDB Atlas and GitHub for cloud database storage and version control.'
      ],
      tags: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST API', 'Layered Architecture'],
      github: 'https://github.com',
      demo: '#'
    },
    {
      id: 'crochet-ecommerce',
      title: 'Crochet E-commerce website-Full Stack',
      category: 'Full Stack',
      period: 'Featured',
      piece: '♔',
      description: 'Full-stack crochet e-commerce platform with robust REST APIs and database persistence.',
      highlights: [
        'Developed REST APIs with Node.js/Express and integrated MongoDB for data persistence.',
        'Deployed the frontend on Vercel and backend on Render with live environment integration.'
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Vercel', 'Render'],
      github: 'https://github.com',
      demo: '#'
    },
    {
      id: 'ecommerce-rest-api',
      title: 'E-commerce REST API',
      category: 'Backend & APIs',
      period: 'Recent',
      piece: '♖',
      description: 'Built and deployed REST APIs for user signup/signin, JWT-protected routes, product CRUD, filtering, ratings, and shopping-cart operations.',
      highlights: [
        'Created interactive Swagger documentation and configured CORS policies.',
        'Secured routes via JWT authentication tokens and deployed backend live on Render.'
      ],
      tags: ['Node.js', 'Express.js', 'JWT', 'Swagger/OpenAPI', 'Render', 'CORS'],
      github: 'https://github.com',
      demo: '#'
    },
    {
      id: 'sign-language-voice',
      title: 'Sign Language to Voice Conversion System',
      category: 'AI & Machine Learning',
      period: 'Recent',
      piece: '♞',
      description: 'Computer vision and deep learning translation engine mapping sign language alphabet gestures to voice output.',
      highlights: [
        'Trained Convolutional Neural Network (CNN) models on alphabet dataset imported via KaggleHub.',
        'Implemented visualization & data analytics pipelines using Matplotlib and TensorFlow/Keras.'
      ],
      tags: ['TensorFlow', 'Keras', 'CNN', 'KaggleHub', 'Alphabet Dataset', 'Matplotlib'],
      github: 'https://github.com',
      demo: '#'
    }
  ];

  // Skills Matrix from CV
  const skillsData = [
    // Languages
    { name: 'Java', category: 'Languages', level: 90, icon: <Code2 className="w-4 h-4" /> },
    { name: 'JavaScript', category: 'Languages', level: 92, icon: <Code2 className="w-4 h-4" /> },
    { name: 'C++', category: 'Languages', level: 85, icon: <Code2 className="w-4 h-4" /> },
    { name: 'C', category: 'Languages', level: 80, icon: <Code2 className="w-4 h-4" /> },
    { name: 'SQL', category: 'Languages', level: 88, icon: <Code2 className="w-4 h-4" /> },
    { name: 'Python', category: 'Languages', level: 94, icon: <Code2 className="w-4 h-4" /> },
    
    // Frontend
    { name: 'React.js', category: 'Frontend', level: 90, icon: <Globe className="w-4 h-4" /> },
    { name: 'HTML5', category: 'Frontend', level: 95, icon: <Globe className="w-4 h-4" /> },
    { name: 'CSS3', category: 'Frontend', level: 92, icon: <Globe className="w-4 h-4" /> },
    { name: 'Bootstrap', category: 'Frontend', level: 84, icon: <Globe className="w-4 h-4" /> },
    { name: 'Tailwind CSS', category: 'Frontend', level: 94, icon: <Globe className="w-4 h-4" /> },
    { name: 'EJS', category: 'Frontend', level: 82, icon: <Globe className="w-4 h-4" /> },

    // Backend & Database
    { name: 'Node.js', category: 'Backend & DB', level: 90, icon: <Server className="w-4 h-4" /> },
    { name: 'Express.js', category: 'Backend & DB', level: 92, icon: <Server className="w-4 h-4" /> },
    { name: 'REST APIs', category: 'Backend & DB', level: 95, icon: <Server className="w-4 h-4" /> },
    { name: 'JWT', category: 'Backend & DB', level: 88, icon: <Server className="w-4 h-4" /> },
    { name: 'MongoDB', category: 'Backend & DB', level: 90, icon: <Database className="w-4 h-4" /> },
    { name: 'Mongoose', category: 'Backend & DB', level: 88, icon: <Database className="w-4 h-4" /> },
    { name: 'MySQL', category: 'Backend & DB', level: 85, icon: <Database className="w-4 h-4" /> },

    // System Design & Data Analysis
    { name: 'System Design (HLD/LLD)', category: 'Architecture & Analysis', level: 84, icon: <Layers className="w-4 h-4" /> },
    { name: 'SOLID Principles', category: 'Architecture & Analysis', level: 86, icon: <Layers className="w-4 h-4" /> },
    { name: 'Design Patterns', category: 'Architecture & Analysis', level: 85, icon: <Layers className="w-4 h-4" /> },
    { name: 'NumPy', category: 'Architecture & Analysis', level: 88, icon: <Brain className="w-4 h-4" /> },
    { name: 'Pandas', category: 'Architecture & Analysis', level: 88, icon: <Brain className="w-4 h-4" /> },
    { name: 'Matplotlib', category: 'Architecture & Analysis', level: 85, icon: <Brain className="w-4 h-4" /> },

    // Tools
    { name: 'Git & GitHub', category: 'Tools', level: 94, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Postman', category: 'Tools', level: 90, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Swagger / OpenAPI', category: 'Tools', level: 88, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Vercel & Render', category: 'Tools', level: 92, icon: <Wrench className="w-4 h-4" /> },
    { name: 'Multer & KaggleHub', category: 'Tools', level: 85, icon: <Wrench className="w-4 h-4" /> },
  ];

  const filteredProjects = useMemo(() => {
    if (activeProjectFilter === 'All') return projects;
    return projects.filter(p => p.category === activeProjectFilter);
  }, [activeProjectFilter, projects]);

  const filteredSkills = useMemo(() => {
    if (activeSkillCategory === 'All') return skillsData;
    return skillsData.filter(s => s.category === activeSkillCategory);
  }, [activeSkillCategory, skillsData]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-white selection:text-zinc-950">
      <CustomStyles />
      
      {/* 1. Interactive Dark Chessboard Canvas Background */}
      <ChessboardBackground />

      {/* 2. Top Navigation Bar (Black & White) */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 transition-all overflow-hidden">
        
        {/* Slow floating enlarged chess pieces canvas */}
        <NavbarChessBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <a 
            href="#hero" 
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center space-x-2 text-zinc-100 font-mono font-bold tracking-wider hover:text-white transition-colors py-2 group min-h-[44px]"
            aria-label="Home"
          >
            <span className="text-white font-serif text-2xl group-hover:scale-110 transition-transform">♔</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-mono tracking-wider text-zinc-400">
            <a href="#education" onClick={(e) => handleNavClick(e, 'education')} className="hover:text-white transition-colors py-2">1.e4 ./edu</a>
            <a href="#experience" onClick={(e) => handleNavClick(e, 'experience')} className="hover:text-white transition-colors py-2">2.Nf3 ./exp</a>
            <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="hover:text-white transition-colors py-2">3.Bb5 ./projects</a>
            <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="hover:text-white transition-colors py-2">4.O-O ./skills</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-white transition-colors py-2">5.# ./contact</a>
          </div>

          {/* Desktop Get in Touch Button */}
          <div className="hidden md:block">
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-xs font-mono border border-zinc-700 bg-zinc-900 hover:border-zinc-100 text-zinc-200 hover:text-zinc-950 px-4 py-2 rounded transition-all hover:bg-white inline-block font-bold"
            >
              CHALLENGE / CONTACT
            </a>
          </div>

          {/* Mobile Menu Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-zinc-300 hover:text-white border border-zinc-800 rounded bg-zinc-900/80 active:bg-zinc-800 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer Menu Overlay */}
        {mobileMenuOpen && (
          <div className="relative z-10 md:hidden bg-zinc-950/98 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 font-mono text-xs backdrop-blur-xl animate-fadeIn">
            <a 
              href="#education" 
              onClick={(e) => handleNavClick(e, 'education')} 
              className="flex items-center space-x-3 py-3 px-3 rounded hover:bg-zinc-900 text-zinc-300 border border-zinc-900 active:bg-zinc-800"
            >
              <span>1. e4 // EDUCATION CREDENTIALS</span>
            </a>
            <a 
              href="#experience" 
              onClick={(e) => handleNavClick(e, 'experience')} 
              className="flex items-center space-x-3 py-3 px-3 rounded hover:bg-zinc-900 text-zinc-300 border border-zinc-900 active:bg-zinc-800"
            >
              <span>2. Nf3 // EXPERIENCE & INTERNSHIPS</span>
            </a>
            <a 
              href="#projects" 
              onClick={(e) => handleNavClick(e, 'projects')} 
              className="flex items-center space-x-3 py-3 px-3 rounded hover:bg-zinc-900 text-zinc-300 border border-zinc-900 active:bg-zinc-800"
            >
              <span>3. Bb5 // PROJECTS SHOWCASE</span>
            </a>
            <a 
              href="#skills" 
              onClick={(e) => handleNavClick(e, 'skills')} 
              className="flex items-center space-x-3 py-3 px-3 rounded hover:bg-zinc-900 text-zinc-300 border border-zinc-900 active:bg-zinc-800"
            >
              <span>4. O-O // TECHNICAL SKILL MATRIX</span>
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, 'contact')} 
              className="flex items-center space-x-3 py-3 px-3 rounded hover:bg-zinc-900 text-zinc-300 border border-zinc-900 active:bg-zinc-800"
            >
              <span>5. # // CONTACT & TRANSMIT</span>
            </a>
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCopy('bibek.engineering@example.com', 'Email');
                }}
                className="w-full text-center bg-white text-zinc-950 font-bold py-3 rounded active:bg-zinc-200 transition-colors"
              >
                COPY EMAIL ADDRESS
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 3. Main Content Wrapper */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-20 sm:space-y-28">

        {/* --- HERO SECTION --- */}
        <section id="hero" className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">

          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                  BIBEK <span className="text-zinc-400 text-3xl sm:text-4xl lg:text-5xl font-serif">♞</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-zinc-400 font-light tracking-wide">
                  Full-Stack Web Developer, Systems & AI Engineer
                </p>
              </div>

              <TerminalIntro />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => handleCopy('bibek.engineering@example.com', 'Email address')}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-extrabold px-5 py-3.5 rounded transition-all shadow-lg shadow-white/10 min-h-[44px]"
                >
                  <Mail className="w-4 h-4" />
                  <span>COPY EMAIL</span>
                </button>

                <button
                  onClick={() => triggerToast("CV reference loaded: IT @ JGEC & Full-Stack Stack.")}
                  className="flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-400 active:bg-zinc-800 text-zinc-200 font-mono text-xs px-5 py-3.5 rounded transition-all min-h-[44px]"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>CURRICULUM VITAE</span>
                </button>
              </div>
            </div>

            {/* Interactive Profile Picture Card aligned to top right marked area */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end pt-2 lg:pt-0">
              <div 
                onClick={cycleProfilePiece}
                className="relative group w-full max-w-[280px] sm:max-w-[300px] cursor-pointer select-none"
                aria-label="Click to cycle chess profile avatar"
              >
                <div className="absolute -inset-1 rounded-2xl bg-white/10 opacity-75 blur-xl group-hover:opacity-100 transition duration-500"></div>

                <div className="relative w-full bg-zinc-900/90 border-2 border-zinc-800 hover:border-white/60 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-3.5 shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95">
                  
                  {/* Status Tag & Click Hint */}
                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                    <span className="flex items-center gap-1.5 text-zinc-200 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {profilePieces[profilePieceIdx].tag}
                    </span>
                    <span className="text-zinc-500 hover:text-zinc-300 transition-colors">TAP TO SWITCH</span>
                  </div>

                  {/* Interactive Big Avatar Circle */}
                  <div className="relative my-1">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-950 border-2 border-zinc-700 group-hover:border-white flex items-center justify-center text-white transition-all duration-300 shadow-inner group-hover:scale-105">
                      <span className="font-serif text-5xl sm:text-6xl transition-transform duration-300 group-active:rotate-12">
                        {profilePieces[profilePieceIdx].symbol}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white text-zinc-950 p-1 rounded-full text-[10px] shadow-lg">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Role Name & Details */}
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-mono text-zinc-100 font-bold tracking-tight">
                      {profilePieces[profilePieceIdx].name}
                    </p>
                    <p className="text-[11px] sm:text-xs font-mono text-zinc-400">
                      {profilePieces[profilePieceIdx].detail}
                    </p>
                  </div>

                  {/* ELO / Spec Badge */}
                  <div className="w-full text-[10px] sm:text-[11px] font-mono border border-zinc-800 px-2.5 py-1 rounded text-zinc-300 bg-zinc-950 flex items-center justify-center gap-1.5">
                    <span className="text-white font-serif">♟</span>
                    <span>{profilePieces[profilePieceIdx].elo}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- 1. e4 // EDUCATION SECTION --- */}
        <section id="education" className="scroll-mt-20 space-y-6">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3">
            <GraduationCap className="w-5 h-5 text-zinc-100 flex-shrink-0" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              1. e4 // ACADEMIC EDUCATION CREDENTIALS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {educationList.map((edu, idx) => (
              <div 
                key={idx}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-500 rounded-xl p-5 sm:p-6 transition-all duration-300 backdrop-blur-sm relative group overflow-hidden"
              >
                <div className="absolute top-3 right-4 font-serif text-3xl text-zinc-700 group-hover:text-zinc-500 transition-colors">
                  {edu.piece}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                      {edu.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white font-mono tracking-tight">{edu.degree}</h3>
                    <p className="text-xs font-mono text-zinc-300 font-semibold mt-1">{edu.institution}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">CGPA ADHERENCE:</span>
                    <span className="text-zinc-100 font-bold bg-zinc-950 px-3 py-1 rounded border border-zinc-800">
                      {edu.cgpa} / 10.0
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 2. Nf3 // EXPERIENCE & INTERNSHIPS --- */}
        <section id="experience" className="scroll-mt-20 space-y-6 sm:space-y-8">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3">
            <Briefcase className="w-5 h-5 text-zinc-100 flex-shrink-0" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              2. Nf3 // TECHNICAL INTERNSHIPS & TENURES
            </h2>
          </div>

          <div className="relative border-l border-zinc-800 ml-2 sm:ml-6 space-y-8 pl-4 sm:pl-8">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Chess Knight marker on timeline */}
                <div className="absolute -left-[21px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full bg-zinc-950 border-2 border-zinc-600 flex items-center justify-center font-serif text-zinc-100 text-xs shadow-md">
                  {exp.piece}
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 p-4 sm:p-6 rounded-xl transition-all duration-300 space-y-3.5 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{exp.role}</h3>
                      <p className="text-xs sm:text-sm font-mono text-zinc-400">{exp.organization}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <span className="bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded">
                        {exp.period}
                      </span>
                      <span className="bg-zinc-950 text-zinc-500 border border-zinc-800 px-2 py-1 rounded">
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed font-sans">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-zinc-500 font-mono mt-0.5 flex-shrink-0">♟</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/80">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. Bb5 // PROJECTS SHOWCASE --- */}
        <section id="projects" className="scroll-mt-20 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-zinc-100 flex-shrink-0" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                3. Bb5 // FULL-STACK & AI PROJECTS
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {['All', 'Backend & APIs', 'Full Stack', 'AI & Machine Learning'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveProjectFilter(filter)}
                  className={`px-3 py-2 rounded border transition-all text-left min-h-[38px] active:scale-95 ${
                    activeProjectFilter === filter
                      ? 'bg-white text-zinc-950 border-white font-bold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="group bg-zinc-900/50 border border-zinc-800 hover:border-zinc-500 p-5 sm:p-6 rounded-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-sm relative"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300 border border-zinc-800 px-2.5 py-0.5 rounded bg-zinc-950 flex items-center gap-1.5">
                      <span className="font-serif text-sm text-zinc-100">{project.piece}</span>
                      {project.category}
                    </span>
                    <span className="text-zinc-500">{project.period}</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {project.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-zinc-300 font-sans border-t border-zinc-800/80 pt-3">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-zinc-500 font-mono flex-shrink-0">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                </div>

                <div className="space-y-4 pt-4 mt-4 border-t border-zinc-800/60">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono text-xs border-t border-zinc-900">
                    <div className="flex items-center space-x-4">
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors py-1.5 min-h-[44px]"
                      >
                        <Github className="w-4 h-4" />
                        <span>GITHUB</span>
                      </a>
                      <a 
                        href={project.demo} 
                        onClick={(e) => { e.preventDefault(); triggerToast("Opening live environment URL..."); }}
                        className="flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors py-1.5 min-h-[44px]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LIVE_DEMO</span>
                      </a>
                    </div>
                    
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono underline underline-offset-4 py-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>CV_SPEC</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* --- 4. O-O // TECHNICAL SKILL MATRIX --- */}
        <section id="skills" className="scroll-mt-20 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-zinc-100 flex-shrink-0" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                4. O-O // FULL TECHNICAL SKILL MATRIX
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {['All', 'Languages', 'Frontend', 'Backend & DB', 'Architecture & Analysis', 'Tools'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveSkillCategory(cat)}
                  className={`px-3 py-2 rounded border transition-all text-left min-h-[38px] active:scale-95 ${
                    activeSkillCategory === cat
                      ? 'bg-white text-zinc-950 border-white font-bold'
                      : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-100 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredSkills.map((skill, idx) => (
              <div 
                key={idx}
                className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-500 p-3.5 sm:p-4 rounded-lg transition-all duration-300 flex flex-col justify-between space-y-3 group backdrop-blur-sm"
              >
                <div className="flex items-center justify-between text-zinc-400 group-hover:text-zinc-100 transition-colors">
                  {skill.icon}
                  <span className="text-[9px] font-mono text-zinc-500 uppercase truncate max-w-[80px]">
                    {skill.category}
                  </span>
                </div>

                <div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-white truncate">{skill.name}</div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-zinc-500 mt-0.5">VERIFIED CV SKILL</div>
                </div>

                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-700 ease-out group-hover:bg-zinc-200"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* --- 5. # // CONTACT SECTION --- */}
        <section id="contact" className="scroll-mt-20 space-y-6 sm:space-y-8">
          
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3">
            <Mail className="w-5 h-5 text-zinc-100 flex-shrink-0" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              5. # // TRANSMIT MESSAGE & CONNECT
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Let's connect and build.</h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Available for Full-Stack Web Development, Node.js REST API Architecture, and AI/ML Application Engineering roles.
                </p>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div 
                  onClick={() => handleCopy('bibek.engineering@example.com', 'Email')}
                  className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-500 rounded cursor-pointer group transition-all min-h-[44px]"
                >
                  <div className="flex items-center space-x-3 text-zinc-300 truncate mr-2">
                    <Mail className="w-4 h-4 text-zinc-400 group-hover:text-white flex-shrink-0" />
                    <span className="truncate">bibek.engineering@example.com</span>
                  </div>
                  <Copy className="w-4 h-4 text-zinc-500 group-hover:text-white flex-shrink-0" />
                </div>

                <div className="flex items-center space-x-3 p-3.5 bg-zinc-900/60 border border-zinc-800 rounded text-zinc-300 min-h-[44px]">
                  <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <span>College: Jalpaiguri Gov. Engg. College (JGEC)</span>
                </div>
              </div>

              <div className="pt-1 flex items-center space-x-3">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-xs px-4 py-3 rounded transition-all min-h-[44px]"
                >
                  <Github className="w-4 h-4" />
                  <span>GITHUB</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-xs px-4 py-3 rounded transition-all min-h-[44px]"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LINKEDIN</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="bg-zinc-900/50 border border-zinc-800 p-4 sm:p-6 rounded-xl space-y-4 backdrop-blur-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kasparov"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none transition-colors min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase">Your Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. garry@chess.org"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none transition-colors min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Message</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Inquire regarding technical opportunities, full-stack roles, or engineering queries..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-400 rounded px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-200 active:bg-zinc-200 font-mono text-xs font-extrabold py-3.5 rounded transition-all flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING...</span>
                  ) : formSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                      <span>MESSAGE TRANSMITTED</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>TRANSMIT MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </section>

      </main>

      {/* --- PROJECT DETAILS MODAL --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative animate-modal">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded bg-zinc-950">
                {selectedProject.category}
              </span>
              <h3 className="text-lg font-bold text-white pt-1">{selectedProject.title}</h3>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p className="leading-relaxed">{selectedProject.description}</p>
              
              <div>
                <span className="font-mono text-zinc-400 text-[11px] uppercase">CV Key Highlights:</span>
                <ul className="mt-1 space-y-1">
                  {selectedProject.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-zinc-300">
                      <span className="text-zinc-500 font-mono">♟</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedProject.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-zinc-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-white text-zinc-950 font-mono text-xs font-bold rounded hover:bg-zinc-200"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 bg-zinc-950/95 py-6 sm:py-8 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; {new Date().getFullYear()} BIBEK. VERIFIED CV PORTFOLIO.
          </div>
          <div className="flex items-center space-x-4 text-[10px] sm:text-[11px] text-zinc-400">
            <span className="flex items-center space-x-1">
              <Smartphone className="w-3 h-3 text-zinc-400" />
              <span>MONOCHROME CHESS EDITION</span>
            </span>
            <span>•</span>
            <span>IT @ JGEC</span>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-50 p-3 bg-zinc-900/90 border border-zinc-700 hover:border-white text-zinc-100 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 max-w-[90vw] bg-white text-zinc-950 font-mono text-xs font-bold px-4 py-3 rounded shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 flex-shrink-0 text-zinc-950" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
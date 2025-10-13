import React, { useState, useEffect } from 'react';

// --- Mock Data ---
// Initial data that will be loaded into the app's state
const initialAnnouncements = [
    { id: 1, title: 'Resumption for 2024/2025 Academic Session', date: '2024-10-10', author: 'Registrar', content: 'This is to inform all students that the resumption date for the new academic session is Monday, 28th October 2024.' },
    { id: 2, title: 'First Semester Examination Timetable', date: '2024-10-08', author: 'Exams & Records', content: 'The first semester examination timetable has been released. Please check the departmental notice boards.' },
];

const initialEvents = [
    { id: 1, title: 'Convocation Ceremony', date: '2024-11-15', location: 'University Auditorium', description: 'The 10th convocation ceremony for the award of degrees and prizes.' },
    { id: 2, title: 'Matriculation for New Students', date: '2024-11-01', location: 'University Auditorium', description: 'Matriculation ceremony for all newly admitted students.' },
];

const initialTimetable = {
    Monday: [{ time: '10am - 12pm', course: 'CSC 401: Compiler Construction', venue: 'ETF Hall' }],
    Tuesday: [{ time: '2pm - 4pm', course: 'CSC 411: Artificial Intelligence', venue: 'Main Hall' }],
};

const initialResults = [
    { code: 'CSC 301', title: 'Structured Programming', score: 'A', grade: 5.0 },
    { code: 'MTH 301', title: 'Differential Equations', score: 'B', grade: 4.0 },
];

const mockUsers = [
    { id: 1, name: 'John Doe', email: 'student@funai.edu', password: 'password123', isAdmin: false },
    { id: 2, name: 'Admin User', email: 'admin@funai.edu', password: 'admin123', isAdmin: true },
];


// --- Components ---

const Icon = ({ name, className }) => {
    const icons = {
        'dashboard': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
        'announcement': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.148-6.154A1.76 1.76 0 016.583 12H10" />,
        'event': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
        'timetable': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'results': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        'profile': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
        'search': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
        'user': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />,
        'email': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
        'lock': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
        'eye': <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
        'eye-off': <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
        'menu': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
        'close': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
        'admin': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
        'trash': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    };
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {icons[name]}
        </svg>
    );
};

const Header = ({ setPage, user, logout, isMenuOpen, setMenuOpen }) => {
    const NavLink = ({ page, iconName, children }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setPage(page);
                setMenuOpen(false);
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
        >
            <Icon name={iconName} className="w-5 h-5" />
            <span>{children}</span>
        </a>
    );

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                     <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18a6 6 0 100-12 6 6 0 000 12z"></path></svg>
                    <span className="text-xl font-bold text-gray-800">F.U.N.A.I. Portal</span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    {user ? (
                        <>
                           <NavLink page="dashboard" iconName="dashboard">Dashboard</NavLink>
                           <NavLink page="announcements" iconName="announcement">Announcements</NavLink>
                           <NavLink page="events" iconName="event">Events</NavLink>
                           <NavLink page="timetable" iconName="timetable">Timetable</NavLink>
                           <NavLink page="results" iconName="results">Results</NavLink>
                           {user.isAdmin && <NavLink page="admin-dashboard" iconName="admin">Admin Panel</NavLink>}
                        </>
                    ) : (
                         <NavLink page="landing" iconName="dashboard">Home</NavLink>
                    )}
                </nav>
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <div className="relative group">
                             <button onClick={() => setPage('profile')} className="flex items-center space-x-2 text-gray-700">
                                <Icon name="profile" className="w-6 h-6"/>
                                <span>{user.name}</span>
                             </button>
                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                 <a href="#" onClick={(e) => {e.preventDefault(); setPage('profile')}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">Profile</a>
                                 <a href="#" onClick={(e) => {e.preventDefault(); logout()}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">Logout</a>
                             </div>
                        </div>

                    ) : (
                        <>
                            <button onClick={() => setPage('login')} className="text-gray-600 hover:text-amber-600">Login</button>
                            <button onClick={() => setPage('register')} className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">Register</button>
                        </>
                    )}
                </div>
                 <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!isMenuOpen)}>
                        <Icon name={isMenuOpen ? 'close' : 'menu'} className="w-6 h-6"/>
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="md:hidden bg-white border-t">
                    <nav className="flex flex-col space-y-4 p-4">
                        {user ? (
                            <>
                               <NavLink page="dashboard" iconName="dashboard">Dashboard</NavLink>
                               <NavLink page="announcements" iconName="announcement">Announcements</NavLink>
                               <NavLink page="events" iconName="event">Events</NavLink>
                               <NavLink page="timetable" iconName="timetable">Timetable</NavLink>
                               <NavLink page="results" iconName="results">Results</NavLink>
                               {user.isAdmin && <NavLink page="admin-dashboard" iconName="admin">Admin Panel</NavLink>}
                               <hr/>
                                <NavLink page="profile" iconName="profile">{user.name}</NavLink>
                               <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-amber-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <NavLink page="landing" iconName="dashboard">Home</NavLink>
                                <hr/>
                                <button onClick={() => { setPage('login'); setMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-amber-600">Login</button>
                                <button onClick={() => { setPage('register'); setMenuOpen(false); }} className="w-full bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">Register</button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Federal University, Ndufu-Alike. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-amber-400">Privacy Policy</a>
                    <a href="#" className="hover:text-amber-400">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

const SearchFilter = ({ searchTerm, setSearchTerm, placeholder }) => (
    <div className="mb-8 relative">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pl-12"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
        </div>
    </div>
);

const PageContainer = ({ title, children }) => (
    <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 border-l-4 border-amber-600 pl-4">{title}</h1>
        {children}
    </main>
);

// --- Pages ---

const LandingPage = ({ setPage, announcements, events }) => {
    const features = [
        { icon: 'announcement', title: 'Stay Informed', description: 'Get the latest news and announcements from the university administration instantly.' },
        { icon: 'event', title: 'Never Miss an Event', description: 'Keep track of all upcoming campus events, from conferences to sports.' },
        { icon: 'timetable', title: 'Manage Your Schedule', description: 'Access your class timetable anytime, anywhere, and plan your week effectively.' },
        { icon: 'results', title: 'Check Your Results', description: 'View your semester results as soon as they are released by the examination council.' }
    ];

    const latestAnnouncements = announcements.slice(0, 2);
    const upcomingEvents = events.slice(0, 2);

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    Welcome to the Student Hub
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Your one-stop portal for announcements, events, results, and everything you need for a successful academic journey.
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <button onClick={() => setPage('login')} className="px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition duration-300">
                        Login
                    </button>
                    <button onClick={() => setPage('register')} className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                        Register
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Portal Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-600 mx-auto mb-4">
                                    <Icon name={feature.icon} className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest News & Events Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Latest Announcements */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Announcements</h2>
                            <div className="space-y-6">
                                {latestAnnouncements.map(announcement => (
                                    <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                                        <h3 className="text-lg font-bold text-gray-800">{announcement.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 mb-3">{announcement.date}</p>
                                        <p className="text-gray-700 text-sm">{announcement.content.substring(0, 120)}...</p>
                                    </div>
                                ))}
                            </div>
                             <button onClick={() => setPage('announcements')} className="mt-8 text-amber-600 font-semibold hover:underline">
                                View All Announcements &rarr;
                            </button>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h2>
                            <div className="space-y-6">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
                                        <div className="text-center bg-amber-600 text-white p-4 rounded-lg">
                                            <p className="text-3xl font-bold">{new Date(event.date).getDate()}</p>
                                            <p className="text-sm">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                                            <p className="text-sm text-gray-500">{event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <button onClick={() => setPage('events')} className="mt-8 text-amber-600 font-semibold hover:underline">
                                View All Events &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Call to Action Section */}
            <div className="bg-amber-500 text-white">
                <div className="container mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                    <p className="mt-2 mb-8 max-w-xl mx-auto">Create an account or log in to access your student dashboard and stay connected with the campus community.</p>
                     <div className="mt-8 flex justify-center space-x-4">
                        <button onClick={() => setPage('login')} className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
                            Login
                        </button>
                        <button onClick={() => setPage('register')} className="px-8 py-3 bg-amber-600 border border-white text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition duration-300">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthForm = ({ title, isLogin, setPage, handleAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // For registration
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const credentials = isLogin ? { email, password } : { name, email, password };
        handleAuth(credentials);
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                         <label className="text-sm font-medium text-gray-700">Full Name</label>
                         <div className="mt-1 relative">
                                <Icon name="user" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500"/>
                             </div>
                        </div>
                    )}
                    <div>
                         <label className="text-sm font-medium text-gray-700">Email Address</label>
                         <div className="mt-1 relative">
                             <Icon name="email" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500"/>
                         </div>
                    </div>
                    <div>
                         <label className="text-sm font-medium text-gray-700">Password</label>
                         <div className="mt-1 relative">
                             <Icon name="lock" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500"/>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <Icon name={showPassword ? 'eye-off' : 'eye'} className="w-5 h-5"/>
                            </button>
                         </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors">
                        {title}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage(isLogin ? 'register' : 'login'); }} className="font-medium text-amber-600 hover:underline ml-1">
                        {isLogin ? 'Register' : 'Login'}
                    </a>
                </p>
            </div>
        </div>
    );
};

const Dashboard = ({ user, setPage, announcements, events }) => {
    const DashboardCard = ({ title, iconName, children, pageLink }) => (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setPage(pageLink)}>
            <div className="flex items-center space-x-4 mb-4">
                <div className="bg-amber-100 p-3 rounded-full">
                    <Icon name={iconName} className="w-6 h-6 text-amber-600"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>
            {children}
        </div>
    );

    const latestAnnouncement = announcements[0];
    const upcomingEvent = events[0];

    return (
        <PageContainer title={`Welcome back, ${user.name}!`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Latest Announcement */}
                <DashboardCard title="Latest Announcement" iconName="announcement" pageLink="announcements">
                    <h4 className="font-bold text-gray-700">{latestAnnouncement.title}</h4>
                    <p className="text-sm text-gray-500 mt-2">{latestAnnouncement.content.substring(0, 100)}...</p>
                </DashboardCard>

                {/* Upcoming Event */}
                <DashboardCard title="Upcoming Event" iconName="event" pageLink="events">
                    <h4 className="font-bold text-gray-700">{upcomingEvent.title}</h4>
                    <p className="text-sm text-gray-500 mt-2">{upcomingEvent.date} @ {upcomingEvent.location}</p>
                </DashboardCard>

                {/* Quick Links */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                   <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-amber-100 p-3 rounded-full">
                         <Icon name="timetable" className="w-6 h-6 text-amber-600"/>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Quick Links</h3>
                   </div>
                   <div className="space-y-3">
                       <button onClick={() => setPage('timetable')} className="w-full text-left font-medium text-amber-600 hover:underline">View Timetable</button>
                       <button onClick={() => setPage('results')} className="w-full text-left font-medium text-amber-600 hover:underline">Check Results</button>
                       <button onClick={() => setPage('calendar')} className="w-full text-left font-medium text-amber-600 hover:underline">Events Calendar</button>
                       <button onClick={() => setPage('archive')} className="w-full text-left font-medium text-amber-600 hover:underline">Event Archives</button>
                   </div>
                </div>
            </div>
        </PageContainer>
    );
};

const AnnouncementsPage = ({ announcements }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredAnnouncements = announcements.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <PageContainer title="Announcements">
            <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search announcements..."/>
            <div className="space-y-6">
                {filteredAnnouncements.map(announcement => (
                    <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                        <h2 className="text-xl font-bold text-gray-800">{announcement.title}</h2>
                        <div className="text-sm text-gray-500 mt-1 mb-3">
                            <span>{announcement.date}</span> | <span>By: {announcement.author}</span>
                        </div>
                        <p className="text-gray-700">{announcement.content}</p>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

const EventsPage = ({ events }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <PageContainer title="Events">
            <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search events..."/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform">
                         <div className="bg-amber-600 text-white p-4 text-center">
                            <p className="text-4xl font-bold">{new Date(event.date).getDate()}</p>
                            <p className="text-lg">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                            <p className="text-sm text-gray-500 mt-2">{event.location}</p>
                            <p className="text-gray-700 mt-4 text-sm">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

const TimetablePage = ({ timetable }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
        <PageContainer title="Class Timetable">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4">Day</th>
                            <th className="p-4">Time</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            timetable[day]?.map((slot, index) => (
                                <tr key={`${day}-${index}`} className="border-b hover:bg-amber-50">
                                    {index === 0 && (
                                        <td rowSpan={timetable[day].length} className="p-4 font-bold text-gray-700 align-top">{day}</td>
                                    )}
                                    <td className="p-4 text-gray-600">{slot.time}</td>
                                    <td className="p-4 text-gray-800">{slot.course}</td>
                                    <td className="p-4 text-gray-600">{slot.venue}</td>
                                </tr>
                            )) || <tr key={day} className="border-b hover:bg-amber-50"><td className="p-4 font-bold text-gray-700">{day}</td><td colSpan="3" className="p-4 text-gray-500 text-center">No classes scheduled</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageContainer>
    );
};

const EventsCalendarPage = ({ events }) => {
    // Basic calendar logic for demonstration
    const monthName = "November 2024";
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const firstDayOffset = 4; // Friday
    const calendarCells = [];

    for (let i = 0; i < firstDayOffset; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }
    
    daysInMonth.forEach(day => {
        const eventOnDay = events.find(e => new Date(e.date).getDate() === day);
        calendarCells.push(
            <div key={day} className="border p-2 h-24 flex flex-col">
                <span className="font-semibold">{day}</span>
                {eventOnDay && (
                    <div className="mt-1 p-1 bg-amber-100 text-amber-800 rounded-md text-xs truncate cursor-pointer" title={eventOnDay.title}>
                        {eventOnDay.title}
                    </div>
                )}
            </div>
        );
    });

    return (
        <PageContainer title="Events Calendar">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">{monthName}</h2>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                    {calendarCells}
                </div>
            </div>
        </PageContainer>
    );
};

const ResultsPage = ({ results }) => (
    <PageContainer title="Your Results">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-4">Course Code</th>
                        <th className="p-4">Course Title</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                         <tr key={index} className="border-b hover:bg-amber-50">
                            <td className="p-4 text-gray-600">{result.code}</td>
                            <td className="p-4 text-gray-800">{result.title}</td>
                            <td className="p-4 text-gray-600">{result.score}</td>
                            <td className="p-4 font-bold text-gray-800">{result.grade.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </PageContainer>
);

const ProfilePage = ({ user }) => (
    <PageContainer title="Your Profile">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
                <Icon name="profile" className="w-24 h-24 text-amber-500" />
                <div className="mt-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <div className="mt-4 space-y-2 text-lg">
                        <p className="text-gray-700"><span className="font-semibold">Department:</span> Computer Science</p>
                        <p className="text-gray-700"><span className="font-semibold">Matric No:</span> 2021/123456</p>
                    </div>
                    <button className="mt-8 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    </PageContainer>
);

// --- Admin Pages ---

const AdminDashboard = ({ setPage }) => {
    const AdminCard = ({ title, iconName, pageLink }) => (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setPage(pageLink)}>
            <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                    <Icon name={iconName} className="w-6 h-6 text-amber-600"/>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            </div>
        </div>
    );

    return (
        <PageContainer title="Admin Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AdminCard title="Manage Announcements" iconName="announcement" pageLink="admin-announcements" />
                <AdminCard title="Manage Events" iconName="event" pageLink="admin-events" />
                <AdminCard title="Manage Timetable" iconName="timetable" pageLink="admin-timetable" />
                <AdminCard title="Manage Results" iconName="results" pageLink="admin-results" />
                <AdminCard title="Manage Profile" iconName="profile" pageLink="profile" />
            </div>
        </PageContainer>
    );
};

const ManageAnnouncements = ({ announcements, addAnnouncement, deleteAnnouncement }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newAnnouncement = {
            id: Date.now(),
            title,
            content,
            author: 'Admin',
            date: new Date().toISOString().split('T')[0]
        };
        addAnnouncement(newAnnouncement);
        setTitle('');
        setContent('');
    };

    return (
        <PageContainer title="Manage Announcements">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows="5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required></textarea>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700">Add Announcement</button>
                    </form>
                </div>
                <div>
                     <h2 className="text-2xl font-bold mb-4">Existing Announcements</h2>
                     <div className="space-y-4">
                        {announcements.map(ann => (
                            <div key={ann.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{ann.title}</h3>
                                    <p className="text-xs text-gray-500">{ann.date}</p>
                                </div>
                                <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-500 hover:text-red-700">
                                    <Icon name="trash" className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </PageContainer>
    );
};

const ManageEvents = ({ events, addEvent, deleteEvent }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = { id: Date.now(), title, date, location, description };
        addEvent(newEvent);
        setTitle(''); setDate(''); setLocation(''); setDescription('');
    };

    return (
        <PageContainer title="Manage Events">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Create Event</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500" required></textarea>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700">Add Event</button>
                    </form>
                </div>
                <div>
                     <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
                     <div className="space-y-4">
                        {events.map(event => (
                            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{event.title}</h3>
                                    <p className="text-xs text-gray-500">{event.date}</p>
                                </div>
                                <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                                    <Icon name="trash" className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </PageContainer>
    );
};

const ManageTimetable = ({ addTimetableEntry }) => {
    // Simplified form
    const [day, setDay] = useState('Monday');
    const [time, setTime] = useState('');
    const [course, setCourse] = useState('');
    const [venue, setVenue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTimetableEntry({ day, time, course, venue });
        setTime(''); setCourse(''); setVenue('');
    };

    return (
        <PageContainer title="Manage Timetable">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4">Add Timetable Slot</h2>
                {/* Inputs for day, time, course, venue */}
                 <button type="submit" className="w-full py-2 px-4 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700">Add Slot</button>
            </form>
        </PageContainer>
    );
};

const ManageResults = ({ addResult }) => {
    // Simplified form
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [score, setScore] = useState('');
    const [grade, setGrade] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        addResult({ code, title, score, grade: parseFloat(grade) });
        setCode(''); setTitle(''); setScore(''); setGrade(0);
    };

    return (
        <PageContainer title="Manage Results">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4">Add Student Result</h2>
                 {/* Inputs for code, title, score, grade */}
                 <button type="submit" className="w-full py-2 px-4 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700">Add Result</button>
            </form>
        </PageContainer>
    );
};



// --- Main App Component ---

export default function App() {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState(null);
    const [isMenuOpen, setMenuOpen] = useState(false);

    // --- State for dynamic data ---
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [events, setEvents] = useState(initialEvents);
    const [timetable, setTimetable] = useState(initialTimetable);
    const [results, setResults] = useState(initialResults);

    const handleLogin = (credentials) => {
        const foundUser = mockUsers.find(
            u => u.email === credentials.email && u.password === credentials.password
        );
        if (foundUser) {
            setUser(foundUser);
            setPage(foundUser.isAdmin ? 'admin-dashboard' : 'dashboard');
        } else {
            alert('Invalid credentials'); // Replace with a better notification
        }
    };

    const handleRegister = (credentials) => {
        // In a real app, this would check if the email exists, then save to DB
        const newUser = { ...credentials, id: Date.now(), isAdmin: false };
        mockUsers.push(newUser); // Simulating user registration
        setUser(newUser);
        setPage('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setPage('landing');
    };
    
    // --- Admin Data Management Functions ---
    const addAnnouncement = (newAnn) => setAnnouncements([newAnn, ...announcements]);
    const deleteAnnouncement = (id) => setAnnouncements(announcements.filter(a => a.id !== id));

    const addEvent = (newEvent) => setEvents([newEvent, ...events]);
    const deleteEvent = (id) => setEvents(events.filter(e => e.id !== id));

    const addTimetableEntry = ({ day, ...rest }) => {
        const updatedTimetable = { ...timetable };
        if (!updatedTimetable[day]) updatedTimetable[day] = [];
        updatedTimetable[day].push(rest);
        setTimetable(updatedTimetable);
    };

    const addResult = (newResult) => setResults([...results, newResult]);


    const renderPage = () => {
        if (!user) { // Logged out users
            switch (page) {
                case 'login':
                    return <AuthForm title="Login" isLogin={true} setPage={setPage} handleAuth={handleLogin} />;
                case 'register':
                    return <AuthForm title="Register" isLogin={false} setPage={setPage} handleAuth={handleRegister} />;
                default:
                    return <LandingPage setPage={setPage} announcements={announcements} events={events} />;
            }
        }
        
        // Logged in users
        switch (page) {
            case 'dashboard':
                return <Dashboard user={user} setPage={setPage} announcements={announcements} events={events} />;
            case 'announcements':
                return <AnnouncementsPage announcements={announcements} />;
            case 'events':
                return <EventsPage events={events} />;
            case 'timetable':
                return <TimetablePage timetable={timetable} />;
            case 'calendar':
                return <EventsCalendarPage events={events}/>;
            case 'results':
                return <ResultsPage results={results} />;
            case 'profile':
                return <ProfilePage user={user} />;
            // Admin Pages
            case 'admin-dashboard':
                return user.isAdmin ? <AdminDashboard setPage={setPage} /> : <Dashboard user={user} setPage={setPage} />;
            case 'admin-announcements':
                return user.isAdmin ? <ManageAnnouncements announcements={announcements} addAnnouncement={addAnnouncement} deleteAnnouncement={deleteAnnouncement} /> : <Dashboard user={user} setPage={setPage} />;
            case 'admin-events':
                return user.isAdmin ? <ManageEvents events={events} addEvent={addEvent} deleteEvent={deleteEvent} /> : <Dashboard user={user} setPage={setPage} />;
            case 'admin-timetable':
                return user.isAdmin ? <ManageTimetable addTimetableEntry={addTimetableEntry} /> : <Dashboard user={user} setPage={setPage} />;
            case 'admin-results':
                 return user.isAdmin ? <ManageResults addResult={addResult} /> : <Dashboard user={user} setPage={setPage} />;
            default:
                return <LandingPage setPage={setPage} announcements={announcements} events={events} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header setPage={setPage} user={user} logout={handleLogout} isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
            <main className="flex-grow flex flex-col">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}


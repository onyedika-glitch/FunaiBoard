import React, { useState, useEffect } from 'react';

// --- Mock Data ---
// In a real application, this data would come from a database.

const mockAnnouncements = [
    { id: 1, title: "Resumption for 2025/2026 Academic Session", content: "All students are hereby informed that the resumption date for the new academic session is October 27th, 2025. Please complete your registration on time.", date: "2025-10-10", author: "University Admin" },
    { id: 2, title: "First Semester Examination Timetable", content: "The timetable for the first semester examinations has been released. Please check the 'Timetable' section for details.", date: "2025-10-08", author: "Examination Council" },
    { id: 3, title: "Notice of Matriculation Ceremony", content: "The matriculation ceremony for newly admitted students will hold on November 15th, 2025, at the University Auditorium.", date: "2025-10-05", author: "Registry Department" },
    { id: 4, title: "Scholarship Opportunity for Engineering Students", content: "The Faculty of Engineering announces a new scholarship program. Interested students should apply before the deadline on November 30th.", date: "2025-10-02", author: "Faculty of Engineering" },
];

const mockEvents = [
    { id: 1, title: "Student Union Week: Opening Ceremony", date: "2025-11-03", time: "10:00 AM", location: "Main Auditorium", description: "Kickstarting the annual Student Union Week with guest speakers and performances." },
    { id: 2, title: "Tech Innovators Conference", date: "2025-11-10", time: "9:00 AM", location: "ICT Center", description: "A full-day conference on the future of technology, featuring industry experts." },
    { id: 3, title: "Inter-Faculty Sports Competition", date: "2025-11-20", time: "1:00 PM", location: "University Sports Complex", description: "Cheer for your faculty in various track and field events." },
];

const mockPastEvents = [
    { id: 1, title: "Founder's Day Lecture", date: "2025-09-15", location: "Main Auditorium", description: "Annual lecture celebrating the university's founding fathers." },
    { id: 2, title: "Alumni Homecoming 2025", date: "2025-08-22", location: "Alumni Center", description: "A gathering of old students to reconnect and network." },
];

const mockTimetable = {
    'Monday': [{ code: "CSC 401", title: "Compiler Construction", time: "8-10 AM", venue: "CSL 1" }, { code: "GST 403", title: "Nigerian Peoples and Culture", time: "12-2 PM", venue: "AUD" }],
    'Tuesday': [{ code: "CSC 411", title: "Artificial Intelligence", time: "10-12 PM", venue: "ELT" }, { code: "CSC 421", title: "Computer Networks", time: "2-4 PM", venue: "CSL 2" }],
    'Wednesday': [{ code: "CSC 401", title: "Compiler Construction", time: "8-10 AM", venue: "CSL 1" }],
    'Thursday': [{ code: "CSC 411", title: "Artificial Intelligence", time: "10-12 PM", venue: "ELT" }],
    'Friday': [{ code: "CSC 421", title: "Computer Networks", time: "2-4 PM", venue: "CSL 2" }],
};

const mockResults = [
    { code: "CSC 301", title: "Data Structures", grade: "A", score: 85 },
    { code: "CSC 303", title: "Intro to Web Design", grade: "B", score: 68 },
    { code: "MTH 301", title: "Differential Equations", grade: "A", score: 79 },
    { code: "PHY 305", title: "Optics and Waves", grade: "C", score: 55 },
];

// --- SVG Icons ---
// Using inline SVGs for simplicity and performance
const Icon = ({ name, className }) => {
    const icons = {
        menu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
        close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
        dashboard: <path d="M6 22V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />,
        announcement: <><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /><path d="M12 2.69a6.11 6.11 0 0 1 5.86 6.14v4.44l2 2.67a1.44 1.44 0 0 1-1.2 2.36H5.34a1.44 1.44 0 0 1-1.2-2.36l2-2.67V8.83a6.11 6.11 0 0 1 5.86-6.14z" /></>,
        event: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></>,
        timetable: <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
        calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></>,
        results: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
        archive: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
        profile: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></>,
        search: <><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></>,
        user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        email: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
        lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
        eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
        'eye-off': <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></>,
    };
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};


// --- Components ---

const Header = ({ setPage, user, logout, isMenuOpen, setMenuOpen }) => {
    const NavLink = ({ page, children, iconName }) => (
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
                        <Icon name={isMenuOpen ? "close" : "menu"} className="w-6 h-6 text-gray-600"/>
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <nav className="flex flex-col px-6 py-4 space-y-4">
                         {user ? (
                            <>
                                <NavLink page="dashboard" iconName="dashboard">Dashboard</NavLink>
                                <NavLink page="announcements" iconName="announcement">Announcements</NavLink>
                                <NavLink page="events" iconName="event">Events</NavLink>
                                <NavLink page="timetable" iconName="timetable">Timetable</NavLink>
                                <NavLink page="results" iconName="results">Results</NavLink>
                                <NavLink page="profile" iconName="profile">Profile</NavLink>
                                <hr />
                                <a href="#" onClick={(e) => {e.preventDefault(); logout(); setMenuOpen(false);}} className="flex items-center space-x-2 text-red-500">
                                    <Icon name="logout" className="w-5 h-5" />
                                    <span>Logout</span>
                                </a>
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
    <div className="mb-6 relative">
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

const LandingPage = ({ setPage }) => {
    const features = [
        { icon: 'announcement', title: 'Stay Informed', description: 'Get the latest news and announcements from the university administration instantly.' },
        { icon: 'event', title: 'Never Miss an Event', description: 'Keep track of all upcoming campus events, from conferences to sports.' },
        { icon: 'timetable', title: 'Manage Your Schedule', description: 'Access your class timetable anytime, anywhere, and plan your week effectively.' },
        { icon: 'results', title: 'Check Your Results', description: 'View your semester results as soon as they are released by the examination council.' }
    ];

    const latestAnnouncements = mockAnnouncements.slice(0, 2);
    const upcomingEvents = mockEvents.slice(0, 2);

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
                            <button type="button" onClick={() => setShowPassword(!setShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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

const Dashboard = ({ user, setPage }) => {
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

    const latestAnnouncement = mockAnnouncements[0];
    const upcomingEvent = mockEvents[0];

    return (
        <PageContainer title={`Welcome back, ${user.name}!`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Latest Announcement */}
                <DashboardCard title="Latest Announcement" iconName="announcement" pageLink="announcements">
                    <h4 className="font-bold text-gray-700">{latestAnnouncement.title}</h4>
                    <p className="text-gray-600 mt-2 text-sm">{latestAnnouncement.content.substring(0, 100)}...</p>
                    <span className="text-xs text-gray-500 block mt-2">{latestAnnouncement.date}</span>
                </DashboardCard>

                {/* Upcoming Event */}
                <DashboardCard title="Upcoming Event" iconName="event" pageLink="events">
                    <h4 className="font-bold text-gray-700">{upcomingEvent.title}</h4>
                    <p className="text-gray-600 mt-2 text-sm">{upcomingEvent.location}</p>
                    <span className="text-xs text-gray-500 block mt-2">{upcomingEvent.date} @ {upcomingEvent.time}</span>
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

const AnnouncementsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredAnnouncements = mockAnnouncements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

const EventsPage = ({ setPage }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredEvents = mockEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer title="Upcoming Events">
            <div className="flex justify-between items-center mb-6">
                <div className="w-full md:w-1/2">
                    <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search events..."/>
                </div>
                <div>
                     <button onClick={() => setPage('archive')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">View Archive</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform">
                         <div className="bg-amber-600 text-white p-4 text-center">
                            <p className="text-4xl font-bold">{new Date(event.date).getDate()}</p>
                            <p className="text-lg">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                            <p className="text-gray-600 mt-2 text-sm">{event.description}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                <p><span className="font-semibold">Time:</span> {event.time}</p>
                                <p><span className="font-semibold">Location:</span> {event.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

const TimetablePage = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
        <PageContainer title="Class Timetable">
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                <table className="w-full min-w-max text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Day</th>
                            <th className="p-4 font-semibold text-gray-600">Course Code</th>
                            <th className="p-4 font-semibold text-gray-600">Course Title</th>
                            <th className="p-4 font-semibold text-gray-600">Time</th>
                            <th className="p-4 font-semibold text-gray-600">Venue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            mockTimetable[day]?.map((slot, index) => (
                                <tr key={`${day}-${index}`} className="border-b hover:bg-amber-50">
                                    {index === 0 && (
                                        <td rowSpan={mockTimetable[day].length} className="p-4 font-bold text-gray-700 align-top">{day}</td>
                                    )}
                                    <td className="p-4 text-gray-600">{slot.code}</td>
                                    <td className="p-4 text-gray-800">{slot.title}</td>
                                    <td className="p-4 text-gray-600">{slot.time}</td>
                                    <td className="p-4 text-gray-600">{slot.venue}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </PageContainer>
    );
};

const CalendarPage = () => {
    // This is a simplified calendar for demonstration
    const monthName = "November 2025";
    const daysInMonth = 30;
    const startDay = 6; // Saturday
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const calendarCells = [];
    for (let i = 0; i < startDay; i++) {
        calendarCells.push(<div key={`empty-${i}`} className="border p-2 h-24 bg-gray-50"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const eventOnDay = mockEvents.find(e => new Date(e.date).getDate() === day);
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
    }
    
    return (
        <PageContainer title="Events Calendar">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">{monthName}</h2>
                <div className="grid grid-cols-7 gap-1">
                    {daysOfWeek.map(day => <div key={day} className="text-center font-bold text-gray-600 p-2">{day}</div>)}
                    {calendarCells}
                </div>
            </div>
        </PageContainer>
    );
};

const ResultsPage = () => (
    <PageContainer title="Semester Results">
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
            <table className="w-full min-w-max text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Course Code</th>
                        <th className="p-4 font-semibold text-gray-600">Course Title</th>
                        <th className="p-4 font-semibold text-gray-600">Score</th>
                        <th className="p-4 font-semibold text-gray-600">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {mockResults.map((result, index) => (
                         <tr key={index} className="border-b hover:bg-amber-50">
                            <td className="p-4 text-gray-600">{result.code}</td>
                            <td className="p-4 text-gray-800">{result.title}</td>
                            <td className="p-4 text-gray-600">{result.score}</td>
                            <td className="p-4 font-bold text-gray-800">{result.grade}</td>
                         </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </PageContainer>
);

const ArchivePage = () => {
    return (
        <PageContainer title="Events Archive">
            <div className="space-y-4">
                {mockPastEvents.map(event => (
                    <div key={event.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-700">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                        <span className="text-gray-600 font-medium">{event.date}</span>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};


const ProfilePage = ({ user }) => (
    <PageContainer title="My Profile">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                        <Icon name="user" className="w-20 h-20 text-gray-400" />
                    </div>
                </div>
                <div className="text-center sm:text-left flex-grow">
                    <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-lg text-gray-500 mt-1">{user.email}</p>
                    <div className="mt-6 space-y-3">
                        <p className="text-gray-700"><span className="font-semibold">Faculty:</span> Science</p>
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


// --- Main App Component ---

export default function App() {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([
        { name: 'John Doe', email: 'john@test.com', password: 'password123' }
    ]);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleLogin = (credentials) => {
        const foundUser = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (foundUser) {
            setUser(foundUser);
            setPage('dashboard');
            return true;
        }
        return false;
    };

    const handleRegister = (newUser) => {
        if (users.some(u => u.email === newUser.email)) {
            return false; // User already exists
        }
        setUsers([...users, newUser]);
        setUser(newUser);
        setPage('dashboard');
        return true;
    };

    const handleLogout = () => {
        setUser(null);
        setPage('landing');
    };

    const renderPage = () => {
        if (!user) {
             switch (page) {
                case 'login': return <AuthForm title="Login" isLogin={true} setPage={setPage} handleAuth={handleLogin} />;
                case 'register': return <AuthForm title="Register" isLogin={false} setPage={setPage} handleAuth={handleRegister} />;
                default: return <LandingPage setPage={setPage} />;
            }
        }

        switch (page) {
            case 'dashboard': return <Dashboard user={user} setPage={setPage}/>;
            case 'announcements': return <AnnouncementsPage />;
            case 'events': return <EventsPage setPage={setPage}/>;
            case 'timetable': return <TimetablePage />;
            case 'calendar': return <CalendarPage />;
            case 'results': return <ResultsPage />;
            case 'archive': return <ArchivePage />;
            case 'profile': return <ProfilePage user={user}/>;
            default: return <Dashboard user={user} setPage={setPage}/>;
        }
    };
    
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Header setPage={setPage} user={user} logout={handleLogout} isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}


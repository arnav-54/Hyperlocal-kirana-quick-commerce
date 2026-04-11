import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, Star, MapPin, Search, ShoppingCart, 
  ArrowRight, Package, TrendingUp, ShieldCheck, Zap, Plus, Minus,
  LayoutDashboard, Store as StoreIcon, Users, Activity, IndianRupee, Clock, LogOut,
  Truck, BarChart3, Pill, Coffee, Apple, Pizza, Smartphone as PhoneIcon, BookOpen, Quote,
  CheckCircle2, ChevronRight, ClipboardList, Wallet, Navigation, CircleCheck, Mail
} from 'lucide-react';
import './index.css';

// --- Types ---
interface Item { id: string; name: string; price: number; img: string; category: string; }
interface Store { id: string; name: string; type: string; rating: number; time: string; address: string; img: string; inventory: Item[]; helpers: string[]; stats: { dailySales: number; orders: number; growth: string; visitors: number; }; }
interface Helper { id: string; name: string; phone: string; status: 'Online' | 'Offline' | 'In Delivery'; earnings: string; deliveries: number; }
interface Order { 
    id: string; customerName: string; shopId: string; shopName: string; items: any[]; total: number; 
    status: 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'ARRIVED' | 'COMPLETED'; 
    helperId?: string; date: string; payMethod: 'UPI' | 'KHATA';
}

// --- Auth Hook (WITH REGISTRATION & KHATA LOGIC) ---
const useAuth = () => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('active_user') || 'null'));
    const [khataBalance, setKhataBalance] = useState(() => Number(localStorage.getItem('khata_balance')) || 0);

    const [db, setDb] = useState(() => {
        const existing = localStorage.getItem('mock_db');
        if(existing) return JSON.parse(existing);
        return [{ email: 'admin@kiranaconnect.com', password: 'admin123', name: 'System Admin', role: 'STORE_OWNER' }];
    });

    useEffect(() => { localStorage.setItem('mock_db', JSON.stringify(db)); }, [db]);
    useEffect(() => { localStorage.setItem('active_user', JSON.stringify(user)); }, [user]);
    useEffect(() => { localStorage.setItem('khata_balance', khataBalance.toString()); }, [khataBalance]);

    const register = (email: string, password: string, name: string, role: string) => {
        if(db.find((u:any) => u.email === email)) throw new Error('Email is already registered. Please log in.');
        setDb([...db, { email, password, name, role }]);
        return true;
    };

    const login = (email: string, password: string, roleRequested: string) => {
        const found = db.find((u:any) => u.email === email && u.password === password && u.role === roleRequested);
        if(!found) throw new Error('Invalid credentials or you have not signed up yet.');
        setUser({ id: Date.now(), name: found.name, role: found.role, email: found.email });
        return true;
    };

    const logout = () => { setUser(null); };

    return { user, register, login, logout, isAuthenticated: !!user, khataBalance, setKhataBalance };
};

// --- DUMMY DATA ---
const MASTER_CATALOG: Item[] = [
    { id: 'm1', name: 'Aashirvaad Atta 5kg', price: 245, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Atta & Pulses' },
    { id: 'm1b', name: 'Toor Dal 1kg', price: 140, img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400', category: 'Atta & Pulses' },
    { id: 'm1c', name: 'Basmati Rice 5kg', price: 650, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: 'Atta & Pulses' },
    { id: 'm1d', name: 'Chana Dal 1kg', price: 90, img: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400', category: 'Atta & Pulses' },
    { id: 'm1e', name: 'Moong Dal 1kg', price: 110, img: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=400', category: 'Atta & Pulses' },
    
    { id: 'm2', name: 'Tata Salt 1kg', price: 28, img: 'https://images.unsplash.com/photo-1589114066041-9457d19c5c24?w=400', category: 'Spices & Essentials' },
    { id: 'm2b', name: 'Everest Meat Masala 100g', price: 75, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', category: 'Spices & Essentials' },
    { id: 'm2c', name: 'MDH Red Chilli Powder 100g', price: 42, img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400', category: 'Spices & Essentials' },
    { id: 'm2d', name: 'Catch Turmeric Powder 100g', price: 30, img: 'https://images.unsplash.com/photo-1615486171448-4cbabdf47b85?w=400', category: 'Spices & Essentials' },
    { id: 'm2e', name: 'Everest Garam Masala 100g', price: 80, img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', category: 'Spices & Essentials' },
    { id: 'm4', name: 'Fortune Oil 1L', price: 165, img: 'https://images.unsplash.com/photo-1474979266404-7eaac3dc9910?w=400', category: 'Spices & Essentials' },
    
    { id: 'm3', name: 'Maggi Noodles 70g', price: 14, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', category: 'Snacks & Biscuits' },
    { id: 'm3b', name: 'Lay\'s Classic Salted 50g', price: 20, img: 'https://images.unsplash.com/photo-1566478989037-eade2e591782?w=400', category: 'Snacks & Biscuits' },
    { id: 'm3c', name: 'Parle-G 800g', price: 75, img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: 'Snacks & Biscuits' },
    { id: 'm3d', name: 'Haldiram Bhujia 200g', price: 55, img: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', category: 'Snacks & Biscuits' },
    { id: 'm3e', name: 'Hide & Seek 100g', price: 30, img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', category: 'Snacks & Biscuits' },
    
    { id: 'm5', name: 'Amul Taaza Milk 500ml', price: 27, img: 'https://images.unsplash.com/photo-1550583724-125581cc258b?w=400', category: 'Dairy & Cold Items' },
    { id: 'm5b', name: 'Mother Dairy Paneer 200g', price: 85, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'Dairy & Cold Items' },
    { id: 'm5c', name: 'Amul Butter 100g', price: 56, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'Dairy & Cold Items' },
    { id: 'm5d', name: 'Amul Cheese Slices 200g', price: 125, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'Dairy & Cold Items' },
    { id: 'm5e', name: 'Curd 400g', price: 35, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'Dairy & Cold Items' },
    
    { id: 'm11a', name: 'Surf Excel Matic 1kg', price: 230, img: 'https://images.unsplash.com/photo-1584824388147-3bdcc633c7eb?w=400', category: 'Home & Cleaning' },
    { id: 'm11b', name: 'Vim Bar 200g', price: 15, img: 'https://images.unsplash.com/photo-1584824388147-3bdcc633c7eb?w=400', category: 'Home & Cleaning' },
    { id: 'm11c', name: 'Harpic 500ml', price: 90, img: 'https://images.unsplash.com/photo-1584824388147-3bdcc633c7eb?w=400', category: 'Home & Cleaning' },
    { id: 'm11d', name: 'Colin 500ml', price: 95, img: 'https://images.unsplash.com/photo-1584824388147-3bdcc633c7eb?w=400', category: 'Home & Cleaning' },
    
    { id: 'm12a', name: 'Dettol Soap 4x75g', price: 120, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', category: 'Personal Care' },
    { id: 'm12b', name: 'Colgate MaxFresh 150g', price: 95, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', category: 'Personal Care' },
    { id: 'm12c', name: 'Head & Shoulders 180ml', price: 160, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', category: 'Personal Care' },
    { id: 'm12d', name: 'Nivea Body Lotion 200ml', price: 220, img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', category: 'Personal Care' },
    
    { id: 'm8', name: 'Fresh Tomato 1kg', price: 40, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', category: 'Veggies' },
    { id: 'm8b', name: 'Potato 1kg', price: 30, img: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400', category: 'Veggies' },
    { id: 'm8c', name: 'Onion 1kg', price: 35, img: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400', category: 'Veggies' },
    { id: 'm8d', name: 'Cauliflower 1pc', price: 25, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', category: 'Veggies' },
    { id: 'm8e', name: 'Green Chilli 100g', price: 15, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', category: 'Veggies' },
    
    { id: 'm9a', name: 'Crocin Pain Relief', price: 15, img: 'https://images.unsplash.com/photo-1586015555751-639706248359?w=400', category: 'Medical' },
    { id: 'm9b', name: 'Pudin Hara 10s', price: 25, img: 'https://images.unsplash.com/photo-1586015555751-639706248359?w=400', category: 'Medical' },
    { id: 'm9c', name: 'Eno Lemon 100g', price: 130, img: 'https://images.unsplash.com/photo-1586015555751-639706248359?w=400', category: 'Medical' },
    { id: 'm9d', name: 'Volini Gel 30g', price: 105, img: 'https://images.unsplash.com/photo-1586015555751-639706248359?w=400', category: 'Medical' },
    { id: 'm9e', name: 'Digene Tablets 15s', price: 20, img: 'https://images.unsplash.com/photo-1586015555751-639706248359?w=400', category: 'Medical' },
    
    { id: 'm10a', name: 'Duracell AA Batteries 4pcs', price: 140, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Electronics' },
    { id: 'm10b', name: 'Type-C USB Cable', price: 250, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Electronics' },
    { id: 'm10c', name: 'LED Bulb 9W', price: 90, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Electronics' },
    
    { id: 'm13a', name: 'Classmate Notebook', price: 50, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Stationery' },
    { id: 'm13b', name: 'Reynolds Pen Pack', price: 45, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Stationery' },
    { id: 'm13c', name: 'A4 Paper Rim', price: 250, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Stationery' },
];

const INITIAL_HELPERS: Helper[] = [
    { id: 'h1', name: 'Ramlal Yadav', phone: '+91 98765 00001', img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150', status: 'Online', earnings: '₹8,450', deliveries: 142 },
    { id: 'h2', name: 'Suresh Kumar', phone: '+91 88776 00002', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150', status: 'Online', earnings: '₹6,200', deliveries: 98 },
    { id: 'h3', name: 'Vikram Singh', phone: '+91 77665 00003', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', status: 'Online', earnings: '₹12,400', deliveries: 210 },
    { id: 'h4', name: 'Akhil Sharma', phone: '+91 99887 00004', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', status: 'Online', earnings: '₹3,100', deliveries: 45 },
    { id: 'h5', name: 'Rahul Verma', phone: '+91 88990 00005', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Online', earnings: '₹9,800', deliveries: 176 },
    { id: 'h6', name: 'Deepak Chahar', phone: '+91 66554 00006', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Online', earnings: '₹4,500', deliveries: 72 },
];

const INITIAL_STORES: Store[] = [
    { id: 's1', name: 'Sharma Kirana Store', type: 'grocery', rating: 4.8, time: '12m', address: 'Noida Sec 18', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', inventory: MASTER_CATALOG.filter(c => ['Atta & Pulses', 'Spices & Essentials', 'Snacks & Biscuits', 'Dairy & Cold Items', 'Home & Cleaning'].includes(c.category)), helpers: ['h1', 'h2', 'h3', 'h4', 'h5'], stats: { dailySales: 18500, orders: 56, growth: '+15%', visitors: 1200 } },
    { id: 's2', name: 'Daily Needs Supermart', type: 'grocery', rating: 4.6, time: '14m', address: 'Noida Sec 15', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', inventory: MASTER_CATALOG.filter(c => ['Atta & Pulses', 'Spices & Essentials', 'Snacks & Biscuits'].includes(c.category)), helpers: ['h2', 'h3', 'h6', 'h1', 'h4'], stats: { dailySales: 15000, orders: 40, growth: '+10%', visitors: 900 } },
    { id: 's3', name: 'City Care Pharmacy', type: 'medical', rating: 4.9, time: '8m', address: 'Noida Sec 62', img: 'https://images.unsplash.com/photo-1587854692132-471fe244023c?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Medical' || c.category === 'Personal Care'), helpers: ['h4', 'h5', 'h6', 'h1', 'h2'], stats: { dailySales: 9200, orders: 34, growth: '+8%', visitors: 450 } },
    { id: 's4', name: 'Apna Medical', type: 'medical', rating: 4.7, time: '10m', address: 'Noida Sec 16', img: 'https://images.unsplash.com/photo-1550572017-ed20015dd085?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Medical'), helpers: ['h1', 'h2', 'h3', 'h5', 'h6'], stats: { dailySales: 7000, orders: 25, growth: '+12%', visitors: 300 } },
    { id: 's5', name: 'Fresh Farm Veggies', type: 'veggies', rating: 4.5, time: '15m', address: 'Noida Sec 15', img: 'https://images.unsplash.com/photo-1488459711616-d3971a930ec8?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Veggies'), helpers: ['h1', 'h4', 'h5', 'h6', 'h2'], stats: { dailySales: 5400, orders: 20, growth: '+5%', visitors: 200 } },
    { id: 's6', name: 'Green Leaf Veggies', type: 'veggies', rating: 4.6, time: '11m', address: 'Noida Sec 18', img: 'https://images.unsplash.com/photo-1590779033100-9f60705a2f3d?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Veggies'), helpers: ['h2', 'h3', 'h4', 'h5', 'h6'], stats: { dailySales: 4800, orders: 18, growth: '+3%', visitors: 250 } },
    { id: 's7', name: 'Gupta Electronic Needs', type: 'electronics', rating: 4.4, time: '20m', address: 'Noida Sec 18', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Electronics'), helpers: ['h1', 'h3', 'h5', 'h6', 'h4'], stats: { dailySales: 12000, orders: 12, growth: '+2%', visitors: 100 } },
    { id: 's8', name: 'Student Print & Stationery', type: 'stationery', rating: 4.8, time: '15m', address: 'Noida Sec 62', img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Stationery'), helpers: ['h2', 'h4', 'h5', 'h6', 'h1'], stats: { dailySales: 3000, orders: 15, growth: '+20%', visitors: 400 } },
    { id: 's9', name: 'Ramu Kaka Snacks', type: 'food', rating: 4.7, time: '18m', address: 'Noida Sec 15', img: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Snacks & Biscuits'), helpers: ['h1', 'h2', 'h3', 'h4', 'h5'], stats: { dailySales: 4000, orders: 30, growth: '+15%', visitors: 500 } },
    { id: 's10', name: 'Fresh Meat & Fish Mart', type: 'food', rating: 4.6, time: '25m', address: 'Noida Sec 16', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bd682f?w=800', inventory: MASTER_CATALOG.filter(c => c.category === 'Dairy & Cold Items'), helpers: ['h2', 'h3', 'h4', 'h5', 'h6'], stats: { dailySales: 8000, orders: 10, growth: '+5%', visitors: 150 } },
];

const CATEGORIES = [
    { id: 'grocery', name: 'Grocery', icon: <ShoppingBag size={14} /> },
    { id: 'medical', name: 'Medical', icon: <Pill size={14} /> },
    { id: 'food', name: 'Food', icon: <Pizza size={14} /> },
    { id: 'veggies', name: 'Veggies', icon: <Apple size={14} /> },
    { id: 'electronics', name: 'Electronics', icon: <PhoneIcon size={14} /> },
    { id: 'stationery', name: 'Stationery', icon: <BookOpen size={14} /> },
];

function Navbar({ user, logout, cart, searchQuery, setSearchQuery }: any) {
    const navigate = useNavigate();
    const cartCount = cart.reduce((a: number, c: any) => a + c.qty, 0);

    return (
        <nav className="nav-header">
            <div className="container nav-wrap">
                <Link to="/" className="nav-brand">
                    <div className="brand-icon"><Zap size={20} strokeWidth={0} fill="currentColor" /></div>
                    <span className="brand-name">KiranaConnect</span>
                </Link>
                
                <div className="nav-search-wrapper">
                    <div className="nav-search">
                        <Search />
                        <input type="text" placeholder="Search for groceries, shops..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                <div className="nav-actions">
                    <div className="nav-links-menu">
                        <Link to="/marketplace" className="nav-link">Marketplace</Link>
                        {!user && <Link to="/login/merchant" className="nav-link text-saffron font-bold">Admin Login</Link>}
                    </div>

                    {!user ? (
                        <div className="auth-buttons">
                            <Link to="/login/customer" className="nav-link" style={{marginRight: '0.5rem'}}>Log In</Link>
                            <Link to="/signup/customer" className="btn-primary-sm">Sign Up</Link>
                        </div>
                    ) : (
                        <div className="user-hub">
                            {user.role === 'STORE_OWNER' && <Link to="/admin-panel" className="role-pill admin"><LayoutDashboard size={12}/> Admin Panel</Link>}
                            {user.role === 'HELPER' && <Link to="/helper-panel" className="role-pill helper"><Truck size={12}/> Duty Hub</Link>}
                            {user.role === 'CUSTOMER' && <Link to="/orders" className="role-pill customer"><Package size={12}/> Dashboard</Link>}
                            
                            <div className="user-info">
                                <strong>{user.name}</strong>
                                <span>{user.role.replace('_', ' ')}</span>
                            </div>

                            {user.role === 'CUSTOMER' && (
                                <Link to="/cart" className="cart-icon">
                                    <ShoppingCart size={18} />
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </Link>
                            )}

                            <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}><LogOut size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function Landing({ user }: any) {
    const navigate = useNavigate();
    
    return (
        <div className="page-wrapper animate-in bg-white">
            <div className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-text">
                        <div className="hero-badge">⚡ Lightning Fast Hyperlocal</div>
                        <h1 className="hero-title">Your neighborhood shops.<br />Delivered in 15 mins.</h1>
                        <p className="hero-desc">Connecting you directly to trusted local grocery, medical, and food stores through our reliable rider network with BNPL Credit directly into the ecosystem.</p>
                        <div className="hero-cta-box">
                            <button className="btn-primary" onClick={() => navigate('/marketplace')}>Shop Marketplace <ArrowRight size={16} /></button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item"><strong>Trusted</strong><span>By 10k+ locals</span></div>
                            <div className="stat-item"><strong>15 mins</strong><span>Average delivery</span></div>
                        </div>
                    </div>
                    <div className="hero-image-wrapper">
                        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" alt="Shop" className="main-hero-img" />
                    </div>
                </div>
            </div>

            <section className="container pt-6 pb-6" style={{borderBottom: '1px solid var(--slate-100)'}}>
                <h2 className="section-title text-center" style={{fontSize: '2rem'}}>Why KiranaConnect Beats Dark Stores</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem'}}>
                    <div style={{background: 'var(--slate-50)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--slate-200)'}}>
                        <div style={{width: '60px', height: '60px', background: 'var(--brand-green-light)', color: 'var(--brand-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}><Wallet size={24}/></div>
                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem'}}>Digital Udhaar Khata</h3>
                        <p style={{color: 'var(--slate-600)', fontSize: '0.95rem'}}>Bringing the trusted offline "Buy Now Pay Later" Khata system online. Build credit with your local shop dynamically.</p>
                    </div>
                    <div style={{background: 'var(--slate-50)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--slate-200)'}}>
                        <div style={{width: '60px', height: '60px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}><ShieldCheck size={24}/></div>
                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem'}}>Trusted Inventory</h3>
                        <p style={{color: 'var(--slate-600)', fontSize: '0.95rem'}}>Your items come from the verified local offline stores you walk past every day, not a massive opaque warehouse.</p>
                    </div>
                    <div style={{background: 'var(--slate-50)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--slate-200)'}}>
                        <div style={{width: '60px', height: '60px', background: 'var(--brand-yellow-light)', color: 'var(--brand-yellow-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}><Activity size={24}/></div>
                        <h3 style={{fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem'}}>Zero Surge Pricing</h3>
                        <p style={{color: 'var(--slate-600)', fontSize: '0.95rem'}}>By operating via Hyperlocal clusters, our riders have incredibly short transit paths, preventing crazy surge charges.</p>
                    </div>
                </div>
            </section>

            <section className="container pt-6 pb-6">
                <h2 className="section-title text-center" style={{fontSize: '2rem'}}>Customer Stories</h2>
                <div className="testimonial-grid">
                    <div className="t-card">
                        <Quote className="t-quote" size={32} />
                        <p className="t-text">"KiranaConnect brought my local Sharma ji's store to my phone! Using the digital Khata is amazing since I just pay at the end of the month exactly like offline!"</p>
                        <div className="t-author">
                            <div className="t-avatar"><User size={20} /></div>
                            <div><strong style={{display:'block'}}>Rahul Verma</strong><span className="text-gray" style={{fontSize:'0.8rem'}}>Noida Sector 62</span></div>
                        </div>
                    </div>
                    <div className="t-card">
                        <Quote className="t-quote" size={32} />
                        <p className="t-text">"Tracking the delivery is incredibly precise. You literally see when the rider picks it up and arrives. Better than the typical 10-minute promises."</p>
                        <div className="t-author">
                            <div className="t-avatar"><User size={20} /></div>
                            <div><strong style={{display:'block'}}>Priya Singh</strong><span className="text-gray" style={{fontSize:'0.8rem'}}>Greater Noida</span></div>
                        </div>
                    </div>
                    <div className="t-card">
                        <Quote className="t-quote" size={32} />
                        <p className="t-text">"Perfect for medicines at night. City Care Pharmacy dispatched my order immediately and the rider updated status at every step."</p>
                        <div className="t-author">
                            <div className="t-avatar"><User size={20} /></div>
                            <div><strong style={{display:'block'}}>Vikram Das</strong><span className="text-gray" style={{fontSize:'0.8rem'}}>Noida Extension</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="b2b-banner">
                    <h2 style={{fontSize: '3rem', fontWeight: 900}}>Grow Your Local Business With Us</h2>
                    <p style={{fontSize: '1.2rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto'}}>Are you a Kirana Store owner? Digitize your shelves, offer 15-minute fulfillment, and manage your Khata entirely online through our platform. Transform your store into a hyper-local powerhouse.</p>
                    
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" style={{position: 'absolute', right: '-100px', top: '-100px', opacity: 0.1, zIndex: 0, height: '600px'}} alt="bg" />
                </div>
            </section>
        </div>
    );
}

function Marketplace({ stores, searchQuery }: any) {
    const [cat, setCat] = useState('all');
    
    const filtered = stores.filter((s: any) => {
        const matchesCat = (cat === 'all' || s.type === cat);
        const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.inventory.some((i:Item) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesQuery;
    });

    return (
        <div className="page-wrapper animate-in bg-gray">
            <div className="container pb-6 pt-4">
                <div className="promo-strip">
                    <div className="p-text"><Zap size={20} /> SUPER SAVER DEAL</div>
                    <div style={{color: '#991b1b', fontWeight: 600, fontSize: '0.9rem'}}>Add 5+ items OR order above ₹500 for FREE DELIVERY & 5% OFF discounts automatically!</div>
                    <div className="p-code">USE HYPER05</div>
                </div>

                <h1 className="page-title">Explore Local Stores</h1>
                <div className="category-filters">
                    <button className={`cat-btn ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>All Stores</button>
                    {CATEGORIES.map(c => (
                        <button key={c.id} className={`cat-btn ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
                            {c.icon} {c.name}
                        </button>
                    ))}
                </div>

                <div className="shop-grid">
                    {filtered.length === 0 && <div className="text-gray" style={{gridColumn: '1 / -1', padding: '3rem', textAlign: 'center'}}>No matches found for your search.</div>}
                    {filtered.map((s: any) => (
                        <Link to={`/shop/${s.id}`} key={s.id} className="shop-card">
                            <div className="shop-img"><img src={s.img} alt={s.name} /><div className="time-badge">{s.time} Wait</div></div>
                            <div className="shop-content">
                                <div className="s-head"><h3>{s.name}</h3><div className="s-rating"><Star size={10} fill="currentColor" /> {s.rating}</div></div>
                                <p className="s-address">{s.address} • {s.type}</p>
                                <div className="s-footer">
                                    <div className="s-metric"><ShoppingBag size={12} /> {s.inventory.length} Items</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ShopView({ stores, onAddToCart, cart, searchQuery }: any) {
    const { id } = useParams();
    const navigate = useNavigate();
    const shop = stores.find((s: any) => s.id === id);
    const categoriesInShop = Array.from(new Set(shop?.inventory.map((item: Item) => item.category))) || [];
    const [activeCat, setActiveCat] = useState<any>(categoriesInShop[0] || null);

    if (!shop) return <div className="container pt-6"><h2>Shop not found.</h2></div>;

    const visibleItems = shop.inventory.filter((item:Item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = activeCat ? item.category === activeCat : true;
        if (searchQuery.length > 0) return matchesSearch;
        return matchesCat;
    });

    return (
        <div className="page-wrapper animate-in bg-gray">
            <div className="container pb-6 pt-4">
                <button className="btn-link mb-3" onClick={() => navigate('/marketplace')}><ArrowRight style={{transform: 'rotate(180deg)'}} size={14} /> Back to Marketplace</button>
                
                <div className="shop-header-compact">
                    <img src={shop.img} alt={shop.name} />
                    <div className="shop-header-info">
                        <h1>{shop.name}</h1>
                        <p><MapPin size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> {shop.address}</p>
                    </div>
                </div>

                <div className="shop-inventory-layout">
                    <aside className="shop-sidebar">
                        <h3 style={{fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 800, paddingLeft: '1rem'}}>Categories</h3>
                        {categoriesInShop.map((cat: any) => (
                            <button key={cat} className={`category-menu-item ${activeCat === cat && !searchQuery ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>{cat}</button>
                        ))}
                    </aside>
                    <main className="shop-main-content">
                        <h2 className="category-section-title">{searchQuery ? `Search Results for "${searchQuery}"` : (activeCat || 'Inventory')}</h2>
                        <div className="item-grid">
                            {visibleItems.map((item: any) => {
                                const inCart = cart.find((c: any) => c.id === item.id);
                                return (
                                    <div key={item.id} className="item-card">
                                        <div className="i-img"><img src={item.img} alt={item.name} /></div>
                                        <div className="i-content">
                                            <h4 className="i-title">{item.name}</h4>
                                            <div className="i-footer">
                                                <div className="i-price">₹{item.price}</div>
                                                {!inCart ? <button className="btn-add-item" onClick={() => onAddToCart(item, shop)}>ADD</button> :
                                                (<div className="item-qty-selector"><button onClick={() => onAddToCart(item, shop, -1)}><Minus size={12} /></button><span>{inCart.qty}</span><button onClick={() => onAddToCart(item, shop, 1)}><Plus size={12} /></button></div>)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function CustomerOrders({ orders, helpers, khataBalance, onCustomerAction }: any) {
    const userOrders = orders.filter((o:any) => true);

    return (
        <div className="page-wrapper animate-in bg-gray">
            <div className="container pt-4 pb-6">
                
                {/* BNPL Dashboard */}
                <div className="khata-card">
                    <div>
                        <span className="khata-badge">Your Digital Khata</span>
                        <div className="khata-balance">₹{khataBalance}</div>
                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>Outstanding Udhaar Balance. Next settlement date: 1st of next month.</p>
                    </div>
                    <div><Wallet size={48} opacity={0.5} color="var(--brand-yellow)" /></div>
                </div>

                <h1 className="page-title mb-4">My Dashboard</h1>

                {userOrders.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid var(--slate-200)'}}>
                        <Package size={40} className="text-gray" style={{margin: '0 auto 1rem'}}/>
                        <h3>No active orders</h3>
                        <Link to="/marketplace" className="btn-primary mt-3 d-inline-flex">Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {userOrders.reverse().map((o:any) => {
                            const trackingRef = o.id.split('-')[1];
                            const assignedHelper = o.helperId ? helpers.find((h:any) => h.id === o.helperId) : null;
                            
                            return (
                                <div key={o.id} className="admin-card" style={{margin: 0, padding: '1.5rem'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                                        <div>
                                            <div style={{fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600}}>ORDER #{trackingRef}</div>
                                            <div className="font-bold" style={{fontSize: '1.2rem'}}>{o.shopName}</div>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <div style={{fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600}}>Total: ₹{o.total} ({o.payMethod})</div>
                                            {o.status === 'COMPLETED' ? <span className="badge badge-green mt-2">Delivered & verified</span> : <span className="badge badge-orange mt-2">Delivery in progress</span>}
                                        </div>
                                    </div>

                                    <div style={{display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 280px', gap: '2rem'}}>
                                        <div>
                                            <h4 style={{fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--slate-400)', marginBottom: '0.8rem', fontWeight: 800}}>Live Action Track</h4>
                                            <div className="track-wrapper">
                                                <div className={`track-step ${o.status !== 'PENDING' ? 'done' : 'active'}`}>
                                                    <div className="track-icon"><CheckCircle2/></div>
                                                    <div className="track-text"><h4>Order Confirmed</h4><p>Admin prepares bag.</p></div>
                                                </div>
                                                <div className={`track-step ${o.status === 'OUT_FOR_DELIVERY' || o.status === 'ARRIVED' || o.status === 'COMPLETED' ? 'done' : (o.status==='CONFIRMED' ? 'active' : '')}`}>
                                                    <div className="track-icon"><Navigation size={14}/></div>
                                                    <div className="track-text"><h4>Picked up by Rider</h4><p>On the way to you.</p></div>
                                                </div>
                                                <div className={`track-step ${o.status === 'ARRIVED' || o.status === 'COMPLETED' ? 'done' : ''}`}>
                                                    <div className="track-icon"><MapPin size={14}/></div>
                                                    <div className="track-text"><h4>Arrived</h4><p>Rider is waiting outside.</p></div>
                                                </div>
                                                {o.status === 'ARRIVED' && (
                                                    <button className="btn-primary mt-3" onClick={() => onCustomerAction(o.id, 'COMPLETED')}>Accept Delivery</button>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{background: 'var(--slate-50)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--slate-200)', height: 'fit-content'}}>
                                            <h4 style={{fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--slate-400)', marginBottom: '0.8rem', fontWeight: 800}}>Delivery Details</h4>
                                            {o.status === 'PENDING' ? <div className="text-gray" style={{fontSize: '0.9rem'}}>Waiting for store assignment.</div> :
                                            o.status === 'COMPLETED' ? <div className="text-gray"><CircleCheck color="var(--brand-green)" style={{marginBottom: '0.5rem'}}/><br/>Delivered safely.</div> : (
                                                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                                    <div style={{width: '40px', height: '40px', background: 'var(--white)', border: '1px solid var(--slate-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={20} className="text-brand"/></div>
                                                    <div><div className="font-bold" style={{fontSize: '0.95rem'}}>{assignedHelper?.name}</div><div style={{fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600}}>{assignedHelper?.phone}</div></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function CartPage({ cart, onPlaceOrder, authHook, onAddToCart }: any) {
    const navigate = useNavigate();
    const [payMethod, setPayMethod] = useState<'UPI' | 'KHATA'>('UPI');
    let subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.qty), 0);
    const cartQty = cart.reduce((acc: number, item: any) => acc + item.qty, 0);

    // Dynamic Logic (Free delivery > 500 or 5 items + discount)
    const isPromoActive = subtotal >= 500 || cartQty >= 5;
    let deliveryFee = isPromoActive ? 0 : 25;
    let discount = isPromoActive ? Math.floor(subtotal * 0.05) : 0;
    let total = subtotal - discount + deliveryFee;

    const handleSubmit = () => {
        if(payMethod === 'KHATA') {
            authHook.setKhataBalance((prev: number) => prev + total); // Add to Digital Udhaar
        }
        onPlaceOrder(total, payMethod);
        navigate('/orders');
    }
    
    return (
        <div className="page-wrapper bg-gray animate-in">
            <div className="container pt-4 pb-6">
                <h1 className="page-title mb-4">Your Cart</h1>
                {cart.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px solid var(--slate-200)'}}>
                        <ShoppingCart size={40} className="text-gray" style={{margin: '0 auto 1rem'}}/>
                        <h3>Cart is empty</h3>
                        <Link to="/marketplace" className="btn-primary mt-3 d-inline-flex">Browse Items</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-card">
                            {cart.map((item: any) => (
                                <div key={item.id} className="cart-item-row">
                                    <img src={item.img} className="ci-img" alt={item.name}/>
                                    <div className="ci-details"><div className="ci-title">{item.name}</div><div className="ci-shop">{item.shopName}</div></div>
                                    <div className="ci-price">₹{item.price}</div>
                                    <div className="ci-qty-ctrl" style={{display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--slate-50)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--slate-200)'}}>
                                        <button onClick={() => onAddToCart(item, {id: item.shopId, name: item.shopName}, -1)} style={{cursor:'pointer', border:'none', background:'transparent', fontSize:'1.2rem', padding: '0 0.5rem', opacity: 0.7}}>-</button>
                                        <span style={{fontWeight: 700, width: '20px', textAlign: 'center'}}>{item.qty}</span>
                                        <button onClick={() => onAddToCart(item, {id: item.shopId, name: item.shopName}, 1)} style={{cursor:'pointer', border:'none', background:'transparent', fontSize:'1.2rem', padding: '0 0.5rem', color: 'var(--brand-green)'}}>+</button>
                                    </div>
                                    <div style={{fontWeight: 800, width: '60px', textAlign: 'right'}}>₹{item.price * item.qty}</div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-card">
                            <h3 style={{marginBottom: '1rem'}}>Payment details</h3>
                            {isPromoActive && <div className="badge badge-green mb-3" style={{display: 'block', textAlign: 'center'}}>Promo Active: Free Delivery + 5% OFF!</div>}
                            
                            <div className="summary-row"><span>Item Total</span><span>₹{subtotal}</span></div>
                            <div className="summary-row"><span>Delivery Fee</span><span>{isPromoActive ? <><del style={{color:'var(--slate-400)', marginRight:'5px'}}>₹25</del><span style={{color:'var(--brand-green)'}}>FREE</span></> : `₹${deliveryFee}`}</span></div>
                            {discount > 0 && <div className="summary-row" style={{color: 'var(--brand-green)'}}><span>Platform Discount</span><span>-₹{discount}</span></div>}
                            <div className="summary-row total"><span>To Pay</span><span>₹{total}</span></div>

                            <div className="payment-methods">
                                <label className={`pay-method ${payMethod === 'UPI' ? 'active-pm' : ''}`}>
                                    <input type="radio" checked={payMethod === 'UPI'} onChange={() => setPayMethod('UPI')} />
                                    <div className="pay-method-content"><h4>Instant Payment</h4><p>UPI, Credit/Debit Card</p></div>
                                </label>
                                <label className={`pay-method ${payMethod === 'KHATA' ? 'active-pm' : ''}`}>
                                    <input type="radio" checked={payMethod === 'KHATA'} onChange={() => setPayMethod('KHATA')} />
                                    <div className="pay-method-content"><h4>Add to Khata</h4><p>Buy Now, Pay Later (Month end settlement)</p></div>
                                </label>
                            </div>

                            <button className="btn-primary w-full mt-3" onClick={handleSubmit}>Place Order</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AdminPanel({ stores, setStores, helpers, setHelpers, orders, onConfirmOrder, onHelperStatusUpdate }: any) {
    const [activeModule, setActiveModule] = useState('live'); // 'live', 'inventory', 'helpers', 'stores'
    const [selectedStoreId, setSelectedStoreId] = useState(stores?.[0]?.id || '');
    const [assignedRiders, setAssignedRiders] = useState<any>({});
    
    const selectedStore = stores?.find((s: any) => s.id === selectedStoreId) || stores?.[0] || { id: 's0', name: 'Unknown', inventory: [], helpers: [], stats: { dailySales:0, orders:0, growth:'0%', visitors:0 } };
    
    // Derived dashboard stats
    const storeOrders = orders?.filter((o:any) => activeModule === 'live' ? o.shopId === selectedStore?.id : true) || [];
    const activeOrders = storeOrders.filter((o:any) => o.status !== 'COMPLETED');
    const completedOrders = storeOrders.filter((o:any) => o.status === 'COMPLETED');
    
    const [modalConfig, setModalConfig] = useState<any>(null); // { type: 'PRODUCT' | 'HELPER' | 'STORE', title: string }
    const [modalData, setModalData] = useState<any>({});

    const handleModalSubmit = (e: any) => {
        e.preventDefault();
        if(modalConfig.type === 'PRODUCT') {
            const newItem = { id: 'p'+Math.random(), name: modalData.name, price: parseInt(modalData.price), category: modalData.category || 'General', originalPrice: parseInt(modalData.price)+20, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' };
            setStores((prev: any) => prev.map((s:any) => s.id === selectedStoreId ? { ...s, inventory: [newItem, ...s.inventory] } : s));
        } else if(modalConfig.type === 'HELPER') {
            const newHelper = { id: 'h' + Math.random(), name: modalData.name, phone: modalData.phone || '+91 00000 00000', status: 'Online', earnings: '₹0', deliveries: 0 };
            setHelpers((prev:any) => [...prev, newHelper]);
            setStores((prev:any) => prev.map((s:any) => s.id === selectedStoreId ? { ...s, helpers: [...s.helpers, newHelper.id] } : s));
        } else if(modalConfig.type === 'STORE') {
            const newStore = { id: 's' + Math.random(), name: modalData.name, address: modalData.address || 'Local Market', type: 'grocery', rating: 5.0, time: '10m', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', inventory: [], helpers: [], stats: { dailySales: 0, orders: 0, visitors: 0, growth: '0%' } };
            setStores((prev:any) => [...prev, newStore]);
            setSelectedStoreId(newStore.id);
        }
        setModalConfig(null); setModalData({});
    };

    const triggerAction = (actionName: string) => alert(`${actionName} - Verified`);
    
    const openModal = (type: string, title: string) => setModalConfig({ type, title });

    return (
        <div className="dashboard-layout animate-in">
            <aside className="dashboard-sidebar">
                <div style={{padding: '1.5rem'}}>
                    <div className="sidebar-title">Admin Modules</div>
                    <nav className="sidebar-nav">
                        <button className={activeModule === 'live' ? 'active' : ''} onClick={() => setActiveModule('live')}>
                            <span style={{flex: 1}}>Live Operations</span>
                            {activeModule === 'live' && <span className="badge">New</span>}
                        </button>
                        <button className={activeModule === 'inventory' ? 'active' : ''} onClick={() => setActiveModule('inventory')}>
                            Master Inventory
                        </button>
                        <button className={activeModule === 'helpers' ? 'active' : ''} onClick={() => setActiveModule('helpers')}>
                            Delivery Partners
                        </button>
                        <button className={activeModule === 'stores' ? 'active' : ''} onClick={() => setActiveModule('stores')}>
                            Registered Stores
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1 className="dash-title">
                        {activeModule === 'live' ? 'Platform Operations' : 
                         activeModule === 'inventory' ? 'Master Inventory' : 
                         activeModule === 'helpers' ? 'Delivery Fleet' : 'Partner Network'}
                    </h1>
                    {activeModule === 'inventory' && <button className="btn-primary" onClick={() => openModal('PRODUCT', 'Add New Inventory Item')}>+ Add Product</button>}
                    {activeModule === 'helpers' && <button className="btn-primary" onClick={() => openModal('HELPER', 'Onboard New Delivery Partner')}>+ Onboard Helper</button>}
                    {activeModule === 'stores' && <button className="btn-primary" onClick={() => openModal('STORE', 'Register A New Store')}>+ Register Store</button>}
                </div>

                {activeModule !== 'stores' && (
                    <div className="store-tabs" style={{marginBottom: '2rem'}}>
                        {stores.map((s:any) => (
                            <button key={s.id} className={`store-tab ${selectedStoreId === s.id ? 'active' : ''}`} onClick={() => setSelectedStoreId(s.id)}>
                                {s.name}
                            </button>
                        ))}
                    </div>
                )}

                {activeModule === 'live' && (
                    <div className="admin-grid-layout" style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem'}}>
                        <div className="admin-card">
                            <div className="admin-card-header">
                                <h3>Active Deployments</h3>
                                <div className="badge badge-orange">{activeOrders.length} In Progress</div>
                            </div>
                            {activeOrders.length === 0 ? (
                                <div className="text-gray text-center p-5 font-bold">No active orders right now.</div>
                            ) : (
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    {activeOrders.map((o:any) => (
                                        <div key={o.id} style={{padding: '1.5rem', borderBottom: '1px solid var(--slate-100)'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem'}}>
                                                <div className="font-bold text-slate-900" style={{fontSize: '1.1rem'}}>{o.customerName}</div>
                                                <div className="font-bold text-brand">₹{o.total}</div>
                                            </div>
                                            <div style={{fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1rem', fontWeight: 600}}>OrderID: {o.id} • Method: {o.payMethod}</div>
                                            
                                            <div style={{background:'var(--slate-50)', padding:'0.8rem', borderRadius:'10px', marginBottom:'1.2rem', border:'1px solid var(--slate-100)'}}>
                                                <div style={{fontSize:'0.75rem', fontWeight:800, color:'var(--slate-400)', textTransform:'uppercase', marginBottom:'0.5rem'}}>Items In Bag</div>
                                                {o.items.map((item:any, idx:number)=>(
                                                    <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', marginBottom:'0.2rem'}}>
                                                        <span style={{fontWeight:600}}>{item.name}</span>
                                                        <span style={{color:'var(--slate-600)', fontWeight:800}}>x{item.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {o.status === 'PENDING' ? (
                                                <div style={{display: 'flex', gap: '1rem'}}>
                                                    <select 
                                                        className="form-group input" 
                                                        style={{padding: '0.6rem 1rem', border: '1px solid var(--slate-400)', borderRadius: '10px', flex: 1, fontWeight: 700}}
                                                        value={assignedRiders[o.id] || selectedStore.helpers[0] || 'h1'}
                                                        onChange={(e) => setAssignedRiders({...assignedRiders, [o.id]: e.target.value})}
                                                    >
                                                        {selectedStore.helpers.map((h:string) => <option key={h} value={h}>{helpers.find((hx:any)=>hx.id===h)?.name || h}</option>)}
                                                    </select>
                                                    <button className="btn-primary" onClick={() => onConfirmOrder(o.id, assignedRiders[o.id] || selectedStore.helpers[0] || 'h1')}>Assign Rider</button>
                                                </div>
                                            ) : (
                                                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginTop: '0.5rem'}}>
                                                    {o.status === 'CONFIRMED' && <div className="badge badge-orange text-center w-full" style={{display: 'block', padding: '0.6rem'}}>📦 Packed & Ready — Rider Picking Up</div>}
                                                    {o.status === 'OUT_FOR_DELIVERY' && <div className="badge badge-orange text-center w-full" style={{display: 'block', padding: '0.6rem'}}>🚴 Out for Delivery</div>}
                                                    {o.status === 'ARRIVED' && <div className="badge text-center w-full" style={{display: 'block', padding: '0.6rem', background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', fontWeight: 800}}>📍 Rider Arrived <span style={{display:'inline-block', width:'8px', height:'8px', background:'#22c55e', borderRadius:'50%', marginLeft:'6px', animation:'pulse 1.5s infinite'}}></span></div>}
                                                    {o.status === 'COMPLETED' && <div className="badge badge-green text-center w-full" style={{display: 'block', padding: '0.6rem'}}>✅ Delivered & Completed</div>}
                                                    <div className="text-center font-bold text-gray mt-2" style={{fontSize: '0.85rem'}}>Assigned: {helpers.find((h:any)=>h.id === o.helperId)?.name || 'Unknown'}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {completedOrders.length > 0 && (
                                <div style={{padding: '1.5rem', borderTop: '2px solid var(--slate-100)', marginTop: '1rem'}}>
                                    <h4 style={{fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--slate-400)', fontWeight: 800, marginBottom: '1rem'}}>Recently Completed</h4>
                                    {completedOrders.map((o:any) => (
                                        <div key={o.id} style={{background: 'var(--slate-50)', padding: '1rem', borderRadius: '12px', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <div>
                                                <div className="font-bold">{o.customerName}</div>
                                                <div style={{fontSize: '0.75rem', color: 'var(--slate-500)'}}>{o.id} • {o.items.length} Items</div>
                                            </div>
                                            <div style={{textAlign: 'right'}}>
                                                <div className="font-bold" style={{color: 'var(--brand-green)'}}>₹{o.total}</div>
                                                <div className="badge badge-green">COMPLETED</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="admin-card text-center" style={{padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            <h3>Daily Statistics</h3>
                            <div style={{fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-yellow-dark)'}}>₹{selectedStore.stats?.dailySales.toLocaleString()}</div>
                            <div style={{color: 'var(--slate-500)', fontWeight: 700}}>Revenue Generated</div>
                            <hr style={{border: 'none', borderTop: '1px solid var(--slate-200)', margin: '1rem 0'}}/>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800}}>
                                <span style={{color: 'var(--slate-600)'}}>Total Visitors</span>
                                <span style={{color: 'var(--slate-900)'}}>{selectedStore.stats?.visitors}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeModule === 'inventory' && (
                    <div className="admin-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product Item</th>
                                    <th>Category</th>
                                    <th>Retail Price</th>
                                    <th>Availability</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedStore.inventory.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="font-bold">{item.name}</td>
                                        <td>{item.category}</td>
                                        <td className="font-bold text-brand">₹{item.price}</td>
                                        <td><div className="badge badge-green">IN STOCK</div></td>
                                        <td><button className="btn-link text-saffron" onClick={() => triggerAction(`Edit Stock level for ${item.name}`)}>Edit Stock</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeModule === 'helpers' && (
                    <div className="helper-grid">
                        {(selectedStore.helpers || []).map((hId: string) => {
                            const helper = helpers.find((h:any) => h.id === hId) || helpers[0] || { name: 'Unknown', phone: '-', status: 'busy', deliveries: 0, earnings: '₹0' };
                            const activeOrder = orders.find((ox:any) => ox.helperId === helper.id && ['CONFIRMED','OUT_FOR_DELIVERY','ARRIVED'].includes(ox.status));
                            const liveStatus = activeOrder ? (activeOrder.status === 'ARRIVED' ? 'Arrived' : 'In Delivery') : 'Online';
                            return (
                                <div key={hId} className="hc-compact">
                                    <div className="hcc-top">
                                        {helper.img ? <img src={helper.img} alt={helper.name} className="hcc-avatar" style={{objectFit:'cover', width:'45px', height:'45px', borderRadius:'10px'}}/> : <div className="hcc-avatar bg-brand text-brand font-bold">{helper.name.charAt(0)}</div>}
                                        <div className="hcc-info"><h4>{helper.name}</h4><p>{helper.phone}</p></div>
                                        <div className={`hcc-status ${liveStatus === 'Online' ? 'active' : 'busy'}`}>{liveStatus}</div>
                                    </div>
                                    <div className="hcc-stats">
                                        <div><span>Success</span><strong>{helper.deliveries} orders</strong></div>
                                        <div><span>Commission</span><strong>{helper.earnings}</strong></div>
                                    </div>
                                    {activeOrder && (
                                        <div style={{marginTop:'0.8rem', padding:'0.7rem', background: activeOrder.status === 'ARRIVED' ? '#dbeafe' : '#fff7ed', borderRadius:'10px', border: activeOrder.status === 'ARRIVED' ? '1px solid #93c5fd' : '1px solid #fed7aa'}}>
                                            <div style={{fontSize:'0.75rem', fontWeight:700, color:'#6b7280', marginBottom:'0.4rem'}}>Active: Order #{activeOrder.id?.split('-')[1]}</div>
                                            {activeOrder.status === 'CONFIRMED' && <button className="btn-primary w-full text-center" style={{padding:'0.5rem', fontSize:'0.85rem'}} onClick={() => onHelperStatusUpdate(activeOrder.id, 'OUT_FOR_DELIVERY')}>🚴 Mark Picked Up</button>}
                                            {activeOrder.status === 'OUT_FOR_DELIVERY' && <button className="w-full text-center" style={{padding:'0.5rem', fontSize:'0.85rem', background:'#f97316', color:'white', border:'none', borderRadius:'8px', fontWeight:800, cursor:'pointer'}} onClick={() => onHelperStatusUpdate(activeOrder.id, 'ARRIVED')}>📍 Mark Arrived</button>}
                                            {activeOrder.status === 'ARRIVED' && <div style={{textAlign:'center', fontWeight:700, fontSize:'0.85rem', color:'#1e40af'}}>⏳ Waiting for customer confirmation...</div>}
                                        </div>
                                    )}
                                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.8rem'}}>
                                        <button className="btn-outline w-full text-center" onClick={() => triggerAction(`View Logs for ${helper.name}`)}>History</button>
                                        <button className="btn-primary w-full text-center" style={{padding: '0.4rem'}} onClick={() => triggerAction(`Assign Specific Shift/Duty for ${helper.name}`)}>Assign Shift</button>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="hc-compact" onClick={() => triggerAction('Assign an unassigned pool rider to this store')} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', minHeight: '160px', background: 'var(--slate-50)', border: '2px dashed var(--slate-400)', cursor: 'pointer'}}>
                            <div style={{width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--slate-400)'}}>+</div>
                            <h4 style={{color: 'var(--slate-600)'}}>Assign Target Rider</h4>
                        </div>
                    </div>
                )}

                {activeModule === 'stores' && (
                    <div className="shop-grid">
                        {stores.map((s:any) => (
                            <div key={s.id} className="shop-card">
                                <div className="shop-img"><img src={s.img} alt={s.name}/></div>
                                <div className="shop-content">
                                    <div className="s-head"><h3>{s.name}</h3></div>
                                    <p className="s-address">{s.address}</p>
                                    <div style={{fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem'}}><strong>{s.inventory?.length}</strong> Items Listed • <strong>{s.helpers?.length}</strong> Riders</div>
                                    <button className="btn-outline w-full text-center" onClick={() => triggerAction(`Open Settings for ${s.name}`)}>Manage Store Config</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>
            
            {modalConfig && (
                <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div className="auth-card animate-in" style={{width: '450px', padding: '2rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                            <h2>{modalConfig.title}</h2>
                            <button onClick={()=>setModalConfig(null)} style={{background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--slate-400)'}}>×</button>
                        </div>
                        <form onSubmit={handleModalSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            {modalConfig.type === 'PRODUCT' && <>
                                <div className="form-group"><label>Product Name</label><input type="text" onChange={e=>setModalData({...modalData, name: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                                <div className="form-group"><label>Price (₹)</label><input type="number" onChange={e=>setModalData({...modalData, price: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                                <div className="form-group"><label>Category</label><input type="text" onChange={e=>setModalData({...modalData, category: e.target.value})} placeholder="e.g. Atta & Pulses" required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                            </>}
                            {modalConfig.type === 'HELPER' && <>
                                <div className="form-group"><label>Partner Name</label><input type="text" onChange={e=>setModalData({...modalData, name: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                                <div className="form-group"><label>Phone Number</label><input type="text" onChange={e=>setModalData({...modalData, phone: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                            </>}
                            {modalConfig.type === 'STORE' && <>
                                <div className="form-group"><label>Store Title</label><input type="text" onChange={e=>setModalData({...modalData, name: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                                <div className="form-group"><label>Location / Address</label><input type="text" onChange={e=>setModalData({...modalData, address: e.target.value})} required style={{background:'var(--white)', border:'1px solid var(--slate-400)'}}/></div>
                            </>}
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button type="button" className="btn-outline w-full" onClick={()=>setModalConfig(null)}>Cancel</button>
                                <button type="submit" className="btn-primary w-full">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function HelperPanel({ orders, onStatusUpdate }: any) {
    const helperOrders = orders.filter((o:any) => o.helperId && o.status !== 'COMPLETED'); // Show all assigned active prototype orders
    
    return (
        <div className="page-wrapper animate-in bg-gray pt-6 pb-6">
            <div className="container" style={{maxWidth: '600px'}}>
                <h1 className="page-title mb-4">Duty Dashboard (Rider App)</h1>
                {helperOrders.length === 0 ? (
                    <div style={{background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--slate-200)', textAlign: 'center'}}>
                        <Truck size={40} className="text-saffron mb-3 mx-auto"/>
                        <h3 className="mb-2">No Active Missions</h3>
                        <p className="text-gray">Waiting for admin dispatch.</p>
                    </div>
                ) : (
                    helperOrders.map((o:any) => (
                        <div key={o.id} className="admin-card" style={{padding: '2rem'}}>
                            <div className="badge badge-orange mb-3">Live Mission</div>
                            <h2>{o.shopName}</h2>
                            <p className="text-gray mb-4">Drop off to: <strong>{o.customerName}</strong></p>
                            
                            <div style={{background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between'}}>
                                <div><div className="font-bold">Total Collect</div><div className="text-gray" style={{fontSize: '0.8rem'}}>{o.payMethod === 'KHATA' ? 'Added to BNPL' : 'UPI Match'}</div></div>
                                <h3 style={{color: 'var(--brand-green)'}}>₹{o.total}</h3>
                            </div>

                            {o.status === 'CONFIRMED' && <button className="btn-primary w-full" style={{padding:'1rem'}} onClick={() => onStatusUpdate(o.id, 'OUT_FOR_DELIVERY')}>Mark as Picked Up</button>}
                            {o.status === 'OUT_FOR_DELIVERY' && <button className="btn-primary w-full" style={{padding:'1rem', background:'var(--brand-yellow)'}} onClick={() => onStatusUpdate(o.id, 'ARRIVED')}>Report Arrived at location</button>}
                            {o.status === 'ARRIVED' && <div className="badge badge-green text-center w-full">Waiting for customer to accept inside App...</div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function DemoSwitcher() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    
    const currentPage = location.pathname;
    const pages = [
        { label: '🏪 Admin Panel', path: '/admin-panel', desc: 'Step 1: Assign Rider to order', color: '#1f2937' },
        { label: '🚴 Rider Dashboard', path: '/helper-panel', desc: 'Step 2: Picked Up → Arrived', color: '#ea580c' },
        { label: '👤 Customer Orders', path: '/orders', desc: 'Step 3: Accept Delivery', color: '#0b8e36' },
    ];

    return (
        <div style={{position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, fontFamily: 'Outfit, sans-serif'}}>
            {open && (
                <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', padding: '1.2rem', marginBottom: '0.8rem', width: '280px', border: '1px solid #e5e7eb'}}>
                    <div style={{fontWeight: 800, fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem'}}>🔄 Demo Flow Switcher</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        {pages.map(p => (
                            <button key={p.path} onClick={() => { navigate(p.path); setOpen(false); }} 
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                                    padding: '0.8rem 1rem', borderRadius: '10px', border: currentPage === p.path ? `2px solid ${p.color}` : '1px solid #e5e7eb',
                                    background: currentPage === p.path ? '#f9fafb' : 'white', cursor: 'pointer', width: '100%', textAlign: 'left',
                                    transition: '0.2s'
                                }}>
                                <span style={{fontWeight: 800, fontSize: '0.9rem', color: '#1f2937'}}>{p.label}</span>
                                <span style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '2px'}}>{p.desc}</span>
                            </button>
                        ))}
                    </div>
                    <div style={{marginTop: '0.8rem', padding: '0.6rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.72rem', color: '#1e40af', fontWeight: 600, lineHeight: 1.4}}>
                        💡 Flow: Place order → Admin assigns rider → Rider picks up → Rider marks arrived → Customer confirms delivery
                    </div>
                </div>
            )}
            <button onClick={() => setOpen(!open)} style={{
                width: '52px', height: '52px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', fontSize: '1.4rem',
                boxShadow: '0 8px 25px rgba(249,115,22,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)'
            }}>
                {open ? '✕' : '⚡'}
            </button>
        </div>
    );
}

function AuthPage({ isSignup, authHook }: any) {
    const { role } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (role === 'merchant' && !isSignup) { setEmail('admin@kiranaconnect.com'); setPassword('admin123'); }
        if (role === 'helper' && !isSignup) { setEmail('helper@kirana.com'); setPassword('helper123'); }
    }, [role, isSignup]);

    const handleAuth = (e: any) => {
        e.preventDefault();
        setErrorMsg('');
        const roleType = role === 'merchant' ? 'STORE_OWNER' : role === 'helper' ? 'HELPER' : 'CUSTOMER';
        try {
            if (isSignup) { authHook.register(email, password, name, roleType); authHook.login(email, password, roleType); successRedirect(roleType); } 
            else { authHook.login(email, password, roleType); successRedirect(roleType); }
        } catch(err: any) { setErrorMsg(err.message); }
    };
    const successRedirect = (roleType: string) => { navigate(roleType === 'STORE_OWNER' ? '/admin-panel' : roleType === 'HELPER' ? '/helper-panel' : '/marketplace'); };

    return (
        <div className="auth-wrapper animate-in"><div className="auth-card">
            <div className="auth-header"><h2>{isSignup ? 'Create Account' : 'Platform Login'}</h2><p>Accessing as <strong>{role?.toUpperCase()}</strong></p></div>
            {role !== 'customer' && !isSignup && (
                <div className="alert-info"><strong>Demo Credentials:</strong><br/>{role === 'merchant' ? 'admin@kiranaconnect.com / admin123' : 'helper@kirana.com / helper123'}</div>
            )}
            {errorMsg && <div style={{background: 'var(--red-light)', border: '1px solid var(--red)', color: 'var(--red)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600}}>{errorMsg}</div>}
            <form className="auth-form" onSubmit={handleAuth}>
                {isSignup && <div className="form-group"><label>Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} required /></div>}
                <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
                <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
                <button type="submit" className="btn-primary w-full mt-3">{isSignup ? 'Sign Up' : 'Log In'}</button>
            </form>
            {role === 'customer' && (
                <div className="text-center mt-4">{isSignup ? <Link to={`/login/${role}`} onClick={()=>setErrorMsg('')} className="text-saffron font-bold">Log in</Link> : <Link to={`/signup/${role}`} onClick={()=>setErrorMsg('')} className="text-saffron font-bold">Sign up</Link>}</div>
            )}
        </div></div>
    );
}

// ... Footer logic left the same to save tokens
function Footer() {
    return (
        <footer style={{background: 'var(--slate-900)', color: 'white', marginTop: 'auto'}}>
            <div className="container" style={{padding: '3rem 1.5rem 2rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem'}}>
                    {/* Brand */}
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem'}}>
                            <div style={{width: '36px', height: '36px', background: 'var(--brand-yellow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'}}>⚡</div>
                            <span style={{fontWeight: 800, fontSize: '1.2rem'}}>KiranaConnect</span>
                        </div>
                        <p style={{color: 'var(--slate-400)', fontSize: '0.85rem', lineHeight: 1.6}}>India's first hyperlocal quick-commerce platform connecting neighborhood Kirana stores with modern delivery infrastructure.</p>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 style={{fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--brand-yellow)'}}>Quick Links</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                            <Link to="/marketplace" style={{color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: '0.2s'}}>Marketplace</Link>
                            <Link to="/login/customer" style={{color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500}}>Customer Login</Link>
                            <Link to="/login/merchant" style={{color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500}}>Store Owner Login</Link>
                            <Link to="/login/helper" style={{color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500}}>Rider Login</Link>
                        </div>
                    </div>
                    {/* Categories */}
                    <div>
                        <h4 style={{fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--brand-yellow)'}}>Categories</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                            {['Grocery & Essentials', 'Pharmacy & Medical', 'Fresh Vegetables', 'Snacks & Beverages', 'Electronics & Stationery'].map(c => (
                                <Link key={c} to="/marketplace" style={{color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500}}>{c}</Link>
                            ))}
                        </div>
                    </div>
                    {/* Contact */}
                    <div>
                        <h4 style={{fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', color: 'var(--brand-yellow)'}}>Contact Us</h4>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--slate-400)', fontSize: '0.85rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><MapPin size={14}/> Noida, Uttar Pradesh, India</div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><PhoneIcon size={14}/> +91 98765 43210</div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Mail size={14}/> support@kiranaconnect.in</div>
                        </div>
                        <div style={{display: 'flex', gap: '0.8rem', marginTop: '1.2rem'}}>
                            {['GitHub', 'Twitter', 'LinkedIn'].map(s => (
                                <a key={s} href="#" style={{width: '34px', height: '34px', background: 'var(--slate-800)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 700, transition: '0.2s'}}>{s[0]}</a>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Bottom bar */}
                <div style={{borderTop: '1px solid var(--slate-800)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                    <p style={{color: 'var(--slate-500)', fontSize: '0.8rem', fontWeight: 500}}>© {new Date().getFullYear()} KiranaConnect. All rights reserved. Built with ❤️ for India's Kirana ecosystem.</p>
                    <div style={{display: 'flex', gap: '1.5rem'}}>
                        {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
                            <a key={l} href="#" style={{color: 'var(--slate-500)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500}}>{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function App() {
    const auth = useAuth();
    const [stores, setStores] = useState<any[]>(INITIAL_STORES);
    const [helpers, setHelpers] = useState<any[]>(INITIAL_HELPERS);
    const [cart, setCart] = useState<any[]>(() => {
        try { const saved = localStorage.getItem('kc_cart'); return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [orders, setOrders] = useState<Order[]>(() => {
        try { const saved = localStorage.getItem('kc_orders'); return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Persist orders & cart to localStorage on every change
    useEffect(() => { localStorage.setItem('kc_orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('kc_cart', JSON.stringify(cart)); }, [cart]);

    useEffect(() => {
        // Pre-register helper demo account
        try { auth.register('helper@kirana.com', 'helper123', 'Amit Singh', 'HELPER'); } catch (e) {} 
    }, []);

    const addToCart = (product: any, shop: any, delta = 1) => {
        setCart((prev: any) => {
            if(prev.length > 0 && prev[0].shopId !== shop.id) {
                if(window.confirm('Adding this item will clear your current cart from another shop. Continue?')) return [{...product, qty: 1, shopId: shop.id, shopName: shop.name}];
                else return prev;
            }
            const found = prev.find((i: any) => i.id === product.id);
            if (found) {
                const newQty = found.qty + delta;
                if (newQty <= 0) return prev.filter((i: any) => i.id !== product.id);
                return prev.map((i: any) => i.id === product.id ? { ...i, qty: newQty } : i);
            }
            if (delta <= 0) return prev;
            return [...prev, { ...product, qty: 1, shopId: shop.id, shopName: shop.name }];
        });
    };

    const handlePlaceOrder = (total: number, payMethod: 'UPI' | 'KHATA') => {
        if(cart.length === 0) return;
        const newOrder: Order = {
            id: 'ORD-' + Math.floor(Math.random()*90000 + 10000), 
            customerName: auth.user?.name || 'Customer',
            shopId: cart[0].shopId, shopName: cart[0].shopName,
            items: [...cart], total, status: 'PENDING', payMethod,
            date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        setOrders(prev => [...prev, newOrder]);
        setCart([]);
    };

    // Admin updates order
    const handleConfirmOrder = (orderId: string, helperId: string) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CONFIRMED', helperId } : o)); };
    
    // Helper updates status (Picked Up, Arrived)
    const handleHelperStatusUpdate = (orderId: string, status: any) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o)); }

    return (
        <Router>
            <div className="site-shell">
                <Navbar user={auth.user} logout={auth.logout} cart={cart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <main className="site-content">
                    <Routes>
                        <Route path="/" element={<Landing user={auth.user} />} />
                        <Route path="/marketplace" element={<Marketplace stores={stores} searchQuery={searchQuery} />} />
                        <Route path="/shop/:id" element={<ShopView stores={stores} cart={cart} onAddToCart={addToCart} searchQuery={searchQuery} />} />
                        <Route path="/login/:role" element={<AuthPage isSignup={false} authHook={auth} />} />
                        <Route path="/signup/:role" element={<AuthPage isSignup={true} authHook={auth} />} />
                        <Route path="/admin-panel" element={<AdminPanel stores={stores} setStores={setStores} helpers={helpers} setHelpers={setHelpers} orders={orders} onConfirmOrder={handleConfirmOrder} onHelperStatusUpdate={handleHelperStatusUpdate}/>} />
                        <Route path="/helper-panel" element={<HelperPanel orders={orders} onStatusUpdate={handleHelperStatusUpdate} />} />
                        <Route path="/cart" element={<CartPage cart={cart} onPlaceOrder={handlePlaceOrder} authHook={auth} onAddToCart={addToCart}/>} />
                        <Route path="/orders" element={<CustomerOrders orders={orders} helpers={helpers} khataBalance={auth.khataBalance} onCustomerAction={handleHelperStatusUpdate} />} />
                    </Routes>
                </main>
                <Footer />
                {/* Floating Demo Switcher — for testing full delivery flow without re-login */}
                <DemoSwitcher />
            </div>
        </Router>
    );
}

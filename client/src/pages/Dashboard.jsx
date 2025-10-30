import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileForm from '../components/Profile/ProfileForm';
import AvatarUpload from '../components/Profile/AvatarUpload';
import { getProfile } from '../services/profileApi';
import { getAuthToken, clearAuthData } from '../context/AuthContext';

const getDefaultProfile = () => ({
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  farmName: "",
  phoneNumber: "",
  farmBio: "",
  location: {
    type: "Point",
    coordinates: [30.0444, 31.2357],
  },
  specialties: [],
  avatarUrl: "",
});

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(() => {
    if (location.state?.activeView) {
      return location.state.activeView;
    }
    return localStorage.getItem('dashboardActiveView') || 'profile';
  });
  const [profile, setProfile] = useState(getDefaultProfile());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const hasProcessedNavState = useRef(false);
  const lastNavStateRef = useRef(null);

  useEffect(() => {
    if (location.state?.activeView && location.state.activeView !== lastNavStateRef.current) {
      setActiveComponent(location.state.activeView);
      lastNavStateRef.current = location.state.activeView;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const handleViewChange = (event) => {
      const { activeView } = event.detail;
      if (activeView) {
        setActiveComponent(activeView);
      }
    };

    window.addEventListener('dashboardViewChange', handleViewChange);
    return () => {
      window.removeEventListener('dashboardViewChange', handleViewChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardActiveView', activeComponent);
  }, [activeComponent]);

  useEffect(() => {
    if (activeComponent === 'profile') {
      fetchProfile();
    }
  }, [activeComponent]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();

      if (!token) {
        clearAuthData();
        navigate("/login");
        return;
      }

      const data = await getProfile();

      if (data) {
        const profileData = {
          ...getDefaultProfile(),
          ...data,
          location: data.location || getDefaultProfile().location,
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
        };

        setProfile(profileData);
        setImagePreview(profileData.avatarUrl || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      const errorMsg = err.response?.data?.message || "Failed to fetch profile";
      setError(errorMsg);
      
      if (err.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: 'orders' },
    { id: 'products', label: 'My Products', icon: 'products' },
    { id: 'profile', label: 'My Profile', icon: 'profile' },
  ];

  const MyOrders = () => (
    <div className="text-center py-12 px-6 min-h-[400px] flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-2xl font-bold text-emerald-900 mb-2">My Orders</h2>
      <p className="text-gray-600">Orders component coming soon...</p>
    </div>
  );

  const MyProducts = () => (
    <div className="text-center py-12 px-6 min-h-[400px] flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🌾</div>
      <h2 className="text-2xl font-bold text-emerald-900 mb-2">My Products</h2>
      <p className="text-gray-600">Products component coming soon...</p>
    </div>
  );

  const MyProfile = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12 px-6 min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 px-6 min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <ProfileHeader isEditing={false} onEditClick={handleEditClick} />
        <div className="p-5 md:p-6">
          <div className="mb-6 flex justify-center">
            <AvatarUpload
              profilePicture={profile.avatarUrl}
              imagePreview={imagePreview}
              isEditing={false}
              onPreviewChange={setImagePreview}
              onProfileChange={(updatedProfile) =>
                setProfile((prev) => ({ ...prev, ...updatedProfile }))
              }
            />
          </div>
          <ProfileForm profile={profile} isEditing={false} />
        </div>
      </div>
    );
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'orders':
        return <MyOrders />;
      case 'products':
        return <MyProducts />;
      case 'profile':
        return <MyProfile />;
      default:
        return <MyOrders />;
    }
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'orders':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        );
      case 'products':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        );
      case 'profile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 21a8 8 0 0 0-16 0"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="box-border" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="w-full lg:w-5/6 mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-5">
          <aside className="w-full lg:w-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/70 p-5 min-h-[90vh]">
            <h2 className="text-sm font-bold text-emerald-800 mb-5 tracking-[4.2px] uppercase" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif', letterSpacing: '4.2px' }}>
              Farmer Portal
            </h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveComponent(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    activeComponent === item.id
                      ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md hover:-translate-y-0.5'
                      : 'text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  {getIcon(item.icon)}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-h-fit">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/70 overflow-auto min-h-fit">
              {renderActiveComponent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

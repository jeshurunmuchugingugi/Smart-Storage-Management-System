const [units, setUnits] = useState([]);
const [bookings, setBookings] = useState([]);
const [features, setFeatures] = useState([]);
const [activeTab, setActiveTab] = useState('units');
const [loading, setLoading] = useState(true);
const [editingUnit, setEditingUnit] = useState(null);
const [showCreateForm, setShowCreateForm] = useState(false);
const [formData, setFormData] = useState({
  unit_number: '',
  site: '',
  monthly_rate: '',
  status: 'available',
  location: ''
});

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const [unitsRes, bookingsRes, featuresRes] = await Promise.all([
      fetch('/api/units', { headers }),
      fetch('/api/bookings', { headers }),
      fetch('/api/features', { headers })
    ]);

    const unitsData = await unitsRes.json();
    const bookingsData = await bookingsRes.json();
    const featuresData = await featuresRes.json();

    setUnits(unitsData);
    setBookings(bookingsData);
    setFeatures(featuresData);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching data:', error);
    setLoading(false);
  }
};

//logout functionality
const handleLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  onLogout();
};

// City options
export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat"
];

// Category options
export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Appliances",
  "Sports Equipment",
  "Musical Instruments",
  "Tools",
  "Party Supplies",
  "Cameras",
  "Gaming",
  "Other"
];

// Condition options with Bootstrap classes
export const CONDITIONS = [
  { value: "new", label: "New", bsClass: "bg-success" },
  { value: "good", label: "Good", bsClass: "bg-primary" },
  { value: "refurbished", label: "Refurbished", bsClass: "bg-warning text-dark" }
];

// City coordinates (latitude, longitude) for distance-based filtering
export const CITY_COORDINATES = {
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Delhi": { lat: 28.7041, lon: 77.1025 },
  "Bangalore": { lat: 12.9716, lon: 77.5946 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Surat": { lat: 21.1702, lon: 72.8311 }
};

// Sub-branches / Areas for each city (within 10km of main city center)
// Each sub-branch has coordinates for distance calculation
export const CITY_SUB_BRANCHES = {
  "Mumbai": [
    { name: "Andheri", coordinates: { lat: 19.1136, lon: 72.8697 } },
    { name: "Bandra", coordinates: { lat: 19.0596, lon: 72.8295 } },
    { name: "Borivali", coordinates: { lat: 19.2403, lon: 72.8567 } },
    { name: "Dadar", coordinates: { lat: 19.0178, lon: 72.8478 } },
    { name: "Juhu", coordinates: { lat: 19.1075, lon: 72.8263 } },
    { name: "Powai", coordinates: { lat: 19.1176, lon: 72.9060 } },
    { name: "Worli", coordinates: { lat: 19.0176, lon: 72.8170 } },
    { name: "Colaba", coordinates: { lat: 18.9067, lon: 72.8147 } },
    { name: "Lower Parel", coordinates: { lat: 18.9984, lon: 72.8302 } },
    { name: "Malad", coordinates: { lat: 19.1864, lon: 72.8479 } }
  ],
  "Delhi": [
    { name: "Connaught Place", coordinates: { lat: 28.6315, lon: 77.2167 } },
    { name: "Saket", coordinates: { lat: 28.5244, lon: 77.2066 } },
    { name: "Dwarka", coordinates: { lat: 28.5921, lon: 77.0460 } },
    { name: "Rohini", coordinates: { lat: 28.7499, lon: 77.0679 } },
    { name: "Lajpat Nagar", coordinates: { lat: 28.5677, lon: 77.2436 } },
    { name: "Karol Bagh", coordinates: { lat: 28.6510, lon: 77.1905 } },
    { name: "Vasant Kunj", coordinates: { lat: 28.5167, lon: 77.1598 } },
    { name: "Nehru Place", coordinates: { lat: 28.5494, lon: 77.2501 } },
    { name: "Janakpuri", coordinates: { lat: 28.6219, lon: 77.0814 } },
    { name: "Green Park", coordinates: { lat: 28.5595, lon: 77.2069 } }
  ],
  "Bangalore": [
    { name: "Koramangala", coordinates: { lat: 12.9352, lon: 77.6245 } },
    { name: "Indiranagar", coordinates: { lat: 12.9719, lon: 77.6412 } },
    { name: "Whitefield", coordinates: { lat: 12.9698, lon: 77.7499 } },
    { name: "Jayanagar", coordinates: { lat: 12.9250, lon: 77.5838 } },
    { name: "Electronic City", coordinates: { lat: 12.8399, lon: 77.6770 } },
    { name: "HSR Layout", coordinates: { lat: 12.9116, lon: 77.6473 } },
    { name: "Malleshwaram", coordinates: { lat: 13.0038, lon: 77.5705 } },
    { name: "BTM Layout", coordinates: { lat: 12.9165, lon: 77.6101 } },
    { name: "Yelahanka", coordinates: { lat: 13.1007, lon: 77.5963 } },
    { name: "Banashankari", coordinates: { lat: 12.9250, lon: 77.5480 } }
  ],
  "Hyderabad": [
    { name: "Hitech City", coordinates: { lat: 17.4435, lon: 78.3772 } },
    { name: "Banjara Hills", coordinates: { lat: 17.4239, lon: 78.4738 } },
    { name: "Jubilee Hills", coordinates: { lat: 17.4239, lon: 78.4082 } },
    { name: "Madhapur", coordinates: { lat: 17.4483, lon: 78.3915 } },
    { name: "Secunderabad", coordinates: { lat: 17.4399, lon: 78.4983 } },
    { name: "Gachibowli", coordinates: { lat: 17.4399, lon: 78.3482 } },
    { name: "Kukatpally", coordinates: { lat: 17.4849, lon: 78.3915 } },
    { name: "Kondapur", coordinates: { lat: 17.4617, lon: 78.3648 } },
    { name: "Ameerpet", coordinates: { lat: 17.4376, lon: 78.4482 } },
    { name: "LB Nagar", coordinates: { lat: 17.3516, lon: 78.5527 } }
  ],
  "Chennai": [
    { name: "T Nagar", coordinates: { lat: 13.0418, lon: 80.2341 } },
    { name: "Adyar", coordinates: { lat: 13.0067, lon: 80.2582 } },
    { name: "Anna Nagar", coordinates: { lat: 13.0850, lon: 80.2101 } },
    { name: "Velachery", coordinates: { lat: 12.9750, lon: 80.2210 } },
    { name: "Mylapore", coordinates: { lat: 13.0339, lon: 80.2619 } },
    { name: "Nungambakkam", coordinates: { lat: 13.0569, lon: 80.2426 } },
    { name: "Porur", coordinates: { lat: 13.0358, lon: 80.1560 } },
    { name: "Tambaram", coordinates: { lat: 12.9249, lon: 80.1000 } },
    { name: "Kilpauk", coordinates: { lat: 13.0778, lon: 80.2420 } },
    { name: "Ashok Nagar", coordinates: { lat: 13.0358, lon: 80.2101 } }
  ],
  "Kolkata": [
    { name: "Salt Lake", coordinates: { lat: 22.5958, lon: 88.4370 } },
    { name: "Park Street", coordinates: { lat: 22.5535, lon: 88.3514 } },
    { name: "Ballygunge", coordinates: { lat: 22.5334, lon: 88.3647 } },
    { name: "New Town", coordinates: { lat: 22.5958, lon: 88.4897 } },
    { name: "Howrah", coordinates: { lat: 22.5958, lon: 88.2636 } },
    { name: "Alipore", coordinates: { lat: 22.5334, lon: 88.3299 } },
    { name: "Jadavpur", coordinates: { lat: 22.4982, lon: 88.3732 } },
    { name: "Rajarhat", coordinates: { lat: 22.6210, lon: 88.4560 } },
    { name: "Dum Dum", coordinates: { lat: 22.6434, lon: 88.4254 } },
    { name: "Behala", coordinates: { lat: 22.4982, lon: 88.3098 } }
  ],
  "Pune": [
    { name: "Kothrud", coordinates: { lat: 18.5074, lon: 73.8077 } },
    { name: "Hinjewadi", coordinates: { lat: 18.5992, lon: 73.7290 } },
    { name: "Wakad", coordinates: { lat: 18.5967, lon: 73.7633 } },
    { name: "Baner", coordinates: { lat: 18.5590, lon: 73.7890 } },
    { name: "Viman Nagar", coordinates: { lat: 18.5679, lon: 73.9143 } },
    { name: "Aundh", coordinates: { lat: 18.5590, lon: 73.8077 } },
    { name: "Koregaon Park", coordinates: { lat: 18.5362, lon: 73.8925 } },
    { name: "Magarpatta", coordinates: { lat: 18.5157, lon: 73.9289 } },
    { name: "Pimple Saudagar", coordinates: { lat: 18.5990, lon: 73.8025 } },
    { name: "Hadapsar", coordinates: { lat: 18.5089, lon: 73.9260 } }
  ],
  "Ahmedabad": [
    { name: "Satellite", coordinates: { lat: 23.0258, lon: 72.5051 } },
    { name: "Maninagar", coordinates: { lat: 22.9971, lon: 72.5991 } },
    { name: "Vastrapur", coordinates: { lat: 23.0393, lon: 72.5240 } },
    { name: "Chandkheda", coordinates: { lat: 23.1049, lon: 72.5970 } },
    { name: "Bodakdev", coordinates: { lat: 23.0393, lon: 72.4970 } },
    { name: "Prahlad Nagar", coordinates: { lat: 23.0071, lon: 72.5051 } },
    { name: "Naranpura", coordinates: { lat: 23.0393, lon: 72.5593 } },
    { name: "Gota", coordinates: { lat: 23.1049, lon: 72.5593 } },
    { name: "Thaltej", coordinates: { lat: 23.0524, lon: 72.5051 } },
    { name: "Bopal", coordinates: { lat: 23.0258, lon: 72.4459 } }
  ],
  "Jaipur": [
    { name: "Vaishali Nagar", coordinates: { lat: 26.9020, lon: 75.7573 } },
    { name: "Malviya Nagar", coordinates: { lat: 26.8591, lon: 75.8230 } },
    { name: "Mansarovar", coordinates: { lat: 26.8591, lon: 75.7573 } },
    { name: "C-Scheme", coordinates: { lat: 26.9124, lon: 75.7873 } },
    { name: "Jagatpura", coordinates: { lat: 26.8475, lon: 75.8642 } },
    { name: "Raja Park", coordinates: { lat: 26.9124, lon: 75.8023 } },
    { name: "Tonk Road", coordinates: { lat: 26.8475, lon: 75.8023 } },
    { name: "Ajmer Road", coordinates: { lat: 26.9394, lon: 75.7280 } },
    { name: "Sitapura", coordinates: { lat: 26.8124, lon: 75.8230 } },
    { name: "Bani Park", coordinates: { lat: 26.9260, lon: 75.7873 } }
  ],
  "Surat": [
    { name: "Adajan", coordinates: { lat: 21.1959, lon: 72.7933 } },
    { name: "Vesu", coordinates: { lat: 21.1454, lon: 72.7700 } },
    { name: "Pal", coordinates: { lat: 21.2277, lon: 72.8662 } },
    { name: "Athwa", coordinates: { lat: 21.1702, lon: 72.8080 } },
    { name: "City Light", coordinates: { lat: 21.1959, lon: 72.8311 } },
    { name: "Piplod", coordinates: { lat: 21.2277, lon: 72.8311 } },
    { name: "Althan", coordinates: { lat: 21.2277, lon: 72.7933 } },
    { name: "Parle Point", coordinates: { lat: 21.1702, lon: 72.8311 } },
    { name: "Varachha", coordinates: { lat: 21.2080, lon: 72.8662 } },
    { name: "Katargam", coordinates: { lat: 21.2277, lon: 72.7700 } }
  ]
};
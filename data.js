// Krṣiveda (कृषिवेद) & Satellite Agriculture Platform Data Store
// Aligned with Dolphin Tank India Hackathon & Krṣiveda Design System

const APP_DATA = {
  currentLanguage: 'en', // 'en' or 'hi'
  currentTheme: 'nature', // 'nature' or 'satellite'
  currentRole: 'farmer', // 'farmer' or 'extension'
  isLoggedIn: true,

  currentUser: {
    id: 'farmer-1',
    name: 'Ramesh Yadav',
    nameHi: 'रमेश यादव',
    role: 'farmer',
    phone: '+91 98765 43210',
    village: 'Chitaipur, Varanasi',
    villageHi: 'चितईपुर, वाराणसी',
    plotId: 'Plot No. 12',
    plotArea: '2.4 acres (0.97 ha)',
    primaryCrop: 'Wheat (गेहूं)',
    secondaryCrop: 'Mustard (सरसों)',
    soilType: 'Alluvial Loam (जलोढ़ दोमट)',
    lastTested: '05 Oct 2026',
    soilHealthScore: 78,
    sellerRating: 4.9,
    totalSalesEarnings: 14200,
    activeListingsCount: 2
  },

  farmerProfile: {
    name: 'Ramesh Yadav',
    nameHi: 'रमेश यादव',
    village: 'Chitaipur, Varanasi',
    villageHi: 'चितईपुर, वाराणसी',
    plotId: 'Plot No. 12',
    plotArea: '2.4 acres (0.97 ha)',
    primaryCrop: 'Wheat (गेहूं)',
    secondaryCrop: 'Mustard (सरसों)',
    soilType: 'Alluvial Loam (जलोढ़ दोमट)',
    lastTested: '05 Oct 2026',
    soilHealthScore: 78
  },

  // Sample farmer accounts for demo login
  demoAccounts: {
    farmer: {
      phone: '9876543210',
      otp: '2026',
      name: 'Ramesh Yadav',
      role: 'farmer',
      roleLabel: 'Smallholder Farmer',
      village: 'Chitaipur, Varanasi (Plot 12)'
    },
    extension: {
      phone: '9123456780',
      otp: '2026',
      name: 'Dr. Ananya Sharma',
      role: 'extension',
      roleLabel: 'KVK Agronomist & Extension Officer',
      village: 'Krishi Vigyan Kendra, Varanasi'
    }
  },

  // Kisan AI Agronomy Knowledge Base (Interactive Assistant)
  kisanAiQna: [
    {
      keywords: ['zone b', 'moisture', 'water', 'irrigate', 'नमी', 'सिंचाई', 'पानी'],
      replyEn: '🛰️ **Satellite Analysis for Zone B:** Sentinel-1 SAR radar indicates topsoil moisture dropped to 34% with canopy surface temperature elevated to 34.2°C (+4.2°C thermal stress). **Action:** Perform light watering tomorrow at 6:00 AM. Avoid heavy flooding because thunderstorms are forecast in 48 hours.',
      replyHi: '🛰️ **ज़ोन बी उपग्रह विश्लेषण:** सेंटिनल-1 रडार के अनुसार ऊपरी मिट्टी में नमी घटकर 34% रह गई है और सतह का तापमान 34.2°C है। **सलाह:** कल सुबह 6:00 बजे हल्की सिंचाई करें। अत्यधिक पानी न भरें क्योंकि 48 घंटों में बारिश की संभावना है।'
    },
    {
      keywords: ['zone c', 'phosphorus', 'p', 'nutrient', 'urea', 'खाद', 'फास्फोरस', 'यूरिया'],
      replyEn: '🧪 **Nutrient Diagnosis for Zone C:** Optical RE-NDVI shows canopy discolouration. Recent lab test confirms Phosphorus at 22 kg/ha (Low) while Potassium is High (310 kg/ha). **Action:** Do NOT apply blanket urea (can cause salt stress). Apply vermicompost or Single Super Phosphate (SSP) directly available in our Farmer Marketplace.',
      replyHi: '🧪 **ज़ोन सी पोषक तत्व जांच:** लैब टेस्ट में फास्फोरस 22 kg/ha (कम) पाया गया है जबकि पोटाश पर्याप्त है। **सलाह:** अंधाधुंध यूरिया न डालें। इसके बजाय केंचुआ खाद (वर्मीकंपोस्ट) डालें जो हमारे किसान बाज़ार में सीधे उपलब्ध है।'
    },
    {
      keywords: ['zone e', 'pest', 'rust', 'aphid', 'कीट', 'रोग', 'रतुआ'],
      replyEn: '🔍 **Biotic Stress Alert for Zone E:** Sentinel-2 detected a sudden 18% NDVI drop over 6 days without moisture deficit. **Action:** Scout physically across Plot 12 South-Central for Yellow Rust spores on leaves or early aphid clusters.',
      replyHi: '🔍 **ज़ोन ई कीट/रोग चेतावनी:** नमी सामान्य होने के बावजूद 6 दिनों में वनस्पति सूचकांक (NDVI) में 18% की गिरावट आई है। **सलाह:** खेत के दक्षिण-मध्य भाग में पीला रतुआ (Yellow Rust) या माहू कीट के लक्षणों की पत्तियों पर तुरंत जांच करें।'
    },
    {
      keywords: ['wheat', 'गेहूं', 'mustard', 'सरसों'],
      replyEn: '🌾 **Crop Recommendation for Plot 12:** Wheat (HD-2967) has a 92% suitability score with your alluvial loam soil. Mustard (Pusa Bold) has 85% suitability and lower water demand. Recommended sowing schedule is optimal right now.',
      replyHi: '🌾 **फसल सलाह:** आपके जलोढ़ दोमट खेत के लिए गेहूं (HD-2967) 92% उपयुक्त है। सरसों (पूसा बोल्ड) 85% उपयुक्त है और इसे कम पानी की आवश्यकता होती है।'
    }
  ],

  weather: {
    current: {
      temp: 28,
      condition: 'Partly Cloudy',
      conditionHi: 'आंशिक बादल',
      humidity: 62,
      windSpeed: '12 km/h',
      rainChance: '15%',
      alert: {
        en: 'Heavy rain expected in 2 days — delay irrigation & foliar spray',
        hi: '2 दिनों में भारी बारिश की संभावना — सिंचाई और छिड़काव टालें'
      }
    },
    forecast: [
      { day: 'Mon', date: '12 May', dayHi: 'सोम', temp: '28° / 18°', condition: 'Sunny', conditionHi: 'धूप', icon: 'sun', rain: '0%' },
      { day: 'Tue', date: '13 May', dayHi: 'मंगल', temp: '27° / 19°', condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: 'cloud-sun', rain: '10%' },
      { day: 'Wed', date: '14 May', dayHi: 'बुध', temp: '25° / 18°', condition: 'Light Rain', conditionHi: 'हल्की बारिश', icon: 'cloud-drizzle', rain: '65%' },
      { day: 'Thu', date: '15 May', dayHi: 'गुरु', temp: '24° / 17°', condition: 'Rain', conditionHi: 'बारिश', icon: 'cloud-rain', rain: '85%' },
      { day: 'Fri', date: '16 May', dayHi: 'शुक्र', temp: '26° / 18°', condition: 'Showers', conditionHi: 'बौछारें', icon: 'cloud-sun-rain', rain: '45%' },
      { day: 'Sat', date: '17 May', dayHi: 'शनि', temp: '28° / 19°', condition: 'Partly Cloudy', conditionHi: 'आंशिक बादल', icon: 'cloud-sun', rain: '15%' },
      { day: 'Sun', date: '18 May', dayHi: 'रवि', temp: '30° / 20°', condition: 'Sunny', conditionHi: 'धूप', icon: 'sun', rain: '5%' }
    ]
  },

  // Field Zones (Based on Page 9 MVP & Sentinel-2/1 Specs)
  zones: [
    {
      id: 'A',
      name: 'Zone A (North-West)',
      nameHi: 'ज़ोन ए (उत्तर-पश्चिम)',
      area: '0.42 ha',
      crop: 'Wheat (HD-2967)',
      cropStage: 'Tillering (कल्ले फूटने की अवस्था)',
      status: 'Healthy',
      statusHi: 'स्वस्थ',
      statusColor: 'emerald',
      ndvi: 0.78,
      moisture: '64% (Optimal)',
      moistureHi: '64% (उचित)',
      temperature: '26.8°C',
      nutrientStatus: 'Balanced N-P-K',
      action: 'Maintain standard routine; next scheduled scouting in 5 days.',
      actionHi: 'सामान्य देखभाल जारी रखें; 5 दिन बाद अगली नियमित निगरानी करें।',
      satEvidence: 'High chlorophyll reflection in Sentinel-2 Band 8 (NIR). Uniform biomass density.'
    },
    {
      id: 'B',
      name: 'Zone B (North-Central)',
      nameHi: 'ज़ोन बी (उत्तर-मध्य)',
      area: '0.38 ha',
      crop: 'Wheat (HD-2967)',
      cropStage: 'Tillering',
      status: 'Moisture Stress',
      statusHi: 'नमी की कमी',
      statusColor: 'blue',
      ndvi: 0.61,
      moisture: '34% (Low Moisture)',
      moistureHi: '34% (कम नमी)',
      temperature: '34.2°C (Elevated)',
      nutrientStatus: 'Adequate',
      action: 'Check irrigation canals/drips. Schedule light watering tomorrow morning 6 AM.',
      actionHi: 'सिंचाई नाली या ड्रिप पाइपलाइन की जांच करें। कल सुबह 6 बजे हल्की सिंचाई करें।',
      satEvidence: 'Sentinel-1 SAR backscatter shows dry topsoil dielectric drop; thermal anomaly +4.2°C.'
    },
    {
      id: 'C',
      name: 'Zone C (North-East)',
      nameHi: 'ज़ोन सी (उत्तर-पूर्व)',
      area: '0.45 ha',
      crop: 'Mustard (Pusa Bold)',
      cropStage: 'Vegetative',
      status: 'Nutrient Deficiency Clues',
      statusHi: 'पोषक तत्व तनाव संकेत',
      statusColor: 'amber',
      ndvi: 0.45,
      moisture: '58% (Moderate)',
      moistureHi: '58% (मध्यम)',
      temperature: '29.5°C',
      nutrientStatus: 'Suspected Phosphorus (P) Deficit',
      action: 'Collect soil sample from this patch. Avoid blanket urea; apply vermicompost or SSP post test.',
      actionHi: 'इस हिस्से से मिट्टी का नमूना लें। अंधाधुंध यूरिया न डालें; परीक्षण बाद वर्मीकंपोस्ट डालें।',
      satEvidence: 'Low red-edge vegetation index (RE-NDVI); atypical canopy discolouration mapped.'
    },
    {
      id: 'D',
      name: 'Zone D (South-West)',
      nameHi: 'ज़ोन डी (दक्षिण-पश्चिम)',
      area: '0.35 ha',
      crop: 'Wheat (HD-2967)',
      cropStage: 'Tillering',
      status: 'Optimal Vigour',
      statusHi: 'उत्कृष्ट विकास',
      statusColor: 'teal',
      ndvi: 0.82,
      moisture: '68% (Good)',
      moistureHi: '68% (अच्छा)',
      temperature: '25.9°C',
      nutrientStatus: 'High Organic Carbon',
      action: 'No action required. Peak vegetative index recorded.',
      actionHi: 'किसी कार्यवाही की आवश्यकता नहीं। फसल का विकास उच्चतम स्तर पर है।',
      satEvidence: 'Sentinel-2 NDVI 0.82 with high canopy greenness and water absorption band stability.'
    },
    {
      id: 'E',
      name: 'Zone E (South-Central)',
      nameHi: 'ज़ोन ई (दक्षिण-मध्य)',
      area: '0.40 ha',
      crop: 'Wheat (HD-2967)',
      cropStage: 'Tillering',
      status: 'Crop Stress / Pest Clue',
      statusHi: 'फसल तनाव / कीट संकेत',
      statusColor: 'rose',
      ndvi: 0.52,
      moisture: '55% (Normal)',
      moistureHi: '55% (सामान्य)',
      temperature: '31.1°C',
      nutrientStatus: 'Normal N-P-K',
      action: 'Scout physically for yellow rust or early aphid clusters on lower leaf foliage.',
      actionHi: 'खेत में जाकर पीला रतुआ (Yellow Rust) या माहू कीट की पत्तियों पर जांच करें।',
      satEvidence: 'Sudden NDVI drop of 18% over 6 days without moisture deficit indicates biotic stress.'
    },
    {
      id: 'F',
      name: 'Zone F (South-East)',
      nameHi: 'ज़ोन एफ (दक्षिण-पूर्व)',
      area: '0.40 ha',
      crop: 'Mustard (Pusa Bold)',
      cropStage: 'Vegetative',
      status: 'Waterlogged / Over-moist',
      statusHi: 'अत्यधिक जलभराव',
      statusColor: 'cyan',
      ndvi: 0.65,
      moisture: '88% (High / Saturated)',
      moistureHi: '88% (जलभराव)',
      temperature: '22.4°C (Coolest)',
      nutrientStatus: 'Risk of Root Leaching',
      action: 'Drain excess standing water. Halt incoming irrigation before Wednesday rainfall.',
      actionHi: 'अतिरिक्त पानी की निकासी करें। बुधवार की बारिश से पहले पानी देना पूरी तरह बंद रखें।',
      satEvidence: 'Specular radar reflection in Sentinel-1 indicates standing surface water film.'
    }
  ],

  // Crop Recommendations (from Image 1)
  cropRecommendations: [
    {
      id: 'wheat',
      name: 'Wheat (गेहूं)',
      badge: 'Recommended',
      badgeHi: 'अनुशंसित',
      suitability: 92,
      water: 'Moderate',
      waterHi: 'मध्यम',
      khad: 'Urea 40-50 kg/acre',
      khadHi: 'यूरिया 40-50 किग्रा/एकड़',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80',
      advice: 'Best for current loamy texture and moderate temperature window.'
    },
    {
      id: 'mustard',
      name: 'Mustard (सरसों)',
      badge: 'Suitable',
      badgeHi: 'उपयुक्त',
      suitability: 85,
      water: 'Low',
      waterHi: 'कम',
      khad: 'DAP 25-30 kg/acre',
      khadHi: 'डीएपी 25-30 किग्रा/एकड़',
      img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80',
      advice: 'Low water requirement; excellent drought resistance in non-irrigated zones.'
    },
    {
      id: 'chickpea',
      name: 'Chickpea (चना)',
      badge: 'Suitable',
      badgeHi: 'उपयुक्त',
      suitability: 78,
      water: 'Low',
      waterHi: 'कम',
      khad: 'DAP 20-25 kg/acre',
      khadHi: 'डीएपी 20-25 किग्रा/एकड़',
      img: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&q=80',
      advice: 'Fixes atmospheric nitrogen into soil; highly recommended for Zone C rotation.'
    }
  ],

  // Soil Chemical Composition (from Image 3)
  soilReport: {
    plotName: 'Plot No. 12, Varanasi',
    testDate: 'Tested on 5 Oct 2026',
    score: 78,
    scoreRating: 'Good',
    scoreRatingHi: 'उचित स्थिति',
    verdict: 'Your soil is in good condition! With some improvements, it can be even more productive.',
    verdictHi: 'आपकी मिट्टी अच्छी स्थिति में है! कुछ सुधारों के साथ यह और अधिक उत्पादक हो सकती है।',
    parameters: [
      { name: 'Nitrogen (N)', nameHi: 'नाइट्रोजन (N)', value: '280 kg/ha', pct: 60, status: 'Medium', statusHi: 'मध्यम', tagColor: 'amber' },
      { name: 'Phosphorus (P)', nameHi: 'फास्फोरस (P)', value: '22 kg/ha', pct: 28, status: 'Low', statusHi: 'कम', tagColor: 'rose' },
      { name: 'Potassium (K)', nameHi: 'पोटेशियम (K)', value: '310 kg/ha', pct: 85, status: 'High', statusHi: 'उच्च', tagColor: 'emerald' },
      { name: 'pH', nameHi: 'पीएच (pH)', value: '6.8', pct: 68, status: 'Neutral', statusHi: 'उदासीन', tagColor: 'emerald' },
      { name: 'Organic Carbon', nameHi: 'जैविक कार्बन (OC)', value: '0.65 %', pct: 50, status: 'Medium', statusHi: 'मध्यम', tagColor: 'amber' }
    ],
    preservations: [
      {
        title: 'Add vermicompost to boost phosphorus',
        titleHi: 'फास्फोरस बढ़ाने के लिए वर्मीकंपोस्ट डालें',
        desc: 'Improves soil fertility and microbial activity without acidifying the soil.',
        descHi: 'मिट्टी की उर्वरता और सूक्ष्मजीव गतिविधि को बिना नुकसान पहुंचाए बढ़ाता है।',
        icon: 'sprout'
      },
      {
        title: 'Rotate with legume crops next season',
        titleHi: 'अगले सीजन में दलहनी फसलों के साथ चक्र अपनाएं',
        desc: 'Chickpea / Moong helps in natural nitrogen fixation and builds biomass.',
        descHi: 'चना या मूंग वायुमंडलीय नाइट्रोजन को प्राकृतिक रूप से मिट्टी में स्थिर करता है।',
        icon: 'refresh-cw'
      },
      {
        title: 'Reduce chemical urea usage by 30%',
        titleHi: 'रासायनिक यूरिया का उपयोग 30% तक कम करें',
        desc: 'Prevents soil hardening and secondary salinity degradation.',
        descHi: 'मिट्टी के सख्त होने और लवणीय क्षरण को रोकता है।',
        icon: 'flask-conical'
      }
    ],
    trend: [
      { month: 'Apr 2026', score: 52 },
      { month: 'May 2026', score: 58 },
      { month: 'Jun 2026', score: 64 },
      { month: 'Jul 2026', score: 69 },
      { month: 'Aug 2026', score: 74 },
      { month: 'Sep 2026', score: 78 }
    ]
  },

  // Natural Fertilizers Catalog (Farmer-to-Farmer Circular Economy)
  fertilizers: [
    {
      id: 'prod-user-1',
      title: 'Aged Desi Cow Dung Compost',
      titleHi: 'देसी गाय की पकी गोबर खाद',
      category: 'cow-dung',
      seller: 'Ramesh Yadav (You)',
      sellerFarmerName: 'Ramesh Yadav (You)',
      sellerVillage: 'Chitaipur, Varanasi',
      distance: 'Your Farm (Plot 12)',
      isCurrentUser: true,
      stockKg: 400,
      verified: true,
      rating: 4.9,
      reviews: 32,
      price: 9,
      unit: 'kg',
      badge: 'Your Farm Listing • 100% Organic',
      badgeHi: 'आपकी खेत लिस्टिंग • 100% जैविक',
      img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80',
      description: 'Sun-cured and aged farmyard manure from domestic Gir cows. Tested for high humic organic content.'
    },
    {
      id: 'prod-user-2',
      title: 'Farm-Bred Vermicompost',
      titleHi: 'खेत का शुद्ध वर्मीकंपोस्ट',
      category: 'vermicompost',
      seller: 'Ramesh Yadav (You)',
      sellerFarmerName: 'Ramesh Yadav (You)',
      sellerVillage: 'Chitaipur, Varanasi',
      distance: 'Your Farm (Plot 12)',
      isCurrentUser: true,
      stockKg: 250,
      verified: true,
      rating: 4.8,
      reviews: 19,
      price: 13,
      unit: 'kg',
      badge: 'Your Farm Listing • Lab Tested',
      badgeHi: 'आपकी खेत लिस्टिंग • लैब प्रमाणित',
      img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&q=80',
      description: 'Eisenia fetida worm castings enriched with neem leaves. Boosts soil microbial phosphorus.'
    },
    {
      id: 'prod-1',
      title: 'Organic Vermicompost',
      titleHi: 'वर्मीकंपोस्ट (केंचुआ खाद)',
      category: 'vermicompost',
      seller: 'Suresh Yadav (Farmer)',
      sellerFarmerName: 'Suresh Yadav (Farmer)',
      sellerVillage: 'Rohania, Varanasi',
      distance: '3.2 km away',
      isCurrentUser: false,
      stockKg: 850,
      verified: true,
      rating: 4.8,
      reviews: 124,
      price: 12,
      unit: 'kg',
      badge: 'Farmer-Produced • Lab Tested',
      badgeHi: 'किसान उत्पादक • लैब प्रमाणित',
      img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&q=80',
      description: 'Rich in earthworm castings, humic acid, and soil-enriching microbes. Ideal for boosting phosphorus.'
    },
    {
      id: 'prod-2',
      title: 'Desi Cow Dung Manure',
      titleHi: 'गोबर खाद',
      category: 'cow-dung',
      seller: 'Meena Devi (Farmer-Dairy)',
      sellerFarmerName: 'Meena Devi (Farmer-Dairy)',
      sellerVillage: 'Shivpur, Varanasi',
      distance: '4.8 km away',
      isCurrentUser: false,
      stockKg: 1200,
      verified: true,
      rating: 4.7,
      reviews: 98,
      price: 8,
      unit: 'kg',
      badge: 'Desi Cow Dung Natural Manure',
      badgeHi: 'देसी गाय का प्राकृतिक खाद',
      img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80',
      description: 'Fully decomposed aged desi cow manure for improving soil texture and long-term water retention.'
    },
    {
      id: 'prod-3',
      title: 'Neem Cake Fertilizer',
      titleHi: 'नीम खली',
      category: 'bio-fertilizer',
      seller: 'Arjun Singh (Organic Farmer)',
      sellerFarmerName: 'Arjun Singh (Organic Farmer)',
      sellerVillage: 'Mirzapur Outskirts',
      distance: '9.5 km away',
      isCurrentUser: false,
      stockKg: 500,
      verified: true,
      rating: 4.6,
      reviews: 87,
      price: 25,
      unit: 'kg',
      badge: 'For Healthy Soil & Pest Defense',
      badgeHi: 'स्वस्थ मिट्टी और कीट सुरक्षा',
      img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80',
      description: 'Cold-pressed organic neem cake powder. Shields roots against nematodes while enriching nitrogen.'
    },
    {
      id: 'prod-4',
      title: 'Bio Compost (Crop Residue)',
      titleHi: 'जैविक खाद',
      category: 'compost',
      seller: 'Lakshmi Bai (Farmer)',
      sellerFarmerName: 'Lakshmi Bai (Farmer)',
      sellerVillage: 'Ramnagar, Varanasi',
      distance: '5.1 km away',
      isCurrentUser: false,
      stockKg: 650,
      verified: true,
      rating: 4.8,
      reviews: 112,
      price: 10,
      unit: 'kg',
      badge: 'Rich in Nutrients, Zero Stubble Burn',
      badgeHi: 'पोषक तत्वों से भरपूर पराली खाद',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=400&q=80',
      description: 'Aerobically composted crop residue enriched with mycorrhiza and beneficial fungi cultures.'
    },
    {
      id: 'prod-5',
      title: 'Panchagavya Vedic Mix',
      titleHi: 'पंचगव्य टॉनिक',
      category: 'bio-fertilizer',
      seller: 'Ravi Kumar (Organic Grower)',
      sellerFarmerName: 'Ravi Kumar (Organic Grower)',
      sellerVillage: 'Sarnath, Varanasi',
      distance: '6.4 km away',
      isCurrentUser: false,
      stockKg: 300,
      verified: true,
      rating: 4.7,
      reviews: 91,
      price: 30,
      unit: 'kg',
      badge: 'Traditional Vedic Tonic',
      badgeHi: 'पारंपरिक वैदिक फसल टॉनिक',
      img: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&q=80',
      description: 'Fermented blend of cow milk, curd, ghee, urine, and dung. Proven growth booster for foliage.'
    },
    {
      id: 'prod-6',
      title: 'Green Manure (Dhaincha)',
      titleHi: 'हरी खाद (ढैंचा बीज)',
      category: 'compost',
      seller: 'Harpreet Kaur (Farmer Co-op)',
      sellerFarmerName: 'Harpreet Kaur (Farmer Co-op)',
      sellerVillage: 'Mughalsarai Border',
      distance: '7.8 km away',
      isCurrentUser: false,
      stockKg: 900,
      verified: true,
      rating: 4.5,
      reviews: 76,
      price: 9,
      unit: 'kg',
      badge: 'Grow Naturally, Live Sustainably',
      badgeHi: 'प्राकृतिक खेती संवर्धन',
      img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&q=80',
      description: 'Quick-decomposing legume biomass seeds. Adds 80-120 kg organic nitrogen per hectare.'
    }
  ],

  // Incoming Orders received by the logged-in farmer for their listed fertilizers
  incomingFarmerOrders: [
    {
      orderId: 'ORD-KRS-8821',
      buyerFarmer: 'Kailash Nath',
      buyerVillage: 'Ramnagar (3.5 km away)',
      productTitle: 'Aged Desi Cow Dung Compost',
      qtyKg: 60,
      totalAmount: 540,
      date: 'Today, 09:30 AM',
      status: 'Pending Dispatch',
      statusColor: 'amber'
    },
    {
      orderId: 'ORD-KRS-8819',
      buyerFarmer: 'Sunita Devi',
      buyerVillage: 'Chitaipur (1.0 km away)',
      productTitle: 'Farm-Bred Vermicompost',
      qtyKg: 40,
      totalAmount: 520,
      date: 'Yesterday',
      status: 'Ready for Pickup',
      statusColor: 'emerald'
    },
    {
      orderId: 'ORD-KRS-8790',
      buyerFarmer: 'Rajesh Patel',
      buyerVillage: 'Kashi Outskirts (4.2 km away)',
      productTitle: 'Aged Desi Cow Dung Compost',
      qtyKg: 100,
      totalAmount: 900,
      date: '08 Oct 2026',
      status: 'Delivered & Paid',
      statusColor: 'slate'
    }
  ],

  // Hackathon Presentation & SDG Details (from PDF)
  impactStats: {
    event: 'Social Impact Hackathon 2026 • Dolphin Tank India',
    team: 'Team Gammacoders',
    tagline: 'Higher yields. A stronger India. Bringing the power of space technology to every farmer’s field.',
    taglineHi: 'अधिक पैदावार, सशक्त भारत। अंतरिक्ष तकनीक सीधे किसान के खेत तक।',
    coreProblem: {
      stat1: '1.08 ha',
      desc1: 'Average operational holding size in India',
      stat2: '~86%',
      desc2: 'Of holdings belong to small and marginal farmers',
      mantra: 'ONE FARM ≠ ONE UNIFORM FIELD',
      mantraHi: 'एक खेत ≠ एक समान जमीन'
    },
    sdgs: [
      {
        num: 2,
        title: 'Zero Hunger',
        titleHi: 'भुखमरी मुक्ति',
        goal: 'Productive, resilient farming',
        metric: 'Fertiliser use per hectare (-28% waste)',
        color: '#d97706'
      },
      {
        num: 6,
        title: 'Clean Water & Sanitation',
        titleHi: 'स्वच्छ जल एवं स्वच्छता',
        goal: 'Smarter water use & radar scheduling',
        metric: 'Irrigation water saved per hectare (-22%)',
        color: '#0284c7'
      },
      {
        num: 12,
        title: 'Responsible Consumption & Production',
        titleHi: 'जिम्मेदार उपभोग एवं उत्पादन',
        goal: 'Fewer wasted agro-chemical inputs',
        metric: 'Input cost reduced by ₹2,400/acre',
        color: '#16a34a'
      }
    ],
    techStack: [
      { name: 'Sentinel-2 Optical Multispectral', role: 'Vegetation indices (NDVI, NDRE, EVI) at 10m resolution' },
      { name: 'Sentinel-1 C-Band Radar (SAR)', role: 'All-weather soil moisture tracking through cloudy monsoon weeks' },
      { name: 'ECMWF & IMD Weather Grids', role: 'Localized rainfall, evaporation & temperature modeling' },
      { name: 'Agronomic AI Rules Engine', role: 'Translates stress anomalies into clear next action steps' },
      { name: 'Multi-Channel Regional Delivery', role: 'Smartphone app, Interactive Voice Response (IVR), and vernacular SMS' }
    ]
  }
}
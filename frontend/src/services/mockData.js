// Seed data for JanMitra AI governance platform

export const initialDepartments = [
  { id: 'pwd', name: 'Public Works Department (PWD)', code: 'PWD-LKO', officer: 'Er. Rajesh Kumar', email: 'pwd.lko@up.gov.in', throughput: 94, responseVelocity: '1.2 days', complaintsCount: 142, slaBreaches: 4, satisfaction: 4.6 },
  { id: 'water', name: 'Jal Sansthan (Water & Sewage)', code: 'JAL-LKO', officer: 'Smt. Anju Srivastava', email: 'jalsansthan.lko@up.gov.in', throughput: 88, responseVelocity: '1.5 days', complaintsCount: 215, slaBreaches: 12, satisfaction: 4.2 },
  { id: 'electricity', name: 'Lucknow Electricity Supply (LESA)', code: 'LESA-LKO', officer: 'Shri Manoj Patel', email: 'lesa.lko@up.gov.in', throughput: 96, responseVelocity: '0.8 days', complaintsCount: 310, slaBreaches: 5, satisfaction: 4.8 },
  { id: 'sanitation', name: 'Lucknow Nagar Nigam (Sanitation)', code: 'LNN-SAN', officer: 'Shri Alok Mishra', email: 'nagar.nigam.san@up.gov.in', throughput: 82, responseVelocity: '2.1 days', complaintsCount: 420, slaBreaches: 38, satisfaction: 3.9 },
  { id: 'traffic', name: 'Traffic Police & Infrastructure', code: 'TRAF-LKO', officer: 'Shri Ram Naresh', email: 'traffic.lko@up.gov.in', throughput: 91, responseVelocity: '1.4 days', complaintsCount: 95, slaBreaches: 2, satisfaction: 4.4 },
  { id: 'encroachment', name: 'Town Planning & Encroachment', code: 'LNN-TOWN', officer: 'Shri Vinod Sharma', email: 'nagar.nigam.town@up.gov.in', throughput: 74, responseVelocity: '3.5 days', complaintsCount: 110, slaBreaches: 22, satisfaction: 3.5 }
];

export const initialComplaints = [
  {
    id: 'JM-2026-9821',
    citizenName: 'Amit Sharma',
    citizenPhone: '+91 98765 43210',
    area: 'Gomti Nagar, Lucknow',
    title: 'Severe Sewage Overflow and Waterlogging',
    description: 'Since yesterday morning, sewage water has been overflowing on Sector 4 Main Road near Patrakar Puram. It is emitting a terrible smell and has entered several residential driveways. Municipal workers haven\'t arrived despite several local calls.',
    imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400',
    status: 'In Progress',
    submittedAt: '2026-05-21T09:15:00.000Z',
    aiAnalysis: {
      category: 'Sewage and Waterlogging',
      department: 'Jal Sansthan (Water & Sewage)',
      urgency: 'high',
      urgency_reason: 'Water has entered residential spaces, posing severe health hazards and public blockades.',
      sentiment: 'Negative / Frustrated',
      summary_en: 'Sewage overflow at Sector 4 Main Road, Gomti Nagar. Emits foul smell and enters residential driveways; requires urgent remediation.',
      summary_hi: 'सेक्टर 4 मुख्य मार्ग, गोमती नगर में सीवेज ओवरफ्लो। दुर्गंध आ रही है और आवासीय परिसरों में पानी घुस रहा है; तत्काल निवारण की आवश्यकता है।',
      citizen_update_en: 'Jal Sansthan maintenance team dispatched with high-pressure suction cleaner to Gomti Nagar Sector 4.',
      citizen_update_hi: 'जल संस्थान की रखरखाव टीम गोमती नगर सेक्टर 4 में उच्च दबाव वाले सक्शन क्लीनर के साथ रवाना हो गई है।',
      sms_hi: 'जनमित्र एलकेओ: आपका टिकट JM-2026-9821 जल संस्थान को आवंटित कर दिया गया है। टीम रवाना हो चुकी है।',
      ticket_sla_days: 2,
      ai_confidence_score: 94.6,
      priority_score: 87,
      estimated_resolution: '2026-05-23T18:00:00.000Z',
      requires_escalation: false,
      department_note: 'Allocated to Gomti Nagar West maintenance wing. Work orders issued for suction pump machinery.',
      tags: ['Waterlogging', 'Public Health', 'Sewage Overflow', 'Gomti Nagar']
    },
    timeline: [
      { status: 'Submitted', timestamp: '2026-05-21T09:15:00Z', description: 'Complaint filed via Citizen Portal.' },
      { status: 'AI Analyzed', timestamp: '2026-05-21T09:16:02Z', description: 'AI Engine categorized as Sewage, scored Urgency: High (94.6% Confidence).' },
      { status: 'Assigned', timestamp: '2026-05-21T09:20:00Z', description: 'Routed to Jal Sansthan (Water & Sewage).' },
      { status: 'In Progress', timestamp: '2026-05-21T11:30:00Z', description: 'Site engineer inspected and ordered cleanup machinery.' }
    ]
  },
  {
    id: 'JM-2026-4439',
    citizenName: 'Sunita Verma',
    citizenPhone: '+91 94150 99281',
    area: 'Hazratganj, Lucknow',
    title: 'Open Electric Wire Hanging from transformer',
    description: 'There is a high-tension live wire hanging very low from the electricity pole near the corner of Halwasiya Market in Hazratganj. It is extremely dangerous for pedestrians, especially with the monsoon rains approaching.',
    imageUrl: '',
    status: 'Resolved',
    submittedAt: '2026-05-20T14:22:00.000Z',
    aiAnalysis: {
      category: 'Power Outage and Electrical Hazard',
      department: 'Lucknow Electricity Supply (LESA)',
      urgency: 'critical',
      urgency_reason: 'Exposed live wire in high pedestrian density retail zone. High electrocution risk.',
      sentiment: 'Anxious / Fearful',
      summary_en: 'Dangerous low-hanging live electrical wire from a transformer near Halwasiya Market, Hazratganj.',
      summary_hi: 'हलवासिया मार्केट, हजरतगंज के पास ट्रांसफार्मर से लटकता हुआ खतरनाक हाई-वोल्टेज बिजली का तार।',
      citizen_update_en: 'LESA emergency crew dispatched. Power isolated locally and line re-anchored and insulated.',
      citizen_update_hi: 'लेसा आपातकालीन दल भेजा गया। स्थानीय रूप से बिजली बंद की गई और तार को पुन: स्थापित व इंसुलेट किया गया।',
      sms_hi: 'जनमित्र एलकेओ: टिकट JM-2026-4439 का निराकरण हो चुका है। लेसा टीम ने लटकते तार को दुरुस्त कर दिया है। धन्यवाद।',
      ticket_sla_days: 1,
      ai_confidence_score: 98.9,
      priority_score: 98,
      estimated_resolution: '2026-05-21T00:00:00.000Z',
      requires_escalation: false,
      department_note: 'Emergency maintenance completed. Insulation sleeves placed on connections.',
      tags: ['Live Wire', 'Electrical Hazard', 'Hazratganj', 'Safety']
    },
    timeline: [
      { status: 'Submitted', timestamp: '2026-05-20T14:22:00Z', description: 'Complaint filed.' },
      { status: 'AI Analyzed', timestamp: '2026-05-20T14:22:30Z', description: 'AI Engine marked Urgency: Critical (98.9% Confidence).' },
      { status: 'Assigned', timestamp: '2026-05-20T14:25:00Z', description: 'Dispatched to LESA Emergency Quick Response Team.' },
      { status: 'In Progress', timestamp: '2026-05-20T14:45:00Z', description: 'Crew arrived at Halwasiya Market, isolated power.' },
      { status: 'Resolved', timestamp: '2026-05-20T16:10:00Z', description: 'Wire re-tensioned and insulated. Pedestrian lane reopened.' }
    ]
  },
  {
    id: 'JM-2026-7712',
    citizenName: 'Ramesh Maurya',
    citizenPhone: '+91 88776 55432',
    area: 'Aliganj, Lucknow',
    title: 'Garbage Dump Accumulation and No Door-to-door Collection',
    description: 'No waste collection truck has visited Aliganj Sector H for the past 5 days. Neighbors are throwing trash in the open plot at the corner, and dogs are scattering it all over the lane. Bad odor has made it impossible to open windows.',
    imageUrl: '',
    status: 'Submitted',
    submittedAt: '2026-05-22T08:30:00.000Z',
    aiAnalysis: {
      category: 'Garbage Collection and Sanitation',
      department: 'Lucknow Nagar Nigam (Sanitation)',
      urgency: 'medium',
      urgency_reason: 'Sanitation neglect of 5 days leading to open dumping and dog infestation. Medium health risk.',
      sentiment: 'Frustrated / Disgusted',
      summary_en: 'Accumulated garbage at open plot in Sector H, Aliganj. No sanitation trucks visiting for 5 days.',
      summary_hi: 'सेक्टर H, अलीगंज में खुले भूखंड पर कचरा जमा। 5 दिनों से कचरा गाड़ी नहीं आ रही है।',
      citizen_update_en: 'Complaint registered. Routed to Aliganj ward sanitation supervisor.',
      citizen_update_hi: 'शिकायत दर्ज की गई। अलीगंज वार्ड स्वच्छता पर्यवेक्षक को प्रेषित।',
      sms_hi: 'जनमित्र एलकेओ: आपका टिकट JM-2026-7712 नगर निगम के स्वच्छता विभाग को प्रेषित किया गया है।',
      ticket_sla_days: 3,
      ai_confidence_score: 91.2,
      priority_score: 54,
      estimated_resolution: '2026-05-25T18:00:00.000Z',
      requires_escalation: false,
      department_note: '',
      tags: ['Garbage Dump', 'Aliganj', 'Nagar Nigam', 'Public Health']
    },
    timeline: [
      { status: 'Submitted', timestamp: '2026-05-22T08:30:00Z', description: 'Complaint filed.' },
      { status: 'AI Analyzed', timestamp: '2026-05-22T08:31:12Z', description: 'AI Engine routed to Lucknow Nagar Nigam (Sanitation).' }
    ]
  },
  {
    id: 'JM-2026-1188',
    citizenName: 'Rahul Agnihotri',
    citizenPhone: '+91 99887 76655',
    area: 'Indira Nagar, Lucknow',
    title: 'Severe Street Encroachment by Street Vendors blocking main road',
    description: 'Illegal temporary shops and vendors have extended their stalls right onto the road at Indira Nagar near Bhootnath Market. During peak office hours in the evening, there is an absolute gridlock of traffic. Walking has also become impossible.',
    imageUrl: '',
    status: 'In Progress',
    submittedAt: '2026-05-18T10:00:00.000Z',
    aiAnalysis: {
      category: 'Encroachment and Illegal Parking',
      department: 'Town Planning & Encroachment',
      urgency: 'medium',
      urgency_reason: 'Regular traffic choke points due to market vendor extensions. Requires coordinated municipal eviction drive.',
      sentiment: 'Annoyed',
      summary_en: 'Street encroachment by vendors near Bhootnath Market in Indira Nagar causing daily traffic jams.',
      summary_hi: 'भूतनाथ मार्केट के पास विक्रेताओं द्वारा मुख्य मार्ग पर अतिक्रमण, जिससे रोजाना ट्रैफिक जाम होता है।',
      citizen_update_en: 'Municipal enforcement squad schedule created. Combined action with local police planned.',
      citizen_update_hi: 'नगर पालिका प्रवर्तन दल का कार्यक्रम तैयार। स्थानीय पुलिस के साथ संयुक्त कार्रवाई की योजना।',
      sms_hi: 'जनमित्र एलकेओ: इंदिरा नगर अतिक्रमण शिकायत का कार्यभार Town Planning विभाग को सौंपा गया है। जल्द कार्रवाई होगी।',
      ticket_sla_days: 5,
      ai_confidence_score: 87.4,
      priority_score: 62,
      estimated_resolution: '2026-05-23T18:00:00.000Z',
      requires_escalation: true,
      department_note: 'Encroachment cell has logged the issue. Coordinated clearance scheduled for Saturday morning.',
      tags: ['Encroachment', 'Bhootnath Market', 'Indira Nagar', 'Traffic Gridlock']
    },
    timeline: [
      { status: 'Submitted', timestamp: '2026-05-18T10:00:00Z', description: 'Complaint filed.' },
      { status: 'AI Analyzed', timestamp: '2026-05-18T10:01:00Z', description: 'AI Engine determined Encroachment category.' },
      { status: 'Assigned', timestamp: '2026-05-18T10:15:00Z', description: 'Routed to Town Planning & Encroachment.' },
      { status: 'In Progress', timestamp: '2026-05-19T11:00:00Z', description: 'Enforcement supervisor marked SLA escalation trigger and coordinated with local police station.' }
    ]
  }
];

export const mockAiLogs = [
  { timestamp: '2026-05-22T14:30:15Z', ticketId: 'JM-2026-7890', text: 'Citizen filed: "Street light not working in Gomti Nagar Sector A..."', action: 'Classification: Electrical Hazard', score: 0.95, dept: 'Lucknow Electricity Supply (LESA)' },
  { timestamp: '2026-05-22T14:31:02Z', ticketId: 'JM-2026-7890', text: 'Analyzing text sentiment and matching spatial nodes...', action: 'Sentiment detected: Frustrated (84%)', score: 0.84, dept: 'N/A' },
  { timestamp: '2026-05-22T14:31:05Z', ticketId: 'JM-2026-7890', text: 'Generating Hindi summary translation and SLA countdown details...', action: 'API Contract Generated. routed.', score: 0.98, dept: 'Lucknow Electricity Supply (LESA)' },
  { timestamp: '2026-05-22T14:35:10Z', ticketId: 'JM-2026-7891', text: 'Citizen filed: "Uncleaned drain overflowing into the street near ring road..."', action: 'Classification: Sewage Overflow', score: 0.92, dept: 'Jal Sansthan (Water & Sewage)' },
  { timestamp: '2026-05-22T14:35:15Z', ticketId: 'JM-2026-7891', text: 'Triggering priority threshold check...', action: 'Escalation Flagged: False, priority score: 71', score: 0.92, dept: 'N/A' }
];

export const mockRoutingNetwork = {
  nodes: [
    { id: 'NLP_Parser', label: 'AI Cognitive Parser', type: 'core', x: 200, y: 150 },
    { id: 'Sentiment', label: 'Sentiment Analyser', type: 'engine', x: 380, y: 90 },
    { id: 'Router', label: 'Adaptive Router Node', type: 'engine', x: 380, y: 210 },
    { id: 'LESA', label: 'LESA (Electricity)', type: 'dept', x: 600, y: 50 },
    { id: 'JAL', label: 'Jal Sansthan (Water)', type: 'dept', x: 600, y: 130 },
    { id: 'LNN', label: 'Nagar Nigam (Sanitation)', type: 'dept', x: 600, y: 210 },
    { id: 'PWD', label: 'PWD (Roads)', type: 'dept', x: 600, y: 295 }
  ],
  links: [
    { source: 'NLP_Parser', target: 'Sentiment', status: 'active' },
    { source: 'NLP_Parser', target: 'Router', status: 'active' },
    { source: 'Router', target: 'LESA', traffic: 12 },
    { source: 'Router', target: 'JAL', traffic: 34 },
    { source: 'Router', target: 'LNN', traffic: 45 },
    { source: 'Router', target: 'PWD', traffic: 18 }
  ]
};

const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

const seedDefaultComplaints = async () => {
  try {
    const complaintsToSeed = [
      {
        _id: new mongoose.Types.ObjectId('664d4b1a4f1a4e1a4e1a9821'),
        name: 'Amit Sharma',
        phone: '+91 98765 43210',
        area: 'Gomti Nagar, Lucknow',
        title: 'Severe Sewage Overflow and Waterlogging',
        description: "Since yesterday morning, sewage water has been overflowing on Sector 4 Main Road near Patrakar Puram. It is emitting a terrible smell and has entered several residential driveways. Municipal workers haven't arrived despite several local calls.",
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400',
        category: 'drainage',
        department: 'Jal Nigam',
        status: 'In Progress',
        urgency: 'High',
        urgency_reason: 'Water has entered residential spaces, posing severe health hazards and public blockades.',
        sentiment: 'Negative',
        summary_en: 'Sewage overflow at Sector 4 Main Road, Gomti Nagar. Emits foul smell and enters residential driveways; requires urgent remediation.',
        summary_hi: 'सेक्टर 4 मुख्य मार्ग, गोमती नगर में सीवेज ओवरफ्लो। दुर्गंध आ रही है और आवासीय परिसरों में पानी घुस रहा है; तत्काल निवारण की आवश्यकता है।',
        citizen_update_en: 'Jal Sansthan maintenance team dispatched with high-pressure suction cleaner to Gomti Nagar Sector 4.',
        citizen_update_hi: 'जल संस्थान की रखरखाव टीम गोमती नगर सेक्टर 4 में उच्च दबाव वाले सक्शन क्लीनर के साथ रवाना हो गई है।',
        sms_hi: 'जनमित्र एलकेओ: आपका टिकट JM-2026-9821 जल संस्थान को आवंटित कर दिया गया है। टीम रवाना हो चुकी है।',
        ticket_sla_days: 2,
        ai_confidence_score: 94.6,
        priority_score: 87,
        estimated_resolution: new Date('2026-05-23T18:00:00.000Z'),
        requires_escalation: false,
        department_note: 'Allocated to Gomti Nagar West maintenance wing. Work orders issued for suction pump machinery.',
        tags: ['Waterlogging', 'Public Health', 'Sewage Overflow', 'Gomti Nagar'],
        timeline: [
          { status: 'Submitted', timestamp: new Date('2026-05-21T09:15:00Z'), description: 'Complaint filed via Citizen Portal.' },
          { status: 'AI Analyzed', timestamp: new Date('2026-05-21T09:16:02Z'), description: 'AI Engine categorized as Sewage, scored Urgency: High (94.6% Confidence).' },
          { status: 'Assigned', timestamp: new Date('2026-05-21T09:20:00Z'), description: 'Routed to Jal Sansthan (Water & Sewage).' },
          { status: 'In Progress', timestamp: new Date('2026-05-21T11:30:00Z'), description: 'Site engineer inspected and ordered cleanup machinery.' }
        ],
        createdAt: new Date('2026-05-21T09:15:00.000Z')
      },
      {
        _id: new mongoose.Types.ObjectId('664d4b1a4f1a4e1a4e1a4439'),
        name: 'Sunita Verma',
        phone: '+91 94150 99281',
        area: 'Hazratganj, Lucknow',
        title: 'Open Electric Wire Hanging from transformer',
        description: 'There is a high-tension live wire hanging very low from the electricity pole near the corner of Halwasiya Market in Hazratganj. It is extremely dangerous for pedestrians, especially with the monsoon rains approaching.',
        image: null,
        category: 'electricity',
        department: 'Vidyut Vibhag',
        status: 'Resolved',
        urgency: 'Critical',
        urgency_reason: 'Exposed live wire in high pedestrian density retail zone. High electrocution risk.',
        sentiment: 'Negative',
        summary_en: 'Dangerous low-hanging live electrical wire from a transformer near Halwasiya Market, Hazratganj.',
        summary_hi: 'हलवासिया मार्केट, हजरतगंज के पास ट्रांसफार्मर से लटकता हुआ खतरनाक हाई-वोल्टेज बिजली का तार।',
        citizen_update_en: 'LESA emergency crew dispatched. Power isolated locally and line re-anchored and insulated.',
        citizen_update_hi: 'लेसा आपातकालीन दल भेजा गया। स्थानीय रूप से बिजली बंद की गई और तार को पुन: स्थापित व इंसुलेट किया गया।',
        sms_hi: 'जनमित्र एलकेओ: टिकट JM-2026-4439 का निराकरण हो चुका है। लेसा टीम ने लटकते तार को दुरुस्त कर दिया है। धन्यवाद।',
        ticket_sla_days: 1,
        ai_confidence_score: 98.9,
        priority_score: 98,
        estimated_resolution: new Date('2026-05-21T00:00:00.000Z'),
        requires_escalation: false,
        department_note: 'Emergency maintenance completed. Insulation sleeves placed on connections.',
        tags: ['Live Wire', 'Electrical Hazard', 'Hazratganj', 'Safety'],
        timeline: [
          { status: 'Submitted', timestamp: new Date('2026-05-20T14:22:00Z'), description: 'Complaint filed.' },
          { status: 'AI Analyzed', timestamp: new Date('2026-05-20T14:22:30Z'), description: 'AI Engine marked Urgency: Critical (98.9% Confidence).' },
          { status: 'Assigned', timestamp: new Date('2026-05-20T14:25:00Z'), description: 'Dispatched to LESA Emergency Quick Response Team.' },
          { status: 'In Progress', timestamp: new Date('2026-05-20T14:45:00Z'), description: 'Crew arrived at Halwasiya Market, isolated power.' },
          { status: 'Resolved', timestamp: new Date('2026-05-20T16:10:00Z'), description: 'Wire re-tensioned and insulated. Pedestrian lane reopened.' }
        ],
        createdAt: new Date('2026-05-20T14:22:00.000Z')
      },
      {
        _id: new mongoose.Types.ObjectId('664d4b1a4f1a4e1a4e1a7712'),
        name: 'Ramesh Maurya',
        phone: '+91 88776 55432',
        area: 'Aliganj, Lucknow',
        title: 'Garbage Dump Accumulation and No Door-to-door Collection',
        description: 'No waste collection truck has visited Aliganj Sector H for the past 5 days. Neighbors are throwing trash in the open plot at the corner, and dogs are scattering it all over the lane. Bad odor has made it impossible to open windows.',
        image: null,
        category: 'sanitation',
        department: 'Nagar Nigam',
        status: 'Pending',
        urgency: 'Medium',
        urgency_reason: 'Sanitation neglect of 5 days leading to open dumping and dog infestation. Medium health risk.',
        sentiment: 'Negative',
        summary_en: 'Accumulated garbage at open plot in Sector H, Aliganj. No sanitation trucks visiting for 5 days.',
        summary_hi: 'सेक्टर H, अलीगंज में खुले भूखंड पर कचरा जमा। 5 दिनों से कचरा गाड़ी नहीं आ रही है।',
        citizen_update_en: 'Complaint registered. Routed to Aliganj ward sanitation supervisor.',
        citizen_update_hi: 'शिकायत दर्ज की गई। अलीगंज वार्ड स्वच्छता पर्यवेक्षक को प्रेषित।',
        sms_hi: 'जनमित्र एलकेओ: आपका टिकट JM-2026-7712 नगर निगम के स्वच्छता विभाग को प्रेषित किया गया है।',
        ticket_sla_days: 3,
        ai_confidence_score: 91.2,
        priority_score: 54,
        estimated_resolution: new Date('2026-05-25T18:00:00.000Z'),
        requires_escalation: false,
        department_note: '',
        tags: ['Garbage Dump', 'Aliganj', 'Nagar Nigam', 'Public Health'],
        timeline: [
          { status: 'Submitted', timestamp: new Date('2026-05-22T08:30:00Z'), description: 'Complaint filed.' },
          { status: 'AI Analyzed', timestamp: new Date('2026-05-22T08:31:12Z'), description: 'AI Engine routed to Lucknow Nagar Nigam (Sanitation).' }
        ],
        createdAt: new Date('2026-05-22T08:30:00.000Z')
      },
      {
        _id: new mongoose.Types.ObjectId('664d4b1a4f1a4e1a4e1a1188'),
        name: 'Rahul Agnihotri',
        phone: '+91 99887 76655',
        area: 'Indira Nagar, Lucknow',
        title: 'Severe Street Encroachment by Street Vendors blocking main road',
        description: 'Illegal temporary shops and vendors have extended their stalls right onto the road at Indira Nagar near Bhootnath Market. During peak office hours in the evening, there is an absolute gridlock of traffic. Walking has also become impossible.',
        image: null,
        category: 'traffic',
        department: 'Rajasva Vibhag',
        status: 'In Progress',
        urgency: 'Medium',
        urgency_reason: 'Regular traffic choke points due to market vendor extensions. Requires coordinated municipal eviction drive.',
        sentiment: 'Neutral',
        summary_en: 'Street encroachment by vendors near Bhootnath Market in Indira Nagar causing daily traffic jams.',
        summary_hi: 'भूतनाथ मार्ग के पास विक्रेताओं द्वारा मुख्य मार्ग पर अतिक्रमण, जिससे रोजाना ट्रैफिक जाम होता है।',
        citizen_update_en: 'Municipal enforcement squad schedule created. Combined action with local police planned.',
        citizen_update_hi: 'नगर पालिका प्रवर्तन दल का कार्यक्रम तैयार। स्थानीय पुलिस के साथ संयुक्त कार्रवाई की योजना।',
        sms_hi: 'जनमित्र एलकेओ: इंदिरा नगर अतिक्रमण शिकायत का कार्यभार Town Planning विभाग को सौंपा गया है। जल्द कार्रवाई होगी।',
        ticket_sla_days: 5,
        ai_confidence_score: 87.4,
        priority_score: 62,
        estimated_resolution: new Date('2026-05-23T18:00:00.000Z'),
        requires_escalation: true,
        department_note: 'Encroachment cell has logged the issue. Coordinated clearance scheduled for Saturday morning.',
        tags: ['Encroachment', 'Bhootnath Market', 'Indira Nagar', 'Traffic Gridlock'],
        timeline: [
          { status: 'Submitted', timestamp: new Date('2018-05-18T10:00:00Z'), description: 'Complaint filed.' },
          { status: 'AI Analyzed', timestamp: new Date('2018-05-18T10:01:15Z'), description: 'AI Engine routed to Town Planning & Encroachment.' },
          { status: 'Assigned', timestamp: new Date('2018-05-18T11:00:00Z'), description: 'Allocated to Encroachment Clearance Cell.' },
          { status: 'In Progress', timestamp: new Date('2018-05-19T09:30:00Z'), description: 'Encroachment survey completed. Police squad requested.' }
        ],
        createdAt: new Date('2026-05-18T10:00:00.000Z')
      }
    ];

    for (const c of complaintsToSeed) {
      const exists = await Complaint.findById(c._id);
      if (!exists) {
        await Complaint.create(c);
        console.log(`[Seeder] Seeded complaint for ${c.name} (${c._id}) successfully.`);
      }
    }
  } catch (error) {
    console.error(`[Seeder Error] Failed to seed default complaints:`, error.message);
  }
};

module.exports = seedDefaultComplaints;

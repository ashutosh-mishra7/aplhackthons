import axiosClient, { notifyRequestListeners } from './axiosClient';
import { initialComplaints } from './mockData';

// Local storage helper
const getStoredComplaints = () => {
  const data = localStorage.getItem('janmitra_complaints');
  if (!data) {
    localStorage.setItem('janmitra_complaints', JSON.stringify(initialComplaints));
    return initialComplaints;
  }
  return JSON.parse(data);
};

const saveComplaints = (complaints) => {
  localStorage.setItem('janmitra_complaints', JSON.stringify(complaints));
};

// AI Heuristics Analysis Logic
export const analyzeComplaintText = (title = '', description = '') => {
  const text = `${title} ${description}`.toLowerCase();
  
  let category = 'General Public Grievance';
  let department = 'Public Works Department (PWD)';
  let urgency = 'medium';
  let urgency_reason = 'Standard priority public grievance.';
  let sentiment = 'Neutral';
  let ticket_sla_days = 4;
  let priority_score = 45;
  let requires_escalation = false;
  let tags = ['General', 'Mitra'];
  
  let summary_en = `Citizen reported issue regarding: ${title || 'general issue'}.`;
  let summary_hi = `नागरिक द्वारा दर्ज शिकायत: ${title || 'सामान्य समस्या'}।`;
  let citizen_update_en = 'Your grievance has been logged by the JanMitra AI Engine and is under queue.';
  let citizen_update_hi = 'आपकी शिकायत को जनमित्र एआई इंजन द्वारा दर्ज कर लिया गया है और यह कतार में है।';
  let sms_hi = `जनमित्र एलकेओ: आपकी शिकायत दर्ज हो गई है। जल्द कार्रवाई की जाएगी।`;
  let department_note = 'Grievance assigned automatically. Initial review pending.';

  // Sentiment detection
  if (text.includes('angry') || text.includes('worst') || text.includes('terrible') || text.includes('disaster') || text.includes('smell') || text.includes('hazardous') || text.includes('overflow')) {
    sentiment = 'Negative / Frustrated';
  } else if (text.includes('dangerous') || text.includes('scared') || text.includes('fear') || text.includes('shock') || text.includes('wire')) {
    sentiment = 'Anxious / Urgent';
  } else if (text.includes('request') || text.includes('please') || text.includes('help')) {
    sentiment = 'Polite / Hopeful';
  }

  // Domain categorization rules
  if (text.includes('wire') || text.includes('electricity') || text.includes('power') || text.includes('transformer') || text.includes('lesa') || text.includes('current')) {
    category = 'Power Outage and Electrical Hazard';
    department = 'Lucknow Electricity Supply (LESA)';
    urgency = text.includes('wire') ? 'critical' : 'high';
    urgency_reason = text.includes('wire') ? 'Exposed electrical hazard presents immediate life safety risks.' : 'Grid power outage affects residential grids.';
    ticket_sla_days = text.includes('wire') ? 1 : 2;
    priority_score = text.includes('wire') ? 95 : 75;
    tags = ['Electricity', 'LESA', 'Electrical Safety', 'Power Supply'];
    summary_en = `Low hanging electrical wires or transformer issues reported near ${title || 'locality'}.`;
    summary_hi = `बिजली के ढीले लटके तार या ट्रांसफार्मर की खराबी की शिकायत दर्ज।`;
    citizen_update_en = 'Emergency LESA technical unit dispatched for grid isolation and wire re-tensioning.';
    citizen_update_hi = 'ग्रिड आइसोलेशन और तार को कसने के लिए आपातकालीन लेसा तकनीकी इकाई रवाना की गई।';
    sms_hi = `जनमित्र एलकेओ: आपका बिजली शिकायत टिकट लेसा आपातकालीन टीम को आवंटित कर दिया गया है।`;
  } 
  else if (text.includes('sewage') || text.includes('drain') || text.includes('waterlogging') || text.includes('overflow') || text.includes('water')) {
    category = 'Sewage and Waterlogging';
    department = 'Jal Sansthan (Water & Sewage)';
    urgency = text.includes('overflow') ? 'high' : 'medium';
    urgency_reason = 'Sewage or water leakage affecting roads and public health conditions.';
    ticket_sla_days = 2;
    priority_score = 68;
    tags = ['Sewage', 'Water Supply', 'Jal Sansthan', 'Health Hazard'];
    summary_en = `Waterlogging/Sewage leakage causing blockage.`;
    summary_hi = `जलभराव और सीवेज रिसाव के कारण मार्ग अवरुद्ध होने की शिकायत।`;
    citizen_update_en = 'Jal Sansthan supervisor assigned. Vacuum suction pump team requested.';
    citizen_update_hi = 'जल संस्थान पर्यवेक्षक नियुक्त। वैक्यूम सक्शन पंप टीम को सूचित किया गया।';
  }
  else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('clean') || text.includes('sanitation') || text.includes('dump')) {
    category = 'Garbage Collection and Sanitation';
    department = 'Lucknow Nagar Nigam (Sanitation)';
    urgency = 'medium';
    urgency_reason = 'Accumulated trash causing sanitary discomfort and health issues.';
    ticket_sla_days = 3;
    priority_score = 52;
    tags = ['Sanitation', 'Nagar Nigam', 'Garbage', 'Clean Lucknow'];
    summary_en = `Solid waste dump accumulation and absence of sanitation crew.`;
    summary_hi = `ठोस कचरा जमा होने और सफाई कर्मचारियों की अनुपस्थिति की शिकायत।`;
    citizen_update_en = 'Area sanitary inspector notified. Garbage loader compactor scheduled.';
    citizen_update_hi = 'क्षेत्र स्वच्छता निरीक्षक को सूचित किया गया। कचरा लोडर कम्पेक्टर निर्धारित।';
  }
  else if (text.includes('encroach') || text.includes('vendor') || text.includes('illegal') || text.includes('parking') || text.includes('stalls')) {
    category = 'Encroachment and Illegal Parking';
    department = 'Town Planning & Encroachment';
    urgency = 'medium';
    urgency_reason = 'Public road space blocked by stalls or unauthorized vehicles causing traffic congestion.';
    ticket_sla_days = 5;
    priority_score = 58;
    tags = ['Encroachment', 'Town Planning', 'Traffic Congestion', 'Lucknow Market'];
    summary_en = `Illegal vendor stalls or parking causing vehicle congestion.`;
    summary_hi = `अवैध वेंडिंग स्टॉल या पार्किंग के कारण वाहन आवागमन प्रभावित।`;
    citizen_update_en = 'Eviction request registered. Municipal enforcement team coordination in progress.';
    citizen_update_hi = 'अतिक्रमण हटाने का अनुरोध दर्ज। नगर निगम दल समन्वय प्रगति पर है।';
  }
  else if (text.includes('pothole') || text.includes('road') || text.includes('crack') || text.includes('street') || text.includes('broken')) {
    category = 'Road Repairs and Infrastructure';
    department = 'Public Works Department (PWD)';
    urgency = 'low';
    urgency_reason = 'Damaged asphalt/potholes on urban streets requiring repair work order.';
    ticket_sla_days = 7;
    priority_score = 35;
    tags = ['PWD', 'Road Repair', 'Pothole', 'Infrastructure'];
    summary_en = `Damaged roads and potholes reported.`;
    summary_hi = `क्षतिग्रस्त सड़कों और गड्ढों की मरम्मत की शिकायत।`;
  }

  // AI confidence scoring
  let ai_confidence_score = Math.round((70 + Math.random() * 28) * 10) / 10;
  
  // Predict resolution date
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + ticket_sla_days);

  // SLA Escalation check
  if (priority_score > 80 && urgency === 'critical') {
    requires_escalation = true;
  }

  return {
    category,
    department,
    urgency,
    urgency_reason,
    sentiment,
    summary_en,
    summary_hi,
    citizen_update_en,
    citizen_update_hi,
    sms_hi,
    ticket_sla_days,
    ai_confidence_score,
    priority_score,
    estimated_resolution: estDate.toISOString(),
    requires_escalation,
    department_note,
    tags
  };
};

export const complaintService = {
  // Get complaint by ID
  getById: async (id) => {
    // Axios request simulation triggers interceptor and delay
    await axiosClient.get(`/complaints/${id}`);
    const complaints = getStoredComplaints();
    const complaint = complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
    
    const mockResponse = complaint ? { data: complaint } : { status: 404, message: 'Ticket not found.' };
    notifyRequestListeners('GET', `/complaints/${id}`, null, mockResponse);
    
    if (!complaint) {
      throw new Error('Ticket not found.');
    }
    return complaint;
  },

  // Submit new complaint
  submit: async (complaintData) => {
    await axiosClient.post('/complaints', complaintData);
    const complaints = getStoredComplaints();
    
    const aiAnalysis = analyzeComplaintText(complaintData.title, complaintData.description);
    const newId = `JM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newComplaint = {
      id: newId,
      citizenName: complaintData.name,
      citizenPhone: complaintData.phone,
      area: complaintData.area,
      title: complaintData.title,
      description: complaintData.description,
      imageUrl: complaintData.imageUrl || '',
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      aiAnalysis,
      timeline: [
        { status: 'Submitted', timestamp: new Date().toISOString(), description: 'Complaint filed via Citizen Portal.' },
        { status: 'AI Analyzed', timestamp: new Date().toISOString(), description: `AI Engine routed to ${aiAnalysis.department} with priority score ${aiAnalysis.priority_score}` }
      ]
    };
    
    complaints.unshift(newComplaint);
    saveComplaints(complaints);
    
    notifyRequestListeners('POST', '/complaints', complaintData, { data: newComplaint });
    return newComplaint;
  },

  // List all complaints
  list: async () => {
    await axiosClient.get('/complaints');
    const listData = getStoredComplaints();
    notifyRequestListeners('GET', '/complaints', null, { data: listData });
    return listData;
  },

  // Update status (for admin actions)
  updateStatus: async (id, status, note = '') => {
    await axiosClient.patch(`/complaints/${id}`, { status, note });
    const complaints = getStoredComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = status;
      complaints[index].timeline.push({
        status,
        timestamp: new Date().toISOString(),
        description: note || `Complaint status updated to ${status}.`
      });
      if (note) {
        complaints[index].aiAnalysis.department_note = note;
      }
      saveComplaints(complaints);
      notifyRequestListeners('PATCH', `/complaints/${id}`, { status, note }, { data: complaints[index] });
      return complaints[index];
    }
    throw new Error('Complaint not found.');
  }
};

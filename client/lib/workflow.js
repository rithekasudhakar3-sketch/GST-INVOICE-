// ==========================================
// WORKFLOW STATE MACHINE ENGINE
// ==========================================

const WORKFLOW_KEY = 'invoicehub-workflow-requests';

const defaultRequests = [
  {
    id: "REQ-001",
    title: "A4 Paper & Office Stationery",
    amount: 12000,
    department: "Admin",
    gstRate: 12,
    gstAmount: 1440,
    total: 13440,
    vendorName: "Global Supplies Ltd",
    accountantName: "Amit Sharma",
    status: "pending_manager",
    notes: "Stationery restocking for Q3",
    createdAt: "2026-07-08T10:00:00.000Z",
    itcLogged: false
  },
  {
    id: "REQ-002",
    title: "Server Maintenance Contract",
    amount: 85000,
    department: "IT",
    gstRate: 18,
    gstAmount: 15300,
    total: 100300,
    vendorName: "Acme Corp Services",
    accountantName: "Amit Sharma",
    status: "pending_hr",
    notes: "Annual maintenance contract for server room",
    createdAt: "2026-07-08T09:15:00.000Z",
    itcLogged: false
  },
  {
    id: "REQ-003",
    title: "Office High-Speed Router",
    amount: 25000,
    department: "IT",
    gstRate: 18,
    gstAmount: 4500,
    total: 29500,
    vendorName: "Hitech Networking",
    accountantName: "Amit Sharma",
    status: "draft",
    notes: "Router for new conference room",
    createdAt: "2026-07-07T14:20:00.000Z",
    itcLogged: false
  },
  {
    id: "REQ-004",
    title: "Employee Training Program",
    amount: 120000,
    department: "HR",
    gstRate: 18,
    gstAmount: 21600,
    total: 141600,
    vendorName: "Skillup Academy",
    accountantName: "Amit Sharma",
    status: "approved",
    notes: "Sales team onboarding training",
    createdAt: "2026-07-06T11:00:00.000Z",
    itcLogged: false
  },
  {
    id: "REQ-005",
    title: "Desktop Upgrade (5 Units)",
    amount: 350000,
    department: "IT",
    gstRate: 18,
    gstAmount: 63000,
    total: 413000,
    vendorName: "Dell Computers",
    accountantName: "Amit Sharma",
    status: "paid",
    notes: "PC upgrades for finance team",
    createdAt: "2026-07-05T16:30:00.000Z",
    itcLogged: true
  }
];

export function getWorkflowRequests() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(WORKFLOW_KEY);
    if (!raw) {
      window.localStorage.setItem(WORKFLOW_KEY, JSON.stringify(defaultRequests));
      return defaultRequests;
    }
    return JSON.parse(raw);
  } catch {
    return defaultRequests;
  }
}

export function saveWorkflowRequests(requests) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WORKFLOW_KEY, JSON.stringify(requests));
}

export function updateRequestStatus(id, newStatus) {
  const requests = getWorkflowRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = newStatus;
    saveWorkflowRequests(requests);
    return { success: true, request: requests[index] };
  }
  return { success: false, error: 'Request not found' };
}

export function createRequest(requestData) {
  const requests = getWorkflowRequests();
  const newRequest = {
    id: `REQ-${Date.now().toString().slice(-5)}`,
    status: 'draft',
    itcLogged: false,
    createdAt: new Date().toISOString(),
    ...requestData
  };
  requests.push(newRequest);
  saveWorkflowRequests(requests);
  return newRequest;
}

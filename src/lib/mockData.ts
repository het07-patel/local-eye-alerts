
import { Problem, Category } from "./types";

export const categories: Category[] = [
  { id: "1", name: "Road Issue", icon: "road" },
  { id: "2", name: "Trash/Garbage", icon: "trash" },
  { id: "3", name: "Graffiti", icon: "paint-bucket" },
  { id: "4", name: "Street Light", icon: "lightbulb" },
  { id: "5", name: "Water Issue", icon: "droplet" },
  { id: "6", name: "Other", icon: "more-horizontal" },
];

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic hazards and potential vehicle damage",
    category: "1",
    status: "in-progress",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    location: {
      address: "123 Main St, Anytown",
      lat: 40.7128,
      lng: -74.006,
    },
    reportedBy: "John Doe",
    reportedAt: "2025-04-10T14:30:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
    updates: [
      {
        id: "1a",
        content: "City maintenance has been notified",
        timestamp: "2025-04-10T16:45:00Z",
        author: "Admin",
      },
      {
        id: "1b",
        content: "Crew scheduled for repair next week",
        timestamp: "2025-04-12T09:15:00Z",
        author: "City Maintenance",
      },
    ],
  },
  {
    id: "2",
    title: "Fallen Tree Blocking Sidewalk",
    description: "Tree fell during last night's storm and is completely blocking pedestrian access",
    category: "6",
    status: "reported",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    location: {
      address: "45 Park Avenue, Anytown",
      lat: 40.7135,
      lng: -74.0046,
    },
    reportedBy: "Jane Smith",
    reportedAt: "2025-04-14T08:20:00Z",
    updatedAt: "2025-04-14T08:20:00Z",
    updates: [],
  },
  {
    id: "3",
    title: "Overflowing Trash Bin",
    description: "Public trash bin hasn't been collected in weeks and is causing odor issues",
    category: "2",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    location: {
      address: "78 Central Park, Anytown",
      lat: 40.7142,
      lng: -74.0025,
    },
    reportedBy: "Mike Johnson",
    reportedAt: "2025-04-05T11:45:00Z",
    updatedAt: "2025-04-09T14:30:00Z",
    updates: [
      {
        id: "3a",
        content: "Waste management notified",
        timestamp: "2025-04-05T12:30:00Z",
        author: "Admin",
      },
      {
        id: "3b",
        content: "Scheduled for collection tomorrow",
        timestamp: "2025-04-07T10:15:00Z",
        author: "Waste Management",
      },
      {
        id: "3c",
        content: "Issue resolved - bin emptied and area cleaned",
        timestamp: "2025-04-09T14:30:00Z",
        author: "Waste Management",
      },
    ],
  },
];

// Mock service functions
let problems = [...mockProblems];

export const getProblems = () => {
  return Promise.resolve([...problems]);
};

export const getProblemById = (id: string) => {
  const problem = problems.find(p => p.id === id);
  return Promise.resolve(problem || null);
};

export const getLocalAlerts = (lat: number, lng: number, radius: number = 5) => {
  // In a real app, we would filter by proximity to coordinates
  // For mock, just return all problems
  return Promise.resolve([...problems]);
};

export const addProblem = (problem: Omit<Problem, "id" | "reportedAt" | "updatedAt" | "updates">) => {
  const newProblem: Problem = {
    ...problem,
    id: (problems.length + 1).toString(),
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updates: [],
  };
  
  problems = [...problems, newProblem];
  return Promise.resolve(newProblem);
};

export const updateProblem = (id: string, update: Partial<Problem>) => {
  let updated = false;
  problems = problems.map(p => {
    if (p.id === id) {
      updated = true;
      return { 
        ...p, 
        ...update, 
        updatedAt: new Date().toISOString() 
      };
    }
    return p;
  });
  
  if (!updated) {
    return Promise.reject(new Error("Problem not found"));
  }
  
  return Promise.resolve(problems.find(p => p.id === id)!);
};

export const addUpdate = (problemId: string, update: Omit<Update, "id" | "timestamp">) => {
  const problem = problems.find(p => p.id === problemId);
  
  if (!problem) {
    return Promise.reject(new Error("Problem not found"));
  }
  
  const newUpdate: Update = {
    ...update,
    id: `${problemId}-${problem.updates.length + 1}`,
    timestamp: new Date().toISOString(),
  };
  
  problem.updates.push(newUpdate);
  problem.updatedAt = new Date().toISOString();
  
  return Promise.resolve(newUpdate);
};

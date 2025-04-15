
export type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "reported" | "in-progress" | "resolved";
  imageUrl?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
  updates: Update[];
};

export type Update = {
  id: string;
  content: string;
  timestamp: string;
  author: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

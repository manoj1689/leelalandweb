import BASE_URL from '../routes/BaseApi';
export interface PartnerRequest {
  name: string;
  preference: string |null;
  personality: string;
  age: number;
  description: string;
  image:string;
}

export interface PartnerResponse {
  success: boolean;
  message: string;
  data?: any; // Add more specific fields based on API response
}

export interface GetPartnersResponse {
  id: number;
  name: string;
  preference: string;
  personality: string;
  age: number;
  description: string;
  image:string;
}

// Add Partner Service
export const addPartner = async (partnerData: PartnerRequest): Promise<PartnerResponse> => {
  const token = localStorage.getItem('user_token'); // Retrieve token from localStorage
  console.log("token at addPartner service", token);
  if (!token) {
    throw new Error('Authentication token is missing');
  }

  console.log("partnerData", partnerData);
  const response = await fetch(`${BASE_URL}/add-partner`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the token in Authorization header
      'accept': 'application/json',
    },
    body: JSON.stringify(partnerData), // Convert partner data to JSON string
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to add partner');
  }

  return response.json();
};

// Get Partners Service
export const getPartners = async (): Promise<GetPartnersResponse[]> => {
  const token = localStorage.getItem('user_token'); // Retrieve token from localStorage
 // console.log("token at getPartners service", token);
  if (!token) {
    throw new Error('Authentication token is missing');
  }

  const response = await fetch(`${BASE_URL}/partners`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token in Authorization header
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch partners');
  }

  return response.json();
};

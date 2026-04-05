const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = rawBaseUrl.startsWith('http') ? rawBaseUrl : `https://${rawBaseUrl}`;
const API_URL = `${API_BASE_URL}/api/v1/studyplanner/generate`;

export const generateSchedule = async (formData) => {
  try {
    const user = JSON.parse(localStorage.getItem('studyplanner_user'));
    const token = user?.accessToken || '';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw new Error("Unable to connect to the backend planner. Please ensure the server is running.");
  }
};

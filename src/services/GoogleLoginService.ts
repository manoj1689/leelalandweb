import { jwtDecode } from 'jwt-decode';

// Define the custom type for the decoded Google token
interface DecodedGoogleToken {
  sub: string;     // Google’s unique identifier for the user
  name: string;
  email: string;
  picture?: string;  // Optional property for the user’s profile picture
}

export async function handleGoogleSignIn(googleCredential: string) {
  // Decode the Google token with the custom type
  const decodedToken = jwtDecode<DecodedGoogleToken>(googleCredential);

  const idToken = googleCredential;
 console.log("token",idToken)
  // Prepare the request body to match the backend endpoint
  const requestBody = {
    device_id: decodedToken.sub,         // Google 'sub' is used as the unique identifier
    email: decodedToken.email,
    name: decodedToken.name
  };

  console.log("Request body:", requestBody);

  try {
    const response = await fetch("http://127.0.0.1:8000/google_signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json" // Specify that the response should be in JSON format
      },
      body: JSON.stringify(requestBody)  // Send the required fields as JSON
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful", data);
      // Store backend JWT in local storage
      localStorage.setItem("user_token", data.data.access_token);
      localStorage.setItem("user_id", data.data.user_id); // Store user info
    } else {
      console.error("Error logging in:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred during Google Sign-In:", error);
  }
}


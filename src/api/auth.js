// api/auth.js
export async function checkAuthentication(url, cookie) {
  // List of routes that don't require authentication
  const publicRoutes = [
    '/',
    '/page/terms-and-conditions',
    '/page/privacy-policy',
  ];

  if (url.startsWith('/user/')) {
    publicRoutes.push(url);
  }

  const noneAuthUrl = [
    '/auth/login',
    '/auth/signup',
    '/auth/verify'
  ]

  // Check if the requested URL is in the list of public routes
  if (publicRoutes.includes(url)) {
    return true; // Public routes are always authenticated
  }

  if (noneAuthUrl.includes(url)) {
    try {
      // const response = await fetch('http://localhost:3002/auth/check'); // Replace with your actual authentication endpoint
      // const data = await response.json();
      // console.log(data)
      if (cookie) {
        return false; // Assuming the API returns a boolean indicating authentication status
      } else {
        return true; // Assuming the API returns a boolean indicating authentication status
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false; // Return false on error or if not authenticated
    }
  } else {
    try {
      // const response = await fetch('http://localhost:3002/auth/check'); // Replace with your actual authentication endpoint
      // const data = await response.json();
      // console.log(data)
      if (cookie) {
        return true; // Assuming the API returns a boolean indicating authentication status
      } else {
        return false; // Assuming the API returns a boolean indicating authentication status
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false; // Return false on error or if not authenticated
    }
  }
}

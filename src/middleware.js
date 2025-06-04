// // src/middleware.js
// import { defineMiddleware } from 'astro:middleware';

// // Pages qui nécessitent une authentification
// const protectedRoutes = [
//   '/dashboard',
//   '/profile',
//   // '/cuisine',
//   '/epiceries',
//   '/recettes',
//   '/devenir-partenaire'
// ];

// // Pages publiques (pas de redirection)
// const publicRoutes = [
//   '/',
//   '/login',
//   '/register'
// ];

// export const onRequest = defineMiddleware(async (context, next) => {
//   const { url, cookies, redirect } = context;
//   const pathname = url.pathname;

//   // Récupérer le token d'auth depuis les cookies
//   const authToken = cookies.get('pb_auth')?.value;
//   const isAuthenticated = authToken && authToken !== '';

//   // Si route protégée et pas authentifié -> redirection login
//   if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
//     return redirect('/login?redirect=' + encodeURIComponent(pathname));
//   }

//   // Si déjà connecté et sur page login/register -> redirection dashboard
//   if ((pathname === '/login' || pathname === '/register') && isAuthenticated) {
//     return redirect('/dashboard');
//   }

//   return next();
// });
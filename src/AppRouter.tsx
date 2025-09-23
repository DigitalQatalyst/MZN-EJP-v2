import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import { CourseType } from './utils/mockData';
import { AuthProvider } from './components/Header';
import { MarketplaceRouter } from './pages/marketplace/MarketplaceRouter';
import MarketplaceDetailsPage from './pages/marketplace/MarketplaceDetailsPage';
import DashboardRouter from './pages/dashboard/DashboardRouter';
import { DiscoverAbuDhabi } from './pages/discoverAbuDhabi';
import NotFound from './pages/NotFound';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import KfBot from "./bot/KfBot";

export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (
      compareCourses.length < 3 &&
      !compareCourses.some((c) => c.id === course.id)
    ) {
      setCompareCourses((prev) => [...prev, course]);
    }
  };

  const client = new ApolloClient({
    link: new HttpLink({ uri: 'https://9609a7336af8.ngrok-free.app/services-api' }), // <-- Use HttpLink
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
        <KfBot />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/courses" element={<App />} />
            <Route path="/courses/:itemId" element={<MarketplaceDetailsPage marketplaceType="courses" bookmarkedItems={bookmarkedCourses} onToggleBookmark={toggleBookmark} onAddToComparison={handleAddToComparison} />} />
            <Route path="/marketplace/*" element={<MarketplaceRouter />} />
            <Route path="/dashboard/*" element={<DashboardRouter />} />
            <Route path="/discover-abudhabi" element={<DiscoverAbuDhabi />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  };
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { DocumentsPage } from './documents';
import { Overview } from './overview';
import { ServiceRequestsPage } from './serviceRequests';
import { checkOnboardingStatus } from '../../services/onboardingService'; // CHANGED: Use your service
import { OnboardingForm } from './onboarding/OnboardingForm';
import { ReportsPage } from './reportingObligations/ReportsPage';
import { AllReceivedReportsPage } from './reportingObligations/AllReceivedReportsPage';
import { AllSubmittedReportsPage } from './reportingObligations/AllSubmittedReportsPage';
import { AllUpcomingObligationsPage } from './reportingObligations/AllUpcomingObligationsPage';
import BusinessProfilePage from './businessProfile';
import SupportPage from './support';
import SettingsPage from './settings';
import { ChatInterface } from '../../components/Chat/ChatInterface';

// Main Dashboard Router Component
const DashboardRouter = () => {
    const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null); // CHANGED: null = loading
    const [isOpen, setIsOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                console.log('🔍 Checking onboarding status...');
                const completed = await checkOnboardingStatus(); // CHANGED: Use your function
                console.log('✅ Onboarding status:', completed);
                
                setOnboardingComplete(completed);
                
                if (!completed && !location.pathname.includes('/dashboard/onboarding')) {
                    navigate('/dashboard/onboarding', { replace: true });
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                // Fallback: assume not completed to be safe
                setOnboardingComplete(false);
            }
        };
        
        checkOnboarding();
    }, [location.pathname, navigate]);

    // If onboarding is complete and user is on onboarding route, send to overview
    useEffect(() => {
        if (onboardingComplete === true && location.pathname.includes('/dashboard/onboarding')) {
            navigate('/dashboard/overview', { replace: true });
        }
    }, [onboardingComplete, location.pathname, navigate]);

    const handleOnboardingComplete = () => {
        console.log('🎉 Onboarding completed!');
        setOnboardingComplete(true);
        navigate('/dashboard/overview', { replace: true });
    };

    // LOADING STATE: Show loading spinner while checking status
    if (onboardingComplete === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout
            onboardingComplete={onboardingComplete}
            setOnboardingComplete={setOnboardingComplete}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
        >
            <Routes>
                <Route index element={<Navigate to={onboardingComplete ? "overview" : "onboarding"} replace />} />
                <Route path="onboarding" element={<OnboardingForm onComplete={handleOnboardingComplete} isRevisit={onboardingComplete} />} />
                <Route path="overview" element={<Overview />} />
                <Route path="documents" element={<DocumentsPage
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />} />
                <Route path="requests" element={<ServiceRequestsPage
                    setIsOpen={setIsOpen}
                    isLoggedIn={isLoggedIn}
                />} />
                <Route path="reporting" element={<Navigate to="reporting-obligations" replace />} />
                <Route path="reporting-obligations" element={<ReportsPage />} />
                <Route path="reporting-obligations/obligations" element={<AllUpcomingObligationsPage />} />
                <Route path="reporting-obligations/submitted" element={<AllSubmittedReportsPage />} />
                <Route path="reporting-obligations/received" element={<AllReceivedReportsPage />} />
                <Route path="profile" element={<BusinessProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="chat-support" element={<ChatInterface />} />
                <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
        </DashboardLayout>
    );
};

export default DashboardRouter;
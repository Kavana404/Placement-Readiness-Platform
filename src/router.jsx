import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import AssessmentsPage from "./pages/AssessmentsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import TestChecklistPage from "./pages/TestChecklistPage";
import ShipGatePage from "./pages/ShipGatePage";
import ProofPage from "./pages/ProofPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "assessments", element: <AssessmentsPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "/results",
    element: <ResultsPage />,
  },
  {
    path: "/prp/07-test",
    element: <TestChecklistPage />,
  },
  {
    path: "/prp/08-ship",
    element: <ShipGatePage />,
  },
  {
    path: "/prp/proof",
    element: <ProofPage />,
  },
]);

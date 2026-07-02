import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "./responsive.css";

import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./LoadingScreen";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import AppHome from "./webapp/pages/AppHome";

import Login from "./webapp/pages/Login";
import Register from "./webapp/pages/Register";
import Otp from "./webapp/pages/Otp";
import AuthSuccess from "./webapp/pages/AuthSuccess";
import ForgotPin from "./webapp/pages/ForgotPin";
import ResetPin from "./webapp/pages/ResetPin";

import EventDetails from "./webapp/pages/EventDetails";
import Contribute from "./webapp/pages/Contribute";
import PaymentConfirm from "./webapp/pages/PaymentConfirm";
import PaymentSuccess from "./webapp/pages/PaymentSuccess";

import CreateEvent from "./webapp/pages/CreateEvent";
import Dashboard from "./webapp/pages/Dashboard";
import DashboardEvents from "./webapp/pages/DashboardEvents";
import Contributors from "./webapp/pages/Contributors";
import Wallet from "./webapp/pages/Wallet";
import Reports from "./webapp/pages/Reports";
import Notifications from "./webapp/pages/Notifications";
import ShareCenter from "./webapp/pages/ShareCenter";
import Profile from "./webapp/pages/Profile";
import Settings from "./webapp/pages/Settings";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollProgress />

      <Routes>
        {/* =====================================================
            LANDING WEBSITE
        ====================================================== */}

        <Route path="/" element={<Home />} />

        {/* Premium Public Events Home */}
        <Route path="/home" element={<AppHome />} />
        <Route path="/events" element={<AppHome />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* =====================================================
            AUTHENTICATION
        ====================================================== */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/success" element={<AuthSuccess />} />
        <Route path="/forgot-pin" element={<ForgotPin />} />
        <Route path="/reset-pin" element={<ResetPin />} />

        {/* =====================================================
            PUBLIC EVENT FLOW
        ====================================================== */}

        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/events/:id/contribute"
          element={<Contribute />}
        />

        <Route
          path="/events/:id/payment-confirm"
          element={<PaymentConfirm />}
        />

        <Route
          path="/events/:id/payment-success"
          element={<PaymentSuccess />}
        />

        {/* =====================================================
            ORGANIZER DASHBOARD
        ====================================================== */}

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/dashboard/events"
          element={<DashboardEvents />}
        />

        {/* NEW: EDIT EVENT ROUTE */}
        <Route
          path="/dashboard/events/:id/edit"
          element={<CreateEvent />}
        />

        <Route path="/create-event" element={<CreateEvent />} />

        <Route path="/wallet" element={<Wallet />} />
        <Route path="/contributors" element={<Contributors />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/share" element={<ShareCenter />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* =====================================================
            404
        ====================================================== */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
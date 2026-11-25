
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import {
  ClipboardList,
  Search,
  CheckCircle,
  ShieldAlert,
  HelpCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTickets from "./pages/admin/ManageTickets";
import Bookings from "./pages/admin/Bookings";
import Resources from "./pages/admin/Resources";
import Analytics from "./pages/admin/Analytics";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import MyTickets from "./pages/user/MyTickets";
import SubmitComplaint from "./pages/user/SubmitComplaint";
import TicketDetails from "./pages/user/TicketDetails";

// Reusable Public Information Page
const InfoPage = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="min-h-screen bg-[#F1F7FA]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-3xl bg-[#193D57] px-7 py-14 text-center shadow-xl sm:px-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10ADA0] text-white">
            <Icon size={32} />
          </div>

          <h1 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-100">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-[#E2EBF0] bg-white p-7 shadow-sm sm:p-10">
          {children}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-7 py-4 font-bold text-white transition hover:bg-[#0D978C]"
          >
            Back to Home
            <ArrowRight size={19} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// How It Works Page
const HowItWorksPage = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Register a Complaint",
      description:
        "Create an account and submit your complaint with the required details.",
    },
    {
      icon: Search,
      title: "Complaint Review",
      description:
        "Your complaint can be reviewed and assigned to the appropriate team.",
    },
    {
      icon: CheckCircle,
      title: "Track Resolution",
      description:
        "Check complaint updates and follow the resolution progress.",
    },
  ];

  return (
    <InfoPage
      title="How It Works"
      subtitle="A simple process to submit complaints and follow their progress."
      icon={ClipboardList}
    >
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-2xl border border-[#E2EBF0] p-6"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E3F8F5] text-[#10ADA0]">
                <StepIcon size={29} />
              </div>

              <p className="mt-5 font-bold text-[#10ADA0]">
                STEP 0{index + 1}
              </p>

              <h2 className="mt-3 text-xl font-bold text-[#193D57]">
                {step.title}
              </h2>

              <p className="mt-3 leading-7 text-gray-500">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </InfoPage>
  );
};

// Progress Page
const ProgressPage = () => (
  <InfoPage
    title="Track Your Complaint"
    subtitle="Stay informed about your complaint status and updates."
    icon={ClipboardList}
  >
    <div className="mx-auto max-w-xl text-center">
      <h2 className="text-2xl font-bold text-[#193D57]">
        Complaint Progress
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        Login to your account to view your submitted complaints and their
        latest status.
      </p>

      <Link
        to="/login"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-7 py-4 font-bold text-white hover:bg-[#0D978C]"
      >
        Login to Track
        <ArrowRight size={19} />
      </Link>
    </div>
  </InfoPage>
);

// SOS Page
const SOSPage = () => (
  <InfoPage
    title="SOS Support"
    subtitle="Find the appropriate support channel when you need assistance."
    icon={ShieldAlert}
  >
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[#193D57]">
        Need Assistance?
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
        For emergencies requiring immediate assistance, contact the
        appropriate local emergency services. TriageSync is a complaint
        management platform and does not replace emergency services.
      </p>

      <Link
        to="/contact"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-7 py-4 font-bold text-white hover:bg-[#0D978C]"
      >
        Contact Support
        <ArrowRight size={19} />
      </Link>
    </div>
  </InfoPage>
);

// FAQ Page
const FAQPage = () => {
  const questions = [
    {
      question: "What is TriageSync?",
      answer:
        "TriageSync is a digital platform for submitting and managing complaints.",
    },
    {
      question: "How can I submit a complaint?",
      answer:
        "Register an account, log in, and use the complaint submission page.",
    },
    {
      question: "How can I track my complaint?",
      answer:
        "Log in to your account and visit the My Tickets section.",
    },
    {
      question: "Can I cancel a complaint?",
      answer:
        "Available cancellation options depend on the complaint status and application rules.",
    },
  ];

  return (
    <InfoPage
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about TriageSync."
      icon={HelpCircle}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {questions.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-[#E2EBF0] p-6"
          >
            <h2 className="font-bold text-[#193D57]">
              {item.question}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </InfoPage>
  );
};

// Contact Page
const ContactPage = () => (
  <InfoPage
    title="Contact Us"
    subtitle="Have a question or need help? Get in touch with our support team."
    icon={MessageCircle}
  >
    <div className="mx-auto max-w-xl text-center">
      <h2 className="text-2xl font-bold text-[#193D57]">
        We Are Here to Help
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        For assistance with your account or complaints, please log in
        and use the available support options.
      </p>

      <Link
        to="/login"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-7 py-4 font-bold text-white hover:bg-[#0D978C]"
      >
        Login
        <ArrowRight size={19} />
      </Link>
    </div>
  </InfoPage>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Additional Public Pages */}
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/admindashboard" replace />}
        />

        <Route
          path="/admin/admindashboard"
          element={<AdminDashboard />}
        />

        <Route path="/admin/tickets" element={<ManageTickets />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/resources" element={<Resources />} />
        <Route path="/admin/analytics" element={<Analytics />} />

        {/* User Routes */}
        <Route
          path="/user"
          element={<Navigate to="/user/dashboard" replace />}
        />

        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />

        <Route
          path="/user/tickets"
          element={<MyTickets />}
        />

        <Route
          path="/user/tickets/:id"
          element={<TicketDetails />}
        />

        <Route
          path="/user/submit-complaint"
          element={<SubmitComplaint />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

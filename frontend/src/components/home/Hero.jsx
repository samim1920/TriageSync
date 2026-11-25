
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

      {/* Background Decoration */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Smart Complaint & Resource Management
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Manage Complaints
            <span className="block text-blue-600">
              Smarter & Faster
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            Simplify your support workflow with TriageSync.
            Submit complaints, automatically prioritize tickets,
            track progress, and manage resource bookings
            from one centralized platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Get Started →
            </button>

            <button
              onClick={() => navigate("/login")}
              className="rounded-lg border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-700 transition hover:-translate-y-1 hover:border-blue-500 hover:text-blue-600"
            >
              Login
            </button>
          </div>

          {/* Small Highlights */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-gray-600">
            <span>✓ Smart Ticket Triage</span>
            <span>✓ Real-time Status Tracking</span>
            <span>✓ Resource Booking</span>
          </div>
        </div>

        {/* Right Dashboard Preview */}
        <div className="relative">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl shadow-blue-900/10 sm:p-7">

            {/* Dashboard Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-sm text-gray-500">
                  Welcome to
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  TriageSync
                </h3>
              </div>

              <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                Dashboard
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">
                  Ticket Management
                </p>
                <h4 className="mt-2 text-lg font-bold text-blue-700">
                  Organized
                </h4>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">
                  Ticket Priority
                </p>
                <h4 className="mt-2 text-lg font-bold text-green-700">
                  Automated
                </h4>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">
                  Resource Booking
                </p>
                <h4 className="mt-2 text-lg font-bold text-purple-700">
                  Simplified
                </h4>
              </div>

              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-500">
                  User Access
                </p>
                <h4 className="mt-2 text-lg font-bold text-orange-700">
                  Role Based
                </h4>
              </div>
            </div>

            {/* Ticket Preview */}
            <div className="mt-6">
              <h4 className="mb-4 font-bold text-gray-800">
                Ticket Workflow
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Billing Issue
                    </p>
                    <p className="text-xs text-gray-500">
                      Automatic categorization
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    High
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Login Problem
                    </p>
                    <p className="text-xs text-gray-500">
                      Priority assignment
                    </p>
                  </div>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Medium
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-5 -right-3 rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-xl sm:-right-5">
            <p className="text-sm font-bold text-blue-600">
              Smart Triage System
            </p>
            <p className="text-xs text-gray-500">
              Simplify your workflow
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

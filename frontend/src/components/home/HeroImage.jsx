
const HeroImage = () => {
  return (
    <div className="relative mx-auto w-full max-w-xl">

      {/* Main Dashboard Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-7">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              TriageSync
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Support Overview
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
            Dashboard
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Total Tickets</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-700">
              <span className="text-lg">Ticket Management</span>
            </h2>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-500">Smart Triage</p>
            <h2 className="mt-2 text-lg font-bold text-green-700">
              Automated
            </h2>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm text-gray-500">Resources</p>
            <h2 className="mt-2 text-lg font-bold text-purple-700">
              Managed
            </h2>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-gray-500">Bookings</p>
            <h2 className="mt-2 text-lg font-bold text-orange-700">
              Organized
            </h2>
          </div>
        </div>

        {/* Ticket List */}
        <div className="mt-7">
          <h4 className="mb-4 font-bold text-gray-800">
            Recent Ticket Activity
          </h4>

          <div className="space-y-3">
            {[
              {
                name: "Billing Issue",
                status: "High Priority",
                color: "bg-red-100 text-red-600",
              },
              {
                name: "Login Problem",
                status: "Medium Priority",
                color: "bg-yellow-100 text-yellow-700",
              },
              {
                name: "Delivery Issue",
                status: "Pending",
                color: "bg-blue-100 text-blue-600",
              },
            ].map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <span className="text-sm font-semibold text-gray-700">
                  {ticket.name}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${ticket.color}`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
          <span className="text-xl">✓</span>
          <p className="text-sm font-medium text-blue-700">
            Your support workflow, simplified.
          </p>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute -bottom-5 -right-2 rounded-xl bg-white px-5 py-3 shadow-xl sm:-right-5">
        <p className="text-sm font-bold text-blue-600">
          Smart Triage
        </p>
        <p className="text-xs text-gray-500">
          Efficient Ticket Management
        </p>
      </div>

    </div>
  );
};

export default HeroImage;

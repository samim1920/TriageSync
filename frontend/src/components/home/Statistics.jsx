
const statistics = [
  {
    icon: "🎫",
    value: "Smart",
    label: "Ticket Management",
    description: "Centralized complaint tracking",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "⚡",
    value: "Automated",
    label: "Ticket Triage",
    description: "Automatic category and priority",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "🏢",
    value: "Organized",
    label: "Resource Management",
    description: "Rooms, labs and equipment",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "📅",
    value: "Simplified",
    label: "Resource Booking",
    description: "Manage booking requests",
    color: "bg-orange-50 text-orange-600",
  },
];

const Statistics = () => {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Platform Overview
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything in One Platform
          </h2>

          <p className="mt-3 text-gray-600">
            Simplify your support operations with powerful
            complaint and resource management features.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl text-3xl ${item.color}`}
              >
                {item.icon}
              </div>

              <h3 className="mt-5 text-2xl font-extrabold text-gray-900">
                {item.value}
              </h3>

              <p className="mt-2 font-semibold text-gray-800">
                {item.label}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Statistics;

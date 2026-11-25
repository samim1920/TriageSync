
const featuresData = [
  {
    icon: "🎫",
    title: "Smart Ticket Management",
    description:
      "Submit, organize, and track customer complaints from a single centralized platform.",
  },
  {
    icon: "🤖",
    title: "Automated Ticket Triage",
    description:
      "Automatically categorize tickets and assign priority levels based on complaint content.",
  },
  {
    icon: "📊",
    title: "Admin Analytics Dashboard",
    description:
      "Monitor ticket statistics, priorities, categories, and overall support performance.",
  },
  {
    icon: "👥",
    title: "Role-Based Access",
    description:
      "Separate access for users and administrators with secure role-based permissions.",
  },
  {
    icon: "🏢",
    title: "Resource Management",
    description:
      "Manage rooms, laboratories, and equipment from one centralized dashboard.",
  },
  {
    icon: "📅",
    title: "Smart Resource Booking",
    description:
      "View available time slots and submit booking requests with conflict prevention.",
  },
  {
    icon: "🔍",
    title: "Ticket Filtering & Search",
    description:
      "Find tickets easily using category, priority, status, and keyword filters.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description:
      "Protect accounts using JWT-based authentication and securely hashed passwords.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Our Features
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need to Manage Support Efficiently
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            TriageSync brings complaint management, automated
            prioritization, and resource booking together in one
            simple platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl transition-colors group-hover:bg-blue-100">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>

              <p className="text-sm leading-7 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-14 rounded-2xl bg-blue-600 px-6 py-10 text-center sm:px-12">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Simplify Your Support Workflow
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Manage tickets, track progress, and organize resources
            efficiently with TriageSync.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Features;

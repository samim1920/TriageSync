
const steps = [
  {
    number: "01",
    icon: "👤",
    title: "Create Your Account",
    description:
      "Register on TriageSync and securely log in to access the complaint management platform.",
  },
  {
    number: "02",
    icon: "🎫",
    title: "Submit a Ticket",
    description:
      "Describe your issue, provide the necessary details, and submit your complaint through the platform.",
  },
  {
    number: "03",
    icon: "🤖",
    title: "Automatic Ticket Triage",
    description:
      "The system automatically categorizes your ticket and assigns a priority based on the complaint content.",
  },
  {
    number: "04",
    icon: "✅",
    title: "Track Resolution",
    description:
      "Track your ticket status while the support team reviews and works toward resolving your issue.",
  },
];

const HowItWork = () => {
  return (
    <section
      id="how-it-works"
      className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            How TriageSync Works
          </h2>

          <p className="mt-4 text-gray-600">
            Manage complaints efficiently through a simple
            four-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Connecting Line - Desktop */}
          <div className="absolute left-[12%] right-[12%] top-10 hidden border-t-2 border-dashed border-blue-200 lg:block" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative z-10 text-center"
            >
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-3xl shadow-md transition duration-300 hover:-translate-y-2 hover:bg-blue-600">
                <span className="transition group-hover:scale-110">
                  {step.icon}
                </span>
              </div>

              {/* Step Number */}
              <span className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-bold text-blue-700">
                STEP {step.number}
              </span>

              {/* Content */}
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg font-semibold text-gray-800">
            Ready to simplify your complaint management?
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Get started with TriageSync today.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWork;

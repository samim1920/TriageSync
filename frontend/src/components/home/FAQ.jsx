
import { useState } from "react";

const faqData = [
  {
    question: "What is TriageSync?",
    answer:
      "TriageSync is a smart complaint and ticket management platform that helps support teams organize, prioritize, track, and resolve customer complaints efficiently.",
  },
  {
    question: "How can I submit a complaint?",
    answer:
      "First, create an account and log in. Then navigate to the Submit Complaint section, enter your complaint details, and submit your ticket.",
  },
  {
    question: "How are tickets categorized and prioritized?",
    answer:
      "TriageSync automatically categorizes tickets into Billing, Login, Delivery, Bug, and Feature Request. It also assigns priority levels based on the complaint content.",
  },
  {
    question: "Can I track my complaint status?",
    answer:
      "Yes. You can visit your dashboard to view your submitted tickets and track their current status.",
  },
  {
    question: "What is the difference between User and Admin?",
    answer:
      "Users can submit complaints and manage their bookings. Admins can review tickets, manage resources, approve or reject bookings, and monitor analytics.",
  },
  {
    question: "How can I book a resource?",
    answer:
      "Log in to your account, browse available resources, select an available time slot, and submit your booking request.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes. You can cancel your own eligible upcoming bookings from the My Bookings section.",
  },
  {
    question: "Is my account information secure?",
    answer:
      "TriageSync uses password hashing and JWT-based authentication to help protect user accounts and secure access to the platform.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Section Heading */}
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            FAQ
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Find answers to common questions about TriageSync and how
            our platform works.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="font-semibold text-gray-800">
                    {faq.question}
                  </span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                {isActive && (
                  <div
                    id={`faq-answer-${index}`}
                    className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-600 sm:px-6"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?
          </p>

          <p className="mt-2 font-semibold text-blue-600">
            Contact our support team.
          </p>
        </div>

      </div>
    </section>
  );
};

export default FAQ;

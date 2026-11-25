
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Clock,
  Users,
  CheckCircle,
  LockKeyhole,
  ClipboardCheck,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Statistics from "../components/home/Statistics";
import Features from "../components/home/Features";

import citizenImage from "../assets/images/citizen.jpg";
import authoritiesImage from "../assets/images/authorites.jpg";

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F1F7FA] text-[#193D57]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="px-4 py-12 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#10ADA0]/10 px-4 py-2 text-sm font-semibold text-[#10ADA0]">
                <ShieldCheck size={18} />
                Smart Complaint Management System
              </div>

              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Speak Up.
                <span className="block text-[#10ADA0]">We Listen.</span>
                Get Faster Solutions.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                TriageSync makes complaint management simple, transparent,
                and efficient. Submit complaints, track their progress,
                and get solutions through one secure platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-[#0d958a]"
                >
                  Register Your Complain <ArrowRight size={19} />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#193D57] px-6 py-3.5 font-semibold text-[#193D57] transition hover:bg-[#193D57] hover:text-white"
                >
                  How It Works
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-[#10ADA0]" />
                  Easy Complaint Submission
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-[#10ADA0]" />
                  Transparent Tracking
                </span>
              </div>
            </div>

            {/* Hero Images */}
            <div className="relative grid grid-cols-2 items-center gap-4">
              <div className="overflow-hidden rounded-[70px] rounded-br-3xl shadow-xl">
                <img
                  src={citizenImage}
                  alt="Citizen using complaint services"
                  className="h-72 w-full object-cover sm:h-96"
                />
                <div className="bg-[#193D57] px-3 py-4 text-center text-white">
                  <h3 className="font-bold">Citizens</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Raise complaints easily
                  </p>
                </div>
              </div>

              <div className="mt-16 overflow-hidden rounded-[70px] rounded-bl-3xl shadow-xl">
                <img
                  src={authoritiesImage}
                  alt="Government administration"
                  className="h-72 w-full object-cover sm:h-96"
                />
                <div className="bg-[#193D57] px-3 py-4 text-center text-white">
                  <h3 className="font-bold">Authorities</h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Manage complaints efficiently
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10ADA0]/10 text-[#10ADA0]">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold">Secure Platform</p>
                  <p className="text-xs text-slate-500">
                    Reliable complaint management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-white px-4 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <Statistics />
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <span className="font-semibold text-[#10ADA0]">
                OUR FEATURES
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Everything You Need in One Place
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                A smarter way to submit, manage, and resolve complaints.
              </p>
            </div>
            <Features />
          </div>
        </section>

        {/* Why Choose TriageSync */}
        <section className="bg-white px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="font-semibold text-[#10ADA0]">
                WHY TRIAGESYNC?
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Making Complaint Management Better
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: MessageSquare,
                  title: "Easy Submission",
                  description:
                    "Submit complaints quickly through a simple interface.",
                },
                {
                  icon: Clock,
                  title: "Real-time Tracking",
                  description:
                    "Follow complaint status and stay informed about progress.",
                },
                {
                  icon: Users,
                  title: "Better Coordination",
                  description:
                    "Help citizens and authorities work together efficiently.",
                },
                {
                  icon: LockKeyhole,
                  title: "Secure Platform",
                  description:
                    "Keep complaint information protected with secure access.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl bg-[#F1F7FA] p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10ADA0]/10 text-[#10ADA0]">
                      <Icon size={25} />
                    </div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="font-semibold text-[#10ADA0]">
                SIMPLE PROCESS
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                How TriageSync Works
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: MessageSquare,
                  title: "01. Submit Complaint",
                  description:
                    "Register and submit your complaint with the required details.",
                },
                {
                  icon: ClipboardCheck,
                  title: "02. Review & Process",
                  description:
                    "Authorities review, categorize, and process your complaint.",
                },
                {
                  icon: CheckCircle,
                  title: "03. Get Resolution",
                  description:
                    "Track updates and get notified when your complaint is resolved.",
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#193D57] text-white">
                      <Icon size={28} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 font-semibold text-[#10ADA0] hover:underline"
              >
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#193D57] px-4 py-16 text-center text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <ShieldCheck className="mx-auto text-[#10ADA0]" size={48} />
            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Your Voice Matters. Start Today!
            </h2>
            <p className="mt-5 leading-7 text-blue-100">
              Join TriageSync and experience a simpler, faster, and more
              transparent complaint management process.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#10ADA0] px-7 py-3.5 font-bold text-white transition hover:bg-[#0d958a]"
            >
              Create Your Account <ArrowRight size={19} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;

'use client';

import Link from "next/link";
import Quiz from "../../interview/_component/quiz";

const HeroSection = () => {

    return (
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/40 p-8 md:p-12">

            <div className="relative z-10">

                {/* Hero Content */}
                <div className="w-full">
                    <div className="mb-4 inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium">
                        AI-Powered Interview Practice
                    </div>

                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
                        Crack Your Next
                        <span className="gradient-title block">
                            Dream Interview
                        </span>
                    </h1>

                    <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                        Practice real interview scenarios with AI-generated questions,
                        voice interaction, resume-based interviews, and detailed feedback
                        reports.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/mock-interview/mock"
                            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                        >
                            Start Interview
                        </Link>

                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer rounded-xl border px-6 py-3 text-sm font-semibold"
                        >
                            Upload Resume
                        </label>

                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Feature Cards */}

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


                    <Link
                        href="/mock-interview/voice"
                        className="block rounded-2xl border p-5 transition hover:bg-muted/50"
                    >
                        <p className="text-3xl font-bold">🎤</p>
                        <p className="text-sm text-muted-foreground">
                            Voice Conversation Interview
                        </p>
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
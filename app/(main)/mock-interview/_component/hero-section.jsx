import React from "react";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background to-muted/40 p-8 md:p-12">
            {/* Background Blur Effects */}
            <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                {/* Left Content */}
                <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium backdrop-blur">
                        AI-Powered Interview Practice
                    </div>

                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
                        Crack Your Next
                        <span className="gradient-title block">
                            Dream Interview
                        </span>
                    </h1>

                    <p className="mb-6 text-muted-foreground text-lg leading-relaxed">
                        Practice real interview scenarios with AI-generated questions,
                        voice interaction, resume-based interviews, and detailed feedback
                        reports.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/mock-interview/start"
                            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105"
                        >
                            Start Interview
                        </Link>

                        <Link
                            href="/resume"
                            className="rounded-xl border px-6 py-3 text-sm font-semibold transition hover:bg-muted"
                        >
                            Upload Resume
                        </Link>
                    </div>
                </div>

                {/* Right Side Cards */}
                <div className="grid w-full max-w-md grid-cols-2 gap-4">
                    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur">
                        <p className="text-3xl font-bold">50+</p>
                        <p className="text-sm text-muted-foreground">
                            AI Interview Questions
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur">
                        <p className="text-3xl font-bold">95%</p>
                        <p className="text-sm text-muted-foreground">
                            ATS + Interview Ready
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur">
                        <p className="text-3xl font-bold">Voice</p>
                        <p className="text-sm text-muted-foreground">
                            AI Conversation Mode
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur">
                        <p className="text-3xl font-bold">24/7</p>
                        <p className="text-sm text-muted-foreground">
                            Practice Anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
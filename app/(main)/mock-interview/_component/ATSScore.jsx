"use client";

import { analyzeResumeATS } from "@/actions/ats";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ATSScore = () => {

    const [file, setFile] = useState(null);

    const {
        loading,
        data,
        fn: analyzeFn,
    } = useFetch(analyzeResumeATS);

    return (
        <div className="space-y-6">

            {!data && (
                <div className="rounded-xl border p-6">
                    <h2 className="text-2xl font-bold mb-2">
                        ATS Resume Checker
                    </h2>

                    <p className="text-muted-foreground mb-4">
                        Analyze your saved resume and get ATS feedback.
                    </p>

                    <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files?.[0])}
                    />

                    <Button
                        onClick={() => {
                            const formData = new FormData();
                            formData.append("resume", file);
                            analyzeFn(formData);
                        }}
                        disabled={loading || !file}
                    >
                        {loading ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                </div>
            )}

            {data && (
                <div className="rounded-xl border p-6 space-y-5">

                    <div>
                        <h3 className="text-lg font-semibold">
                            ATS Score
                        </h3>

                        <p className="text-5xl font-bold">
                            {data.score}/100
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">
                            Strengths
                        </h3>

                        <ul className="list-disc pl-5">
                            {data.strengths.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">
                            Weaknesses
                        </h3>

                        <ul className="list-disc pl-5">
                            {data.weaknesses.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">
                            Improvements
                        </h3>

                        <ul className="list-disc pl-5">
                            {data.improvements.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">
                            Summary
                        </h3>

                        <p>{data.summary}</p>
                    </div>

                </div>
            )}

        </div>
    );
};

export default ATSScore;
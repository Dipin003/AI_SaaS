import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetterById } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";



export default async function EditCoverLetterPage({ params }) {
  const { id } = params;

  const coverLetter = await getCoverLetterById(id);

  if (!coverLetter) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold">Cover Letter Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-6">
        {coverLetter.jobTitle} at {coverLetter.companyName}
      </h1>

      <CoverLetterPreview content={coverLetter.content} />
    </div>
  );
}
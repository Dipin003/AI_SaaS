import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import CoverLetterList from "./_components/cover-letter-list"
import { getCoverLetters } from "@/actions/cover-letter"


const AiCoverLetterPage = async () => {

  const coverLetters = await getCoverLetters()

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5 px-5">

        <h1 className="font-bold gradient-title text-4xl  md:text-6xl">
          My Cover Letters
        </h1>

        <Link href="/ai-cover-letter/new">
          <Button className="text-base mid:text-lg px-4 mid:px-5 py-2 mid:py-3">
            <Plus className="size-5 mid:size-6" />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  )
}

export default AiCoverLetterPage
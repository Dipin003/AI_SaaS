import { industries } from "@/data/industries"
import OnboardingForm from "./_components/onboarding-from"
import { getUserOnboardingStatus } from "@/actions/user"
import { redirect } from "next/navigation"

const Onboarding = async () => {

  const { isOnboarded } = await getUserOnboardingStatus()

  if (isOnboarded) {
    redirect("/dashboard")
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  )
}

export default Onboarding
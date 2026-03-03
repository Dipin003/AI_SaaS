import { industries } from "@/data/industries"
import OnboardingForm from "./_components/onboarding-from"

const Onboarding = () => {
  // Check if user is already onboarded

  return (
    <main>
      <OnboardingForm industries={industries}/>
    </main>
  )
}

export default Onboarding
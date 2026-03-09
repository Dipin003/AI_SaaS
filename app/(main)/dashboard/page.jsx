import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from "next/navigation";

const DashBoard = async () => {
  const {isOnboarded} = await getUserOnboardingStatus()
  
    if(!isOnboarded) {
      redirect("/onboarding")
    }
  
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard
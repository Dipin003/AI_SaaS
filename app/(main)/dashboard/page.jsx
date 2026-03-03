import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/dist/server/api-utils'

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
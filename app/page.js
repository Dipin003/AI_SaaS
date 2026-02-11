import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='min-h-screen'>
      <h1 className='text-4xl font-bold text-yellow-300'>Welcome to My Next.js App</h1>
      <br />
      <Button className={`bg-black text-white mx-3`}>Hello </Button>
      

    </div>
  )
}
export default page
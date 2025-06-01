import React from 'react'
import './css/App.css'
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button className='cursor-pointer'>Click me</Button>
    </div>
  )
}

export default App
import React from 'react'
import Nav from '@/components/LandingNav'

function Home() {
  return (
    <>
      {/* <Nav /> */}
      <div className='text-white relative font-bold text-5xl mt-24'> {/* Add mt-20 or appropriate value */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl opacity-80 hover:opacity-100 transition-opacity bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/30 dark:hover:border-blue-600/50" />
            <div className="aspect-video rounded-xl bg-muted/50 opacity-65 hover:opacity-100 transition-opacity bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700/30 dark:hover:border-purple-600/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </div>
    </>
  )
}

export default Home

import LayoutDashboard from '@/layouts/LayoutDashboard'
import Navigation from '@/components/Navigation/Navigation'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CheckAuth from '../utils/checkAuth'

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const checkAuth = CheckAuth()
    
    useEffect(()=>{
    if(checkAuth){
        setIsLoading(false)
    }else{
        setIsLoading(true)
    }
    },[checkAuth])

    return(
        <div className='bg-white'>
            <Head>
                <title>Customer Gift Redemption - PT. AEON Indonesia</title>
            </Head>
            {
                !isLoading && <Navigation content={<LayoutDashboard/>}/>
                // !isLoading && <Navigation content={''}/>
            }
        </div>
    )
}

export default DashboardPage
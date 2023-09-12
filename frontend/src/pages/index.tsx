import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import tokenValidation from '../utils/tokenValidation';

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('workflowToken')
    const isValidToken = tokenValidation(storedToken);
    
    try {
      if (isValidToken) {
        router.push('/dashboard')
      }else{
        localStorage.removeItem('workflowDataDetail');
        localStorage.removeItem('workflowToken');
        localStorage.removeItem('_XPlow');
        localStorage.removeItem('ally-supports-cache');
        router.push('/login')
      }
    } catch (error) {
      console.log('error');
    }
  }, [router]);
}

export default Index;

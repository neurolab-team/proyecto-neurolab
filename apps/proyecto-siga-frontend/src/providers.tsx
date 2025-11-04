'use client';
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export const Providers = ({children}:{children:React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());

  return (
    <div>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </div>
  )
}
export default Providers;
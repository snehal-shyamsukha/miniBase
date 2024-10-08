"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from "react";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
    </div>
  );
};

export default ClientLayout;

import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ViewTrackingProvider } from "@/components/view-tracking/ViewTrackingProvider";
import { AuthProvider } from "./context/AuthContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { router } from "@/routes/router";
import theme from "@/themes/theme"; // dacă ai un fișier pentru temă Chakra

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ViewTrackingProvider
            enabled={true}
            debugMode={import.meta.env.DEV}
            batchSize={5}
            batchDelay={3000}
          >
            <RouterProvider router={router} />
            {import.meta.env.DEV && <ReactQueryDevtools />}
          </ViewTrackingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);

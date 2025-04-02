import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();
// {
//   defaultOptions:{
//     queries:{
//       retry:3,
//       staleTime:10*1000,
//       refetchOnWindowFocus:false,
//       refetchOnMount:true,
//       refetchOnReconnect:false,
//     }
//   }
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

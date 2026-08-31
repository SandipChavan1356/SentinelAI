import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "./components/layout/AppShell";
import { ToastProvider } from "./components/ui/Toast";
import OverviewPage from "./pages/OverviewPage";
import ServicesPage from "./pages/ServicesPage";
import LogsPage from "./pages/LogsPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailPage from "./pages/IncidentDetailPage";
import KnowledgePage from "./pages/KnowledgePage";
import RecallPage from "./pages/RecallPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/recall" element={<RecallPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

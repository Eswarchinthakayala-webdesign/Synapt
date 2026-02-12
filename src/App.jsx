import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./layout/app-layout";
import { ThemeProvider } from "./components/theme-provider";
import { LiveStream } from "./pages/LiveStream";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="synapt-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/live" element={<LiveStream />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
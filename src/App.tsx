import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NotFound from "@/routes/not-found";
import Home from "./routes/Home";
import MovieDetails from "./routes/MovieDetails";
import MyLists from "./routes/MyLists";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "./hooks/useTheme";
import { LoginPage } from "./routes/Login";
import { AuthSuccess } from "./routes/AuthSuccess";
import { AuthError } from "./routes/AuthError";

// docker run -p 4173:4173 -e VITE_TMDB_API_KEY=your_api_key movie-market-frontend
// # in your frontend repo folder:
// docker build -t venugopal143/movie-market-frontend:latest .
// docker push venugopal143/movie-market-frontend:latest

const App = () => (
  <TooltipProvider>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">

      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Nav />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route path="/" element={<Home />} />
          <Route path="/:tab" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/my-lists/:tab" element={<MyLists />} />
          <Route path="/my-lists" element={<MyLists />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>

  </TooltipProvider>
);

export default App;
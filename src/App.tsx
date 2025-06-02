import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NotFound from "@/routes/not-found";
import Home from "./routes/Home";
import MovieDetails from "./routes/MovieDetails";
import MyLists from "./routes/MyLists";
import { Nav } from "@/components/Nav";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/my-lists/:tab" element={<MyLists />} />
        <Route path="/my-lists" element={<MyLists />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  </TooltipProvider>
);

export default App;
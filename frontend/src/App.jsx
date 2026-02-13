import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Travel from './pages/Travel';
import TravelDetail from './pages/TravelDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Achievements from './pages/Achievements';
import Terminal from './pages/Terminal';
import Contact from './pages/Contact';

/**
 * App: defines all routes. Layout wraps every page (Navbar + Outlet).
 * Child routes render inside Layout's <Outlet />.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="travel/:slug" element={<TravelDetail />} />
        <Route path="travel" element={<Travel />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="experience" element={<Experience />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="terminal" element={<Terminal />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

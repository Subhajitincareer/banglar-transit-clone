import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';
import BusExplorer from './pages/BusExplorer';
import Trams from './pages/Trams';
import RouteDetails from './pages/RouteDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="routes.html" element={<RoutesPage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="bus-explorer.html" element={<BusExplorer />} />
        <Route path="bus-explorer" element={<BusExplorer />} />
        <Route path="trams.html" element={<Trams />} />
        <Route path="trams" element={<Trams />} />
        <Route path="route-details.html" element={<RouteDetails />} />
        <Route path="route-details" element={<RouteDetails />} />
      </Route>
    </Routes>
  );
}

export default App;

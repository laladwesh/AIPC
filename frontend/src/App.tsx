import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';

const App = () => (
    <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
    </Routes>
);

export default App;

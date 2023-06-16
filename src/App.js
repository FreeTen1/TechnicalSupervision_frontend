import { Route, Routes } from "react-router-dom"
import "./App.css"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import Settings from "./pages/Settings"

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path='settings' element={<Settings />} />
                <Route path='*' element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default App

import Notes from './pages/Notes'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Manipulation from './pages/Manipulation'
import Chess from './pages/Chess'
import MartialArts from './pages/MartialArts'
import Exercises from './pages/Exercises'
import Profile from './pages/Profile'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manipulation" element={<Manipulation />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/martial-arts" element={<MartialArts />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}

export default App

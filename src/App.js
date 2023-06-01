import { Route, Routes } from "react-router-dom"
import LandingPage from './Landing_Page'
import Festival from './Festival'
import Game from './Game'
import Leaderboard from "./Leaderboard";

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<Game/>}/>
    //   <Route path="/leaderboard/:level" element={<Leaderboard/>}/>
    // </Routes>
    <Game/>
    

  );
}

export default App;

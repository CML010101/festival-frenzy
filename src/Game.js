import { useEffect, useState } from "react";
import LandingPage from "./Landing_Page";
import Festival from "./Festival";
import festivalData from "./FestivalData.json"
import Leaderboard from "./Leaderboard";

function Game(){
    const [teams, setTeams] = useState({});
    const[level, setLevel] = useState(0);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const teamsEmpty = Object.keys(teams).length === 0;

    console.log(level);

    function initialiseGame(numberOfTeams, openingBalance){
        let teams = {};
        for (let i = 1; i <= numberOfTeams; i++) {
            teams[`${i}`] = openingBalance;
          }
          setTeams(teams);
    }

    {return(teamsEmpty ? <LandingPage onSubmit={initialiseGame}/> : 
    showLeaderboard? <Leaderboard teams={teams} setShowLeaderboard={setShowLeaderboard}/> : <Festival festivalData={festivalData[level]} teams={teams} setTeams={setTeams} setShowLeaderboard={setShowLeaderboard} setLevel={setLevel}/>)}
}

// function Game(){
//     return(
//         <Leaderboard/>
//     )
// }

export default Game;
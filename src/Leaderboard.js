import Medal from "./medal.png"
import GoldMedal from "./gold_medal.jpeg"
import SilverMedal from "./silver_medal.jpeg"
import BronzeMedal from "./bronze_medal.jpeg"
import NextArrow from "./next_arrow.png"
import { useParams } from "react-router-dom"

function Leaderboard({ teams, setShowLeaderboard }){

    const level = useParams();
    console.log(level);

    teams = Object.entries(teams).sort((v1, v2)=>(v2[1]-v1[1]));
    console.log(teams)

    return(
        <div className="center-screen">
            <div className="center-screen leaderboard">
                    <div className="leaderboard_heading" style={{display:"flex", alignItems:"center", marginBottom:"60px"}}>
                        <img src={Medal}/>
                        <h1>LEADERBOARD</h1>
                        <img src={Medal}/>
                        <div className="next_arrow_container" style={{position:"absolute", right:20, top:20}}>
                            <input type="image" src={NextArrow} onClick={()=>setShowLeaderboard(false)}/>
                        </div>
                    </div>
                    <ul style={{width:"100%"}}>
                        {teams.map(([teamID, balance], index)=>(<LeaderboardRow teamID={teamID} balance={balance} i={index} key={index}/>))}
                    </ul>
            </div>
        </div>
    )
}

function LeaderboardRow( { teamID, balance, i }){


    const colour = i < 3 ? ["gold", "rgb(166, 166, 166)", "rgb(210, 132, 70)"][i] : null;
    const image = i < 3 ? [GoldMedal, SilverMedal, BronzeMedal][i] : null;
    const weight = i < 3 ? "bold" : "normal";
    const size = i < 3 ? ["60px", "50px", "40px"][i] : "30px";
    const marginBottom = i == 2 ? "100px" : "0px";

    return(
        <>
        <li key={i}>
            <div style={{display:"flex", justifyContent:"space-around", alignContent:"center", marginBottom:"60px", color:colour}}>
                <h2 style={{fontWeight:weight, fontSize:size}}>Team {teamID}</h2>
                <h2 style={{fontWeight:weight, fontSize:size}}>£{balance}</h2>
                {colour != null ? <img src={image} style={{width:size}}/>: null}
            </div>
        </li>
        {i == 2 ? <hr style={{marginBottom:"60px"}}></hr>:null}
        </>
    )
}

export default Leaderboard;
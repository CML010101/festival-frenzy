import { Link, useNavigate } from "react-router-dom";
import BackgroundImage from "./crowd_background.jpeg"
import { useState } from "react";

function LandingPage({ onSubmit }){
    const [numberOfTeams, setNumberOfTeams] = useState(5);
    const [openingBalance, setOpeningBalance] = useState(20);
    const navigate = useNavigate();

    return(
        <div id="landing_page_container" className="center-screen" style={{backgroundImage:`url(${BackgroundImage})`}}>
            <div id="landing_page">
                <h1 id="title">FESTIVAL <br/> FRENZY</h1>
                <div id="inputs">
                    <Input text="Number of teams" defaultValue="5" onChange={(e)=>setNumberOfTeams(e.target.value)}/>
                    <Input text="Opening Balance" defaultValue="20" onChange={(e)=>setOpeningBalance(e.target.value)}/>
                </div>
                <button id="start_button" type="button" onClick={()=>{onSubmit(numberOfTeams, openingBalance)}}>
                    Start Game!
                </button>
            </div>
        </div>
    );
}

function Input(props){
    return(
        <div className="input_container">
            <h3>{props.text}</h3>
            <input className="input_field" type="number" defaultValue={props.defaultValue} min="0" onChange={props.onChange} />
        </div>
    )
}

function sayHello(){
    console.log("Hello!");
}


export default LandingPage
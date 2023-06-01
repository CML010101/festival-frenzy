import { useEffect, useState } from "react";
import Rain from "./rain.jpeg";
import Sun from "./sun.jpeg";
import Die1 from "./die/die1.png";
import Die2 from "./die/die2.png";
import Die3 from "./die/die3.png";
import Die4 from "./die/die4.png";
import Die5 from "./die/die5.png";
import Die6 from "./die/die6.png";
import DieIcon from "./die_icon.png";
import NextArrow from "./next_arrow.png";
import Stats from "./stats.png";
import XIcon from "./x_icon.png";
import Wellies from "./wellies.png";
import PriceTag from "./price_tag.png";
import Sunglasses from "./sunglasses.png";
import Leaderboard from "./leaderboard.png";
import Medal from "./medal.png";
import Cloudy from "./cloudy.jpeg";
import Sunny from "./sunny.png";

import { badgeClasses, tableBodyClasses } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Festival({
  festivalData,
  teams,
  setTeams,
  setShowLeaderboard,
  setLevel,
}) {
  const [validInput, setValidInput] = useState(false);
  const [dieRolling, setDieRolling] = useState(false);
  const [dieRolled, setDieRolled] = useState(false);
  const [purchases, setPurchases] = useState({});
  const [weather, setWeather] = useState(0);

  const [statsModal, setStatsModal] = useState(false);
  const [leaderboardModal, setLeaderboardModal] = useState(false);

  function onDieRolled(roll) {
    setDieRolling(false);
    setDieRolled(true);
    console.log("roll: ", roll);
    console.log(festivalData.weather[roll] == 0 ? "BAD" : "GOOD");
    setWeather(festivalData.weather[roll] == 0 ? -1 : 1);
    updateBalances(purchases);
  }

  function updateBalances(purchases) {
    console.log("here1", teams);
    let tempTeams = teams;
    for (let team in teams) {
      let sellWelliesPrice, sellSunglassesPrice;
      const teamPurchases = purchases[team];
      const currentBalance = teams[team];
      if (weather == 1) {
        sellWelliesPrice = festivalData.prices.sellWelliesGW;
        sellSunglassesPrice = festivalData.prices.sellSunglassesGW;
      } else {
        sellWelliesPrice = festivalData.prices.sellWelliesBW;
        sellSunglassesPrice = festivalData.prices.sellSunglassesBW;
      }
      let newBalance =
        currentBalance -
        (teamPurchases[0] * festivalData.prices.welliesCost +
          teamPurchases[1] * festivalData.prices.sunglassesCost);
      console.log("here2", newBalance);
      newBalance =
        newBalance +
        (teamPurchases[0] * sellWelliesPrice +
          teamPurchases[1] * sellSunglassesPrice);
      tempTeams[team] = newBalance;
    }
    setTeams(tempTeams);
  }

  return (
    <>
      <Banner
        festivalData={festivalData}
        dieRolled={dieRolled}
        weather={weather}
        setShowLeaderboard={setShowLeaderboard}
        setLevel={setLevel}
      />
      <div className="festival_body">
        <TeamsTable
          prices={festivalData.prices}
          teams={teams}
          setTeams={setTeams}
          setValidInput={(valid) => setValidInput(valid)}
          setPurchases={setPurchases}
        />
        <ItemPrices prices={festivalData.prices} />
        <div className="icon_buttons">
          {validInput && !dieRolled ? (
            <input
              type="image"
              src={DieIcon}
              className="icon_button"
              onClick={() => setDieRolling(true)}
            />
          ) : null}
          <input
            type="image"
            src={Stats}
            className="icon_button"
            onClick={() => setStatsModal(true)}
          />
          <input
            type="image"
            src={Leaderboard}
            className="icon_button2"
            onClick={() => setLeaderboardModal(true)}
          />
        </div>
      </div>
      {dieRolling ? <DiceModal onFinish={(roll) => onDieRolled(roll)} /> : null}
      {statsModal ? <StatsModal onClose={() => setStatsModal(false)} /> : null}
      {leaderboardModal ? (
        <LeaderboardModal onClose={() => setLeaderboardModal(false)} />
      ) : null}
      {/* {validInput?(<h1>ALL VALID</h1>):null} */}
    </>
  );
}

function Banner({
  festivalData,
  dieRolled,
  weather,
  setShowLeaderboard,
  setLevel,
}) {
  let bannerImage;
  switch (weather) {
    case 0:
      bannerImage = require(`${festivalData.image}`);
      break;
    case -1:
      bannerImage = Cloudy;
      break;
    case 1:
      bannerImage = Sunny;
      break;
  }

  return (
    // <div className="banner" style={{backgroundImage:`url(${IsleOfWightBanner})`}}>
    <div className="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div
        style={{
          position: "absolute",
          top: "0",
          paddingTop: "10px",
          paddingLeft: "10px",
          color: "white",
        }}
      >
        <h1>
          {weather == 0 ? "" : weather == -1 ? "BAD WEATHER" : "GOOD WEATHER"}
        </h1>
      </div>
      <div className="banner_heading">
        <h1 className="festival_number">{festivalData.level}</h1>
        <h1 className="festival_title">{festivalData.name}</h1>
      </div>
      <div style={{ display: "flex" }} className="forecast_and_arrow">
        <Forecast weather={festivalData.weather} />
        <div className="next_arrow_container">
          {dieRolled ? (
            <input
              type="image"
              src={NextArrow}
              onClick={() => {
                setLevel(function (prevLevel){
                    console.log(prevLevel + 1);
                    return (prevLevel+1);
                });
                setShowLeaderboard(true);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TeamsTable({ prices, teams, setTeams, setValidInput, setPurchases }) {
  const [tempBalances, setTempBalances] = useState(teams);
  // const [purchases, setPurchases] = useState(Object.keys(teams).reduce((acc,key)=>{acc[key]=[0,0];return acc;},{}));
  // const [purchases, setPurchases] = useState({})
  const [validRows, setValidRows] = useState(
    Object.keys(teams).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {})
  );
  const [remainingQty, setRemainingQty] = useState(
    Object.keys(teams).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {})
  );

  function updatePurchases(teamID, qty, product) {
    if (qty == "") qty = undefined;
    setPurchases((previousPurchases) => {
      let previousOtherQty = undefined;
      let newTeamQuantity;
      if (product == "wellies") {
        if (teamID in previousPurchases)
          previousOtherQty = previousPurchases[teamID][1];
        newTeamQuantity = [qty, previousOtherQty];
      } else if (product == "sunglasses") {
        if (teamID in previousPurchases)
          previousOtherQty = previousPurchases[teamID][0];
        newTeamQuantity = [previousOtherQty, qty];
      }

      setTempBalances((_) => {
        let newTempBalance;
        const trueBalance = teams[teamID];
        const [welliesQty = 0, sunglassesQty = 0] = newTeamQuantity;

        newTempBalance =
          trueBalance -
          welliesQty * prices.welliesCost -
          sunglassesQty * prices.sunglassesCost;

        validateRow(teamID, newTeamQuantity, newTempBalance);

        calculateRemainingQty(teamID, newTeamQuantity, newTempBalance);

        return { ...tempBalances, [teamID]: newTempBalance };
      });
      return { ...previousPurchases, [teamID]: newTeamQuantity };
    });
  }

  function validateRow(teamID, purchases, balance) {
    let result;
    purchases = purchases || [undefined, undefined];

    if (
      purchases[0] < 0 ||
      purchases[1] < 0 ||
      (purchases[0] || 0) % 1 != 0 ||
      (purchases[1] || 0) % 1 != 0 ||
      balance < 0
    ) {
      result = -1;
    } else if (purchases[0] === undefined || purchases[1] === undefined) {
      result = 0;
    } else {
      result = 1;
    }

    
    setValidRows((previousValidRows) => {
        const newValidRows = { ...previousValidRows, [teamID]: result };
        if (Object.values(newValidRows).every((value) => value === 1))
        setValidInput(true);
        else setValidInput(false);
      console.log(newValidRows);
      return newValidRows;
    });
  }

  function calculateRemainingQty(teamID, purchases, balance) {
    let remainingQty;
    purchases = purchases || [undefined, undefined];

    if (purchases[0] === undefined && purchases[1] === undefined) {
      remainingQty = "";
    } else {
      if (purchases[0] === undefined) {
        remainingQty = Math.floor(balance / prices.welliesCost);
      } else {
        remainingQty = Math.floor(balance / prices.sunglassesCost);
      }
      if (remainingQty < 0) {
        remainingQty = 0;
      }
    }
    setRemainingQty((previousRemainingQty) => ({
      ...previousRemainingQty,
      [teamID]: remainingQty,
    }));
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Balance</th>
          <th>
            Qty Wellies
            <br />£{prices.welliesCost} per pair
          </th>
          <th>
            Qty Sunglasses
            <br />£{prices.sunglassesCost} per pair
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(teams).map((teamID) => (
          <TeamRow
            key={teamID}
            teamID={teamID}
            updatePurchases={updatePurchases}
            balance={tempBalances[teamID]}
            validRow={validRows[teamID]}
            remainingQty={remainingQty[teamID]}
          />
        ))}
      </tbody>
    </table>
  );
}

function TeamRow({ teamID, updatePurchases, balance, validRow, remainingQty }) {
  const [focus, setFocus] = useState(false);

  const backgroundColor = focus
    ? "rgb(230,239,250)"
    : validRow == 1
    ? "rgb(221,228,213)"
    : validRow == -1
    ? "rgb(238,167,157)"
    : "white";

  return (
    // <tr className="team_row" style={{backgroundColor:balance<0?"rgb(238,167,157)":focus?"rgb(230,239,250)":"white"}}>
    <tr className="team_row" style={{ backgroundColor: backgroundColor }}>
      <td>{teamID}</td>
      <td style={{ fontWeight: "bold" }}>£{`${balance}`}</td>
      <td>
        <input
          type="number"
          min="0"
          step="1"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ backgroundColor: backgroundColor }}
          onChange={(e) => updatePurchases(teamID, e.target.value, "wellies")}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="1"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ backgroundColor: backgroundColor }}
          onChange={(e) =>
            updatePurchases(teamID, e.target.value, "sunglasses")
          }
        />
      </td>
      <td className="remaining_qty">{remainingQty}</td>
    </tr>
  );
}

function Forecast({ weather }) {
  const forecast_tiles = [];
  for (let i = 0; i < 11; i++) {
    forecast_tiles.push(
      <ForecastTile number={i + 2} weather={weather[i]} key={`${i}`} />
    );
  }

  return <div className="forecast">{forecast_tiles}</div>;
}

function ForecastTile({ number, weather }) {
  return (
    <div className="forecast_tile">
      <h3>{number}</h3>
      <div className="weather_img">
        <img src={weather ? Sun : Rain} />
      </div>
    </div>
  );
}

function DiceModal({ onFinish }) {
  const [die1, setDie1] = useState(6);
  const [die2, setDie2] = useState(6);
  const [dies, setDies] = useState([6, 6, 0]);
  // const [numRolls, setNumRolls] = useState(0);

  useEffect(() => {
    roll_die();
  }, [dies]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let numRolls = 0;
  const intervals = [
    208.0, 232.00000000000003, 272.0, 328.0, 400.0, 488.00000000000006,
    592.0000000000001, 712.0000000000001, 848.0, 1000.0, 1168.0000000000002,
    1352.0000000000002, 1552.0000000000002, 1768.0000000000002, 2000.0,
  ];
  // async function roll_die(){
  //     let die1Value;
  //     let die2Value;
  //     for(let i = 0; i < 30; i++){
  //         die1Value = Math.floor(Math.random() * 6);
  //         die2Value = Math.floor(Math.random() * 6);
  //         setDie1(die1Value);
  //         setDie2(die2Value);

  //         if(i<20) await sleep(200);
  //         else{
  //             await sleep(intervals[i-20]);
  //         }
  //     }
  //     await sleep(4000);
  //     console.log("die1: ",die1Value);
  //     console.log("die2: ",die2Value);
  //     onFinish(die1Value+die2Value);
  // }

  async function roll_die() {
    const maxIterations = 30;
    const currentIteration = dies[2];
    console.log(currentIteration);
    if (currentIteration < maxIterations) {
      await sleep(
        currentIteration < 20 ? 200 : intervals[currentIteration - 20]
      );
      console.log(intervals[currentIteration]);
      console.log("here");
      const newValue1 = Math.floor(Math.random() * 6);
      const newValue2 = Math.floor(Math.random() * 6);
      setDies([newValue1, newValue2, currentIteration + 1]);
    } else if (currentIteration == maxIterations) {
      await sleep(4000);
      console.log("die1: ", dies[0]);
      console.log("die2: ", dies[1]);
      onFinish(dies[0] + dies[1]);
    }
  }

  const die_images = [Die1, Die2, Die3, Die4, Die5, Die6];

  return (
    <div className="modal">
      <div className="die_container">
        <img
          src={die_images[dies[0]]}
          className="dice"
          draggable="false"
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
        <img
          src={die_images[dies[1]]}
          className="dice"
          draggable="false"
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        />
      </div>
    </div>
  );
}

function StatsModal({ onClose }) {
  return (
    <div className="modal">
      <div className="stats_modal">
        <input
          type="image"
          src={XIcon}
          className="close_icon"
          onClick={onClose}
        />
        <u>
          <h1 style={{ fontSize: 50 }}>Weather Probability</h1>
        </u>
        <div className="weather_probability">
          <h1 style={{ color: "grey" }}>28%</h1>
          <img src={Rain} />
        </div>
        <div className="weather_probability">
          <img src={Sun} />
          <h1 style={{ color: "gold" }}>72%</h1>
        </div>
      </div>
    </div>
  );
}

function LeaderboardModal({ onClose }) {
  return (
    <div className="modal">
      <div className="leaderboard_modal">
        <input
          type="image"
          src={XIcon}
          className="close_icon"
          onClick={onClose}
        />
        <div className="leaderboard_heading">
          <img src={Medal} />
          <h1 style={{ fontSize: 50 }}>LEADERBOARD</h1>
          <img src={Medal} />
        </div>
      </div>
    </div>
  );
}

function ItemPrices({ prices }) {
  return (
    <div className="products">
      <div className="wellies">
        <img src={Wellies} />
        <div className="price_tag">
          <img src={PriceTag} />
          <h1>£{prices.welliesCost}</h1>
        </div>
        <h1 className="sell_prices_text">SELL PRICES</h1>
        <div className="sell_prices">
          <div className="weather_price">
            <img src={Rain} />
            <h1 style={{ paddingBottom: "10px" }}>£{prices.sellWelliesBW}</h1>
          </div>
          <div className="weather_price">
            <img src={Sun} />
            <h1>£{prices.sellWelliesGW}</h1>
          </div>
        </div>
      </div>

      <div className="sunglasses">
        <img src={Sunglasses} />
        <div className="price_tag">
          <img src={PriceTag} />
          <h1>£{prices.sunglassesCost}</h1>
        </div>
        <h1 className="sell_prices_text">SELL PRICES</h1>
        <div className="sell_prices">
          <div className="weather_price">
            <img src={Rain} />
            <h1 style={{ paddingBottom: "10px" }}>
              £{prices.sellSunglassesBW}
            </h1>
          </div>
          <div className="weather_price">
            <img src={Sun} />
            <h1>£{prices.sellSunglassesGW}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Festival;

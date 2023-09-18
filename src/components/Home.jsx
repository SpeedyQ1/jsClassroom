import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import data from "../../challenges.json";
import Waves from "../assets/wave.png";
import LocalFireDepartmentSharpIcon from "@mui/icons-material/LocalFireDepartmentSharp";
import "./Home.css";
function Home() {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setChallenges(data.challenges);
  }, []);

  return (
    <div className="Home-container">
      <img id="Home-wave" src={Waves} />
      <div className="Home-content-container">
        <div className="Home-titles-section">
          <h1 className="Home-challenge-yourself-title">Challenge Yourself!</h1>
          <h2 className="Home-choose-code-block-title">Choose A Code Block</h2>
          <div className="Home-difficulty-explanation">
            <LocalFireDepartmentSharpIcon color="error" />
            <h2>Difficulty Level 1-5 </h2>
            <LocalFireDepartmentSharpIcon color="error" />
          </div>
        </div>
        <div className="Home-challenges-section">
          {challenges?.map((item, index) => (
            <div
              key={index}
              className="Home-challenge-box"
              onClick={() => navigate(`/room/${item.id}`)}
            >
              <div className="Home-difficulty-div">
                {item.difficulty}
                <LocalFireDepartmentSharpIcon color="error" />
              </div>
              {item?.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

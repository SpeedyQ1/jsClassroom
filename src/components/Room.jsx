import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import RunBtn from "./RunBtn";
import data from "../../challenges.json";
import { useParams, useNavigate } from "react-router-dom";
import "./Room.css";
import "animate.css";

const socket = io.connect("https://jsclassroom.onrender.com");

function Room() {
  const { id } = useParams();
  const editorRef = useRef(null);
  const [codeReceived, setCodeReceived] = useState("");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [clientsInRoom, setClientsInRoom] = useState([]);
  const [runCode, setRunCode] = useState(false);
  const [emojiUrl, setEmojiUrl] = useState("");
  const navigate = useNavigate();

  const joinRoom = (room) => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const handleEditorChange = (value) => {
    socket.emit("edit_code", { code: value, room: id });
  };

  const handleRun = () => {
    try {
      // Get the user's code from the editor
      const userCode = editorRef.current.getValue();

      // Get the current challenge's test cases
      const testCases = currentChallenge?.testCases || [];

      let allTestCasesPass = true;

      // Loop through the test cases and check if the user's code produces the expected output
      for (const testCase of testCases) {
        const input = testCase?.input;
        const expectedOutput = testCase?.expectedOutput;
        const userResult = eval(`(${userCode})(...${JSON.stringify(input)})`);
        // Compare the user's result with the expected output
        if (userResult !== expectedOutput) {
          allTestCasesPass = false;
          break;
        }
      }

      // Display the result to the user
      if (allTestCasesPass) {
        setRunCode(true);
        setEmojiUrl(
          "https://www.pngmart.com/files/23/3d-Emoji-PNG-Isolated-File.png"
        );
      } else {
        setRunCode(true);
        setEmojiUrl(
          "https://emojiisland.com/cdn/shop/products/Very_Sad_Face_Emoji_Icon_ios10_grande.png?v=1571606092"
        );
      }
    } catch (error) {
      // Handle any errors that occur during code execution
      alert("Error in the code: " + error.message);
    }
  };

  useEffect(() => {
    setCurrentChallenge(data.challenges[id - 1]);
    joinRoom(id);

    // Emit the get_clients_in_room event when the component mounts
    socket.emit("get_clients_in_room", id);
    // Listen for the response from the server
    socket.on("clients_in_room", (clients) => {
      // Update the state with the list of clients
      setClientsInRoom([...clients]);
    });

    editorRef.current?.setValue(currentChallenge?.initial);

    return () => {
      socket.emit("disconnectMe", id);
    };
  }, [id, currentChallenge]);

  useEffect(() => {
    socket.on("receive_code", (data) => {
      setCodeReceived(data);
    });
  }, []);

  const handleBackButtonClick = () => {
    // Disconnect from the socket room
    socket.emit("disconnectMe", id);
    editorRef.current.setValue("");
    navigate("/");
  };

  const isFirstUser = clientsInRoom[0] === socket.id;
  return (
    <div className="Room-container">
      <img
        id="Room-emoji"
        className={runCode ? "display-me" : "dont-display-me"}
        src={emojiUrl}
        alt="emoji"
        onClick={() => setRunCode(false)}
      />
      <div className="Room-back-btn" onClick={() => handleBackButtonClick()}>
        <h4>back</h4>
      </div>
      <h3 className="Room-challenge-text animate__animated animate__fadeInLeftBig">
        {currentChallenge?.description}
      </h3>
      <h2 className="Room-role-title">
        {isFirstUser ? "(mentor)" : "(student)"}
      </h2>
      <div className="Room-main-section">
        <div className="Room-code-block">
          <Editor
            height="600px"
            width="100%"
            defaultLanguage="javascript"
            defaultValue={`${currentChallenge?.initial}`}
            onMount={(editor, monaco) => {
              editorRef.current = editor;
            }}
            theme= "vs-dark"
            options={{
              readOnly: isFirstUser,
              padding: { top: 20, bottom: 10, left: 10, right: 10 },
            }}
            onChange={(value) => handleEditorChange(value)}
            value={codeReceived}
          />
          <RunBtn handleRun={handleRun} />
        </div>
        <div className="Room-case-testing-div animate__animated animate__fadeInDown">
          <h3 id="Room-case-testing-title">case testing</h3>
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Expected Output</th>
              </tr>
            </thead>
            <tbody>
              {currentChallenge?.testCases?.map((testCase, index) => (
                <tr key={index}>
                  <td>{JSON.stringify(testCase?.input)}</td>
                  <td>{JSON.stringify(testCase?.expectedOutput)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Room;

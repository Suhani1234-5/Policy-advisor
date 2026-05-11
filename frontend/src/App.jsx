import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import Result from "./pages/Result";
import "./index.css";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [rec, setRec] = useState("");
  const [sessionId, setSessionId] = useState("");

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/get-started" 
            element={
              <GetStarted 
                setProfile={setProfile} 
                setRec={setRec} 
                setSessionId={setSessionId} 
              />
            } 
          />
          <Route 
            path="/result" 
            element={
              <Result 
                rec={rec} 
                profile={profile} 
                sessionId={sessionId} 
              />
            } 
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}
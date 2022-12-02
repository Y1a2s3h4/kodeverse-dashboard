import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"
import Dashboard from './Dashboard';

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

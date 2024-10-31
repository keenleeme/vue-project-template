// import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes, Navigate,Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home页面</h1>
      <Link to="/about">跳转到About页面</Link>
    </div>
  )
}

function About() {
  return (
    <div>
      <h1>About页面</h1>
      <Link to="/home">跳转到Home页面</Link>
    </div>
  )
}

function Custom() {
  return (
    <div>
      <h1>Custom页面</h1>
      <div>基座的定制页面</div>
    </div>
  )
}
function App() {
  return (
    <Router basename={window.__MICRO_APP_BASE_ROUTE__ || '/react'}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/custom" element={<Custom />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

// Import pages
import Home from "./pages/Home";
import Start from "./pages/Start";
import Profile from "./pages/Profile";

// Import components
import Header from "./components/Header";
import NavbarBottom from "./components/NavbarBottom";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import AddQuiz from "./components/AddQuiz";
import QuizPage from "./pages/QuizPage";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer
        className={"z-100"}
        autoClose={3000}
        stacked
        draggablePercent={60}
        position="top-right"
      />
      <Routes>
        <Route path="/*" element={<Start />} />
        <Route path="/start" element={<Start />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-quiz" element={<AddQuiz />} />
          <Route path="/quiz/:quizSlug" element={<QuizPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
        </Route>
      </Routes>
      {currentUser ? <NavbarBottom /> : <div />}
    </BrowserRouter>
  );
}

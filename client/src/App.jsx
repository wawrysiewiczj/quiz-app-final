import React from "react";
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
import NotFound from "./pages/NotFound";

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <ToastContainer
        className={"z-100"}
        autoClose={3000}
        stacked
        draggablePercent={60}
        position="top-right"
      />
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <Header />

        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Start />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/quiz/:quizSlug" element={<QuizPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
          </Route>
        </Routes>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[50%] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      {currentUser ? <NavbarBottom /> : <div />}
    </BrowserRouter>
  );
}

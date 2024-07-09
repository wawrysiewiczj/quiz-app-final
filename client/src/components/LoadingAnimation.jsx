import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center min-h-56 ">
      <img
        className="w-12 h-12 animate-spin"
        src="https://www.svgrepo.com/show/448500/loading.svg"
        alt="Loading icon"
      />
    </div>
  );
};

export default LoadingAnimation;

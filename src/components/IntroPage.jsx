import React from "react";

const Intro = ({ setShowMainPage }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-800">
      <div className="w-full px-4 text-center text-white">
        <h1 className="mb-5 animate-pulse text-4xl font-bold" style={{ color: "white" }}>
          <img src="https://vitejs.dev/logo.svg" alt="Logo SixShop" style={{ width: "150px", margin: "0 auto" }} />
          Selamat Datang di SixShop
        </h1>
        <p className="mb-5 text-xl" style={{ color: "white" }}>
          Nikmati pengalaman belanja yang tak tertandingi di pusat fashion trendy, elektronik, dan banyak lagi.
        </p>
        <button className="rounded-lg bg-white px-6 py-3 font-bold text-gray-800 shadow-lg transition duration-500 ease-in-out hover:scale-105 hover:bg-gray-200" onClick={() => setShowMainPage(true)}>
          Mulai Belanja
        </button>
      </div>
    </div>
  );
};

export default Intro;

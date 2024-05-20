import React, { useState } from "react";
import { BookHeartIcon, Facebook, Instagram, MapPinned, ShoppingCartIcon } from "lucide-react";
import Header from "./components/Header";
import Checkout from "./components/Checkout";
import ProductList from "./features/producList/ProductList";
import CartModal from "./features/cart/CartModal";
import Filter from "./components/Filter";
import WishlistModal from "./features/wishlist/WishlistModal";

function App() {
  const [modalStates, setModalStates] = useState({
    cart: false,
    product: false,
    checkout: false,
    filter: false,
    wishlist: false,
  });
  const [dateTimeCheckout, setDateTimeCheckout] = useState(null);
  const [showMainPage, setShowMainPage] = useState(false);

  const toggleModal = (modal) => {
    setModalStates((prevStates) => ({
      ...prevStates,
      [modal]: !prevStates[modal],
    }));
  };

  const handleOpenCheckout = () => {
    setModalStates((prevStates) => ({ ...prevStates, checkout: true }));
    setDateTimeCheckout(new Date());
  };
  const handleCloseCheckout = () => {
    setModalStates((prevStates) => ({ ...prevStates, checkout: false }));
  };

  const isAnyModalOpen = Object.values(modalStates).some((state) => state);
  document.querySelector("body").classList.toggle("overflow-hidden", isAnyModalOpen);

  return (
    <div className={`flex min-h-screen flex-col ${isAnyModalOpen ? "overflow-hidden" : ""}`}>
      {showMainPage && <Header onOpenCart={() => toggleModal("cart")} onOpenWishlist={() => toggleModal("wishlist")} />}
      <div className="flex-grow">
        {!showMainPage && (
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
        )}
        {showMainPage && (
          <main className="container mx-auto mt-24 min-h-[calc(100vh-189px)] max-w-7xl px-5 sm:px-6">
            <ProductList onOpen={() => toggleModal("product")} onClose={() => toggleModal("product")} onOpenFilter={() => toggleModal("filter")} />
          </main>
        )}
      </div>
      {showMainPage && (
        <footer className="bg-gray-800">
          <div className="container mx-auto max-w-7xl px-5 py-4 sm:px-6">
            <p className="text-center text-sm text-slate-200">
              Copyright <span className="text-center text-sm text-slate-200">@</span>{" "}
              <a href="https://github.com/Abiiarm" className="text-lime-500 transition duration-100 ease-in-out hover:text-lime-600" target="_blank" rel="noopener noreferrer" title="SixShop">
                Kelompok 6
              </a>
              <div className="mt-4 flex justify-center space-x-4">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram strokeWidth={2.5} className="mx-4 w-6 stroke-gray-100" />
                </a>
                <a href="https://www.facebook.com//" target="_blank" rel="noopener noreferrer">
                  <Facebook strokeWidth={2.5} className="mx-4 w-6 stroke-gray-100" />
                </a>
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                  <MapPinned strokeWidth={2.5} className="mx-4 w-6 stroke-gray-100" />
                </a>
              </div>
            </p>
          </div>
          {/* <div className="mb-2 mt-2 text-center">
            <a href="https://forms.gle/E1EtaSxY5Nfg7CYh6" target="_blank" rel="noopener noreferrer">
              <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">Nilai Kami</button>
            </a>
          </div> */}
        </footer>
      )}
      {modalStates.cart && <CartModal onClose={() => toggleModal("cart")} onCheckout={handleOpenCheckout} />}
      {modalStates.checkout && <Checkout closeCheckout={handleCloseCheckout} datetime={dateTimeCheckout} />}
      {modalStates.filter && <Filter onClose={() => toggleModal("filter")} />}
      {modalStates.wishlist && <WishlistModal onClose={() => toggleModal("wishlist")} onOpenCart={() => toggleModal("cart")} />}
    </div>
  );
}
export default App;

import React, { useState } from "react";
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
    <div className={isAnyModalOpen ? "overflow-hidden" : ""}>
      <Header onOpenCart={() => toggleModal("cart")} onOpenWishlist={() => toggleModal("wishlist")} />
      <main className="container mx-auto mt-24 min-h-[calc(100vh-189px)] max-w-7xl px-5 sm:px-6">
        <h1 className="mb-10 hidden pt-6 text-center text-2xl font-bold mobile:block">Shop Now</h1>
        <ProductList onOpen={() => toggleModal("product")} onClose={() => toggleModal("product")} onOpenFilter={() => toggleModal("filter")} />
      </main>
      <footer className="mt-10 bg-gray-900">
        <div className="container mx-auto max-w-7xl px-5 py-4 sm:px-6">
          <p className="text-center text-sm text-slate-200">
            Copyright <span className="text-center text-sm text-slate-200">@</span> by{" "}
            <a href="https://github.com/Abiiarm" className="text-lime-500 transition duration-100 ease-in-out hover:text-lime-600" target="_blank" rel="noopener noreferrer" title="SixShop">
              Kelompok 6
            </a>
          </p>
        </div>
      </footer>
      {modalStates.cart && <CartModal onClose={() => toggleModal("cart")} onCheckout={handleOpenCheckout} />}
      {modalStates.checkout && <Checkout closeCheckout={handleCloseCheckout} datetime={dateTimeCheckout} />}
      {modalStates.filter && <Filter onClose={() => toggleModal("filter")} />}
      {modalStates.wishlist && <WishlistModal onClose={() => toggleModal("wishlist")} onOpenCart={() => toggleModal("cart")} />}
    </div>
  );
}
const handleOpenFeedbackForm = () => {
  window.open("https://forms.gle/E1EtaSxY5Nfg7CYh6", "_blank");
};

return (
  <button onClick={handleOpenFeedbackForm} className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
    Buka Formulir Feedback
  </button>
);

export default App;

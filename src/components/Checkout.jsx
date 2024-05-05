import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import { CheckIcon, ChevronDownIcon, CircleIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, selectCartItems, selectTotalItemCart, selectTotalPoint, selectTotalPrice } from "../features/cart/cartSlice";

function ModalOverlay({ children, showModal, showItem }) {
  return (
    <div className={`fixed inset-0 z-[100] h-full min-h-screen w-full overflow-y-auto bg-green-700 transition-all duration-300 ease-in-out ${showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
      <div className="mb-12 mt-8 flex h-full w-full items-center justify-center">
        <div className={`mx-4 w-full max-w-[24rem] md:w-96 md:max-w-none ${showItem ? "h-full py-5" : ""}`}>{children}</div>
      </div>
    </div>
  );
}

const checkoutRootElement = document.getElementById("checkout-root");

function Checkout({ closeCheckout, datetime }) {
  const dispatch = useDispatch();
  const totalItems = useSelector(selectTotalItemCart);
  const totalPrice = useSelector(selectTotalPrice);
  const checkoutItems = useSelector(selectCartItems);
  const totalPoints = useSelector(selectTotalPoint);
  const [showModal, setShowModal] = useState(false);
  const [isOpenDropItem, setIsOpenDropItem] = useState(false);
  const dateCheckout = datetime?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeCheckout = datetime?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const handleCheckout = () => {
    closeCheckout();
    dispatch(clearCart());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowModal(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {ReactDOM.createPortal(
        <ModalOverlay showModal={showModal} showItem={isOpenDropItem}>
          <h6 className="pb-6 pt-5 text-center text-lg font-bold text-gray-50">Checkout Receipt</h6>
          <div className={`relative rounded-t-2xl bg-white px-4 py-6 pb-5 ${isOpenDropItem ? "mb-8" : "mb-1"}`}>
            <div className="relative mb-4.5 text-center">
              <CircleIcon size={84} strokeWidth={1.5} className="mx-auto fill-orange-300 stroke-green-700" />
              <CheckIcon size={32} strokeWidth={4} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform stroke-gray-50 text-gray-50" />
            </div>
            <h5 className="mb-2 text-center text-xl font-bold text-gray-800">Checkout Success</h5>
            <p className="mb-4 text-center text-gray-400">Your checkout process has been successful! We have received your order.</p>
            <p className="mb-2 text-center text-gray-400">Total Payment</p>
            <h4 className="text-center text-3xl font-bold text-gray-800">${totalPrice.toFixed(2)}</h4>
            <div className="relative">
              <hr className="mb-3 mt-4 border-[1.5px] border-dashed border-gray-200" />
              <div className="absolute -right-8 top-1/2 h-6 w-6 -translate-y-1/2 transform rounded-full bg-green-700" />
              <div className="absolute -left-8 top-1/2 h-6 w-6 -translate-y-1/2 transform rounded-full bg-green-700" />
            </div>
            <p className="mb-2.5 font-semibold text-gray-400">Payment for</p>
            <div className="bg mb-2 w-full rounded-xl bg-gray-200 px-3.5 py-3">
              <div className="flex items-center space-x-3">
                <div className="">
                  <figure className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                    <img src="https://vitejs.dev/logo.svg" alt="Vite Logo" className="w-6" />
                  </figure>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="">
                      <p className="mb-0.5 text-base font-semibold text-gray-800">{totalItems} items</p>
                      <p className="text-sm text-gray-400">
                        {dateCheckout} <span className="mx-1 text-sm text-gray-400">.</span> {timeCheckout}
                      </p>
                    </div>
                    <div className="">
                      <button type="button" aria-label="Open Checkout Item" className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-50" onClick={() => setIsOpenDropItem(!isOpenDropItem)}>
                        <ChevronDownIcon size={18} className={`transform stroke-gray-700 transition-transform duration-200 ease-in-out ${isOpenDropItem ? "rotate-180" : "rotate-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {isOpenDropItem && (
                <div className="mb-1 mt-5 flex flex-col gap-3">
                  {checkoutItems?.map((product) => (
                    <div className="flex" key={product?.id}>
                      <div className="">
                        <figure className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-white p-1">
                          <img src={product?.image} alt={product?.title} className="h-full w-full object-contain object-center" />
                        </figure>
                      </div>
                      <div className="">
                        <p className="text-xs font-semibold text-gray-700">{product?.title}</p>
                        <p className="text-xs text-gray-500">
                          {product?.quantity} x ${product?.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="mb-6 text-center text-sm text-gray-600">
              Complete your payment and you will obtain <span className="font-semibold text-green-700">{totalPoints} points.</span>
            </p>
            <button
              type="button"
              className="mb-5 w-full rounded-xl bg-green-500 px-6 py-3.5 text-center text-sm font-bold leading-normal text-gray-100 transition duration-100 ease-in-out hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-emerald-200"
              onClick={handleCheckout}
            >
              Done
            </button>
            <p className="mb-2 cursor-pointer text-center font-semibold text-emerald-500 hover:text-emerald-600" onKeyDown={(e) => e.key === "Enter" && handleCheckout()} role="presentation" aria-label="Shop More" onClick={handleCheckout}>
              Shop More
            </p>
            <div className="absolute -bottom-4 left-2.5 right-2.5">
              <div className="flex items-center justify-center space-x-1">
                {[...Array(13)].map(() => (
                  <div key={uuidv4()} className="h-6 w-6 rounded-full bg-green-700" />
                ))}
              </div>
            </div>
          </div>
        </ModalOverlay>,
        checkoutRootElement
      )}
    </>
  );
}

ModalOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool.isRequired,
  showItem: PropTypes.bool.isRequired,
};
Checkout.propTypes = {
  closeCheckout: PropTypes.func.isRequired,
  datetime: PropTypes.instanceOf(Date).isRequired,
};

export default Checkout;

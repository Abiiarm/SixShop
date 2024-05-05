import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { ChevronLeftIcon, XIcon } from "lucide-react";
import { addItemToCart } from "../cart/cartSlice";
import { removeItemFromWishlist, selectTotalWishlistItems, selectWishlistItems } from "./wishlistSlice";
import Modal from "../../components/Modal";
import wishlistImg from "../../assets/img/package.png";

function WishlistModal({ onClose, onOpenCart }) {
  const dispatch = useDispatch();
  const totalWIshlist = useSelector(selectTotalWishlistItems);
  const wishlistItem = useSelector(selectWishlistItems);

  const handleRemoveWishlist = (product) => {
    dispatch(removeItemFromWishlist(product));
  };

  const handleAddToCart = (product) => {
    dispatch(addItemToCart(product));
    onClose();
    onOpenCart();
  };

  return (
    <Modal onClose={onClose}>
      <div className="relative w-full">
        <div className="h-[65vh] overflow-y-auto px-5 md:h-[54vh]">
          <div className="h-full">
            <div className="absolute -top-[2.375rem] left-0 w-full">
              <h5 className="text-center font-bold">Wishlist</h5>
            </div>
            <div className="absolute -top-10 left-3 z-[101]">
              <button type="button" aria-label="Close Wishlist" className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 transition duration-100 ease-in-out hover:bg-gray-200" onClick={onClose}>
                <ChevronLeftIcon size={20} />
              </button>
            </div>
            {totalWIshlist === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center pb-5">
                <img src={wishlistImg} alt="Wishlist Blue Box Empty" className="block w-28" />
                <p className="mt-3 text-center text-sm font-semibold">"Wishlist Anda kosong 👌"</p>
                <p className="text-center text-sm text-gray-400">Tekan ikon hati di item yang Anda sukai untuk menyimpannya sebagai favorit Anda ✨.</p>
                <button
                  type="button"
                  aria-label="Continue Shopping"
                  className="mt-3 block rounded-lg bg-lime-600 px-4 py-1.5 text-center text-sm font-bold leading-normal text-gray-100 transition duration-100 ease-in-out hover:bg-lime-500"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="mb-3">
                {wishlistItem?.map((product) => (
                  <div className="flex items-center space-x-3 border-b border-dashed border-gray-200 py-4" key={product?.id}>
                    <div className="">
                      <figure className="h-20 w-14 overflow-hidden px-2">
                        <img src={product?.image} alt={product?.title} className="h-full w-full object-contain object-center" />
                      </figure>
                    </div>
                    <div className="w-full">
                      <h6 className="relative mb-px line-clamp-2 pr-8 text-sm font-bold text-gray-800 hover:line-clamp-none">
                        {product?.title}
                        <span className="absolute right-0 top-0 cursor-pointer" role="presentation" onClick={() => handleRemoveWishlist(product)}>
                          <XIcon size={20} className="stroke-gray-400 hover:stroke-red-500" />
                        </span>
                      </h6>
                      <p className="mb-1 text-xs capitalize text-gray-400">{product?.category}</p>
                      <div className="flex items-center justify-between">
                        <h6 className="font-semibold">${product?.price.toFixed(2)} USD</h6>
                        <button
                          type="button"
                          aria-label="Add to Cart"
                          className="rounded-lg bg-gray-800 px-4 py-1.5 text-center text-sm font-bold leading-normal text-gray-100 transition duration-100 ease-in-out hover:bg-lime-600"
                          onClick={() => handleAddToCart(product)}
                          title="Add to Cart"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

WishlistModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenCart: PropTypes.func.isRequired,
};

export default WishlistModal;

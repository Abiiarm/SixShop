import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { HeartIcon, Loader2Icon, PlusIcon, SearchIcon, SlidersHorizontalIcon, StarIcon, XIcon } from "lucide-react";
import { setProductsError, setProductsStart, setProductsSuccess } from "./productSlice";
import ProductModal from "./ProductModal";
import { setCategory, setSearch } from "./filterSlice";
import systemImg from "../../assets/img/system.png";
import emptyImg from "../../assets/img/empty-box.png";
import { addItemToWishlist, selectWishlistItems } from "../wishlist/wishlistSlice";

const BASE_URL = import.meta.env.VITE_API_KEY;

function ProductList({ onOpen, onClose, onOpenFilter }) {
  const { productItems, loading, categories, error } = useSelector((state) => state.product);
  const wishlistItems = useSelector(selectWishlistItems);
  const { category: selectedCategory, sortBy, search } = useSelector((state) => state.filter.filters);
  const dispatch = useDispatch();

  const [isOpenModalProduct, setIsOpenModalProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFilterCategory = (category) => {
    dispatch(setCategory(category));
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    dispatch(setSearch(value));
  };

  const handleWishlist = (product) => {
    dispatch(addItemToWishlist(product));
  };

  const handleOpenModalProduct = (product) => {
    setIsOpenModalProduct(true);
    onOpen();
    setSelectedProduct({
      ...product,
      quantity: 1,
      totalPrice: product.price,
      point: product.id,
    });
  };
  const handleCloseModalProduct = () => {
    setIsOpenModalProduct(false);
    onClose();
  };

  const handleToggleFilter = () => {
    onOpenFilter();
  };

  const filteredProducts = useMemo(() => {
    const filtered = productItems.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "a_z":
        return filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
      case "z_a":
        return filtered.slice().sort((a, b) => b.title.localeCompare(a.title));
      case "highest":
        return filtered.slice().sort((a, b) => b.price - a.price);
      case "lowest":
        return filtered.slice().sort((a, b) => a.price - b.price);
      case "top_rated":
        return filtered.slice().sort((a, b) => b.rating.rate - a.rating.rate);
      case "most_reviewed":
        return filtered.slice().sort((a, b) => b.rating.count - a.rating.count);
      case "relevance":
      default:
        return filtered;
    }
  }, [productItems, search, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setProductsStart());
        const response = await fetch(BASE_URL);
        const data = await response.json();
        dispatch(setProductsSuccess(data));
      } catch (err) {
        dispatch(setProductsError(err.message));
      }
    };
    fetchProducts();
  }, [dispatch]);

  const isWishlistProduct = (product) => wishlistItems.find((item) => item.id === product.id);

  return (
    <>
      <div className="mb-5 flex flex-col-reverse gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="categories-filter flex items-center overflow-x-scroll">
          <button
            className={`mr-2 w-auto whitespace-nowrap rounded-full border-2 bg-gray-100 px-3 py-1.5 text-left text-sm font-medium text-gray-700 transition duration-100 ease-in-out ${
              selectedCategory === "all" ? "border-gray-700 hover:bg-gray-200" : "border-gray-100 hover:border-gray-200 hover:bg-gray-200"
            } disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-400`}
            type="button"
            disabled={!!(error || loading)}
            onClick={() => handleFilterCategory("all")}
          >
            All Products
          </button>
          {categories?.map((category) => (
            <button
              className={`mr-2 w-auto whitespace-nowrap rounded-full border-2 bg-gray-100 px-3 py-1.5 text-left text-sm font-medium capitalize text-gray-700 transition duration-300 ease-in-out ${
                selectedCategory === category ? "border-gray-700 hover:bg-gray-200" : "border-gray-100 hover:border-gray-200 hover:bg-gray-200"
              } disabled:cursor-not-allowed disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-400`}
              key={category}
              onClick={() => handleFilterCategory(category)}
              disabled={!!(error || loading)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <div className="">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
              />
              <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform stroke-gray-400" />
              {search && <XIcon size={15} className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer stroke-gray-400 hover:stroke-gray-500" onClick={() => dispatch(setSearch(""))} />}
            </div>
            <div className="">
              <button className="relative flex h-[2.375rem] w-[2.375rem] items-center justify-center rounded-full bg-gray-900 transition duration-100 ease-in-out hover:bg-lime-600" type="button" title="Filter" onClick={handleToggleFilter}>
                <SlidersHorizontalIcon strokeWidth={2.5} size={18} className="w-5 stroke-gray-100" />
                {sortBy !== "relevance" ? <div className="absolute -right-0.75 -top-px flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-red-500" /> : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {loading && (
          <div className="flex min-h-[68vh] items-center justify-center mobile:min-h-[62vh]">
            <Loader2Icon className="animate-spin-fast stroke-gray-800" size={48} />
          </div>
        )}
        {error && (
          <div className="flex min-h-[68vh] flex-col items-center justify-center mobile:min-h-[62vh]">
            <img src={systemImg} alt="System Computer Error" className="w-24" />
            <p className="mt-5 text-lg font-semibold text-gray-400">We lost one, please try again.</p>
            <a href="/" className="mt-3 block rounded-lg bg-lime-600 px-4 py-1.5 text-center text-sm font-bold leading-normal text-gray-100 transition duration-100 ease-in-out hover:bg-lime-500">
              Reload
            </a>
          </div>
        )}
        {!loading && !error && (
          <div className="grid w-full grid-cols-4 gap-4 mobile:grid-cols-12 xl:grid-cols-10">
            {filteredProducts?.length > 0 ? (
              filteredProducts?.map((product) => (
                <div className="relative col-span-full flex w-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-3 xxs:col-span-2 mobile:col-span-4 md:col-span-3 xl:col-span-2" key={product?.id}>
                  <div className="mb-2">
                    <figure className="mb-1 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4">
                      <img src={product?.image} alt={product?.title} className="h-full w-full object-contain object-center" />
                    </figure>
                    <span className="mb-0.5 block text-xs capitalize text-gray-500 mobile:mb-1">{product?.category}</span>
                    <h1 className="mb-2 line-clamp-2 text-xs font-bold text-gray-700 hover:line-clamp-none mobile:mb-2.5">{product?.title}</h1>
                    <p className="text-xs text-gray-500">
                      <StarIcon size={14} fill="#facc15" className="mr-1 inline-block stroke-yellow-400" />
                      {product?.rating?.rate.toFixed(1)} | {product?.rating?.count} reviews
                    </p>
                  </div>
                  <button
                    className="group relative mt-2 w-full rounded-full bg-gray-100 px-4 py-2 text-left text-sm font-semibold text-gray-700 transition-all duration-300 ease-in-out before:absolute before:inset-0 before:w-0 before:rounded-full before:bg-lime-500 before:transition-all before:duration-300 before:ease-in-out hover:bg-gray-200 hover:before:w-full"
                    type="button"
                    onClick={() => handleOpenModalProduct(product)}
                    title="Add to cart"
                  >
                    ${product?.price}
                    <span className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform whitespace-nowrap text-center text-gray-100 opacity-0 transition-all duration-[400ms] ease-in-out group-hover:z-10 group-hover:opacity-100">
                      Buy Now
                    </span>
                    <div className="absolute bottom-0.5 right-0.5 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 transition-all duration-200 ease-in-out group-hover:-z-10 group-hover:scale-90 group-hover:bg-lime-500">
                      <PlusIcon size={18} className="stroke-white" />
                    </div>
                  </button>
                  <div className="absolute right-3 top-3">
                    <HeartIcon size={22} className={`cursor-pointer ${isWishlistProduct(product) ? "bg-red-500 fill-red-500 stroke-red-500" : "stroke-gray-400"}}`} onClick={() => handleWishlist(product)} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="flex min-h-[68vh] flex-col items-center justify-center mobile:min-h-[62vh]">
                  <img src={emptyImg} alt="Box Product Empty" className="w-24" />
                  <p className="mt-5 text-lg font-semibold text-gray-400">No products found.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isOpenModalProduct ? <ProductModal onClose={handleCloseModalProduct} product={selectedProduct} /> : null}
    </>
  );
}

ProductList.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenFilter: PropTypes.func.isRequired,
};

export default ProductList;

import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { resetFilter, setSortBy } from "../features/producList/filterSlice";

function Filter({ onClose }) {
  const dispatch = useDispatch();
  const { sortBy } = useSelector((state) => state.filter.filters);
  const [sortFilter, setSortFilter] = useState(sortBy);

  const handleAction = (action, value = null) => {
    if (action === "reset") {
      dispatch(resetFilter());
    } else if (action === "submit") {
      dispatch(setSortBy(sortFilter));
    } else {
      setSortFilter(value);
    }
    if (action !== "sort") onClose();
  };

  const renderSortButton = (label, value) => (
    <div className="flex items-center justify-between">
      <p>{label}</p>
      <button type="button" aria-label={label} className={`h-6 w-6 rounded-full ${sortFilter === value ? "border-[8px] border-gray-800" : "border-2 border-gray-400"}`} onClick={() => handleAction("sort", value)} />
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div className="relative w-full">
        <div className="max-h-[calc(72vh-70px)] overflow-y-auto px-5 md:max-h-[64vh]">
          <div className="h-full">
            <div className="absolute -top-[2.375rem] left-0 w-full">
              <h5 className="text-center font-bold">Filters</h5>
            </div>
            <div className="absolute -top-10 left-3 z-[101]">
              <button type="button" aria-label="Close Filter" className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 transition duration-100 ease-in-out hover:bg-gray-200" onClick={() => handleAction("close")}>
                <ChevronLeftIcon size={20} />
              </button>
            </div>
            <div className="absolute -top-10 right-3 z-[101]">
              <button
                type="button"
                aria-label="Reset Filter"
                className="rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-600 transition duration-100 ease-in-out hover:bg-gray-200 hover:text-gray-800"
                onClick={() => handleAction("reset")}
              >
                Reset
              </button>
            </div>
            <h6 className="mb-4 mt-2 font-bold">Sort by</h6>
            <div className="mb-6 flex flex-col gap-4">
              {renderSortButton("Relevance", "relevance")}
              {renderSortButton("Highest Price", "highest")}
              {renderSortButton("Lowest Price", "lowest")}
              {renderSortButton("A - Z", "a_z")}
              {renderSortButton("Z - A", "z_a")}
              {renderSortButton("Top Rated", "top_rated")}
              {renderSortButton("Most Reviewed", "most_reviewed")}
            </div>
            <button
              type="button"
              aria-label="Show Results"
              className="w-full rounded-xl bg-gray-900 px-6 py-3.5 text-center text-sm font-bold leading-normal text-gray-100 transition duration-100 ease-in-out hover:bg-lime-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={() => handleAction("submit")}
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

Filter.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Filter;

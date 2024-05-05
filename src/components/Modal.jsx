import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const BackdropOverlay = ({ onClose }) => <div role="presentation" className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />;

const ModalOverlay = ({ children, showModal, desktopView, onClose }) => {
  const viewClass = desktopView ? `items-center ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"}` : `items-end ${showModal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"}`;

  return (
    <div className={`fixed inset-x-0 bottom-0 top-auto z-[100] flex h-auto w-full justify-center transition-all duration-300 ease-in-out md:top-0 md:h-screen ${viewClass}`} onClick={onClose} role="presentation" tabIndex={-1}>
      <div className={`bg-white pb-5 pt-14 ${desktopView ? "w-[32rem] rounded-xl" : "w-full rounded-t-2xl"}`} role="presentation" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const modalRootElement = document.getElementById("modal-root");

const Modal = ({ children, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktopView(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowModal(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {ReactDOM.createPortal(<BackdropOverlay onClose={onClose} />, modalRootElement)}
      {ReactDOM.createPortal(
        <ModalOverlay showModal={showModal} desktopView={isDesktopView} onClose={onClose}>
          {children}
        </ModalOverlay>,
        modalRootElement
      )}
    </>
  );
};

BackdropOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
};
ModalOverlay.propTypes = {
  children: PropTypes.node.isRequired,
  showModal: PropTypes.bool.isRequired,
  desktopView: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;

import React, { useEffect, useRef } from "react";
import { XIcon } from "lucide-react";
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}
const VideoModal = ({ isOpen, onClose, videoId }: VideoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-xl overflow-hidden max-w-4xl w-full shadow-2xl relative"
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="font-display text-xl font-bold">
            Abu Dhabi Business Opportunities
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Abu Dhabi Business Opportunities"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-6">
          <p className="font-body text-gray-600 mb-4">
            Discover the endless possibilities for business growth and
            innovation in Abu Dhabi's dynamic economy.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoModal;

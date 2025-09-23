import React, { useEffect, useRef } from "react";
import {
  XIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  MapPinIcon,
  BuildingIcon,
  TagIcon,
  BarChart3Icon,
} from "lucide-react";
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: number;
    name: string;
    logo: string;
    category: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    address?: string;
    founded?: string;
    employees?: string;
    revenue?: string;
    services?: string[];
  } | null;
}
const ProfileModal = ({ isOpen, onClose, profile }: ProfileModalProps) => {
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
  if (!isOpen || !profile) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl relative"
      >
        <div className="p-6 flex justify-between items-center border-b sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden mr-4 shadow-sm">
              <img
                src={profile.logo}
                alt={`${profile.name} logo`}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">
                {profile.name}
              </h3>
              <span className="inline-block px-3 py-1 bg-primary-light bg-opacity-20 text-primary-dark text-xs rounded-full font-body font-medium">
                {profile.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XIcon size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h4 className="font-display text-lg font-bold mb-4">About</h4>
              <p className="font-body text-gray-600 mb-6">
                {profile.description}
              </p>
              {profile.services && (
                <div className="mb-6">
                  <h4 className="font-display text-lg font-bold mb-4">
                    Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-body"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-display text-lg font-bold mb-4">
                Contact Information
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600">
                  <PhoneIcon size={18} className="mr-3 text-primary" />
                  <a
                    href={`tel:${profile.phone}`}
                    className="font-body hover:text-primary"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li className="flex items-center text-gray-600">
                  <MailIcon size={18} className="mr-3 text-primary" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-body hover:text-primary"
                  >
                    {profile.email}
                  </a>
                </li>
                <li className="flex items-center text-gray-600">
                  <GlobeIcon size={18} className="mr-3 text-primary" />
                  <a
                    href={`https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body hover:text-primary"
                  >
                    {profile.website}
                  </a>
                </li>
                {profile.address && (
                  <li className="flex items-start text-gray-600">
                    <MapPinIcon
                      size={18}
                      className="mr-3 mt-1 flex-shrink-0 text-primary"
                    />
                    <span className="font-body">{profile.address}</span>
                  </li>
                )}
              </ul>
              {(profile.founded || profile.employees || profile.revenue) && (
                <>
                  <h4 className="font-display text-lg font-bold mt-8 mb-4">
                    Company Details
                  </h4>
                  <ul className="space-y-4">
                    {profile.founded && (
                      <li className="flex items-center text-gray-600">
                        <BuildingIcon size={18} className="mr-3 text-primary" />
                        <span className="font-body">
                          Founded: {profile.founded}
                        </span>
                      </li>
                    )}
                    {profile.employees && (
                      <li className="flex items-center text-gray-600">
                        <TagIcon size={18} className="mr-3 text-primary" />
                        <span className="font-body">
                          Employees: {profile.employees}
                        </span>
                      </li>
                    )}
                    {profile.revenue && (
                      <li className="flex items-center text-gray-600">
                        <BarChart3Icon
                          size={18}
                          className="mr-3 text-primary"
                        />
                        <span className="font-body">
                          Revenue: {profile.revenue}
                        </span>
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;

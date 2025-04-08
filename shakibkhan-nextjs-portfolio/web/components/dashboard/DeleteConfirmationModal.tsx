"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AlertTriangle } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContextProvider";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmationModalProps) {
  const { isDarkMode } = useGlobalContext();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <Dialog.Title as="h3" className={`text-lg font-medium leading-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {title}
                  </Dialog.Title>
                </div>

                <div className="mt-3">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {message}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

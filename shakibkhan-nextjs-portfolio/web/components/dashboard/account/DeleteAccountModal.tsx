"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import { useGlobalContext } from "@/context/GlobalContextProvider";

interface DeleteAccountModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
}

export default function DeleteAccountModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  confirmText,
  onConfirmTextChange,
}: DeleteAccountModalProps) {
  const { isDarkMode } = useGlobalContext();

  const hasChanges = confirmText !== "";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          if (!isDeleting) {
            onClose();
          }
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel
                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                    <FiAlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium leading-6 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Delete Account
                  </Dialog.Title>
                </div>

                <div className="mt-4">
                  <p className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-500"
                  }`}>
                    This action cannot be undone. This will permanently delete your
                    account and remove all of your data from our servers.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Please type "DELETE MY ACCOUNT" to confirm:
                    </span>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => onConfirmTextChange(e.target.value)}
                      placeholder="Type DELETE MY ACCOUNT"
                      className={`mt-1 w-full px-4 py-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-red-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-red-500"
                      }`}
                    />
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  {hasChanges ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onConfirmTextChange("");
                          onClose();
                        }}
                        disabled={isDeleting}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting || confirmText !== "DELETE MY ACCOUNT"}
                        onClick={onConfirm}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          isDarkMode
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        } ${
                          isDeleting || confirmText !== "DELETE MY ACCOUNT"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FiTrash2 className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isDeleting}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

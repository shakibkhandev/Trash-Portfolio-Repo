import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FiLogOut } from 'react-icons/fi'
import { useGlobalContext } from '@/context/GlobalContextProvider'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const { isDarkMode } = useGlobalContext()
  const [confirmText, setConfirmText] = useState("")

  const hasChanges = confirmText !== ""

  const handleClose = () => {
    setConfirmText("")
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                <Dialog.Title as="h3" className={`text-lg font-medium leading-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Confirm Logout
                </Dialog.Title>
                <div className="mt-2">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Are you sure you want to log out? You will need to sign in again to access your account.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Please type "LOGOUT" to confirm:
                    </span>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type LOGOUT"
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
                        onClick={handleClose}
                        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        disabled={confirmText !== "LOGOUT"}
                        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer ${
                          confirmText === "LOGOUT"
                            ? 'bg-red-600'
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                        onClick={onConfirm}
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      onClick={handleClose}
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
  )
}

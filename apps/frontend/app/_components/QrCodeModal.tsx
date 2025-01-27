import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  showQRCode,
  setShowQRCode,
  shareUrl,
  orgURL,
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {showQRCode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowQRCode(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <button
              onClick={() => setShowQRCode(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Scan to View Event
              </motion.h3>

              <motion.div
                className="relative inline-block bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={shareUrl}
                  size={256}
                  level="H"
                  imageSettings={{
                    src: orgURL,
                    height: 64,
                    width: 64,
                    excavate: true,
                  }}
                  className="rounded-lg"
                />

                <motion.div
                  initial={{ top: 0, opacity: 0.5 }}
                  animate={{
                    top: ["0%", "100%", "0%"],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 w-full h-4 bg-gradient-to-b from-indigo-500/30 to-transparent"
                />
              </motion.div>

              <motion.div
                className="mt-6 p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-gray-600 mb-2">Event Link</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-sm text-gray-700 outline-none"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="ghost"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    {copied ? (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-green-600"
                      >
                        Copied!
                      </motion.span>
                    ) : (
                      "Copy"
                    )}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600 mb-4">Share via</p>
                <div className="flex justify-center gap-4">
                  {[
                    {
                      Button: FacebookShareButton,
                      Icon: FacebookIcon,
                      color: "bg-blue-100",
                    },
                    {
                      Button: TwitterShareButton,
                      Icon: TwitterIcon,
                      color: "bg-sky-100",
                    },
                    {
                      Button: LinkedinShareButton,
                      Icon: LinkedinIcon,
                      color: "bg-blue-100",
                    },
                    {
                      Button: WhatsappShareButton,
                      Icon: WhatsappIcon,
                      color: "bg-green-100",
                    },
                  ].map((Platform, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Platform.Button url={shareUrl} title={title}>
                        <div
                          className={`p-2 rounded-full ${Platform.color} hover:brightness-95`}
                        >
                          <Platform.Icon size={32} round />
                        </div>
                      </Platform.Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;

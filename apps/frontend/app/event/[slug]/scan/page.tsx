"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Camera,
  X,
  CheckCircle,
  AlertCircle,
  ScanLine,
  QrCode,
  FlipHorizontal,
} from "lucide-react";
import { BACKEND_URL } from "@/app/secret";
import { toast } from "sonner";
// import EventLayout from "../EventLayout";
import { EventLoadingState } from "@/app/_components/Loading";
import { useAuthCheck } from "@/lib/authCheck";

const QRScanPage = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const eventId = useParams().slug as string;
  const [scanResult, setScanResult] = useState<{
    user: string;
    email: string;
  } | null>(null);
  const [scanValue, setScanValue] = useState(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useAuthCheck();

  const handleScan = useCallback(
    async (res: { rawValue: any }[]) => {
      if (!res || !res[0] || !res[0].rawValue) {
        setErrorMessage("No valid QR code detected");
        return;
      }

      const scannedValue = res[0].rawValue;
      setScanValue(scannedValue);
      setLoading(true);

      try {
        const response = await fetch(`${BACKEND_URL}/scan/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attendanceId: scannedValue,
            eventId: eventId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.user && data.email) {
          setScanResult({ user: data.user, email: data.email });
          setIsCameraOpen(false);
        } else {
          setErrorMessage(data.message || "Invalid QR code");
        }
      } catch (error) {
        setErrorMessage("Network error. Retry scanning");
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoCameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setCameras(videoCameras);

        if (videoCameras.length > 0) {
          setSelectedCamera(videoCameras[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing cameras", error);
      }
    };

    if (isCameraOpen) {
      getCameras();
    }
  }, [isCameraOpen]);

  const handleConfirmRegistration = useCallback(async () => {
    if (!scanResult) return;
    try {
      const response = await fetch(`${BACKEND_URL}/scan/verified`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attendanceId: scanValue,
          eventId: eventId,
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        toast.success("Check-in Successful!");
        setScanResult(null);
      } else {
        setErrorMessage(result.message || "Registration failed");
      }
    } catch {
      setErrorMessage("Registration error");
    }
  }, [scanResult, scanValue, eventId]);

  const cycleCamera = () => {
    if (!selectedCamera || cameras.length <= 1) return;

    const currentIndex = cameras.findIndex(
      (camera) => camera.deviceId === selectedCamera
    );
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex].deviceId);
  };

  if (loading) return <EventLoadingState />;

  return (
    // <EventLayout>
    <main className="relative">
      <div className="h-[90vh] container mx-auto px-4 bg-gradient-to-br from-emerald-50 to-emerald-100 flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-grow flex flex-col justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white shadow-2xl rounded-2xl border-4 border-emerald-300">
              <CardHeader className="bg-emerald-600 text-white rounded-t-xl py-6">
                <CardTitle className="flex items-center justify-center text-3xl font-bold">
                  <ScanLine className="mr-4 h-10 w-10" />
                  Event Attendee Check-in
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {!isCameraOpen ? (
                  <div className="text-center space-y-6">
                    <QrCode className="mx-auto h-32 w-32 text-emerald-600 mb-6" />
                    <p className="text-xl text-emerald-800 mb-6">
                      Ready to scan attendee QR codes
                    </p>
                    <Button
                      onClick={() => setIsCameraOpen(true)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-lg transition-all duration-300 transform hover:scale-105"
                      size="lg"
                    >
                      <Camera className="mr-3 h-8 w-8" />
                      Open Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden border-4 border-emerald-500 shadow-2xl">
                      <Scanner
                        onScan={handleScan}
                        constraints={{
                          deviceId: selectedCamera ?? undefined,
                          aspectRatio: 1,
                        }}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => setIsCameraOpen(false)}
                        className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                      {cameras.length > 1 && (
                        <Button
                          onClick={cycleCamera}
                          variant="outline"
                          className="flex items-center"
                        >
                          <FlipHorizontal className="mr-2 h-5 w-5" />
                          Switch Camera
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 text-center text-emerald-700">
                      Align QR code within the scanner frame
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!scanResult} onOpenChange={() => setScanResult(null)}>
        <DialogContent className="bg-emerald-50 border-4 border-emerald-300">
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-900 text-2xl">
              <CheckCircle className="mr-3 text-emerald-600 h-10 w-10" />
              Confirm Attendee
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <div className="bg-white border-2 border-emerald-200 p-4 rounded-lg">
              <div className="text-lg text-emerald-900">
                <strong>Name:</strong> {scanResult?.user}
              </div>
              <div className="text-lg text-emerald-900">
                <strong>Email:</strong> {scanResult?.email}
              </div>
            </div>
          </DialogDescription>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setScanResult(null)}
              className="w-1/2 mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRegistration}
              className="w-1/2 bg-emerald-600 hover:bg-emerald-700"
            >
              Confirm Check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <DialogContent className="bg-red-50 border-4 border-red-300">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-900 text-2xl">
              <AlertCircle className="mr-3 text-red-600 h-10 w-10" />
              Scanning Error
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-xl text-red-800">
            {errorMessage}
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setErrorMessage(null)}
              variant="destructive"
              className="w-full"
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
    // </EventLayout>
  );
};

export default QRScanPage;

"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EventNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">
          Event Not Found
        </h2>
        <Button
          onClick={() => router.push("/home")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft, Search } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50/70 to-white">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* 404 Text */}
          <motion.div
            variants={itemVariants}
            className="relative mb-8 select-none text-[12rem] font-bold leading-none tracking-tight lg:text-[20rem]"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-400 bg-clip-text text-transparent blur-3xl">
              404
            </span>
            <span className="relative bg-gradient-to-br from-emerald-950 to-emerald-600 bg-clip-text text-transparent">
              404
            </span>
          </motion.div>

          {/* Message */}
          <motion.h2
            variants={itemVariants}
            className="mb-4 text-3xl font-bold text-emerald-950 lg:text-4xl"
          >
            Page not found
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-lg text-lg text-emerald-700"
          >
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or never existed in the first place.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/">
              <Button
                variant="default"
                className="min-w-[200px] bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="min-w-[200px] border-emerald-200 transition-colors hover:bg-emerald-50"
              onClick={() => window.history.back()}
            >
              <MoveLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>

          {/* Search Suggestion */}
          {/* <motion.div
            variants={itemVariants}
            className="mt-12 rounded-2xl bg-emerald-50/50 p-6 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3 text-emerald-600">
              <Search className="h-5 w-5" />
              <span>
                Try searching for what you need or contact support for help
              </span>
            </div>
          </motion.div> */}
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-20rem)] aspect-[1155/678] w-[27.125rem] -translate-x-1 rotate-[30deg] bg-gradient-to-tr from-emerald-200 to-emerald-50 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-emerald-300 to-emerald-100 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;

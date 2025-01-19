import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarOff, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Review {
  id: string;
  eventId: string;
  participants: number;
  Review: number;
}

interface ReviewCardProps {
  reviews: Review[];
  eventId: string;
  onReviewSubmit: (rating: number) => Promise<void>;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviews,
  eventId,
  onReviewSubmit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasReviews = reviews && reviews.length > 0;
  const averageRating = hasReviews ? reviews[0].Review : 0;

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating first");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReviewSubmit(rating);
      toast.success("Thank you for your review!");
      setRating(null);
      setIsExpanded(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/95 shadow-xl border-0 overflow-hidden w-72">
      <CardContent className="p-2 md:p-6 m-auto">
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {hasReviews ? (
            <div className="flex items-center gap-4">
              <motion.div
                className="shrink-0"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {Number(averageRating).toFixed(2)}
                </div>
              </motion.div>
              <div className="h-12 w-px bg-gradient-to-b from-emerald-300 to-teal-100" />
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {reviews[0].participants} rating
                  {reviews[0].participants > 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-emerald-300 to-teal-100" />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <StarOff className="h-5 w-5" />
              <span className="text-sm">No ratings yet</span>
              <div className="h-12 w-px bg-gradient-to-b from-emerald-100 to-teal-100" />
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100 rounded-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </Button>
            </div>
          )}

          {/* Rating Input Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            (
                              hoverRating !== null
                                ? star <= hoverRating
                                : star <= (rating || 0)
                            )
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={handleSubmit}
                      disabled={!rating || isSubmitting}
                      className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 
                        hover:from-emerald-700 hover:to-teal-700 text-white
                        ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

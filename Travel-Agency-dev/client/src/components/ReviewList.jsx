// src/components/ReviewList.jsx
import React from "react";
import { format } from "date-fns";

export default function ReviewList({ reviews }) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                by {review.user?.email || "Anonymous"}
              </span>
            </div>
            <span className="ml-auto text-sm text-gray-500">
              {format(new Date(review.created_at), "MMM d, yyyy")}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

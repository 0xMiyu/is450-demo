"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
  text: string;
  stars: number;
  sentiment: "Positive" | "Neutral" | "Negative";
};

type Product = {
  id: number;
  name: string;
  reviews: Review[];
};
const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Earbuds",
    reviews: [
      {
        text: "Great sound quality and comfort!",
        stars: 5,
        sentiment: "Positive",
      },
      { text: "Battery life could be better.", stars: 3, sentiment: "Neutral" },
      {
        text: "Stopped working after two weeks.",
        stars: 2,
        sentiment: "Negative",
      },
      { text: "Amazing clarity, love them.", stars: 5, sentiment: "Positive" },
    ],
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    reviews: [
      { text: "Loud and clear sound!", stars: 5, sentiment: "Positive" },
      {
        text: "Sleek design but heavy to carry.",
        stars: 3,
        sentiment: "Neutral",
      },
      {
        text: "Disappointed with bass performance.",
        stars: 4,
        sentiment: "Negative",
      },
    ],
  },
  {
    id: 3,
    name: "Smart Fitness Band",
    reviews: [
      {
        text: "Inaccurate step count ruined my goals.",
        stars: 4,
        sentiment: "Negative",
      },
      {
        text: "Great battery, but screen scratches easily.",
        stars: 4,
        sentiment: "Negative",
      },
      { text: "Looks good but not reliable.", stars: 5, sentiment: "Negative" },
      { text: "Nice app interface.", stars: 4, sentiment: "Positive" },
    ],
  },
  {
    id: 4,
    name: "Laptop Stand",
    reviews: [
      {
        text: "Very sturdy and great height.",
        stars: 5,
        sentiment: "Positive",
      },
      {
        text: "Perfect for my work from home setup.",
        stars: 5,
        sentiment: "Positive",
      },
      {
        text: "Solid build, value for money.",
        stars: 4,
        sentiment: "Positive",
      },
      {
        text: "Improved my posture instantly.",
        stars: 5,
        sentiment: "Positive",
      },
    ],
  },
  {
    id: 5,
    name: "Phone Case",
    reviews: [
      { text: "Stylish but slippery.", stars: 5, sentiment: "Negative" },
      { text: "Buttons are hard to press.", stars: 4, sentiment: "Negative" },
      { text: "Looks good but feels cheap.", stars: 5, sentiment: "Negative" },
      { text: "Easily scratches.", stars: 4, sentiment: "Negative" },
    ],
  },
  {
    id: 6,
    name: "Portable Charger",
    reviews: [
      {
        text: "Charges quickly and lasts long.",
        stars: 5,
        sentiment: "Positive",
      },
      { text: "Very handy while travelling.", stars: 4, sentiment: "Positive" },
      {
        text: "Feels slightly bulky but works alright.",
        stars: 4,
        sentiment: "Neutral",
      },
    ],
  },
  {
    id: 7,
    name: "USB-C Hub",
    reviews: [
      { text: "Very useful with my MacBook.", stars: 5, sentiment: "Positive" },
      { text: "Gets hot with extended use.", stars: 4, sentiment: "Negative" },
      {
        text: "Ports stopped working in a month.",
        stars: 4,
        sentiment: "Negative",
      },
      {
        text: "Solid build but flaky connection.",
        stars: 5,
        sentiment: "Negative",
      },
    ],
  },
  {
    id: 8,
    name: "Mechanical Keyboard",
    reviews: [
      { text: "Clicky and responsive keys!", stars: 5, sentiment: "Positive" },
      { text: "Perfect for coding.", stars: 5, sentiment: "Positive" },
      { text: "Loud but satisfying to use.", stars: 4, sentiment: "Positive" },
    ],
  },
  {
    id: 9,
    name: "Gaming Mouse",
    reviews: [
      { text: "Great grip and tracking.", stars: 5, sentiment: "Positive" },
      { text: "RGB looks amazing.", stars: 5, sentiment: "Positive" },
      {
        text: "Improved my aim significantly.",
        stars: 5,
        sentiment: "Positive",
      },
    ],
  },
  {
    id: 10,
    name: "Webcam",
    reviews: [
      {
        text: "Picture quality is bad in low light.",
        stars: 4,
        sentiment: "Negative",
      },
      { text: "Doesn't autofocus well.", stars: 4, sentiment: "Negative" },
      {
        text: "Sound is terrible, use a mic instead.",
        stars: 5,
        sentiment: "Negative",
      },
      { text: "Cheap plastic build.", stars: 5, sentiment: "Negative" },
    ],
  },
];

function calculateScore(reviews: Review[]) {
  const avgStars =
    reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length;
  const avgSentiment =
    reviews.reduce((acc, r) => {
      if (r.sentiment === "Positive") return acc + 1;
      if (r.sentiment === "Neutral") return acc + 0.5;
      return acc;
    }, 0) / reviews.length;

  return ((avgStars / 5) * 0.5 + avgSentiment * 0.5) * 100;
}

function getReviewScore(review: Review) {
  const starScore = review.stars / 5;
  const sentimentScore =
    review.sentiment === "Positive"
      ? 1
      : review.sentiment === "Neutral"
        ? 0.5
        : 0;
  return ((starScore * 0.5 + sentimentScore * 0.5) * 100).toFixed(1);
}

function renderStars(starCount: number) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
          }
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const ranked = dummyProducts
    .map((product) => ({ ...product, score: calculateScore(product.reviews) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top navbar */}
      <div className="bg-gray-900 py-4 px-6 border-b border-gray-800 shadow">
        <h1 className="text-xl font-bold">XXX Co. Dashboard</h1>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="bg-[#121826] rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Product Recommendation Ranking
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.map((product, index) => (
                <>
                  <TableRow
                    key={product.id}
                    className="bg-[#1A202C] hover:bg-[#232B3E]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-semibold text-lg">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right align-middle">
                      {product.score.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => toggleRow(product.id)}
                      >
                        {expandedRows.includes(product.id)
                          ? "Hide Reviews"
                          : "View Reviews"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(product.id) && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="space-y-4 pt-4 pb-6 bg-[#1A1F2E]">
                          {product.reviews.map((review, idx) => (
                            <div key={idx} className="flex">
                              {/* Fake ghost columns to match table structure */}
                              {/* fake product name col */}
                              {/* Real review block aligned with the Score cell */}
                              <div className="flex justify-between items-center bg-[#232B3E] w-full p-4 rounded-l">
                                <div className="text-sm">
                                  <p>
                                    <span className="font-semibold">
                                      Review:
                                    </span>{" "}
                                    {review.text}
                                  </p>
                                  <div className="mt-2 flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400 text-sm font-medium">
                                        Stars:
                                      </span>
                                      {renderStars(review.stars)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-400 text-sm font-medium">
                                        Sentiment:
                                      </span>
                                      <span
                                        className={cn(
                                          "px-2 py-1 rounded-full text-xs font-medium",
                                          review.sentiment === "Positive"
                                            ? "bg-green-700 text-green-200"
                                            : review.sentiment === "Negative"
                                              ? "bg-red-700 text-red-200"
                                              : "bg-gray-700 text-white",
                                        )}
                                      >
                                        {review.sentiment}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-400 self-center whitespace-nowrap">
                                  {" "}
                                  <span className="text-white font-medium">
                                    {getReviewScore(review)}%
                                  </span>
                                </div>
                              </div>
                              {/* fake index col */}
                              <div className="w-1/2 bg-[#232B3E] rounded-r" />{" "}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

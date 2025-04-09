import { useState } from "react";

export default function Home() {
  type SentimentResult = {
    sentiment: string;
    input: string;
  };

  type CategoryResult = {
    category: string;
    subcategory: string;
    title: string;
    description: string;
  };

  type ErrorResult = {
    error: string;
  };

  type ResultType = SentimentResult | CategoryResult | ErrorResult;

  const [sentimentResults, setSentimentResults] = useState<ResultType[]>([]);
  const [categoryResults, setCategoryResults] = useState<ResultType[]>([]);
  const [activeTab, setActiveTab] = useState<"sentiment" | "category">(
    "sentiment",
  );
  const [form, setForm] = useState({ review: "", title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      activeTab === "sentiment" ? "/predict/sentiment" : "/predict/category";

    const payload =
      activeTab === "sentiment"
        ? { text: form.review }
        : {
            product_title: form.title,
            product_description: form.description,
          };

    try {
      const res = await fetch(
        `https://is450-sentiment-analysis-392732146202.asia-southeast1.run.app${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();

      if (activeTab === "sentiment") {
        setSentimentResults((prev) => [
          { ...data, input: form.review },
          ...prev,
        ]);
        setForm({ ...form, review: "" }); // Clear review
      } else {
        setCategoryResults((prev) => [
          {
            ...data,
            title: form.title,
            description: form.description,
          },
          ...prev,
        ]);
        setForm({ ...form, title: "", description: "" }); // Clear title & desc
      }
    } catch (err) {
      const errorResult = { error: "Failed to fetch response." };
      if (activeTab === "sentiment") {
        setSentimentResults((prev) => [errorResult, ...prev]);
      } else {
        setCategoryResults((prev) => [errorResult, ...prev]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">IS450 Demo - API</h1>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-full transition-colors duration-200 ${
            activeTab === "sentiment" ? "bg-white text-black" : "bg-gray-800"
          }`}
          onClick={() => setActiveTab("sentiment")}
        >
          Sentiment
        </button>
        <button
          className={`px-4 py-2 rounded-r-full transition-colors duration-200 ${
            activeTab === "category" ? "bg-white text-black" : "bg-gray-800"
          }`}
          onClick={() => setActiveTab("category")}
        >
          Category
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {activeTab === "sentiment" ? (
          <textarea
            rows={4}
            className="w-full p-4 rounded bg-gray-900 text-white placeholder-gray-400"
            placeholder="Enter review text..."
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            required
          />
        ) : (
          <>
            <input
              className="w-full p-4 rounded bg-gray-900 text-white placeholder-gray-400"
              placeholder="Product Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              rows={3}
              className="w-full p-4 rounded bg-gray-900 text-white placeholder-gray-400"
              placeholder="Product Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div className="mt-12 space-y-6 max-w-xl mx-auto">
        {(activeTab === "sentiment" ? sentimentResults : categoryResults).map(
          (r, idx) => (
            <div
              key={idx}
              className="bg-gray-900 p-4 rounded text-sm border border-gray-700"
            >
              {"error" in r && <p className="text-red-400">{r.error}</p>}

              {"sentiment" in r && (
                <>
                  <p>
                    <strong>Input:</strong> {(r as SentimentResult).input}
                  </p>
                  <p>
                    <strong>Sentiment:</strong>{" "}
                    <span
                      className={
                        r.sentiment === "Positive"
                          ? "text-green-400"
                          : r.sentiment === "Negative"
                            ? "text-red-400"
                            : "text-white"
                      }
                    >
                      {r.sentiment}
                    </span>
                  </p>
                </>
              )}

              {"category" in r && "subcategory" in r && (
                <>
                  <p>
                    <strong>Title:</strong> {(r as CategoryResult).title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {(r as CategoryResult).description}
                  </p>

                  <hr className="my-3 border-gray-700" />

                  <p>
                    <strong>Category:</strong>{" "}
                    <span className="mr-2 inline-block px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-medium border border-gray-600">
                      {r.category}
                    </span>
                    <strong>Subcategory:</strong>{" "}
                    <span className="inline-block px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-medium border border-gray-600">
                      {r.subcategory}
                    </span>
                  </p>
                </>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

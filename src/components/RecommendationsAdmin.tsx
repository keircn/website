"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addRecommendation,
  deleteRecommendation,
  updateRecommendation,
} from "~/app/actions/recommendations";
import type { Recommendation } from "~/db/schema";
import type { MediaLookupResult } from "~/app/api/media-lookup/route";

type RecommendationsAdminProps = {
  initialRecommendations: Recommendation[];
};

export default function RecommendationsAdmin({
  initialRecommendations,
}: RecommendationsAdminProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState(
    initialRecommendations,
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "anime",
    externalId: "",
    title: "",
    recommendation: "",
    coverImage: "",
    sortOrder: 0,
  });

  const handleEdit = (rec: Recommendation) => {
    setEditingId(rec.id);
    setFormData({
      type: rec.type,
      externalId: rec.externalId,
      title: rec.title,
      recommendation: rec.recommendation,
      coverImage: rec.coverImage || "",
      sortOrder: rec.sortOrder,
    });
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setLookupError(null);
    setFormData({
      type: "anime",
      externalId: "",
      title: "",
      recommendation: "",
      coverImage: "",
      sortOrder: 0,
    });
  };

  const handleLookup = async () => {
    if (!formData.externalId.trim()) {
      setLookupError("Please enter an external ID first");
      return;
    }

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(
        `/api/media-lookup?id=${encodeURIComponent(formData.externalId)}&type=${formData.type}`,
      );
      const result: MediaLookupResult = await res.json();

      if (!result.success) {
        setLookupError(result.error || "Failed to fetch media data");
        return;
      }

      if (result.data) {
        setFormData({
          ...formData,
          externalId: result.data.externalId,
          title: result.data.title,
          coverImage: result.data.coverImage || "",
          recommendation: "",
        });
      }
    } catch (error) {
      setLookupError(
        error instanceof Error ? error.message : "Failed to fetch media data",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recommendation?"))
      return;

    setLoading(true);
    const result = await deleteRecommendation(id);

    if (result.success) {
      setRecommendations(recommendations.filter((r) => r.id !== id));
    } else {
      alert(result.error || "Failed to delete recommendation");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      const result = await updateRecommendation(editingId, {
        type: formData.type,
        externalId: formData.externalId,
        title: formData.title,
        recommendation: formData.recommendation,
        coverImage: formData.coverImage || null,
        sortOrder: formData.sortOrder,
      });

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to update recommendation");
      }
    } else {
      const result = await addRecommendation({
        type: formData.type,
        externalId: formData.externalId,
        title: formData.title,
        recommendation: formData.recommendation,
        coverImage: formData.coverImage || null,
        sortOrder: formData.sortOrder,
        metadata: {},
      });

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to add recommendation");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Manage Recommendations
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setLookupError(null);
              setFormData({
                type: "anime",
                externalId: "",
                title: "",
                recommendation: "",
                coverImage: "",
                sortOrder: 0,
              });
            }}
            className="px-4 py-2 rounded-lg bg-fuchsia-300/20 text-fuchsia-300 border border-fuchsia-300/40 hover:bg-fuchsia-300/30 transition-colors text-sm font-medium"
          >
            {showAddForm ? "Cancel" : "Add New"}
          </button>
        </div>

        {(showAddForm || editingId) && (
          <div className="mb-8 p-6 rounded-xl bg-accent/20 border border-border/40">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Recommendation" : "Add Recommendation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium mb-2"
                >
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                  required
                >
                  <option value="anime">Anime</option>
                  <option value="manga">Manga</option>
                  <option value="novel">Light Novel</option>
                  <option value="vn">Visual Novel</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="externalId"
                  className="block text-sm font-medium mb-2"
                >
                  External ID
                </label>
                <div className="flex gap-2">
                  <input
                    id="externalId"
                    type="text"
                    value={formData.externalId}
                    onChange={(e) =>
                      setFormData({ ...formData, externalId: e.target.value })
                    }
                    placeholder="e.g. 21 for AniList or v2002 for VNDB"
                    className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    disabled={lookupLoading || !formData.externalId.trim()}
                    className="px-4 py-2 rounded-lg bg-cyan-400/20 text-cyan-400 border border-cyan-400/40 hover:bg-cyan-400/30 transition-colors disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                  >
                    {lookupLoading ? "Looking up..." : "Lookup"}
                  </button>
                </div>
                {lookupError && (
                  <p className="text-red-400 text-sm mt-2">{lookupError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="coverImage"
                  className="block text-sm font-medium mb-2"
                >
                  Cover Image URL
                </label>
                <input
                  id="coverImage"
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                />
              </div>

              <div>
                <label
                  htmlFor="recommendation"
                  className="block text-sm font-medium mb-2"
                >
                  Recommendation
                </label>
                <textarea
                  id="recommendation"
                  value={formData.recommendation}
                  onChange={(e) =>
                    setFormData({ ...formData, recommendation: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium mb-2"
                >
                  Sort Order
                </label>
                <input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: Number.parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-fuchsia-300/20 text-fuchsia-300 border border-fuchsia-300/40 hover:bg-fuchsia-300/30 transition-colors disabled:opacity-50 font-medium"
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Recommendation"
                    : "Add Recommendation"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full px-4 py-2 rounded-lg bg-accent/20 text-muted-foreground border border-border/40 hover:border-red-400/40 hover:text-red-400 transition-colors text-sm"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        )}

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-accent/20 border border-border/40 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-300/10 text-fuchsia-300 border border-fuchsia-300/20">
                    {rec.type}
                  </span>
                  <h3 className="font-semibold">{rec.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {rec.recommendation}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(rec)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-fuchsia-300/10 text-fuchsia-300 border border-fuchsia-300/20 hover:bg-fuchsia-300/20 transition-colors disabled:opacity-50 text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(rec.id)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-50 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

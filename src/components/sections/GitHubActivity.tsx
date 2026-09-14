"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ExternalLink, GitCommit, Calendar, Flame } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";
import { sound } from "@/lib/sound";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsData {
  total: {
    [key: string]: number;
  };
  contributions: ContributionDay[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function GitHubActivity() {
  const [selectedYear, setSelectedYear] = useState<string>("last");
  const [data, setData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/github-contributions?year=${selectedYear}&username=${RESUME_DATA.githubHandle}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((resData) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading GitHub contributions:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Transform flat list of days into week columns (Sun-Sat)
  const { weeks, monthLabels, totalContributions } = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) {
      return { weeks: [], monthLabels: [], totalContributions: 0 };
    }

    const weeksArr: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // First day
    const [firstY, firstM, firstD] = data.contributions[0].date.split("-").map(Number);
    const firstDateObj = new Date(Date.UTC(firstY, firstM - 1, firstD));
    const startDay = firstDateObj.getUTCDay(); // 0 = Sun

    // Pad beginning of first week
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    for (const item of data.contributions) {
      currentWeek.push(item);
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad end of last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArr.push(currentWeek);
    }

    // Determine month labels placed above week columns
    let lastMonth = -1;
    const labels = weeksArr.map((week) => {
      const firstValidDay = week.find((d) => d !== null);
      if (!firstValidDay) return "";
      const [, mStr] = firstValidDay.date.split("-");
      const monthIdx = parseInt(mStr, 10) - 1;
      if (monthIdx !== lastMonth) {
        lastMonth = monthIdx;
        return MONTH_NAMES[monthIdx];
      }
      return "";
    });

    const total =
      selectedYear === "last"
        ? data.total?.lastYear ?? 481
        : data.total?.[selectedYear] ?? 0;

    return { weeks: weeksArr, monthLabels: labels, totalContributions: total };
  }, [data, selectedYear]);

  const handleYearChange = (year: string) => {
    sound.play("tick");
    setSelectedYear(year);
  };

  // Level color mapping
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-[#9be9a8] dark:bg-[#0e4429]";
      case 2:
        return "bg-[#40c463] dark:bg-[#006d32]";
      case 3:
        return "bg-[#30a14e] dark:bg-[#26a641]";
      case 4:
        return "bg-[#216e39] dark:bg-[#39d353]";
      default:
        return "bg-[#ebedf0] dark:bg-[#161b22]";
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <section id="activity" className="py-14 border-t border-gray-200 dark:border-gray-800">
      {/* Section Header */}
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-pixel text-sm text-gray-400 dark:text-gray-500">
          04 — activity &amp; open source
        </h2>
        <a
          href={RESUME_DATA.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-wider text-gray-400 hover:text-ink dark:hover:text-white transition-colors flex items-center gap-1"
        >
          <span>github.com/{RESUME_DATA.githubHandle}</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Main Graph Card */}
      <div className="group relative rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50/70 to-white p-5 sm:p-6 shadow-bryl-card transition-all duration-300 dark:border-gray-800 dark:from-[#131317] dark:to-[#0d0d10]">
        {/* Inset hairline frame border */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[5px] rounded-xl border border-gray-200/70 dark:border-gray-800/80"
        />

        {/* Card Header & Year Filter Controls */}
        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <GitCommit size={18} className="text-ink dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-base sm:text-lg text-ink dark:text-white">
                  {totalContributions} contributions
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <Flame size={10} /> Active
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                {selectedYear === "last"
                  ? "Recorded in the last year"
                  : `Recorded during ${selectedYear}`}
              </p>
            </div>
          </div>

          {/* Year selector tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1 font-mono text-[11px] shadow-sm dark:border-gray-800 dark:bg-[#18181c]">
            {[
              { id: "last", label: "Last Year" },
              { id: "2026", label: "2026" },
              { id: "2025", label: "2025" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleYearChange(tab.id)}
                className={`rounded-lg px-3 py-1 text-[11px] transition-all ${
                  selectedYear === tab.id
                    ? "bg-ink font-semibold text-white shadow-sm dark:bg-white dark:text-black"
                    : "text-gray-500 hover:text-ink dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Area */}
        <div className="relative">
          {loading ? (
            <div className="flex h-36 items-center justify-center font-mono text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-ping rounded-full bg-gray-400" />
                <span>Loading GitHub activity heatmap...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="min-w-[720px]">
                {/* Month labels header */}
                <div className="mb-2 flex pl-8">
                  {weeks.map((_, wIdx) => (
                    <div
                      key={wIdx}
                      className="w-3 shrink-0 text-left font-mono text-[10px] text-gray-400"
                      style={{ marginRight: "3px" }}
                    >
                      {monthLabels[wIdx] || ""}
                    </div>
                  ))}
                </div>

                {/* Grid row by row */}
                <div className="flex items-start">
                  {/* Days of week labels (Mon, Wed, Fri) */}
                  <div className="flex w-8 shrink-0 flex-col gap-[3px] font-mono text-[9px] text-gray-400">
                    <span className="h-3" /> {/* Sun */}
                    <span className="h-3 leading-3">Mon</span>
                    <span className="h-3" /> {/* Tue */}
                    <span className="h-3 leading-3">Wed</span>
                    <span className="h-3" /> {/* Thu */}
                    <span className="h-3 leading-3">Fri</span>
                    <span className="h-3" /> {/* Sat */}
                  </div>

                  {/* Week columns */}
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dIdx) => {
                          if (!day) {
                            return (
                              <div
                                key={dIdx}
                                className="h-3 w-3 rounded-[2.5px] opacity-0"
                              />
                            );
                          }

                          return (
                            <div
                              key={day.date}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredDay({
                                  date: day.date,
                                  count: day.count,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                });
                              }}
                              onMouseLeave={() => setHoveredDay(null)}
                              className={`h-3 w-3 rounded-[2.5px] transition-all hover:scale-125 hover:ring-1 hover:ring-ink dark:hover:ring-white ${getLevelColor(
                                day.level
                              )} cursor-pointer`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Legend & Direct Profile Link */}
        <div className="relative mt-4 flex flex-col gap-3 pt-3 border-t border-gray-200/60 dark:border-gray-800/70 sm:flex-row sm:items-center sm:justify-between font-mono text-[10px] text-gray-400">
          <a
            href={RESUME_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-ink dark:hover:text-white transition-colors"
          >
            <Calendar size={11} />
            <span>Contributions verified from public GitHub repositories</span>
          </a>

          {/* Less -> More Legend */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span>Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-2.5 w-2.5 rounded-[2px] ${getLevelColor(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Tooltip */}
      {hoveredDay && (
        <div
          className="pointer-events-none fixed z-[300] -translate-x-1/2 -translate-y-full rounded-lg bg-ink px-2.5 py-1.5 font-mono text-[11px] text-white shadow-xl dark:bg-white dark:text-black mb-2"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 6}px`,
          }}
        >
          <p className="font-semibold leading-none">
            {hoveredDay.count === 0
              ? "No contributions"
              : `${hoveredDay.count} contribution${
                  hoveredDay.count === 1 ? "" : "s"
                }`}
          </p>
          <p className="mt-0.5 text-[9.5px] opacity-75 leading-none">
            {formatDate(hoveredDay.date)}
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { actionError, isSessionFailure } from "@/lib/admin-errors";
import type { AnalyticsDto, AnalyticsRange, AnalyticsQuery } from "@/types/backend";

type Props = { dict: Dictionary; fetchAnalytics: (query: AnalyticsQuery) => Promise<AnalyticsDto>; onSessionExpired: () => void };
const ranges: AnalyticsRange[] = ["today", "yesterday", "7d", "30d", "this-month", "previous-month", "custom"];
const date = (value: Date) => value.toISOString().slice(0, 10);
function queryFor(range: AnalyticsRange): AnalyticsQuery {
  const now = new Date(); const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (range === "today") return { from: date(today), to: date(today) };
  if (range === "yesterday") { const d = new Date(today); d.setUTCDate(d.getUTCDate() - 1); return { from: date(d), to: date(d) }; }
  if (range === "7d" || range === "30d") { const d = new Date(today); d.setUTCDate(d.getUTCDate() - (range === "7d" ? 6 : 29)); return { from: date(d), to: date(today) }; }
  if (range === "this-month") return { from: date(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))), to: date(today) };
  if (range === "previous-month") return { from: date(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1))), to: date(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0))) };
  return {};
}
const money = (n: number) => `${n.toFixed(2)} DT`;
function change(metric: { changePercent: number | null; trend: string }) { return metric.changePercent === null ? "—" : `${metric.changePercent >= 0 ? "+" : ""}${metric.changePercent.toFixed(1)}%`; }

export function InsightsDashboard({ dict, fetchAnalytics, onSessionExpired }: Props) {
  const d = dict.admin.insights; const [range, setRange] = useState<AnalyticsRange>("7d"); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [data, setData] = useState<AnalyticsDto | null>(null); const [state, setState] = useState<"loading" | "ready" | "error">("loading"); const [error, setError] = useState("");
  const query = useMemo(() => range === "custom" ? { from: from || undefined, to: to || undefined } : queryFor(range), [range, from, to]);
  const load = useCallback(async () => { setState("loading"); setError(""); try { setData(await fetchAnalytics(query)); setState("ready"); } catch (e) { if (isSessionFailure(e)) { onSessionExpired(); return; } setError(actionError(dict, e)); setState("error"); } }, [dict, fetchAnalytics, onSessionExpired, query]);
  useEffect(() => { if (range !== "custom") { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); } }, [load, range]);
  const labels: Record<AnalyticsRange, string> = { today: d.today, yesterday: d.yesterday, "7d": d.last7, "30d": d.last30, "this-month": d.thisMonth, "previous-month": d.previousMonth, custom: d.custom };
  return <section className="insights" aria-labelledby="insights-title">
    <div className="admin-head"><div className="admin-head__text"><h1 id="insights-title" className="admin-head__title">{d.title}</h1><p className="admin-head__hint">{d.hint}</p></div></div>
    <div className="insights-filters"><label className="admin-field"><span className="admin-field__label">{d.range}</span><select className="admin-field__input" value={range} onChange={(e) => setRange(e.target.value as AnalyticsRange)}>{ranges.map((r) => <option key={r} value={r}>{labels[r]}</option>)}</select></label>{range === "custom" ? <><label className="admin-field"><span className="admin-field__label">{d.from}</span><input className="admin-field__input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label><label className="admin-field"><span className="admin-field__label">{d.to}</span><input className="admin-field__input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label><button className="admin-btn admin-btn--primary" type="button" disabled={!from || !to} onClick={() => void load()}>{d.apply}</button></> : null}</div>
    {state === "loading" ? <div className="insights-skeleton" aria-busy="true"><span /><span /><span /><span /></div> : null}
    {state === "error" ? <div className="admin-notice"><h2 className="admin-notice__title">{d.errorTitle}</h2><p className="admin-notice__text">{error}</p><button className="admin-notice__action" type="button" onClick={() => void load()}>{d.retry}</button></div> : null}
    {state === "ready" && data ? <Dashboard data={data} d={d} /> : null}
  </section>;
}

function Dashboard({ data, d }: { data: AnalyticsDto; d: Dictionary["admin"]["insights"] }) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const hasData = data.kpis.totalOrders.current > 0;
  if (!hasData) return <div className="admin-notice"><h2 className="admin-notice__title">{d.emptyTitle}</h2><p className="admin-notice__text">{d.emptyMessage}</p></div>;
  const cards: Array<[string, string, import("@/types/backend").InsightComparison]> = [[d.revenue, money(data.kpis.confirmedRevenue.current), data.kpis.confirmedRevenue], [d.orders, String(data.kpis.totalOrders.current), data.kpis.totalOrders], [d.confirmedOrders, String(data.kpis.confirmedOrders.current), data.kpis.confirmedOrders], [d.averageOrder, money(data.kpis.averageConfirmedOrderValue.current), data.kpis.averageConfirmedOrderValue], [d.itemsSold, String(data.kpis.itemsSold.current), data.kpis.itemsSold]];
  return <><div className="insights-kpis">{cards.map(([label, value, comparison]) => <article className="insights-kpi" key={String(label)}><span>{label}</span><strong>{String(value)}</strong><small className={comparison.trend === "down" ? "is-negative" : "is-positive"}>{change(comparison)}</small></article>)}</div><div className="insights-grid"><article className="insights-card insights-card--wide"><h2>{d.trend}</h2><div className="insights-filters"><button className="admin-btn" type="button" onClick={() => setMetric("revenue")}>{d.revenue}</button><button className="admin-btn" type="button" onClick={() => setMetric("orders")}>{d.orders}</button></div><Chart title="" points={data.revenueTrend.map((p) => ({ label: p.bucket, value: metric === "revenue" ? p.revenue : p.orders }))} /></article><Rank title={d.topItems} values={data.topItems.map((i) => ({ name: i.name, value: i.quantitySold, detail: money(i.revenue) }))} /><Rank title={d.peakHours} values={data.peakHours.map((i) => ({ name: `${String(i.hour).padStart(2, "0")}h`, value: i.orders, detail: `${i.orders}` }))} /><Rank title={d.statuses} values={data.statuses.map((i) => ({ name: i.status, value: i.count, detail: `${i.percentage.toFixed(1)}%` }))} /><article className="insights-card"><h2>{d.availability}</h2><p>{data.availability.availableItems} {d.available} · {data.availability.unavailableItems} {d.unavailable}</p></article><article className="insights-card insights-card--wide"><h2>{d.actionable}</h2><ul className="insights-actions">{data.insights.map((i) => <li key={i.id}>{i.message}</li>)}</ul></article></div></>;
}
function Chart({ title, points }: { title: string; points: Array<{ label: string; value: number }> }) { const max = Math.max(...points.map((p) => p.value), 1); return <article className="insights-card insights-card--wide"><h2>{title}</h2><div className="insights-bars">{points.map((p) => <div className="insights-bars__item" key={p.label}><span className="insights-bars__bar" style={{ height: `${Math.max(8, p.value / max * 100)}%` }} /><span className="insights-bars__label">{p.label.slice(5, 10)}</span></div>)}</div></article>; }
function Rank({ title, values }: { title: string; values: Array<{ name: string; value: number; detail: string }> }) { const max = Math.max(...values.map((v) => v.value), 1); return <article className="insights-card"><h2>{title}</h2><ol className="insights-ranking">{values.slice(0, 5).map((v) => <li key={v.name}><span>{v.name}</span><i><b style={{ width: `${v.value / max * 100}%` }} /></i><strong>{v.detail}</strong></li>)}</ol></article>; }

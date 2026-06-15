"use client";

import { DAYS } from "@/lib/planner/model";
import { toMin } from "@/lib/planner/time";
import type { WeekBlock } from "@/lib/planner/types";

export interface LegendEntry {
  abbr: string;
  nombre: string;
  color: string;
}

// Port de renderWeek(): grilla semanal con bloques posicionados.
export default function WeekGrid({
  blocks,
  days = DAYS,
  compact = false,
}: {
  blocks: WeekBlock[];
  days?: string[];
  compact?: boolean;
}) {
  const PX = compact ? 0.5 : 0.86;
  let minM = 8 * 60;
  let maxM = 22 * 60;
  blocks.forEach((b) => {
    minM = Math.min(minM, toMin(b.desde));
    maxM = Math.max(maxM, toMin(b.hasta));
  });
  minM = Math.floor(minM / 60) * 60;
  maxM = Math.ceil(maxM / 60) * 60;
  const colTpl = `${compact ? 40 : 54}px repeat(${days.length}, 1fr)`;

  const hours: number[] = [];
  for (let t = minM; t < maxM; t += 60) hours.push(t);

  return (
    <>
      <div className="gtable" style={{ gridTemplateColumns: colTpl }}>
        <div className="ghead" />
        {days.map((d) => (
          <div className="ghead" key={d}>
            {d.slice(0, 3)}
          </div>
        ))}
      </div>
      <div className="gtable" style={{ gridTemplateColumns: colTpl }}>
        <div style={{ position: "relative" }}>
          {hours.map((t) => (
            <div className="gtime" style={{ height: 60 * PX }} key={t}>
              {String(t / 60).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {days.map((day) => {
          const dayB = blocks.filter((b) => b.dia === day);
          return (
            <div className="gcol" key={day}>
              {hours.map((t) => (
                <div className="gcell" style={{ height: 60 * PX }} key={t} />
              ))}
              <div style={{ position: "absolute", inset: 0 }}>
                {dayB.map((b, i) => {
                  const top = (toMin(b.desde) - minM) * PX;
                  const h = (toMin(b.hasta) - toMin(b.desde)) * PX;
                  return (
                    <div
                      key={i}
                      className={`gblock${b.conf ? " conf" : ""}`}
                      style={{ top, height: h, background: b.color }}
                      title={`${b.nombre} · ${b.modalidad || ""} ${b.sala || ""}`}
                    >
                      <b>
                        {b.abbr}
                        {b.sala ? " " + b.sala : ""}
                      </b>
                      {!compact && b.nombre && (
                        <span className="gb-n">{b.nombre}</span>
                      )}
                      <span className="gb-h">
                        {b.desde}–{b.hasta}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function Legend({ entries }: { entries: LegendEntry[] }) {
  return (
    <div className="legend">
      {entries.map((e, i) => (
        <div className="lg" key={i}>
          <span className="sw" style={{ background: e.color }} />
          <b>{e.abbr}</b>
          <span>{e.nombre}</span>
        </div>
      ))}
    </div>
  );
}

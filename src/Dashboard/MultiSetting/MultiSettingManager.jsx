import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiEdit2, FiSave, FiX, FiCopy } from "react-icons/fi";

export default function MultiSettingManager({ settings = [], updateSettings, onClose }) {
  const [local, setLocal] = useState([]); // local copy for immediate edits
  const [editingIndex, setEditingIndex] = useState(null); // index in local array currently editing
  const [editValues, setEditValues] = useState({
    startTime: "",
    feedLevel: "",
    dispatch: 250,
    timeGap: 180,
  });

  // sync incoming settings -> local copy
  useEffect(() => {
    if (!Array.isArray(settings)) {
      setLocal([]);
      return;
    }
    // defensive normalization
    const normalized = settings.map((s, i) => ({
      id: s.id ?? i + 1,
      label: s.label ?? `Setting ${i + 1}`,
      startTime: s.startTime ?? s.value ?? "",
      // keep 0, turn numbers into strings, fallback to ""
      feedLevel: s.feedLevel != null ? String(s.feedLevel) : "",
      dispatch: s.dispatch ?? 250,
      timeGap: s.timeGap ?? 180,
      feedDuration: s.feedDuration ?? s.duration ?? "",
      raw: s,
    }));

    setLocal(normalized);
    setEditingIndex(null);
  }, [settings]);

  // helper: reindex (keep parent ids sequential)
  const reindex = (arr) =>
    arr.map((s, i) => ({ ...s, id: i + 1, label: s.label ?? `Setting ${i + 1}` }));

  // helper: compute cycles, total run, end time
  const computeRowInfo = (s) => {
    const feed = Number(s.feedLevel || 0);
    const dispatch = Number(s.dispatch || 250);
    const gap = Number(s.timeGap || 180);

    let cycles = 0;
    let totalSeconds = 0;
    let totalText = "0h 0m";
    let endTime = "-";

    if (feed > 0 && dispatch > 0 && gap > 0) {
      cycles = Math.floor((feed * 1000) / dispatch);
      totalSeconds = cycles * gap;

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      totalText = `${hours}h ${minutes}m`;

      if (s.startTime) {
        const [hStr, mStr] = s.startTime.split(":");
        const startH = Number(hStr) || 0;
        const startM = Number(mStr) || 0;
        const startTotalMin = startH * 60 + startM;
        const extraMin = Math.round(totalSeconds / 60);
        const endTotalMin = startTotalMin + extraMin;
        const endH = Math.floor((endTotalMin / 60) % 24);
        const endM = endTotalMin % 60;
        endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
      }
    }

    return { cycles, totalText, endTime };
  };

  // remove
  const removeAt = (index) => {
    const ok = window.confirm("Remove this saved setting?");
    if (!ok) return;
    const updated = local.filter((_, i) => i !== index);
    setLocal(updated);
    if (typeof updateSettings === "function") updateSettings(reindex(updated));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  // start edit
  const startEdit = (index) => {
    const s = local[index];
    setEditValues({
      startTime: s.startTime ?? "",
      feedLevel: s.feedLevel ?? "",
      dispatch: s.dispatch ?? 250,
      timeGap: s.timeGap ?? 180,
    });
    setEditingIndex(index);
  };

  // cancel edit
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValues({ startTime: "", feedLevel: "", dispatch: 250, timeGap: 180 });
  };

  // save edit
  const saveEdit = (index) => {
    const updated = [...local];
    updated[index] = {
      ...updated[index],
      startTime: editValues.startTime,
      feedLevel: editValues.feedLevel,
      dispatch: Number(editValues.dispatch),
      timeGap: Number(editValues.timeGap),
    };
    setLocal(updated);
    setEditingIndex(null);
    setEditValues({ startTime: "", feedLevel: "", dispatch: 250, timeGap: 180 });
    if (typeof updateSettings === "function") updateSettings(reindex(updated));
  };

  // payload preview (same format as Dashboard.buildMultiPayloadString)
  const toHHMMNoColon = (t) => (t ? t.toString().replace(":", "").padStart(4, "0") : "0000");

  const payloadPreview = useMemo(() => {
    if (!local || local.length === 0) return "";
    const as1 = local.map((s) => toHHMMNoColon(s.startTime)).join(":");
    const as2 = local
      .map((s) => String(Math.round(Number(s.feedLevel || 0))).padStart(4, "0"))
      .join(":");
    const as3 = local.map(() => "0000").join(":"); // you can upgrade this later to real total-time if needed
    const as4 = local
      .map((s) => String(Number(s.timeGap || 180)).padStart(4, "0"))
      .join(":");
    const as9 = local
      .map((s) => String(Number(s.dispatch || 250)).padStart(4, "0"))
      .join(":");
    const as10 = local
      .map((s) => {
        const cycles = Math.floor(
          (Number(s.feedLevel || 0) * 1000) / Number(s.dispatch || 250)
        );
        return String(cycles).padStart(4, "0");
      })
      .join(":");
    return `c0=212&as1=${as1}&as2=${as2}&as3=${as3}&as4=${as4}&as9=${as9}&as10=${as10}`;
  }, [local]);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payloadPreview);
      alert("Payload copied to clipboard");
    } catch (e) {
      console.error(e);
      alert("Copy failed — please select & copy manually.");
    }
  };

  return (
    <div className="p-4 w-full flex justify-center">
      <div className="w-full max-w-5xl p-6 bg-white rounded-2xl shadow-lg border">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Multi Settings</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof updateSettings === "function") updateSettings(reindex(local));
                if (onClose) onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>

        {/* desktop table header */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-xs text-gray-500 border-b pb-2 mb-3">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Start</div>
          <div className="col-span-2">Feed (KG)</div>
          <div className="col-span-2">Dispatch (g)</div>
          <div className="col-span-2">Gap (s)</div>
          <div className="col-span-2 text-right">End / Run / Cycles / Actions</div>
        </div>

        {/* settings list */}
        <div className="space-y-3">
          <AnimatePresence>
            {local.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-500"
              >
                No saved settings.
              </motion.div>
            )}

            {local.map((s, idx) => {
              const isEditing = editingIndex === idx;
              const { cycles, totalText, endTime } = computeRowInfo(s);

              return (
                <motion.div
                  key={s.id ?? idx}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="p-3 bg-slate-50 border rounded-lg"
                >
                  {/* mobile stacked view */}
                  <div className="md:hidden flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-gray-500">#{s.id}</div>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="time"
                              value={editValues.startTime}
                              onChange={(e) =>
                                setEditValues((p) => ({ ...p, startTime: e.target.value }))
                              }
                              className="px-2 py-1 border rounded w-28"
                            />
                            <input
                              type="number"
                              value={editValues.feedLevel}
                              onChange={(e) =>
                                setEditValues((p) => ({ ...p, feedLevel: e.target.value }))
                              }
                              placeholder="Feed"
                              className="px-2 py-1 border rounded w-24"
                            />
                            <input
                              type="number"
                              value={editValues.dispatch}
                              onChange={(e) =>
                                setEditValues((p) => ({ ...p, dispatch: e.target.value }))
                              }
                              placeholder="Dispatch"
                              className="px-2 py-1 border rounded w-24"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editValues.timeGap}
                              onChange={(e) =>
                                setEditValues((p) => ({ ...p, timeGap: e.target.value }))
                              }
                              placeholder="Gap"
                              className="px-2 py-1 border rounded w-24"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>End: {endTime}</span>
                            <span>• Run: {totalText}</span>
                            <span>• Cycles: {cycles || 0}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEdit(idx)}
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              <FiSave className="inline" /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-200 rounded"
                            >
                              <FiX className="inline" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-700 space-y-1">
                          <div>
                            {s.startTime || "-"} • {s.feedLevel || "-"} kg
                          </div>
                          <div className="text-gray-500">
                            {s.dispatch || 250} g • {s.timeGap || 180}s
                          </div>
                          <div className="text-gray-600">
                            End: {endTime} • Run: {totalText} • Cycles: {cycles || 0}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2">
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(idx)}
                          className="px-2 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                      )}
                      <button
                        onClick={() => removeAt(idx)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Remove"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* desktop row */}
                  <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2">
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-xs text-gray-500">#{s.id}</div>
                    </div>

                    <div className="col-span-2">
                      {isEditing ? (
                        <input
                          type="time"
                          value={editValues.startTime}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, startTime: e.target.value }))
                          }
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <div className="text-sm">{s.startTime || "-"}</div>
                      )}
                    </div>

                    <div className="col-span-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.feedLevel}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, feedLevel: e.target.value }))
                          }
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <div className="text-sm">
                          {s.feedLevel || "-"}{" "}
                          <span className="text-xs text-gray-500">KG</span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.dispatch}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, dispatch: e.target.value }))
                          }
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <div className="text-sm">
                          {s.dispatch || 250}{" "}
                          <span className="text-xs text-gray-500">g</span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.timeGap}
                          onChange={(e) =>
                            setEditValues((p) => ({ ...p, timeGap: e.target.value }))
                          }
                          className="px-2 py-1 border rounded w-full"
                        />
                      ) : (
                        <div className="text-sm">
                          {s.timeGap || 180}{" "}
                          <span className="text-xs text-gray-500">s</span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 text-right text-xs text-gray-700">
                      <div>
                        End: <span className="font-medium">{endTime}</span>
                      </div>
                      <div>
                        Run: <span className="font-medium">{totalText}</span>
                      </div>
                      <div>
                        Cycles: <span className="font-medium">{cycles || 0}</span>
                      </div>

                      {/* Desktop action buttons */}
                      <div className="mt-2 flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(idx)}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              title="Save"
                            >
                              <FiSave />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* <button
                              onClick={() => startEdit(idx)}
                              className="px-2 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button> */}
                            <button
                              onClick={() => removeAt(idx)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              title="Remove"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* payload preview */}
        <div className="mt-4 p-3 bg-slate-50 border rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-600 mb-2">
                Payload preview (what will be sent to controller):
              </div>
              <pre className="whitespace-pre-wrap bg-white p-3 rounded border text-xs text-gray-800 min-h-[44px]">
                {payloadPreview || "— no settings —"}
              </pre>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <button
                onClick={copyPayload}
                disabled={!payloadPreview}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              >
                <FiCopy /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

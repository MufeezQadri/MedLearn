import { useState } from "react";
import { Card } from "../components/ui/card";

export const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [plannerSuggestions, setPlannerSuggestions] = useState(true);

  return (
    <Card>
      <h2 className="font-headline text-3xl font-extrabold">Settings</h2>
      <div className="mt-6 space-y-4">
        <label className="flex items-center justify-between rounded-3xl bg-surface-container-low p-5">
          <div>
            <p className="font-semibold">Push notifications</p>
            <p className="text-sm text-on-surface-variant">Quiz reminders, planner alerts, and AI nudges.</p>
          </div>
          <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled((current) => !current)} />
        </label>
        <label className="flex items-center justify-between rounded-3xl bg-surface-container-low p-5">
          <div>
            <p className="font-semibold">AI planner suggestions</p>
            <p className="text-sm text-on-surface-variant">Allow the planner to auto-schedule weak-topic sessions.</p>
          </div>
          <input type="checkbox" checked={plannerSuggestions} onChange={() => setPlannerSuggestions((current) => !current)} />
        </label>
      </div>
    </Card>
  );
};

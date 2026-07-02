import {
  BarChart3,
  Bot,
  Brain,
  FileText,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const aiSettings = [
  {
    title: "AI Financial Insights",
    description: "Analyze event performance and suggest next actions.",
    enabled: true,
    icon: BarChart3,
  },
  {
    title: "Smart Reminder Suggestions",
    description: "Recommend who to remind and when to send reminders.",
    enabled: true,
    icon: Lightbulb,
  },
  {
    title: "Automatic Report Insights",
    description: "Summarize reports and highlight important financial trends.",
    enabled: true,
    icon: FileText,
  },
  {
    title: "AI Campaign Coach",
    description: "Suggest better sharing times and channels.",
    enabled: true,
    icon: Brain,
  },
];

function SettingsAI() {
  return (
    <section className="settings-panel ai-settings-panel">
      <div className="settings-panel-heading">
        <div>
          <span>AI Assistant</span>
          <h3>Smart financial recommendations</h3>
        </div>

        <Bot size={22} />
      </div>

      <div className="ai-settings-hero">
        <div>
          <span>
            <Sparkles size={15} />
            AI is active
          </span>

          <h4>Contriba AI helps you collect more money.</h4>

          <p>
            AI suggestions analyze contributors, visitors, payments, sharing
            times and campaign performance to recommend your best next action.
          </p>
        </div>

        <strong>96%</strong>
      </div>

      <div className="settings-toggle-list">
        {aiSettings.map((item) => {
          const Icon = item.icon;

          return (
            <div className="settings-toggle-card" key={item.title}>
              <div className="settings-toggle-left">
                <div className="settings-option-icon">
                  <Icon size={18} />
                </div>

                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>

              <button
                type="button"
                className={`settings-switch ${item.enabled ? "active" : ""}`}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SettingsAI;
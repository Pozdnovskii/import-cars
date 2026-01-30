import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./src/sanity/schemaTypes";
import type { DocumentActionComponent } from "sanity";

const DeployAction: DocumentActionComponent = (props) => {
  return {
    label: "🚀 Deploy",
    tone: "primary",
    onHandle: async () => {
      if (confirm("Deploy website to production?")) {
        try {
          const response = await fetch("/api/sanity-deploy", {
            method: "POST",
          });

          const data = await response.json();

          if (response.ok) {
            alert(
              "✅ Deploy started! Your changes will be live in ~2 minutes."
            );
          } else {
            throw new Error(data.error || "Deploy failed");
          }
        } catch (error) {
          alert(
            "❌ Deploy failed: " +
              (error instanceof Error ? error.message : "Unknown error")
          );
        }
      }
    },
  };
};

export default defineConfig({
  projectId: "ecxzhw3v",
  dataset: "production",

  plugins: [structureTool()],

  schema,

  document: {
    actions: (prev, context) => [...prev, DeployAction],
  },
});

// app/workflow-logs/page.tsx
import dynamic from "next/dynamic";
import WorkflowLogsClient from "./_client/WorkflowLogsClient";
// const WorkflowLogsClient = dynamic(() => import("./_client/WorkflowLogsClient"), {
//   ssr: false,
// });

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Workflow Logs</h1>
      <WorkflowLogsClient />
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/admin/projects/$projectId/phases/$phaseId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/projects/$projectId/phases/$phaseId/"!</div>
}

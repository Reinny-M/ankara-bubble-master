import { DashboardSkeleton } from "./DashboardSkeleton"

interface DashboardLoadingProps {
  role: "client" | "tailor" | "admin"
}

export function DashboardLoading({ role }: DashboardLoadingProps) {
  return <DashboardSkeleton role={role} />
}

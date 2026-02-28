import type { SelectOption } from "@/components/FormSelect";

export const COLOR_PALETTE = [
  "bg-blue-500",
  "bg-teal-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-cyan-500",
];

export const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: "SOFTWARE", label: "Software" },
  { value: "CONSTRUCTION", label: "Construction" },
];

export const ORDER_BY_OPTIONS: SelectOption[] = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

export const STATUS_OPTION: SelectOption[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const USER_STATUS_OPTION: SelectOption[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export const PROJECT_TYPE_OPTION: SelectOption[] = [
  { label: "Software", value: "SOFTWARE" },
  { label: "Construction", value: "CONSTRUCTION" },
  { label: "Custom", value: "CUSTOM" },
];

export const PROJECT_STATUS_OPTION: SelectOption[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Draft", value: "DRAFT" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Archived", value: "ARCHIVED" },
];

export const PHASE_STATUS_OPTION: SelectOption[] = [
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
];

export const TASK_GROUP_OPTION: SelectOption[] = [
  { label: "Owner", value: "OWNER" },
  { label: "Editor", value: "EDITOR" },
  { label: "Viewer", value: "VIEWER" },
];

// ==================================================================

export const STATUS_OPTIONS_ALL: SelectOption[] = [
  { label: "All Statuses", value: "ALL" },
  ...STATUS_OPTION,
];

export const USER_STATUS_OPTIONS_ALL: SelectOption[] = [
  { label: "All Statuses", value: "ALL" },
  ...USER_STATUS_OPTION,
];

export const PROJECT_TYPE_OPTIONS_ALL: SelectOption[] = [
  { label: "All Types", value: "ALL" },
  ...PROJECT_TYPE_OPTION,
];

export const PROJECT_STATUS_OPTIONS_ALL: SelectOption[] = [
  { label: "All Statuses", value: "ALL" },
  ...PROJECT_STATUS_OPTION,
];

export const PHASE_STATUS_OPTIONS_ALL: SelectOption[] = [
  { label: "All Statuses", value: "ALL" },
  ...PHASE_STATUS_OPTION,
];

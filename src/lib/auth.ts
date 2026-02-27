// import { useAuthStore } from "@/stores/auth";
// import { PERMISSIONS } from "@/constants/permissions";

// export const hasPermission = (permission: string): boolean => {
//   const { user, permissions } = useAuthStore.getState();

//   return permissions.includes(permission);
// };

// const ROUTE_PERMISSION_MAP: Record<string, string> = {
//   "/admin/users": PERMISSIONS.USER.READ,
//   "/admin/corporates": PERMISSIONS.CORPORATE.READ,
// };

// export const canAccessRoute = (pathname: string): boolean => {
//   const requiredPermissionKey = Object.keys(ROUTE_PERMISSION_MAP).find(
//     (route) => pathname.startsWith(route),
//   );

//   if (!requiredPermissionKey) {
//     return true;
//   }

//   const requiredPermission = ROUTE_PERMISSION_MAP[requiredPermissionKey];

//   return hasPermission(requiredPermission);
// };

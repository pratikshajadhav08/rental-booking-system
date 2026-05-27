export const getDashboardPath = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "host") return "/host/dashboard";
  return "/";
};

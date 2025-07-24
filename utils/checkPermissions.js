// utils/checkPermissions.js
export default function checkPermissions(member) {
  const allowedRoleIds = process.env.ALLOWED_ROLE_IDS?.split(',') ?? [];
  return member.roles.cache.some(role => allowedRoleIds.includes(role.id));
}

export default (invalidRoleIDs) => (req, res, next) => {
  if (invalidRoleIDs.includes(req.user.user_role_id)) {
    return res
      .json({ message: "Access denied" });
  }
  return next();
};

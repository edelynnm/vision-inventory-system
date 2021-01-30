export default (validRoleIDs) => (req, res, next) => {
  if (!validRoleIDs.includes(req.user.role_id)) {
    return res
      .json({ message: "Access denied" });
  }
  return next();
};

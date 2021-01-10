export default (validRoleIDs) => (req, res, next) => {
  if (!validRoleIDs.includes(req.user.user_role_id)) {
    return res
      .json({ message: "Access denied" });
  }
  return next();
};

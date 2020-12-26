export default (invalidRoleIDs) => (req, res, next) => {
  if (invalidRoleIDs.includes(req.user.user_role_id)) {
    return res
      .status(401)
      .json({ message: "You don't have permission to visit this page." });
  }
  return next();
};

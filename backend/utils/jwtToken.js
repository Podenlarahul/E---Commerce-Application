// Create token and saving the in cookies and send response

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const isProduction = process.env.NODE_ENV === "production";

  const sameSite =
    process.env.COOKIE_SAMESITE || (isProduction ? "none" : "lax");
  const secure =
    process.env.COOKIE_SECURE != null
      ? process.env.COOKIE_SECURE === "true"
      : isProduction;
  const domain = process.env.COOKIE_DOMAIN || undefined;

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite,
    secure,
    ...(domain ? { domain } : {}),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
module.exports = sendToken;

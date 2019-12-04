const Url = require("url");

const addUserToUrl = (url, user) => {
  const exportUsername = user && user.username;
  const exportPassword = user && user.password;
  if (exportUsername && exportPassword) {
    const urlParts = Url.parse(url);
    url = `${urlParts.protocol}//${exportUsername}:${exportPassword}@${urlParts.host}${urlParts.path || ""}${urlParts.hash || ""}`;
  } else {
    throw new Error(`Config for exporting not properly set up for user ${user}`);
  }
  return url;
};

module.exports = addUserToUrl;
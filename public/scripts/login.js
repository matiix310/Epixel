const login = async () => {
  const jwt = window.localStorage.getItem("jwt");

  if (jwt) {
    const res = await fetch(HOST + "/api/refreshToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jwt,
      }),
    }).then((response) => response.json());

    window.localStorage.removeItem("jwt");

    if (res.error) {
      window.location.href = "/login";
      return;
    }

    window.localStorage.setItem("jwt", res.jwt);
    window.location.href = "/play";
  } else {
    window.location.href = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize
        ?client_id=${CLIENT_ID}
        &response_type=code
        &redirect_uri=${HOST + REDIRECT_URI}
        &response_mode=query
        &scope=offline_access%20openid%20email%20profile`;
  }
};

login();

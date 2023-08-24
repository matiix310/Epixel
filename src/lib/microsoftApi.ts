type User = {
  sub: string;
  name: string;
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
};

const getUser = async (microsoft_access_token: string): Promise<User | undefined> => {
  const userRes = await requestMicrosoft(
    "https://graph.microsoft.com/oidc/userinfo",
    microsoft_access_token,
    "GET"
  );

  return userRes as User | undefined;
};

const requestMicrosoft = async (
  url: string,
  accessToken: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
) => {
  const res = await fetch(url, {
    method,
    headers: { Authorization: "Bearer " + accessToken },
  }).then((response) => response.json());

  return res;
};

export type { User };
export { getUser };

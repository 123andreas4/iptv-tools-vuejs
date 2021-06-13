import { authHeader, formatHeader, activeAPI } from "../helpers";
import { ipGeoAPIKey } from "../constants/config";

export const httpService = {
  get(url, header) {
    const requestOptions = {
      method: "GET",
      headers: formatHeader(authHeader(header)),
    };
    return fetch(`${activeAPI()}/${url}`, requestOptions).then(handleResponse);
  },
  put(url, data, header) {
    const requestOptions = {
      method: "PUT",
      headers: formatHeader(authHeader(header)),
      body: JSON.stringify(data),
    };

    return fetch(`${activeAPI()}/${url}`, requestOptions).then(handleResponse);
  },
  post(url, data, header) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(authHeader(header)),
      body: JSON.stringify(data),
    };

    return fetch(`${activeAPI()}/${url}`, requestOptions).then(handleResponse);
  },
  delete(url, header) {
    const requestOptions = {
      method: "DELETE",
      headers: formatHeader(authHeader(header)),
    };

    return fetch(`${activeAPI()}/${url}`, requestOptions).then(handleResponse);
  },
  youtube(videoId) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(authHeader()),
      body: JSON.stringify({ video_id: videoId }),
    };

    return fetch(`${activeAPI()}/editor/youtube-video`, requestOptions).then(
      handleYoutube
    );
  },
  ipgeo() {
    return fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeoAPIKey}`, {
      method: "GET",
    }).then(handleResponse);
  },
};

export const userService = {
  login(username, password) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(),
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    return fetch(`${activeAPI()}/users/authenticate`, requestOptions)
      .then(handleResponse)
      .then((user) => {
        // login successful if there's a jwt token in the response
        if (user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("user", JSON.stringify(user));
        }

        return user;
      });
  },
  logout() {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(authHeader()),
      body: "",
    };

    return fetch(`${activeAPI()}/users/logout`, requestOptions).then(
      handleResponse
    );
  },
  forgotPassword(username, email) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(),
      body: JSON.stringify({
        username: username,
        email: email,
      }),
    };

    return fetch(`${activeAPI()}/users/forgot`, requestOptions).then(
      handleResponse
    );
  },
  resetPassword(username, code, password) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(),
      body: JSON.stringify({
        username: username,
        code: code,
        password: password,
      }),
    };

    return fetch(`${activeAPI()}/users/reset`, requestOptions).then(
      handleResponse
    );
  },
  register(user) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(),
      body: JSON.stringify(user),
    };

    return fetch(`${activeAPI()}/users/register`, requestOptions).then(
      handleResponse
    );
  },
  checkUsername(username) {
    const requestOptions = {
      method: "POST",
      headers: formatHeader(),
      body: JSON.stringify({
        username: username,
      }),
    };

    return fetch(`${activeAPI()}/users/available`, requestOptions).then(
      handleResponse
    );
  },
};

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        httpService.logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function handleYoutube(response) {
  return response.text().then((text) => {
    let info = text.match(
      /(?<=>var ytInitialPlayerResponse =)(.*)(?=;var meta)/i
    );
    return info && info.length ? JSON.parse(info[0]) : null;
  });
}

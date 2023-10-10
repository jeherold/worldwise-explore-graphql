import { useNavigate } from "react-router-dom";

import github from "../gqldb";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect, useState } from "react";
import styles from "./UserGithub.module.css";

function UserGithub() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  function handleClick() {
    logout();
    navigate("/");
  }

  function gqlGithubQuery() {
    return {
      query: `
      {
        viewer {
          login
          name
          bio
          avatarUrl
        }
      }
      `,
    };
  }

  async function fetchUser() {
    const query = gqlGithubQuery();
    /** can use a GET but here need to use POST since fetching with headers in the gqldb file */
    await fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: JSON.stringify(query),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserAvatar(data.data.viewer.avatarUrl);
        setUserName(data.data.viewer.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchUser();
  });

  return (
    <div className={styles.user}>
      <img src={userAvatar} alt={userName} />
      <span>Welcome, {userName}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default UserGithub;

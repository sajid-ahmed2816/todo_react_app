import { useState } from "react";

function useProvideAuth() {
  const [uid, setUid] = useState(localStorage.getItem("uid"));

  const userLogin = (user) => {
    localStorage.setItem("uid", user.uid);
    setUid(user.uid);
  };

  return {
    uid,
    userLogin
  }
}

export default useProvideAuth;
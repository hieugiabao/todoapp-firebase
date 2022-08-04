import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken === null) {
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `${authToken}`;
      axios
        .get("/user")
        .then((res) => {
          console.log(res.data);
          setUser({
            firstName: res.data.userCredentials.firstName,
            lastName: res.data.userCredentials.lastName,
            email: res.data.userCredentials.email,
            country: res.data.userCredentials.country,
            username: res.data.userCredentials.username,
            profilePicture: res.data.userCredentials.imageUrl,
          });
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 403) navigate("/login");
          console.log(err);
          setError("Error in retrieving the data");
        });
    }
  }, [navigate]);

  return { user, loading, error, setUser };
};

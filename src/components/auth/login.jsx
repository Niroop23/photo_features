import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Login() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/google",
          {
            token: credentialResponse.credential,
          },
        );
        console.log(data);
      }}
      onError={(err) => {
        console.error(err);
      }}
    />
  );
}

export default Login;

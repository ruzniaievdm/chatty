// @ts-nocheck
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { username, password } = values;
      const res = await login(username, password);

      if (res.error || res.data) {
        if (res.data && res.data.detail) {
          setError(res.data.detail);
        }
      } else {
        navigate("/");
      }
      setSubmitting(false);
    }
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
      </div>

      <div className="mt-5">
        <div className="bg-white px-4 py-8 shadow">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {error && <div>{JSON.stringify(error)}</div>}
            <div className="space-y-5 rounded-md">
              <label class="block">
                <input
                  type="text"
                  value={formik.values.username}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
                  onChange={formik.handleChange}
                  name="username"
                  placeholder="Username"
                />
              </label>
              <label class="block">
                <input
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400" onChange={formik.handleChange} name="password"
                  placeholder="Password"
                />
              </label>
            </div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              {formik.isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );;
}
import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { getDashboardPath } from "../../utils/roleRedirect";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      navigate(getDashboardPath(res.data.role));
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

          *{
            font-family:"Poppins",sans-serif;
          }
        `}
      </style>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="grid md:grid-cols-2 md:gap-10 lg:gap-20 max-w-6xl w-full items-center bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Left Side */}
          <div className="p-8 md:p-12">

            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h1>

            <p className="text-gray-500 mb-8 leading-relaxed">
              Login to continue accessing your account and dashboard.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="mb-5">
                <label className="block text-sm text-gray-500 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-indigo-500 transition"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-indigo-500 transition"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Login
              </button>

              <p className="text-sm text-gray-500 mt-6 text-center">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex relative min-h-[650px]">

            <img
              src="https://assets.architecturaldigest.in/photos/63d8fff02d4955ac20754d7d/master/w_1600%2Cc_limit/Ex(3).jpg"
              alt="login"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 mt-auto p-10">

              <p className="text-white text-lg font-medium leading-relaxed mb-6">
                Secure authentication system built with MERN Stack and Tailwind CSS.
              </p>

              <p className="text-white text-sm text-right">
                ━ MERN Authentication
              </p>

              <div className="flex justify-end gap-2 mt-5">
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

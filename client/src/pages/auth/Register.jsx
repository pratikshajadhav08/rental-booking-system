import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { getDashboardPath } from "../../utils/roleRedirect";
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("userInfo", JSON.stringify(res.data));

      navigate(getDashboardPath(res.data.role));
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
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
              Create Account
            </h1>

            <p className="text-gray-500 mb-8 leading-relaxed">
              Register and choose your role to continue.
            </p>

            <form onSubmit={handleSubmit}>

              <div className="mb-5">
                <label className="block text-sm text-gray-500 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-indigo-500 transition"
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

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

              <div className="mb-5">
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

              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-2">
                  Select Role
                </label>

                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm focus:border-indigo-500 transition"
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="host">Host</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
              >
                Create Account
              </button>

              <p className="text-sm text-gray-500 mt-6 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex relative min-h-[700px]">

            <img
              src="https://tse4.mm.bing.net/th/id/OIP.j0CdNelv2Iuj4DykzCXr_AHaLG?pid=ImgDet&w=182&h=273&c=7&dpr=1.1&o=7&rm=3"
              alt="register"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 mt-auto p-10">

              <p className="text-white text-lg font-medium leading-relaxed mb-6">
                Choose your role and start building modern MERN applications today.
              </p>

              <p className="text-white text-sm text-right">
                ━ MERN Stack Platform
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

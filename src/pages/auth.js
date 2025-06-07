import Head from "next/head";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { auth, database } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success, error, warning, info
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check email verification
        if (!user.emailVerified) {
          // Sign out the user if email is not verified
          await signOut(auth);
          showToast(
            "Email belum diverifikasi. Silakan cek email kamu terlebih dahulu.",
            "warning"
          );
          return;
        }

        // Proceed if email is verified
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          // Decrypt sensitive fields
          try {
            const userRole = decrypt(userData.role);
            router.push(userRole === "admin" ? "/admin" : "/dashboard");
          } catch (error) {
            console.error("Error decrypting user data:", error);
            showToast(
              "Terjadi kesalahan saat memproses data pengguna.",
              "error"
            );
            await signOut(auth);
          }
        } else {
          // Handle case where user authenticated but no database record exists
          showToast("User data tidak ditemukan. Hubungi admin.", "error");
          await signOut(auth);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const generateApiKey = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const encrypt = (text) => {
    if (!text) return "";
    const secret = process.env.NEXT_PUBLIC_ENCRYPT_SECRET;
    return CryptoJS.AES.encrypt(text.toString(), secret).toString();
  };

  const decrypt = (text) => {
    if (!text) return "";
    const secret = process.env.NEXT_PUBLIC_ENCRYPT_SECRET;
    const bytes = CryptoJS.AES.decrypt(text, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, phone } = formData;

    try {
      if (isLogin) {
        // LOGIN FLOW
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Check email verification immediately after login
        if (!userCredential.user.emailVerified) {
          // Sign out the user if email is not verified
          await signOut(auth);
          showToast(
            "Email belum diverifikasi. Silakan cek email kamu terlebih dahulu.",
            "warning"
          );
          return;
        }

        showToast("Login berhasil!", "success");
        // Rest of the login flow is handled by the onAuthStateChanged listener
      } else {
        // REGISTRATION FLOW
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(userCredential.user);

        const uid = userCredential.user.uid;
        const apiKey = generateApiKey();

        // Save user data to Realtime Database with encryption for sensitive fields
        await set(ref(database, `users/${uid}`), {
          email: encrypt(email),
          phone: encrypt(phone),
          role: encrypt("user"),
          apiKey: encrypt(apiKey),
          plan: encrypt("free"),
          usageToday: 0, // Non-sensitive numeric data can remain unencrypted
          lastUsed: encrypt(new Date().toISOString().split("T")[0]),
          createdAt: encrypt(new Date().toISOString()),
        });

        // Sign out the user after registration to force email verification
        await signOut(auth);

        showToast(
          "Registrasi berhasil! Silakan cek email kamu untuk verifikasi sebelum login.",
          "success"
        );

        // Reset form after successful registration
        setFormData({
          email: "",
          password: "",
          phone: "",
        });
      }
    } catch (err) {
      let errorMessage = err.message;
      // Simplified error messages
      if (errorMessage.includes("auth/email-already-in-use")) {
        errorMessage = "Email sudah terdaftar";
      } else if (errorMessage.includes("auth/invalid-credential")) {
        errorMessage = "Email atau password salah";
      } else if (errorMessage.includes("auth/wrong-password")) {
        errorMessage = "Password salah";
      } else if (errorMessage.includes("auth/user-not-found")) {
        errorMessage = "Email tidak terdaftar";
      } else if (errorMessage.includes("auth/weak-password")) {
        errorMessage = "Password terlalu lemah, minimal 6 karakter";
      }

      showToast(errorMessage, "error");
      console.error("Auth error:", err);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const authProvider =
        provider === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Check if user exists in database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // Create new user record if it doesn't exist
        const apiKey = generateApiKey();
        await set(userRef, {
          email: encrypt(user.email),
          phone: encrypt(""),
          role: encrypt("user"),
          apiKey: encrypt(apiKey),
          plan: encrypt("free"),
          usageToday: 0,
          lastUsed: encrypt(new Date().toISOString().split("T")[0]),
          createdAt: encrypt(new Date().toISOString()),
          authProvider: encrypt(provider),
        });
      }

      showToast(
        `Login dengan ${provider === "google" ? "Google" : "GitHub"} berhasil!`,
        "success"
      );
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes("account-exists-with-different-credential")) {
        errorMessage =
          "Akun dengan email ini sudah terdaftar dengan metode login lain";
      }
      showToast(errorMessage, "error");
      console.error("OAuth error:", err);
    }
  };

  const handleGoogleLogin = () => handleOAuthSignIn("google");
  const handleGithubLogin = () => handleOAuthSignIn("github");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Clear form data when switching modes
    setFormData({
      email: "",
      password: "",
      phone: "",
    });
  };

  return (
    <>
      <Head>
        <title>DenayRestAPI – Akun</title>
        <link rel="shortcut icon" href="./dra.ico" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ease-in-out`}
          >
            <div
              className={`flex items-center p-4 rounded-lg shadow-lg ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              } text-white`}
            >
              <div className="mr-3">
                {toast.type === "success" && (
                  <Icon icon="tabler:circle-check" className="w-6 h-6" />
                )}
                {toast.type === "error" && (
                  <Icon icon="tabler:alert-circle" className="w-6 h-6" />
                )}
                {toast.type === "warning" && (
                  <Icon icon="tabler:alert-triangle" className="w-6 h-6" />
                )}
                {toast.type === "info" && (
                  <Icon icon="tabler:info-circle" className="w-6 h-6" />
                )}
              </div>
              <p>{toast.message}</p>
              <button
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="ml-auto text-white hover:text-gray-200"
              >
                <Icon icon="tabler:x" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div
          className={`w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex transition-all duration-1000`}
        >
          {/* Form Section */}
          <div className="relative w-full p-10 min-h-[500px]">
            {/* Login Form */}
            <div
              className={`transition-all duration-700 ${
                isLogin ? "opacity-100 visible" : "opacity-0 invisible absolute"
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Login to your account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
                  >
                    <Icon
                      icon={showPassword ? "tabler:eye" : "tabler:eye-closed"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {/* Adding an empty space to match the height of the signup form */}
                <div className="invisible h-12">
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Login
                </button>
              </form>
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Login with Google
                </button>
                <button
                  onClick={handleGithubLogin}
                  className="w-full bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-900"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                    />
                  </svg>
                  Login with GitHub
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
                Don't have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-blue-500 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* Registration Form */}
            <div
              className={`transition-all duration-700 ${
                isLogin ? "opacity-0 invisible absolute" : "opacity-100 visible"
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Register a new account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
                  >
                    <Icon
                      icon={showPassword ? "tabler:eye" : "tabler:eye-closed"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Register
                </button>
              </form>
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-red-600"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Sign up with Google
                </button>
                <button
                  onClick={handleGithubLogin}
                  className="w-full bg-gray-800 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-900"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                    />
                  </svg>
                  Sign up with GitHub
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-blue-500 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

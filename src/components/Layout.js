import { useState } from "react";
import Head from "next/head";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";

export default function Layout({ children, darkMode, setDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Windmill Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
          sidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-col flex-1 w-full">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="h-full overflow-y-auto">
            <div className="container px-6 mx-auto grid">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

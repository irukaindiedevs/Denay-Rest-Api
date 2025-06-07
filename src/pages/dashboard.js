import Head from "next/head";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DashboardCards from "@/components/dashboard/Cards";
import DataTable from "@/components/dashboard/Table";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("alpinejs");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Windmill Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Dashboard
            </h2>
            <a
              href="https://github.com/estevanmaito/windmill-dashboard"
              className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07..." />
                </svg>
                <span>Star this project on GitHub</span>
              </div>
              <span>View more &rarr;</span>
            </a>

            <DashboardCards />
            <DataTable />
          </main>
        </div>
      </div>
    </div>
  );
}

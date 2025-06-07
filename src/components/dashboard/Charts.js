import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../Layout";
import Chart from "chart.js/auto";

export default function ChartsPage() {
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    // Initialize charts when component mounts
    if (pieChartRef.current && lineChartRef.current && barChartRef.current) {
      initPieChart();
      initLineChart();
      initBarChart();
    }

    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

  const initPieChart = () => {
    const ctx = document.getElementById("pie");
    pieChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Shirts", "Shoes", "Bags"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
          },
        ],
      },
      options: {
        responsive: true,
        cutoutPercentage: 80,
        legend: {
          display: false,
        },
      },
    });
  };

  const initLineChart = () => {
    const ctx = document.getElementById("line");
    lineChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Organic",
            backgroundColor: "#0694a2",
            borderColor: "#0694a2",
            data: [43, 48, 40, 54, 67, 73, 70],
            fill: false,
          },
          {
            label: "Paid",
            backgroundColor: "#7e3af2",
            borderColor: "#7e3af2",
            data: [24, 50, 64, 74, 52, 51, 65],
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value",
            },
          },
        },
      },
    });
  };

  const initBarChart = () => {
    const ctx = document.getElementById("bars");
    barChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Shoes",
            backgroundColor: "#0694a2",
            data: [30, 40, 30, 40, 30, 40, 30],
          },
          {
            label: "Bags",
            backgroundColor: "#7e3af2",
            data: [30, 40, 30, 40, 30, 40, 30],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: false,
        },
      },
    });
  };

  return (
    <>
      <Head>
        <title>Charts - Windmill Dashboard</title>
      </Head>

      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Charts
        </h2>

        {/* CTA */}
        <a
          className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
          href="https://github.com/estevanmaito/windmill-dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Star this project on GitHub</span>
          </div>
          <span>View more &RightArrow;</span>
        </a>

        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Charts are provided by{" "}
          <a
            className="text-purple-600 dark:text-purple-400 hover:underline"
            href="https://www.chartjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chart.js
          </a>
          . Note that the default legends are disabled and you should provide a
          description for your charts in HTML. See source code for examples.
        </p>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Doughnut/Pie chart */}
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Doughnut/Pie
            </h4>
            <canvas id="pie"></canvas>
            <div className="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-blue-600 rounded-full"></span>
                <span>Shirts</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-teal-500 rounded-full"></span>
                <span>Shoes</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full"></span>
                <span>Bags</span>
              </div>
            </div>
          </div>

          {/* Lines chart */}
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Lines
            </h4>
            <canvas id="line"></canvas>
            <div className="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-teal-500 rounded-full"></span>
                <span>Organic</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full"></span>
                <span>Paid</span>
              </div>
            </div>
          </div>

          {/* Bars chart */}
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Bars
            </h4>
            <canvas id="bars"></canvas>
            <div className="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-teal-500 rounded-full"></span>
                <span>Shoes</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 mr-1 bg-purple-600 rounded-full"></span>
                <span>Bags</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ChartsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

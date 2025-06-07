const rows = [
  {
    name: "Hans Burger",
    role: "10x Developer",
    amount: "$863.45",
    status: "Approved",
    date: "6/10/2020",
    img: "https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f",
  },
  {
    name: "Jolina Angelie",
    role: "Unemployed",
    amount: "$369.95",
    status: "Pending",
    date: "6/10/2020",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  // Tambahkan data lain sesuai kebutuhan
];

export default function DataTable() {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {rows.map((row, idx) => (
              <tr key={idx} className="text-gray-700 dark:text-gray-400">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src={row.img}
                        alt={row.name}
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0 rounded-full shadow-inner"
                        aria-hidden="true"
                      ></div>
                    </div>
                    <div>
                      <p className="font-semibold">{row.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {row.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{row.amount}</td>
                <td className="px-4 py-3 text-xs">
                  <span
                    className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                      row.status === "Approved"
                        ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
                        : row.status === "Pending"
                        ? "text-orange-700 bg-orange-100 dark:bg-orange-600 dark:text-white"
                        : "text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

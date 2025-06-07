export default function DashboardCards() {
  const cards = [
    { label: "Total clients", value: "6389", color: "orange" },
    { label: "Account balance", value: "$46,760.89", color: "green" },
    { label: "New sales", value: "376", color: "blue" },
    { label: "Pending contacts", value: "35", color: "teal" },
  ];

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800"
        >
          <div
            className={`p-3 mr-4 text-${card.color}-500 bg-${card.color}-100 rounded-full dark:text-${card.color}-100 dark:bg-${card.color}-500`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0z..." />
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.label}
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

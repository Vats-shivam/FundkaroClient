const EMISummary = ({ emi, totalInterest, totalPayment, totalPrincipal }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)

  const summaryItems = [
    {
      title: "Monthly EMI",
      value: formatCurrency(emi),
      bgColor: "bg-lightPrimary",
    },
    {
      title: "Total Interest",
      value: formatCurrency(totalInterest),
      bgColor: "bg-green-600",
    },
    {
      title: "Total Payment",
      value: formatCurrency(totalPayment),
      bgColor: "bg-purple-600",
    },
    {
      title: "Total Principal",
      value: formatCurrency(totalPrincipal),
      bgColor: "bg-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className={`${item.bgColor} text-white rounded-lg shadow-primaryShadow p-4 transition-transform hover:scale-105`}
        >
          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
          <p className="text-2xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

export default EMISummary


import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Customers = () => {
  const [sales, setSales] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/sales`);
      setSales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // UNIQUE CUSTOMERS
  const customersMap = {};

  sales.forEach((sale) => {
    const name = sale.customer || "Unknown";

    if (!customersMap[name]) {
      customersMap[name] = {
        name,
        total: 0,
        received: 0,
        balance: 0,
      };
    }

    customersMap[name].total += Number(sale.total || 0);

    // customersMap[name].received += Number(
    //   sale.received || sale.total || 0
    // );
    customersMap[name].received += Number(
  sale.receivedAmount || sale.received || sale.total || 0
);
  });

  // FINAL ARRAY
  const customers = Object.values(customersMap).map((c) => ({
    ...c,
    balance: c.total - c.received,
  }));

  // SEE MORE
  const visibleCustomers = showAll
    ? customers
    : customers.slice(0, 5);

  // TOTALS
  const totalSales = customers.reduce(
    (sum, c) => sum + c.total,
    0
  );

  const totalPending = customers.reduce(
    (sum, c) => sum + c.balance,
    0
  );

  // PDF DOWNLOAD
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Customers Report", 14, 20);

    autoTable(doc, {
      startY: 30,

      head: [["Name", "Total", "Received", "Balance"]],

      body: customers.map((c) => [
        c.name,
        `₹${c.total}`,
        `₹${c.received}`,
        `₹${c.balance}`,
      ]),
    });

    doc.save("customers-report.pdf");
  };

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          Customers
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl"
        >
          Download PDF
        </button>

      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Customers
          </p>

          <h2 className="text-3xl font-bold">
            {customers.length}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Sales
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{totalSales}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold text-red-500">
            ₹{totalPending}
          </h2>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-[#0f172a] text-white">

            <tr>
              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left">
                Total
              </th>

              <th className="text-left">
                Received
              </th>

              <th className="text-left">
                Balance
              </th>
            </tr>

          </thead>

          <tbody>

            {visibleCustomers.map((c, index) => (

              <tr
                key={index}
                className="border-b"
              >

                <td className="p-4 font-medium">
                  {c.name}
                </td>

                <td>
                  ₹{c.total}
                </td>

                <td className="text-green-600">
                  ₹{c.received}
                </td>

                <td className="text-red-500">
                  ₹{c.balance}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* SEE MORE */}
      {customers.length > 5 && (

        <div className="flex justify-center mt-5">

          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gray-200 px-5 py-2 rounded-lg"
          >
            {showAll ? "Show Less" : "See More"}
          </button>

        </div>
      )}
    </div>
  );
};

export default Customers;
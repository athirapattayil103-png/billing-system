// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { BASE_URL } from "../api";

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     amount: "",
//   });

//   // FETCH EXPENSES
//   const fetchExpenses = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/expenses`);
//       setExpenses(res.data.reverse());
//     } catch (error) {
//       toast.error("Failed to load expenses ❌");
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // HANDLE INPUT
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ADD / UPDATE
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.title || !form.amount) {
//       toast.error("Fill all fields ❌");
//       return;
//     }

//     try {
//       const payload = {
//         ...form,
//         amount: Number(form.amount),
//         date: new Date().toISOString(),
//       };

//       if (editId) {
//         await axios.put(`${BASE_URL}/expenses/${editId}`, payload);
//         toast.success("Expense Updated");
//       } else {
//         await axios.post(`${BASE_URL}/expenses`, payload);
//         toast.success("Expense Added 💸");
//       }

//       setForm({
//         title: "",
//         amount: "",
//       });

//       setEditId(null);
//       setShowModal(false);
//       fetchExpenses();
//     } catch (error) {
//       toast.error("Operation Failed ❌");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${BASE_URL}/expenses/${id}`);
//       toast.success("Deleted Successfully");
//       fetchExpenses();
//     } catch (error) {
//       toast.error("Delete Failed ❌");
//     }
//   };

//   // EDIT
//   const handleEdit = (expense) => {
//     setForm({
//       title: expense.title,
//       amount: expense.amount,
//     });

//     setEditId(expense.id);
//     setShowModal(true);
//   };

//   // TOTAL
//   const totalExpense = expenses.reduce(
//     (sum, item) => sum + Number(item.amount || 0),
//     0
//   );

//   return (
//     <div className="p-6 bg-[#f5f6fa] min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-4xl font-bold">Expenses</h1>
//           <p className="text-gray-500">
//             {expenses.length} expenses recorded
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             setShowModal(true);
//             setEditId(null);
//             setForm({
//               title: "",
//               amount: "",
//             });
//           }}
//           className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
//         >
//           + Add Expense
//         </button>
//       </div>

//       {/* TOTAL CARD */}
//       <div className="bg-white rounded-2xl shadow p-6 text-center mb-6">
//         <p className="text-sm text-gray-500">Total Expense</p>
//         <h2 className="text-3xl font-bold text-red-600">
//           ₹{totalExpense}
//         </h2>
//       </div>

//       {/* HISTORY */}
//       <div className="bg-white rounded-2xl shadow p-6">
//         <h2 className="text-xl font-bold mb-4">
//           Expense History
//         </h2>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-left">
//                 <th className="py-3">#</th>
//                 <th>Title</th>
//                 <th>Amount</th>
//                 <th>Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {expenses.map((item, index) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="py-4">{index + 1}</td>
//                   <td>{item.title}</td>
//                   <td className="text-red-500 font-semibold">
//                     ₹{item.amount}
//                   </td>
//                   <td>
//                     {new Date(item.date).toLocaleString()}
//                   </td>

//                   <td className="flex gap-2 py-3">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="bg-yellow-400 px-4 py-2 rounded-lg"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden">
            
//             {/* RED HEADER */}
//             <div className="bg-red-600 text-white p-5">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-xs opacity-80">
//                     New expense entry
//                   </p>
//                   <h2 className="text-2xl font-bold">
//                     {editId ? "Edit Expense" : "Add Expense"}
//                   </h2>
//                 </div>

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* FORM */}
//             <form onSubmit={handleSubmit} className="p-5 space-y-4">
//               <div>
//                 <label className="text-sm text-gray-500">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Expense title"
//                   value={form.title}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <div>
//                 <label className="text-sm text-gray-500">
//                   Amount
//                 </label>
//                 <input
//                   type="number"
//                   name="amount"
//                   placeholder="Amount"
//                   value={form.amount}
//                   onChange={handleChange}
//                   className="border p-3 rounded-lg w-full"
//                 />
//               </div>

//               <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold">
//                 {editId ? "Update Expense" : "Add Expense"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="w-full bg-gray-100 py-3 rounded-xl"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Expenses;


import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expenses`);
      setExpenses(res.data.reverse());
    } catch (error) {
      toast.error("Failed to load expenses ❌");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      toast.error("Fill all fields ❌");
      return;
    }

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        date: new Date().toISOString(),
      };

      if (editId) {
        await axios.put(`${BASE_URL}/expenses/${editId}`, payload);
        toast.success("Expense Updated");
      } else {
        await axios.post(`${BASE_URL}/expenses`, payload);
        toast.success("Expense Added 💸");
      }

      setForm({
        title: "",
        amount: "",
      });

      setEditId(null);
      setShowModal(false);
      fetchExpenses();
    } catch (error) {
      toast.error("Operation Failed ❌");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/expenses/${id}`);
      toast.success("Deleted Successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Delete Failed ❌");
    }
  };

  // EDIT
  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
    });

    setEditId(expense.id);
    setShowModal(true);
  };

  // TOTAL
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  // SEE MORE LOGIC
  const visibleExpenses = showAll
    ? expenses
    : expenses.slice(0, 4);

  return (
    <div className="p-6 bg-[#f5f6fa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Expenses</h1>
          <p className="text-gray-500">
            {expenses.length} expenses recorded
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            setEditId(null);
            setForm({
              title: "",
              amount: "",
            });
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + Add Expense
        </button>
      </div>

      {/* TOTAL CARD */}
      <div className="bg-white rounded-2xl shadow p-6 text-center mb-6">
        <p className="text-sm text-gray-500">
          Total Expense
        </p>
        <h2 className="text-3xl font-bold text-red-600">
          ₹{totalExpense}
        </h2>
      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Expense History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3">#</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleExpenses.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4">{index + 1}</td>
                  <td>{item.title}</td>

                  <td className="text-red-500 font-semibold">
                    ₹{item.amount}
                  </td>

                  <td>
                    {new Date(item.date).toLocaleString()}
                  </td>

                  <td className="flex gap-2 py-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEE MORE BUTTON */}
        {expenses.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium"
            >
              {showAll ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden">

            {/* RED HEADER */}
            <div className="bg-red-600 text-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs opacity-80">
                    New expense entry
                  </p>
                  <h2 className="text-2xl font-bold">
                    {editId ? "Edit Expense" : "Add Expense"}
                  </h2>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm text-gray-500">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Expense title"
                  value={form.title}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold">
                {editId ? "Update Expense" : "Add Expense"}
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 py-3 rounded-xl"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
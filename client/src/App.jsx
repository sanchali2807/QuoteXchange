// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Dashboard from "./pages/Dashboard";
// // import CreateRFQ from "./pages/CreateRFQ";
// // import RFQDetails from "./pages/RFQDetails";

// import ProtectedRoute from "./components/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         {/* <Route path="/register" element={<Register />} /> */}

//         {/* <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/create-rfq"
//           element={
//             <ProtectedRoute>
//               <CreateRFQ />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/rfq/:id"
//           element={
//             <ProtectedRoute>
//               <RFQDetails />
//             </ProtectedRoute>
//           }
//         /> */}
//       </Routes>
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
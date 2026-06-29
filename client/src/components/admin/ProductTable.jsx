// export default function ProductTable({ products }) {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>No.</th>
//           <th>Name</th>
//           <th>Price</th>
//           <th>Stock</th>
//           <th>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {products.map((product, index) => (
//           <tr key={product._id}>
//             <td>{index + 1}</td>
//             <td>{product.name}</td>
//             <td>{product.price}</td>
//             <td>{product.stock}</td>
//             <td>
//               <button>Edit</button>
//               <button>Delete</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

export default function ShoppingList() {
  return (
    <div className="flex">
      <img src="" alt="product" className="w-20 h-20" />
      <div className="flex-1">
        <p>Product Name</p>
        <p>Price</p>
      </div>
      <div>
        <button>-</button>
        <span>qty</span>
        <button>+</button>
      </div>
      <button>Delete</button>
    </div>
  );
}

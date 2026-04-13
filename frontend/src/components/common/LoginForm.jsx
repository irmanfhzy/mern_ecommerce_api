export default function LoginForm() {
  return (
    <form className="flex flex-col gap-4 border w-3/4 md:w-1/2 lg:w-1/3 p-4 bg-white">
      <input
        type="text"
        placeholder="username"
        required
        className="border rounded-sm p-3"
      />
      <input
        type="password"
        placeholder="password"
        required
        className="border rounded-sm p-3"
      />
      <button
        type="submit"
        className="bg-amber-600 w-full text-white p-3 rounded-sm hover:cursor-pointer hover:bg-amber-700"
      >
        Login
      </button>
    </form>
  );
}

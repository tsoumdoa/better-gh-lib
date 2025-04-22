import { Search, Circle } from "lucide-react";

export default function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <h1 className="text-2xl font-bold md:text-4xl">Better GH Library</h1>
      <div className="flex items-center gap-3">
        <div className="relative flex w-56 items-center overflow-hidden rounded-md bg-neutral-500 ring-1 ring-neutral-500">
          <Search className="absolute left-3 h-4 w-4 text-white" />
          <input
            type="text"
            placeholder="search"
            className="w-full border-none bg-transparent py-1.5 pl-9 text-sm outline-none"
          />
          <div className="bg-black px-2 py-1.5 text-sm text-white">#K</div>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-black transition-all">
          <Circle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

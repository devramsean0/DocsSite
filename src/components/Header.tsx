import { Dropdown } from "./elements";
import { get_packages } from "../lib";

export function Header() {
    return (
        <header class="bg-gray-900 h-16 w-full flex items-center gap-4">
            <div class="flex">
                <img src="/favicon.svg" alt="logo" class="h-8 w-8" />
                <h1 class="text-3xl">Docs</h1>
            </div>
            {/* Dropdown for package */}
            <Dropdown name="Package" options={[]} onSelect={(option: string) => {
                console.log("Hello")
            }} />
            {/* Dropdown for version */}
            <Dropdown name="Version" options={["v1.0.0"]} onSelect={(option: string) => {
                console.log("Hello")
            }} />
            {/* Search bar */}
        </header>
    )
}
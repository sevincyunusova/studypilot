"use client";

import { useState } from "react";
import Modal from "../../playground/components/Modal";
import Tabs from "../../playground/components/Tabs";
import Disclosure from "../../playground/components/Disclosure";

export default function PlaygroundPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs = [
        {
            id: "one",
            label: "First Tab",
            content: <p>This is the content of the first tab.</p>,
        },
        {
            id: "two",
            label: "Second Tab",
            content: <p>This is the content of the second tab.</p>,
        },
        {
            id: "three",
            label: "Third Tab",
            content: <p>This is the content of the third tab.</p>,
        },
    ];

    return (
        <main className="mx-auto max-w-3xl space-y-12 p-8">
            <h1 className="text-3xl font-bold">
                Accessible Components Playground
            </h1>

            <section>
                <h2 className="mb-4 text-xl font-semibold">Modal</h2>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Open Modal
                </button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Example Modal"
                >
                    <p>
                        This modal is used to test keyboard navigation and focus
                        management.
                    </p>
                </Modal>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">Tabs</h2>

                <Tabs tabs={tabs} />
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">Disclosure</h2>

                <Disclosure title="Show more information">
                    <p>
                        This content can be expanded and collapsed using the keyboard.
                    </p>
                </Disclosure>
            </section>
        </main>
    );
}
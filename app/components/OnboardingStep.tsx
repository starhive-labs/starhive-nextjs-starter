"use client"

import React, {ReactNode, useState} from 'react';

type StepProps = {
    title: string;
    completed: boolean;
    children: ReactNode;
};

export const OnboardingStep: React.FC<StepProps> = ({ title, completed, children }) => {
    const [isCollapsed, setIsCollapsed] = useState(completed);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`border p-4 rounded-lg shadow-md my-7 ${completed ? 'bg-white' : 'bg-gray-50'}`}>
            {/* Title Row */}
            <div
                className="flex items-center cursor-pointer"
                onClick={toggleCollapse} // Toggle collapse on click
            >
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        completed ? 'bg-completed' : 'bg-uncompleted'
                    }`}
                >
                    {completed ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ) : (
                        <span className="text-white">?</span>
                    )}
                </div>
                <h3 className="ml-4 text-xl font-semibold text-secondary">{title}</h3>

                <button className="ml-auto text-secondary focus:outline-none">
                    {isCollapsed ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>

            {!isCollapsed && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

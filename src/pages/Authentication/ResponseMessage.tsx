import { useEffect, useState } from "react";

interface ResponseMessageProps {
    message: string;
    type: string;
}
export function ResponseMessage({ message, type }: ResponseMessageProps) {
    const [progress, setProgress] = useState(0);

    const intervalSpeed = 10;
    const incrementSpeed = 5;

    useEffect(() => {
        const increment = (incrementSpeed * intervalSpeed) / 100;
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    return prevProgress;
                }
                return prevProgress + increment;
            });
        }, intervalSpeed);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={`flex flex-col absolute top-6 right-0 w-52 px-2 py-2 rounded-s-md text-center font-normal items-center justify-center z-50 ${type === "success" ? "bg-green-400 text-green-700" : "bg-red-400 text-red-700"}`}>
            {message}
            <div className="absolute w-full bottom-0 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                    className={`h-full ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    )
}
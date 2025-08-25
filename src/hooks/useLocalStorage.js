import { useState, useEffect } from "react";


export const useLocalStorage = (key, initial) => {
    const [value, setValue] = useState(() => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : initial;
    } catch {
        return initial;
    }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(err) {
            console.log(err);
        }
    }, [key, value]);
    return [value, setValue];
};
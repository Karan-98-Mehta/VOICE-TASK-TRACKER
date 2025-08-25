import { useState, useEffect, useMemo, useCallback } from "react";

export function useSpeech() {
    const Recognition = useMemo(() => {
        const R = window.SpeechRecognition || window.webkitSpeechRecognition;
        return R ? new R() : null;
    }, []);


    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState(null);
    const [supported] = useState(() => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));


    useEffect(() => {
        if (!Recognition) return;
        Recognition.lang = navigator.language || "en-US";
        Recognition.interimResults = true;
        Recognition.continuous = false;
        let finalText = "";


        const onResult = (e) => {
        let temp = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk;
        else temp += chunk;
        }
        setTranscript(finalText || temp);
        };
        const onEnd = () => setListening(false);
        const onErr = (e) => { setError(e?.error || "unknown"); setListening(false); };


        Recognition.addEventListener("result", onResult);
        Recognition.addEventListener("end", onEnd);
        Recognition.addEventListener("error", onErr);
        return () => {
        Recognition.removeEventListener("result", onResult);
        Recognition.removeEventListener("end", onEnd);
        Recognition.removeEventListener("error", onErr);
        try { Recognition.stop(); } catch(err) {
            console.log(err);
        }
        };
    }, [Recognition]);


    const start = useCallback(() => {
        if (!Recognition) return;
        setTranscript("");
        setError(null);
        setListening(true);
        try { Recognition.start(); } catch(err) {
            console.log(err);
        }
    }, [Recognition]);


    const stop = useCallback(() => {
        if (!Recognition) return;
        try { Recognition.stop(); } catch(err) {
            console.log(err);
        }
    }, [Recognition]);


    return { listening, transcript, error, supported, start, stop };
}
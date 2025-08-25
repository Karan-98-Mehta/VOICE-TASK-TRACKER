import { useState, useEffect, useMemo, useCallback, useRef } from "react";

export function useSpeech() {
  const Recognition = useMemo(() => {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    return R ? new R() : null;
  }, []);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");      // final + interim for UI
  const [error, setError] = useState(null);
  const [supported] = useState(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );

  // 🔥 keep final transcript separate
  const finalTextRef = useRef("");

  useEffect(() => {
    if (!Recognition) return;
    Recognition.lang = navigator.language || "en-US";
    Recognition.interimResults = true;
    Recognition.continuous = false;

    const onResult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          // commit finalized speech
          finalTextRef.current += chunk + " ";
        } else {
          // build interim text
          interim += chunk;
        }
      }
      // show committed + current interim
      setTranscript(finalTextRef.current + interim);
    };

    const onEnd = () => setListening(false);

    const onErr = (e) => {
      setError(e?.error || "unknown");
      setListening(false);
    };

    Recognition.addEventListener("result", onResult);
    Recognition.addEventListener("end", onEnd);
    Recognition.addEventListener("error", onErr);

    return () => {
      Recognition.removeEventListener("result", onResult);
      Recognition.removeEventListener("end", onEnd);
      Recognition.removeEventListener("error", onErr);
      try {
        Recognition.stop();
      } catch (err) {
        console.log(err);
      }
    };
  }, [Recognition]);

  const start = useCallback(() => {
    if (!Recognition) return;
    // 🔥 clear both interim + final on each start
    finalTextRef.current = "";
    setTranscript("");
    setError(null);
    setListening(true);
    try {
      Recognition.start();
    } catch (err) {
      console.log(err);
    }
  }, [Recognition]);

  const stop = useCallback(() => {
    if (!Recognition) return;
    try {
      Recognition.stop();
    } catch (err) {
      console.log(err);
    }
  }, [Recognition]);

  return { listening, transcript, error, supported, start, stop };
}

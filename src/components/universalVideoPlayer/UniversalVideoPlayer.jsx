import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const UniversalVideoPlayerSystem = ({
    video,
    autoplay = false,
    showControls = true,
    muted = false,
    aspectRatio = "16:9",
    style = {},
    className = "",
    watermark = null,
    onReady = () => { },
    onPlay = () => { },
    onPause = () => { },
    onEnded = () => { },
    onError = () => { },
    onSecurityViolation = () => { },
}) => {
    const iframeRef = useRef(null);
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [devToolsOpen, setDevToolsOpen] = useState(false);
    const [securityWarning, setSecurityWarning] = useState(false);

    const getPaddingBottom = () => {
        switch (aspectRatio) {
            case "4:3":
                return "75%";
            case "1:1":
                return "100%";
            case "16:9":
            default:
                return "56.25%";
        }
    };

    // DevTools Detection
    useEffect(() => {
        const detectDevTools = () => {
            const threshold = 160;
            const widthOpen = window.outerWidth - window.innerWidth > threshold;
            const heightOpen = window.outerHeight - window.innerHeight > threshold;
            const open = widthOpen || heightOpen;

            if (open) {
                setDevToolsOpen(true);
                setSecurityWarning(true);
                onSecurityViolation("devtools_detected");
                try {
                    playerRef.current?.pause?.();
                } catch (e) { }
            } else {
                if (devToolsOpen || securityWarning) {
                    setDevToolsOpen(false);
                    setSecurityWarning(false);
                    if (autoplay) {
                        try {
                            playerRef.current?.play?.();
                        } catch (e) { }
                    }
                }
            }
        };

        const intervalId = setInterval(detectDevTools, 1000);
        window.addEventListener("resize", detectDevTools);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("resize", detectDevTools);
        };
    }, [autoplay, devToolsOpen, securityWarning, onSecurityViolation]);

    // Disable shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key?.toLowerCase();
            if ((e.ctrlKey || e.metaKey) && ["s", "u", "i", "j", "c"].includes(key)) {
                e.preventDefault();
                onSecurityViolation("key_blocked");
            }
            if (key === "f12" || key === "printscreen") {
                e.preventDefault();
                onSecurityViolation("key_blocked");
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onSecurityViolation]);

    // Disable right click globally
    useEffect(() => {
        const disableRightClick = (e) => e.preventDefault();
        document.addEventListener("contextmenu", disableRightClick);
        return () => document.removeEventListener("contextmenu", disableRightClick);
    }, []);

    // Tab hide detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden || document.visibilityState === "hidden") {
                onSecurityViolation("tab_hidden");
                setSecurityWarning(true);
                try {
                    playerRef.current?.pause?.();
                } catch (e) { }
            } else {
                setSecurityWarning(false);
                if (autoplay) {
                    try {
                        playerRef.current?.play?.();
                    } catch (e) { }
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [autoplay, onSecurityViolation]);

    // Load Bunny Player
    useEffect(() => {
        if (!video?.videoId || !video?.libraryId || !iframeRef.current) return;

        let cancelled = false;
        let loadingTimeout;
        setIsLoading(true);
        setError(null);

        const loadPlayerJs = () =>
            new Promise((resolve, reject) => {
                if (window.playerjs) return resolve();
                const s = document.createElement("script");
                s.src = "//assets.mediadelivery.net/playerjs/player-0.1.0.min.js";
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error("Failed to load Player.js"));
                document.head.appendChild(s);
            });

        const initPlayer = async () => {
            try {
                await loadPlayerJs();
                if (cancelled) return;

                loadingTimeout = setTimeout(() => {
                    if (!cancelled && isLoading) {
                        setIsLoading(false);
                    }
                }, 10000);

                const player = new window.playerjs.Player(iframeRef.current);
                playerRef.current = player;

                player.on("ready", () => {
                    if (!cancelled) {
                        clearTimeout(loadingTimeout);
                        setIsLoading(false);
                        onReady();
                    }
                });

                player.on("play", () => !cancelled && onPlay());
                player.on("pause", () => !cancelled && onPause());
                player.on("ended", () => !cancelled && onEnded());
                player.on("error", (err) => {
                    if (!cancelled) {
                        setError("Failed to load video");
                        setIsLoading(false);
                        onError(err);
                    }
                });
            } catch (err) {
                if (!cancelled) {
                    clearTimeout(loadingTimeout);
                    setIsLoading(false);
                    setError(null);
                    onError(err);
                }
            }
        };

        initPlayer();

        return () => {
            cancelled = true;
            if (loadingTimeout) clearTimeout(loadingTimeout);
            playerRef.current = null;
        };
    }, [video?.videoId, video?.libraryId]);

    if (!video?.videoId || !video?.libraryId) {
        return (
            <div
                style={{
                    width: "100%",
                    background: "#000",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                    ...style,
                }}
                className={className}
            >
                <p>No video available</p>
            </div>
        );
    }

    const iframeUrl = `https://iframe.mediadelivery.net/embed/${video.libraryId}/${video.videoId}?autoplay=${autoplay}&muted=${muted}&responsive=true`;

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                paddingBottom: getPaddingBottom(),
                height: 0,
                background: "#000",
                overflow: "hidden",
                borderRadius: "8px",
                userSelect: "none",
                ...style,
            }}
            className={className}
        >
            {(devToolsOpen || securityWarning) && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.95)",
                        zIndex: 1000,
                        color: "#fff",
                        fontSize: "14px",
                        padding: "8px",
                        textAlign: "center",
                        flexDirection: "column",
                        gap: "0px",
                    }}
                >
                    <div style={{ fontSize: "40px" }}>🔒</div>
                    <div style={{ fontWeight: "bold" }}>Security Alert</div>
                    <div style={{ fontSize: "12px", maxWidth: "400px" }}>
                        {devToolsOpen
                            ? "Developer tools detected. Please close DevTools to continue watching."
                            : "Suspicious activity detected. Video playback has been paused for security reasons."}
                    </div>

                    <button
                        onClick={() => {
                            setDevToolsOpen(false);
                            setSecurityWarning(false);
                            if (autoplay) {
                                try {
                                    playerRef.current?.play?.();
                                } catch (e) { }
                            }
                        }}
                        style={{
                            marginTop: 8,
                            padding: "6px 10px",
                            background: "#1f2937",
                            color: "#fff",
                            border: 0,
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        Continue
                    </button>
                </div>
            )}

            {isLoading && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.8)",
                        zIndex: 10,
                    }}
                >
                    <Spin
                        indicator={
                            <LoadingOutlined style={{ fontSize: 48, color: "#fff" }} spin />
                        }
                    />
                </div>
            )}

            {error && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        background: "rgba(0,0,0,0.9)",
                        fontSize: "14px",
                        padding: "20px",
                    }}
                >
                    {error}
                </div>
            )}

            {watermark && (
                <div
                    style={{
                        position: "absolute",
                        [watermark.position?.includes("top") ? "top" : "bottom"]: 16,
                        [watermark.position?.includes("right") ? "right" : "left"]: 16,
                        background: "rgba(0,0,0,0.5)",
                        color: "rgba(255,255,255,0.6)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "8px",
                        fontWeight: "600",
                        zIndex: 100,
                    }}
                >
                    {watermark.text}
                </div>
            )}

            <iframe
                ref={iframeRef}
                src={iframeUrl}
                title={video.title || "Video Player"}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
                referrerPolicy="no-referrer"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                }}
            />
        </div>
    );
};

export default UniversalVideoPlayerSystem;

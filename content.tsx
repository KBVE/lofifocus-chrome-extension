import { useMessage } from "@plasmohq/messaging/hook"
import React from "react";
import loadingSpeech from "url:~assets/loading-speech-2.wav"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoMountShadowHost } from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector("body")

export const mountShadowHost: PlasmoMountShadowHost = ({
    shadowHost,
    anchor,
    mountState,
}) => {
    anchor.element.appendChild(shadowHost)
}

const Play = () => {
    const audioRef = React.useRef()
    const [currentSongUrl, setCurrentSongUrl] = React.useState(loadingSpeech)
    const [playing, setPlaying] = React.useState(false)

    const play = (url?: string) => {
        if (url && audioRef?.current !== undefined) {
            setCurrentSongUrl(url)
            if (audioRef.current) {
                // @ts-ignore
                audioRef.current.pause()
                // @ts-ignore
                audioRef.current.load()
                // @ts-ignore
                audioRef.current.volume = .5
                // @ts-ignore
                audioRef.current.play()
            }

            
            // let pauseCommand = audioRef.current.pause()
            // if (pauseCommand !== undefined)
            //     pauseCommand.then(_ => {
            //         // @ts-ignore
            //         audioRef.current.currentTime = 0;
            //         setCurrentSongUrl(url)
            //         setPlaying(true)
            //         // @ts-ignore
            //         audioRef.current.play();
            //     })
            //         .catch(error => console.error(error));
        }
        if (!url && audioRef?.current !== undefined) {
            setPlaying(true)
            // @ts-ignore
            audioRef.current.play();
        }
    }
    const pause = () => {
        if (audioRef?.current !== undefined) {
            // @ts-ignore
            audioRef.current.pause();
        }
    }
    const stop = () => {
        if (audioRef?.current !== undefined) {
            // @ts-ignore
            audioRef.current.pause();
            // @ts-ignore
            audioRef.current.currentTime = 0;
        }
    }

    const onPlaying = () => {
        // @ts-ignore
        if (audioRef?.current !== undefined && audioRef.current.paused)
            setPlaying(false);
    }

    useMessage<string, string>(async (req, res) => {
        const { name } = req;
        if (name === "play intro") {
            play()

            res.send("Playing Intro")
        }
        if (name === "play") {
            const url = req.body;
            play(url)

            res.send("Playing")
        }
        if (name === "pause") {
            pause()

            res.send("Paused")
        }
        if (name === "stop") {
            stop()

            res.send("Stopped")
        }
    })

    return (
        <>
            <audio
                controls
                ref={audioRef}
                onTimeUpdate={onPlaying}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            >
                <source src={currentSongUrl} type='audio/wav' />
            </audio>
        </>
    )
}

export default Play;
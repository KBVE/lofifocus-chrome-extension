import React from "react"
import lofiBackground from "data-base64:~assets/lofi-background.mp4"
import cssText from "data-text:~/overlay.css"
import loadingSpeech from "data-base64:~assets/loading-speech.mp3"
import lofifocusv2 from "data-base64:~assets/lofifocusv2.gif"
// @ts-ignore
import * as style from './overlay.css'
import { sendToContentScript, sendToBackground } from "@plasmohq/messaging"
// import type { PlasmoCSConfig } from "plasmo"

// export const config: PlasmoCSConfig = {
//   matches: ["<all_urls>"],
// }

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  console.log('Gotten style: ', cssText)
  return style
}

function IndexPopup() {
  const [playerState, setPlayerState] = React.useState("None")

  const sendPlayMessage = async () => {
    console.log("Sending to Content Script...")
    let contentScriptResponse = await sendToContentScript({
      name: "play intro",
    })
    setPlayerState(contentScriptResponse)

    console.log(contentScriptResponse)
    // alert(resp)

    console.log("Sending to Background Script...")
    let fetchedSongURL = await sendToBackground({
      name: "fetchSong",
    })
    console.log("Song URL: ", fetchedSongURL)

    console.log("Sending to Content Script...")
    contentScriptResponse = await sendToContentScript({
      name: "play",
      body: fetchedSongURL
    })

    setPlayerState(contentScriptResponse)
    console.log(contentScriptResponse)
  }

  return (
    <div className="root" style={{
      minWidth: '420px',
      aspectRatio: 492 / 270,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      <video autoPlay muted loop id="lofi-background" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        backgroundColor: '#130146',
      }} className="main">
        <source className={style.glitch2} src={lofiBackground} type="video/mp4" />
      </video>
      <div className="lines"></div>
      <div className="main">
        <div className="noise"></div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}>
          <img
            style={{
              opacity: 0.8,
              position: "relative",
              left: -85,
              top: -10,
            }}
            src={lofifocusv2}
          />
          {/* <h2 style={{
            fontFamily: "VT323",
            fontSize: 48,
            margin: 0,
            color: "rgba(255, 255, 255, 0.8)",
            position: 'absolute',
            top: 16,
            right: 8,
          }}>
            Lofi Focus
          </h2> */}
          <button
            // onClick={() => {
            //   let tempSnd = snd;
            //   tempSnd.currentTime = 0;
            //   setSnd(tempSnd);
            //   snd.play();
            // }}
            onClick={sendPlayMessage}
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              border: 0,
              backgroundColor: 'transparent',
            }}
          >
            <h2 style={{
              fontFamily: "VT323",
              fontSize: 36,
              margin: 0,
              color: "rgba(255, 255, 255, 0.8)",
            }}>
              PLAY ▸
            </h2>
          </button>
          <button
            onClick={() => { }}
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
              border: 0,
              backgroundColor: 'transparent',
            }}
          >
            <h2 style={{
              fontFamily: "VT323",
              fontSize: 28,
              margin: 0,
              color: "rgba(255, 255, 255, 0.8)",
            }}>
              ↻ Being Kind
            </h2>
          </button>
          <h2 style={{
            fontFamily: "VT323",
            fontSize: 14,
            margin: 0,
            color: "rgba(255, 255, 255, 0.6)",
            position: "absolute",
            top: 0,
            left: 0,
          }}>
            {/* https://giphy.com/gifs/8bit-Basrh159dGwKY */}
            Background Video Credit to&nbsp;
            <a
              href="https://1041uuu.tumblr.com/"
              target="_blank"
              style={{
                color: "rgba(255, 255, 255, 0.7)"
              }}
            >
              1041uuu on Tumblr
            </a>
          </h2>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup

import { useRecoilState } from "recoil";
import UseSpotify from "./useSpotify";
import { currentTrackIdState } from "@/atoms/songAtom";
import { useEffect, useState } from "react";

function useSonginfo() {
  const spotifypi = UseSpotify();
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songinfo, setsonginfo] = useState(null);
  useEffect(() => {
    const fetchsonginfo = async () => {
      if (currentTrackId) {
        const trackinfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifypi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setsonginfo(trackinfo);
      }
    };
    fetchsonginfo();
  }, [currentTrackId, spotifypi]);
  return songinfo;
}

export default useSonginfo;

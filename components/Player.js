import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSonginfo from "@/hooks/useSonginfo";
import UseSpotify from "@/hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { VolumeOffIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";
const Player = () => {
  const spotifypi = UseSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isplaying, setisplaying] = useRecoilState(isPlayingState);
  const [volume, setvolume] = useState(50);
  const songinfo = useSonginfo();
  const fetchcurrentsong = async () => {
    if (!songinfo) {
      await spotifypi.getMyCurrentPlayingTrack().then((data) => {
        setcurrentTrackId(data.body?.item?.id);
        spotifypi.getMyCurrentPlaybackState().then((data) => {
          console.log(data.body?.is_playing);
          setisplaying(data.body?.is_playing);
        });
      });
    }
  };
  const handleplaypause = async () => {
    await spotifypi.getMyCurrentPlaybackState().then((data) => {
      console.log(data);
      if (data.body.is_playing) {
        spotifypi.pause();
        setisplaying(false);
      } else {
        spotifypi.play();
        setisplaying(true);
      }
    });
  };
  useEffect(() => {
    if (spotifypi.getAccessToken() && !currentTrackId) {
      fetchcurrentsong();
      setvolume(100);
    }
  }, [currentTrackIdState, spotifypi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncevolume(volume);
    }
  }, [volume]);
  const debouncevolume = useCallback(
    debounce((volume) => {
      spotifypi.setVolume(volume).catch((err) => {
        err;
      });
    }, 500),
    []
  );
  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900
     text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 "
    >
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songinfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songinfo?.name}</h3>
          <p>{songinfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        {isplaying ? (
          <PauseIcon onClick={handleplaypause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handleplaypause} className="button w-10 h-10" />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeOffIcon
          onClick={() => volume > 0 && setvolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setvolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setvolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;

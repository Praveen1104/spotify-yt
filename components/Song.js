import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import UseSpotify from "@/hooks/useSpotify";
import { millistominute } from "@/lib/time";
import { useRecoilState } from "recoil";

const Song = ({ order, track }) => {
  const spotifypi = UseSpotify();
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isplaying, setisplaying] = useRecoilState(isPlayingState);

  const playsong = async () => {
    setcurrentTrackId(track.track.id);
    setisplaying(true);
    spotifypi.play({
      uris: [track.track.uri],
    });
  };
  return (
    <div
      className="grid grid-cols-2  text-gray-500 py-4 px-5 hover:bg-gray-900 
    rounded-lg cursor-pointer"
      onClick={playsong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          src={track.track.album.images[0].url}
          className="h-10 w-10"
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden w-40 md:inline">{track.track.album.name}</p>
        <p>{millistominute(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default Song;

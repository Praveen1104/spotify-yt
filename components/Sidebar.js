import { playlistIdstate } from "@/atoms/playlistAtoms";
import UseSpotify from "@/hooks/useSpotify";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [playlist, setplaylist] = useState([]);
  const [playlistid, setplaylistid] = useRecoilState(playlistIdstate);

  const spotifypi = UseSpotify();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    async function callplaylist() {
      /*
      if (session && session.user?.accessToken) {
        setat(session.user?.accessToken)

        const response=await fetch("https://api.spotify.com/v1/me/playlists",{
          headers:{
            Authorization: `Bearer ${session.user?.accessToken}`
          }
        })
        console.log(response.body)
        const data=await response.json()
        console.log(data)

        setplaylist(data.items)
      }
      */
      if (spotifypi.getAccessToken()) {
        const data = await spotifypi.getUserPlaylists();
        setplaylist(data.body.items);
      }
    }

    callplaylist();
  }, [session, spotifypi]);

  return (
    <div
      className="text-gray-500 p-5 text-xs lg:text-sm   border-r border-gray-900 
     overflow-y-scroll  scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36"
    >
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <p>Log out</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center  space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {playlist.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setplaylistid(playlist.id)}
            className="cursor-pointer hover:text-white"
          >
            {" "}
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

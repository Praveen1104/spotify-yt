import spotifyapi from "@/lib/spotify";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const UseSpotify = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "Refreshtokenerror") {
        signIn();
      }
      spotifyapi.setAccessToken(session.user.accessToken);
    }
  }, [session]);
  return spotifyapi;
};

export default UseSpotify;

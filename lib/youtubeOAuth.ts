const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.upload";
const CALLBACK_PATH = "/auth/youtube/callback";

export function getYouTubeRedirectUri(): string {
  return `${window.location.origin}${CALLBACK_PATH}`;
}

export function openYouTubeOAuthPopup(onCode: (code: string, redirectUri: string) => void): void {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
    return;
  }

  const redirectUri = getYouTubeRedirectUri();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YOUTUBE_SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const popup = window.open(oauthUrl, "youtube-oauth", "width=500,height=650,scrollbars=yes");

  if (!popup) return;

  const listener = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === "youtube-oauth-code") {
      window.removeEventListener("message", listener);
      onCode(event.data.code as string, redirectUri);
    }
  };

  window.addEventListener("message", listener);
}

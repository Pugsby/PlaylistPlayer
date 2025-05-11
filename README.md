# Playlist Player
## Playlist Format
Playable files must be audio files, non-audio files will be ignored (except images).<br>
If you want a playlist, you must create a folder and place your audio files in it.<br>
If you have multiple folders, you will be able to hear each audio file in each folder<br>
### Cover Art
By default, the cover art will be the first image file with name "allSongs," regardless of the extension. this has lowest priority<br>
If the song has a cover art image embedded within it, it will be used instead of the default cover art. This has second priority<br>
If there is a image with the same name of a song, it will be used as the cover art for that song, also regardless of the extension. This has top priority<br>
### Supported Formats
- Audio: mp3, ogg, wav, flac
- Image: jpg, jpeg, png, gif
## Features
- Playlists (obviously)
- Cover art
- Play, pause, next, previous, shuffle, repeat
## How to use YouTube Playlists
YouTube playlists are not natively supported and must be downloaded manually
### How to download YouTube Playlists
#### Manual
1. Create a folder
2. Download <a href=https://github.com/yt-dlp/yt-dlp>yt-dlp</a>
3. Place yt-dlp in the folder
4. Open a terminal and navigate to the folder
5. Run the following command:
```bash
youtube-dlp.exe -x --audio-format mp3 --embed-thumbnail -o "%(title)s.%(ext)s" <playlist url>
```
6. Wait for the download to finish
7. (Optional) Delete the yt-dlp executable
#### Auto
1. Download <a href="https://github.com/Pugsby/YouTubeDownloader/tree/main">Youtube Downloader</a>
2. Download the playlist using the tool.
## Website
<a href="https://pugsby.github.io/PlaylistPlayer">pugsby.github.io/PlaylistPlayer</a>

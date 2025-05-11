var shuffling = false;
function attachHoverSound() {
    document.querySelectorAll('button').forEach(button => {
        if (!button.hasAttribute('data-hover-sound')) {
            button.setAttribute('data-hover-sound', 'true');
            button.addEventListener('mouseover', () => {
                const audio = new Audio('hover.mp3');
                audio.play();
            });
            button.addEventListener('click', () => {
                const audio = new Audio('click.mp3');
                audio.play();
            });
        }
    });
}

attachHoverSound();

const observer = new MutationObserver(() => {
    attachHoverSound();
});

observer.observe(document.body, { childList: true, subtree: true });

document.getElementById("folderUpload").addEventListener("change", function(event) {
    const supportedAudioTypes = [
        "audio/mpeg",    // .mp3
        "audio/wav",     // .wav
        "audio/ogg",     // .ogg
        "audio/mp4",     // .mp4, .m4a
        "audio/webm",    // .webm
        "audio/aac",     // .aac
    ];
    const audioFiles = Array.from(event.target.files).filter(file =>
        supportedAudioTypes.includes(file.type)
    );
    const musicList = document.getElementById("songNames");
    const colors = [
        "rosewater", "flamingo", "pink", "mauve", "red", "maroon",
        "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender"
    ];
    var id = 0;
    audioFiles.forEach(file => {
        id++;
        const color = colors[id % colors.length];
        const button = document.createElement("button");
        button.style.setProperty('--buttonBg', `var(--${color})`);
        button.textContent = file.name.replace(/\.[^/.]+$/, "");
        button.title = file.webkitRelativePath || file.name;
        button.associatedId = id;
        button.addEventListener("click", () => {
            playSong(file, button.associatedId, event.target.files);
        });
        musicList.appendChild(button);
    });
    document.getElementById("upload").innerHTML = "";
    console.log("Audio files:", audioFiles);
    document.getElementById("player").style.display = "block";
    
});
function playSong(file, id, files) {
    const audio = new Audio(URL.createObjectURL(file));
    audio.controls = true;
    fetch('player.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("player").innerHTML = html;
            document.getElementById("player").appendChild(audio);
            audio.style.display = "none";
            audio.play();
            const cover = document.getElementById("cover");
            const songNameNoExt = file.name.replace(/\.[^/.]+$/, "");
            const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
            let foundImage = null;

            // First, try to find image matching song name
            for (const ext of imageExtensions) {
                const imageName = songNameNoExt + ext;
                const imageFile = Array.from(files).find(f =>
                    f.name === imageName && f.webkitRelativePath.startsWith(file.webkitRelativePath.substring(0, file.webkitRelativePath.lastIndexOf("/")))
                );
                if (imageFile) {
                    foundImage = imageFile;
                    break;
                }
            }

            // Only if not found, try "allSongs"
            if (!foundImage) {
                for (const ext of imageExtensions) {
                    const imageName = "allSongs" + ext;
                    const imageFile = Array.from(files).find(f =>
                        f.name === imageName && f.webkitRelativePath.startsWith(file.webkitRelativePath.substring(0, file.webkitRelativePath.lastIndexOf("/")))
                    );
                    if (imageFile) {
                        foundImage = imageFile;
                        break;
                    }
                }
            }

            // Set cover src if found
            if (foundImage) {
                cover.src = URL.createObjectURL(foundImage);
            } else {
                jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        if (tag.tags.picture) {
                            const { data, format } = tag.tags.picture;
                            let byteArray = new Uint8Array(data);
                            let blob = new Blob([byteArray], { type: format });
                            cover.src = URL.createObjectURL(blob);
                        } else {
                            cover.src = "default-cover.png";
                        }
                    },
                    onError: function() {
                        cover.src = "default-cover.png";
                    }
                });
            }
            document.getElementById("name").textContent = file.name.replace(/\.[^/.]+$/, "");
            document.getElementById("name").classList.add("centerText");
            document.getElementById("path").textContent = file.webkitRelativePath || file.name;
            document.getElementById("path").classList.add("centerText");
            document.getElementById("path").style.color = "var(--subtext-0)";
            audio.addEventListener("ended", () => {
                if (!shuffling) {
                    URL.revokeObjectURL(audio.src);
                    const buttons = Array.from(document.getElementById("songNames").querySelectorAll("button"));
                    const nextIndex = (id) % buttons.length;
                    buttons[nextIndex].click();
                }
                if (shuffling) {
                    const buttons = Array.from(document.getElementById("songNames").querySelectorAll("button"));
                    const randomIndex = Math.floor(Math.random() * buttons.length);
                    buttons[randomIndex].click();
                }
            });
            document.getElementById("playPause").addEventListener("click", () => {
                const audio = document.querySelector("audio");
                if (audio) {
                    if (audio.paused) {
                        audio.play();
                        document.getElementById("playPause").textContent = "⏸️";
                    } else {
                        audio.pause();
                        document.getElementById("playPause").textContent = "▶️";
                    }
                    twemoji.parse(document.getElementById("playPause"), twemojiConfig);
                }
            });
            document.getElementById("prev").addEventListener("click", () => {
                const buttons = Array.from(document.getElementById("songNames").querySelectorAll("button"));
                const prevIndex = (id - 2 + buttons.length) % buttons.length;
                buttons[prevIndex].click();
            });
            document.getElementById("next").addEventListener("click", () => {
                URL.revokeObjectURL(audio.src);
                const buttons = Array.from(document.getElementById("songNames").querySelectorAll("button"));
                const nextIndex = (id) % buttons.length;
                buttons[nextIndex].click();
            });
            document.getElementById("shuffle").addEventListener("click", () => {
                shuffling = !shuffling;
                if (!shuffling) {
                    document.getElementById("shuffle").textContent = "🔀";
                }
                if (shuffling) {
                    document.getElementById("shuffle").textContent = "🔁";
                }
                twemoji.parse(document.getElementById("shuffle"), twemojiConfig);
            });
        });
}

const twemojiConfig = {
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
};

function parseTwemojiOnTextNodes(element) {
    if (!element) return;
    // Only parse if element contains text nodes or is an element node
    if (element.nodeType === Node.ELEMENT_NODE) {
        twemoji.parse(element, twemojiConfig);
        Array.from(element.childNodes).forEach(child => parseTwemojiOnTextNodes(child));
    }
}

// Observe changes to text content and added nodes
const twemojiObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    parseTwemojiOnTextNodes(node);
                }
            });
        }
        if (mutation.type === 'characterData') {
            parseTwemojiOnTextNodes(mutation.target.parentNode);
        }
    });
});

// Start observing the body for changes
twemojiObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

// Initial parse
parseTwemojiOnTextNodes(document.body);
const API_KEY = 'AIzaSyD8Xi7C_6dow9y11i20ZQWnlC12b17FlXc';  // Replace with your actual API key

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 11; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
    // Add more user agents as needed
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function fetchYouTubeData() {
    let input = document.getElementById('channelId').value.trim();
    if (!input) {
        alert('Please enter a YouTube Channel ID or Username');
        return;
    }

    let channelId = input;

    if (input.startsWith('@')) {
        // If the input starts with @, it's a username
        const username = input.substring(1);
        try {
            const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=id&type=channel&q=${username}&key=${API_KEY}`, {
                headers: {
                    'User-Agent': getRandomUserAgent(),
                    'Referer': 'https://www.youtube.com/',
                    'Origin': 'https://www.youtube.com'
                }
            });
            if (!searchResponse.ok) {
                throw new Error(`HTTP error! status: ${searchResponse.status}`);
            }
            const searchData = await searchResponse.json();
            if (!searchData.items || searchData.items.length === 0) {
                alert('No channel found for this username');
                return;
            }
            channelId = searchData.items[0].id.channelId;  // Extract the channel ID directly
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
            alert(`Failed to fetch YouTube data: ${error.message}`);
            return;
        }
    }

    try {
        // Fetch channel information
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${API_KEY}`, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com'
            }
        });
        if (!channelResponse.ok) {
            throw new Error(`HTTP error! status: ${channelResponse.status}`);
        }
        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            alert('No data found for this Channel ID');
            return;
        }

        const channel = channelData.items[0];

        // Fetch latest video from the channel
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1&key=${API_KEY}`, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.youtube.com/',
                'Origin': 'https://www.youtube.com'
            }
        });
        if (!videoResponse.ok) {
            throw new Error(`HTTP error! status: ${videoResponse.status}`);
        }
        const videoData = await videoResponse.json();

        if (!videoData.items || videoData.items.length === 0) {
            alert('No videos found for this Channel');
            return;
        }

        const latestVideo = videoData.items[0];
        const videoInfo = {
            title: latestVideo.snippet.title,
            publishedAt: new Date(latestVideo.snippet.publishedAt).toLocaleDateString(),
            thumbnail: latestVideo.snippet.thumbnails.medium.url
        };

        // Display channel and video information
        const channelInfo = `
            <div>
                <img src="${channel.snippet.thumbnails.medium.url}" alt="Channel Thumbnail">
                <div>
                    <h2>${channel.snippet.title}</h2>
                    <p><strong>Description:</strong> ${channel.snippet.description}</p>
                    <p><strong>Total Views:</strong> ${channel.statistics.viewCount}</p>
                    <p><strong>Number of Videos:</strong> ${channel.statistics.videoCount}</p>
                    <p><strong>Youtubers Live Subscriber Count:</strong> ${channel.statistics.subscriberCount}</p>
                    <p><strong>Last Video Published At:</strong> ${videoInfo.publishedAt}</p>
                    <p><strong>Latest Video:</strong> ${videoInfo.title}</p>
                    <img src="${videoInfo.thumbnail}" alt="Latest Video Thumbnail">
                </div>
            </div>
        `;
        document.getElementById('channelData').innerHTML = channelInfo;
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        alert(`Failed to fetch YouTube data: ${error.message}`);
    }
}
function howToUse() {
    alert("This is how you use the app...");
}

function contactUs() {
    alert("Contact us at contact@example.com");
}
const API_KEY = 'AIzaSyDIDOLfYVNHqFGfqkN3xNyAweG_R572ZcE'; // 실제 YouTube API 키로 교체

document.getElementById('searchButton').addEventListener('click', searchVideos);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchVideos();
    }
});

async function searchVideos() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) return;

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=video&maxResults=10&order=viewCount&key=${API_KEY}`);
        const data = await response.json();

        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const statsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`);
        const statsData = await statsResponse.json();

        displayResults(data.items, statsData.items);
    } catch (error) {
        console.error('Error:', error);
        alert('검색 중 오류가 발생했습니다.');
    }
}

function displayResults(videos, stats) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    videos.forEach((video, index) => {
        const videoStats = stats[index].statistics;
        const viewCount = parseInt(videoStats.viewCount).toLocaleString();

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}" class="thumbnail">
            <div class="video-info">
                <h3 class="video-title">${video.snippet.title}</h3>
                <p class="video-stats">조회수: ${viewCount}회</p>
            </div>
        `;

        videoCard.addEventListener('click', () => {
            window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank');
        });

        resultsContainer.appendChild(videoCard);
    });
}

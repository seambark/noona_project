let newsList = [];
let myNetlify = "https://noona-study-site.netlify.app";
// let noonaNetlify = "http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com";
const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    
    newsList = data.articles;

    render();
    console.log(newsList)
}

function errorCheck(s){
 console.log(this)
}

const render = () => {
    const newHTML = newsList.map((news) => 
        `<li>
            <div class="news">
                <div class="img">
                    <img src="${news.urlToImage}" alt="" onerror="${myNetlify}/news/ico_no_pictures.png">
                </div>
                <div class="txt">
                    <div class="cont">
                        <strong class="title">${news.title}</strong>
                        <p>${news.description}</p>
                    </div>
                    <div class="source">
                        <span>${news.source.name}</span>
                        <span>${news.publishedAt}</span>
                    </div>
                </div>
            </div>
        </li>
        `
    ).join('');

    document.getElementById('news_list').innerHTML = newHTML;
}

getNewsAPI();
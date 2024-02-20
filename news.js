let news = [];
let myNetlify = "https://noona-study-site.netlify.app";
let noonaNetlify = "http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com";
const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    
    news = data.articles;

    console.log(news)
}

getNewsAPI();
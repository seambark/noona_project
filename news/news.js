let newsList = [];
let myNetlify = "https://noona-study-site.netlify.app";
let dateMoment = moment();


// let noonaNetlify = "http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com";
const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines`);
    const response = await fetch(url);
    const data = await response.json();
    
    newsList = data.articles;

    render();
    

}

// function errorCheck(){
//     let imgAll = document.querySelectorAll(".news .img img");

//     for(i=0; i<imgAll.length;i++){
//         console.log(imgAll[i].height)
//         console.log(imgAll[i].width)
//         if(imgAll[i].height === 0) {
//             imgAll[i].setAttribute('src','ico_no_pictures.png')
//         }
//     }
 
// }

const render = () => {

    console.log(dateMoment)
    const newHTML = newsList.map(function(news) {
        let description = news.description;
        let resultDescription = '';
        if (description.length >= 200) {
            resultDescription = description.substr(0, 200 - 3) + '...';
        } else {
            resultDescription = description;
        }
      
        return (`<li>
            <div class="news">
                <div class="img">
                    <img src="${news.urlToImage==''?'이미지 없음':news.urlToImage}" alt="" />
                </div>
                <div class="txt">
                    <div class="cont">
                        <strong class="title">${news.title}</strong>
                        <p>${resultDescription==''?'내용 없음':resultDescription}</p>
                    </div>
                    <div class="source">
                        <span>${news.source.name==''?'출처 없음':news.source.name}</span>
                        <span>${moment(news.publishedAt).fromNow()}</span>
                    </div>
                </div>
            </div>
        </li>
        `
        )} ).join('');

    document.getElementById('news_list').innerHTML = newHTML;
}

getNewsAPI();
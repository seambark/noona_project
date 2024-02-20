let newsList = [];
let myNetlify = "https://noona-study-site.netlify.app";
let dateMoment = moment();
let menu = document.querySelector(".menu");
let category = '';
let categoryTxt = '';

// let noonaNetlify = "http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com";
const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines${category}`);
    const response = await fetch(url);
    const data = await response.json();
    
    newsList = data.articles;

    console.log(newsList)

    render();
}

menu.addEventListener('click',categoryList);

function categoryList(e) {
    e.preventDefault()
    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;

    if(thisTag == 'A') {
        let categoryHref = thisTarget.getAttribute('href');
        category = `?category=${categoryHref}`;
        categoryTxt = thisTarget.innerText;

        getNewsAPI();
    }
}

const render = () => {
    let listLength = newsList.length;
    let newHTML = ``;

    if(listLength > 0){
        newHTML = newsList.map(function(news) {
            let description = news.description;
            let resultDescription = '';
            if (description&&description.length >= 200) {
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
    } else {
        newHTML = `<li class="no_data"><b>${categoryTxt}</b> 관련 뉴스가 없습니다.</li>`;
    }

    document.getElementById('news_list').innerHTML = newHTML;
}

getNewsAPI();
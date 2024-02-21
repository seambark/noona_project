let newsList = [];
let myNetlify = "https://noona-study-site.netlify.app";
let dateMoment = moment();
let menu = document.querySelector(".menu");
let menuList = document.querySelector(".menu ul");
let searchInput = document.querySelector("#search_input");
let inputSet = document.querySelector('.input_set');
let searchBtn = document.querySelector(".search_btn");
let resetBtn = document.querySelector(".reset_btn");
let paging = document.querySelector(".paging");
let urlNoImg = "ico_no_pictures.png";
let category = '';
let noDateTxt = '';
let keyword = '';
let page = 1;
let pageSize = 10;
let newsTotal;

menu.addEventListener('click',categoryList);
searchBtn.addEventListener('click',searchList);
menuList.addEventListener('click',tabActive);
resetBtn.addEventListener('click',searchReset);

searchInput.addEventListener("keyup", function(e) {
    let resetOn = inputSet.classList.contains('on');
 
    if(!resetOn){
        inputSet.classList.add('on');
    }
});

function searchReset(e) {
    keyword='';
    searchInput.value = '';
    inputSet.classList.remove('on');
    getNewsAPI();
};

const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines?category=${category}&q=${keyword}&page=${page}&pageSize=${pageSize}`);
    decodeURI(url)
    const response = await fetch(url);
    const data = await response.json();
    
    newsList = data.articles;
    newsTotal = data.totalResults;

    console.log(newsTotal)
    console.log(newsList)
    
    render();

    if(newsList.length > 0) {
        let newImg = document.querySelectorAll(".news .img img");
        ImgCheck(newImg)
    }
}

function categoryList(e) {
    e.preventDefault()
    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;

    if(thisTag == 'A') {
        let categoryHref = thisTarget.getAttribute('href');
        category = categoryHref == 'all'?'':`${categoryHref}`;
        noDateTxt = thisTarget.innerText;

        // keyword = '';

        getNewsAPI();
    }
}

function searchList() {
    let inputValue = searchInput.value;

    if(inputValue !== '') {
        keyword = `${inputValue}`;
        // category ='';
        noDateTxt = inputValue;

        getNewsAPI();

    } else {
        alert('검색할 내용을 입력해주세요!')
    }

}

const render = () => {
    let listLength = newsList.length;
    let newHTML = ``;

    if(listLength > 0){
        newHTML = newsList.map(function(news) {
            let description = news.description;
            let resultDescription = '';
            if (description && description.length >= 200) {
                resultDescription = description.substr(0, 200 - 3) + '...';
            } else {
                resultDescription = description;
            }
            let resultImg = news.urlToImage;

            return (`<li>
                <div class="news">
                    <div class="img">
                        <img src="${resultImg}" alt=""/>
                    </div>
                    <div class="txt">
                        <div class="cont">
                            <strong class="title">${news.title}</strong>
                            <p>${resultDescription == '' || !resultDescription ? '내용 없음' : resultDescription}</p>
                        </div>
                        <div class="source">
                            <span>${news.source.name == '' | !news.source.name ? '출처 없음' : news.source.name}</span>
                            <span>${moment(news.publishedAt).fromNow()}</span>
                        </div>
                    </div>
                </div>
            </li>
            `
            )} ).join('');
    } else {
        newHTML = `<li class="no_data"><b>${noDateTxt}</b> 관련 뉴스가 없습니다.</li>`;
    }

    document.getElementById('news_list').innerHTML = newHTML;
}

function ImgCheck(e) {
    let Img = new Image();

    for(i=0; i< e.length; i++) {
        Img.src = e[i].getAttribute('src');
        e[i].addEventListener('error', function(){
            this.setAttribute("src",urlNoImg)
        })
    }
}

function tabActive(e) {
    let menuLi = menuList.children;

    if(!e) {
        return menuLi[0].classList.add("on")
    }

    e.preventDefault();

    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;

    if(thisTag == 'A') {
        for(i=0; i<menuLi.length; i++) {
            menuLi[i].classList.remove('on');
        }
        
        thisTarget.parentNode.classList.add('on')
    }
  
}

tabActive();

getNewsAPI();



// paging.addEventListener('click',pagingEvent);

// function pagingEvent(currentPage) {
//     console.log(this)
//     let pagingTotal = Math.ceil(newsTotal/10);
//     let pageGroup = Math.ceil(currentPage/5);

//     let last = pageGroup*5;
//     if(last > pagingTotal) {
//         last = pagingTotal
//     }
//     let first = last - (5-1) <=0?1:last-(5-1);

//     console.log(pagingTotal)
//     console.log(pageGroup)
//     console.log(last)
//     console.log(first)

// }
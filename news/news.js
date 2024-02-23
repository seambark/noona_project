let newsList = [];
let myNetlify = "https://noona-study-site.netlify.app";
let dateMoment = moment();
let menu = document.querySelector(".menu");
let menuList = document.querySelector(".menu ul");
let search_open_btn = document.querySelector(".search_open_btn");
let searchInput = document.querySelector("#search_input");
let inputSet = document.querySelector('.input_set');
let searchBtn = document.querySelector(".search_btn");
let resetBtn = document.querySelector(".reset_btn");
let closeBtn = document.querySelector(".btn_close");
let openBtn = document.querySelector(".menu_open_btn");
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

search_open_btn.addEventListener('click',function(e){
    let search = e.target.parentNode;
    search.classList.toggle('active')
});

searchInput.addEventListener("keyup", function(e) {
    let resetOn = inputSet.classList.contains('on');
 
    if(!resetOn){
        inputSet.classList.add('on');
    }
});

closeBtn.addEventListener('click',function(e){
    menu.classList.remove('active');
});

openBtn.addEventListener('click',function(e){
    menu.classList.add('active');
});




function searchReset(e) {
    keyword='';
    searchInput.value = '';
    inputSet.classList.remove('on');
    getNewsAPI();
};

const getNewsAPI = async() => {
    const url = new URL(`${myNetlify}/top-headlines?category=${category}&q=${keyword}&page=${page}&pageSize=${pageSize}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(response.status === 200) {

            if(data.articles.length === 0) {
                throw new Error("관련 뉴스가 없습니다.");
            }

            newsList = data.articles;
            newsTotal = data.totalResults;
            console.log(newsList)
            render();

            if(newsList.length > 0) {
                let newImg = document.querySelectorAll(".news .img img");
                ImgCheck(newImg)
            }

        } else {
            throw new Error(data.message)
        }
        

    } catch(error) {
        errorRender(error.message)
    }

    

    // pagingEvent()
}

function categoryList(e) {
    e.preventDefault()
    let thisTarget = e.target;
    let thisTag = thisTarget.tagName;

    if(thisTag == 'A') {
        let categoryHref = thisTarget.getAttribute('href');
        category = categoryHref == 'all'?'':`${categoryHref}`;
        noDateTxt = thisTarget.innerText;

        getNewsAPI();
    }
}

function searchList() {
    let inputValue = searchInput.value;

    if(inputValue !== '') {
        keyword = `${inputValue}`;
        noDateTxt = inputValue;

        getNewsAPI();

    } else {
        alert('검색할 내용을 입력해주세요!')
    }

}

// const imgError = (image) => {
// 	image.onerror = null; // 이미지 에러 핸들러를 중복 호출하지 않도록 이벤트 리스너를 제거합니다.
// 	image.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
// };

const errorRender = (message) => {
    let errorHTML = `
        <li class="no_data">
            ${keyword!=="" || category !== "" ? `<b>${keyword} ${category}</b>` : ''} ${message}
        </li>`;

    document.getElementById('news_list').innerHTML = errorHTML;
}

const render = () => {
    let newHTML = ``;

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


// 유저는 5개의 페이지를 한번에 볼 수 있다.
// 현재 보고있는 페이지는 갈색박스로 표시가 된다.
// < > 버튼을 통해 다음 페이지로 이동할 수 있다.
// << >> 버튼을 통해 제일 처음과 제일 끝 페이지로 이동할 수 있다.
// 첫 페이지 그룹에 있으면 (1~5) <<  <  버튼은 사라진다.
// 제일 끝 페이지 그룹에 있으면   >  >>  버튼은 사라진다.

// API를 통해서 알수있는정보
// totalResult : 총 몇개의 결과가 있는지
// page : 현재 보고있는 페이지

// 우리가 정해야하는 정보
// pageSize : 한번에 몇개의 데이터를 가져올지, (API문서에서 정한 기본값은 20개이다.)
// groupSize : 한번에 몇개의 페이지를 페이지네이션에서 보여줄지

// 생각해야 할 점
// 총 결과의 개수를 가지고 몇개의 페이지가 필요한지 알 수 있을까?
// 현재 페이지를 가지고 몇번째 페이지 그룹인지 어떻게 알 수 있을까?
// 페이지 그룹번호를 가지고 어떻게 그 그룹의 마지막 페이지와 첫번째 페이지를 알 수 있을까?


// paging.addEventListener('click',pagingEvent);

// function pagingEvent() {
//     console.log(this)
//     let pagingTotal = Math.ceil(newsTotal/10);
//     let pageGroup = Math.ceil(page/5);

//     let last = pageGroup * 5;
//     if(last > pagingTotal) {
//         last = pagingTotal;
//     }
//     let first = last - (5 - 1) <= 0 ? 1 : last - (5 - 1);
//     let next = last + 1;
//     let prev = first - 1;

//     console.log(pagingTotal)
//     console.log(pageGroup)
//     console.log(next)
//     console.log(prev)

//     pagingRender(first,last)

// }

// function pagingRender(start,end) {
//     let newPageHtML = [];
    
//     console.log(start)
//     console.log(end)
    
//     for(i=start; i <= end; i++) {
//         newPageHtML.push(`<a href="#">${i}</a>`);

//         if(i == end){
//             document.querySelector('.page').innerHTML = newPageHtML.join('');
//         }
//     }

//    console.log(newPageHtML)
    
// }


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
let totalResults = 0;
const pageSize = 10;
const groupSize = 5;
let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");
let lastBtn = document.querySelector(".last");
let firstBtn = document.querySelector(".first");



menu.addEventListener('click',categoryList);
searchBtn.addEventListener('click',searchList);
menuList.addEventListener('click',tabActive);
resetBtn.addEventListener('click',searchReset);
paging.addEventListener('click',pageEvent);

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
    page = 1;
    getNewsAPI();
};

const getNewsAPI = async() => {
    let url = new URL(`${myNetlify}/top-headlines?category=${category}&q=${keyword}&page=${page}&pageSize=${pageSize}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(response.status === 200) {

            if(data.articles.length === 0) {
                throw new Error("관련 뉴스가 없습니다.");
            }

            newsList = data.articles;
            totalResults = data.totalResults;
            console.log(totalResults)

            render();
            pagination();
            
            let newImg = document.querySelectorAll(".news .img img");
            ImgCheck(newImg)

        } else {
            throw new Error(data.message)
        }
        

    } catch(error) {
        errorRender(error.message)
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
        page = 1;

        getNewsAPI();
    }
}

function searchList() {
    let inputValue = searchInput.value;

    if(inputValue !== '') {
        keyword = `${inputValue}`;
        noDateTxt = inputValue;
        page = 1;

        getNewsAPI();

    } else {
        alert('검색할 내용을 입력해주세요!')
    }

}

const errorRender = (message) => {
    let errorHTML = `
        <li class="no_data">
            ${keyword!=="" || category !== "" ? `<b>${keyword} ${category}</b>` : ''} ${message}
        </li>`;

    document.getElementById('news_list').innerHTML = errorHTML;
    paging.innerHTML = ``;
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




function pagination() {
    let newPageHTML = ``;
    let totalPages = Math.ceil(totalResults/pageSize);
    let pageGroup = Math.ceil(page/groupSize);

    let last = pageGroup * groupSize;

    if(last > totalPages) {
        last = totalPages;
    }

    let first = last - (groupSize - 1) <= 0 ? 1 : last - (groupSize - 1);
    let prev = Number(page) - 1;
    let next = Number(page) + 1;

    if(first !== 1) {
        newPageHTML+=`<button data-page="1" class="btn first">맨 처음</button>`;
    }

    if(prev > 0) {
        newPageHTML+=`<button data-page="${prev}" class="btn prev">이전</button>`;
    }


    for(i=first; i <= last; i++) {
        newPageHTML+=`<a data-page="${i}" class=${i==page? 'on' : ''}>${i}</a>`;
    }

    if(next <= totalPages) {
        newPageHTML+=`<button data-page="${next}" class="btn next">다음</button>`;
    }

    if(last !== totalPages) {
        newPageHTML+=`<button data-page="${totalPages}" class="btn last">맨 마지막</button>`;
    }

    paging.innerHTML = newPageHTML;
}

function pageEvent(e) {
    e.preventDefault();

    let targetTag = e.target;
    let pageNumber = targetTag.dataset.page;

    page = pageNumber;

    getNewsAPI()
}


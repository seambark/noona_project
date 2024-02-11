

// 랜덤번호 저장
// 유저가 번호를 입력한다 그리고 go 라는 버튼을 누름
// 만약에 유저가 랜덤번호를 맞추면, 맞췄습니다!
// 랜덤번호가 < 유저번호 Down!!
// 랜덤번호가 > 유저번호 Up!
// Reset 버튼을 누르면 게임이 리셋된다
// 5번의 기회를 다쓰면 게임이 끝난다 (더이상 추측 불가, 버튼이 disable)
// 유저가 1~100 범위 밖에 숫자를 입력하면 알려준다. 기회를 깍지 않는다.
// 유저가 이미 입력한 숫자를 또 입력하면 아렬준다. 기회를 깍지 않는다.

let computerNum=0;
let gameLife=5;
let gameCount=0;
let historyNum=[];
let goBtn = document.querySelector(".play_btn");
let resetBtn = document.querySelector(".reset_btn");
let gameHint = document.querySelector(".game_text .hint");
let userNumber = document.querySelector(".user_number");
let alcohol = document.querySelector(".alcohol");
let gameLeft = document.querySelector(".left");

goBtn.addEventListener("click",play)
resetBtn.addEventListener("click",gameRest)
userNumber.addEventListener("focus", function(){
    userNumber.value="";
})

function pickRandomNum() {
    computerNum = Math.floor(Math.random()*100)+1;
    console.log("정답", computerNum);
}

function gameRule(num) {
    let classCheck = gameLeft.classList.contains("on");

    if(classCheck == false) {
        gameLeft.classList.add("on");
    }

    if(historyNum.includes(num)) {
        alert(num+"은 이미 입력한 값입니다.")
        return userNumber.focus();
    }
    
    if(computerNum == num) {
        gameHint.innerHTML ="That's right"
        goBtn.disabled=true;
        return;
    } else if(computerNum != num) {
        computerNum > num? gameHint.innerHTML ="UP" : gameHint.innerHTML ="Down";
    }

    gameCount++
    counter()

    if(gameCount >= gameLife) {
        goBtn.disabled=true;
        gameLeft.classList.add("die");
        gameLeft.classList.remove("on");
    }
    
    historyNum.push(num);

    let cssStatus = 100-(gameCount*20);
    alcohol.style.transform=`translateY(${cssStatus}%)`;
}

function gameRest() {
    pickRandomNum()
    gameCount=0;
    historyNum=[];
    gameHint.innerHTML=""
    goBtn.disabled=false;
    userNumber.value="";
    alcohol.style.transform=`translateY(102%)`;
    gameLeft.classList.remove("die");
    gameLeft.classList.remove("on");

    counter();
}

function counter() {
    let count= document.querySelector(".count");
    count.innerHTML=gameLife-gameCount;
}

function play() {
    let userNumberVal = userNumber.value;

    if(userNumberVal >=1 && userNumberVal <= 100 ) {
        gameRule(userNumberVal)
    } else {
        alert("1~100 사이의 숫자를 입력하세요.")
        userNumber.focus();
    }
    
}

pickRandomNum();
counter();
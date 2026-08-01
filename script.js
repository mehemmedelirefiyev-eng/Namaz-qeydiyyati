const todayElement = document.getElementById("today");
const buttons = document.querySelectorAll(".check-btn");

const statsBtn = document.getElementById("statsBtn");
const stats = document.getElementById("stats");

const subhStat = document.getElementById("subhStat");
const zohrStat = document.getElementById("zohrStat");
const esrStat = document.getElementById("esrStat");
const megribStat = document.getElementById("megribStat");
const isaStat = document.getElementById("isaStat");

const prevDay = document.getElementById("prevDay");
const nextDay = document.getElementById("nextDay");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const monthTitle = document.getElementById("monthTitle");


const today = new Date().toISOString().split("T")[0];

let selectedDate = today;
let selectedMonth = today.substring(0,7);


let data = JSON.parse(localStorage.getItem("namazData")) || {};


if(!data.firstDate){

    data.firstDate = today;

}


if(!data.days){

    data.days = {};

}



function saveData(){

    localStorage.setItem(
        "namazData",
        JSON.stringify(data)
    );

}



function createDay(date){

    if(!data.days[date]){

        data.days[date] = {

            subh:false,
            zohr:false,
            esr:false,
            megrib:false,
            isa:false

        };

    }

}
function loadDay(date){

    createDay(date);


    todayElement.textContent = 
        "Tarix: " + date;


    buttons.forEach(btn=>{


        let prayer = btn.dataset.prayer;


        if(data.days[date][prayer]){


            btn.textContent = "✅";

            btn.classList.add("done");


        }else{


            btn.textContent = "⬜";

            btn.classList.remove("done");


        }


    });


}



loadDay(selectedDate);



buttons.forEach(btn=>{


    btn.addEventListener("click", ()=>{


        let prayer = btn.dataset.prayer;


        createDay(selectedDate);


        data.days[selectedDate][prayer] =
            !data.days[selectedDate][prayer];


        saveData();


        loadDay(selectedDate);


        if(stats.style.display === "block"){

            updateStats();

        }


    });


});



statsBtn.addEventListener("click", ()=>{


    if(stats.style.display === "block"){


        stats.style.display = "none";


    }else{


        stats.style.display = "block";


        updateStats();


    }


});
function changeDay(amount){


    let date = new Date(selectedDate);


    date.setDate(date.getDate() + amount);



    let newDate = date.toISOString().split("T")[0];



    if(newDate < data.firstDate){

        return;

    }



    let current = new Date();


    if(date > current){

        return;

    }



    selectedDate = newDate;


    loadDay(selectedDate);


}



prevDay.addEventListener("click", ()=>{


    changeDay(-1);


});



nextDay.addEventListener("click", ()=>{


    changeDay(1);


});
function updateStats(){


    let counts = {

        subh:0,
        zohr:0,
        esr:0,
        megrib:0,
        isa:0

    };



    let daysInMonth = new Date(

        selectedMonth.substring(0,4),

        selectedMonth.substring(5,7),

        0

    ).getDate();




    Object.keys(data.days).forEach(date=>{


        if(date.startsWith(selectedMonth)){


            let day = data.days[date];



            Object.keys(counts).forEach(prayer=>{


                if(day[prayer]){


                    counts[prayer]++;


                }


            });


        }


    });



    subhStat.textContent =
        counts.subh + "/" + daysInMonth;


    zohrStat.textContent =
        counts.zohr + "/" + daysInMonth;


    esrStat.textContent =
        counts.esr + "/" + daysInMonth;


    megribStat.textContent =
        counts.megrib + "/" + daysInMonth;


    isaStat.textContent =
        counts.isa + "/" + daysInMonth;

}
const monthNames = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
];


function updateMonthTitle(){


    let year = selectedMonth.substring(0,4);

    let month = Number(
        selectedMonth.substring(5,7)
    ) - 1;



    monthTitle.textContent =
        monthNames[month] + " - " + year;


}



updateMonthTitle();



prevMonth.addEventListener("click", ()=>{


    let date = new Date(selectedMonth + "-01");


    date.setMonth(date.getMonth() - 1);


    let newMonth =
        date.toISOString().substring(0,7);



    if(newMonth < data.firstDate.substring(0,7)){

        return;

    }



    selectedMonth = newMonth;


    updateMonthTitle();


    if(stats.style.display === "block"){

        updateStats();

    }


});



nextMonth.addEventListener("click", ()=>{


    let date = new Date(selectedMonth + "-01");


    date.setMonth(date.getMonth() + 1);



    let newMonth =
        date.toISOString().substring(0,7);



    let currentMonth =
        today.substring(0,7);



    if(newMonth > currentMonth){

        return;

    }



    selectedMonth = newMonth;


    updateMonthTitle();


    if(stats.style.display === "block"){

        updateStats();

    }


});
saveData();


// Statistika açıqdırsa ilk məlumatı göstər
if(stats.style.display === "block"){

    updateStats();

}

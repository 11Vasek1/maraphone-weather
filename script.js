const UI = {
    FORM: document.querySelector('form'),
    LOCATIONS: document.querySelector('.locations__container'),
    FIRST_TAB: {
        TEMP: document.querySelector('.tab-1__temp'),
        CITY: document.querySelector('.tab-1__location'),
        WEATHER: document.querySelector('.tab-1__weather'),
        LIKE: document.querySelector('.tab-1__like'),
    },
}

const SERVER = {
    URL: 'http://api.openweathermap.org/data/2.5/weather',
    KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}


UI.FORM.addEventListener('submit', submitHandler)


function submitHandler(event){
    const input = event.target.querySelector('input');
    const city = input.value;

    fetchData(city)

    

    event.preventDefault();
}

function fetchData(city){
    const url = getFetchUrl(city);

    fetch(url)
        .then( responce => responce.json() )
        .then( data => {
            checkData( data );
            tabs.fill( transformData( data ) );
        } )
        .catch( error => alert(error.message) )
}

function getFetchUrl(city){
    return `${SERVER.URL}?q=${city}&appid=${SERVER.KEY}&units=metric`;
}

function checkData(data){
    if (data.cod === "404") {
        throw new Error(data.message)
    }
}

function transformData(data){
    const temp = Math.round(data.main.temp) + '°';
    const city = data.name;
    const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    return {
        temp,
        city,
        weatherIconUrl,
    }
}

const tabs = {
    fill(data){
        this.fillFirstTab(data);
    },

    fillFirstTab(data){
        const changeText = this.changeContentConstructor('FIRST_TAB', 'textContent');
        const changeSrc = this.changeContentConstructor('FIRST_TAB', 'src' );

        changeText('TEMP', data.temp);
        changeText('CITY', data.city);
        changeSrc('WEATHER', data.weatherIconUrl);

        if (locations.isLike(data.city)) {
            like.fill();
        }else{
            like.unfill();
        }
    },

    changeContentConstructor(tab, attribute){
        return function (element, data){
            UI[tab][element][attribute] = data
        }
    },
}



const like = {
    element: UI.FIRST_TAB.LIKE,
    fill(){
        this.element.classList.add('like_fill')
    },
    unfill(){
        this.element.classList.remove('like_fill')
    },
    toggle(){
        this.element.classList.toggle('like_fill')
    },
}

like.element.addEventListener('click', likeClickHandler);

function likeClickHandler(){
    const city = UI.FIRST_TAB.CITY.textContent;

    if( locations.isLike(city) ){
        locations.delete(city);
    }else{
        locations.add(city);
    }
    like.toggle();

    locations.redraw();
}

const locations = {
    list: [
        "Moscow",
        "Korolyov",
    ],

    redraw(){
        UI.LOCATIONS.innerHTML = '';

        this.sortList();

        this.list.forEach( function(location){
            const locationElement = getLocationElement(location);
            UI.LOCATIONS.append(locationElement);
        })
    },

    add(location){
        if ( !this.list.includes(location)) {
            this.list.push(location);          
        }
    },

    delete(location){
        const index = this.list.indexOf(location);
        if (index > -1) this.list.splice(index, 1);
    },

    isLike(location){
        const index = this.list.indexOf(location);
        if (index > -1) return true;
        return false;        
    },

    sortList(){
        this.list.sort();
    },
}

function getLocationElement(location){
    const div = document.createElement('div');
    div.classList.add('location', 'locations__item');

    const buttonName = getButtonName(location);
    const buttonClose = getButtonClose(location);
    

    div.append(buttonName);
    div.append(buttonClose);

    return div;
}

function getButtonName(location){
    const button = document.createElement('button');
    button.textContent = location;
    button.addEventListener('click', function(event){
        fetchData(location);
    });
    button.classList.add('location__name', 'text')
    return button;
}

function getButtonClose(location){
    const button = document.createElement('button');
    button.innerHTML  =`<img src="./img/close-icon.svg">`
    button.classList.add('location__close');
    button.addEventListener('click', function(event){
        locations.delete(location);
        locations.redraw();

        if (location === UI.FIRST_TAB.CITY.textContent) like.unfill()
    })
    return button;
}



locations.redraw();

fetchData("Moscow");



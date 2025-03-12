
    const hours = document.querySelectorAll('.hours');
    const minutes = document.querySelectorAll('.minutes');
    const seconds = document.querySelectorAll('.seconds');

    if (document.querySelector('.date') && document.querySelector('.country')) {
        const now = document.querySelector('.date');
        const country = document.querySelector('.country');
    
        const date = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        now.textContent = date.toLocaleDateString(navigator.language, options);
        country.textContent = new Intl.DisplayNames(['en'], { type: 'region' }).of(navigator.language.split('-')[1]);
    }

    if (document.querySelector('.weatherDate')) { 
        const dateElem = document.querySelector('.weatherDate');
        const date = new Date();
        const options = { weekday: 'short', month: 'long', day: 'numeric' };
        dateElem.textContent = date.toLocaleDateString(navigator.language, options);
    }

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
    
        hours.forEach(el => el.textContent = h);
        minutes.forEach(el => el.textContent = m);
        seconds.forEach(el => el.textContent = s);
    }

    setInterval(updateClock, 100);

    updateClock(); 

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    let alerts = document.querySelector('.alertas');

    if(alerts) {
        hideAlerts();
    }

    if(skills){
        skills.addEventListener('click', addSkills);
        selectedSkills();
    }
})

const skills = new Set();

const addSkills = e => {
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else {
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray  = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const selectedSkills = () => {
    const selected = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    selected.forEach( select => {
        skills.add(select.textContent);
    });
    const skillsArray  = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const hideAlerts = () => {
    
    const alerts = document.querySelector('.alertas')

    const interval = setInterval(() => {
        if(alerts.children.length > 0) {
            alerts.removeChild(alerts.children[0]);
        } else if (alerts.children.length === 0){
            alerts.parentElement.removeChild(alerts);
            clearInterval(interval);
        }
    }, 2000);

}
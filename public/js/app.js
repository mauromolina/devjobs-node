import axios from 'axios';
import Swal from 'sweetalert2';

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

    const vacanciesList = document.querySelector('.panel-administracion');
    if(vacanciesList){
        vacanciesList.addEventListener('click', listActions);
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

const listActions = e => {
    e.preventDefault();
    if(e.target.dataset.eliminar){
        Swal.fire({
            title: 'Eliminar vacante?',
            text: "Una vez eliminada no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'No, cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/vacancies/delete/${e.target.dataset.eliminar}`;
                axios.delete(url, {
                    params: {url}
                })
                .then(function(response){
                    if(response.status === 200){
                        Swal.fire(
                            'Perfecto!',
                            response.data,
                            'success'
                            )
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    }    
                })
                .catch( () => {
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar',
                        'error'
                    );
                })
                
            }
          })
    } else {
        if(e.target.href){
            window.location.href = e.target.href;
        }
    }
}
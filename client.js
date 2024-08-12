import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import 'animate.css';


async function main() {
  updateCountDownTime()


  function updateCountDownTime() {
    let epoch_date = localStorage.getItem('time_remaining') || 1723532400
    // create a function that updates  id=personalCounter the epoch_date every second using format DD:HH:MM:SS counts down from 48 hours
    const element = document.getElementById('personalCounter');
    element.innerText = epoch_date
    setInterval(() => {
      // get current time in epoch, subtract from epoch_date 86400 seconds
      epoch_date -= 1
      // localStorage.setItem('time_remaining', epoch_date)

      // get current epoch time
      var time = new Date().getTime() / 1000
      // calculate time remaining
      epoch_date = time - epoch_date

      // formate epoch_date as DD:HH:MM:SS 
      var hours = Math.floor((epoch_date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((epoch_date % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((epoch_date % (1000 * 60)) / 1000);
      element.innerText = `${hours}:${minutes}:${seconds}`
    }, 1000)
  }
}

main()
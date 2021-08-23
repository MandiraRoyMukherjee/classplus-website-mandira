<script>
  document.querySelector('.box1').style.display = 'none'
  document.querySelector('.box2').style.display = 'none'
  document.querySelector('.box3').style.display = 'none'

  function myFunction1() {
    document.getElementById('b1').addEventListener('click', () => {
      document.querySelector('.box1').style.display = 'block'
      document.querySelector('.box2').style.display = 'none'
      document.querySelector('.box3').style.display = 'none'
    })
    var element = document.querySelector(".butt1");
    var element1 = document.querySelector(".butt2");
    var element2 = document.querySelector(".butt3");
    element.classList.remove("bg-white");
    element1.classList.remove("bg-red");
    element2.classList.remove("bg-red");

  }

  function myFunction2() {
    document.getElementById('b2').addEventListener('click', () => {
      document.querySelector('.box1').style.display = 'none'
      document.querySelector('.box2').style.display = 'block'
      document.querySelector('.box3').style.display = 'none'
    })

    var element = document.querySelector(".butt1");
    var element1 = document.querySelector(".butt2");
    var element2 = document.querySelector(".butt3");
    element.classList.add("bg-white");
    element1.classList.add("bg-red");
    element2.classList.remove("bg-red");
  }

  function myFunction3() {
    document.getElementById('b3').addEventListener('click', () => {
      document.querySelector('.box1').style.display = 'none'
      document.querySelector('.box2').style.display = 'none'
      document.querySelector('.box3').style.display = 'block'
    })

    var element = document.querySelector(".butt1");
    var element1 = document.querySelector(".butt2");
    var element2 = document.querySelector(".butt3");
    element.classList.add("bg-white");
    element1.classList.remove("bg-red");
    element2.classList.add("bg-red");
  }
</script>
